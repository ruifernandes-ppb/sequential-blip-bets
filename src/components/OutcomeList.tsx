import { useState } from 'react';
import { UserPlus, CheckCircle } from 'lucide-react';
import { Match, SequenceOutcome } from '../App';
import { OutcomeTemplate } from '../data/outcomeTemplates';

interface OutcomeListProps {
  match: Match;
  outcomeTemplates: OutcomeTemplate[];
  onOutcomeClick: (template: OutcomeTemplate) => void;
  showCategories?: boolean;
  selectedOutcomes?: SequenceOutcome[];
}

const categoryLabels = {
  'player-attacking': '⚡ Player Attacking',
  'player-fouls': '🚨 Player Fouls & Cards',
  'player-defensive': '🛡️ Player Defensive',
  'team-goals': '⚽ Team Goals & Attacks',
  'team-fouls': '🟨 Team Fouls & Cards',
  'player-penalty': '🎯 Penalty Events',
  'player-goalkeeper': '� Goalkeeper Actions',
};

export function OutcomeList({
  match,
  outcomeTemplates,
  onOutcomeClick,
  showCategories = true,
  selectedOutcomes = [],
}: OutcomeListProps) {
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({});

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  // Create team-specific variants for team-level outcomes
  const expandedTemplates = outcomeTemplates.flatMap((template) => {
    // If it's a team-level category, create two variants (one for each team)
    if (
      template.category === 'team-goals' ||
      template.category === 'team-fouls'
    ) {
      return [
        {
          ...template,
          id: `${template.id}-player1`,
          description: template.description.replace(
            '{playerName}',
            match.player1
          ),
        },
        {
          ...template,
          id: `${template.id}-player2`,
          description: template.description.replace(
            '{playerName}',
            match.player2
          ),
        },
      ];
    }
    // For player-level outcomes, return as-is
    return [template];
  });

  const groupedOptions = expandedTemplates.reduce((acc, option) => {
    if (!acc[option.category]) {
      acc[option.category] = [];
    }
    acc[option.category].push(option);
    return acc;
  }, {} as Record<string, OutcomeTemplate[]>);

  if (!showCategories) {
    // Simple grid without categories
    return (
      <div className='grid grid-cols-2 gap-2'>
        {expandedTemplates.map((template) => {
          const processedDescription = template.allowPlayerSelection
            ? template.description.replace('{playerName}', 'Player')
            : template.description;

          // Check if this team outcome is already selected
          const isTeamOutcome =
            template.category === 'team-goals' ||
            template.category === 'team-fouls';
          const isAlreadySelected =
            isTeamOutcome &&
            selectedOutcomes.some(
              (outcome) => outcome.description === template.description
            );

          return (
            <button
              key={template.id}
              onClick={() => !isAlreadySelected && onOutcomeClick(template)}
              disabled={isAlreadySelected}
              className={`bg-[#1a2f4d] text-white p-3 rounded-xl text-sm text-left transition-all relative ${
                isAlreadySelected
                  ? 'opacity-50 cursor-not-allowed border-2 border-green-500/60'
                  : template.allowPlayerSelection
                  ? 'border-2 border-purple-500/40 hover:bg-[#243a5c] active:scale-95'
                  : 'hover:bg-[#243a5c] active:scale-95'
              }`}
            >
              {template.allowPlayerSelection && !isAlreadySelected && (
                <div className='absolute bottom-3 right-3 bg-purple-500 text-white text-xs px-1.5 py-0.5 rounded flex items-center gap-0.5'>
                  <UserPlus className='w-3 h-3' />
                </div>
              )}
              <div className='flex items-start justify-between mb-2'>
                <p className='flex-1 pr-2'>{processedDescription}</p>
                <span className='text-lg'>{template.icon}</span>
              </div>
              <div className='flex items-center justify-between'>
                {!template.allowPlayerSelection && (
                  <span
                    className={`text-xs ${
                      isAlreadySelected ? 'text-gray-500' : 'text-cyan-400'
                    }`}
                  >
                    {template.odds.toFixed(2)}x
                  </span>
                )}
              </div>
              {template.allowPlayerSelection && !isAlreadySelected && (
                <p className='text-purple-400 text-xs mt-1'>Choose player</p>
              )}
              {isAlreadySelected && (
                <p className='text-green-400 text-xs mt-1'>Already selected</p>
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
          <div key={category} className='mb-4'>
            <p className='text-gray-400 text-sm mb-2'>
              {categoryLabels[category as keyof typeof categoryLabels]}
            </p>
            <div className='grid grid-cols-2 gap-2'>
              {displayOptions.map((template) => {
                const processedDescription = template.allowPlayerSelection
                  ? template.description.replace('{playerName}', 'Player')
                  : template.description;

                // Check if this team outcome is already selected
                const isTeamOutcome =
                  template.category === 'team-goals' ||
                  template.category === 'team-fouls';
                const isAlreadySelected =
                  isTeamOutcome &&
                  selectedOutcomes.some(
                    (outcome) => outcome.description === template.description
                  );

                return (
                  <button
                    key={template.id}
                    onClick={() =>
                      !isAlreadySelected && onOutcomeClick(template)
                    }
                    disabled={isAlreadySelected}
                    className={`bg-[#1a2f4d] text-white p-3 rounded-xl text-sm text-left transition-all relative ${
                      isAlreadySelected
                        ? 'opacity-50 cursor-not-allowed border-2 border-green-500/60'
                        : template.allowPlayerSelection
                        ? 'border-2 border-purple-500/40 hover:bg-[#243a5c] active:scale-95'
                        : 'hover:bg-[#243a5c] active:scale-95'
                    }`}
                  >
                    {template.allowPlayerSelection && !isAlreadySelected && (
                      <div className='absolute bottom-3 right-3 bg-purple-500 text-white text-xs px-1.5 py-0.5 rounded flex items-center gap-0.5'>
                        <UserPlus className='w-3 h-3' />
                      </div>
                    )}
                    <div className='flex items-start justify-between mb-2'>
                      <p className='flex-1 pr-2'>{processedDescription}</p>
                      <span className='text-lg'>{template.icon}</span>
                    </div>
                    <div className='flex items-center justify-between'>
                      {!template.allowPlayerSelection && (
                        <span
                          className={`text-xs ${
                            isAlreadySelected
                              ? 'text-gray-500'
                              : 'text-cyan-400'
                          }`}
                        >
                          {template.odds.toFixed(2)}x
                        </span>
                      )}
                    </div>
                    {template.allowPlayerSelection && !isAlreadySelected && (
                      <p className='text-purple-400 text-xs mt-1'>
                        Choose player
                      </p>
                    )}
                    {isAlreadySelected && (
                      <p className='text-green-400 text-xs mt-1'>
                        Already selected
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
            {hasMore && (
              <button
                onClick={() => toggleCategory(category)}
                className='w-full mt-2 text-cyan-400 text-sm hover:text-cyan-300 transition-colors'
              >
                {isExpanded
                  ? 'Show less'
                  : `Show more (${options.length - 4} more)`}
              </button>
            )}
          </div>
        );
      })}
    </>
  );
}
