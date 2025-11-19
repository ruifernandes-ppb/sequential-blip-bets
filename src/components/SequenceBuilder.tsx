import { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Sparkles, CheckCircle, AlertCircle, GripVertical, Send, MessageCircle, TrendingUp, Users } from 'lucide-react';
import { Match, SequenceOutcome } from '../App';
import { Button } from './ui/button';

interface SequenceBuilderProps {
  match: Match;
  onComplete: (sequence: SequenceOutcome[]) => void;
  onBack: () => void;
}

interface OutcomeTemplate {
  id: string;
  category: 'game' | 'point' | 'serve' | 'break' | 'rally';
  description: string;
  odds: number;
  icon: string;
  timeLimit: number;
}

const OUTCOME_TEMPLATES: OutcomeTemplate[] = [
  // Goal outcomes
  { id: 'player1-scores', category: 'game', description: '{player1} scores next goal', odds: 1.42, icon: '⚽', timeLimit: 15 },
  { id: 'player2-scores', category: 'game', description: '{player2} scores next goal', odds: 1.45, icon: '⚽', timeLimit: 15 },
  { id: 'no-goal-10min', category: 'game', description: 'No goals in next 10 minutes', odds: 1.28, icon: '🚫', timeLimit: 10 },
  { id: 'both-teams-score', category: 'game', description: 'Both teams score next', odds: 1.50, icon: '⚽⚽', timeLimit: 20 },
  
  // Shot outcomes
  { id: 'shot-on-target', category: 'point', description: 'Shot on target next minute', odds: 1.32, icon: '🎯', timeLimit: 5 },
  { id: 'player1-corner', category: 'point', description: '{player1} wins corner', odds: 1.35, icon: '🚩', timeLimit: 10 },
  { id: 'player2-corner', category: 'point', description: '{player2} wins corner', odds: 1.38, icon: '🚩', timeLimit: 10 },
  { id: 'offside-call', category: 'point', description: 'Offside in next 5 minutes', odds: 1.30, icon: '🏴', timeLimit: 5 },
  
  // Card outcomes
  { id: 'yellow-card', category: 'serve', description: 'Yellow card shown', odds: 1.40, icon: '🟨', timeLimit: 10 },
  { id: 'player1-yellow', category: 'serve', description: '{player1} player gets yellow', odds: 1.45, icon: '🟨', timeLimit: 12 },
  { id: 'player2-yellow', category: 'serve', description: '{player2} player gets yellow', odds: 1.48, icon: '🟨', timeLimit: 12 },
  
  // Possession outcomes
  { id: 'player1-attack', category: 'break', description: '{player1} dangerous attack', odds: 1.35, icon: '⚡', timeLimit: 8 },
  { id: 'player2-attack', category: 'break', description: '{player2} dangerous attack', odds: 1.38, icon: '⚡', timeLimit: 8 },
  { id: 'goalkeeper-save', category: 'break', description: 'Goalkeeper makes save', odds: 1.42, icon: '🧤', timeLimit: 10 },
  
  // Special outcomes
  { id: 'free-kick', category: 'rally', description: 'Free kick awarded', odds: 1.25, icon: '🦶', timeLimit: 8 },
  { id: 'substitution', category: 'rally', description: 'Substitution made', odds: 1.30, icon: '🔄', timeLimit: 15 },
  { id: 'penalty-appeal', category: 'rally', description: 'Penalty appeal', odds: 1.50, icon: '🙋', timeLimit: 10 },
];

const SUGGESTED_SEQUENCES = [
  {
    name: 'The Comeback',
    description: 'Break serve and hold momentum',
    outcomes: ['player1-breaks', 'player2-holds', 'break-back']
  },
  {
    name: 'Serve Dominance',
    description: 'Clean service games',
    outcomes: ['ace', 'player1-holds', 'love-game']
  },
  {
    name: 'Battle of Nerves',
    description: 'Pressure points decide it',
    outcomes: ['game-to-deuce', 'break-point', 'double-fault']
  }
];

interface PopularSequence {
  name: string;
  outcomes: string[];
  bettors: number;
  winRate: number;
}

