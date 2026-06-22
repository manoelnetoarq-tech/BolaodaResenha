import { User, ArrowLeft } from 'lucide-react';
import { Screen } from '../types';

interface HeaderProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  onBack?: () => void;
  userAvatar: string;
  isAdmin?: boolean;
  activeCompetition?: string;
  onSelectCompetition?: (comp: string) => void;
}

export default function Header({ currentScreen, onNavigate, onBack, userAvatar, isAdmin, activeCompetition = 'Copa do Mundo', onSelectCompetition }: HeaderProps) {
  const hasBack = ['match-details', 'edit-profile', 'change-password'].includes(currentScreen);
  const isHubContext = currentScreen === 'tournaments' || currentScreen === 'hub-chat';

  const getTitle = () => {
    switch (currentScreen) {
      case 'match-details':
        return 'Palpite do Jogo';
      case 'edit-profile':
        return 'Editar Perfil';
      case 'change-password':
        return 'Alterar Senha';
      case 'admin':
        return 'Área do Admin';
      case 'chat':
        return 'Bate-Papo da Resenha';
      case 'ranking':
        return 'Ranking da Resenha';
      case 'groups':
        return 'Grupos';
      case 'profile':
        return 'Meu Perfil';
      case 'home':
        return activeCompetition;
      default:
        return "Bolão da Resenha";
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#f7f9fb] shadow-[0_10px_30px_rgba(15,23,42,0.06)] flex flex-col transition-all">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-10 flex items-center justify-between h-20 md:h-24 relative">
        <div className="flex items-center gap-3 relative z-10 w-1/3">
          {currentScreen !== 'tournaments' && (
            <button
              onClick={() => {
                if (hasBack && onBack) {
                  onBack();
                } else if (currentScreen === 'chat') {
                  onNavigate('home');
                } else {
                  onNavigate('tournaments');
                }
              }}
              aria-label="Voltar"
              className="p-2 -ml-2 rounded-full text-[#006b2c] hover:bg-[#eceef0] active:scale-95 transition-all cursor-pointer flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          )}

          {!hasBack && !isHubContext && (
            <span className="hidden lg:inline font-poppins font-medium text-lg text-[#191c1e] border-l-2 border-[#bdcaba] pl-4">
              {getTitle()}
            </span>
          )}
        </div>

        {/* Absolute Centered Logo */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <div 
            onClick={() => onNavigate('tournaments')} 
            className="flex items-center gap-2 md:gap-3 cursor-pointer active:scale-98 transition-transform pointer-events-auto"
          >
            <img 
              src="/Logo.png" 
              alt="Selman's Bet Logo" 
              className={`w-auto object-contain transition-all ${
                isHubContext ? 'h-12 md:h-16' : 'h-8 md:h-12'
              }`}
              referrerPolicy="no-referrer"
            />
            {!isHubContext && (
              <span className="font-poppins font-bold text-[#191c1e] text-base md:text-xl tracking-tight hidden sm:inline-block whitespace-nowrap">
                Bolão da Resenha
              </span>
            )}
          </div>
        </div>

        {/* Right side container to balance flex and prevent overlapping */}
        <div className="flex items-center justify-end gap-3 relative z-10 w-1/3">
          {!isHubContext && (
            <>
              <nav className="hidden md:flex items-center gap-8">
                <button
                  onClick={() => onNavigate('home')}
                  className={`font-sans text-sm font-semibold px-1 py-1 transition-all hover:text-[#006b2c] cursor-pointer ${
                    currentScreen === 'home' || currentScreen === 'match-details'
                      ? 'text-[#006b2c] border-b-2 border-[#006b2c]'
                      : 'text-[#3e4a3d]'
                  }`}
                >
                  Início
                </button>
                <button
                  onClick={() => onNavigate('ranking')}
                  className={`font-sans text-sm font-semibold px-1 py-1 transition-all hover:text-[#006b2c] cursor-pointer ${
                    currentScreen === 'ranking'
                      ? 'text-[#006b2c] border-b-2 border-[#006b2c]'
                      : 'text-[#3e4a3d]'
                  }`}
                >
                  Ranking
                </button>
                <button
                  onClick={() => onNavigate('groups')}
                  className={`font-sans text-sm font-semibold px-1 py-1 transition-all hover:text-[#006b2c] cursor-pointer ${
                    currentScreen === 'groups'
                      ? 'text-[#006b2c] border-b-2 border-[#006b2c]'
                      : 'text-[#3e4a3d]'
                  }`}
                >
                  Grupos
                </button>
                <button
                  onClick={() => onNavigate('chat')}
                  className={`font-sans text-sm font-semibold px-1 py-1 transition-all hover:text-[#006b2c] cursor-pointer ${
                    currentScreen === 'chat'
                      ? 'text-[#006b2c] border-b-2 border-[#006b2c]'
                      : 'text-[#3e4a3d]'
                  }`}
                >
                  Resenha
                </button>
                {isAdmin && (
                  <button
                    onClick={() => onNavigate('admin')}
                    className={`font-sans text-sm font-semibold px-1 py-1 transition-all hover:text-[#006b2c] cursor-pointer ${
                      currentScreen === 'admin'
                        ? 'text-[#006b2c] border-b-2 border-[#006b2c]'
                        : 'text-[#3e4a3d]'
                    }`}
                  >
                    Admin
                  </button>
                )}
              </nav>

              {/* Profile trigger */}
              <button
                onClick={() => onNavigate('profile')}
                aria-label="Perfil do usuário"
                className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-transparent hover:border-[#006b2c] overflow-hidden flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer bg-[#eceef0]"
              >
                {userAvatar ? (
                  <img 
                    src={userAvatar} 
                    alt="Avatar" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <User className="w-5 h-5 text-[#3e4a3d]" />
                )}
              </button>
            </>
          )}
          
          {/* WhatsApp Link - Right aligned */}
          <a
            href="https://chat.whatsapp.com/KTMZDaPpFuEH1V8OGXXyqd"
            target="_blank"
            rel="noopener noreferrer"
            className="pointer-events-auto flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
            title="Entrar no Grupo do WhatsApp"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 md:w-8 md:h-8 text-[#25D366] drop-shadow-sm" fill="currentColor" viewBox="0 0 16 16">
              <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}
