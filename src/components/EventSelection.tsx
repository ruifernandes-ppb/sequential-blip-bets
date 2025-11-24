import {
  Trophy,
  Clock,
  ArrowRight,
  Users,
  Target,
  Receipt,
} from 'lucide-react';
import { Match } from '../App';
import { Button } from './ui/button';
import { useBetStore } from '../stores/useBetStore';
import FlutterIcon from './FlutterIcon';

interface EventSelectionProps {
  onMatchSelect: (match: Match) => void;
  onViewFriendsStats?: () => void;
  onPenaltyShootout?: () => void;
  onViewMyBets?: () => void;
}

const LIVE_MATCHES: Match[] = [
  {
    id: 'portugal-england-2004',
    player1: 'Portugal',
    player2: 'England',
    player1Sets: 0,
    player2Sets: 0,
    player1Games: 0,
    player2Games: 0,
    player1Points: '0',
    player2Points: '0',
    currentSet: 1,
    tournament: 'UEFA Euro 2004',
    isLive: true,
  },
  {
    id: 2,
    player1: 'France',
    player2: 'Greece',
    player1Sets: 1,
    player2Sets: 0,
    player1Games: 0,
    player2Games: 0,
    player1Points: '0',
    player2Points: '0',
    currentSet: 2,
    tournament: 'UEFA Euro 2004',
    isLive: true,
  },
];

const UPCOMING_MATCHES: Match[] = [
  {
    id: 3,
    player1: 'Sweden',
    player2: 'Netherlands',
    player1Sets: 0,
    player2Sets: 0,
    player1Games: 0,
    player2Games: 0,
    player1Points: '0',
    player2Points: '0',
    currentSet: 0,
    tournament: 'UEFA Nations League',
    isLive: false,
  },
  {
    id: 4,
    player1: 'Czech Republic',
    player2: 'Denmark',
    player1Sets: 0,
    player2Sets: 0,
    player1Games: 0,
    player2Games: 0,
    player1Points: '0',
    player2Points: '0',
    currentSet: 0,
    tournament: 'International Friendly',
    isLive: false,
  },
];

