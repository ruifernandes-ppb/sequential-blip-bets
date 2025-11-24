import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Target,
  CheckCircle,
  XCircle,
  Trophy,
  Timer,
} from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';

interface PenaltyShootoutProps {
  onBack: () => void;
  onComplete: (
    winnings: number,
    correctPredictions: number,
    totalPenalties: number
  ) => void;
}

interface Penalty {
  id: number;
  team: 'Portugal' | 'England';
  player: string;
  status: 'pending' | 'active' | 'completed';
  result?: boolean; // true = scored, false = missed
  historicalResult: boolean; // The actual historical result
  userPrediction?: boolean;
  correct?: boolean;
}

const PENALTY_SHOOTOUT: Penalty[] = [
  {
    id: 1,
    team: 'England',
    player: 'David Beckham',
    status: 'pending',
    historicalResult: false,
  },
  {
    id: 2,
    team: 'Portugal',
    player: 'Deco',
    status: 'pending',
    historicalResult: true,
  },
  {
    id: 3,
    team: 'England',
    player: 'Michael Owen',
    status: 'pending',
    historicalResult: true,
  },
  {
    id: 4,
    team: 'Portugal',
    player: 'Simão Sabrosa',
    status: 'pending',
    historicalResult: true,
  },
  {
    id: 5,
    team: 'England',
    player: 'Frank Lampard',
    status: 'pending',
    historicalResult: true,
  },
  {
    id: 6,
    team: 'Portugal',
    player: 'Rui Costa',
    status: 'pending',
    historicalResult: false,
  },
  {
    id: 7,
    team: 'England',
    player: 'John Terry',
    status: 'pending',
    historicalResult: true,
  },
  {
    id: 8,
    team: 'Portugal',
    player: 'Cristiano Ronaldo',
    status: 'pending',
    historicalResult: true,
  },
  {
    id: 9,
    team: 'England',
    player: 'Owen Hargreaves',
    status: 'pending',
    historicalResult: true,
  },
  {
    id: 10,
    team: 'Portugal',
    player: 'Maniche',
    status: 'pending',
    historicalResult: true,
  },
  {
    id: 11,
    team: 'England',
    player: 'Ashley Cole',
    status: 'pending',
    historicalResult: true,
  },
  {
    id: 12,
    team: 'Portugal',
    player: 'Hélder Postiga',
    status: 'pending',
    historicalResult: true,
  },
  {
    id: 13,
    team: 'England',
    player: 'Darius Vassell',
    status: 'pending',
    historicalResult: false,
  },
  {
    id: 14,
    team: 'Portugal',
    player: 'Ricardo',
    status: 'pending',
    historicalResult: true,
  },
];

const DECISION_TIME = 10; // seconds per decision
const ODDS_PER_PENALTY = 1.35;

