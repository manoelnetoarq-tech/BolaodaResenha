import { useMemo } from 'react';
import { Match } from '../types';
import { INITIAL_GROUPS } from '../data/groupsData';

interface GroupsScreenProps {
  matches: Match[];
}

export default function GroupsScreen({ matches }: GroupsScreenProps) {
  // Use INITIAL_GROUPS directly and add flags from matches
  const groupsData = useMemo(() => {
    // Map teams to their flags by looking into matches
    const flagsMap: Record<string, string> = {};
    matches.forEach(m => {
      if (m.teamHome && m.flagHome) flagsMap[m.teamHome] = m.flagHome;
      if (m.teamAway && m.flagAway) flagsMap[m.teamAway] = m.flagAway;
    });

    return INITIAL_GROUPS.map(group => ({
      ...group,
      teams: group.teams.map(team => ({
        ...team,
        flag: flagsMap[team.name] || ''
      }))
    }));
  }, [matches]);

  const getInitials = (team: string) => {
    if (team === 'Brasil') return 'BRA';
    if (team === 'Marrocos') return 'MAR';
    if (team === 'França') return 'FRA';
    if (team === 'Espanha') return 'ESP';
    if (team === 'Alemanha') return 'GER';
    if (team === 'Suíça') return 'SUI';
    if (team === 'Portugal') return 'POR';
    return team.substring(0, 3).toUpperCase();
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between px-1">
        <h2 className="font-poppins font-bold text-[#191c1e] text-xl md:text-2xl flex items-center gap-2 select-none">
          Classificação
        </h2>
      </div>

      <div className="flex flex-col gap-8">
        {groupsData.length === 0 ? (
          <p className="text-center text-[#6e7b6c] mt-10">Nenhum grupo encontrado.</p>
        ) : (
          groupsData.map(({ groupName, teams }) => (
            <div key={groupName} className="bg-white rounded-3xl p-5 md:p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)] border border-[#eceef0] overflow-hidden">
              <h3 className="font-poppins font-bold text-lg text-[#006b2c] mb-4 border-b border-[#eceef0] pb-2">
                Grupo {groupName}
              </h3>
              
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full min-w-[500px] text-left border-collapse">
                  <thead>
                    <tr className="text-xs font-sans font-semibold text-[#8e9894] border-b border-[#f2f4f6]">
                      <th className="pb-3 pl-2 w-8">#</th>
                      <th className="pb-3 min-w-[140px]">Seleção</th>
                      <th className="pb-3 text-center w-10">PTS</th>
                      <th className="pb-3 text-center w-10">J</th>
                      <th className="pb-3 text-center w-10">V</th>
                      <th className="pb-3 text-center w-10">E</th>
                      <th className="pb-3 text-center w-10">D</th>
                      <th className="pb-3 text-center w-10">GP</th>
                      <th className="pb-3 text-center w-10">GC</th>
                      <th className="pb-3 text-center w-10">SG</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teams.map((team, index) => (
                      <tr 
                        key={team.name} 
                        className={`border-b border-[#f2f4f6] last:border-0 hover:bg-[#f7f9fb] transition-colors ${
                          index < 2 ? 'bg-[#f7fff2]/30' : ''
                        }`}
                      >
                        <td className="py-3 pl-2">
                          <span className={`font-poppins font-bold text-sm ${
                            index < 2 ? 'text-[#00873a]' : 'text-[#6e7b6c]'
                          }`}>
                            {index + 1}
                          </span>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full overflow-hidden border border-[#eceef0] shadow-sm flex items-center justify-center bg-[#f2f4f6] shrink-0">
                              {team.flag ? (
                                <img 
                                  src={team.flag} 
                                  alt={`Bandeira de ${team.name}`} 
                                  className="w-full h-full object-cover scale-[1.08]"
                                  referrerPolicy="no-referrer"
                                />
                              ) : (
                                <span className="font-poppins font-bold text-[10px] text-[#6e7b6c]">{getInitials(team.name)}</span>
                              )}
                            </div>
                            <span className="font-poppins font-semibold text-[#191c1e] text-sm truncate">
                              {team.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 text-center font-bold text-[#191c1e] bg-[#f7f9fb]/50">{team.pts}</td>
                        <td className="py-3 text-center font-sans text-sm text-[#3e4a3d]">{team.j}</td>
                        <td className="py-3 text-center font-sans text-sm text-[#3e4a3d]">{team.v}</td>
                        <td className="py-3 text-center font-sans text-sm text-[#3e4a3d]">{team.e}</td>
                        <td className="py-3 text-center font-sans text-sm text-[#3e4a3d]">{team.d}</td>
                        <td className="py-3 text-center font-sans text-sm text-[#3e4a3d]">{team.gp}</td>
                        <td className="py-3 text-center font-sans text-sm text-[#3e4a3d]">{team.gc}</td>
                        <td className="py-3 text-center font-sans text-sm font-semibold text-[#191c1e] bg-[#f7f9fb]/50">{team.sg > 0 ? `+${team.sg}` : team.sg}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
