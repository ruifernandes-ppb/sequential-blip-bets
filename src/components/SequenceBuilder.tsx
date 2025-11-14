import { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Sparkles, CheckCircle, AlertCircle, GripVertical, Send, MessageCircle } from 'lucide-react';
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
  // Game outcomes
  { id: 'player1-wins-game', category: 'game', description: '{player1} wins next game', odds: 1.40, icon: '🎾', timeLimit: 15 },
  { id: 'player2-wins-game', category: 'game', description: '{player2} wins next game', odds: 1.45, icon: '🎾', timeLimit: 15 },
  { id: 'game-to-deuce', category: 'game', description: 'Game goes to deuce', odds: 1.35, icon: '🎾', timeLimit: 12 },
  { id: 'love-game', category: 'game', description: 'Server wins at love', odds: 1.50, icon: '🎾', timeLimit: 10 },
  
  // Point outcomes
  { id: 'ace', category: 'point', description: 'Ace in next game', odds: 1.42, icon: '⚡', timeLimit: 12 },
  { id: 'double-fault', category: 'point', description: 'Double fault in next game', odds: 1.38, icon: '❌', timeLimit: 12 },
  { id: 'break-point', category: 'point', description: 'Break point opportunity', odds: 1.30, icon: '🔥', timeLimit: 10 },
  { id: 'winner-shot', category: 'point', description: 'Winner on next point', odds: 1.35, icon: '💥', timeLimit: 8 },
  
  // Serve outcomes
  { id: 'player1-holds', category: 'serve', description: '{player1} holds serve', odds: 1.25, icon: '✓', timeLimit: 15 },
  { id: 'player2-holds', category: 'serve', description: '{player2} holds serve', odds: 1.28, icon: '✓', timeLimit: 15 },
  { id: 'first-serve-in', category: 'serve', description: '3+ first serves in next game', odds: 1.22, icon: '🎯', timeLimit: 12 },
  
  // Break outcomes
  { id: 'player1-breaks', category: 'break', description: '{player1} breaks serve', odds: 1.48, icon: '💪', timeLimit: 15 },
  { id: 'player2-breaks', category: 'break', description: '{player2} breaks serve', odds: 1.50, icon: '💪', timeLimit: 15 },
  { id: 'break-back', category: 'break', description: 'Immediate break back', odds: 1.45, icon: '🔄', timeLimit: 15 },
  
  // Rally outcomes
  { id: 'long-rally', category: 'rally', description: 'Rally of 10+ shots', odds: 1.38, icon: '🏓', timeLimit: 10 },
  { id: 'net-point', category: 'rally', description: 'Point won at net', odds: 1.32, icon: '🏐', timeLimit: 8 },
  { id: 'baseline-winner', category: 'rally', description: 'Baseline winner', odds: 1.30, icon: '🎯', timeLimit: 8 },
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

export function SequenceBuilder({ match, onComplete, onBack }: SequenceBuilderProps) {
  const [selectedOutcomes, setSelectedOutcomes] = useState<SequenceOutcome[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [searchResults, setSearchResults] = useState<OutcomeTemplate[]>([]);
  const [showChatResults, setShowChatResults] = useState(false);

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
      if (searchLower.includes('alcaraz') || searchLower.includes(match.player1.toLowerCase())) {
        if (template.id.includes('player1')) score += 30;
      }
      if (searchLower.includes('sinner') || searchLower.includes(match.player2.toLowerCase())) {
        if (template.id.includes('player2')) score += 30;
      }
      
      // Specific term matching
      const termMatches: Record<string, string[]> = {
        'ace': ['ace'],
        'double fault': ['double-fault', 'fault'],
        'break': ['break', 'breaks'],
        'hold': ['hold', 'holds'],
        'deuce': ['deuce'],
        'love': ['love'],
        'rally': ['rally'],
        'net': ['net'],
        'winner': ['winner'],
        'serve': ['serve', 'holds', 'breaks'],
        'game': ['game', 'wins'],
        'point': ['point', 'break-point']
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
    game: '🎾',
    point: '⚡',
    serve: '✓',
    break: '💪',
    rally: '🏓'
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
    game: '🎾 Games',
    point: '⚡ Points',
    serve: '✓ Serves',
    break: '💪 Breaks',
    rally: '🏓 Rallies'
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
          <h3 className="text-white mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            Suggested Sequences
          </h3>
          <div className="space-y-2">
            {SUGGESTED_SEQUENCES.map((seq, index) => (
              <button
                key={index}
                onClick={() => loadSuggestedSequence(seq.outcomes)}
                className="w-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl p-3 text-left hover:border-purple-500/60 transition-all"
              >
                <p className="text-white text-sm mb-1">{seq.name}</p>
                <p className="text-gray-400 text-xs">{seq.description}</p>
              </button>
            ))}
          </div>
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
            placeholder="e.g., 'Alcaraz wins, then double fault, then breaks serve'"
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
            <p className="text-red-300 text-sm">No matches found. Try different keywords like "ace", "break serve", or player names.</p>
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