export interface TeamStats {
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

export const INITIAL_GROUPS: GroupData[] = [
  {
    "groupName": "A",
    "teams": [
      {
        "name": "México",
        "j": 2,
        "v": 2,
        "e": 0,
        "d": 0,
        "gp": 3,
        "gc": 0,
        "sg": 3,
        "pts": 6
      },
      {
        "name": "Coreia do Sul",
        "j": 2,
        "v": 1,
        "e": 0,
        "d": 1,
        "gp": 2,
        "gc": 2,
        "sg": 0,
        "pts": 3
      },
      {
        "name": "Tchéquia",
        "j": 2,
        "v": 0,
        "e": 1,
        "d": 1,
        "gp": 2,
        "gc": 3,
        "sg": -1,
        "pts": 1
      },
      {
        "name": "África do Sul",
        "j": 2,
        "v": 0,
        "e": 1,
        "d": 1,
        "gp": 1,
        "gc": 3,
        "sg": -2,
        "pts": 1
      }
    ]
  },
  {
    "groupName": "B",
    "teams": [
      {
        "name": "Canadá",
        "j": 2,
        "v": 1,
        "e": 1,
        "d": 0,
        "gp": 7,
        "gc": 1,
        "sg": 6,
        "pts": 4
      },
      {
        "name": "Suíça",
        "j": 2,
        "v": 1,
        "e": 1,
        "d": 0,
        "gp": 5,
        "gc": 2,
        "sg": 3,
        "pts": 4
      },
      {
        "name": "Bósnia e Herzegovina",
        "j": 2,
        "v": 0,
        "e": 1,
        "d": 1,
        "gp": 2,
        "gc": 5,
        "sg": -3,
        "pts": 1
      },
      {
        "name": "Catar",
        "j": 2,
        "v": 0,
        "e": 1,
        "d": 1,
        "gp": 1,
        "gc": 7,
        "sg": -6,
        "pts": 1
      }
    ]
  },
  {
    "groupName": "C",
    "teams": [
      {
        "name": "Brasil",
        "j": 2,
        "v": 1,
        "e": 1,
        "d": 0,
        "gp": 4,
        "gc": 1,
        "sg": 3,
        "pts": 4
      },
      {
        "name": "Marrocos",
        "j": 2,
        "v": 1,
        "e": 1,
        "d": 0,
        "gp": 2,
        "gc": 1,
        "sg": 1,
        "pts": 4
      },
      {
        "name": "Escócia",
        "j": 2,
        "v": 1,
        "e": 0,
        "d": 1,
        "gp": 1,
        "gc": 1,
        "sg": 0,
        "pts": 3
      },
      {
        "name": "Haiti",
        "j": 2,
        "v": 0,
        "e": 0,
        "d": 2,
        "gp": 0,
        "gc": 4,
        "sg": -4,
        "pts": 0
      }
    ]
  },
  {
    "groupName": "D",
    "teams": [
      {
        "name": "Estados Unidos",
        "j": 2,
        "v": 2,
        "e": 0,
        "d": 0,
        "gp": 6,
        "gc": 1,
        "sg": 5,
        "pts": 6
      },
      {
        "name": "Austrália",
        "j": 2,
        "v": 1,
        "e": 0,
        "d": 1,
        "gp": 2,
        "gc": 2,
        "sg": 0,
        "pts": 3
      },
      {
        "name": "Paraguai",
        "j": 2,
        "v": 1,
        "e": 0,
        "d": 1,
        "gp": 2,
        "gc": 4,
        "sg": -2,
        "pts": 3
      },
      {
        "name": "Turquia",
        "j": 2,
        "v": 0,
        "e": 0,
        "d": 2,
        "gp": 0,
        "gc": 3,
        "sg": -3,
        "pts": 0
      }
    ]
  },
  {
    "groupName": "E",
    "teams": [
      {
        "name": "Alemanha",
        "j": 2,
        "v": 2,
        "e": 0,
        "d": 0,
        "gp": 9,
        "gc": 2,
        "sg": 7,
        "pts": 6
      },
      {
        "name": "Costa do Marfim",
        "j": 2,
        "v": 1,
        "e": 0,
        "d": 1,
        "gp": 2,
        "gc": 2,
        "sg": 0,
        "pts": 3
      },
      {
        "name": "Equador",
        "j": 2,
        "v": 0,
        "e": 1,
        "d": 1,
        "gp": 0,
        "gc": 1,
        "sg": -1,
        "pts": 1
      },
      {
        "name": "Curaçao",
        "j": 2,
        "v": 0,
        "e": 1,
        "d": 1,
        "gp": 1,
        "gc": 7,
        "sg": -6,
        "pts": 1
      }
    ]
  },
  {
    "groupName": "F",
    "teams": [
      {
        "name": "Holanda",
        "j": 2,
        "v": 1,
        "e": 1,
        "d": 0,
        "gp": 7,
        "gc": 3,
        "sg": 4,
        "pts": 4
      },
      {
        "name": "Japão",
        "j": 2,
        "v": 1,
        "e": 1,
        "d": 0,
        "gp": 6,
        "gc": 2,
        "sg": 4,
        "pts": 4
      },
      {
        "name": "Suécia",
        "j": 2,
        "v": 1,
        "e": 0,
        "d": 1,
        "gp": 6,
        "gc": 6,
        "sg": 0,
        "pts": 3
      },
      {
        "name": "Tunísia",
        "j": 2,
        "v": 0,
        "e": 0,
        "d": 2,
        "gp": 1,
        "gc": 9,
        "sg": -8,
        "pts": 0
      }
    ]
  },
  {
    "groupName": "G",
    "teams": [
      {
        "name": "Nova Zelândia",
        "j": 1,
        "v": 0,
        "e": 1,
        "d": 0,
        "gp": 2,
        "gc": 2,
        "sg": 0,
        "pts": 1
      },
      {
        "name": "Irã",
        "j": 1,
        "v": 0,
        "e": 1,
        "d": 0,
        "gp": 2,
        "gc": 2,
        "sg": 0,
        "pts": 1
      },
      {
        "name": "Bélgica",
        "j": 1,
        "v": 0,
        "e": 1,
        "d": 0,
        "gp": 1,
        "gc": 1,
        "sg": 0,
        "pts": 1
      },
      {
        "name": "Egito",
        "j": 1,
        "v": 0,
        "e": 1,
        "d": 0,
        "gp": 1,
        "gc": 1,
        "sg": 0,
        "pts": 1
      }
    ]
  },
  {
    "groupName": "H",
    "teams": [
      {
        "name": "Uruguai",
        "j": 1,
        "v": 0,
        "e": 1,
        "d": 0,
        "gp": 1,
        "gc": 1,
        "sg": 0,
        "pts": 1
      },
      {
        "name": "Arábia Saudita",
        "j": 1,
        "v": 0,
        "e": 1,
        "d": 0,
        "gp": 1,
        "gc": 1,
        "sg": 0,
        "pts": 1
      },
      {
        "name": "Espanha",
        "j": 1,
        "v": 0,
        "e": 1,
        "d": 0,
        "gp": 0,
        "gc": 0,
        "sg": 0,
        "pts": 1
      },
      {
        "name": "Cabo Verde",
        "j": 1,
        "v": 0,
        "e": 1,
        "d": 0,
        "gp": 0,
        "gc": 0,
        "sg": 0,
        "pts": 1
      }
    ]
  },
  {
    "groupName": "I",
    "teams": [
      {
        "name": "Noruega",
        "j": 1,
        "v": 1,
        "e": 0,
        "d": 0,
        "gp": 4,
        "gc": 1,
        "sg": 3,
        "pts": 3
      },
      {
        "name": "França",
        "j": 1,
        "v": 1,
        "e": 0,
        "d": 0,
        "gp": 3,
        "gc": 1,
        "sg": 2,
        "pts": 3
      },
      {
        "name": "Senegal",
        "j": 1,
        "v": 0,
        "e": 0,
        "d": 1,
        "gp": 1,
        "gc": 3,
        "sg": -2,
        "pts": 0
      },
      {
        "name": "Iraque",
        "j": 1,
        "v": 0,
        "e": 0,
        "d": 1,
        "gp": 1,
        "gc": 4,
        "sg": -3,
        "pts": 0
      }
    ]
  },
  {
    "groupName": "J",
    "teams": [
      {
        "name": "Argentina",
        "j": 1,
        "v": 1,
        "e": 0,
        "d": 0,
        "gp": 3,
        "gc": 0,
        "sg": 3,
        "pts": 3
      },
      {
        "name": "Áustria",
        "j": 1,
        "v": 1,
        "e": 0,
        "d": 0,
        "gp": 3,
        "gc": 1,
        "sg": 2,
        "pts": 3
      },
      {
        "name": "Jordânia",
        "j": 1,
        "v": 0,
        "e": 0,
        "d": 1,
        "gp": 1,
        "gc": 3,
        "sg": -2,
        "pts": 0
      },
      {
        "name": "Argélia",
        "j": 1,
        "v": 0,
        "e": 0,
        "d": 1,
        "gp": 0,
        "gc": 3,
        "sg": -3,
        "pts": 0
      }
    ]
  },
  {
    "groupName": "K",
    "teams": [
      {
        "name": "Colômbia",
        "j": 1,
        "v": 1,
        "e": 0,
        "d": 0,
        "gp": 3,
        "gc": 1,
        "sg": 2,
        "pts": 3
      },
      {
        "name": "Congo DR",
        "j": 1,
        "v": 0,
        "e": 1,
        "d": 0,
        "gp": 1,
        "gc": 1,
        "sg": 0,
        "pts": 1
      },
      {
        "name": "Portugal",
        "j": 1,
        "v": 0,
        "e": 1,
        "d": 0,
        "gp": 1,
        "gc": 1,
        "sg": 0,
        "pts": 1
      },
      {
        "name": "Uzbequistão",
        "j": 1,
        "v": 0,
        "e": 0,
        "d": 1,
        "gp": 1,
        "gc": 3,
        "sg": -2,
        "pts": 0
      }
    ]
  },
  {
    "groupName": "L",
    "teams": [
      {
        "name": "Inglaterra",
        "j": 1,
        "v": 1,
        "e": 0,
        "d": 0,
        "gp": 4,
        "gc": 2,
        "sg": 2,
        "pts": 3
      },
      {
        "name": "Gana",
        "j": 1,
        "v": 1,
        "e": 0,
        "d": 0,
        "gp": 1,
        "gc": 0,
        "sg": 1,
        "pts": 3
      },
      {
        "name": "Panamá",
        "j": 1,
        "v": 0,
        "e": 0,
        "d": 1,
        "gp": 0,
        "gc": 1,
        "sg": -1,
        "pts": 0
      },
      {
        "name": "Croácia",
        "j": 1,
        "v": 0,
        "e": 0,
        "d": 1,
        "gp": 2,
        "gc": 4,
        "sg": -2,
        "pts": 0
      }
    ]
  }
];
