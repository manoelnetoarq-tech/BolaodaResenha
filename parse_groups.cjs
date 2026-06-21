const fs = require('fs');

const md = fs.readFileSync('classificacao_copa_2026.md', 'utf-8');
const lines = md.split('\n');

const groups = [];
let currentGroup = null;

for (let line of lines) {
  if (line.startsWith('## Grupo ')) {
    const groupName = line.replace('## Grupo ', '').trim();
    currentGroup = { groupName, teams: [] };
    groups.push(currentGroup);
  } else if (line.startsWith('|') && !line.includes('Seleção') && !line.includes('---')) {
    const parts = line.split('|').map(p => p.trim()).filter(Boolean);
    if (parts.length === 10) {
      currentGroup.teams.push({
        name: parts[1].replace(/\*/g, ''),
        j: parseInt(parts[2], 10),
        v: parseInt(parts[3], 10),
        e: parseInt(parts[4], 10),
        d: parseInt(parts[5], 10),
        gp: parseInt(parts[6], 10),
        gc: parseInt(parts[7], 10),
        sg: parseInt(parts[8].replace('+', ''), 10),
        pts: parseInt(parts[9].replace(/\*/g, ''), 10)
      });
    }
  }
}

const tsContent = `export interface TeamStats {
  name: string;
  j: number;
  v: number;
  e: number;
  d: number;
  gp: number;
  gc: number;
  sg: number;
  pts: number;
}

export interface GroupData {
  groupName: string;
  teams: TeamStats[];
}

export const INITIAL_GROUPS: GroupData[] = ${JSON.stringify(groups, null, 2)};
`;

fs.writeFileSync('src/data/groupsData.ts', tsContent);
console.log('Done!');
