import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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

interface BetStore {
  placedBets: PlacedBet[];
  addBet: (bet: PlacedBet) => void;
  updateBet: (betId: string, updates: Partial<PlacedBet>) => void;
  removeBet: (betId: string) => void;
  clearBets: () => void;
}

export const useBetStore = create<BetStore>()(
  //   persist(
  (set) => ({
    placedBets: [],

    addBet: (bet) =>
      set((state) => ({
        placedBets: [...state.placedBets, bet],
      })),

    updateBet: (betId, updates) =>
      set((state) => ({
        placedBets: state.placedBets.map((bet) =>
          bet.id === betId ? { ...bet, ...updates } : bet
        ),
      })),

    removeBet: (betId) =>
      set((state) => ({
        placedBets: state.placedBets.filter((bet) => bet.id !== betId),
      })),

    clearBets: () => set({ placedBets: [] }),
  })
  //     {
  //       name: 'bet-storage', // localStorage key
  //     }
  //   )
);
