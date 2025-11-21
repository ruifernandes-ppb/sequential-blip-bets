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
} from 'lucide-react';
import { Match, SequenceOutcome, BetResult } from '../App';
import { Button } from './ui/button';
import { PlayerSelector } from './PlayerSelector';
import { OutcomeList } from './OutcomeList';
import { OUTCOME_TEMPLATES, OutcomeTemplate } from '../data/outcomeTemplates';

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
  const [currentWinnings, setCurrentWinnings] = useState(initialStake);
  const [totalPoints, setTotalPoints] = useState(0);
  const [adrenalineLevel, setAdrenalineLevel] = useState(0);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showPlayerSelector, setShowPlayerSelector] = useState(false);
  const [pendingTemplate, setPendingTemplate] =
    useState<OutcomeTemplate | null>(null);

  const CORRECT_PENALTY_MULTIPLIER = 1; // Keep 100% of winnings
  const WRONG_ANSWER_PENALTY = 0.85; // Keep 85% of winnings

  useEffect(() => {
    // Start processing outcomes after a brief delay
    const startTimer = setTimeout(() => {
      processNextOutcome();
    }, 2000);

    return () => clearTimeout(startTimer);
  }, []);

  const processNextOutcome = () => {
    const nextPending = sequence.find((o) => o.status === 'pending');
    if (!nextPending) return;

    // Set to checking state
    setSequence((prev) =>
      prev.map((o) =>
        o.id === nextPending.id ? { ...o, status: 'checking' as const } : o
      )
    );
    setIsProcessing(true);

    // Simulate checking with countdown
    let timeRemaining = nextPending.timeLimit;
    const checkInterval = setInterval(() => {
      timeRemaining--;

      if (timeRemaining <= 3) {
        setAdrenalineLevel((prev) => Math.min(100, prev + 5));
      }

      if (timeRemaining <= 0) {
        clearInterval(checkInterval);
        resolveOutcome(nextPending);
      }
    }, 1000);
  };

  const resolveOutcome = (outcome: SequenceOutcome) => {
    // Randomly determine if outcome happened (60% success rate for demo)
    const happened = Math.random() > 0.4;

    setSequence((prev) =>
      prev.map((o) =>
        o.id === outcome.id
          ? { ...o, status: happened ? 'success' : 'failed', result: happened }
          : o
      )
    );

    // Update winnings - each bet is independent
    if (happened) {
      const winAmount = currentWinnings * outcome.odds;
      setCurrentWinnings(winAmount);
      setTotalPoints((prev) => prev + 100);
      setAdrenalineLevel((prev) => Math.min(100, prev + 15));
    } else {
      const penaltyAmount = currentWinnings * WRONG_ANSWER_PENALTY;
      setCurrentWinnings(penaltyAmount);
      setTotalPoints((prev) => Math.max(0, prev - 50));
      setAdrenalineLevel((prev) => Math.max(0, prev - 10));
    }

    setIsProcessing(false);

    // Check if all outcomes are resolved
    const updatedSequence = sequence.map((o) =>
      o.id === outcome.id
        ? { ...o, status: happened ? 'success' : 'failed', result: happened }
        : o
    );

    const allResolved = updatedSequence.every(
      (o) => o.status === 'success' || o.status === 'failed'
    );

    if (allResolved) {
      // Complete the sequence with streak bonuses
      const history: BetResult[] = updatedSequence.map((o) => ({
        outcomeId: o.id,
        description: o.description,
        correct: o.result || false,
        selectedOdds: o.odds,
      }));

      setTimeout(() => {
        // Calculate final winnings with streak bonuses
        let finalWinnings = initialStake;

        // Process each outcome
        updatedSequence.forEach((o) => {
          if (o.result) {
            finalWinnings *= o.odds;
          } else {
            finalWinnings *= WRONG_ANSWER_PENALTY;
          }
        });

        // Calculate streak bonuses
        let maxStreak = 0;
        let streakBonuses = 0;

        updatedSequence.forEach((o, idx) => {
          if (o.result) {
            maxStreak++;

            // Apply streak bonuses for consecutive correct
            if (maxStreak === 2) {
              streakBonuses += finalWinnings * 0.1; // +10% bonus
            } else if (maxStreak === 3) {
              streakBonuses += finalWinnings * 0.1; // additional +10% (20% total)
            } else if (maxStreak >= 4) {
              streakBonuses += finalWinnings * 0.1; // additional +10% (30% total)
            }
          } else {
            maxStreak = 0;
          }
        });

        // All correct bonus
        const allCorrect = updatedSequence.every((o) => o.result);
        if (allCorrect && updatedSequence.length > 0) {
          streakBonuses += finalWinnings * (updatedSequence.length * 0.2);
        }

        const totalWithBonuses = finalWinnings + streakBonuses;

        onComplete(history, totalWithBonuses, totalPoints);
      }, 2000);
    } else {
      // Process next outcome immediately if correct, delay if wrong
      const delayTime = happened ? 500 : 1500;
      setTimeout(() => {
        processNextOutcome();
      }, delayTime);
    }
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

  const handleCashout = () => {
    const resolvedOutcomes = sequence.filter(
      (o) => o.status === 'success' || o.status === 'failed'
    );
    const history: BetResult[] = resolvedOutcomes.map((o) => ({
      outcomeId: o.id,
      description: o.description,
      correct: o.result || false,
      selectedOdds: o.odds,
    }));

    onComplete(history, currentWinnings, totalPoints);
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
        <button onClick={onBack} className='text-white p-2'>
          <X className='w-5 h-5' />
        </button>
      </div>

      {/* Stats */}
      <div className='bg-gradient-to-br from-[#1a2f4d] to-[#0f1f3d] rounded-2xl p-4 mb-4 border border-cyan-500/30'>
        <div className='grid grid-cols-3 gap-3'>
          <div className='text-center'>
            <div className='flex items-center justify-center gap-1 mb-1'>
              <EuroIcon className='w-3 h-3 text-gray-400' />
              <span className='text-gray-400 text-xs'>Your bet</span>
            </div>
            <span className='text-white text-sm'>
              €{initialStake.toFixed(2)}
            </span>
          </div>

          <div className='text-center'>
            <div className='flex items-center justify-center gap-1 mb-1'>
              <Trophy className='w-3 h-3 text-cyan-400' />
              <span className='text-gray-400 text-xs'>Potential Returns</span>
            </div>
            <span className='text-cyan-400'>€{currentWinnings.toFixed(2)}</span>
            {sequence.length > 3 && (
              <p className='text-green-400 text-xs mt-0.5'>
                +{(sequence.length - 3) * 5}% boost
              </p>
            )}
          </div>

          <div className='text-center'>
            <div className='flex items-center justify-center gap-1 mb-1'>
              <TrendingUp className='w-3 h-3 text-green-400' />
              <span className='text-gray-400 text-xs'>Progress</span>
            </div>
            <span className='text-white text-sm'>
              {completedCount}/{sequence.length}
            </span>
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

        {/* Streak Indicator */}
        {currentStreak >= 2 && (
          <div className='mb-3 bg-gradient-to-r from-yellow-600/30 to-orange-600/30 border-2 border-yellow-400 rounded-xl p-3 animate-pulse'>
            <div className='flex items-center justify-center gap-2'>
              <span className='text-2xl'>🔥</span>
              <div>
                <p className='text-yellow-300 text-sm'>
                  {currentStreak} in a row!
                </p>
                <p className='text-yellow-400 text-xs'>
                  {currentStreak === 2 && '+10% streak bonus'}
                  {currentStreak === 3 && '+20% streak bonus'}
                  {currentStreak >= 4 && '+30% streak bonus'}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className='space-y-3'>
          {sequence.map((outcome, index) => {
            const isPending = outcome.status === 'pending';
            const isChecking = outcome.status === 'checking';
            const isSuccess = outcome.status === 'success';
            const isFailed = outcome.status === 'failed';

            return (
              <div
                key={outcome.id}
                draggable={isPending && !isProcessing}
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`
                  flex items-center gap-3 rounded-xl p-4 transition-all
                  ${
                    isPending
                      ? 'bg-[#1a2f4d] border border-gray-600 cursor-move hover:bg-[#243a5c]'
                      : ''
                  }
                  ${
                    isChecking
                      ? 'bg-gradient-to-r from-orange-600/30 to-yellow-600/30 border-2 border-orange-400 animate-pulse'
                      : ''
                  }
                  ${
                    isSuccess
                      ? 'bg-gradient-to-r from-green-600/30 to-emerald-600/30 border-2 border-green-400'
                      : ''
                  }
                  ${
                    isFailed
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
                    className={`text-sm mb-1 ${
                      isPending ? 'text-gray-300' : 'text-white'
                    }`}
                  >
                    {outcome.description}
                  </p>
                  <div className='flex items-center gap-2'>
                    <span
                      className={`text-xs ${
                        isSuccess
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
                  className={`text-2xl ${
                    isPending ? 'opacity-50' : 'opacity-100'
                  }`}
                >
                  {categoryIcons[outcome.category]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Suggestion */}
      {pendingCount > 0 && !isProcessing && (
        <div className='bg-purple-600/20 border border-purple-500/30 rounded-xl p-3 mb-4'>
          <div className='flex items-start gap-2'>
            <Zap className='w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0' />
            <div>
              <p className='text-purple-300 text-xs mb-1'>AI Momentum Tip</p>
              <p className='text-white text-sm'>
                {/* {successCount >= 2
                  ? "You're on fire! Consider cashing out to secure profits." */}
                Reorder your timeline based on current match momentum.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Cash Out Button */}
      {completedCount > 0 && (
        <Button
          onClick={handleCashout}
          variant='outline'
          className='w-full border-2 border-green-500 text-green-400 hover:bg-green-500/10 py-6 rounded-2xl bg-transparent'
        >
          <div className='flex items-center justify-center gap-2'>
            <Trophy className='w-5 h-5' />
            <span>Cash Out Now (€{currentWinnings.toFixed(2)})</span>
          </div>
        </Button>
      )}

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
