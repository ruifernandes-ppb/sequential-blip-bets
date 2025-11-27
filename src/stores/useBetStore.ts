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

export interface SequenceStats {
  totalSequences: number;
  successfulSequences: number;
  failedSequences: number;
  totalEarnings: number;
  totalSpent: number;
}

interface BetStore {
  placedBets: PlacedBet[];
  sequenceStats: SequenceStats;
  addBet: (bet: PlacedBet) => void;
  updateBet: (betId: string, updates: Partial<PlacedBet>) => void;
  removeBet: (betId: string) => void;
  clearBets: () => void;
  recordSequenceAttempt: (
    success: boolean,
    earnings: number,
    stake: number
  ) => void;
  resetStats: () => void;
}

export const useBetStore = create<BetStore>()(
  persist(
    (set) => ({
      placedBets: [],
      sequenceStats: {
        totalSequences: 0,
        successfulSequences: 0,
        failedSequences: 0,
        totalEarnings: 0,
        totalSpent: 0,
      },

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

      recordSequenceAttempt: (success, earnings, stake) =>
        set((state) => ({
          sequenceStats: {
            totalSequences: state.sequenceStats.totalSequences + 1,
            successfulSequences:
              state.sequenceStats.successfulSequences + (success ? 1 : 0),
            failedSequences:
              state.sequenceStats.failedSequences + (success ? 0 : 1),
            totalEarnings:
              state.sequenceStats.totalEarnings + (earnings - stake),
            totalSpent: state.sequenceStats.totalSpent + stake,
          },
        })),

      resetStats: () =>
        set({
          sequenceStats: {
            totalSequences: 0,
            successfulSequences: 0,
            failedSequences: 0,
            totalEarnings: 0,
            totalSpent: 0,
          },
        }),
    }),
    {
      name: 'bet-storage', // localStorage key
    }
  )
);
