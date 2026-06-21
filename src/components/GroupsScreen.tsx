import { useMemo } from 'react';
import { Match, GroupStanding } from '../types';

interface GroupsScreenProps {
  matches: Match[];
  groupStandings?: GroupStanding[];
}

export default function GroupsScreen({ matches, groupStandings = [] }: GroupsScreenProps) {
  const groupsData = useMemo(() => {
    // 1. Build a baseline dictionary from Supabase groupStandings
    const baseline: Record<string, Record<string, GroupStanding>> = {};
    
    groupStandings.forEach(g => {
      if (!baseline[g.group_name]) baseline[g.group_name] = {};
      baseline[g.group_name][g.team_name] = { ...g }; // clone it
    });

    // We also need flags for teams, map them from matches
    const flagsMap: Record<string, string> = {};
    matches.forEach(m => {
      if (m.teamHome && m.flagHome) flagsMap[m.teamHome] = m.flagHome;
      if (m.teamAway && m.flagAway) flagsMap[m.teamAway] = m.flagAway;
    });

    const VALID_GROUPS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

    // 2. Add dynamically scored matches that happened after the baseline
    // Any match with status 'Ao Vivo' OR 'Finalizado' that has valid scores.
    matches.forEach(m => {
      if (m.status !== 'Ao Vivo' && m.status !== 'Finalizado') return;
      if (m.scoreHome === undefined || m.scoreHome === null) return;
      if (m.scoreAway === undefined || m.scoreAway === null) return;
      if (!m.group || !VALID_GROUPS.includes(m.group.toUpperCase())) return;

      const groupKey = m.group.toUpperCase();

      // We ensure the team exists in the baseline, if not create it
      if (!baseline[groupKey]) baseline[groupKey] = {};
      
      const ensureTeam = (teamName: string) => {
        if (!baseline[groupKey][teamName]) {
          baseline[groupKey][teamName] = {
            id: '', group_name: groupKey, team_name: teamName,
            j: 0, v: 0, e: 0, d: 0, gp: 0, gc: 0, sg: 0, pts: 0
          };
        }
        return baseline[groupKey][teamName];
      };

      const home = ensureTeam(m.teamHome);
      const away = ensureTeam(m.teamAway);

      home.j += 1;
      away.j += 1;
      home.gp += m.scoreHome;
      home.gc += m.scoreAway;
      away.gp += m.scoreAway;
      away.gc += m.scoreHome;

      if (m.scoreHome > m.scoreAway) {
        home.v += 1;
        home.pts += 3;
        away.d += 1;
      } else if (m.scoreHome < m.scoreAway) {
        away.v += 1;
        away.pts += 3;
        home.d += 1;
      } else {
        home.e += 1;
        away.e += 1;
        home.pts += 1;
        away.pts += 1;
      }

      home.sg = home.gp - home.gc;
      away.sg = away.gp - away.gc;
    });

    // 3. Format into array and sort correctly
    const getFallbackFlag = (team: string) => {
      const name = team === 'Países Baixos' ? 'Holanda' : team;
      if (name === 'Tchéquia' || name === 'República Tcheca') return 'https://avjcjgsosfewukkdsgri.supabase.co/storage/v1/object/public/Bandeiras/Republica%20Tcheca.png';
      if (name === 'Holanda') return 'https://avjcjgsosfewukkdsgri.supabase.co/storage/v1/object/public/Bandeiras/Paises%20Baixos.png';
      if (name === 'Congo DR' || name === 'Congo') return 'https://avjcjgsosfewukkdsgri.supabase.co/storage/v1/object/public/Bandeiras/Congo.png';
      return '';
    };

    const sortedGroups = Object.keys(baseline)
      .filter(groupName => VALID_GROUPS.includes(groupName)) // <-- Ensure only valid groups
      .sort((a, b) => a.localeCompare(b))
      .map((groupName) => {
        const teams = Object.values(baseline[groupName]).map(t => ({
          ...t,
          flag: flagsMap[t.team_name] || getFallbackFlag(t.team_name) || ''
        }));

        const sortedTeams = teams.sort((a, b) => {
          if (b.pts !== a.pts) return b.pts - a.pts; // Pontos
          if (b.sg !== a.sg) return b.sg - a.sg;    // Saldo de Gols
          if (b.gp !== a.gp) return b.gp - a.gp;    // Gols Pró
          return a.team_name.localeCompare(b.team_name); // Ordem Alfabética
        });

        const formattedTeams = sortedTeams.map((t, index) => {
          const maxPossiblePts = t.pts + ((3 - t.j) * 3);
          let isEliminated = false;
          
          if (t.j === 3) {
            // If all 3 matches are played, they are eliminated ONLY if they finish 4th.
            // (3rd place still has a chance to qualify depending on other groups)
            if (index === 3) isEliminated = true;
          } else {
            // If they haven't finished all matches, they are mathematically eliminated
            // ONLY if they cannot even tie the CURRENT points of the 3rd place team.
            if (maxPossiblePts < sortedTeams[2].pts) isEliminated = true;
          }

          return { ...t, isEliminated };
        });
        
        return { groupName, teams: formattedTeams };
      });

    return sortedGroups;
  }, [matches, groupStandings]);

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
                        key={team.team_name} 
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
                            <div className={`w-8 h-8 rounded-full overflow-hidden border border-[#eceef0] shadow-sm flex items-center justify-center bg-[#f2f4f6] shrink-0 ${team.isEliminated ? 'grayscale opacity-70' : ''}`}>
                              {team.flag ? (
                                <img 
                                  src={team.flag} 
                                  alt={`Bandeira de ${team.team_name}`} 
                                  className="w-full h-full object-cover scale-[1.08]"
                                  referrerPolicy="no-referrer"
                                />
                              ) : (
                                <span className="font-poppins font-bold text-[10px] text-[#6e7b6c]">{getInitials(team.team_name)}</span>
                              )}
                            </div>
                            <span className={`font-poppins font-semibold text-sm truncate ${team.isEliminated ? 'text-[#8e9894]' : 'text-[#191c1e]'}`}>
                              {team.team_name}
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