export function EventSelection({
  onMatchSelect,
  onViewFriendsStats,
  onPenaltyShootout,
  onViewMyBets,
}: EventSelectionProps) {
  const placedBets = useBetStore((state) => state.placedBets);
  const activeBetsCount = placedBets.filter(
    (bet) => bet.status === 'pending' || bet.status === 'live'
  ).length;

  return (
    <div className='min-h-screen flex flex-col p-4 max-w-md mx-auto'>
      {/* Header */}
      <div className='text-center mb-8 mt-6'>
        <div className='flex flex-col items-center justify-center gap-2 mb-2'>
          {/* <Trophy className='w-8 h-8 text-cyan-400' /> */}
          <FlutterIcon />
          <h1 className='text-white text-2xl'>Sequential Betting</h1>
        </div>
        <p className='text-gray-400'>Bet on the story, not just the score</p>
      </div>

      {/* Penalty Shootout Special */}
      {onPenaltyShootout && placedBets.length > 0 && (
        <div className='mb-6'>
          <button
            onClick={onPenaltyShootout}
            className='w-full bg-gradient-to-br from-yellow-600 to-orange-600 rounded-2xl p-6 border-2 border-yellow-400/50 hover:border-yellow-400 transition-all active:scale-[0.98] relative overflow-hidden'
          >
            {/* Animated background */}
            <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse' />

            <div className='relative'>
              <div className='flex items-center justify-center gap-2 mb-2'>
                <Trophy className='w-6 h-6 text-yellow-200' />
                <span className='text-white font-bold'>SPECIAL EVENT</span>
                <Trophy className='w-6 h-6 text-yellow-200' />
              </div>

              <h2 className='text-white text-xl mb-2'>
                🏆 UEFA Euro 2004 Quarter-finals 🏆
              </h2>
              <p className='text-yellow-100 text-sm mb-3'>
                Penalty Shootout Challenge
              </p>

              <div className='flex items-center justify-center gap-4 mb-3'>
                <div className='text-center'>
                  <div className='text-2xl mb-1'>🇵🇹</div>
                  <p className='text-white text-xs'>Portugal</p>
                </div>
                <div className='flex flex-col items-center'>
                  <Target className='w-6 h-6 text-yellow-200 mb-1' />
                  <p className='text-yellow-200 text-xs'>VS</p>
                </div>
                <div className='text-center'>
                  <div className='text-2xl mb-1'>🏴󠁧󠁢󠁥󠁮󠁧󠁿</div>
                  <p className='text-white text-xs'>England</p>
                </div>
              </div>

              <div className='bg-black/20 rounded-lg p-3'>
                <p className='text-yellow-100 text-xs mb-2'>
                  ⚽ Predict each penalty: Score or Miss
                </p>
              </div>

              <div className='mt-3 flex items-center justify-center gap-2'>
                <span className='text-yellow-200 text-sm font-bold'>
                  Start Shootout
                </span>
                <ArrowRight className='w-4 h-4 text-yellow-200' />
              </div>
            </div>
          </button>
        </div>
      )}

      {/* My Bets Button - Less highlighted */}
      {onViewMyBets && (
        <div className='mb-6'>
          <Button
            onClick={onViewMyBets}
            className='w-full bg-[#1a2f4d] hover:bg-[#243a5c] border border-cyan-500/30 hover:border-cyan-500/50 text-white rounded-xl p-4 transition-all active:scale-[0.98]'
          >
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <Receipt className='w-5 h-5 text-cyan-400' />
                <div className='text-left'>
                  <span className='text-white block text-sm'>
                    View My Bets{' '}
                    {activeBetsCount > 0 && (
                      <span className='text-cyan-400 text-xs'>
                        ({activeBetsCount} active bet
                        {activeBetsCount !== 1 ? 's' : ''})
                      </span>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </Button>
        </div>
      )}

      {/* Live Badge */}
      <div className='flex items-center gap-2 mb-4'>
        <div className='flex items-center gap-2 bg-red-500 px-3 py-1 rounded-full'>
          <div className='w-2 h-2 bg-white rounded-full animate-pulse' />
          <span className='text-white text-sm'>LIVE NOW</span>
        </div>
        <span className='text-gray-400 text-sm'>
          {LIVE_MATCHES.length} matches
        </span>
      </div>

      {/* Live Matches List */}
      <div className='space-y-3 mb-8'>
        {LIVE_MATCHES.map((match) => (
          <button
            key={match.id}
            onClick={() => onMatchSelect(match)}
            className='w-full bg-gradient-to-br from-[#1a2f4d] to-[#0f1f3d] rounded-2xl p-4 border border-cyan-500/30 hover:border-cyan-500/60 transition-all active:scale-[0.98]'
          >
            {/* League */}
            <div className='flex items-center justify-between mb-3'>
              <span className='text-gray-400 text-xs'>{match.tournament}</span>
              <div className='flex items-center gap-1'>
                <div className='flex items-center gap-1 text-red-400'>
                  <div className='w-2 h-2 bg-red-400 rounded-full animate-pulse' />
                  <span className='text-xs'>LIVE</span>
                </div>
              </div>
            </div>

            {/* Teams and Score */}
            <div className='flex items-center justify-between mb-3'>
              <div className='flex-1 text-left'>
                <p className='text-white mb-1'>{match.player1}</p>
                <p className='text-white'>{match.player2}</p>
              </div>
              <div className='flex flex-col items-center mx-4'>
                <span className='text-white text-2xl'>{match.player1Sets}</span>
                <span className='text-white text-2xl'>{match.player2Sets}</span>
              </div>
              <ArrowRight className='w-5 h-5 text-cyan-400' />
            </div>

            {/* CTA */}
            <div className='flex items-center justify-center gap-2 pt-2 border-t border-gray-700'>
              <span className='text-cyan-400 text-sm'>Build your sequence</span>
            </div>
          </button>
        ))}
      </div>

      {/* Upcoming Matches Badge */}
      <div className='flex items-center gap-2 mb-4'>
        <div className='flex items-center gap-2 bg-[#1a2f4d] px-3 py-1 rounded-full border border-cyan-500/30'>
          <Clock className='w-3 h-3 text-cyan-400' />
          <span className='text-white text-sm'>UPCOMING MATCHES</span>
        </div>
        <span className='text-gray-400 text-sm'>
          {UPCOMING_MATCHES.length} matches
        </span>
      </div>

      {/* Upcoming Matches List */}
      <div className='space-y-3 flex-1'>
        {UPCOMING_MATCHES.map((match) => (
          <button
            key={match.id}
            onClick={() => onMatchSelect(match)}
            className='w-full bg-gradient-to-br from-[#1a2f4d] to-[#0f1f3d] rounded-2xl p-4 border border-cyan-500/30 hover:border-cyan-500/60 transition-all active:scale-[0.98]'
          >
            {/* League */}
            <div className='flex items-center justify-between mb-3'>
              <span className='text-gray-400 text-xs'>{match.tournament}</span>
              <div className='flex items-center gap-1 text-cyan-400'>
                <Clock className='w-3 h-3' />
                <span className='text-xs'>Coming soon</span>
              </div>
            </div>

            {/* Teams */}
            <div className='flex items-center justify-between mb-3'>
              <div className='flex-1 text-left'>
                <p className='text-white mb-1'>{match.player1}</p>
                <p className='text-white'>{match.player2}</p>
              </div>
              <div className='flex flex-col items-center mx-4'>
                <span className='text-gray-500 text-sm'>vs</span>
              </div>
              <ArrowRight className='w-5 h-5 text-cyan-400' />
            </div>

            {/* CTA */}
            <div className='flex items-center justify-center gap-2 pt-2 border-t border-gray-700'>
              <span className='text-cyan-400 text-sm'>Prepare sequence</span>
            </div>
          </button>
        ))}
      </div>

      {/* Info Footer */}
      <div className='mt-6 bg-[#1a2f4d]/50 rounded-xl p-4 border border-cyan-500/20'>
        <p className='text-gray-300 text-sm text-center'>
          Create your storyline with sequential outcomes. Each event adds
          tension and potential reward.
        </p>
      </div>

      {/* Friends Stats Button */}
      {onViewFriendsStats && (
        <div className='mt-4'>
          <Button
            onClick={onViewFriendsStats}
            className='w-full bg-gradient-to-br from-[#1a2f4d] to-[#0f1f3d] rounded-2xl p-4 border border-cyan-500/30 hover:border-cyan-500/60 transition-all active:scale-[0.98]'
          >
            <div className='flex items-center justify-center gap-2'>
              <Users className='w-5 h-5 text-cyan-400' />
              <span className='text-cyan-400 text-sm'>View Friends Stats</span>
            </div>
          </Button>
        </div>
      )}
    </div>
  );
}
