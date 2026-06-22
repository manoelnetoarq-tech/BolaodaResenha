import re
import json

def escape_sql(text):
    if text is None:
        return 'NULL'
    return "'" + text.replace("'", "''") + "'"

def escape_array(items):
    if not items:
        return "'{}'"
    # escape each item
    escaped_items = [item.replace("'", "''") for item in items]
    # join with double quotes and commas for pg array
    return "ARRAY[" + ", ".join("'" + i + "'" for i in escaped_items) + "]::text[]"

with open('elencos_tecnicos_titulares_copa_mundo_2026.md', 'r', encoding='utf-8') as f:
    lines = f.readlines()

teams = []
current_team = {}
for line in lines:
    line = line.strip()
    if line.startswith('### '):
        if current_team:
            teams.append(current_team)
        name = line.replace('### ', '').split('(')[0].strip()
        current_team = {'team_name': name}
    elif line.startswith('**Técnico:**'):
        current_team['coach'] = line.replace('**Técnico:**', '').strip()
    elif line.startswith('**Provável 11 titular/base principal'):
        form_match = re.search(r'\(([\d\-]+)\):', line)
        if form_match:
            current_team['probable_formation'] = form_match.group(1)
        
        parts = line.split('):')
        if len(parts) > 1:
            lineup = parts[1].strip()
        else:
            lineup = line.split(':')[-1].strip()
        current_team['probable_lineup'] = lineup
    elif line.startswith('- **Goleiros:**'):
        current_team['goalkeepers'] = [p.strip() for p in line.replace('- **Goleiros:**', '').split(';') if p.strip()]
    elif line.startswith('- **Defensores:**'):
        current_team['defenders'] = [p.strip() for p in line.replace('- **Defensores:**', '').split(';') if p.strip()]
    elif line.startswith('- **Meio-campistas:**'):
        current_team['midfielders'] = [p.strip() for p in line.replace('- **Meio-campistas:**', '').split(';') if p.strip()]
    elif line.startswith('- **Atacantes:**'):
        current_team['forwards'] = [p.strip() for p in line.replace('- **Atacantes:**', '').split(';') if p.strip()]

if current_team:
    teams.append(current_team)

sql = """-- Tabela de elencos das seleções
CREATE TABLE IF NOT EXISTS team_squads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_name TEXT NOT NULL UNIQUE,
  coach TEXT,
  probable_formation TEXT,
  probable_lineup TEXT,
  goalkeepers TEXT[],
  defenders TEXT[],
  midfielders TEXT[],
  forwards TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Configura RLS
ALTER TABLE team_squads ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'team_squads' AND policyname = 'Permitir leitura publica em team_squads'
    ) THEN
        CREATE POLICY "Permitir leitura publica em team_squads" ON team_squads FOR SELECT TO public USING (true);
    END IF;
END $$;

-- Insere os dados
"""

for t in teams:
    team_name = escape_sql(t.get('team_name'))
    coach = escape_sql(t.get('coach'))
    formation = escape_sql(t.get('probable_formation'))
    lineup = escape_sql(t.get('probable_lineup'))
    gk = escape_array(t.get('goalkeepers', []))
    df = escape_array(t.get('defenders', []))
    md = escape_array(t.get('midfielders', []))
    fw = escape_array(t.get('forwards', []))
    
    sql += f"""INSERT INTO team_squads (team_name, coach, probable_formation, probable_lineup, goalkeepers, defenders, midfielders, forwards) 
VALUES ({team_name}, {coach}, {formation}, {lineup}, {gk}, {df}, {md}, {fw})
ON CONFLICT (team_name) DO UPDATE SET
  coach = EXCLUDED.coach,
  probable_formation = EXCLUDED.probable_formation,
  probable_lineup = EXCLUDED.probable_lineup,
  goalkeepers = EXCLUDED.goalkeepers,
  defenders = EXCLUDED.defenders,
  midfielders = EXCLUDED.midfielders,
  forwards = EXCLUDED.forwards;\n"""

with open('supabase/create_team_squads.sql', 'w', encoding='utf-8') as f:
    f.write(sql)

print("SQL script generated at supabase/create_team_squads.sql")
