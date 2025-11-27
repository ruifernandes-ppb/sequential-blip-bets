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
  date?: string; // ISO date string
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
        oddsModifier: 2.5,
      },
      {
        id: 'pt-4',
        name: 'Jorge Andrade',
        number: 4,
        position: 'DEF',
        oddsModifier: 2.0,
      },
      {
        id: 'pt-6',
        name: 'Costinha',
        number: 6,
        position: 'MID',
        oddsModifier: 1.5,
      },
      {
        id: 'pt-7',
        name: 'Luís Figo',
        number: 7,
        position: 'MID',
        isCaptain: true,
        oddsModifier: 1.2,
      },
      {
        id: 'pt-13',
        name: 'Miguel',
        number: 13,
        position: 'DEF',
        oddsModifier: 2.0,
      },
      {
        id: 'pt-14',
        name: 'Nuno Valente',
        number: 14,
        position: 'DEF',
        oddsModifier: 2.0,
      },
      {
        id: 'pt-16',
        name: 'Ricardo Carvalho',
        number: 16,
        position: 'DEF',
        oddsModifier: 2.0,
      },
      {
        id: 'pt-17',
        name: 'Cristiano Ronaldo',
        number: 17,
        position: 'FWD',
        oddsModifier: 1.0,
      },
      {
        id: 'pt-18',
        name: 'Maniche',
        number: 18,
        position: 'MID',
        oddsModifier: 1.4,
      },
      {
        id: 'pt-20',
        name: 'Deco',
        number: 20,
        position: 'MID',
        oddsModifier: 1.3,
      },
      {
        id: 'pt-21',
        name: 'Nuno Gomes',
        number: 21,
        position: 'FWD',
        oddsModifier: 1.1,
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
        oddsModifier: 2.5,
      },
      {
        id: 'eng-2',
        name: 'G. Neville',
        number: 2,
        position: 'DEF',
        oddsModifier: 2.0,
      },
      {
        id: 'eng-3',
        name: 'A. Cole',
        number: 3,
        position: 'DEF',
        oddsModifier: 1.9,
      },
      {
        id: 'eng-4',
        name: 'Gerrard',
        number: 4,
        position: 'MID',
        oddsModifier: 1.2,
      },
      {
        id: 'eng-5',
        name: 'Terry',
        number: 5,
        position: 'DEF',
        oddsModifier: 2.0,
      },
      {
        id: 'eng-6',
        name: 'Campbell',
        number: 6,
        position: 'DEF',
        oddsModifier: 2.0,
      },
      {
        id: 'eng-7',
        name: 'Beckham',
        number: 7,
        position: 'MID',
        isCaptain: true,
        oddsModifier: 1.3,
      },
      {
        id: 'eng-8',
        name: 'Scholes',
        number: 8,
        position: 'MID',
        oddsModifier: 1.3,
      },
      {
        id: 'eng-9',
        name: 'Rooney',
        number: 9,
        position: 'FWD',
        oddsModifier: 1.0,
      },
      {
        id: 'eng-10',
        name: 'Owen',
        number: 10,
        position: 'FWD',
        oddsModifier: 1.1,
      },
      {
        id: 'eng-11',
        name: 'Lampard',
        number: 11,
        position: 'MID',
        oddsModifier: 1.3,
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
      oddsModifier: 2.5,
    },
    {
      id: 'pt-modern-2',
      name: 'João Cancelo',
      number: 20,
      position: 'DEF',
      oddsModifier: 1.8,
    },
    {
      id: 'pt-modern-3',
      name: 'Rúben Dias',
      number: 3,
      position: 'DEF',
      oddsModifier: 2.0,
    },
    {
      id: 'pt-modern-4',
      name: 'Pepe',
      number: 2,
      position: 'DEF',
      oddsModifier: 2.0,
    },
    {
      id: 'pt-modern-5',
      name: 'Nuno Mendes',
      number: 19,
      position: 'DEF',
      oddsModifier: 1.9,
    },
    {
      id: 'pt-modern-6',
      name: 'Bruno Fernandes',
      number: 8,
      position: 'MID',
      oddsModifier: 1.2,
    },
    {
      id: 'pt-modern-7',
      name: 'Bernardo Silva',
      number: 10,
      position: 'MID',
      oddsModifier: 1.2,
    },
    {
      id: 'pt-modern-8',
      name: 'João Félix',
      number: 11,
      position: 'MID',
      oddsModifier: 1.3,
    },
    {
      id: 'pt-modern-9',
      name: 'Cristiano Ronaldo',
      number: 7,
      position: 'FWD',
      isCaptain: true,
      oddsModifier: 1.0,
    },
    {
      id: 'pt-modern-10',
      name: 'Rafael Leão',
      number: 17,
      position: 'FWD',
      oddsModifier: 1.1,
    },
    {
      id: 'pt-modern-11',
      name: 'Gonçalo Ramos',
      number: 9,
      position: 'FWD',
      oddsModifier: 1.1,
    },
  ],
};

