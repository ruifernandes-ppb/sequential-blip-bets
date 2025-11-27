import {
  ArrowLeft,
  Trophy,
  TrendingUp,
  Target,
  Flame,
  DollarSign,
  Award,
  Medal,
  EuroIcon,
} from 'lucide-react';
import { Button } from './ui/button';

interface FriendsStatsProps {
  onBack: () => void;
}

interface FriendStats {
  id: number;
  name: string;
  avatar: string;
  totalBets: number;
  betsWon: number;
  winRate: number;
  totalWinnings: number;
  currentStreak: number;
  longestStreak: number;
  rank: number;
}

const FRIENDS_DATA: FriendStats[] = [
  {
    id: 1,
    name: 'Mike Johnson',
    avatar: '👨',
    totalBets: 147,
    betsWon: 98,
    winRate: 67,
    totalWinnings: 1847.5,
    currentStreak: 8,
    longestStreak: 12,
    rank: 1,
  },
  {
    id: 2,
    name: 'Sarah Chen',
    avatar: '👩',
    totalBets: 132,
    betsWon: 92,
    winRate: 70,
    totalWinnings: 1654.25,
    currentStreak: 5,
    longestStreak: 15,
    rank: 2,
  },
  {
    id: 3,
    name: 'Alex Kim',
    avatar: '🧑',
    totalBets: 89,
    betsWon: 62,
    winRate: 70,
    totalWinnings: 1245.8,
    currentStreak: 0,
    longestStreak: 9,
    rank: 3,
  },
  {
    id: 4,
    name: 'Emma Davis',
    avatar: '👩‍🦰',
    totalBets: 156,
    betsWon: 87,
    winRate: 56,
    totalWinnings: 982.4,
    currentStreak: 2,
    longestStreak: 7,
    rank: 4,
  },
  {
    id: 5,
    name: 'Jordan Lee',
    avatar: '🧑‍🦱',
    totalBets: 78,
    betsWon: 51,
    winRate: 65,
    totalWinnings: 876.3,
    currentStreak: 3,
    longestStreak: 8,
    rank: 5,
  },
  {
    id: 6,
    name: 'You',
    avatar: '😎',
    totalBets: 64,
    betsWon: 42,
    winRate: 66,
    totalWinnings: 745.9,
    currentStreak: 1,
    longestStreak: 6,
    rank: 6,
  },
];

