import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { Match } from '../App';

interface OutcomeTemplate {
  id: string;
  category: 'game' | 'point' | 'serve' | 'break' | 'rally';
  description: string;
  odds: number;
  icon: string;
  timeLimit: number;
  allowPlayerSelection?: boolean;
  playerSelectionTeam?: 'player1' | 'player2' | 'both';
}

interface OutcomeListProps {
  match: Match;
  outcomeTemplates: OutcomeTemplate[];
  onOutcomeClick: (template: OutcomeTemplate) => void;
  showCategories?: boolean;
}

const categoryLabels = {
  game: '⚽ Goals',
  point: '🎯 Shots',
  serve: '🟨 Cards',
  break: '⚡ Attacks',
  rally: '🦶 Events'
};

export function OutcomeList({ match, outcomeTemplates, onOutcomeClick, showCategories = true }: OutcomeListProps) {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const groupedOptions = outcomeTemplates.reduce((acc, option) => {
    if (!acc[option.category]) {
      acc[option.category] = [];
    }
    acc[option.category].push(option);
    return acc;
  }, {} as Record<string, OutcomeTemplate[]>);

  if (!showCategories) {
    // Simple grid without categories
    return (
      <div className="grid grid-cols-2 gap-2">
        {outcomeTemplates.map(template => {
          const processedDescription = template.description
            .replace('{player1}', match.player1)
            .replace('{player2}', match.player2);
          
          return (
            <button
              key={template.id}
              onClick={() => onOutcomeClick(template)}
              className={`bg-[#1a2f4d] hover:bg-[#243a5c] text-white p-3 rounded-xl text-sm text-left transition-all active:scale-95 relative ${
                template.allowPlayerSelection ? 'border-2 border-purple-500/40' : ''
              }`}
            >
              {template.allowPlayerSelection && (
                <div className="absolute top-1 right-1 bg-purple-500 text-white text-xs px-1.5 py-0.5 rounded flex items-center gap-0.5">
                  <UserPlus className="w-3 h-3" />
                </div>
              )}
              <div className="flex items-start justify-between mb-2">
                <p className="flex-1 pr-2">{processedDescription}</p>
                <span className="text-lg">{template.icon}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-cyan-400 text-xs">{template.odds.toFixed(2)}x</span>
                <span className="text-gray-500 text-xs">{template.timeLimit}s</span>
              </div>
              {template.allowPlayerSelection && (
                <p className="text-purple-400 text-xs mt-1">Choose player</p>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // Categorized view with show more/less
  return (
    <>
      {Object.entries(groupedOptions).map(([category, options]) => {
        const isExpanded = expandedCategories[category];
        const displayOptions = isExpanded ? options : options.slice(0, 4);
        const hasMore = options.length > 4;

        return (
          <div key={category} className="mb-4">
            <p className="text-gray-400 text-sm mb-2">{categoryLabels[category as keyof typeof categoryLabels]}</p>
            <div className="grid grid-cols-2 gap-2">
              {displayOptions.map(template => {
                const processedDescription = template.description
                  .replace('{player1}', match.player1)
                  .replace('{player2}', match.player2);
                
                return (
                  <button
                    key={template.id}
                    onClick={() => onOutcomeClick(template)}
                    className={`bg-[#1a2f4d] hover:bg-[#243a5c] text-white p-3 rounded-xl text-sm text-left transition-all active:scale-95 relative ${
                      template.allowPlayerSelection ? 'border-2 border-purple-500/40' : ''
                    }`}
                  >
                    {template.allowPlayerSelection && (
                      <div className="absolute top-1 right-1 bg-purple-500 text-white text-xs px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <UserPlus className="w-3 h-3" />
                      </div>
                    )}
                    <div className="flex items-start justify-between mb-2">
                      <p className="flex-1 pr-2">{processedDescription}</p>
                      <span className="text-lg">{template.icon}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-cyan-400 text-xs">{template.odds.toFixed(2)}x</span>
                      <span className="text-gray-500 text-xs">{template.timeLimit}s</span>
                    </div>
                    {template.allowPlayerSelection && (
                      <p className="text-purple-400 text-xs mt-1">Choose player</p>
                    )}
                  </button>
                );
              })}
            </div>
            {hasMore && (
              <button
                onClick={() => toggleCategory(category)}
                className="w-full mt-2 text-cyan-400 text-sm hover:text-cyan-300 transition-colors"
              >
                {isExpanded ? 'Show less' : `Show more (${options.length - 4} more)`}
              </button>
            )}
          </div>
        );
      })}
    </>
  );
}
