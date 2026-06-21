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
  // Check if current screen is transactional / has back button
  const hasBack = ['match-details', 'edit-profile', 'change-password'].includes(currentScreen);

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
      default:
        return "Bolão da Resenha";
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#f7f9fb] shadow-[0_10px_30px_rgba(15,23,42,0.06)] flex flex-col transition-all">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-10 flex items-center justify-between h-20 md:h-24 relative">
        <div className="flex items-center gap-3 relative z-10">
          {hasBack && (
            <button
              onClick={onBack}
              aria-label="Voltar"
              className="p-2 -ml-2 rounded-full text-[#006b2c] hover:bg-[#eceef0] active:scale-95 transition-all cursor-pointer flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          )}

          <div 
            onClick={() => onNavigate('home')} 
            className="flex items-center gap-3 cursor-pointer active:scale-98 transition-transform"
          >
            <img 
              src="/Logo.png" 
              alt="Selman's Bet Logo" 
              className="h-10 md:h-12 w-auto object-contain"
              referrerPolicy="no-referrer"
            />
            <span className="font-poppins font-bold text-[#191c1e] text-lg md:text-xl tracking-tight">
              Bolão da Resenha
            </span>
          </div>

          {!hasBack && currentScreen !== 'home' && (
            <span className="hidden md:inline font-poppins font-medium text-lg text-[#191c1e] border-l-2 border-[#bdcaba] pl-4 ml-4">
              {getTitle()}
            </span>
          )}
        </div>


        {/* Desktop inline navigator */}
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
      </div>

      {/* Competition Tabs (Folder Style) */}
      {['home', 'ranking', 'groups'].includes(currentScreen) && onSelectCompetition && (
        <div className="w-full max-w-7xl mx-auto px-4 md:px-10 flex items-end -mb-0.5 mt-auto">
          <div className="flex w-full overflow-x-auto no-scrollbar gap-1 border-b-2 border-[#006b2c]">
            {['Copa do Mundo', 'Brasileirão', 'Libertadores', 'Champions'].map((comp) => {
              const isActive = activeCompetition === comp;
              return (
                <button 
                  key={comp}
                  onClick={() => onSelectCompetition(comp)}
                  className={`px-5 py-2.5 rounded-t-xl font-bold text-sm whitespace-nowrap transition-all cursor-pointer relative ${
                    isActive 
                      ? 'bg-[#006b2c] text-white shadow-[0_-4px_10px_rgba(0,107,44,0.15)] z-10' 
                      : 'bg-[#eceef0] hover:bg-[#e1e4e8] text-[#6e7b6c] opacity-80'
                  }`}
                >
                  {comp}
                  {isActive && (
                    <span className="absolute -bottom-0.5 left-0 w-full h-1 bg-[#006b2c]"></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
