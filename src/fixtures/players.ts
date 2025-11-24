export interface Player {
  id: string;
  name: string;
  number: number;
  position: string;
  team: 'player1' | 'player2';
  isCaptain?: boolean;
  oddsModifier?: number;
}

export interface TeamLineup {
  teamName: string;
  players: Omit<Player, 'team'>[];
}

export interface MatchLineup {
  matchId: string;
  team1: TeamLineup;
  team2: TeamLineup;
}

// Portugal vs England - Euro 2004 Quarterfinal
export const PORTUGAL_ENGLAND_2004: MatchLineup = {
  matchId: 'portugal-england-2004',
  team1: {
    teamName: 'Portugal',
    players: [
      {
        id: 'pt-1',
        name: 'Ricardo',
        number: 1,
        position: 'GK',
        oddsModifier: 0.5,
      },
      {
        id: 'pt-4',
        name: 'Jorge Andrade',
        number: 4,
        position: 'DEF',
        oddsModifier: 1.2,
      },
      {
        id: 'pt-6',
        name: 'Costinha',
        number: 6,
        position: 'MID',
        oddsModifier: 1.25,
      },
      {
        id: 'pt-7',
        name: 'Luís Figo',
        number: 7,
        position: 'MID',
        isCaptain: true,
        oddsModifier: 1.5,
      },
      {
        id: 'pt-13',
        name: 'Miguel',
        number: 13,
        position: 'DEF',
        oddsModifier: 1.1,
      },
      {
        id: 'pt-14',
        name: 'Nuno Valente',
        number: 14,
        position: 'DEF',
        oddsModifier: 1.15,
      },
      {
        id: 'pt-16',
        name: 'Ricardo Carvalho',
        number: 16,
        position: 'DEF',
        oddsModifier: 1.35,
      },
      {
        id: 'pt-17',
        name: 'Cristiano Ronaldo',
        number: 17,
        position: 'FWD',
        oddsModifier: 1.5,
      },
      {
        id: 'pt-18',
        name: 'Maniche',
        number: 18,
        position: 'MID',
        oddsModifier: 1.3,
      },
      {
        id: 'pt-20',
        name: 'Deco',
        number: 20,
        position: 'MID',
        oddsModifier: 1.4,
      },
      {
        id: 'pt-21',
        name: 'Nuno Gomes',
        number: 21,
        position: 'FWD',
        oddsModifier: 1.3,
      },
    ],
  },
  team2: {
    teamName: 'England',
    players: [
      {
        id: 'eng-1',
        name: 'James',
        number: 1,
        position: 'GK',
        oddsModifier: 0.6,
      },
      {
        id: 'eng-2',
        name: 'G. Neville',
        number: 2,
        position: 'DEF',
        oddsModifier: 1.25,
      },
      {
        id: 'eng-3',
        name: 'A. Cole',
        number: 3,
        position: 'DEF',
        oddsModifier: 1.3,
      },
      {
        id: 'eng-4',
        name: 'Gerrard',
        number: 4,
        position: 'MID',
        oddsModifier: 1.5,
      },
      {
        id: 'eng-5',
        name: 'Terry',
        number: 5,
        position: 'DEF',
        oddsModifier: 1.35,
      },
      {
        id: 'eng-6',
        name: 'Campbell',
        number: 6,
        position: 'DEF',
        oddsModifier: 1.25,
      },
      {
        id: 'eng-7',
        name: 'Beckham',
        number: 7,
        position: 'MID',
        isCaptain: true,
        oddsModifier: 1.45,
      },
      {
        id: 'eng-8',
        name: 'Scholes',
        number: 8,
        position: 'MID',
        oddsModifier: 1.4,
      },
      {
        id: 'eng-9',
        name: 'Rooney',
        number: 9,
        position: 'FWD',
        oddsModifier: 1.5,
      },
      {
        id: 'eng-10',
        name: 'Owen',
        number: 10,
        position: 'FWD',
        oddsModifier: 1.4,
      },
      {
        id: 'eng-11',
        name: 'Lampard',
        number: 11,
        position: 'MID',
        oddsModifier: 1.45,
      },
    ],
  },
};

