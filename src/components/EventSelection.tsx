import { Trophy, Clock, ArrowRight, Users } from 'lucide-react';
import { Match } from '../App';
import { Button } from './ui/button';

interface EventSelectionProps {
  onMatchSelect: (match: Match) => void;
  onViewFriendsStats?: () => void;
}

const LIVE_MATCHES: Match[] = [
  {
    id: 1,
    player1: 'Carlos Alcaraz',
    player2: 'Jannik Sinner',
    player1Sets: 1,
    player2Sets: 1,
    player1Games: 4,
    player2Games: 3,
    player1Points: '30',
    player2Points: '40',
    currentSet: 3,
    tournament: 'Australian Open - Final',
    isLive: true,
    servingPlayer: 2
  },
  {
    id: 2,
    player1: 'Novak Djokovic',
    player2: 'Daniil Medvedev',
    player1Sets: 2,
    player2Sets: 0,
    player1Games: 2,
    player2Games: 1,
    player1Points: '15',
    player2Points: '0',
    currentSet: 3,
    tournament: 'ATP Masters 1000',
    isLive: true,
    servingPlayer: 1
  },
  {
    id: 3,
    player1: 'Aryna Sabalenka',
    player2: 'Iga Świątek',
    player1Sets: 0,
    player2Sets: 1,
    player1Games: 5,
    player2Games: 4,
    player1Points: '40',
    player2Points: '40',
    currentSet: 2,
    tournament: 'WTA Finals',
    isLive: true,
    servingPlayer: 1
  },
  {
    id: 4,
    player1: 'Stefanos Tsitsipas',
    player2: 'Alexander Zverev',
    player1Sets: 1,
    player2Sets: 0,
    player1Games: 3,
    player2Games: 2,
    player1Points: '0',
    player2Points: '15',
    currentSet: 2,
    tournament: 'Roland Garros',
    isLive: true,
    servingPlayer: 2
  },
  {
    id: 5,
    player1: 'Coco Gauff',
    player2: 'Jessica Pegula',
    player1Sets: 0,
    player2Sets: 0,
    player1Games: 1,
    player2Games: 1,
    player1Points: '30',
    player2Points: '30',
    currentSet: 1,
    tournament: 'US Open',
    isLive: true,
    servingPlayer: 1
  }
];

export function EventSelection({ onMatchSelect, onViewFriendsStats }: EventSelectionProps) {
  return (
    <div className="min-h-screen flex flex-col p-4 max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-8 mt-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Trophy className="w-8 h-8 text-cyan-400" />
          <h1 className="text-white text-2xl">Sequential Betting</h1>
        </div>
        <p className="text-gray-400">Bet on the story, not just the score</p>
      </div>

      {/* Live Badge */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-2 bg-red-500 px-3 py-1 rounded-full">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          <span className="text-white text-sm">LIVE NOW</span>
        </div>
        <span className="text-gray-400 text-sm">{LIVE_MATCHES.length} matches</span>
      </div>

      {/* Match List */}
      <div className="space-y-3 flex-1">
        {LIVE_MATCHES.map((match) => (
          <button
            key={match.id}
            onClick={() => onMatchSelect(match)}
            className="w-full bg-gradient-to-br from-[#1a2f4d] to-[#0f1f3d] rounded-2xl p-4 border border-cyan-500/30 hover:border-cyan-500/60 transition-all active:scale-[0.98]"
          >
            {/* League */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-400 text-xs">{match.tournament}</span>
              <div className="flex items-center gap-1 text-orange-400">
                <Clock className="w-3 h-3" />
                <span className="text-xs">{match.currentSet} set</span>
              </div>
            </div>

            {/* Teams and Score */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex-1 text-left">
                <p className="text-white mb-1">{match.player1}</p>
                <p className="text-white">{match.player2}</p>
              </div>
              <div className="flex flex-col items-center mx-4">
                <span className="text-white text-2xl">{match.player1Sets}</span>
                <span className="text-white text-2xl">{match.player2Sets}</span>
              </div>
              <ArrowRight className="w-5 h-5 text-cyan-400" />
            </div>

            {/* CTA */}
            <div className="flex items-center justify-center gap-2 pt-2 border-t border-gray-700">
              <span className="text-cyan-400 text-sm">Build your sequence</span>
            </div>
          </button>
        ))}
      </div>

      {/* Info Footer */}
      <div className="mt-6 bg-[#1a2f4d]/50 rounded-xl p-4 border border-cyan-500/20">
        <p className="text-gray-300 text-sm text-center">
          Create your storyline with sequential outcomes. Each event adds tension and potential reward.
        </p>
      </div>

      {/* Friends Stats Button */}
      {onViewFriendsStats && (
        <div className="mt-4">
          <Button
            onClick={onViewFriendsStats}
            className="w-full bg-gradient-to-br from-[#1a2f4d] to-[#0f1f3d] rounded-2xl p-4 border border-cyan-500/30 hover:border-cyan-500/60 transition-all active:scale-[0.98]"
          >
            <div className="flex items-center justify-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" />
              <span className="text-cyan-400 text-sm">View Friends Stats</span>
            </div>
          </Button>
        </div>
      )}
    </div>
  );
}