// France vs Greece - Euro 2004 Quarterfinal
export const FRANCE_GREECE_2004: MatchLineup = {
  matchId: 'france-greece-2004',
  team1: {
    teamName: 'France',
    players: [
      {
        id: 'fra-1',
        name: 'Landreau',
        number: 1,
        position: 'GK',
        oddsModifier: 2.5,
      },
      {
        id: 'fra-23',
        name: 'Coupet',
        number: 23,
        position: 'GK',
        oddsModifier: 2.5,
      },
      {
        id: 'fra-9',
        name: 'Saha',
        number: 9,
        position: 'FWD',
        oddsModifier: 1.1,
      },
      {
        id: 'fra-11',
        name: 'Wiltord',
        number: 11,
        position: 'FWD',
        oddsModifier: 1.2,
      },
      {
        id: 'fra-14',
        name: 'Rothen',
        number: 14,
        position: 'MID',
        oddsModifier: 1.4,
      },
      {
        id: 'fra-2',
        name: 'Boumsong',
        number: 2,
        position: 'DEF',
        oddsModifier: 2.0,
      },
      {
        id: 'fra-4',
        name: 'Vieira',
        number: 4,
        position: 'MID',
        isCaptain: true,
        oddsModifier: 1.5,
      },
      {
        id: 'fra-18',
        name: 'Pedretti',
        number: 18,
        position: 'MID',
        oddsModifier: 1.5,
      },
      {
        id: 'fra-19',
        name: 'Sagnol',
        number: 19,
        position: 'DEF',
        oddsModifier: 2.0,
      },
      {
        id: 'fra-21',
        name: 'Marlet',
        number: 21,
        position: 'FWD',
        oddsModifier: 1.2,
      },
      {
        id: 'fra-22',
        name: 'Govou',
        number: 22,
        position: 'FWD',
        oddsModifier: 1.2,
      },
    ],
  },
  team2: {
    teamName: 'Greece',
    players: [
      {
        id: 'gre-12',
        name: 'Chalkias',
        number: 12,
        position: 'GK',
        oddsModifier: 2.5,
      },
      {
        id: 'gre-13',
        name: 'Katergiannakis',
        number: 13,
        position: 'GK',
        oddsModifier: 2.5,
      },
      {
        id: 'gre-10',
        name: 'Tsiartas',
        number: 10,
        position: 'MID',
        oddsModifier: 1.3,
      },
      {
        id: 'gre-23',
        name: 'Lakis',
        number: 23,
        position: 'FWD',
        oddsModifier: 1.2,
      },
      {
        id: 'gre-3',
        name: 'Venetidis',
        number: 3,
        position: 'DEF',
        oddsModifier: 2.0,
      },
      {
        id: 'gre-4',
        name: 'Dabizas',
        number: 4,
        position: 'DEF',
        oddsModifier: 2.0,
      },
      {
        id: 'gre-8',
        name: 'Giannakopoulos',
        number: 8,
        position: 'MID',
        oddsModifier: 1.3,
      },
      {
        id: 'gre-16',
        name: 'Kafes',
        number: 16,
        position: 'MID',
        oddsModifier: 1.4,
      },
      {
        id: 'gre-17',
        name: 'Georgiadis',
        number: 17,
        position: 'MID',
        oddsModifier: 1.5,
      },
      {
        id: 'gre-18',
        name: 'Goumas',
        number: 18,
        position: 'MID',
        oddsModifier: 1.5,
      },
      {
        id: 'gre-22',
        name: 'Papadopoulos',
        number: 22,
        position: 'DEF',
        oddsModifier: 2.0,
      },
    ],
  },
};