export function FriendsStats({ onBack }: FriendsStatsProps) {
  const getRankColor = (rank: number) => {
    if (rank === 1) return 'from-yellow-400 to-orange-400';
    if (rank === 2) return 'from-gray-300 to-gray-400';
    if (rank === 3) return 'from-amber-600 to-amber-700';
    return 'from-cyan-400 to-cyan-500';
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className='w-5 h-5 text-yellow-400' />;
    if (rank === 2) return <Medal className='w-5 h-5 text-gray-400' />;
    if (rank === 3) return <Award className='w-5 h-5 text-amber-600' />;
    return null;
  };

  const topByWinRate = [...FRIENDS_DATA]
    .sort((a, b) => b.winRate - a.winRate)
    .slice(0, 3);
  const topByStreak = [...FRIENDS_DATA]
    .sort((a, b) => b.currentStreak - a.currentStreak)
    .slice(0, 3);

  return (
    <div className='min-h-screen flex flex-col p-4 max-w-md mx-auto'>
      {/* Header */}
      <div className='flex items-center gap-3 mb-6 mt-2'>
        <button onClick={onBack} className='text-white p-2'>
          <ArrowLeft className='w-5 h-5' />
        </button>
        <div className='flex-1'>
          <h1 className='text-white'>Friends Leaderboard</h1>
          <p className='text-gray-400 text-sm'>See who's on top</p>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className='grid grid-cols-2 gap-3 mb-6'>
        <div className='bg-gradient-to-br from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-xl p-4'>
          <div className='flex items-center gap-2 mb-2'>
            <Target className='w-4 h-4 text-green-400' />
            <span className='text-green-400 text-xs'>Top Win Rate</span>
          </div>
          <div className='space-y-1'>
            {topByWinRate.map((friend, idx) => (
              <div key={friend.id} className='flex items-center gap-2'>
                <span className='text-lg'>{friend.avatar}</span>
                <span className='text-white text-xs flex-1'>
                  {friend.name.split(' ')[0]}
                </span>
                <span className='text-green-400 text-xs'>
                  {friend.winRate}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className='bg-gradient-to-br from-orange-600/20 to-red-600/20 border border-orange-500/30 rounded-xl p-4'>
          <div className='flex items-center gap-2 mb-2'>
            <Flame className='w-4 h-4 text-orange-400' />
            <span className='text-orange-400 text-xs'>Hot Streak</span>
          </div>
          <div className='space-y-1'>
            {topByStreak.map((friend, idx) => (
              <div key={friend.id} className='flex items-center gap-2'>
                <span className='text-lg'>{friend.avatar}</span>
                <span className='text-white text-xs flex-1'>
                  {friend.name.split(' ')[0]}
                </span>
                <span className='text-orange-400 text-xs'>
                  {friend.currentStreak}🔥
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Leaderboard */}
      <div className='flex-1 overflow-y-auto'>
        <div className='flex items-center gap-2 mb-3'>
          <TrendingUp className='w-4 h-4 text-cyan-400' />
          <h3 className='text-white'>Total Winnings</h3>
        </div>

        <div className='space-y-2'>
          {FRIENDS_DATA.map((friend) => {
            const isCurrentUser = friend.name === 'You';

            return (
              <div
                key={friend.id}
                className={`bg-gradient-to-br from-[#1a2f4d] to-[#0f1f3d] rounded-xl p-4 border transition-all ${
                  isCurrentUser
                    ? 'border-cyan-500 shadow-lg shadow-cyan-500/20'
                    : 'border-gray-700/30'
                }`}
              >
                {/* Header Row */}
                <div className='flex items-center gap-3 mb-3'>
                  {/* Rank */}
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br ${getRankColor(
                      friend.rank
                    )} flex-shrink-0`}
                  >
                    {friend.rank <= 3 ? (
                      <span className='text-white'>
                        {getRankIcon(friend.rank)}
                      </span>
                    ) : (
                      <span className='text-white text-sm'>#{friend.rank}</span>
                    )}
                  </div>

                  {/* Avatar & Name */}
                  <div className='flex items-center gap-2 flex-1'>
                    <span className='text-3xl'>{friend.avatar}</span>
                    <div>
                      <p className='text-white'>{friend.name}</p>
                      <p className='text-gray-400 text-xs'>
                        {friend.totalBets} bets • {friend.betsWon} won
                      </p>
                    </div>
                  </div>

                  {/* Total Winnings */}
                  <div className='text-right'>
                    <div className='flex items-center gap-1 mb-1'>
                      <EuroIcon className='w-4 h-4 text-green-400' />
                      <span className='text-green-400'>
                        {friend.totalWinnings.toFixed(2)}
                      </span>
                    </div>
                    <p className='text-gray-400 text-xs'>
                      {friend.winRate}% win rate
                    </p>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className='grid grid-cols-3 gap-2 pt-3 border-t border-gray-700'>
                  <div className='bg-[#0f1f3d] rounded-lg p-2'>
                    <p className='text-gray-400 text-xs mb-1'>Current</p>
                    <div className='flex items-center gap-1'>
                      <Flame className='w-3 h-3 text-orange-400' />
                      <span className='text-white text-sm'>
                        {friend.currentStreak}
                      </span>
                    </div>
                  </div>
                  <div className='bg-[#0f1f3d] rounded-lg p-2'>
                    <p className='text-gray-400 text-xs mb-1'>Best</p>
                    <div className='flex items-center gap-1'>
                      <Trophy className='w-3 h-3 text-yellow-400' />
                      <span className='text-white text-sm'>
                        {friend.longestStreak}
                      </span>
                    </div>
                  </div>
                  <div className='bg-[#0f1f3d] rounded-lg p-2'>
                    <p className='text-gray-400 text-xs mb-1'>Accuracy</p>
                    <div className='flex items-center gap-1'>
                      <Target className='w-3 h-3 text-cyan-400' />
                      <span className='text-white text-sm'>
                        {friend.winRate}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Back Button */}
      <Button
        onClick={onBack}
        className='w-full bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-500 hover:to-blue-500 text-[#0a1628] py-6 rounded-2xl mt-4 shadow-lg shadow-cyan-500/50'
      >
        <div className='flex items-center justify-center gap-2'>
          <ArrowLeft className='w-5 h-5' />
          <span>Back to Matches</span>
        </div>
      </Button>
    </div>
  );
}