interface FriendSequence {
  name: string;
  outcomes: string[];
  friendName: string;
  friendAvatar: string;
  status: 'live' | 'completed';
  result?: 'won' | 'lost';
}

const POPULAR_SEQUENCES: PopularSequence[] = [
  {
    name: 'Portugal Domination',
    outcomes: ['player1-scores', 'player1-corner', 'player1-attack'],
    bettors: 2847,
    winRate: 68
  },
  {
    name: 'High Pressure Match',
    outcomes: ['yellow-card', 'free-kick', 'player1-scores'],
    bettors: 1923,
    winRate: 72
  },
  {
    name: 'Corner to Goal',
    outcomes: ['player1-corner', 'shot-on-target', 'player1-scores'],
    bettors: 1654,
    winRate: 65
  },
  {
    name: 'Defensive Battle',
    outcomes: ['goalkeeper-save', 'no-goal-10min', 'yellow-card'],
    bettors: 1432,
    winRate: 58
  }
];

const FRIEND_SEQUENCES: FriendSequence[] = [
  {
    name: 'Sarah\'s Pick',
    outcomes: ['player1-scores', 'player1-corner', 'player1-attack'],
    friendName: 'Sarah Chen',
    friendAvatar: '👩',
    status: 'live'
  },
  {
    name: 'Mike\'s Streak',
    outcomes: ['shot-on-target', 'player1-scores', 'both-teams-score'],
    friendName: 'Mike Johnson',
    friendAvatar: '👨',
    status: 'completed',
    result: 'won'
  },
  {
    name: 'Alex\'s Bold',
    outcomes: ['free-kick', 'yellow-card', 'player2-scores'],
    friendName: 'Alex Kim',
    friendAvatar: '🧑',
    status: 'live'
  },
  {
    name: 'Emma\'s Risk',
    outcomes: ['penalty-appeal', 'player2-attack', 'offside-call'],
    friendName: 'Emma Davis',
    friendAvatar: '👩‍🦰',
    status: 'completed',
    result: 'lost'
  }
];