// Sweden vs Netherlands - Euro 2004 Quarterfinal
export const SWEDEN_NETHERLANDS_2004: MatchLineup = {
  matchId: 'sweden-netherlands-2004',
  team1: {
    teamName: 'Sweden',
    players: [
      {
        id: 'swe-12',
        name: 'Hedman',
        number: 12,
        position: 'GK',
        oddsModifier: 2.5,
      },
      {
        id: 'swe-23',
        name: 'Kihlstedt',
        number: 23,
        position: 'GK',
        oddsModifier: 2.5,
      },
      {
        id: 'swe-16',
        name: 'Källström',
        number: 16,
        position: 'MID',
        oddsModifier: 1.3,
      },
      {
        id: 'swe-21',
        name: 'Wilhelmsson',
        number: 21,
        position: 'FWD',
        oddsModifier: 1.2,
      },
      {
        id: 'swe-2',
        name: 'Lucic',
        number: 2,
        position: 'DEF',
        oddsModifier: 2.0,
      },
      {
        id: 'swe-4',
        name: 'Mjällby',
        number: 4,
        position: 'DEF',
        isCaptain: true,
        oddsModifier: 2.0,
      },
      {
        id: 'swe-13',
        name: 'Pe. Hansson',
        number: 13,
        position: 'DEF',
        oddsModifier: 2.0,
      },
      {
        id: 'swe-17',
        name: 'Anders Andersson',
        number: 17,
        position: 'MID',
        oddsModifier: 1.4,
      },
      {
        id: 'swe-19',
        name: 'Farnerud',
        number: 19,
        position: 'MID',
        oddsModifier: 1.4,
      },
      {
        id: 'swe-20',
        name: 'Allbäck',
        number: 20,
        position: 'FWD',
        oddsModifier: 1.1,
      },
      {
        id: 'swe-22',
        name: 'Wahlstedt',
        number: 22,
        position: 'DEF',
        oddsModifier: 2.0,
      },
    ],
  },
  team2: {
    teamName: 'Netherlands',
    players: [
      {
        id: 'ned-13',
        name: 'Westerveld',
        number: 13,
        position: 'GK',
        oddsModifier: 2.5,
      },
      {
        id: 'ned-23',
        name: 'Waterreus',
        number: 23,
        position: 'GK',
        oddsModifier: 2.5,
      },
      {
        id: 'ned-4',
        name: 'Bouma',
        number: 4,
        position: 'DEF',
        oddsModifier: 2.0,
      },
      {
        id: 'ned-12',
        name: 'Makaay',
        number: 12,
        position: 'FWD',
        oddsModifier: 1.0,
      },
      {
        id: 'ned-18',
        name: 'Heitinga',
        number: 18,
        position: 'DEF',
        oddsModifier: 2.0,
      },
      {
        id: 'ned-9',
        name: 'Kluivert',
        number: 9,
        position: 'FWD',
        oddsModifier: 1.1,
      },
      {
        id: 'ned-11',
        name: 'Van der Vaart',
        number: 11,
        position: 'MID',
        oddsModifier: 1.2,
      },
      {
        id: 'ned-14',
        name: 'Sneijder',
        number: 14,
        position: 'MID',
        oddsModifier: 1.3,
      },
      {
        id: 'ned-16',
        name: 'Overmars',
        number: 16,
        position: 'MID',
        oddsModifier: 1.3,
      },
      {
        id: 'ned-17',
        name: 'Van Hooijdonk',
        number: 17,
        position: 'FWD',
        oddsModifier: 1.2,
      },
      {
        id: 'ned-21',
        name: 'Bosvelt',
        number: 21,
        position: 'MID',
        oddsModifier: 1.5,
      },
      {
        id: 'ned-22',
        name: 'Zenden',
        number: 22,
        position: 'MID',
        oddsModifier: 1.3,
      },
    ],
  },
};

