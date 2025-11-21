export interface PopularSequence {
  name: string;
  outcomes: string[];
  bettors: number;
  winRate: number;
}

export interface FriendSequence {
  name: string;
  outcomes: string[];
  friendName: string;
  friendAvatar: string;
  status: 'live' | 'completed';
  result?: 'won' | 'lost';
}

export const POPULAR_SEQUENCES: PopularSequence[] = [
  {
    name: 'High Pressure Match',
    outcomes: ['team-commits-foul', 'team-receives-yellow', 'team-scores-goal'],
    bettors: 1923,
    winRate: 72,
  },
  {
    name: 'Corner to Goal',
    outcomes: [
      'team-wins-corner',
      'player-shot-on-target',
      'player-scores-goal',
    ],
    bettors: 1654,
    winRate: 65,
  },
  {
    name: 'Attacking Masterclass',
    outcomes: [
      'player-gives-assist',
      'player-scores-goal',
      'player-shot-on-target',
    ],
    bettors: 1876,
    winRate: 70,
  },
];

export const FRIEND_SEQUENCES: FriendSequence[] = [
  {
    name: "Sarah's Pick",
    outcomes: [
      'team-scores-goal',
      'team-wins-corner',
      'team-creates-big-chance',
    ],
    friendName: 'Sarah Chen',
    friendAvatar: '👩',
    status: 'live',
  },
  {
    name: "Mike's Streak",
    outcomes: [
      'player-shot-on-target',
      'player-scores-goal',
      'player-gives-assist',
    ],
    friendName: 'Mike Johnson',
    friendAvatar: '👨',
    status: 'completed',
    result: 'won',
  },
  {
    name: "Alex's Bold",
    outcomes: [
      'team-scores-free-kick',
      'team-receives-yellow',
      'player-scores-goal',
    ],
    friendName: 'Alex Kim',
    friendAvatar: '🧑',
    status: 'live',
  },
  {
    name: "Emma's Risk",
    outcomes: [
      'player-wins-penalty',
      'player-misses-penalty',
      'team-concedes-corner',
    ],
    friendName: 'Emma Davis',
    friendAvatar: '👩‍🦰',
    status: 'completed',
    result: 'lost',
  },
  {
    name: "David's Defense",
    outcomes: [
      'player-intercepts-attack',
      'goalkeeper-makes-save',
      'player-tackles-in-box',
    ],
    friendName: 'David Martinez',
    friendAvatar: '👨‍🦱',
    status: 'live',
  },
  {
    name: "Lisa's Long Shot",
    outcomes: [
      'player-scores-outside-box',
      'team-hits-post',
      'team-scores-goal',
    ],
    friendName: 'Lisa Wang',
    friendAvatar: '👩‍',
    status: 'completed',
    result: 'won',
  },
];