// Current Portugal squad (modern)
export const PORTUGAL_MODERN: TeamLineup = {
  teamName: 'Portugal',
  players: [
    {
      id: 'pt-modern-1',
      name: 'Diogo Costa',
      number: 1,
      position: 'GK',
      oddsModifier: 1.25,
    },
    {
      id: 'pt-modern-2',
      name: 'João Cancelo',
      number: 20,
      position: 'DEF',
      oddsModifier: 1.35,
    },
    {
      id: 'pt-modern-3',
      name: 'Rúben Dias',
      number: 3,
      position: 'DEF',
      oddsModifier: 1.4,
    },
    {
      id: 'pt-modern-4',
      name: 'Pepe',
      number: 2,
      position: 'DEF',
      oddsModifier: 1.3,
    },
    {
      id: 'pt-modern-5',
      name: 'Nuno Mendes',
      number: 19,
      position: 'DEF',
      oddsModifier: 1.3,
    },
    {
      id: 'pt-modern-6',
      name: 'Bruno Fernandes',
      number: 8,
      position: 'MID',
      oddsModifier: 1.5,
    },
    {
      id: 'pt-modern-7',
      name: 'Bernardo Silva',
      number: 10,
      position: 'MID',
      oddsModifier: 1.45,
    },
    {
      id: 'pt-modern-8',
      name: 'João Félix',
      number: 11,
      position: 'MID',
      oddsModifier: 1.4,
    },
    {
      id: 'pt-modern-9',
      name: 'Cristiano Ronaldo',
      number: 7,
      position: 'FWD',
      isCaptain: true,
      oddsModifier: 1.5,
    },
    {
      id: 'pt-modern-10',
      name: 'Rafael Leão',
      number: 17,
      position: 'FWD',
      oddsModifier: 1.4,
    },
    {
      id: 'pt-modern-11',
      name: 'Gonçalo Ramos',
      number: 9,
      position: 'FWD',
      oddsModifier: 1.35,
    },
  ],
};

// Generic opponent squad template
export const GENERIC_OPPONENT: TeamLineup = {
  teamName: 'Opponent',
  players: [
    {
      id: 'op-1',
      name: 'Goalkeeper',
      number: 1,
      position: 'GK',
      oddsModifier: 1.1,
    },
    {
      id: 'op-2',
      name: 'Right Back',
      number: 2,
      position: 'DEF',
      oddsModifier: 1.15,
    },
    {
      id: 'op-3',
      name: 'Center Back',
      number: 3,
      position: 'DEF',
      oddsModifier: 1.2,
    },
    {
      id: 'op-4',
      name: 'Center Back',
      number: 4,
      position: 'DEF',
      oddsModifier: 1.2,
    },
    {
      id: 'op-5',
      name: 'Left Back',
      number: 5,
      position: 'DEF',
      oddsModifier: 1.15,
    },
    {
      id: 'op-6',
      name: 'Midfielder',
      number: 6,
      position: 'MID',
      oddsModifier: 1.25,
    },
    {
      id: 'op-7',
      name: 'Midfielder',
      number: 8,
      position: 'MID',
      oddsModifier: 1.3,
    },
    {
      id: 'op-8',
      name: 'Winger',
      number: 10,
      position: 'MID',
      oddsModifier: 1.3,
    },
    {
      id: 'op-9',
      name: 'Striker',
      number: 9,
      position: 'FWD',
      oddsModifier: 1.35,
    },
    {
      id: 'op-10',
      name: 'Forward',
      number: 11,
      position: 'FWD',
      oddsModifier: 1.3,
    },
    {
      id: 'op-11',
      name: 'Forward',
      number: 7,
      position: 'FWD',
      oddsModifier: 1.3,
    },
  ],
};

// Helper function to get players for a match
export function getMatchPlayers(
  matchId: string | number,
  team1Name?: string,
  team2Name?: string
): { team1Players: Player[]; team2Players: Player[] } {
  let lineup: MatchLineup | null = null;

  // Match specific lineups
  if (matchId === 'portugal-england-2004') {
    lineup = PORTUGAL_ENGLAND_2004;
  }

  // If we have a specific lineup, use it
  if (lineup) {
    return {
      team1Players: lineup.team1.players.map((p) => ({
        ...p,
        team: 'player1' as const,
      })),
      team2Players: lineup.team2.players.map((p) => ({
        ...p,
        team: 'player2' as const,
      })),
    };
  }

  // Fallback to default squads
  return {
    team1Players: PORTUGAL_MODERN.players.map((p) => ({
      ...p,
      team: 'player1' as const,
    })),
    team2Players: GENERIC_OPPONENT.players.map((p) => ({
      ...p,
      team: 'player2' as const,
    })),
  };
}
