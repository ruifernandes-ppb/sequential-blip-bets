import { useState } from "react";
import { EventSelection } from "./components/EventSelection";
import { SequenceBuilder } from "./components/SequenceBuilder";
import { LiveWatching } from "./components/LiveWatching";
import { ResultScreen } from "./components/ResultScreen";

export type GameScreen =
  | "event-selection"
  | "sequence-builder"
  | "live-watching"
  | "result";

export interface Match {
  id: number;
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
  servingPlayer: 1 | 2;
}

export interface SequenceOutcome {
  id: string;
  category: "game" | "point" | "serve" | "break" | "rally";
  description: string;
  odds: number;
  timeLimit: number;
  status: "pending" | "checking" | "success" | "failed";
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
    useState<GameScreen>("event-selection");
  const [selectedMatch, setSelectedMatch] =
    useState<Match | null>(null);
  const [sequence, setSequence] = useState<SequenceOutcome[]>(
    [],
  );
  const [betHistory, setBetHistory] = useState<BetResult[]>([]);
  const [currentWinnings, setCurrentWinnings] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);

  const INITIAL_STAKE = 10;

  const handleMatchSelect = (match: Match) => {
    setSelectedMatch(match);
    setCurrentScreen("sequence-builder");
  };

  const handleSequenceComplete = (
    selectedSequence: SequenceOutcome[],
  ) => {
    setSequence(selectedSequence);
    setCurrentScreen("live-watching");
  };

  const handleWatchingComplete = (
    history: BetResult[],
    winnings: number,
    points: number,
  ) => {
    setBetHistory(history);
    setCurrentWinnings(winnings);
    setTotalPoints(points);
    setCurrentScreen("result");
  };

  const handlePlayAgain = () => {
    setCurrentScreen("event-selection");
    setSelectedMatch(null);
    setSequence([]);
    setBetHistory([]);
    setCurrentWinnings(0);
    setTotalPoints(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1e3a5f] via-[#0f1f3d] to-[#0a1628]">
      {currentScreen === "event-selection" && (
        <EventSelection onMatchSelect={handleMatchSelect} />
      )}

      {currentScreen === "sequence-builder" &&
        selectedMatch && (
          <SequenceBuilder
            match={selectedMatch}
            onComplete={handleSequenceComplete}
            onBack={() => setCurrentScreen("event-selection")}
          />
        )}

      {currentScreen === "live-watching" &&
        selectedMatch &&
        sequence.length > 0 && (
          <LiveWatching
            match={selectedMatch}
            initialSequence={sequence}
            initialStake={INITIAL_STAKE}
            onComplete={handleWatchingComplete}
            onBack={() => setCurrentScreen("sequence-builder")}
          />
        )}

      {currentScreen === "result" && selectedMatch && (
        <ResultScreen
          match={selectedMatch}
          betHistory={betHistory}
          totalPoints={totalPoints}
          correctAnswers={
            betHistory.filter((b) => b.correct).length
          }
          onPlayAgain={handlePlayAgain}
          onGoToOverview={handlePlayAgain}
          finalWinnings={currentWinnings}
          initialStake={INITIAL_STAKE}
        />
      )}
    </div>
  );
}