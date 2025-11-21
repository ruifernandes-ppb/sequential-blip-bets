import { useState } from 'react';
import { X, Search, User } from 'lucide-react';
import { getMatchPlayers, type Player } from '../fixtures/players';

interface PlayerSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlayer: (player: Player) => void;
  team1Name: string;
  team2Name: string;
  bothTeams?: boolean; // If true, show both teams, if false show only one team
  teamFilter?: 'player1' | 'player2';
  match?: any;
  matchId?: string | number | null; // Optional match ID to load specific lineup
  team?: 'player1' | 'player2' | 'both';
  onSelect?: (player: Player) => void;
}

export function PlayerSelector({
  isOpen,
  onClose,
  onSelectPlayer,
  team1Name,
  team2Name,
  bothTeams = true,
  teamFilter,
  match,
  matchId,
  team,
  onSelect,
}: PlayerSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<
    'player1' | 'player2' | 'all'
  >(teamFilter || (bothTeams ? 'all' : 'player1'));

  // Load players dynamically based on matchId
  const { team1Players, team2Players } = getMatchPlayers(
    matchId || null,
    team1Name,
    team2Name
  );

  let allPlayers = [...team1Players, ...team2Players];

  // Filter by team if needed
  if (teamFilter) {
    allPlayers = allPlayers.filter((p) => p.team === teamFilter);
  } else if (selectedTeam !== 'all') {
    allPlayers = allPlayers.filter((p) => p.team === selectedTeam);
  }

  // Filter by search query
  const filteredPlayers = allPlayers.filter(
    (player) =>
      player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player.number.toString().includes(searchQuery)
  );

  const handleSelectPlayer = (player: Player) => {
    onSelectPlayer(player);
    setSearchQuery('');
    onClose();
  };

  const groupByPosition = (players: Player[]) => {
    const groups: Record<string, Player[]> = {
      GK: [],
      DEF: [],
      MID: [],
      FWD: [],
    };

    players.forEach((player) => {
      if (groups[player.position]) {
        groups[player.position].push(player);
      }
    });

    return groups;
  };

  const groupedPlayers = groupByPosition(filteredPlayers);

  const positionLabels: Record<string, string> = {
    GK: '🧤 Goalkeepers',
    DEF: '🛡️ Defenders',
    MID: '⚙️ Midfielders',
    FWD: '⚽ Forwards',
  };

  const positionColors: Record<string, string> = {
    GK: 'text-yellow-400 bg-yellow-500/20',
    DEF: 'text-blue-400 bg-blue-500/20',
    MID: 'text-green-400 bg-green-500/20',
    FWD: 'text-red-400 bg-red-500/20',
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black/70 z-50 flex items-end'>
      <div className='bg-gradient-to-b from-[#1e3a5f] to-[#0f1f3d] w-full max-h-[85vh] rounded-t-3xl p-4 overflow-y-auto'>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='text-white flex items-center gap-2'>
            <User className='w-5 h-5 text-cyan-400' />
            Select Player
          </h3>
          <button onClick={onClose} className='text-white p-2'>
            <X className='w-5 h-5' />
          </button>
        </div>

        {/* Search Bar */}
        <div className='relative mb-4'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
          <input
            type='text'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder='Search by name, position, or number...'
            className='w-full bg-[#1a2f4d] text-white placeholder-gray-500 rounded-lg pl-10 pr-4 py-3 border border-cyan-500/30 focus:border-cyan-500/60 focus:outline-none'
          />
        </div>

        {/* Team Filter Tabs */}
        {bothTeams && !teamFilter && (
          <div className='flex gap-2 mb-4'>
            <button
              onClick={() => setSelectedTeam('all')}
              className={`flex-1 px-3 py-2 rounded-lg text-sm transition-all ${
                selectedTeam === 'all'
                  ? 'bg-cyan-500 text-white'
                  : 'bg-[#1a2f4d] text-gray-400 hover:text-white'
              }`}
            >
              All Players
            </button>
            <button
              onClick={() => setSelectedTeam('player1')}
              className={`flex-1 px-3 py-2 rounded-lg text-sm transition-all ${
                selectedTeam === 'player1'
                  ? 'bg-cyan-500 text-white'
                  : 'bg-[#1a2f4d] text-gray-400 hover:text-white'
              }`}
            >
              {team1Name}
            </button>
            <button
              onClick={() => setSelectedTeam('player2')}
              className={`flex-1 px-3 py-2 rounded-lg text-sm transition-all ${
                selectedTeam === 'player2'
                  ? 'bg-cyan-500 text-white'
                  : 'bg-[#1a2f4d] text-gray-400 hover:text-white'
              }`}
            >
              {team2Name}
            </button>
          </div>
        )}

        {/* Players List */}
        <div className='space-y-4'>
          {Object.entries(groupedPlayers).map(([position, players]) => {
            if (players.length === 0) return null;

            return (
              <div key={position}>
                <h3 className='text-gray-400 text-sm mb-2'>
                  {positionLabels[position]}
                </h3>
                <div className='grid grid-cols-2 gap-2'>
                  {players.map((player) => (
                    <button
                      key={player.id}
                      onClick={() => handleSelectPlayer(player)}
                      className='bg-[#1a2f4d] hover:bg-[#243a5c] border border-cyan-500/20 hover:border-cyan-500/50 rounded-xl p-3 text-left transition-all active:scale-95'
                    >
                      <div className='flex items-start justify-between mb-2'>
                        <div
                          className={`px-2 py-0.5 rounded text-xs ${positionColors[position]}`}
                        >
                          {player.position}
                        </div>
                        <span className='text-cyan-400 text-sm'>
                          #{player.number}
                        </span>
                      </div>
                      <p className='text-white text-sm mb-1'>
                        {player.name}
                        {player.isCaptain && ' (C)'}
                      </p>
                      <p className='text-gray-400 text-xs'>
                        {player.team === 'player1' ? team1Name : team2Name}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}

          {filteredPlayers.length === 0 && (
            <div className='text-center py-8'>
              <p className='text-gray-400'>No players found</p>
              <p className='text-gray-500 text-sm mt-1'>
                Try a different search term
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
