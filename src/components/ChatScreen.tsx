import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { ChatMessage, UserProfile } from '../types';
import { Send, MessageSquare, CornerUpLeft, X } from 'lucide-react';

interface ChatScreenProps {
  currentUser: UserProfile;
}

export default function ChatScreen({ currentUser }: ChatScreenProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUserId = useRef<string | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const initChat = async () => {
      // Get current user ID
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData?.session?.user) {
        currentUserId.current = sessionData.session.user.id;
      }

      // Fetch initial messages
      const { data, error } = await supabase
        .from('chat_messages')
        .select(`
          id,
          user_id,
          content,
          created_at,
          reply_to_id,
          profiles:user_id (name, avatar, email)
        `)
        .order('created_at', { ascending: true })
        .limit(50);

      if (!error && data) {
        setMessages(data.map(m => {
          let replyToMessage;
          if (m.reply_to_id) {
            const parent = data.find(d => d.id === m.reply_to_id);
            if (parent) {
              const parentProfile = Array.isArray(parent.profiles) ? parent.profiles[0] : parent.profiles;
              replyToMessage = {
                id: parent.id,
                content: parent.content,
                profiles: parentProfile ? { name: parentProfile.name } : undefined
              };
            }
          }

          return {
            id: m.id,
            userId: m.user_id,
            content: m.content,
            createdAt: m.created_at,
            replyToId: m.reply_to_id,
            replyToMessage,
            profiles: Array.isArray(m.profiles) ? m.profiles[0] : m.profiles
          };
        }) as ChatMessage[]);
      }
      setLoading(false);
      setTimeout(scrollToBottom, 100);

      // Subscribe to real-time changes
      const channel = supabase
        .channel('public:chat_messages')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'chat_messages' },
          async (payload) => {
            const newMsgRow = payload.new;
            // Need to fetch the profile for this new message
            const { data: profileData } = await supabase
              .from('profiles')
              .select('name, avatar, email')
              .eq('id', newMsgRow.user_id)
              .single();

            // Need to fetch parent message info if reply
            let replyToMessage;
            if (newMsgRow.reply_to_id) {
              const { data: parentData } = await supabase
                .from('chat_messages')
                .select('content, profiles:user_id(name)')
                .eq('id', newMsgRow.reply_to_id)
                .single();
                
              if (parentData) {
                const parentProfile = Array.isArray(parentData.profiles) ? parentData.profiles[0] : parentData.profiles;
                replyToMessage = {
                  id: newMsgRow.reply_to_id,
                  content: parentData.content,
                  profiles: parentProfile ? { name: parentProfile.name } : undefined
                };
              }
            }

            const newMsg: ChatMessage = {
              id: newMsgRow.id,
              userId: newMsgRow.user_id,
              content: newMsgRow.content,
              createdAt: newMsgRow.created_at,
              replyToId: newMsgRow.reply_to_id,
              replyToMessage,
              profiles: profileData
            };

            setMessages(prev => {
              // Prevent duplicates if we already added it optimistically
              if (prev.find(m => m.id === newMsg.id)) return prev;
              return [...prev, newMsg];
            });
            setTimeout(scrollToBottom, 100);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };

    initChat();
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUserId.current) return;

    const content = newMessage.trim();
    const replyId = replyingTo?.id || null;
    
    setNewMessage('');
    setReplyingTo(null);

    // Send to Supabase
    await supabase.from('chat_messages').insert({
      user_id: currentUserId.current,
      content: content,
      reply_to_id: replyId
    });
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full pt-20">Carregando resenha...</div>;
  }

  return (
    <div className="flex flex-col fixed top-[80px] bottom-[90px] left-0 right-0 md:relative md:top-auto md:bottom-auto md:left-auto md:right-auto md:h-[calc(100vh-180px)] bg-[#f2f4f6] md:rounded-2xl overflow-hidden shadow-sm z-10">
      {/* Mensagens list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-[#8e9894] space-y-3">
            <MessageSquare className="w-12 h-12 stroke-[1.5]" />
            <p className="font-sans text-sm text-center">Nenhuma mensagem ainda.<br/>Seja o primeiro a mandar a resenha!</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.profiles?.email === currentUser.email;
            const showAvatar = !isMe && (index === 0 || messages[index - 1].userId !== msg.userId);

            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} w-full`}>
                {!isMe && (
                  <div className="w-8 h-8 rounded-full overflow-hidden mr-2 shrink-0 self-end mb-1">
                    {showAvatar && msg.profiles?.avatar ? (
                      <img src={msg.profiles.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      showAvatar && <div className="w-full h-full bg-[#bdcaba] rounded-full" />
                    )}
                  </div>
                )}
                
                <div className={`flex flex-col max-w-[75%] ${isMe ? 'items-end' : 'items-start'}`}>
                  {showAvatar && !isMe && (
                    <span className="text-[10px] text-[#8e9894] ml-1 mb-0.5 font-medium">{msg.profiles?.name}</span>
                  )}
                  
                  <div className={`relative px-4 py-2 rounded-2xl shadow-sm ${
                    isMe 
                      ? 'bg-[#006b2c] text-white rounded-br-sm' 
                      : 'bg-white text-[#191c1e] rounded-bl-sm border border-[#eceef0]'
                  }`}>
                    {/* Bloco de Citação se for resposta */}
                    {msg.replyToId && (
                      <div className={`mb-2 p-2 rounded-lg text-sm border-l-4 opacity-90 ${
                        isMe ? 'bg-[#005222] border-[#fed01b] text-[#e2f1e6]' : 'bg-[#f7f9fb] border-[#006b2c] text-[#3e4a3d]'
                      }`}>
                        <span className="font-bold block text-[10px] opacity-80 mb-0.5">
                          {msg.replyToMessage?.profiles?.name || 'Mensagem original'}
                        </span>
                        <span className="line-clamp-2 leading-tight text-xs">
                          {msg.replyToMessage?.content || '...'}
                        </span>
                      </div>
                    )}

                    <p className="font-sans text-sm md:text-base whitespace-pre-wrap break-words">{msg.content}</p>
                    
                    <div className={`flex items-center justify-end gap-2 mt-1 ${isMe ? 'text-[#e2f1e6]/80' : 'text-[#8e9894]'}`}>
                      <span className="text-[9px]">{formatTime(msg.createdAt)}</span>
                      <button 
                        onClick={() => setReplyingTo(msg)}
                        className="opacity-50 hover:opacity-100 transition-opacity p-0.5 hover:bg-black/10 rounded cursor-pointer"
                        aria-label="Responder"
                      >
                        <CornerUpLeft className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="bg-white border-t border-[#eceef0] shrink-0 flex flex-col">
        {replyingTo && (
          <div className="px-4 py-2 bg-[#f7f9fb] border-b border-[#eceef0] flex items-center justify-between">
            <div className="flex flex-col border-l-4 border-[#006b2c] pl-2 overflow-hidden w-full">
              <span className="font-bold text-[#006b2c] text-xs">
                Respondendo a {replyingTo.profiles?.name || 'usuário'}
              </span>
              <span className="text-[#3e4a3d] text-sm truncate pr-4">
                {replyingTo.content}
              </span>
            </div>
            <button onClick={() => setReplyingTo(null)} className="p-2 text-[#8e9894] hover:text-[#191c1e] shrink-0 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        <form onSubmit={handleSendMessage} className="flex gap-2 items-end p-3 md:p-4">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
            placeholder="Manda a resenha..."
            className="flex-1 bg-[#f2f4f6] text-sm md:text-base text-[#191c1e] rounded-2xl px-4 py-3 border border-transparent focus:bg-white focus:border-[#006b2c] focus:ring-2 focus:ring-[#006b2c]/10 transition-all outline-none resize-none max-h-32 min-h-[44px]"
            rows={1}
            style={{ height: 'auto' }}
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="w-11 h-11 rounded-full bg-[#fed01b] flex items-center justify-center shrink-0 text-[#6f5900] shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            <Send className="w-5 h-5 -ml-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
