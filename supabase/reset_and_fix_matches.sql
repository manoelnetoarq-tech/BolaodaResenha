TRUNCATE TABLE public.matches CASCADE;

INSERT INTO public.matches ("group", team_home, team_away, date_str, status, score_home, score_away) VALUES
  -- PRIMEIRA RODADA
  -- Grupo A
  ('A', 'México', 'África do Sul', '11/06/2026 às 17:00', 'Finalizado', 1, 0),
  ('A', 'Coreia do Sul', 'Tchéquia', '12/06/2026 às 13:00', 'Finalizado', 2, 1),
  -- Grupo B
  ('B', 'Canadá', 'Catar', '12/06/2026 às 17:00', 'Finalizado', 6, 0),
  ('B', 'Suíça', 'Bósnia e Herzegovina', '12/06/2026 às 21:00', 'Finalizado', 4, 1),
  -- Grupo C
  ('C', 'Brasil', 'Haiti', '13/06/2026 às 13:00', 'Finalizado', 3, 0),
  ('C', 'Marrocos', 'Escócia', '13/06/2026 às 17:00', 'Finalizado', 1, 0),
  -- Grupo D
  ('D', 'Estados Unidos', 'Paraguai', '13/06/2026 às 21:00', 'Finalizado', 3, 1),
  ('D', 'Austrália', 'Turquia', '14/06/2026 às 13:00', 'Finalizado', 2, 0),
  -- Grupo E
  ('E', 'Alemanha', 'Curaçao', '14/06/2026 às 17:00', 'Finalizado', 7, 1),
  ('E', 'Costa do Marfim', 'Equador', '14/06/2026 às 21:00', 'Finalizado', 1, 0),
  -- Grupo F
  ('F', 'Holanda', 'Suécia', '15/06/2026 às 13:00', 'Finalizado', 3, 2),
  ('F', 'Japão', 'Tunísia', '15/06/2026 às 17:00', 'Finalizado', 4, 0),
  -- Grupo G
  ('G', 'Nova Zelândia', 'Irã', '16/06/2026 às 13:00', 'Finalizado', 2, 2),
  ('G', 'Bélgica', 'Egito', '16/06/2026 às 17:00', 'Finalizado', 1, 1),
  -- Grupo H
  ('H', 'Uruguai', 'Arábia Saudita', '16/06/2026 às 21:00', 'Finalizado', 1, 1),
  ('H', 'Espanha', 'Cabo Verde', '17/06/2026 às 13:00', 'Finalizado', 0, 0),
  -- Grupo I
  ('I', 'Noruega', 'Iraque', '17/06/2026 às 17:00', 'Finalizado', 4, 1),
  ('I', 'França', 'Senegal', '17/06/2026 às 21:00', 'Finalizado', 3, 1),
  -- Grupo J
  ('J', 'Argentina', 'Argélia', '18/06/2026 às 13:00', 'Finalizado', 3, 0),
  ('J', 'Áustria', 'Jordânia', '18/06/2026 às 17:00', 'Finalizado', 3, 1),
  -- Grupo K
  ('K', 'Colômbia', 'Uzbequistão', '19/06/2026 às 13:00', 'Finalizado', 3, 1),
  ('K', 'Congo DR', 'Portugal', '19/06/2026 às 17:00', 'Finalizado', 1, 1),
  -- Grupo L
  ('L', 'Inglaterra', 'Croácia', '19/06/2026 às 21:00', 'Finalizado', 4, 2),
  ('L', 'Gana', 'Panamá', '20/06/2026 às 13:00', 'Finalizado', 1, 0),

  -- SEGUNDA RODADA
  -- Grupo A
  ('A', 'México', 'Tchéquia', '17/06/2026 às 13:00', 'Finalizado', 2, 0),
  ('A', 'Coreia do Sul', 'África do Sul', '17/06/2026 às 17:00', 'Finalizado', 0, 1),
  -- Grupo B
  ('B', 'Canadá', 'Suíça', '18/06/2026 às 13:00', 'Finalizado', 1, 1),
  ('B', 'Bósnia e Herzegovina', 'Catar', '18/06/2026 às 17:00', 'Finalizado', 1, 1),
  -- Grupo C
  ('C', 'Brasil', 'Marrocos', '18/06/2026 às 21:00', 'Finalizado', 1, 1),
  ('C', 'Escócia', 'Haiti', '19/06/2026 às 13:00', 'Finalizado', 1, 0),
  -- Grupo D
  ('D', 'Estados Unidos', 'Turquia', '19/06/2026 às 17:00', 'Finalizado', 3, 0),
  ('D', 'Austrália', 'Paraguai', '19/06/2026 às 21:00', 'Finalizado', 0, 2),
  -- Grupo E
  ('E', 'Alemanha', 'Costa do Marfim', '20/06/2026 às 13:00', 'Finalizado', 2, 1),
  ('E', 'Equador', 'Curaçao', '20/06/2026 às 17:00', 'Finalizado', 0, 0),
  -- Grupo F
  ('F', 'Holanda', 'Suécia', '20/06/2026 às 21:00', 'Finalizado', 4, 1),
  ('F', 'Japão', 'Tunísia', '21/06/2026 às 13:00', 'Finalizado', 2, 2),
  -- Grupo G
  ('G', 'Nova Zelândia', 'Bélgica', '21/06/2026 às 17:00', 'Finalizado', 0, 0),
  ('G', 'Irã', 'Egito', '21/06/2026 às 21:00', 'Finalizado', 0, 0),
  -- Grupo H
  ('H', 'Uruguai', 'Espanha', '22/06/2026 às 13:00', 'Finalizado', 0, 1),
  ('H', 'Arábia Saudita', 'Cabo Verde', '22/06/2026 às 17:00', 'Finalizado', 0, 0),
  -- Grupo I
  ('I', 'Noruega', 'Senegal', '22/06/2026 às 21:00', 'Finalizado', 0, 0),
  ('I', 'França', 'Iraque', '23/06/2026 às 13:00', 'Finalizado', 0, 0),
  -- Grupo J
  ('J', 'Argentina', 'Jordânia', '23/06/2026 às 17:00', 'Finalizado', 0, 0),
  ('J', 'Áustria', 'Argélia', '23/06/2026 às 21:00', 'Finalizado', 0, 0),
  -- Grupo K
  ('K', 'Colômbia', 'Portugal', '24/06/2026 às 13:00', 'Finalizado', 0, 0),
  ('K', 'Congo DR', 'Uzbequistão', '24/06/2026 às 17:00', 'Finalizado', 0, 0),
  -- Grupo L
  ('L', 'Inglaterra', 'Panamá', '24/06/2026 às 21:00', 'Finalizado', 0, 0),
  ('L', 'Gana', 'Croácia', '25/06/2026 às 13:00', 'Finalizado', 0, 0),

  -- TERCEIRA RODADA
  -- Grupo A
  ('A', 'México', 'África do Sul', '23/06/2026 às 13:00', 'Aberto', NULL, NULL),
  ('A', 'Coreia do Sul', 'Tchéquia', '23/06/2026 às 13:00', 'Aberto', NULL, NULL),
  -- Grupo B
  ('B', 'Canadá', 'Catar', '23/06/2026 às 17:00', 'Aberto', NULL, NULL),
  ('B', 'Suíça', 'Bósnia e Herzegovina', '23/06/2026 às 17:00', 'Aberto', NULL, NULL),
  -- Grupo C
  ('C', 'Brasil', 'Haiti', '24/06/2026 às 13:00', 'Aberto', NULL, NULL),
  ('C', 'Marrocos', 'Escócia', '24/06/2026 às 13:00', 'Aberto', NULL, NULL),
  -- Grupo D
  ('D', 'Estados Unidos', 'Turquia', '24/06/2026 às 17:00', 'Aberto', NULL, NULL),
  ('D', 'Austrália', 'Paraguai', '24/06/2026 às 17:00', 'Aberto', NULL, NULL),
  -- Grupo E
  ('E', 'Alemanha', 'Curaçao', '25/06/2026 às 13:00', 'Aberto', NULL, NULL),
  ('E', 'Costa do Marfim', 'Equador', '25/06/2026 às 13:00', 'Aberto', NULL, NULL),
  -- Grupo F
  ('F', 'Holanda', 'Tunísia', '25/06/2026 às 17:00', 'Aberto', NULL, NULL),
  ('F', 'Japão', 'Suécia', '25/06/2026 às 17:00', 'Aberto', NULL, NULL),
  -- Grupo G
  ('G', 'Nova Zelândia', 'Egito', '26/06/2026 às 13:00', 'Aberto', NULL, NULL),
  ('G', 'Irã', 'Bélgica', '26/06/2026 às 13:00', 'Aberto', NULL, NULL),
  -- Grupo H
  ('H', 'Uruguai', 'Cabo Verde', '26/06/2026 às 17:00', 'Aberto', NULL, NULL),
  ('H', 'Arábia Saudita', 'Espanha', '26/06/2026 às 17:00', 'Aberto', NULL, NULL),
  -- Grupo I
  ('I', 'Noruega', 'Iraque', '27/06/2026 às 13:00', 'Aberto', NULL, NULL),
  ('I', 'França', 'Senegal', '27/06/2026 às 13:00', 'Aberto', NULL, NULL),
  -- Grupo J
  ('J', 'Argentina', 'Argélia', '27/06/2026 às 17:00', 'Aberto', NULL, NULL),
  ('J', 'Áustria', 'Jordânia', '27/06/2026 às 17:00', 'Aberto', NULL, NULL),
  -- Grupo K
  ('K', 'Colômbia', 'Uzbequistão', '28/06/2026 às 13:00', 'Aberto', NULL, NULL),
  ('K', 'Congo DR', 'Portugal', '28/06/2026 às 13:00', 'Aberto', NULL, NULL),
  -- Grupo L
  ('L', 'Inglaterra', 'Croácia', '28/06/2026 às 17:00', 'Aberto', NULL, NULL),
  ('L', 'Gana', 'Panamá', '28/06/2026 às 17:00', 'Aberto', NULL, NULL);
