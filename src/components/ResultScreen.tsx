import { Trophy, TrendingUp, Target, ArrowRight } from 'lucide-react';
import { BetResult, Match } from '../App';
import { Button } from './ui/button';

interface ResultScreenProps {
  totalRuns: number;
  onGoToOverview: () => void;
  finalWinnings: number;
  initialStake: number;
}

export function ResultScreen({
  totalRuns,
  onGoToOverview,
  finalWinnings,
  initialStake,
}: ResultScreenProps) {
  const netProfit = finalWinnings - initialStake;
  const isProfitable = netProfit > 0;

  return (
    <div className='min-h-screen flex flex-col p-4 max-w-md mx-auto'>
      {/* Header */}
      <div className='text-center mb-8 mt-6'>
        <Trophy
          className={`w-16 h-16 mx-auto mb-4 ${
            isProfitable ? 'text-yellow-400' : 'text-gray-400'
          }`}
        />
        <h1 className='text-white text-2xl mb-2'>
          {isProfitable ? 'Great Performance!' : 'Good Try!'}
        </h1>
        <p className='text-gray-400'>Sequence complete</p>
      </div>

      {/* Main Stats */}
      <div className='space-y-3 mb-6'>
        {/* Final Winnings */}
        <div
          className={`rounded-2xl p-6 border-2 ${
            isProfitable
              ? 'bg-gradient-to-br from-green-900/40 to-emerald-900/40 border-green-500'
              : 'bg-gradient-to-br from-red-900/40 to-orange-900/40 border-red-500'
          }`}
        >
          <p className='text-gray-300 text-sm mb-2'>Final Balance</p>
          <p
            className={`text-4xl mb-2 ${
              isProfitable ? 'text-green-400' : 'text-red-400'
            }`}
          >
            €{finalWinnings.toFixed(2)}
          </p>
          {finalWinnings > 0 && (
            <div className='flex items-center gap-2'>
              <span
                className={`text-sm ${
                  isProfitable ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {isProfitable ? '+' : ''}€{netProfit.toFixed(2)} (
                {isProfitable ? '+' : ''}
                {((netProfit / initialStake) * 100).toFixed(0)}%)
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Performance Breakdown */}
      <div className='bg-[#1a2f4d]/50 rounded-xl p-4 mb-6 border border-cyan-500/20'>
        <h3 className='text-white mb-3 flex items-center gap-2'>
          <TrendingUp className='w-4 h-4 text-cyan-400' />
          Summary
        </h3>
        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <span className='text-gray-400 text-sm'>Initial Stake</span>
            <span className='text-white text-sm'>
              €{initialStake.toFixed(2)}
            </span>
          </div>
          <div className='flex items-center justify-between'>
            <span className='text-gray-400 text-sm'>Total runs</span>
            <span className='text-white text-sm'>{totalRuns}</span>
          </div>
          <div className='flex items-center justify-between pt-2 border-t border-gray-700'>
            <span className='text-gray-300'>Net Profit/Loss</span>
            <span
              className={`${isProfitable ? 'text-green-400' : 'text-red-400'}`}
            >
              {isProfitable
                ? `+€${netProfit.toFixed(2)}`
                : `-${initialStake.toFixed(2)}`}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className='space-y-3 mt-auto'>
        <Button
          onClick={onGoToOverview}
          className='w-full bg-gradient-to-br from-[#1a2f4d] to-[#0f1f3d] border border-cyan-500/30 hover:border-cyan-500/60 text-white py-6 rounded-2xl'
        >
          <div className='flex items-center justify-center gap-2'>
            <ArrowRight className='w-5 h-5 text-cyan-400' />
            <span>Back to Main Menu</span>
          </div>
        </Button>
      </div>
    </div>
  );
}