// Czechia vs Denmark - Euro 2004 Quarterfinal
export const CZECHIA_DENMARK_2004: MatchLineup = {
  matchId: 'czechia-denmark-2004',
  team1: {
    teamName: 'Czechia',
    players: [
      {
        id: 'cze-16',
        name: 'Blažek',
        number: 16,
        position: 'GK',
        oddsModifier: 2.5,
      },
      {
        id: 'cze-23',
        name: 'Kinský',
        number: 23,
        position: 'GK',
        oddsModifier: 2.5,
      },
      {
        id: 'cze-2',
        name: 'Grygera',
        number: 2,
        position: 'DEF',
        oddsModifier: 2.0,
      },
      {
        id: 'cze-18',
        name: 'Heinz',
        number: 18,
        position: 'DEF',
        oddsModifier: 2.0,
      },
      {
        id: 'cze-22',
        name: 'Rozehnal',
        number: 22,
        position: 'DEF',
        oddsModifier: 2.0,
      },
      {
        id: 'cze-3',
        name: 'Mareš',
        number: 3,
        position: 'DEF',
        oddsModifier: 2.0,
      },
      {
        id: 'cze-7',
        name: 'Šmicer',
        number: 7,
        position: 'MID',
        oddsModifier: 1.3,
      },
      {
        id: 'cze-12',
        name: 'Lokvenc',
        number: 12,
        position: 'FWD',
        oddsModifier: 1.2,
      },
      {
        id: 'cze-14',
        name: 'Vachoušek',
        number: 14,
        position: 'MID',
        oddsModifier: 1.4,
      },
      {
        id: 'cze-17',
        name: 'Hübschman',
        number: 17,
        position: 'MID',
        oddsModifier: 1.4,
      },
      {
        id: 'cze-19',
        name: 'Týce',
        number: 19,
        position: 'MID',
        oddsModifier: 1.5,
      },
      {
        id: 'cze-20',
        name: 'Plašil',
        number: 20,
        position: 'MID',
        oddsModifier: 1.3,
      },
    ],
  },
  team2: {
    teamName: 'Denmark',
    players: [
      {
        id: 'den-16',
        name: 'Skov-Jensen',
        number: 16,
        position: 'GK',
        oddsModifier: 2.5,
      },
      {
        id: 'den-22',
        name: 'Andersen',
        number: 22,
        position: 'GK',
        oddsModifier: 2.5,
      },
      {
        id: 'den-19',
        name: 'Rommedahl',
        number: 19,
        position: 'MID',
        oddsModifier: 1.3,
      },
      {
        id: 'den-21',
        name: 'Madsen',
        number: 21,
        position: 'MID',
        oddsModifier: 1.3,
      },
      {
        id: 'den-23',
        name: 'Løvenkrands',
        number: 23,
        position: 'FWD',
        oddsModifier: 1.2,
      },
      {
        id: 'den-5',
        name: 'N.Jensen',
        number: 5,
        position: 'DEF',
        oddsModifier: 2.0,
      },
      {
        id: 'den-11',
        name: 'Sand',
        number: 11,
        position: 'FWD',
        oddsModifier: 1.1,
      },
      {
        id: 'den-12',
        name: 'Kahlenberg',
        number: 12,
        position: 'MID',
        oddsModifier: 1.3,
      },
      {
        id: 'den-13',
        name: 'Krøldrup',
        number: 13,
        position: 'DEF',
        oddsModifier: 2.0,
      },
      {
        id: 'den-15',
        name: 'Jensen',
        number: 15,
        position: 'MID',
        oddsModifier: 1.4,
      },
      {
        id: 'den-18',
        name: 'Priske',
        number: 18,
        position: 'DEF',
        oddsModifier: 2.0,
      },
      {
        id: 'den-20',
        name: 'Perez',
        number: 20,
        position: 'MID',
        oddsModifier: 1.4,
      },
    ],
  },
};

