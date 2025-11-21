import { useState } from 'react';
import { EventSelection } from './components/EventSelection';
import { SequenceBuilder } from './components/SequenceBuilder';
import { LiveWatching } from './components/LiveWatching';
import { ResultScreen } from './components/ResultScreen';
import { FriendsStats } from './components/FriendsStats';
import { PenaltyShootout } from './components/PenaltyShootout';
import { PenaltyResult } from './components/PenaltyResult';
import { MyBets } from './components/MyBets';
import { Toaster } from './components/ui/sonner';
import { useBetStore } from './stores/useBetStore';

export type GameScreen =
  | 'event-selection'
  | 'sequence-builder'
  | 'live-watching'
  | 'result'
  | 'friends-stats'
  | 'penalty-shootout'
  | 'penalty-result'
  | 'my-bets';

export interface Match {
  id: number | string;
  player1: string;
  player2: string;
  player1Sets: number;
  player2Sets: number;
  player1Games: number;
  player2Games: number;
  player1Points: string;
  player2Points: string;
  currentSet: number;
  tournament: string;
  isLive: boolean;
}

export interface SequenceOutcome {
  id: string;
  category:
    | 'team-goals'
    | 'team-fouls'
    | 'player-attacking'
    | 'player-fouls'
    | 'player-defensive'
    | 'player-penalty'
    | 'player-goalkeeper';
  description: string;
  odds: number;
  timeLimit: number;
  status: 'pending' | 'checking' | 'success' | 'failed';
  result?: boolean;
}

export interface BetResult {
  outcomeId: string;
  description: string;
  correct: boolean;
  selectedOdds: number;
}

export default function App() {
  const [currentScreen, setCurrentScreen] =
    useState<GameScreen>('event-selection');
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [sequence, setSequence] = useState<SequenceOutcome[]>([]);
  const [betHistory, setBetHistory] = useState<BetResult[]>([]);
  const [currentWinnings, setCurrentWinnings] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [currentBetId, setCurrentBetId] = useState<string | null>(null);
  const [penaltyStats, setPenaltyStats] = useState({
    winnings: 0,
    correctPredictions: 0,
    totalPenalties: 0,
  });

  const addBet = useBetStore((state) => state.addBet);
  const updateBet = useBetStore((state) => state.updateBet);

  const INITIAL_STAKE = 10;

  const handleMatchSelect = (match: Match) => {
    setSelectedMatch(match);
    setCurrentScreen('sequence-builder');
  };

  const handleSequenceComplete = (selectedSequence: SequenceOutcome[]) => {
    setSequence(selectedSequence);

    // Create and save the bet when starting to watch
    if (selectedMatch) {
      const betId = `bet-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      setCurrentBetId(betId);

      addBet({
        id: betId,
        matchId: selectedMatch.id,
        matchName: `${selectedMatch.player1} vs ${selectedMatch.player2}`,
        sequence: selectedSequence,
        timestamp: Date.now(),
        status: 'live',
        initialStake: INITIAL_STAKE,
      });
    }

    setCurrentScreen('live-watching');
  };

  const handleWatchingComplete = (
    history: BetResult[],
    winnings: number,
    points: number
  ) => {
    setBetHistory(history);
    setCurrentWinnings(winnings);
    setTotalPoints(points);

    // Update the bet with final results
    if (currentBetId) {
      updateBet(currentBetId, {
        status: 'completed',
        finalWinnings: winnings,
        betHistory: history,
      });
    }

    setCurrentScreen('result');
  };

  const handlePlayAgain = () => {
    setCurrentScreen('event-selection');
    setSelectedMatch(null);
    setSequence([]);
    setBetHistory([]);
    setCurrentWinnings(0);
    setTotalPoints(0);
    setCurrentBetId(null);
    setPenaltyStats({ winnings: 0, correctPredictions: 0, totalPenalties: 0 });
  };

  const handlePenaltyComplete = (
    winnings: number,
    correctPredictions: number,
    totalPenalties: number
  ) => {
    setPenaltyStats({ winnings, correctPredictions, totalPenalties });
    setCurrentScreen('penalty-result');
  };

  return (
    <div className='min-h-screen bg-gradient-to-b from-[#1e3a5f] via-[#0f1f3d] to-[#0a1628]'>
      {currentScreen === 'event-selection' && (
        <EventSelection
          onMatchSelect={handleMatchSelect}
          onViewFriendsStats={() => setCurrentScreen('friends-stats')}
          onPenaltyShootout={() => setCurrentScreen('penalty-shootout')}
          onViewMyBets={() => setCurrentScreen('my-bets')}
        />
      )}

      {currentScreen === 'sequence-builder' && selectedMatch && (
        <SequenceBuilder
          match={selectedMatch}
          onComplete={handleSequenceComplete}
          onBack={() => setCurrentScreen('event-selection')}
        />
      )}

      {currentScreen === 'live-watching' &&
        selectedMatch &&
        sequence.length > 0 && (
          <LiveWatching
            match={selectedMatch}
            initialSequence={sequence}
            initialStake={INITIAL_STAKE}
            onComplete={handleWatchingComplete}
            onBack={() => setCurrentScreen('sequence-builder')}
          />
        )}

      {currentScreen === 'result' && selectedMatch && (
        <ResultScreen
          match={selectedMatch}
          betHistory={betHistory}
          totalPoints={totalPoints}
          correctAnswers={betHistory.filter((b) => b.correct).length}
          onPlayAgain={handlePlayAgain}
          onGoToOverview={handlePlayAgain}
          finalWinnings={currentWinnings}
          initialStake={INITIAL_STAKE}
        />
      )}

      {currentScreen === 'friends-stats' && (
        <FriendsStats onBack={() => setCurrentScreen('event-selection')} />
      )}

      {currentScreen === 'my-bets' && (
        <MyBets onBack={() => setCurrentScreen('event-selection')} />
      )}

      {currentScreen === 'penalty-shootout' && (
        <PenaltyShootout
          onBack={() => setCurrentScreen('event-selection')}
          onComplete={handlePenaltyComplete}
        />
      )}

      {currentScreen === 'penalty-result' && (
        <PenaltyResult
          finalWinnings={penaltyStats.winnings}
          correctPredictions={penaltyStats.correctPredictions}
          totalPenalties={penaltyStats.totalPenalties}
          initialStake={INITIAL_STAKE}
          onPlayAgain={() => setCurrentScreen('penalty-shootout')}
          onBackToMenu={handlePlayAgain}
        />
      )}
      <Toaster />
    </div>
  );
}
