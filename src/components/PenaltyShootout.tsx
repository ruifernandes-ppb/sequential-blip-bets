import { useState, useEffect } from 'react';
import { ArrowLeft, Target, CheckCircle, XCircle, Trophy, Timer } from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';

interface PenaltyShootoutProps {
  onBack: () => void;
  onComplete: (winnings: number, correctPredictions: number, totalPenalties: number) => void;
}

interface Penalty {
  id: number;
  team: 'Portugal' | 'Argentina';
  player: string;
  status: 'pending' | 'active' | 'completed';
  result?: boolean; // true = scored, false = missed
  userPrediction?: boolean;
  correct?: boolean;
}

const PENALTY_SHOOTOUT: Penalty[] = [
  { id: 1, team: 'Portugal', player: 'Cristiano Ronaldo', status: 'pending' },
  { id: 2, team: 'Argentina', player: 'Lionel Messi', status: 'pending' },
  { id: 3, team: 'Portugal', player: 'Bruno Fernandes', status: 'pending' },
  { id: 4, team: 'Argentina', player: 'Julián Álvarez', status: 'pending' },
  { id: 5, team: 'Portugal', player: 'Bernardo Silva', status: 'pending' },
  { id: 6, team: 'Argentina', player: 'Enzo Fernández', status: 'pending' },
  { id: 7, team: 'Portugal', player: 'João Félix', status: 'pending' },
  { id: 8, team: 'Argentina', player: 'Lautaro Martínez', status: 'pending' },
  { id: 9, team: 'Portugal', player: 'Rafael Leão', status: 'pending' },
  { id: 10, team: 'Argentina', player: 'Ángel Di María', status: 'pending' },
];

const DECISION_TIME = 10; // seconds per decision
const ODDS_PER_PENALTY = 1.35;
const INITIAL_STAKE = 10;

