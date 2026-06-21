import { useState, useEffect } from 'react';
import { 
  INITIAL_MATCHES, 
  INITIAL_USER_PROFILE 
} from './data/initialData';
import { Match, Prediction, UserProfile, Screen, MatchStatus, GroupStanding } from './types';
import Header from './components/Header';
import BottomNavBar from './components/BottomNavBar';
import MatchCard from './components/MatchCard';
import Leaderboard from './components/Leaderboard';
import MatchDetailBetting from './components/MatchDetailBetting';
import UpdateModal from './components/UpdateModal';
import AdminPanel from './components/AdminPanel';
import GroupsScreen from './components/GroupsScreen';
import ProfileEdit from './components/ProfileEdit';
import AuthScreens from './components/AuthScreens';
import ChatScreen from './components/ChatScreen';
import { Trophy, Compass, Star, Flame, Award, ShieldAlert } from 'lucide-react';

import { supabase } from './lib/supabase';

export const parseDateStr = (dateStr: string) => {
  if (!dateStr) return 0;
  try {
    const dMatch = dateStr.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
    const tMatch = dateStr.match(/(\d{1,2})[:h](\d{2})/);

    if (dMatch && tMatch) {
      const day = parseInt(dMatch[1], 10);
      const month = parseInt(dMatch[2], 10) - 1;
      const year = parseInt(dMatch[3], 10);
      const hour = parseInt(tMatch[1], 10);
      const minute = parseInt(tMatch[2], 10);
      return new Date(year, month, day, hour, minute).getTime();
    }
    return 0;
  } catch (e) {
    return 0;
  }
};

