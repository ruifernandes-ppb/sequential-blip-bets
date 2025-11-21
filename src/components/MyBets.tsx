import { ArrowLeft, Clock, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import { useBets } from '../contexts/BetContext';
import { Button } from './ui/button';

interface MyBetsProps {
  onBack: () => void;
}

export function MyBets({ onBack }: MyBetsProps) {
  const { placedBets } = useBets();

  const activeBets = placedBets.filter(bet => bet.status === 'pending' || bet.status === 'live');
  const completedBets = placedBets.filter(bet => bet.status === 'completed');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live':
        return 'text-red-400 bg-red-500/20';
      case 'pending':
        return 'text-yellow-400 bg-yellow-500/20';
      case 'completed':
        return 'text-green-400 bg-green-500/20';
      default:
        return 'text-gray-400 bg-gray-500/20';
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-4 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 mt-2">
        <button onClick={onBack} className="text-white p-2">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-white">My Bets</h1>
          <p className="text-gray-400 text-sm">{placedBets.length} total bets</p>
        </div>
      </div>

      {placedBets.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
          <div className="bg-[#1a2f4d] rounded-full p-6 mb-4">
            <TrendingUp className="w-12 h-12 text-cyan-400" />
          </div>
          <h2 className="text-white text-xl mb-2">No bets yet</h2>
          <p className="text-gray-400 mb-6 max-w-xs">
            Start by selecting a match and building your first betting sequence!
          </p>
          <Button
            onClick={onBack}
            className="bg-cyan-400 hover:bg-cyan-500 text-[#0a1628] px-8 py-3 rounded-xl"
          >
            Browse matches
          </Button>
        </div>
      )}

      {placedBets.length > 0 && (
        <>
          {/* Active Bets */}
          {activeBets.length > 0 && (
            <div className="mb-6">
              <h2 className="text-white mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                Active Bets ({activeBets.length})
              </h2>
              <div className="space-y-3">
                {activeBets.map((bet) => (
                  <div
                    key={bet.id}
                    className="bg-gradient-to-br from-[#1a2f4d] to-[#0f1f3d] rounded-2xl p-4 border border-cyan-500/30"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <p className="text-white mb-1">{bet.matchName}</p>
                        <p className="text-gray-400 text-xs">
                          {new Date(bet.timestamp).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(bet.status)}`}>
                        {bet.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="space-y-2 mb-3">
                      {bet.sequence.map((outcome, idx) => (
                        <div
                          key={outcome.id}
                          className="flex items-center gap-2 text-sm"
                        >
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                            outcome.status === 'success' ? 'bg-green-500/20 text-green-400' :
                            outcome.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                            outcome.status === 'checking' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {idx + 1}
                          </div>
                          <p className="text-gray-300 flex-1">{outcome.description}</p>
                          <span className="text-cyan-400 text-xs">{outcome.odds.toFixed(2)}x</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                      <span className="text-gray-400 text-sm">Stake</span>
                      <span className="text-white">€{bet.initialStake.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Completed Bets */}
          {completedBets.length > 0 && (
            <div>
              <h2 className="text-white mb-3">
                Completed Bets ({completedBets.length})
              </h2>
              <div className="space-y-3">
                {completedBets.map((bet) => {
                  const profit = bet.finalWinnings ? bet.finalWinnings - bet.initialStake : 0;
                  const isWin = profit > 0;

                  return (
                    <div
                      key={bet.id}
                      className="bg-gradient-to-br from-[#1a2f4d] to-[#0f1f3d] rounded-2xl p-4 border border-gray-700/30"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <p className="text-white mb-1">{bet.matchName}</p>
                          <p className="text-gray-400 text-xs">
                            {new Date(bet.timestamp).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        {isWin ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-400" />
                        )}
                      </div>

                      <div className="space-y-2 mb-3">
                        {bet.betHistory?.map((result, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 text-sm"
                          >
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                              result.correct ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                            }`}>
                              {result.correct ? '✓' : '✗'}
                            </div>
                            <p className="text-gray-300 flex-1">{result.description}</p>
                            <span className="text-cyan-400 text-xs">{result.selectedOdds.toFixed(2)}x</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-3 border-t border-gray-700 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400 text-sm">Initial stake</span>
                          <span className="text-white">€{bet.initialStake.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400 text-sm">Final winnings</span>
                          <span className={isWin ? 'text-green-400' : 'text-red-400'}>
                            €{bet.finalWinnings?.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400 text-sm">Profit/Loss</span>
                          <span className={isWin ? 'text-green-400' : 'text-red-400'}>
                            {profit >= 0 ? '+' : ''}€{profit.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