export function PenaltyShootout({ onBack, onComplete }: PenaltyShootoutProps) {
  const [penalties, setPenalties] = useState<Penalty[]>(PENALTY_SHOOTOUT);
  const [currentPenaltyIndex, setCurrentPenaltyIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(DECISION_TIME);
  const [hasDecided, setHasDecided] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [currentBalance, setCurrentBalance] = useState(INITIAL_STAKE);
  const [portugalScore, setPortugalScore] = useState(0);
  const [argentinaScore, setArgentinaScore] = useState(0);
  const [phase, setPhase] = useState<'deciding' | 'watching' | 'finished'>('deciding');

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
      status: 'active'
    };
    setPenalties(updatedPenalties);

    // Move to watching phase
    setPhase('watching');
  };

  const simulatePenaltyResult = () => {
    // 75% chance of scoring (realistic penalty conversion rate)
    const scored = Math.random() < 0.75;
    
    const updatedPenalties = [...penalties];
    const penalty = updatedPenalties[currentPenaltyIndex];
    const correct = penalty.userPrediction === scored;
    
    updatedPenalties[currentPenaltyIndex] = {
      ...penalty,
      result: scored,
      correct: correct,
      status: 'completed'
    };
    
    setPenalties(updatedPenalties);

    // Update scores
    if (scored) {
      if (penalty.team === 'Portugal') {
        setPortugalScore(portugalScore + 1);
      } else {
        setArgentinaScore(argentinaScore + 1);
      }
    }

    // Update balance
    if (correct) {
      setCurrentBalance(currentBalance * ODDS_PER_PENALTY);
    } else {
      setCurrentBalance(currentBalance * 0.85); // Lose 15% for wrong prediction
    }

    setShowResult(true);

    // Move to next penalty after showing result
    setTimeout(() => {
      if (isLastPenalty) {
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
      const correctCount = penalties.filter(p => p.correct).length;
      setTimeout(() => {
        onComplete(currentBalance, correctCount, penalties.length);
      }, 3000);
    }
  }, [phase]);

  const completedPenalties = penalties.filter(p => p.status === 'completed');
  const correctPredictions = completedPenalties.filter(p => p.correct).length;

  const timerProgress = (timeRemaining / DECISION_TIME) * 100;

  return (
    <div className="min-h-screen flex flex-col p-4 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 mt-2">
        <button onClick={onBack} className="text-white p-2">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-white">Penalty Shootout</h1>
          <p className="text-gray-400 text-sm">2026 World Cup Final</p>
        </div>
      </div>

      {/* Match Score */}
      <div className="bg-gradient-to-br from-[#1a2f4d] to-[#0f1f3d] rounded-2xl p-6 mb-4 border border-cyan-500/30">
        <div className="flex items-center justify-between mb-4">
          <div className="text-center flex-1">
            <div className="text-2xl mb-1">🇵🇹</div>
            <p className="text-white text-sm mb-1">Portugal</p>
            <p className="text-cyan-400 text-3xl">{portugalScore}</p>
          </div>
          <div className="flex flex-col items-center px-4">
            <Trophy className="w-8 h-8 text-yellow-400 mb-1" />
            <p className="text-gray-400 text-xs">Penalties</p>
          </div>
          <div className="text-center flex-1">
            <div className="text-2xl mb-1">🇦🇷</div>
            <p className="text-white text-sm mb-1">Argentina</p>
            <p className="text-cyan-400 text-3xl">{argentinaScore}</p>
          </div>
        </div>

        {/* Progress */}
        <div className="border-t border-gray-700 pt-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-400">Penalty {currentPenaltyIndex + 1} of {penalties.length}</span>
            <span className="text-cyan-400">{correctPredictions}/{completedPenalties.length} correct</span>
          </div>
          <Progress value={(currentPenaltyIndex / penalties.length) * 100} className="h-2" />
        </div>
      </div>

      {/* Current Balance */}
      <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 rounded-xl p-4 mb-4 border border-green-500/30">
        <div className="flex items-center justify-between">
          <span className="text-gray-300 text-sm">Current Balance</span>
          <span className="text-green-400 text-xl">${currentBalance.toFixed(2)}</span>
        </div>
      </div>

      {phase === 'deciding' && !hasDecided && (
        <>
          {/* Timer */}
          <div className="bg-gradient-to-br from-orange-900/40 to-red-900/40 rounded-xl p-4 mb-4 border border-orange-500/30">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Timer className="w-5 h-5 text-orange-400" />
                <span className="text-white">Make your prediction</span>
              </div>
              <span className="text-orange-400 text-xl">{timeRemaining}s</span>
            </div>
            <Progress value={timerProgress} className="h-2 bg-gray-700" />
          </div>

          {/* Current Penalty */}
          <div className="bg-gradient-to-br from-[#1a2f4d] to-[#0f1f3d] rounded-2xl p-6 mb-6 border border-cyan-500/30">
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">{currentPenalty.team === 'Portugal' ? '🇵🇹' : '🇦🇷'}</div>
              <h2 className="text-white text-xl mb-1">{currentPenalty.player}</h2>
              <p className="text-gray-400 text-sm">{currentPenalty.team}</p>
            </div>

            <div className="flex items-center justify-center gap-2 mb-4">
              <Target className="w-5 h-5 text-cyan-400" />
              <p className="text-cyan-400">Will this player score?</p>
            </div>

            <p className="text-gray-400 text-center text-sm mb-6">
              Correct: +{((ODDS_PER_PENALTY - 1) * 100).toFixed(0)}% • Wrong: -15%
            </p>

            {/* Decision Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => handlePrediction(true)}
                className="bg-gradient-to-br from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white py-8 rounded-xl"
              >
                <div className="flex flex-col items-center gap-2">
                  <CheckCircle className="w-8 h-8" />
                  <span className="text-lg">SCORE</span>
                  <span className="text-xs opacity-75">{ODDS_PER_PENALTY.toFixed(2)}x</span>
                </div>
              </Button>

              <Button
                onClick={() => handlePrediction(false)}
                className="bg-gradient-to-br from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white py-8 rounded-xl"
              >
                <div className="flex flex-col items-center gap-2">
                  <XCircle className="w-8 h-8" />
                  <span className="text-lg">MISS</span>
                  <span className="text-xs opacity-75">{ODDS_PER_PENALTY.toFixed(2)}x</span>
                </div>
              </Button>
            </div>
          </div>
        </>
      )}

      {phase === 'watching' && !showResult && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-bounce mb-4 text-6xl">⚽</div>
            <p className="text-white text-xl mb-2">{currentPenalty.player} is taking the penalty...</p>
            <p className="text-gray-400">You predicted: {currentPenalty.userPrediction ? 'SCORE' : 'MISS'}</p>
          </div>
        </div>
      )}

      {showResult && (
        <div className="flex-1 flex items-center justify-center">
          <div className={`text-center p-8 rounded-2xl border-2 ${
            currentPenalty.result 
              ? 'bg-green-900/40 border-green-500' 
              : 'bg-red-900/40 border-red-500'
          }`}>
            <div className="text-6xl mb-4">
              {currentPenalty.result ? '⚽' : '❌'}
            </div>
            <p className="text-white text-2xl mb-2">
              {currentPenalty.result ? 'GOAL!' : 'SAVED!'}
            </p>
            <p className={`text-xl mb-4 ${
              currentPenalty.correct ? 'text-green-400' : 'text-red-400'
            }`}>
              {currentPenalty.correct ? '✓ Correct Prediction!' : '✗ Wrong Prediction'}
            </p>
            <div className="text-gray-300">
              <p className="text-sm mb-1">Balance: ${currentBalance.toFixed(2)}</p>
              <p className="text-xs text-gray-400">
                {currentPenalty.correct 
                  ? `+${((ODDS_PER_PENALTY - 1) * 100).toFixed(0)}%` 
                  : '-15%'}
              </p>
            </div>
          </div>
        </div>
      )}

      {phase === 'finished' && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-8">
            <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-4" />
            <p className="text-white text-2xl mb-2">Shootout Complete!</p>
            <p className="text-cyan-400 text-xl mb-4">
              {portugalScore > argentinaScore ? 'Portugal Wins! 🇵🇹' : 
               argentinaScore > portugalScore ? 'Argentina Wins! 🇦🇷' : 
               'It\'s a tie!'}
            </p>
            <div className="bg-[#1a2f4d] rounded-xl p-4 mb-4">
              <p className="text-gray-400 text-sm mb-1">Final Balance</p>
              <p className="text-green-400 text-3xl">${currentBalance.toFixed(2)}</p>
            </div>
            <p className="text-gray-400">
              {correctPredictions} correct predictions out of {penalties.length}
            </p>
          </div>
        </div>
      )}

      {/* Penalty History */}
      {completedPenalties.length > 0 && phase !== 'finished' && (
        <div className="mt-auto">
          <p className="text-gray-400 text-sm mb-2">Recent Penalties</p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {completedPenalties.slice(-5).reverse().map(penalty => (
              <div
                key={penalty.id}
                className={`flex-shrink-0 w-16 h-16 rounded-xl border-2 flex flex-col items-center justify-center ${
                  penalty.correct
                    ? 'bg-green-900/40 border-green-500'
                    : 'bg-red-900/40 border-red-500'
                }`}
              >
                <span className="text-lg">{penalty.result ? '⚽' : '❌'}</span>
                <span className="text-xs text-gray-400">
                  {penalty.team === 'Portugal' ? '🇵🇹' : '🇦🇷'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
