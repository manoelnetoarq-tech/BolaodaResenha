import { Home, Trophy, Settings } from 'lucide-react';
import { Screen } from '../types';

interface BottomNavBarProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  isAdmin?: boolean;
}

export default function BottomNavBar({ currentScreen, onNavigate, isAdmin }: BottomNavBarProps) {
  const isInicioActive = ['home', 'match-details'].includes(currentScreen);
  const isRankingActive = currentScreen === 'ranking';
  const isAdminActive = currentScreen === 'admin';

  const tabsCount = isAdmin ? 3 : 2;
  const activeIndex = isInicioActive ? 0 : isRankingActive ? 1 : isAdminActive ? 2 : 0;
  const indicatorLeft = `calc((100% / ${tabsCount}) * ${activeIndex} + (100% / ${tabsCount * 2}))`;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex h-[72px] pb-[env(safe-area-inset-bottom,0px)] bg-white rounded-t-3xl shadow-[0_-10px_25px_rgba(0,0,0,0.06)]">
      {/* Sliding Cutout Hole (Barriga) */}
      <div 
        className="magic-hole"
        style={{ 
          left: indicatorLeft, 
          transform: 'translateX(-50%)' 
        }}
      ></div>

      {/* Tab: Início */}
      <button
        onClick={() => onNavigate('home')}
        className="relative flex-1 flex flex-col items-center justify-center h-full z-20"
      >
        <div className={`transition-all duration-300 flex items-center justify-center rounded-full ${isInicioActive ? 'absolute -top-[16px] w-14 h-14 bg-gradient-to-tr from-[#005320] to-[#00873a] text-white shadow-[0_8px_16px_rgba(0,107,44,0.4)]' : 'w-12 h-12 text-[#bdcaba]'}`}>
          <Home className={`w-6 h-6 transition-transform duration-300 ${isInicioActive ? 'scale-110' : ''}`} />
        </div>
      </button>

      {/* Tab: Ranking */}
      <button
        onClick={() => onNavigate('ranking')}
        className="relative flex-1 flex flex-col items-center justify-center h-full z-20"
      >
        <div className={`transition-all duration-300 flex items-center justify-center rounded-full ${isRankingActive ? 'absolute -top-[16px] w-14 h-14 bg-gradient-to-tr from-[#005320] to-[#00873a] text-white shadow-[0_8px_16px_rgba(0,107,44,0.4)]' : 'w-12 h-12 text-[#bdcaba]'}`}>
          <Trophy className={`w-6 h-6 transition-transform duration-300 ${isRankingActive ? 'scale-110' : ''}`} />
        </div>
      </button>

      {/* Tab: Admin */}
      {isAdmin && (
        <button
          onClick={() => onNavigate('admin')}
          className="relative flex-1 flex flex-col items-center justify-center h-full z-20"
        >
          <div className={`transition-all duration-300 flex items-center justify-center rounded-full ${isAdminActive ? 'absolute -top-[16px] w-14 h-14 bg-gradient-to-tr from-[#005320] to-[#00873a] text-white shadow-[0_8px_16px_rgba(0,107,44,0.4)]' : 'w-12 h-12 text-[#bdcaba]'}`}>
            <Settings className={`w-6 h-6 transition-transform duration-300 ${isAdminActive ? 'scale-110' : ''}`} />
          </div>
        </button>
      )}
    </nav>
  );
}
