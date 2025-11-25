import { useState } from 'react';
import {
  ArrowLeft,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  GripVertical,
  Send,
  MessageCircle,
  TrendingUp,
  Users,
  UserPlus,
  Receipt,
} from 'lucide-react';
import { Match, SequenceOutcome } from '../App';
import { Button } from './ui/button';
import { PlayerSelector } from './PlayerSelector';
import { toast } from 'sonner';
import { useBetStore } from '../stores/useBetStore';
import { OUTCOME_TEMPLATES, OutcomeTemplate } from '../data/outcomeTemplates';
import { POPULAR_SEQUENCES, FRIEND_SEQUENCES } from '../data/sequences';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SequenceBuilderProps {
  match: Match;
  onComplete: (sequence: SequenceOutcome[]) => void;
  onBack: () => void;
}

interface Player {
  id: string;
  name: string;
  number: number;
  position: string;
  team: 'player1' | 'player2';
  oddsModifier?: number;
}

interface SortableOutcomeItemProps {
  outcome: SequenceOutcome;
  index: number;
  categoryIcons: Record<string, string>;
  onRemove: (id: string) => void;
}

function SortableOutcomeItem({
  outcome,
  index,
  categoryIcons,
  onRemove,
}: SortableOutcomeItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: outcome.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 bg-[#0f1f3d] rounded-xl p-3 transition-all ${
        isDragging ? 'opacity-50' : 'hover:bg-[#1a2f4d]'
      }`}
    >
      <div className='cursor-move touch-none'>
        <GripVertical
          className='w-4 h-4 text-gray-500 flex-shrink-0 touch-none'
          {...attributes}
          {...listeners}
        />
      </div>
      <div className='flex items-center justify-center w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex-shrink-0 text-sm'>
        {index + 1}
      </div>
      <div className='flex-1 min-w-0'>
        <p className='text-white text-sm'>{outcome.description}</p>
        <p className='text-gray-400 text-xs'>
          {outcome.odds.toFixed(2)}x • {outcome.timeLimit}s window
        </p>
      </div>
      <span className='text-xl'>{categoryIcons[outcome.category]}</span>
      <button
        onClick={() => onRemove(outcome.id)}
        className='text-red-400 hover:text-red-300 p-1'
      >
        <Trash2 className='w-4 h-4' />
      </button>
    </div>
  );
}

export function SequenceBuilder({
  match,
  onComplete,
  onBack,
}: SequenceBuilderProps) {
  const [selectedOutcomes, setSelectedOutcomes] = useState<SequenceOutcome[]>(
    []
  );
  const [chatInput, setChatInput] = useState('');
  const [searchResults, setSearchResults] = useState<OutcomeTemplate[]>([]);
  const [showChatResults, setShowChatResults] = useState(false);
  const [suggestionTab, setSuggestionTab] = useState<'popular' | 'friends'>(
    'popular'
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {}),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const [showPlayerSelector, setShowPlayerSelector] = useState(false);
  const [pendingTemplate, setPendingTemplate] =
    useState<OutcomeTemplate | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({});

  const [initialStake, setInitialStake] = useState<number>(0); // Initial stake of €10

  // const placedBets = useBetStore((state) => state.placedBets);
  // const activeBets = placedBets.filter(
  //   (bet) =>
  //     bet.matchId === match.id &&
  //     (bet.status === 'pending' || bet.status === 'live')
  // );

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleOutcomeClick = (template: OutcomeTemplate) => {
    if (template.allowPlayerSelection) {
      setPendingTemplate(template);
      setShowPlayerSelector(true);
    } else {
      addOutcome(template, null);
    }
  };

  const handlePlayerSelect = (player: Player) => {
    if (pendingTemplate) {
      addOutcome(pendingTemplate, player);
      setPendingTemplate(null);
    }
  };

  const addOutcome = (template: OutcomeTemplate, player: Player | null) => {
    let processedDescription = template.description;

    // Only process player name replacement for player-level outcomes
    if (player && template.allowPlayerSelection) {
      processedDescription = processedDescription.replace(
        '{playerName}',
        player.name
      );
    }

    const newOutcome: SequenceOutcome = {
      id: `${template.id}-${Date.now()}`,
      category: template.category,
      description: processedDescription,
      odds: template.odds + (player?.oddsModifier ?? 0),
      timeLimit: template.timeLimit,
      status: 'pending',
    };
    setSelectedOutcomes([...selectedOutcomes, newOutcome]);

    // Show success feedback
    toast.success(`Added: ${processedDescription}`, {
      duration: 2000,
      icon: template.icon,
      position: 'top-center',
    });
  };

  const removeOutcome = (id: string) => {
    setSelectedOutcomes(selectedOutcomes.filter((o) => o.id !== id));
  };

  const loadSequence = (outcomes: string[]) => {
    const sequence = outcomes
      .map((outcomeId, index) => {
        const template = OUTCOME_TEMPLATES.find((t) => t.id === outcomeId);
        if (!template) return null;

        const processedDescription = template.description
          .replace('{player1}', match.player1)
          .replace('{player2}', match.player2)
          .replace(
            '{playerName}',
            Math.random() > 0.5 ? match.player1 : match.player2
          );

        return {
          id: `${template.id}-${Date.now()}-${index}`,
          category: template.category,
          description: processedDescription,
          odds: template.odds,
          timeLimit: template.timeLimit,
          status: 'pending' as const,
        };
      })
      .filter(Boolean) as SequenceOutcome[];

    setSelectedOutcomes(sequence);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setSelectedOutcomes((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleChatSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const searchLower = chatInput.toLowerCase();
    const keywords = searchLower.split(' ').filter((word) => word.length > 2);

    const scoredTemplates = expandedTemplates.map((template) => {
      let score = 0;
      const descLower = template.description.toLowerCase();
      const categoryLower = template.category.toLowerCase();

      if (descLower.includes(searchLower)) score += 100;

      keywords.forEach((keyword) => {
        if (descLower.includes(keyword)) score += 20;
        if (categoryLower.includes(keyword)) score += 15;
        if (template.id.includes(keyword)) score += 10;
      });

      if (
        searchLower.includes('portugal') ||
        searchLower.includes(match.player1.toLowerCase())
      ) {
        if (template.id.includes('player1')) score += 30;
      }
      if (
        searchLower.includes('ireland') ||
        searchLower.includes('armenia') ||
        searchLower.includes(match.player2.toLowerCase())
      ) {
        if (template.id.includes('player2')) score += 30;
      }

      const termMatches: Record<string, string[]> = {
        goal: ['scores', 'goal'],
        score: ['scores'],
        corner: ['corner'],
        shot: ['shot'],
        yellow: ['yellow'],
        card: ['yellow', 'card'],
        attack: ['attack'],
        save: ['save'],
        goalkeeper: ['save', 'goalkeeper'],
        'free kick': ['free-kick'],
        offside: ['offside'],
        penalty: ['penalty'],
        substitution: ['substitution'],
      };

      Object.entries(termMatches).forEach(([term, ids]) => {
        if (searchLower.includes(term)) {
          ids.forEach((id) => {
            if (template.id.includes(id)) score += 25;
          });
        }
      });

      return { template, score };
    });

    const topResults = scoredTemplates
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map(({ template }) => template);

    setSearchResults(topResults);
    setShowChatResults(true);
  };

  const categoryIcons = {
    'team-goals': '⚽',
    'team-fouls': '🟨',
    'player-attacking': '⚡',
    'player-fouls': '🚨',
    'player-defensive': '�️',
    'player-penalty': '🎯',
    'player-goalkeeper': '�',
  };

  // Create team-specific variants for team-level outcomes
  const expandedTemplates = OUTCOME_TEMPLATES.flatMap((template) => {
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

  const categoryLabels = {
    'player-attacking': '⚡ Player Attacking',
    'player-fouls': '🚨 Player Fouls & Cards',
    'player-defensive': '🛡️ Player Defensive',
    'team-goals': '⚽ Team Goals & Attacks',
    'team-fouls': '🟨 Team Fouls & Cards',
    'player-penalty': '🎯 Penalty Events',
    'player-goalkeeper': '🧤 Goalkeeper Actions',
  };

  const MAX_EVENT_ODD = 5;
  // Calculate difficulty multiplier (higher odds = harder = higher payout)
  // Start with higher base and multiply by inverse of each odd
  const difficultyMultiplier = selectedOutcomes.reduce((acc, outcome) => {
    const cappedOdd = Math.min(outcome.odds, MAX_EVENT_ODD);
    return acc * cappedOdd;
  }, 1);

  // 2. Calculate bonus multiplier for sequences longer than 3 steps (5% per additional step)
  const lengthBonus =
    selectedOutcomes.length > 3 ? 0.05 * (selectedOutcomes.length - 3) : 0;

  // 3. Calculate potential payout: stake * difficulty multiplier * (1 + bonus)
  const potentialGains =
    selectedOutcomes.length >= 3
      ? initialStake * difficultyMultiplier * (1 + lengthBonus)
      : 0;

  return (
    <div className='min-h-screen flex flex-col p-4 max-w-md mx-auto pb-28'>
      <div className='flex items-center gap-3 mb-6 mt-2'>
        <button onClick={onBack} className='text-white p-2'>
          <ArrowLeft className='w-5 h-5' />
        </button>
        <div className='flex-1'>
          <h1 className='text-white'>Build Your Sequence</h1>
          <p className='text-gray-400 text-sm'>
            {match.player1} vs {match.player2}
          </p>
        </div>
      </div>

      {/* Initial Stake Input */}
      <div className='bg-gradient-to-br from-[#1a2f4d] to-[#0f1f3d] rounded-2xl p-4 mb-4 border border-cyan-500/30'>
        <label className='text-white text-sm mb-2 block flex items-center gap-2'>
          Set your stake
        </label>
        <div className='relative'>
          <span className='absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400 text-lg'>
            €
          </span>
          <input
            type='number'
            min='1'
            step='10'
            value={initialStake || ''}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              if (value > 0 || e.target.value === '') {
                setInitialStake(value || 0);
              }
            }}
            onBlur={(e) => {
              const value = parseFloat(e.target.value);
              if (!value || value <= 0) {
                setInitialStake(0);
              }
            }}
            placeholder='10.00'
            className='w-full bg-[#0f1f3d] text-white text-lg placeholder-gray-500 rounded-xl pl-10 pr-4 py-3 border border-cyan-500/30 focus:border-cyan-500/60 focus:outline-none'
          />
        </div>
        {initialStake > 0 && selectedOutcomes.length > 0 && (
          <div className='pt-3 border-t border-gray-700'>
            <div className='flex items-center justify-between mb-2'>
              <span className='text-gray-400'>Your stake</span>
              <span className='text-cyan-400'>€{initialStake.toFixed(2)}</span>
            </div>
            <div className='flex items-center justify-between mb-2'>
              <span className='text-gray-400'>Potential gains</span>
              <span className='text-green-400'>
                €{potentialGains.toFixed(2)}
              </span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-gray-400'>Bonus (&gt;3 outcomes)</span>
              <span className='text-green-400'>
                {selectedOutcomes.length > 3
                  ? `+${((selectedOutcomes.length - 3) * 5).toFixed(0)}`
                  : 0}
                %
              </span>
            </div>
          </div>
        )}
      </div>

      {/* My Placed Bets */}
      {/* {activeBets.length > 0 && (
        <div className='mb-4 bg-gradient-to-br from-[#1a2f4d] to-[#0f1f3d] rounded-2xl p-4 border border-cyan-500/30'>
          <div className='flex items-center justify-between mb-3'>
            <h3 className='text-white flex items-center gap-2'>
              <Receipt className='w-4 h-4 text-cyan-400' />
              My Placed Bets ({activeBets.length})
            </h3>
            <div className='w-2 h-2 bg-red-400 rounded-full animate-pulse' />
          </div>

          <div className='space-y-2'>
            {activeBets.slice(0, 2).map((bet) => (
              <div
                key={bet.id}
                className='bg-[#0f1f3d] rounded-xl p-3'
                onClick={() => loadSequence(bet.sequence.map((o) => o.id))}
              >
                <div className='flex items-start justify-between mb-2'>
                  <p className='text-white text-sm flex-1'>{bet.matchName}</p>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ml-2 ${
                      bet.status === 'live'
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}
                  >
                    {bet.status.toUpperCase()}
                  </span>
                </div>
                <div className='flex items-center justify-between'>
                  <p className='text-gray-400 text-xs'>
                    {bet.sequence.length} outcomes
                  </p>
                  <p className='text-cyan-400 text-xs'>
                    {new Date(bet.timestamp).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {activeBets.length > 2 && (
            <p className='text-cyan-400 text-xs mt-2 text-center'>
              +{activeBets.length - 2} more active
            </p>
          )}
        </div>
      )} */}

      {selectedOutcomes.length > 0 && (
        <div className='bg-gradient-to-br from-[#1a2f4d] to-[#0f1f3d] rounded-2xl p-4 mb-4 border border-cyan-500/30'>
          <div className='flex items-center justify-between mb-3'>
            <h3 className='text-white flex items-center gap-2'>
              <span>Your Timeline ({selectedOutcomes.length})</span>
            </h3>
            <p className='text-gray-400 text-xs'>Drag to reorder</p>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={selectedOutcomes.map((o) => o.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className='space-y-2 mb-4'>
                {selectedOutcomes.map((outcome, index) => (
                  <SortableOutcomeItem
                    key={outcome.id}
                    outcome={outcome}
                    index={index}
                    categoryIcons={categoryIcons}
                    onRemove={removeOutcome}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}

      {selectedOutcomes.length === 0 && (
        <div className='mb-4'>
          <div className='flex gap-2 mb-3'>
            <button
              onClick={() => setSuggestionTab('popular')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
                suggestionTab === 'popular'
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                  : 'bg-[#1a2f4d] text-gray-400 hover:text-white'
              }`}
            >
              <TrendingUp className='w-4 h-4' />
              <span className='text-sm'>Popular</span>
            </button>
            <button
              onClick={() => setSuggestionTab('friends')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
                suggestionTab === 'friends'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-[#1a2f4d] text-gray-400 hover:text-white'
              }`}
            >
              <Users className='w-4 h-4' />
              <span className='text-sm'>Friends</span>
            </button>
          </div>

          {suggestionTab === 'popular' && (
            <div className='space-y-2'>
              {POPULAR_SEQUENCES.map((seq, index) => {
                const choosenTeam =
                  Math.random() > 0.5 ? match.player1 : match.player2;

                return (
                  <button
                    key={index}
                    onClick={() => loadSequence(seq.outcomes)}
                    className='w-full bg-gradient-to-br from-[#1a2f4d] to-[#0f1f3d] border border-orange-500/30 rounded-xl p-3 text-left hover:border-orange-500/60 transition-all'
                  >
                    <div className='flex items-start justify-between mb-2'>
                      <div className='flex-1'>
                        <p className='text-white text-sm mb-1'>{seq.name}</p>
                        <p className='text-gray-400 text-xs'>
                          {seq.outcomes.length} outcomes
                        </p>
                      </div>
                      <div className='flex flex-col items-end gap-1'>
                        <div className='flex items-center gap-1'>
                          <span className='text-orange-400 text-xs'>
                            {(seq.bettors / 1000).toFixed(1)}K
                          </span>
                          <TrendingUp className='w-3 h-3 text-orange-400' />
                        </div>
                      </div>
                    </div>
                    <div className='flex items-center gap-1.5 flex-wrap'>
                      {seq.outcomes.slice(0, 3).map((outcomeId, idx) => {
                        const template = OUTCOME_TEMPLATES.find(
                          (t) => t.id === outcomeId
                        );

                        return template ? (
                          <span
                            key={idx}
                            className='text-xs bg-[#0f1f3d] rounded-md px-2 py-1 rounded text-gray-300'
                          >
                            <span className='mr-2'>{template.icon}</span>
                            {template.description.replace(
                              '{playerName}',
                              choosenTeam.split(' ')[0]
                            )}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {suggestionTab === 'friends' && (
            <div className='space-y-2'>
              {FRIEND_SEQUENCES.map((seq, index) => (
                <button
                  key={index}
                  onClick={() => loadSequence(seq.outcomes)}
                  className='w-full bg-gradient-to-br from-[#1a2f4d] to-[#0f1f3d] border border-purple-500/30 rounded-xl p-3 text-left hover:border-purple-500/60 transition-all'
                >
                  <div className='flex items-start justify-between mb-2'>
                    <div className='flex items-center gap-2 flex-1'>
                      <span className='text-2xl'>{seq.friendAvatar}</span>
                      <div>
                        <p className='text-white text-sm'>{seq.name}</p>
                        <p className='text-gray-400 text-xs'>
                          {seq.friendName}
                        </p>
                      </div>
                    </div>
                    <div className='flex flex-col items-end gap-1'>
                      {seq.status === 'live' ? (
                        <span className='flex items-center gap-1 text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full'>
                          <div className='w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse' />
                          LIVE
                        </span>
                      ) : seq.result === 'won' ? (
                        <span className='text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full'>
                          WON
                        </span>
                      ) : (
                        <span className='text-xs bg-gray-500/20 text-gray-400 px-2 py-0.5 rounded-full'>
                          LOST
                        </span>
                      )}
                      <span className='text-purple-400 text-xs'>
                        {seq.outcomes.length} picks
                      </span>
                    </div>
                  </div>
                  <div className='flex items-center gap-1.5 flex-wrap'>
                    {seq.outcomes.slice(0, 3).map((outcomeId, idx) => {
                      const template = OUTCOME_TEMPLATES.find(
                        (t) => t.id === outcomeId
                      );
                      return template ? (
                        <span
                          key={idx}
                          className='text-xs bg-[#0f1f3d] px-2 py-0.5 rounded text-gray-300'
                        >
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

      <div className='mb-4'>
        <div className='flex items-center gap-2 mb-2'>
          <MessageCircle className='w-4 h-4 text-cyan-400' />
          <h3 className='text-white'>Ask for outcomes</h3>
        </div>

        <form onSubmit={handleChatSearch} className='relative'>
          <input
            type='text'
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="e.g., 'Portugal scores, then corner, then yellow card'"
            className='w-full bg-[#1a2f4d] text-white placeholder-gray-500 rounded-xl px-4 py-3 pr-12 border border-cyan-500/30 focus:border-cyan-500/60 focus:outline-none'
          />
          <button
            type='submit'
            className='absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg transition-colors'
          >
            <Send className='w-4 h-4 text-white' />
          </button>
        </form>

        {showChatResults && searchResults.length > 0 && (
          <div className='mt-3 bg-[#0f1f3d] border border-cyan-500/30 rounded-xl p-3'>
            <div className='flex items-center justify-between mb-2'>
              <p className='text-cyan-400 text-sm'>
                Top matches for "{chatInput}"
              </p>
              <button
                onClick={() => setShowChatResults(false)}
                className='text-gray-400 hover:text-white text-xs'
              >
                Clear
              </button>
            </div>
            <div className='grid grid-cols-2 gap-2'>
              {searchResults.map((template) => {
                // For team outcomes, description is already processed
                // For player outcomes, show placeholder
                const processedDescription = template.allowPlayerSelection
                  ? template.description.replace('{playerName}', 'Player')
                  : template.description;

                return (
                  <button
                    key={template.id}
                    onClick={() => {
                      handleOutcomeClick(template);
                      setChatInput('');
                      setShowChatResults(false);
                    }}
                    className='bg-[#1a2f4d] hover:bg-[#243a5c] text-white p-3 rounded-xl text-sm text-left transition-all active:scale-95 border border-cyan-500/20'
                  >
                    <div className='flex items-start justify-between mb-2'>
                      <p className='flex-1 pr-2'>{processedDescription}</p>
                      <span className='text-lg'>{template.icon}</span>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-cyan-400 text-xs'>
                        {template.odds.toFixed(2)}x
                      </span>
                      {/* <span className='text-gray-500 text-xs'>
                        {template.timeLimit}s
                      </span> */}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {showChatResults && searchResults.length === 0 && (
          <div className='mt-3 bg-red-600/20 border border-red-500/30 rounded-xl p-3'>
            <p className='text-red-300 text-sm'>
              No matches found. Try different keywords like "goal", "corner",
              "yellow card", or team names.
            </p>
          </div>
        )}
      </div>

      <div className='flex-1 overflow-y-auto'>
        <h3 className='text-white mb-3 flex items-center gap-2'>
          <Plus className='w-4 h-4 text-cyan-400' />
          Add to Timeline
        </h3>

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
                  // For team outcomes, description is already processed
                  // For player outcomes, use placeholder
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
                      onClick={() => handleOutcomeClick(template)}
                      // disabled={isAlreadySelected}
                      className={`bg-[#1a2f4d] text-white p-3 rounded-xl text-sm text-left transition-all relative ${
                        isAlreadySelected
                          ? 'border-2 border-green-500/60'
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
                        {/* <span className='text-gray-500 text-xs'>
                          {template.timeLimit}s
                        </span> */}
                      </div>
                      {template.allowPlayerSelection && !isAlreadySelected && (
                        <p className='text-purple-400 text-xs mt-1'>
                          Choose player
                        </p>
                      )}
                      {isAlreadySelected && (
                        <p className='text-green-400 text-xs mt-1'>Selected</p>
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
      </div>

      {selectedOutcomes.length > 0 && (
        <div className='fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0a1628] via-[#0a1628] to-transparent max-w-md mx-auto'>
          <Button
            onClick={() => onComplete(selectedOutcomes)}
            disabled={selectedOutcomes.length < 3 || initialStake <= 0}
            className={`w-full py-6 rounded-2xl shadow-lg ${
              selectedOutcomes.length >= 3 && initialStake > 0
                ? 'bg-gradient-to-r from-cyan-400 to-green-400 hover:from-cyan-500 hover:to-green-500 text-[#0a1628] shadow-cyan-500/50'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            <div className='flex items-center justify-center gap-2'>
              <CheckCircle className='w-5 h-5' />
              <span>
                {selectedOutcomes.length < 3
                  ? `Add ${3 - selectedOutcomes.length} more outcome${
                      3 - selectedOutcomes.length !== 1 ? 's' : ''
                    }`
                  : initialStake <= 0
                  ? 'Set initial stake to continue'
                  : `Place Bet (€${potentialGains.toFixed(2)} max)`}
              </span>
            </div>
          </Button>
        </div>
      )}

      <div className='flex justify-center'>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className='bg-gray-700/30 hover:bg-gray-700/50 text-gray-400 px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2'
        >
          <ArrowLeft className='w-4 h-4 rotate-90' />
          <span>Scroll to top</span>
        </button>
      </div>

      {selectedOutcomes.length === 0 && (
        <div className='flex items-center justify-center gap-2 text-gray-400 text-sm py-6'>
          <AlertCircle className='w-4 h-4' />
          <span>Add at least 3 outcomes to continue</span>
        </div>
      )}

      {showPlayerSelector && pendingTemplate && (
        <PlayerSelector
          matchId={match.id}
          isOpen={showPlayerSelector}
          onClose={() => {
            setShowPlayerSelector(false);
            setPendingTemplate(null);
          }}
          onSelectPlayer={handlePlayerSelect}
          team1Name={match.player1}
          team2Name={match.player2}
          template={pendingTemplate}
          bothTeams={pendingTemplate.playerSelectionTeam === 'both'}
          teamFilter={
            pendingTemplate.playerSelectionTeam !== 'both'
              ? pendingTemplate.playerSelectionTeam
              : undefined
          }
        />
      )}
    </div>
  );
}
