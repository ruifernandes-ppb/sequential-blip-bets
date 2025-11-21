import { X, Share2, Bell } from 'lucide-react';
import { BetResult, Match } from '../App';
import { Button } from './ui/button';

interface ResultScreenProps {
  match: Match;
  betHistory: BetResult[];
  totalPoints: number;
  correctAnswers: number;
  onPlayAgain: () => void;
  onGoToOverview: () => void;
  finalWinnings: number;
  initialStake: number;
}

export function ResultScreen({
  match,
  betHistory,
  totalPoints,
  correctAnswers,
  onPlayAgain,
  onGoToOverview,
  finalWinnings,
  initialStake,
}: ResultScreenProps) {
  const maxPoints = betHistory.length * 100;
  const hatTricks = Math.floor(correctAnswers / 3);
  const leaderboardRanking = Math.floor(Math.random() * 2000) + 1000;
  const topPercentage = Math.floor(Math.random() * 30) + 70;
  const lastBetCorrect =
    betHistory.length > 0 && betHistory[betHistory.length - 1].correct;
  const profit = finalWinnings - initialStake;

  return (
    <div className='min-h-screen flex flex-col p-4 max-w-md mx-auto'>
      {/* Header */}
      <div className='flex items-center justify-between mb-6 mt-2'>
        <div className='flex-1'></div>
        <h1 className='text-white'>Live Betting</h1>
        <button className='text-white p-2'>
          <Share2 className='w-5 h-5' />
        </button>
      </div>

      {/* Result Title */}
      <div className='text-center mb-8'>
        <h2 className='text-white text-4xl mb-3'>
          {lastBetCorrect ? 'LUCKY!' : 'UNLUCKY!'}
        </h2>
        <p className='text-gray-300'>
          {lastBetCorrect
            ? 'Great job! You made it through all the bets!'
            : 'Try again soon – and see if you can go one better.'}
        </p>
      </div>

      {/* Financial Summary */}
      <div className='bg-gradient-to-br from-[#1a2f4d] to-[#0f1f3d] rounded-3xl p-6 mb-4 border border-cyan-500/30'>
        <h3 className='text-white mb-4 text-center'>Your Winnings</h3>
        <div className='text-center mb-4'>
          <div className='text-5xl text-cyan-400 mb-2'>
            €{finalWinnings.toFixed(2)}
          </div>
          <div
            className={`text-sm ${
              profit >= 0 ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {profit >= 0 ? '+' : ''}€{profit.toFixed(2)} (
            {profit >= 0 ? 'Profit' : 'Loss'})
          </div>
        </div>
        <div className='flex justify-between text-sm pt-3 border-t border-gray-700'>
          <span className='text-gray-400'>Initial Stake:</span>
          <span className='text-white'>€{initialStake.toFixed(2)}</span>
        </div>
      </div>

      {/* Notification Card */}
      <div className='bg-[#1a2f4d] rounded-3xl p-6 mb-6 relative overflow-hidden'>
        <div className='flex items-start justify-between'>
          <div className='flex-1'>
            <h3 className='text-white mb-2'>
              Get Daily Quiz reminders and leaderboard updates!
            </h3>
            <button className='text-cyan-400 hover:text-cyan-300 transition-colors'>
              Turn on notifications
            </button>
          </div>
          <div className='ml-4'>
            <div className='relative'>
              <Bell className='w-12 h-12 text-cyan-400' />
              <div className='absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse' />
            </div>
            {/* Decorative sparkles */}
            <div className='absolute top-0 right-0 text-green-400 opacity-60'>
              <svg className='w-8 h-8' viewBox='0 0 24 24' fill='currentColor'>
                <path d='M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5z' />
              </svg>
            </div>
            <div className='absolute bottom-2 right-8 text-cyan-400 opacity-40'>
              <svg className='w-6 h-6' viewBox='0 0 24 24' fill='currentColor'>
                <path d='M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5z' />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <Button
        onClick={onPlayAgain}
        className='w-full bg-cyan-400 hover:bg-cyan-500 text-[#0a1628] py-6 rounded-2xl mb-3'
      >
        Play again
      </Button>

      <Button
        onClick={onGoToOverview}
        variant='outline'
        className='w-full border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 py-6 rounded-2xl bg-transparent'
      >
        Go to main page
      </Button>
    </div>
  );
}