// Chelsea vs Arsenal - 30 Nov 2025, 16:30
export const CHELSEA_ARSENAL_2025: MatchLineup = {
  matchId: 'chelsea-arsenal-2025',
  team1: {
    teamName: 'Chelsea',
    players: [
      {
        id: 'che-1',
        name: 'R. Sanchez',
        number: 1,
        position: 'GK',
        oddsModifier: 2.5,
      },
      {
        id: 'che-27',
        name: 'M. Gusto',
        number: 27,
        position: 'DEF',
        oddsModifier: 2.0,
      },
      {
        id: 'che-29',
        name: 'W. Fofana',
        number: 29,
        position: 'DEF',
        oddsModifier: 2.0,
      },
      {
        id: 'che-23',
        name: 'T. Chalobah',
        number: 23,
        position: 'DEF',
        oddsModifier: 2.0,
      },
      {
        id: 'che-3',
        name: 'M. Cucurella',
        number: 3,
        position: 'DEF',
        oddsModifier: 1.9,
      },
      {
        id: 'che-24',
        name: 'R. James',
        number: 24,
        position: 'DEF',
        isCaptain: true,
        oddsModifier: 1.9,
      },
      {
        id: 'che-25',
        name: 'M. Caicedo',
        number: 25,
        position: 'MID',
        oddsModifier: 1.5,
      },
      {
        id: 'che-41',
        name: 'Estêvão',
        number: 41,
        position: 'MID',
        oddsModifier: 1.3,
      },
      {
        id: 'che-8',
        name: 'E. Fernández',
        number: 8,
        position: 'MID',
        oddsModifier: 1.4,
      },
      {
        id: 'che-49',
        name: 'A. Garnacho',
        number: 49,
        position: 'FWD',
        oddsModifier: 1.1,
      },
      {
        id: 'che-7',
        name: 'P. Neto',
        number: 7,
        position: 'FWD',
        oddsModifier: 1.2,
      },
      {
        id: 'che-12',
        name: 'F. Jorgensen',
        number: 12,
        position: 'GK',
        oddsModifier: 2.5,
      },
      {
        id: 'che-4',
        name: 'T. Adarabioyo',
        number: 4,
        position: 'DEF',
        oddsModifier: 2.0,
      },
      {
        id: 'che-5',
        name: 'B. Badiashile',
        number: 5,
        position: 'DEF',
        oddsModifier: 2.0,
      },
      {
        id: 'che-9',
        name: 'L. Delap',
        number: 9,
        position: 'FWD',
        oddsModifier: 1.2,
      },
      {
        id: 'che-11',
        name: 'J. Gittens',
        number: 11,
        position: 'FWD',
        oddsModifier: 1.2,
      },
      {
        id: 'che-17',
        name: 'A. Nascimento',
        number: 17,
        position: 'MID',
        oddsModifier: 1.4,
      },
      {
        id: 'che-20',
        name: 'J. Pedro',
        number: 20,
        position: 'FWD',
        oddsModifier: 1.2,
      },
      {
        id: 'che-21',
        name: 'J. Hato',
        number: 21,
        position: 'DEF',
        oddsModifier: 2.0,
      },
      {
        id: 'che-32',
        name: 'T. George',
        number: 32,
        position: 'MID',
        oddsModifier: 1.4,
      },
      {
        id: 'che-34',
        name: 'J. Acheampong',
        number: 34,
        position: 'DEF',
        oddsModifier: 2.0,
      },
      {
        id: 'che-38',
        name: 'M. Guiu',
        number: 38,
        position: 'FWD',
        oddsModifier: 1.3,
      },
      {
        id: 'che-40',
        name: 'F. Buonanotte',
        number: 40,
        position: 'MID',
        oddsModifier: 1.4,
      },
    ],
  },
  team2: {
    teamName: 'Arsenal',
    players: [
      {
        id: 'ars-1',
        name: 'D. Raya',
        number: 1,
        position: 'GK',
        oddsModifier: 2.5,
      },
      {
        id: 'ars-12',
        name: 'J. Timber',
        number: 12,
        position: 'DEF',
        oddsModifier: 2.0,
      },
      {
        id: 'ars-2',
        name: 'W. Saliba',
        number: 2,
        position: 'DEF',
        oddsModifier: 2.0,
      },
      {
        id: 'ars-3',
        name: 'C. Mosquera',
        number: 3,
        position: 'DEF',
        oddsModifier: 2.0,
      },
      {
        id: 'ars-49',
        name: 'M. Lewis-Skelly',
        number: 49,
        position: 'DEF',
        oddsModifier: 2.0,
      },
      {
        id: 'ars-10',
        name: 'E. Eze',
        number: 10,
        position: 'MID',
        oddsModifier: 1.3,
      },
      {
        id: 'ars-36',
        name: 'M. Zubimendi',
        number: 36,
        position: 'MID',
        oddsModifier: 1.5,
      },
      {
        id: 'ars-41',
        name: 'D. Rice',
        number: 41,
        position: 'MID',
        oddsModifier: 1.4,
      },
      {
        id: 'ars-7',
        name: 'B. Saka',
        number: 7,
        position: 'FWD',
        isCaptain: true,
        oddsModifier: 1.0,
      },
      {
        id: 'ars-23',
        name: 'M. Merino',
        number: 23,
        position: 'MID',
        oddsModifier: 1.3,
      },
      {
        id: 'ars-19',
        name: 'L. Trossard',
        number: 19,
        position: 'FWD',
        oddsModifier: 1.1,
      },
      {
        id: 'ars-13',
        name: 'K. Arrizabalaga',
        number: 13,
        position: 'GK',
        oddsModifier: 2.5,
      },
      {
        id: 'ars-35',
        name: 'T. Setford',
        number: 35,
        position: 'GK',
        oddsModifier: 2.5,
      },
      {
        id: 'ars-4',
        name: 'B. White',
        number: 4,
        position: 'DEF',
        oddsModifier: 2.0,
      },
      {
        id: 'ars-5',
        name: 'P. Hincapié',
        number: 5,
        position: 'DEF',
        oddsModifier: 2.0,
      },
      {
        id: 'ars-8',
        name: 'M. Ødegaard',
        number: 8,
        position: 'MID',
        oddsModifier: 1.2,
      },
      {
        id: 'ars-11',
        name: 'G. Martinelli',
        number: 11,
        position: 'FWD',
        oddsModifier: 1.1,
      },
      {
        id: 'ars-16',
        name: 'C. Norgaard',
        number: 16,
        position: 'MID',
        oddsModifier: 1.5,
      },
      {
        id: 'ars-20',
        name: 'N. Madueke',
        number: 20,
        position: 'FWD',
        oddsModifier: 1.2,
      },
      {
        id: 'ars-22',
        name: 'E. Nwaneri',
        number: 22,
        position: 'MID',
        oddsModifier: 1.4,
      },
      {
        id: 'ars-33',
        name: 'R. Calafiori',
        number: 33,
        position: 'DEF',
        oddsModifier: 2.0,
      },
    ],
  },
};

