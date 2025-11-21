import { createContext, useContext, useState, ReactNode } from 'react';
import { BetResult, SequenceOutcome } from '../App';

export interface PlacedBet {
  id: string;
  matchId: number;
  matchName: string;
  sequence: SequenceOutcome[];
  timestamp: number;
  status: 'pending' | 'live' | 'completed';
  finalWinnings?: number;
  betHistory?: BetResult[];
  initialStake: number;
}

interface BetContextType {
  placedBets: PlacedBet[];
  addBet: (bet: PlacedBet) => void;
  updateBet: (betId: string, updates: Partial<PlacedBet>) => void;
  removeBet: (betId: string) => void;
}

const BetContext = createContext<BetContextType | undefined>(undefined);

export function BetProvider({ children }: { children: ReactNode }) {
  const [placedBets, setPlacedBets] = useState<PlacedBet[]>([]);

  const addBet = (bet: PlacedBet) => {
    setPlacedBets(prev => [...prev, bet]);
  };

  const updateBet = (betId: string, updates: Partial<PlacedBet>) => {
    setPlacedBets(prev => 
      prev.map(bet => bet.id === betId ? { ...bet, ...updates } : bet)
    );
  };

  const removeBet = (betId: string) => {
    setPlacedBets(prev => prev.filter(bet => bet.id !== betId));
  };

  return (
    <BetContext.Provider value={{ placedBets, addBet, updateBet, removeBet }}>
      {children}
    </BetContext.Provider>
  );
}

export function useBets() {
  const context = useContext(BetContext);
  if (context === undefined) {
    throw new Error('useBets must be used within a BetProvider');
  }
  return context;
}
