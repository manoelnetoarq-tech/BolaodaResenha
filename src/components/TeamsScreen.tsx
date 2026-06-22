import { useState, useMemo } from 'react';
import { Match, Prediction, UserProfile } from '../types';
import MatchCard from './MatchCard';
import { ArrowLeft, Flag } from 'lucide-react';

interface TeamsScreenProps {
  matches: Match[];
  predictions: Prediction[];
  currentUser: UserProfile;
  onSelectMatch: (matchId: string) => void;
}

export default function TeamsScreen({ matches, predictions, currentUser, onSelectMatch }: TeamsScreenProps) {
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  // Extract unique teams
  const uniqueTeams = useMemo(() => {
    const teamsMap = new Map<string, string>(); // name -> flag
    matches.forEach(m => {
      if (!teamsMap.has(m.teamHome)) teamsMap.set(m.teamHome, m.flagHome || '');
      if (!teamsMap.has(m.teamAway)) teamsMap.set(m.teamAway, m.flagAway || '');
    });
    return Array.from(teamsMap.entries())
      .map(([name, flag]) => ({ name, flag }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [matches]);

  const filteredMatches = useMemo(() => {
    if (!selectedTeam) return [];
    return matches.filter(m => m.teamHome === selectedTeam || m.teamAway === selectedTeam);
  }, [matches, selectedTeam]);

  if (selectedTeam) {
    return (
      <div className="flex flex-col gap-6 animate-fade-in w-full pb-6">
        <div className="flex items-center gap-3 mb-2">
          <button 
            onClick={() => setSelectedTeam(null)}
            className="w-10 h-10 rounded-full bg-[#f2f4f6] flex items-center justify-center text-[#3e4a3d] hover:bg-[#eceef0] active:scale-95 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="font-poppins font-black text-xl md:text-2xl text-[#191c1e]">
            Jogos: <span className="text-[#006b2c]">{selectedTeam}</span>
          </h2>
        </div>

        <div className="flex flex-col gap-4">
          {filteredMatches.length > 0 ? (
            filteredMatches.map(m => (
              <MatchCard 
                key={m.id}
                match={m}
                predictions={predictions}
                currentUserEmail={currentUser.email}
                onSelect={onSelectMatch}
              />
            ))
          ) : (
            <div className="text-center p-8 bg-white rounded-3xl border border-[#eceef0]">
              <p className="text-[#6e7b6c] font-sans">Nenhum jogo encontrado.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 animate-fade-in w-full pb-6">
      <div className="mb-2 text-center">
        <h2 className="font-poppins font-black text-2xl md:text-3xl text-[#191c1e] tracking-tight">
          Escolha uma <span className="text-[#006b2c]">Seleção</span>
        </h2>
        <p className="font-sans text-[#6e7b6c] mt-1 text-sm max-w-md mx-auto">
          Selecione uma equipe para ver todos os seus jogos no campeonato atual.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 mt-2">
        {uniqueTeams.map(team => (
          <button
            key={team.name}
            onClick={() => setSelectedTeam(team.name)}
            className="bg-white border border-[#eceef0] rounded-3xl p-5 flex flex-col items-center gap-3 hover:border-[#006b2c]/50 hover:shadow-md active:scale-95 transition-all cursor-pointer group"
          >
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-[#f2f4f6] flex items-center justify-center shadow-sm border border-[#eceef0] group-hover:scale-105 transition-transform">
              {team.flag ? (
                <img src={team.flag} alt={team.name} className="w-full h-full object-cover scale-[1.05]" referrerPolicy="no-referrer" />
              ) : (
                <Flag className="w-8 h-8 text-[#bdcaba]" />
              )}
            </div>
            <span className="font-poppins font-bold text-sm md:text-base text-[#191c1e] text-center leading-tight">
              {team.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