export function PenaltyShootout({ onBack, onComplete }: PenaltyShootoutProps) {
  const [penalties, setPenalties] = useState<Penalty[]>(PENALTY_SHOOTOUT);
  const [currentPenaltyIndex, setCurrentPenaltyIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(DECISION_TIME);
  const [hasDecided, setHasDecided] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [betAmount, setBetAmount] = useState<string>('10');
  const [initialStake, setInitialStake] = useState(0);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [potentialWinnings, setPotentialWinnings] = useState(0);
  const [portugalScore, setPortugalScore] = useState(0);
  const [englandScore, setEnglandScore] = useState(0);
  const [phase, setPhase] = useState<
    'setup' | 'deciding' | 'watching' | 'finished'
  >('setup');
  const [hasLost, setHasLost] = useState(false);

  const currentPenalty = penalties[currentPenaltyIndex];
  const isLastPenalty = currentPenaltyIndex === penalties.length - 1;

  // Timer countdown
  useEffect(() => {
    if (phase === 'deciding' && !hasDecided && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (phase === 'deciding' && timeRemaining === 0 && !hasDecided) {
      // Auto-skip if time runs out
      handlePrediction(true); // Default to "will score"
    }
  }, [timeRemaining, hasDecided, phase]);

  const handlePrediction = (willScore: boolean) => {
    if (hasDecided) return;

    setHasDecided(true);

    // Update penalty with prediction
    const updatedPenalties = [...penalties];
    updatedPenalties[currentPenaltyIndex] = {
      ...updatedPenalties[currentPenaltyIndex],
      userPrediction: willScore,
      status: 'active',
    };
    setPenalties(updatedPenalties);

    // Move to watching phase
    setPhase('watching');
  };

  const simulatePenaltyResult = () => {
    // Use historical result instead of random simulation
    const scored = penalties[currentPenaltyIndex].historicalResult;

    const updatedPenalties = [...penalties];
    const penalty = updatedPenalties[currentPenaltyIndex];
    const correct = penalty.userPrediction === scored;

    updatedPenalties[currentPenaltyIndex] = {
      ...penalty,
      result: scored,
      correct: correct,
      status: 'completed',
    };

    setPenalties(updatedPenalties);

    // Update scores
    if (scored) {
      if (penalty.team === 'Portugal') {
        setPortugalScore(portugalScore + 1);
      } else {
        setEnglandScore(englandScore + 1);
      }
    }

    // Update balance
    if (correct) {
      // Don't update balance during the game, keep showing bet amount
      // Prize is only awarded if ALL penalties are correct
      if (isLastPenalty) {
        // Award prize (25x multiplier) on last penalty if correct
        setCurrentBalance(initialStake * PRIZE_MULTIPLIER);
        setPotentialWinnings(initialStake * PRIZE_MULTIPLIER);
      }
    } else {
      // Player loses immediately on wrong prediction
      setHasLost(true);
      setCurrentBalance(0);
      setPotentialWinnings(0);
    }

    setShowResult(true);

    // Move to next penalty after showing result or end game if lost
    setTimeout(() => {
      if (!correct) {
        // Game over - player lost
        setPhase('finished');
      } else if (isLastPenalty) {
        setPhase('finished');
      } else {
        setCurrentPenaltyIndex(currentPenaltyIndex + 1);
        setTimeRemaining(DECISION_TIME);
        setHasDecided(false);
        setShowResult(false);
        setPhase('deciding');
      }
    }, 3000);
  };

  useEffect(() => {
    if (phase === 'watching' && !showResult) {
      // Simulate penalty kick with delay
      const delay = setTimeout(() => {
        simulatePenaltyResult();
      }, 2000);
      return () => clearTimeout(delay);
    }
  }, [phase, showResult]);

  useEffect(() => {
    if (phase === 'finished') {
      const correctCount = penalties.filter((p) => p.correct).length;
      setTimeout(() => {
        onComplete(currentBalance, correctCount, penalties.length);
      }, 3000);
    }
  }, [phase]);

  const completedPenalties = penalties.filter((p) => p.status === 'completed');
  const correctPredictions = completedPenalties.filter((p) => p.correct).length;

  const timerProgress = (timeRemaining / DECISION_TIME) * 100;
  const PRIZE_MULTIPLIER = 25;

  const handleStartGame = () => {
    const amount = parseFloat(betAmount);
    if (amount && amount > 0) {
      setInitialStake(amount);
      setCurrentBalance(amount);
      setPotentialWinnings(amount * PRIZE_MULTIPLIER);
      setPhase('deciding');
    }
  };

  return (
    <div className='min-h-screen flex flex-col p-4 max-w-md mx-auto'>
      {/* Header */}
      <div className='flex items-center gap-3 mb-6 mt-2'>
        <button onClick={onBack} className='text-white p-2'>
          <ArrowLeft className='w-5 h-5' />
        </button>
        <div className='flex-1'>
          <h1 className='text-white'>Penalty Shootout</h1>
          <p className='text-gray-400 text-sm'>UEFA Euro 2004 Quarter-final</p>
        </div>
      </div>

      {/* Setup Phase - Bet Amount Input */}
      {phase === 'setup' && (
        <div className='flex-1 flex flex-col items-center justify-center'>
          <div className='w-full bg-gradient-to-br from-[#1a2f4d] to-[#0f1f3d] rounded-2xl p-6 mb-4 border border-cyan-500/30'>
            <div className='text-center mb-6'>
              <Trophy className='w-16 h-16 text-yellow-400 mx-auto mb-4' />
              <h2 className='text-white text-2xl mb-2'>Place Your Bet</h2>
              <p className='text-gray-400 text-sm mb-6'>
                Predict each penalty correctly to multiply your bet. One wrong
                prediction and you lose everything!
              </p>
            </div>

            {/* Bet Amount Input */}
            <div className='mb-6'>
              <label className='text-gray-300 text-sm mb-2 block'>
                Bet Amount
              </label>
              <div className='relative flex items-center'>
                <span className='absolute left-4 text-cyan-400 text-2xl'>
                  €
                </span>
                <input
                  type='number'
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  min='1'
                  step='1'
                  className='w-full bg-[#0f1f3d] text-white text-2xl rounded-xl pl-10 px-4 py-4 pl-12 border border-cyan-500/30 focus:border-cyan-500/60 focus:outline-none'
                  placeholder='10'
                />
              </div>
            </div>

            {/* Prize Display */}
            <div className='bg-gradient-to-br from-yellow-900/40 to-orange-900/40 rounded-xl p-4 mb-6 border border-yellow-500/30'>
              <p className='text-gray-300 text-sm mb-2 text-center'>
                Prize Pool
              </p>
              <p className='text-yellow-400 text-3xl text-center font-bold'>
                €{(parseFloat(betAmount || '0') * PRIZE_MULTIPLIER).toFixed(2)}
              </p>
              <p className='text-gray-400 text-xs text-center mt-2'>
                Win if you predict all penalties correctly!
              </p>
            </div>

            {/* Potential Return */}
            <div className='bg-green-900/40 rounded-xl p-4 mb-6 border border-green-500/30'>
              <p className='text-gray-300 text-sm mb-2 text-center'>
                Your Potential Return
              </p>
              <p className='text-green-400 text-2xl text-center'>
                €
                {(
                  parseFloat(betAmount || '0') * PRIZE_MULTIPLIER -
                  parseFloat(betAmount || '0')
                ).toFixed(2)}{' '}
                profit
              </p>
              <p className='text-gray-400 text-xs text-center mt-2'>
                €{(parseFloat(betAmount || '0') * PRIZE_MULTIPLIER).toFixed(2)}{' '}
                prize - €{parseFloat(betAmount || '0').toFixed(2)} bet = €
                {(
                  parseFloat(betAmount || '0') * PRIZE_MULTIPLIER -
                  parseFloat(betAmount || '0')
                ).toFixed(2)}{' '}
                net win
              </p>
            </div>

            {/* Game Rules */}
            <div className='bg-red-900/40 rounded-xl p-4 mb-6 border border-red-500/30'>
              <p className='text-red-300 text-sm text-center font-semibold mb-2'>
                ⚠️ All or Nothing
              </p>
              <p className='text-gray-300 text-xs text-center'>
                One wrong prediction = Instant loss. You must predict all
                penalties correctly to win the prize!
              </p>
            </div>

            {/* Start Button */}
            <Button
              onClick={handleStartGame}
              disabled={!betAmount || parseFloat(betAmount) <= 0}
              className='w-full bg-gradient-to-r from-cyan-400 to-green-400 hover:from-cyan-500 hover:to-green-500 text-[#0a1628] py-6 rounded-2xl text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed'
            >
              Start Shootout
            </Button>
          </div>
        </div>
      )}

      {phase !== 'setup' && (
        <>
          {/* Match Score */}
          <div className='bg-gradient-to-br from-[#1a2f4d] to-[#0f1f3d] rounded-2xl p-4 sm:p-6 mb-4 border border-cyan-500/30 overflow-hidden'>
            <div className='flex items-center justify-between mb-4'>
              <div className='text-center flex-1 min-w-0'>
                <div className='text-2xl mb-1'>🇵🇹</div>
                <p className='text-white text-xs sm:text-sm mb-1 truncate'>
                  Portugal
                </p>
                <p className='text-cyan-400 text-2xl sm:text-3xl'>
                  {portugalScore}
                </p>
              </div>
              <div className='flex flex-col items-center px-2 sm:px-4 flex-shrink-0'>
                <Trophy className='w-6 h-6 sm:w-8 sm:h-8 text-yellow-400 mb-1' />
                <p className='text-gray-400 text-xs whitespace-nowrap'>
                  Penalties
                </p>
              </div>
              <div className='text-center flex-1 min-w-0'>
                <div className='text-2xl mb-1'>🏴󠁧󠁢󠁥󠁮󠁧󠁿</div>
                <p className='text-white text-xs sm:text-sm mb-1 truncate'>
                  England
                </p>
                <p className='text-cyan-400 text-2xl sm:text-3xl'>
                  {englandScore}
                </p>
              </div>
            </div>

            {/* Progress */}
            <div className='border-t border-gray-700 pt-4'>
              <div className='flex items-center justify-between text-xs sm:text-sm mb-2 gap-2'>
                <span className='text-gray-400 truncate'>
                  Penalty #{currentPenaltyIndex + 1}
                </span>
                <span className='text-cyan-400 whitespace-nowrap'>
                  {correctPredictions} correct
                </span>
              </div>
            </div>
          </div>
          {/* Current Balance */}
          <div className='bg-gradient-to-br from-green-900/40 to-emerald-900/40 rounded-xl p-4 mb-4 border border-green-500/30'>
            <div className='flex items-center justify-between mb-2'>
              <span className='text-gray-300 text-sm'>Your Stake</span>
              <span className='text-white text-xl'>
                €{initialStake.toFixed(2)}
              </span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-gray-300 text-sm'>Win Prize</span>
              <span className='text-green-400 text-2xl font-bold'>
                €{(initialStake * PRIZE_MULTIPLIER).toFixed(2)}
              </span>
            </div>
            <div className='flex items-center justify-between mt-2 pt-2 border-t border-green-500/30'>
              <span className='text-gray-400 text-xs'>
                Net Profit if you win
              </span>
              <span className='text-cyan-400 text-sm'>
                €{(initialStake * PRIZE_MULTIPLIER - initialStake).toFixed(2)}
              </span>
            </div>
          </div>{' '}
          {phase === 'deciding' && !hasDecided && (
            <>
              {/* Timer */}
              <div className='bg-gradient-to-br from-orange-900/40 to-red-900/40 rounded-xl p-4 mb-4 border border-orange-500/30'>
                <div className='flex items-center justify-between mb-2'>
                  <div className='flex items-center gap-2'>
                    <Timer className='w-5 h-5 text-orange-400' />
                    <span className='text-white'>Make your prediction</span>
                  </div>
                  <span className='text-orange-400 text-xl'>
                    {timeRemaining}s
                  </span>
                </div>
                <Progress value={timerProgress} className='h-2 bg-gray-700' />
              </div>

              {/* Current Penalty */}
              <div className='bg-gradient-to-br from-[#1a2f4d] to-[#0f1f3d] rounded-2xl p-4 sm:p-6 mb-6 border border-cyan-500/30 overflow-hidden'>
                <div className='text-center mb-6'>
                  <div className='text-4xl mb-3'>
                    {currentPenalty.team === 'Portugal' ? '🇵🇹' : '🏴󠁧󠁢󠁥󠁮󠁧󠁿'}
                  </div>
                  <h2 className='text-white text-lg sm:text-xl mb-1 truncate px-2'>
                    {currentPenalty.player}
                  </h2>
                  <p className='text-gray-400 text-sm truncate'>
                    {currentPenalty.team}
                  </p>
                </div>

                <div className='flex items-center justify-center gap-2 mb-6'>
                  <Target className='w-5 h-5 text-cyan-400' />
                  <p className='text-cyan-400'>Will this player score?</p>
                </div>

                {/* Decision Buttons */}
                <div className='grid grid-cols-2 gap-4'>
                  <Button
                    onClick={() => handlePrediction(true)}
                    className='bg-gradient-to-br from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white py-6 rounded-xl h-auto'
                  >
                    <div className='flex flex-col items-center justify-center gap-2 w-full'>
                      <CheckCircle className='w-6 h-6' />
                      <span className='text-base font-semibold'>SCORE</span>
                    </div>
                  </Button>

                  <Button
                    onClick={() => handlePrediction(false)}
                    className='bg-gradient-to-br from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white py-6 rounded-xl h-auto'
                  >
                    <div className='flex flex-col items-center justify-center gap-2 w-full'>
                      <XCircle className='w-6 h-6' />
                      <span className='text-base font-semibold'>MISS</span>
                    </div>
                  </Button>
                </div>
              </div>
            </>
          )}
          {phase === 'watching' && !showResult && (
            <div className='flex-1 flex items-center justify-center'>
              <div className='text-center'>
                <div className='animate-bounce mb-4 text-6xl'>⚽</div>
                <p className='text-white text-xl mb-2'>
                  {currentPenalty.player} is taking the penalty...
                </p>
                <p className='text-gray-400'>
                  You predicted:{' '}
                  {currentPenalty.userPrediction ? 'SCORE' : 'MISS'}
                </p>
              </div>
            </div>
          )}
          {showResult && (
            <div className='flex-1 flex items-center justify-center'>
              <div
                className={`text-center p-8 rounded-2xl border-2 ${
                  currentPenalty.result
                    ? 'bg-green-900/40 border-green-500'
                    : 'bg-red-900/40 border-red-500'
                }`}
              >
                <div className='text-6xl mb-4'>
                  {currentPenalty.result ? '⚽' : '❌'}
                </div>
                <p className='text-white text-2xl mb-2'>
                  {currentPenalty.result ? 'GOAL!' : 'SAVED!'}
                </p>
                <p
                  className={`text-xl mb-4 ${
                    currentPenalty.correct ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {currentPenalty.correct
                    ? '✓ Correct Prediction!'
                    : '✗ Wrong Prediction'}
                </p>
                <div className='text-gray-300'>
                  <p className='text-sm mb-1'>
                    {currentPenalty.correct
                      ? `Great prediction! Keep it going to win €${(
                          initialStake * PRIZE_MULTIPLIER
                        ).toFixed(2)}`
                      : 'Game Over - You Lost Your €' +
                        initialStake.toFixed(2) +
                        ' Stake!'}
                  </p>
                  <p className='text-xs text-gray-400'>
                    {currentPenalty.correct
                      ? `${correctPredictions + 1} correct so far`
                      : 'One wrong prediction = Instant loss'}
                  </p>
                </div>
              </div>
            </div>
          )}
          {phase === 'finished' && (
            <div className='flex-1 flex items-center justify-center relative overflow-hidden'>
              {/* Winning Animation - Only show if won */}
              {!hasLost && (
                <>
                  {/* Confetti-like elements */}
                  <div className='absolute inset-0 pointer-events-none'>
                    {[...Array(20)].map((_, i) => (
                      <div
                        key={i}
                        className='absolute w-3 h-3 rounded-full animate-bounce'
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `-${Math.random() * 20}%`,
                          backgroundColor: [
                            '#fbbf24',
                            '#34d399',
                            '#60a5fa',
                            '#f472b6',
                          ][i % 4],
                          animationDelay: `${Math.random() * 2}s`,
                          animationDuration: `${2 + Math.random() * 2}s`,
                        }}
                      />
                    ))}
                  </div>
                  {/* Pulsing glow effect */}
                  <div className='absolute inset-0 bg-gradient-radial from-green-500/20 via-transparent to-transparent animate-pulse' />
                </>
              )}

              <div className='text-center p-8 relative z-10'>
                <div className={!hasLost ? 'animate-bounce' : ''}>
                  <Trophy
                    className={`w-20 h-20 mx-auto mb-4 ${
                      !hasLost
                        ? 'text-yellow-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.8)]'
                        : 'text-yellow-400'
                    }`}
                  />
                </div>
                <p className='text-white text-2xl mb-2'>Shootout Complete!</p>
                <p className='text-cyan-400 text-xl mb-4'>
                  {portugalScore > englandScore
                    ? 'Portugal Wins! 🇵🇹'
                    : englandScore > portugalScore
                    ? 'England Wins! 🏴󠁧󠁢󠁥󠁮󠁧󠁿'
                    : "It's a tie!"}
                </p>

                {/* Winning celebration message */}
                {!hasLost && (
                  <div className='mb-4 animate-pulse'>
                    <p className='text-green-400 text-2xl font-bold mb-2'>
                      🎉 PERFECT PREDICTION! 🎉
                    </p>
                    <p className='text-yellow-300 text-lg'>
                      You got them all right!
                    </p>
                  </div>
                )}

                <div
                  className={`rounded-xl p-4 mb-4 ${
                    !hasLost
                      ? 'bg-gradient-to-br from-green-900/40 to-emerald-900/40 border-2 border-green-500'
                      : 'bg-[#1a2f4d]'
                  }`}
                >
                  <p className='text-gray-400 text-sm mb-1'>Final Balance</p>
                  <p
                    className={`text-3xl font-bold ${
                      hasLost
                        ? 'text-red-400'
                        : 'text-green-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]'
                    }`}
                  >
                    {currentBalance.toFixed(2)}€
                  </p>
                  {hasLost && (
                    <p className='text-red-300 text-sm mt-2'>
                      Better luck next time!
                    </p>
                  )}
                  {!hasLost && (
                    <p className='text-green-300 text-sm mt-2'>
                      Incredible job! 🏆
                    </p>
                  )}
                </div>
                <p className='text-gray-400'>
                  {correctPredictions} correct predictions
                </p>
              </div>
            </div>
          )}
          {/* Penalty History */}
          {completedPenalties.length > 0 && phase !== 'finished' && (
            <div className='mt-auto'>
              <p className='text-gray-400 text-sm mb-2'>Recent Penalties</p>
              <div className='flex gap-2 overflow-x-auto pb-2'>
                {completedPenalties
                  .slice(-5)
                  .reverse()
                  .map((penalty) => (
                    <div
                      key={penalty.id}
                      className={`flex-shrink-0 w-16 h-16 rounded-xl border-2 flex flex-col items-center justify-center ${
                        penalty.correct
                          ? 'bg-green-900/40 border-green-500'
                          : 'bg-red-900/40 border-red-500'
                      }`}
                    >
                      <span className='text-lg'>
                        {penalty.result ? '⚽' : '❌'}
                      </span>
                      <span className='text-xs text-gray-400'>
                        {penalty.team === 'Portugal' ? '🇵🇹' : '�󠁧󠁢󠁥󠁮󠁧󠁿'}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
