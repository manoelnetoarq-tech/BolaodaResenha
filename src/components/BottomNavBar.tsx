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

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-[72px] pb-[env(safe-area-inset-bottom,0px)] bg-white rounded-t-3xl shadow-[0_-10px_25px_rgba(15,23,42,0.06)]">
      {/* Tab: Início */}
      <button
        onClick={() => onNavigate('home')}
        className="relative flex flex-col items-center justify-center w-full h-full"
      >
        <div className={`transition-all duration-300 flex items-center justify-center ${isInicioActive ? 'magic-indicator bg-[#006b2c] text-white' : 'w-12 h-12 text-[#bdcaba]'}`}>
          <Home className={`w-6 h-6 transition-transform duration-300 ${isInicioActive ? 'scale-110' : ''}`} />
        </div>
      </button>

      {/* Tab: Ranking */}
      <button
        onClick={() => onNavigate('ranking')}
        className="relative flex flex-col items-center justify-center w-full h-full"
      >
        <div className={`transition-all duration-300 flex items-center justify-center ${isRankingActive ? 'magic-indicator bg-[#006b2c] text-white' : 'w-12 h-12 text-[#bdcaba]'}`}>
          <Trophy className={`w-6 h-6 transition-transform duration-300 ${isRankingActive ? 'scale-110' : ''}`} />
        </div>
      </button>

      {/* Tab: Admin */}
      {isAdmin && (
        <button
          onClick={() => onNavigate('admin')}
          className="relative flex flex-col items-center justify-center w-full h-full"
        >
          <div className={`transition-all duration-300 flex items-center justify-center ${isAdminActive ? 'magic-indicator bg-[#006b2c] text-white' : 'w-12 h-12 text-[#bdcaba]'}`}>
            <Settings className={`w-6 h-6 transition-transform duration-300 ${isAdminActive ? 'scale-110' : ''}`} />
          </div>
        </button>
      )}
    </nav>
  );
}