export function SequenceBuilder({ match, onComplete, onBack }: SequenceBuilderProps) {
  const [selectedOutcomes, setSelectedOutcomes] = useState<SequenceOutcome[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [searchResults, setSearchResults] = useState<OutcomeTemplate[]>([]);
  const [showChatResults, setShowChatResults] = useState(false);
  const [suggestionTab, setSuggestionTab] = useState<'popular' | 'friends'>('popular');

  const addOutcome = (template: OutcomeTemplate) => {
    const processedDescription = template.description
      .replace('{player1}', match.player1)
      .replace('{player2}', match.player2);
    
    const newOutcome: SequenceOutcome = {
      id: `${template.id}-${Date.now()}`,
      category: template.category,
      description: processedDescription,
      odds: template.odds,
      timeLimit: template.timeLimit,
      status: 'pending'
    };
    setSelectedOutcomes([...selectedOutcomes, newOutcome]);
    setShowSuggestions(false);
  };

  const removeOutcome = (id: string) => {
    setSelectedOutcomes(selectedOutcomes.filter(o => o.id !== id));
  };

  const loadSuggestedSequence = (outcomes: string[]) => {
    const sequence = outcomes.map((outcomeId, index) => {
      const template = OUTCOME_TEMPLATES.find(t => t.id === outcomeId);
      if (!template) return null;
      
      const processedDescription = template.description
        .replace('{player1}', match.player1)
        .replace('{player2}', match.player2);
      
      return {
        id: `${template.id}-${Date.now()}-${index}`,
        category: template.category,
        description: processedDescription,
        odds: template.odds,
        timeLimit: template.timeLimit,
        status: 'pending' as const
      };
    }).filter(Boolean) as SequenceOutcome[];
    
    setSelectedOutcomes(sequence);
    setShowSuggestions(false);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newOutcomes = [...selectedOutcomes];
    const draggedItem = newOutcomes[draggedIndex];
    newOutcomes.splice(draggedIndex, 1);
    newOutcomes.splice(index, 0, draggedItem);
    
    setSelectedOutcomes(newOutcomes);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleChatSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    // Natural language matching algorithm
    const searchLower = chatInput.toLowerCase();
    const keywords = searchLower.split(' ').filter(word => word.length > 2);
    
    // Score each template based on relevance
    const scoredTemplates = OUTCOME_TEMPLATES.map(template => {
      let score = 0;
      const descLower = template.description.toLowerCase();
      const categoryLower = template.category.toLowerCase();
      
      // Direct phrase match (highest priority)
      if (descLower.includes(searchLower)) {
        score += 100;
      }
      
      // Keyword matching
      keywords.forEach(keyword => {
        if (descLower.includes(keyword)) score += 20;
        if (categoryLower.includes(keyword)) score += 15;
        if (template.id.includes(keyword)) score += 10;
      });
      
      // Player name matching
      if (searchLower.includes('portugal') || searchLower.includes(match.player1.toLowerCase())) {
        if (template.id.includes('player1')) score += 30;
      }
      if (searchLower.includes('ireland') || searchLower.includes('armenia') || searchLower.includes(match.player2.toLowerCase())) {
        if (template.id.includes('player2')) score += 30;
      }
      
      // Specific term matching
      const termMatches: Record<string, string[]> = {
        'goal': ['scores', 'goal'],
        'score': ['scores'],
        'corner': ['corner'],
        'shot': ['shot'],
        'yellow': ['yellow'],
        'card': ['yellow', 'card'],
        'attack': ['attack'],
        'save': ['save'],
        'goalkeeper': ['save', 'goalkeeper'],
        'free kick': ['free-kick'],
        'offside': ['offside'],
        'penalty': ['penalty'],
        'substitution': ['substitution']
      };
      
      Object.entries(termMatches).forEach(([term, ids]) => {
        if (searchLower.includes(term)) {
          ids.forEach(id => {
            if (template.id.includes(id)) score += 25;
          });
        }
      });
      
      return { template, score };
    });
    
    // Sort by score and get top 6 results
    const topResults = scoredTemplates
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map(({ template }) => template);
    
    setSearchResults(topResults);
    setShowChatResults(true);
  };

  const totalOdds = selectedOutcomes.reduce((acc, outcome) => acc * outcome.odds, 1);
  const potentialWinnings = 10 * totalOdds;

  const categoryIcons = {
    game: '⚽',
    point: '🎯',
    serve: '🟨',
    break: '⚡',
    rally: '🦶'
  };

  // Group options by category
  const groupedOptions = OUTCOME_TEMPLATES.reduce((acc, option) => {
    if (!acc[option.category]) {
      acc[option.category] = [];
    }
    acc[option.category].push(option);
    return acc;
  }, {} as Record<string, OutcomeTemplate[]>);

  const categoryLabels = {
    game: '⚽ Goals',
    point: '🎯 Shots',
    serve: '🟨 Cards',
    break: '⚡ Attacks',
    rally: '🦶 Events'
  };

  return (
    <div className="min-h-screen flex flex-col p-4 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 mt-2">
        <button onClick={onBack} className="text-white p-2">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-white">Build Your Sequence</h1>
          <p className="text-gray-400 text-sm">{match.player1} vs {match.player2}</p>
        </div>
      </div>

      {/* Selected Sequence Timeline */}
      {selectedOutcomes.length > 0 && (
        <div className="bg-gradient-to-br from-[#1a2f4d] to-[#0f1f3d] rounded-2xl p-4 mb-4 border border-cyan-500/30">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white flex items-center gap-2">
              <span>Your Timeline ({selectedOutcomes.length})</span>
            </h3>
            <p className="text-gray-400 text-xs">Drag to reorder</p>
          </div>
          
          <div className="space-y-2 mb-4">
            {selectedOutcomes.map((outcome, index) => (
              <div
                key={outcome.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`flex items-center gap-3 bg-[#0f1f3d] rounded-xl p-3 cursor-move transition-all ${
                  draggedIndex === index ? 'opacity-50' : 'hover:bg-[#1a2f4d]'
                }`}
              >
                <GripVertical className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex-shrink-0 text-sm">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm">{outcome.description}</p>
                  <p className="text-gray-400 text-xs">{outcome.odds.toFixed(2)}x • {outcome.timeLimit}s window</p>
                </div>
                <span className="text-xl">{categoryIcons[outcome.category]}</span>
                <button
                  onClick={() => removeOutcome(outcome.id)}
                  className="text-red-400 hover:text-red-300 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Total Odds */}
          <div className="pt-3 border-t border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Individual Bets</span>
              <span className="text-cyan-400">{selectedOutcomes.length} × $10.00</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Streak Bonus (all correct)</span>
              <span className="text-green-400">+{(selectedOutcomes.length * 20).toFixed(0)}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Suggested Sequences */}
      {showSuggestions && selectedOutcomes.length === 0 && (
        <div className="mb-4">
          {/* Tabs */}
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setSuggestionTab('popular')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
                suggestionTab === 'popular'
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                  : 'bg-[#1a2f4d] text-gray-400 hover:text-white'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">Popular</span>
            </button>
            <button
              onClick={() => setSuggestionTab('friends')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
                suggestionTab === 'friends'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-[#1a2f4d] text-gray-400 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span className="text-sm">Friends</span>
            </button>
          </div>

          {/* Popular Sequences */}
          {suggestionTab === 'popular' && (
            <div className="space-y-2">
              {POPULAR_SEQUENCES.map((seq, index) => (
                <button
                  key={index}
                  onClick={() => loadSuggestedSequence(seq.outcomes)}
                  className="w-full bg-gradient-to-br from-[#1a2f4d] to-[#0f1f3d] border border-orange-500/30 rounded-xl p-3 text-left hover:border-orange-500/60 transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="text-white text-sm mb-1">{seq.name}</p>
                      <p className="text-gray-400 text-xs">{seq.outcomes.length} outcomes</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-1">
                        <span className="text-orange-400 text-xs">{(seq.bettors / 1000).toFixed(1)}K</span>
                        <TrendingUp className="w-3 h-3 text-orange-400" />
                      </div>
                      <span className="text-green-400 text-xs">{seq.winRate}% win</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {seq.outcomes.slice(0, 3).map((outcomeId, idx) => {
                      const template = OUTCOME_TEMPLATES.find(t => t.id === outcomeId);
                      return template ? (
                        <span key={idx} className="text-xs bg-[#0f1f3d] px-2 py-0.5 rounded text-gray-300">
                          {template.icon} {template.description.replace('{player1}', match.player1.split(' ')[0]).replace('{player2}', match.player2.split(' ')[0])}
                        </span>
                      ) : null;
                    })}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Friends Sequences */}
          {suggestionTab === 'friends' && (
            <div className="space-y-2">
              {FRIEND_SEQUENCES.map((seq, index) => (
                <button
                  key={index}
                  onClick={() => loadSuggestedSequence(seq.outcomes)}
                  className="w-full bg-gradient-to-br from-[#1a2f4d] to-[#0f1f3d] border border-purple-500/30 rounded-xl p-3 text-left hover:border-purple-500/60 transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-2xl">{seq.friendAvatar}</span>
                      <div>
                        <p className="text-white text-sm">{seq.name}</p>
                        <p className="text-gray-400 text-xs">{seq.friendName}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {seq.status === 'live' ? (
                        <span className="flex items-center gap-1 text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">
                          <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
                          LIVE
                        </span>
                      ) : seq.result === 'won' ? (
                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                          WON
                        </span>
                      ) : (
                        <span className="text-xs bg-gray-500/20 text-gray-400 px-2 py-0.5 rounded-full">
                          LOST
                        </span>
                      )}
                      <span className="text-purple-400 text-xs">{seq.outcomes.length} picks</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {seq.outcomes.slice(0, 3).map((outcomeId, idx) => {
                      const template = OUTCOME_TEMPLATES.find(t => t.id === outcomeId);
                      return template ? (
                        <span key={idx} className="text-xs bg-[#0f1f3d] px-2 py-0.5 rounded text-gray-300">
                          {template.icon}
                        </span>
                      ) : null;
                    })}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* AI Chat Search */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <MessageCircle className="w-4 h-4 text-cyan-400" />
          <h3 className="text-white">Ask for outcomes</h3>
        </div>
        
        <form onSubmit={handleChatSearch} className="relative">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="e.g., 'Portugal scores, then corner, then yellow card'"
            className="w-full bg-[#1a2f4d] text-white placeholder-gray-500 rounded-xl px-4 py-3 pr-12 border border-cyan-500/30 focus:border-cyan-500/60 focus:outline-none"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg transition-colors"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </form>

        {/* Search Results */}
        {showChatResults && searchResults.length > 0 && (
          <div className="mt-3 bg-[#0f1f3d] border border-cyan-500/30 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-cyan-400 text-sm">Top matches for "{chatInput}"</p>
              <button 
                onClick={() => setShowChatResults(false)}
                className="text-gray-400 hover:text-white text-xs"
              >
                Clear
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {searchResults.map(template => {
                const processedDescription = template.description
                  .replace('{player1}', match.player1)
                  .replace('{player2}', match.player2);
                
                return (
                  <button
                    key={template.id}
                    onClick={() => {
                      addOutcome(template);
                      setChatInput('');
                      setShowChatResults(false);
                    }}
                    className="bg-[#1a2f4d] hover:bg-[#243a5c] text-white p-3 rounded-xl text-sm text-left transition-all active:scale-95 border border-cyan-500/20"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="flex-1 pr-2">{processedDescription}</p>
                      <span className="text-lg">{template.icon}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-cyan-400 text-xs">{template.odds.toFixed(2)}x</span>
                      <span className="text-gray-500 text-xs">{template.timeLimit}s</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {showChatResults && searchResults.length === 0 && (
          <div className="mt-3 bg-red-600/20 border border-red-500/30 rounded-xl p-3">
            <p className="text-red-300 text-sm">No matches found. Try different keywords like "goal", "corner", "yellow card", or team names.</p>
          </div>
        )}
      </div>

      {/* Available Outcomes */}
      <div className="flex-1 overflow-y-auto">
        <h3 className="text-white mb-3 flex items-center gap-2">
          <Plus className="w-4 h-4 text-cyan-400" />
          Add to Timeline
        </h3>

        {Object.entries(groupedOptions).map(([category, options]) => (
          <div key={category} className="mb-4">
            <p className="text-gray-400 text-sm mb-2">{categoryLabels[category as keyof typeof categoryLabels]}</p>
            <div className="grid grid-cols-2 gap-2">
              {options.map(template => {
                const processedDescription = template.description
                  .replace('{player1}', match.player1)
                  .replace('{player2}', match.player2);
                
                return (
                  <button
                    key={template.id}
                    onClick={() => addOutcome(template)}
                    className="bg-[#1a2f4d] hover:bg-[#243a5c] text-white p-3 rounded-xl text-sm text-left transition-all active:scale-95"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="flex-1 pr-2">{processedDescription}</p>
                      <span className="text-lg">{template.icon}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-cyan-400 text-xs">{template.odds.toFixed(2)}x</span>
                      <span className="text-gray-500 text-xs">{template.timeLimit}s</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Start Button */}
      {selectedOutcomes.length > 0 && (
        <Button
          onClick={() => onComplete(selectedOutcomes)}
          className="w-full bg-gradient-to-r from-cyan-400 to-green-400 hover:from-cyan-500 hover:to-green-500 text-[#0a1628] py-6 rounded-2xl mt-4 shadow-lg shadow-cyan-500/50"
        >
          <div className="flex items-center justify-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span>Watch Timeline Live (${potentialWinnings.toFixed(2)} max)</span>
          </div>
        </Button>
      )}

      {selectedOutcomes.length === 0 && (
        <div className="flex items-center justify-center gap-2 text-gray-400 text-sm py-6">
          <AlertCircle className="w-4 h-4" />
          <span>Add at least one outcome to continue</span>
        </div>
      )}
    </div>
  );
}