// Manchester City vs Leeds United - 2025
export const MANCHESTER_CITY_LEEDS_2025: MatchLineup = {
  matchId: 'manchester-city-leeds-2025',
  date: '2025-11-29T15:00:00',
  team1: {
    teamName: 'Manchester City',
    players: [
      {
        id: 'mci-1',
        name: 'J. Trafford',
        number: 1,
        position: 'GK',
        oddsModifier: 2.5,
      },
      {
        id: 'mci-45',
        name: 'A. Husanov',
        number: 45,
        position: 'DEF',
        oddsModifier: 2.0,
      },
      {
        id: 'mci-5',
        name: 'J. Stones',
        number: 5,
        position: 'DEF',
        isCaptain: true,
        oddsModifier: 2.0,
      },
      {
        id: 'mci-6',
        name: 'N. Aké',
        number: 6,
        position: 'DEF',
        oddsModifier: 2.0,
      },
      {
        id: 'mci-21',
        name: 'R. Ait Nouri',
        number: 21,
        position: 'DEF',
        oddsModifier: 1.9,
      },
      {
        id: 'mci-82',
        name: 'R. Lewis',
        number: 82,
        position: 'MID',
        oddsModifier: 1.5,
      },
      {
        id: 'mci-14',
        name: 'N. Gonzalez Iglesias',
        number: 14,
        position: 'MID',
        oddsModifier: 1.4,
      },
      {
        id: 'mci-4',
        name: 'T. Reijnders',
        number: 4,
        position: 'MID',
        oddsModifier: 1.4,
      },
      {
        id: 'mci-52',
        name: 'O. Bobb',
        number: 52,
        position: 'FWD',
        oddsModifier: 1.3,
      },
      {
        id: 'mci-7',
        name: 'O. Marmoush',
        number: 7,
        position: 'FWD',
        oddsModifier: 1.1,
      },
      {
        id: 'mci-26',
        name: 'Savinho',
        number: 26,
        position: 'FWD',
        oddsModifier: 1.2,
      },
    ],
  },
  team2: {
    teamName: 'Leeds United',
    players: [
      {
        id: 'lee-1',
        name: 'L. Perri',
        number: 1,
        position: 'GK',
        oddsModifier: 2.5,
      },
      {
        id: 'lee-2',
        name: 'J. Bogle',
        number: 2,
        position: 'DEF',
        oddsModifier: 2.0,
      },
      {
        id: 'lee-6',
        name: 'J. Rodon',
        number: 6,
        position: 'DEF',
        oddsModifier: 2.0,
      },
      {
        id: 'lee-5',
        name: 'P. Struijk',
        number: 5,
        position: 'DEF',
        oddsModifier: 2.0,
      },
      {
        id: 'lee-3',
        name: 'G. Gudmundsson',
        number: 3,
        position: 'DEF',
        oddsModifier: 1.9,
      },
      {
        id: 'lee-8',
        name: 'S. Longstaff',
        number: 8,
        position: 'MID',
        oddsModifier: 1.4,
      },
      {
        id: 'lee-4',
        name: 'E. Ampadu',
        number: 4,
        position: 'MID',
        isCaptain: true,
        oddsModifier: 1.5,
      },
      {
        id: 'lee-18',
        name: 'A. Stach',
        number: 18,
        position: 'MID',
        oddsModifier: 1.4,
      },
      {
        id: 'lee-11',
        name: 'B. Aaronson',
        number: 11,
        position: 'MID',
        oddsModifier: 1.3,
      },
      {
        id: 'lee-14',
        name: 'L. Nmecha',
        number: 14,
        position: 'FWD',
        oddsModifier: 1.1,
      },
      {
        id: 'lee-19',
        name: 'N. Okafor',
        number: 19,
        position: 'FWD',
        oddsModifier: 1.2,
      },
    ],
  },
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
      oddsModifier: 2.5,
    },
    {
      id: 'op-2',
      name: 'Right Back',
      number: 2,
      position: 'DEF',
      oddsModifier: 2.0,
    },
    {
      id: 'op-3',
      name: 'Center Back',
      number: 3,
      position: 'DEF',
      oddsModifier: 2.0,
    },
    {
      id: 'op-4',
      name: 'Center Back',
      number: 4,
      position: 'DEF',
      oddsModifier: 2.0,
    },
    {
      id: 'op-5',
      name: 'Left Back',
      number: 5,
      position: 'DEF',
      oddsModifier: 2.0,
    },
    {
      id: 'op-6',
      name: 'Midfielder',
      number: 6,
      position: 'MID',
      oddsModifier: 1.4,
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
      oddsModifier: 1.1,
    },
    {
      id: 'op-10',
      name: 'Forward',
      number: 11,
      position: 'FWD',
      oddsModifier: 1.2,
    },
    {
      id: 'op-11',
      name: 'Forward',
      number: 7,
      position: 'FWD',
      oddsModifier: 1.2,
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
  } else if (matchId === 'france-greece-2004') {
    lineup = FRANCE_GREECE_2004;
  } else if (matchId === 'sweden-netherlands-2004') {
    lineup = SWEDEN_NETHERLANDS_2004;
  } else if (matchId === 'czechia-denmark-2004') {
    lineup = CZECHIA_DENMARK_2004;
  } else if (matchId === 'chelsea-arsenal-2025') {
    lineup = CHELSEA_ARSENAL_2025;
  } else if (matchId === 'manchester-city-leeds-2025') {
    lineup = MANCHESTER_CITY_LEEDS_2025;
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
