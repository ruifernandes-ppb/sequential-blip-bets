import { useState } from "react";
import { EventSelection } from "./components/EventSelection";
import { SequenceBuilder } from "./components/SequenceBuilder";
import { LiveWatching } from "./components/LiveWatching";
import { ResultScreen } from "./components/ResultScreen";
import { FriendsStats } from "./components/FriendsStats";
import { PenaltyShootout } from "./components/PenaltyShootout";
import { PenaltyResult } from "./components/PenaltyResult";
import { MyBets } from "./components/MyBets";
import { BetProvider } from "./contexts/BetContext";
import { Toaster } from "./components/ui/sonner";

export type GameScreen =
  | "event-selection"
  | "sequence-builder"
  | "live-watching"
  | "result"
  | "friends-stats"
  | "penalty-shootout"
  | "penalty-result"
  | "my-bets";

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
  const [penaltyStats, setPenaltyStats] = useState({
    winnings: 0,
    correctPredictions: 0,
    totalPenalties: 0
  });

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
    setPenaltyStats({ winnings: 0, correctPredictions: 0, totalPenalties: 0 });
  };

  const handlePenaltyComplete = (winnings: number, correctPredictions: number, totalPenalties: number) => {
    setPenaltyStats({ winnings, correctPredictions, totalPenalties });
    setCurrentScreen("penalty-result");
  };

  return (
    <BetProvider>
      <div className="min-h-screen bg-gradient-to-b from-[#1e3a5f] via-[#0f1f3d] to-[#0a1628]">
        {currentScreen === "event-selection" && (
          <EventSelection 
            onMatchSelect={handleMatchSelect}
            onViewFriendsStats={() => setCurrentScreen("friends-stats")}
            onPenaltyShootout={() => setCurrentScreen("penalty-shootout")}
            onViewMyBets={() => setCurrentScreen("my-bets")}
          />
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

        {currentScreen === "friends-stats" && (
          <FriendsStats onBack={() => setCurrentScreen("event-selection")} />
        )}

        {currentScreen === "my-bets" && (
          <MyBets onBack={() => setCurrentScreen("event-selection")} />
        )}

        {currentScreen === "penalty-shootout" && (
          <PenaltyShootout
            onBack={() => setCurrentScreen("event-selection")}
            onComplete={handlePenaltyComplete}
          />
        )}

        {currentScreen === "penalty-result" && (
          <PenaltyResult
            finalWinnings={penaltyStats.winnings}
            correctPredictions={penaltyStats.correctPredictions}
            totalPenalties={penaltyStats.totalPenalties}
            initialStake={INITIAL_STAKE}
            onPlayAgain={() => setCurrentScreen("penalty-shootout")}
            onBackToMenu={handlePlayAgain}
          />
        )}
        <Toaster />
      </div>
    </BetProvider>
  );
}