export default function App() {
  // 1. Core Persistent States
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeCompetition, setActiveCompetition] = useState('Copa do Mundo');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [authChecking, setAuthChecking] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [matches, setMatches] = useState<Match[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [allProfiles, setAllProfiles] = useState<any[]>([]);
  const [groupStandings, setGroupStandings] = useState<GroupStanding[]>([]);

  const [authView, setAuthView] = useState<'login' | 'register' | 'recovery'>('login');
  const [currentScreen, setCurrentScreen] = useState<Screen>('tournaments');
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
      if (session?.user) {
        loadUserProfile(session.user.id);
      } else {
        setAuthChecking(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
      if (session?.user) {
        loadUserProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      loadData();
    }
  }, [isLoggedIn]);

  // Automated live match status checker
  useEffect(() => {
    if (!isLoggedIn || matches.length === 0) return;

    const interval = setInterval(() => {
      const now = Date.now();
      matches.forEach(m => {
        if (m.status === 'Aberto') {
          const mTime = parseDateStr(m.dateStr);
          if (mTime > 0 && now >= mTime) {
            supabase.from('matches').update({ status: 'Ao Vivo' }).eq('id', m.id).then(({ error }) => {
              if (!error) loadData();
            });
          }
        }
      });
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [matches, isLoggedIn]);

  useEffect(() => {
    const channel = supabase
      .channel('public:matches:live_score')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'matches' },
        (payload) => {
          const newMatch = payload.new;
          const oldMatch = payload.old;
          
          if (newMatch.status === 'Ao Vivo') {
            // Trigger push notification if score changed
            if (newMatch.score_home !== oldMatch.score_home || newMatch.score_away !== oldMatch.score_away) {
              if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('⚽ GOOOOOL na Resenha!', {
                  body: `${newMatch.team_home} ${newMatch.score_home || 0} x ${newMatch.score_away || 0} ${newMatch.team_away}`,
                  icon: '/boladacopa.png',
                  badge: '/boladacopa.png',
                  tag: `goal-${newMatch.id}`,
                  renotify: true
                });
              }
            }
          }
          
          // Reload matches to reflect UI changes
          loadData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Scroll to next match when on home screen
  useEffect(() => {
    if (currentScreen === 'home' && matches.length > 0) {
      const timer = setTimeout(() => {
        const sortedAsc = [...matches].sort((a, b) => parseDateStr(a.dateStr) - parseDateStr(b.dateStr));
        const nextMatch = sortedAsc.find(m => m.status === 'Aberto');
        if (nextMatch) {
          const el = document.getElementById(`match-card-${nextMatch.id}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
          }
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentScreen, matches.length]);

  const loadUserProfile = async (userId: string) => {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (!error && data) {
      setCurrentUser({
        name: data.name || '',
        email: data.email || '',
        avatar: data.avatar || INITIAL_USER_PROFILE.avatar,
        role: data.role || 'Membro da Resenha',
        totalBets: data.total_bets || 0,
        totalPoints: data.total_points || 0
      });
    }
    setAuthChecking(false);
  };

  const loadData = async () => {
    const [matchesRes, predictionsRes, profilesRes, groupStandingsRes] = await Promise.all([
      supabase.from('matches').select('*'),
      supabase.from('predictions').select(`
        *,
        profiles!inner(email, name, avatar)
      `),
      supabase.from('profiles').select('id, email, name, avatar'),
      supabase.from('group_standings').select('*')
    ]);

    const getFallbackFlag = (team: string) => {
      // Special cases for different names
      if (team === 'Tchéquia' || team === 'República Tcheca') return 'https://avjcjgsosfewukkdsgri.supabase.co/storage/v1/object/public/Bandeiras/Republica%20Tcheca.png';
      if (team === 'Holanda' || team === 'Países Baixos') return 'https://avjcjgsosfewukkdsgri.supabase.co/storage/v1/object/public/Bandeiras/Paises%20Baixos.png';
      if (team === 'Congo DR' || team === 'Congo' || team === 'República Democrática do Congo') return 'https://avjcjgsosfewukkdsgri.supabase.co/storage/v1/object/public/Bandeiras/Congo.png';
      if (team === 'Bósnia e Herzegovina') return 'https://avjcjgsosfewukkdsgri.supabase.co/storage/v1/object/public/Bandeiras/Bosnia.png';

      // Auto-generate for other teams: remove accents and encode URI
      const nameWithoutAccents = team.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      return `https://avjcjgsosfewukkdsgri.supabase.co/storage/v1/object/public/Bandeiras/${encodeURIComponent(nameWithoutAccents)}.png`;
    };

    if (!matchesRes.error && matchesRes.data) {
      setMatches(matchesRes.data.map(m => {
        const teamHome = m.team_home === 'Países Baixos' ? 'Holanda' : m.team_home;
        const teamAway = m.team_away === 'Países Baixos' ? 'Holanda' : m.team_away;
        return {
          id: m.id,
          teamHome: teamHome,
          teamAway: teamAway,
          flagHome: m.flag_home || getFallbackFlag(teamHome),
          flagAway: m.flag_away || getFallbackFlag(teamAway),
          group: m.group,
          dateStr: m.date_str,
          status: m.status,
          scoreHome: m.score_home,
          scoreAway: m.score_away,
          prize: m.prize,
          prizeImage: m.prize_image
        };
      }));
    }

    if (!predictionsRes.error && predictionsRes.data) {
      setPredictions(predictionsRes.data.map(p => ({
        id: p.id,
        matchId: p.match_id,
        userEmail: p.profiles.email,
        userName: p.profiles.name,
        userAvatar: p.profiles.avatar,
        scoreHome: p.score_home,
        scoreAway: p.score_away,
        betValue: p.bet_value,
        pointsCalculated: p.points_calculated,
        createdAt: p.created_at
      })));
    }

    if (!profilesRes.error && profilesRes.data) {
      setAllProfiles(profilesRes.data);
    }

    if (!groupStandingsRes.error && groupStandingsRes.data) {
      setGroupStandings(groupStandingsRes.data);
    }
  };

  // 2. Score Calculation Helpers (5 pts correct score, 3 pts correct outcome)
  const calculatePoints = (exactPred: Prediction, finishedMatch: Match): number => {
    const actH = finishedMatch.scoreHome;
    const actA = finishedMatch.scoreAway;
    const prdH = exactPred.scoreHome;
    const prdA = exactPred.scoreAway;

    if (actH === undefined || actA === undefined) return 0;

    // Exact Score Match
    if (actH === prdH && actA === prdA) {
      return 5;
    }

    // Outcome match (Draw or Winner matches)
    const actOutcome = Math.sign(actH - actA);
    const prdOutcome = Math.sign(prdH - prdA);
    if (actOutcome === prdOutcome) {
      return 3;
    }

    return 0;
  };

  // 3. Dynamic Ranking Computations
  const getComputedLeaderboard = () => {
    // Agrupa todos os usuários que têm palpites
    const ranksMap: Record<string, { id: string; name: string; email: string; avatar?: string; points: number; predictionsCount: number }> = {};

    // Adiciona TODOS os perfis cadastrados no sistema com 0 pontos por padrão
    allProfiles.forEach(profile => {
      ranksMap[profile.email] = {
        id: profile.email,
        name: profile.name || 'Sem Nome',
        email: profile.email,
        avatar: profile.avatar || '',
        points: 0,
        predictionsCount: 0
      };
    });

    // Garante que o usuário atual também esteja na lista (mesmo antes de atualizar do Supabase)
    if (currentUser.email && !ranksMap[currentUser.email]) {
      ranksMap[currentUser.email] = {
        id: currentUser.email,
        name: currentUser.name || 'Eu',
        email: currentUser.email,
        avatar: currentUser.avatar || '',
        points: 0,
        predictionsCount: 0
      };
    }

    predictions.forEach(pred => {
      const email = pred.userEmail;
      if (!email) return;

      if (!ranksMap[email]) {
        ranksMap[email] = {
          id: email,
          name: pred.userName || 'Usuário',
          email: email,
          avatar: pred.userAvatar || '',
          points: 0,
          predictionsCount: 0
        };
      }
      
      ranksMap[email].predictionsCount += 1;

      const correspondingMatch = matches.find(m => m.id === pred.matchId);
      if (correspondingMatch && correspondingMatch.status === 'Finalizado') {
        ranksMap[email].points += calculatePoints(pred, correspondingMatch);
      }
    });

    return Object.values(ranksMap).sort((a, b) => b.points - a.points || b.predictionsCount - a.predictionsCount);
  };

  const computedRanking = getComputedLeaderboard();

  // Update current user points on the fly for profile stats
  const activeUserPoints = computedRanking.find(r => r.email === currentUser.email)?.points || currentUser.totalPoints;

  // 4. Action Callback Handlers
  const handleLoginSuccess = async (name: string, email: string) => {
    setIsLoggedIn(true);
    setCurrentScreen('home');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setAuthView('login');
  };

  const handleUpdateProfile = async (name: string, email: string, avatar: string) => {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) return;
    
    await supabase.from('profiles').update({ name, avatar }).eq('id', session.session.user.id);
    setCurrentUser(prev => ({ ...prev, name, email, avatar }));
  };

  const handleAddPrediction = async (rawPred: Omit<Prediction, 'id' | 'createdAt'>) => {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) return;

    const { data, error } = await supabase.from('predictions').upsert({
      match_id: rawPred.matchId,
      user_id: session.session.user.id,
      score_home: rawPred.scoreHome,
      score_away: rawPred.scoreAway
    }, { onConflict: 'match_id, user_id' }).select().single();

    if (!error) {
      loadData(); // recarrega para ter os joins corretos
    }
  };

  const handleAddMatch = async (rawMatch: Omit<Match, 'id'>) => {
    const { error } = await supabase.from('matches').insert({
      team_home: rawMatch.teamHome,
      team_away: rawMatch.teamAway,
      flag_home: rawMatch.flagHome,
      flag_away: rawMatch.flagAway,
      group: rawMatch.group,
      date_str: rawMatch.dateStr,
      status: rawMatch.status,
      prize: rawMatch.prize,
      prize_image: rawMatch.prizeImage
    });
    if (!error) loadData();
  };

  const handleEditMatch = async (matchId: string, updatedMatch: Omit<Match, 'id'>) => {
    const { error } = await supabase.from('matches').update({
      team_home: updatedMatch.teamHome,
      team_away: updatedMatch.teamAway,
      flag_home: updatedMatch.flagHome,
      flag_away: updatedMatch.flagAway,
      group: updatedMatch.group,
      date_str: updatedMatch.dateStr,
      status: updatedMatch.status,
      prize: updatedMatch.prize,
      prize_image: updatedMatch.prizeImage
    }).eq('id', matchId);
    if (!error) loadData();
  };

  const handleUpdateMatchStatus = async (matchId: string, status: MatchStatus) => {
    const { error } = await supabase.from('matches').update({ status }).eq('id', matchId);
    if (!error) {
      loadData();
    }
  };

  const handleUpdateLiveScore = async (matchId: string, scoreHome: number, scoreAway: number) => {
    const { error } = await supabase.from('matches').update({
      score_home: scoreHome,
      score_away: scoreAway,
      status: 'Ao Vivo'
    }).eq('id', matchId);

    if (!error) {
      loadData();
    }
  };

  const handleLaunchResults = async (matchId: string, scoreHome: number, scoreAway: number) => {
    await supabase.from('matches').update({ status: 'Finalizado', score_home: scoreHome, score_away: scoreAway }).eq('id', matchId);
    loadData();
  };

  const handleDeletePrediction = async (predictionId: string) => {
    await supabase.from('predictions').delete().eq('id', predictionId);
    loadData();
  };

  // Navigations back helper
  const handleBack = () => {
    if (currentScreen === 'match-details') {
      setCurrentScreen('home');
      setSelectedMatchId(null);
    } else if (currentScreen === 'home') {
      setCurrentScreen('tournaments');
    } else {
      setCurrentScreen('profile');
    }
  };

  // Routing render screen chooser
  const renderScreen = () => {
    switch (currentScreen) {
      case 'tournaments':
        return (
          <div className="flex flex-col gap-4 animate-fade-in w-full pb-6">
            <div className="mb-2">
              <h2 className="font-poppins font-black text-2xl md:text-4xl text-[#191c1e] tracking-tight">
                Escolha seu <span className="text-[#006b2c]">Bolão</span>
              </h2>
              <p className="font-sans text-[#6e7b6c] mt-1 text-sm md:text-base max-w-xl leading-snug">
                Participe dos maiores torneios de futebol e prove que você é o melhor nas previsões.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {/* Copa do Mundo - Active */}
              <button 
                onClick={() => {
                  setActiveCompetition('Copa do Mundo');
                  setCurrentScreen('home');
                }}
                className="relative overflow-hidden bg-[#006b2c] p-4 md:p-5 rounded-2xl md:rounded-3xl text-left transition-all active:scale-95 shadow-[0_8px_20px_-8px_rgba(0,107,44,0.4)] hover:shadow-[0_12px_25px_-8px_rgba(0,107,44,0.5)] cursor-pointer group flex flex-col justify-between aspect-square"
              >
                <img 
                  src="https://avjcjgsosfewukkdsgri.supabase.co/storage/v1/object/public/Campeonatos/copa.webp" 
                  alt="Copa do Mundo" 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 z-0" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 z-0 pointer-events-none"></div>

                <div className="relative z-10 flex justify-end w-full">
                  <div className="bg-white/20 backdrop-blur-md border border-white/20 text-white text-[9px] md:text-xs font-bold px-2 py-1 md:px-3 md:py-1.5 rounded-full flex items-center gap-1 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#fed01b] animate-pulse"></span>
                    Ativo
                  </div>
                </div>
                <div className="relative z-10 mt-auto">
                  <h3 className="font-poppins font-black text-white text-lg md:text-2xl leading-tight md:leading-tight drop-shadow-md">Copa do<br/>Mundo</h3>
                  <p className="font-sans text-white/90 text-[10px] md:text-sm font-medium mt-0.5 md:mt-1 drop-shadow-md">América do Norte 2026</p>
                </div>
              </button>

              {/* Brasileirão - Coming Soon */}
              <button 
                className="relative overflow-hidden bg-[#191c1e] p-4 md:p-5 rounded-2xl md:rounded-3xl text-left opacity-90 cursor-default flex flex-col justify-between aspect-square shadow-sm"
              >
                <img 
                  src="https://avjcjgsosfewukkdsgri.supabase.co/storage/v1/object/public/Campeonatos/brasileiro.png" 
                  alt="Brasileirão" 
                  className="absolute inset-0 w-full h-full object-cover opacity-50 grayscale mix-blend-luminosity z-0" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30 z-0 pointer-events-none"></div>

                <div className="relative z-10 flex justify-end w-full">
                  <div className="bg-black/40 backdrop-blur-md border border-white/10 text-white/70 text-[9px] md:text-xs font-bold px-2 py-1 md:px-3 md:py-1.5 rounded-full shadow-sm">
                    Em Breve
                  </div>
                </div>
                <div className="relative z-10 mt-auto">
                  <h3 className="font-poppins font-black text-white/60 text-lg md:text-2xl leading-tight md:leading-tight drop-shadow-md">Brasileirão</h3>
                  <p className="font-sans text-white/40 text-[10px] md:text-sm font-medium mt-0.5 md:mt-1 drop-shadow-md">Série A</p>
                </div>
              </button>

              {/* Libertadores - Coming Soon */}
              <button 
                className="relative overflow-hidden bg-[#191c1e] p-4 md:p-5 rounded-2xl md:rounded-3xl text-left opacity-90 cursor-default flex flex-col justify-between aspect-square shadow-sm"
              >
                <img 
                  src="https://avjcjgsosfewukkdsgri.supabase.co/storage/v1/object/public/Campeonatos/Libertadores.png" 
                  alt="Libertadores" 
                  className="absolute inset-0 w-full h-full object-cover opacity-50 grayscale mix-blend-luminosity z-0" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30 z-0 pointer-events-none"></div>

                <div className="relative z-10 flex justify-end w-full">
                  <div className="bg-black/40 backdrop-blur-md border border-white/10 text-white/70 text-[9px] md:text-xs font-bold px-2 py-1 md:px-3 md:py-1.5 rounded-full shadow-sm">
                    Em Breve
                  </div>
                </div>
                <div className="relative z-10 mt-auto">
                  <h3 className="font-poppins font-black text-white/60 text-lg md:text-2xl leading-tight md:leading-tight drop-shadow-md">Libertadores</h3>
                  <p className="font-sans text-white/40 text-[10px] md:text-sm font-medium mt-0.5 md:mt-1 drop-shadow-md">América do Sul</p>
                </div>
              </button>

              {/* Champions - Coming Soon */}
              <button 
                className="relative overflow-hidden bg-white border border-[#eceef0] p-4 md:p-5 rounded-2xl md:rounded-3xl text-left opacity-90 cursor-default flex flex-col justify-between aspect-square shadow-sm"
              >
                <div className="relative z-10 flex justify-between items-start w-full grayscale-[0.3]">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-[#f7f9fb] rounded-xl md:rounded-2xl flex items-center justify-center border border-[#eceef0]">
                    <span className="text-xl md:text-2xl">⭐</span>
                  </div>
                  <div className="bg-[#f2f4f6] text-[#6e7b6c] text-[9px] md:text-xs font-bold px-2 py-1 md:px-3 md:py-1.5 rounded-full">
                    Em Breve
                  </div>
                </div>
                <div className="relative z-10 grayscale-[0.3]">
                  <h3 className="font-poppins font-black text-[#191c1e] text-lg md:text-2xl leading-tight md:leading-tight">Champions</h3>
                  <p className="font-sans text-[#6e7b6c] text-[10px] md:text-sm font-medium mt-0.5 md:mt-1">Europa</p>
                </div>
              </button>
            </div>
          </div>
        );

      case 'home':
        const allSortedMatches = [...matches].sort((a, b) => parseDateStr(a.dateStr) - parseDateStr(b.dateStr));
        const liveMatches = allSortedMatches.filter(m => m.status === 'Ao Vivo');
        const scheduledMatches = allSortedMatches.filter(m => m.status !== 'Ao Vivo');
        
        return (
          <div className="flex flex-col gap-6 animate-fade-in">
            {liveMatches.length > 0 && (
              <section className="flex flex-col items-center justify-center w-full mt-1 mb-2">
                <div className="w-full max-w-md animate-fade-in relative z-20">
                  <h3 className="text-center font-poppins font-bold text-[#e01424] mb-3 uppercase tracking-wider text-sm flex items-center justify-center gap-2 bg-[#ff2b3d]/10 py-1.5 px-4 rounded-full border border-[#ff4a5a]/20 w-max mx-auto shadow-sm">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#e01424] animate-pulse"></span>
                    Partida Ao Vivo
                  </h3>
                  <div className="flex flex-col gap-4 px-4 md:px-0">
                    {liveMatches.map((m) => (
                      <MatchCard 
                        key={m.id}
                        match={m}
                        predictions={predictions}
                        currentUserEmail={currentUser.email}
                        onSelect={(mid) => {
                          setSelectedMatchId(mid);
                          setCurrentScreen('match-details');
                        }}
                      />
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* High Contrast Banner Welcome Section */}
            <section className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#006b2c] to-[#00873a] p-6 md:p-10 shadow-[0_10px_30px_rgba(15,23,42,0.08)] text-white">
              <div 
                className="absolute inset-0 opacity-10 pointer-events-none" 
                style={{
                  backgroundImage: 'radial-gradient(circle at 2px 2px, white 1.5px, transparent 0)',
                  backgroundSize: '24px 24px'
                }}
              ></div>
              <div className="relative z-10 max-w-2xl select-none">
                <h2 className="font-poppins font-bold text-2xl md:text-4xl text-white tracking-tight leading-tight">
                  Bem-vindo à resenha!
                </h2>
                <p className="font-sans text-sm md:text-base text-white/95 mt-2">
                  O bolão oficial dos amigos para torcer, palpitar e zoar a galera com muita resenha.
                </p>
                <div className="mt-6 flex gap-3 flex-wrap">
                  <button 
                    onClick={() => {
                      const firstOpen = allSortedMatches.find(m => m.status === 'Aberto');
                      if (firstOpen) {
                        setSelectedMatchId(firstOpen.id);
                        setCurrentScreen('match-details');
                      }
                    }}
                    className="bg-[#fed01b] hover:bg-[#ffe083] text-[#231b00] font-sans text-xs font-bold px-5 py-3 rounded-full shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Flame className="w-4 h-4 fill-[#fed01b] stroke-[#735c00]" />
                    <span>Fazer Palpites</span>
                  </button>
                  <button 
                    onClick={() => setCurrentScreen('ranking')}
                    className="bg-white/20 backdrop-blur-sm text-white border border-white/30 font-sans text-xs font-bold px-5 py-3 rounded-full hover:bg-white/35 transition-all active:scale-95 cursor-pointer"
                  >
                    Ver Ranking
                  </button>
                </div>
              </div>
            </section>

            {/* List block */}
            <section className="flex flex-col gap-4">
              <div className="flex items-center justify-between px-1">
                <h3 className="font-poppins font-bold text-[#191c1e] text-base md:text-lg flex items-center gap-1.5 select-none">
                  <Star className="w-4 h-4 text-[#fed01b] fill-[#fed01b]" />
                  <span>Jogos da Rodada</span>
                </h3>
                <span className="text-[#3e4a3d] font-sans text-xs font-semibold">
                  {matches.length} {matches.length === 1 ? 'jogo cadastrado' : 'jogos cadastrados'}
                </span>
              </div>

              {/* Horizontal scroll container on mobile, fits beautiful card list */}
              <div className="flex md:grid md:grid-cols-2 gap-4 overflow-x-auto no-scrollbar py-2 shrink-0 snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0 scroll-smooth">
                {allSortedMatches.map((match) => (
                  <MatchCard 
                    key={match.id}
                    match={match}
                    predictions={predictions}
                    currentUserEmail={currentUser.email}
                    onSelect={(mid) => {
                      setSelectedMatchId(mid);
                      setCurrentScreen('match-details');
                    }}
                  />
                ))}
              </div>
            </section>
          </div>
        );

      case 'match-details':
        const activeMatch = matches.find(m => m.id === selectedMatchId);
        if (!activeMatch) return <p className="text-center">Jogo não encontrado.</p>;
        return (
          <MatchDetailBetting 
            match={activeMatch}
            predictions={predictions}
            currentUser={currentUser}
            onAddPrediction={handleAddPrediction}
          />
        );

      case 'chat':
        return <ChatScreen currentUser={currentUser} />;

      case 'ranking':
        return (
          <Leaderboard 
            rankingData={computedRanking}
            currentUser={currentUser}
          />
        );

      case 'admin':
        return (
          <AdminPanel 
            matches={matches}
            predictions={predictions}
            onAddMatch={handleAddMatch}
            onEditMatch={handleEditMatch}
            onUpdateMatchStatus={handleUpdateMatchStatus}
            onUpdateLiveScore={handleUpdateLiveScore}
            onLaunchResults={handleLaunchResults}
            onDeletePrediction={handleDeletePrediction}
          />
        );

      case 'groups':
        return <GroupsScreen matches={matches} groupStandings={groupStandings} />;

      case 'profile':
        return (
          <ProfileEdit 
            currentUser={{
              ...currentUser,
              totalPoints: activeUserPoints,
              totalBets: currentUser.totalBets // base stats
            }}
            matches={matches}
            predictions={predictions}
            onUpdateProfile={handleUpdateProfile}
            onLogout={handleLogout}
            onNavigate={(scr) => {
              setCurrentScreen(scr);
            }}
          />
        );

      default:
        return null;
    }
  };

  // 5. Auth-Screen wrapper otherwise
  if (authChecking) {
    return <div className="min-h-screen bg-[#f7f9fb] flex items-center justify-center">Carregando...</div>;
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#f7f9fb] flex flex-col justify-center items-center">
        <AuthScreens 
          currentView={authView}
          onChangeView={(view) => setAuthView(view)}
          onLoginSuccess={handleLoginSuccess}
        />
      </div>
    );
  }

  // 6. Complete Inner Application Layout with Headers and Menus
  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] min-h-screen font-sans antialiased flex flex-col pb-28 md:pb-8">
      {/* Premium Sticky Top Header Context */}
      <Header 
        currentScreen={currentScreen}
        onNavigate={(screen) => setCurrentScreen(screen)}
        onBack={handleBack}
        userAvatar={currentUser.avatar}
        isAdmin={currentUser.role === 'Admin da Resenha' || currentUser.role === 'Admin da Família'}
        activeCompetition={activeCompetition}
        onSelectCompetition={setActiveCompetition}
      />

      <UpdateModal />

      {/* Main Content Viewport */}
      <main className="flex-grow pt-24 md:pt-32 px-4 md:px-10 max-w-7xl mx-auto w-full transition-all">
        {activeCompetition !== 'Copa do Mundo' ? (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center animate-fade-in">
            <div className="w-20 h-20 bg-[#eceef0] rounded-full flex items-center justify-center mb-6 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-[#8e9894]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h2 className="font-poppins font-bold text-2xl text-[#191c1e] mb-2">{activeCompetition}</h2>
            <p className="text-[#6e7b6c] max-w-md font-sans">
              Esta área está atualmente em construção. Em breve você poderá fazer seus palpites e resenhar sobre o {activeCompetition}!
            </p>
          </div>
        ) : (
          renderScreen()
        )}
      </main>

      {/* Responsive Sticky bottom menu navigation for hand-held viewports */}
      <BottomNavBar 
        currentScreen={currentScreen}
        onNavigate={(screen) => setCurrentScreen(screen)}
        isAdmin={currentUser.role === 'Admin da Resenha' || currentUser.role === 'Admin da Família'}
      />
    </div>
  );
}
