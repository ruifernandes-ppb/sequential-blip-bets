import { useState, useEffect } from 'react';
import {
  X,
  Trophy,
  Zap,
  GripVertical,
  Clock,
  TrendingUp,
  Plus,
  EuroIcon,
  BarChart3,
  Target,
} from 'lucide-react';
import { Match, SequenceOutcome, BetResult } from '../App';
import { Button } from './ui/button';
import { PlayerSelector } from './PlayerSelector';
import { OutcomeList } from './OutcomeList';
import { OUTCOME_TEMPLATES, OutcomeTemplate } from '../data/outcomeTemplates';
import { useBetStore } from '../stores/useBetStore';

interface LiveWatchingProps {
  match: Match;
  initialSequence: SequenceOutcome[];
  initialStake: number;
  onComplete: (history: BetResult[], winnings: number, points: number) => void;
  onBack: () => void;
}

interface Player {
  id: string;
  name: string;
  number: number;
  position: string;
  team: 'player1' | 'player2';
}

export function LiveWatching({
  match,
  initialSequence,
  initialStake,
  onComplete,
  onBack,
}: LiveWatchingProps) {
  const [sequence, setSequence] = useState<SequenceOutcome[]>(initialSequence);
  const [currentWinnings, setCurrentWinnings] = useState(0); // Track profit, starts at 0
  const [totalPoints, setTotalPoints] = useState(0);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showPlayerSelector, setShowPlayerSelector] = useState(false);
  const [pendingTemplate, setPendingTemplate] =
    useState<OutcomeTemplate | null>(null);
  const [sequenceAttempts, setSequenceAttempts] = useState(0);
  const [successfulRuns, setSuccessfulRuns] = useState(0);
  const [failedRuns, setFailedRuns] = useState(0);
  const [gameTimeRemaining, setGameTimeRemaining] = useState(180); // 3 minutes = 180 seconds

  const recordSequenceAttempt = useBetStore((state) => state.recordSequenceAttempt);
  const sequenceStats = useBetStore((state) => state.sequenceStats);

  const CORRECT_PENALTY_MULTIPLIER = 1; // Keep 100% of winnings
  const WRONG_ANSWER_PENALTY = 0.85; // Keep 85% of winnings

  useEffect(() => {
    // Start processing outcomes after a brief delay
    const startTimer = setTimeout(() => {
      processNextOutcome();
    }, 2000);

    return () => clearTimeout(startTimer);
  }, []);

  useEffect(() => {
    // Game timer countdown
    const gameTimer = setInterval(() => {
      setGameTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(gameTimer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(gameTimer);
  }, []);

  // Separate effect to handle game end
  useEffect(() => {
    if (gameTimeRemaining === 0) {
      // Game ended, show results
      const history: BetResult[] = sequence
        .filter((o) => o.status === 'success' || o.status === 'failed')
        .map((o) => ({
          outcomeId: o.id,
          description: o.description,
          correct: o.result || false,
          selectedOdds: o.odds,
        }));
      onComplete(history, currentWinnings, totalPoints);
    }
  }, [gameTimeRemaining, currentWinnings, totalPoints, sequence, onComplete]);

  const processNextOutcome = () => {
    setSequence((currentSequence) => {
      const nextPending = currentSequence.find((o) => o.status === 'pending');
      if (!nextPending) return currentSequence;

      // Set to checking state
      const updatedSequence = currentSequence.map((o) =>
        o.id === nextPending.id ? { ...o, status: 'checking' as const } : o
      );

      // Simulate checking with countdown
      let timeRemaining = nextPending.timeLimit;
      const checkInterval = setInterval(() => {
        timeRemaining--;

        if (timeRemaining <= 0) {
          clearInterval(checkInterval);
          resolveOutcome(nextPending);
        }
      }, 1000);

      return updatedSequence;
    });
  };

  const resolveOutcome = (outcome: SequenceOutcome) => {
    // Randomly determine if outcome happened (60% success rate for demo)
    const happened = Math.random() > 0.4;

    setSequence((prev) => {
      const updatedSequence = prev.map((o) =>
        o.id === outcome.id
          ? { ...o, status: happened ? ('success' as const) : ('failed' as const), result: happened }
          : o
      );

      // Update winnings and points
      if (happened) {
        setTotalPoints((prev) => prev + 100);
      } else {
        // On failure, restart the sequence
        setTotalPoints((prev) => Math.max(0, prev - 50));

        // Record failed sequence attempt
        setSequenceAttempts((prev) => prev + 1);
        setFailedRuns((prev) => prev + 1);
        recordSequenceAttempt(false, 0, initialStake);
      }

      if (!happened) {
        // Restart sequence after a delay
        setTimeout(() => {
          // Reset all outcomes back to pending
          setSequence((prev) =>
            prev.map((o) => ({
              ...o,
              status: 'pending' as const,
              result: undefined,
            }))
          );
          // Start processing again
          setTimeout(() => {
            processNextOutcome();
          }, 1000);
        }, 2000);
        return updatedSequence;
      }

      // Check if all outcomes are successful
      const allResolved = updatedSequence.every(
        (o) => o.status === 'success'
      );

      if (allResolved) {
        // Sequence complete! Calculate profit based on odds and length
        // 1. Multiply all odds together to get final odd
        const finalOdd = updatedSequence.reduce((acc, o) => acc * o.odds, 1);

        // 2. Calculate bonus multiplier for sequences longer than 3 steps
        const lengthBonus = updatedSequence.length > 3
          ? 0.05 * (updatedSequence.length - 3)
          : 0;

        // 3. Calculate profit: stake * finalOdd * (1 + lengthBonus)
        const profit = initialStake * finalOdd * (1 + lengthBonus);

        setCurrentWinnings((prev) => prev + profit);

        // Record successful sequence
        setSequenceAttempts((prev) => prev + 1);
        setSuccessfulRuns((prev) => prev + 1);
        recordSequenceAttempt(true, profit, initialStake);

        // Reset sequence to pending and continue playing until timer runs out
        setTimeout(() => {
          setSequence((prev) =>
            prev.map((o) => ({
              ...o,
              status: 'pending' as const,
              result: undefined,
            }))
          );
          // Start next sequence
          setTimeout(() => {
            processNextOutcome();
          }, 1000);
        }, 2000);
      } else {
        // Process next outcome after a short delay
        setTimeout(() => {
          processNextOutcome();
        }, 500);
      }

      return updatedSequence;
    });
  };

  const handleDragStart = (index: number) => {
    const outcome = sequence[index];
    if (outcome.status !== 'pending') return; // Only allow dragging pending outcomes
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const draggedOutcome = sequence[draggedIndex];
    const targetOutcome = sequence[index];

    // Only allow reordering pending outcomes
    if (
      draggedOutcome.status !== 'pending' ||
      targetOutcome.status !== 'pending'
    )
      return;

    const newSequence = [...sequence];
    const draggedItem = newSequence[draggedIndex];
    newSequence.splice(draggedIndex, 1);
    newSequence.splice(index, 0, draggedItem);

    setSequence(newSequence);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleOutcomeClick = (template: OutcomeTemplate) => {
    if (template.allowPlayerSelection) {
      setPendingTemplate(template);
      setShowPlayerSelector(true);
    } else {
      addOutcome(template, null);
    }
  };

  const handlePlayerSelect = (player: Player) => {
    if (pendingTemplate) {
      addOutcome(pendingTemplate, player);
      setPendingTemplate(null);
      setShowAddMenu(false);
    }
  };

  const addOutcome = (template: OutcomeTemplate, player: Player | null) => {
    let processedDescription = template.description
      .replace('{player1}', match.player1)
      .replace('{player2}', match.player2);

    if (player) {
      processedDescription = processedDescription.replace(
        '{playerName}',
        player.name
      );
    }

    const newOutcome: SequenceOutcome = {
      id: `${template.id}-${Date.now()}`,
      category: template.category,
      description: processedDescription,
      odds: template.odds,
      timeLimit: template.timeLimit,
      status: 'pending',
    };

    setSequence((prev) => [...prev, newOutcome]);
    setShowAddMenu(false);
  };

  const categoryIcons = {
    'team-goals': '⚽',
    'team-fouls': '🟨',
    'player-attacking': '⚡',
    'player-fouls': '🚨',
    'player-defensive': '🛡️',
    'player-penalty': '🎯',
    'player-goalkeeper': '🧤',
  };

  const completedCount = sequence.filter(
    (o) => o.status === 'success' || o.status === 'failed'
  ).length;
  const pendingCount = sequence.filter((o) => o.status === 'pending').length;
  const successCount = sequence.filter((o) => o.status === 'success').length;

  // Calculate current streak
  let currentStreak = 0;
  for (let i = 0; i < sequence.length; i++) {
    if (sequence[i].status === 'success') {
      currentStreak++;
    } else if (sequence[i].status === 'failed') {
      currentStreak = 0;
    } else {
      break; // Stop at pending/checking
    }
  }

  return (
    <div className='min-h-screen flex flex-col p-4 max-w-md mx-auto pb-6'>
      {/* Header */}
      <div className='flex items-center justify-between mb-6 mt-2'>
        <div className='flex-1'>
          <h1 className='text-white'>Live Timeline</h1>
          <p className='text-gray-400 text-sm'>
            {match.player1} vs {match.player2} • Set {match.currentSet}
          </p>
        </div>
        <div className='flex items-center gap-3'>
          <div className='bg-orange-500/20 border border-orange-500/40 rounded-lg px-3 py-1.5'>
            <div className='flex items-center gap-1.5'>
              <Clock className='w-4 h-4 text-orange-400' />
              <span className='text-orange-400 text-sm font-bold'>
                {Math.floor(gameTimeRemaining / 60)}:{String(gameTimeRemaining % 60).padStart(2, '0')}
              </span>
            </div>
          </div>
          <button onClick={onBack} className='text-white p-2'>
            <X className='w-5 h-5' />
          </button>
        </div>
      </div>

      {/* Session Statistics Card */}
      <div className='bg-gradient-to-br from-purple-900/40 to-indigo-900/40 rounded-2xl p-4 mb-4 border border-purple-500/30'>
        <div className='flex items-center gap-2 mb-3'>
          <BarChart3 className='w-4 h-4 text-purple-400' />
          <h3 className='text-white text-sm'>Session Overview</h3>
        </div>
        <div className='grid grid-cols-3 gap-3'>
          <div className='bg-black/20 rounded-xl p-3'>
            <div className='flex items-center gap-1 mb-1'>
              <EuroIcon className='w-3 h-3 text-gray-400' />
              <span className='text-gray-400 text-xs'>Initial Bet</span>
            </div>
            <span className='text-white text-lg'>
              €{initialStake.toFixed(2)}
            </span>
          </div>

          <div className='bg-black/20 rounded-xl p-3'>
            <div className='flex items-center gap-1 mb-1'>
              <Trophy className='w-3 h-3 text-cyan-400' />
              <span className='text-gray-400 text-xs'>Earned</span>
            </div>
            <span className={`text-lg ${currentWinnings >= 0 ? 'text-cyan-400' : 'text-red-400'}`}>
              €{currentWinnings.toFixed(2)}
            </span>
            <p className='text-gray-500 text-xs mt-1'>
              profit
            </p>
          </div>

          <div className='bg-black/20 rounded-xl p-3'>
            <div className='flex items-center gap-1 mb-1'>
              <Target className='w-3 h-3 text-green-400' />
              <span className='text-gray-400 text-xs'>Runs</span>
            </div>
            <div className='flex items-center gap-2'>
              <span className='text-green-400 text-lg'>{successfulRuns}</span>
              <span className='text-gray-500 text-xs'>/</span>
              <span className='text-red-400 text-lg'>{failedRuns}</span>
            </div>
            <p className='text-gray-500 text-xs mt-1'>
              success / failed
            </p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className='flex-1 overflow-y-auto mb-4'>
        <div className='flex items-center justify-between mb-3'>
          <h3 className='text-white text-sm'>Your Timeline</h3>
          {pendingCount > 0 && (
            <p className='text-gray-400 text-xs'>Drag pending to reorder</p>
          )}
        </div>

        <div className='space-y-3'>
          {sequence.map((outcome, index) => {
            const isPending = outcome.status === 'pending';
            const isChecking = outcome.status === 'checking';
            const isSuccess = outcome.status === 'success';
            const isFailed = outcome.status === 'failed';

            return (
              <div
                key={outcome.id}
                draggable={isPending}
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`
                  flex items-center gap-3 rounded-xl p-4 transition-all
                  ${isPending
                    ? 'bg-[#1a2f4d] border border-gray-600 cursor-move hover:bg-[#243a5c]'
                    : ''
                  }
                  ${isChecking
                    ? 'bg-gradient-to-r from-orange-600/30 to-yellow-600/30 border-2 border-orange-400 animate-pulse'
                    : ''
                  }
                  ${isSuccess
                    ? 'bg-gradient-to-r from-green-600/30 to-emerald-600/30 border-2 border-green-400'
                    : ''
                  }
                  ${isFailed
                    ? 'bg-gradient-to-r from-red-600/30 to-rose-600/30 border-2 border-red-400'
                    : ''
                  }
                  ${draggedIndex === index ? 'opacity-50' : ''}
                `}
              >
                {/* Drag Handle or Status Icon */}
                <div className='flex-shrink-0'>
                  {isPending && (
                    <GripVertical className='w-4 h-4 text-gray-500' />
                  )}
                  {isChecking && (
                    <div className='w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center'>
                      <Clock className='w-4 h-4 text-white animate-spin' />
                    </div>
                  )}
                  {isSuccess && (
                    <div className='w-8 h-8 rounded-full bg-green-500 flex items-center justify-center'>
                      <span className='text-white text-lg'>✓</span>
                    </div>
                  )}
                  {isFailed && (
                    <div className='w-8 h-8 rounded-full bg-red-500 flex items-center justify-center'>
                      <X className='w-5 h-5 text-white' />
                    </div>
                  )}
                </div>

                {/* Step Number */}
                <div
                  className={`
                  flex items-center justify-center w-8 h-8 rounded-full text-sm flex-shrink-0
                  ${isPending ? 'bg-gray-600 text-gray-300' : ''}
                  ${isChecking ? 'bg-orange-500 text-white' : ''}
                  ${isSuccess ? 'bg-green-500 text-white' : ''}
                  ${isFailed ? 'bg-red-500 text-white' : ''}
                `}
                >
                  {index + 1}
                </div>

                {/* Description */}
                <div className='flex-1 min-w-0'>
                  <p
                    className={`text-sm mb-1 ${isPending ? 'text-gray-300' : 'text-white'
                      }`}
                  >
                    {outcome.description}
                  </p>
                  <div className='flex items-center gap-2'>
                    <span
                      className={`text-xs ${isSuccess
                        ? 'text-green-300'
                        : isFailed
                          ? 'text-red-300'
                          : 'text-gray-400'
                        }`}
                    >
                      {outcome.odds.toFixed(2)}x
                    </span>
                    {isChecking && (
                      <>
                        <span className='text-gray-500 text-xs'>•</span>
                        <span className='text-gray-400 text-xs'>
                          Checking...
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Icon */}
                <span
                  className={`text-2xl ${isPending ? 'opacity-50' : 'opacity-100'
                    }`}
                >
                  {categoryIcons[outcome.category]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Selection Button */}
      {!showAddMenu && (
        <Button
          onClick={() => setShowAddMenu(true)}
          variant='outline'
          className='w-full border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 py-6 rounded-2xl bg-transparent mt-2'
        >
          <div className='flex items-center justify-center gap-2'>
            <Plus className='w-5 h-5' />
            <span>Add more outcomes</span>
          </div>
        </Button>
      )}

      {/* Add Selection Menu */}
      {showAddMenu && (
        <div className='fixed inset-0 bg-black/70 z-50 flex items-end'>
          <div className='bg-gradient-to-b from-[#1e3a5f] to-[#0f1f3d] w-full max-h-[70vh] rounded-t-3xl p-4 overflow-y-auto'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-white'>Add outcome</h3>
              <button
                onClick={() => setShowAddMenu(false)}
                className='text-white p-2'
              >
                <X className='w-5 h-5' />
              </button>
            </div>

            <OutcomeList
              match={match}
              outcomeTemplates={OUTCOME_TEMPLATES}
              onOutcomeClick={handleOutcomeClick}
              showCategories={true}
            />
          </div>
        </div>
      )}

      {/* Player Selector */}
      {showPlayerSelector && pendingTemplate && (
        <PlayerSelector
          isOpen={showPlayerSelector}
          onClose={() => {
            setShowPlayerSelector(false);
            setPendingTemplate(null);
          }}
          onSelectPlayer={handlePlayerSelect}
          team1Name={match.player1}
          team2Name={match.player2}
          bothTeams={pendingTemplate.playerSelectionTeam === 'both'}
          teamFilter={
            pendingTemplate.playerSelectionTeam !== 'both'
              ? pendingTemplate.playerSelectionTeam
              : undefined
          }
        />
      )}
    </div>
  );
}
