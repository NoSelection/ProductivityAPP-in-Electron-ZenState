import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { GlassInput } from '../atoms/GlassInput';
import { GlassButton } from '../atoms/GlassButton';

interface Quest {
  id: string;
  text: string;
  completed: boolean;
}

export const QuestWidget = () => {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [newQuest, setNewQuest] = useState('');

  // Load from DB
  useEffect(() => {
    const load = async () => {
      const saved = await window.neuralDb.getQuests();
      setQuests(saved.map((q: any) => ({ ...q, completed: !!q.completed })));
    };
    load();
  }, []);

  // Save to DB
  useEffect(() => {
    window.neuralDb.saveQuests(quests);
  }, [quests]);

  const addQuest = () => {
    if (!newQuest.trim()) return;
    const quest: Quest = {
      id: Math.random().toString(36).substring(2, 11),
      text: newQuest,
      completed: false,
    };
    setQuests([quest, ...quests]);
    setNewQuest('');
  };

  const toggleQuest = (id: string) => {
    setQuests(quests.map(q => q.id === id ? { ...q, completed: !q.completed } : q));
  };

  const deleteQuest = (id: string) => {
    setQuests(quests.filter(q => q.id !== id));
  };

  const completedCount = quests.filter(q => q.completed).length;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-display text-[var(--text-main)]">Directives</h3>
          <p className="text-[10px] font-tech text-[var(--text-muted)] uppercase tracking-[0.2em]">
            Sync // Active
          </p>
        </div>
        <div className="text-right">
          <span className="text-sm font-display text-accent-highlight">{completedCount}</span>
          <span className="text-xs text-[var(--text-muted)] mx-1">/</span>
          <span className="text-xs text-[var(--text-muted)]">{quests.length}</span>
        </div>
      </div>

      <div className="flex gap-2 mb-6 max-w-2xl">
        <GlassInput
          placeholder="New Directive..."
          value={newQuest}
          onChange={(e) => setNewQuest(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addQuest()}
          className="py-2"
        />
        <GlassButton size="icon" variant="primary" onClick={addQuest} className="shrink-0 w-11 h-11 rounded-2xl">
          <Plus size={18} />
        </GlassButton>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-2">
        <AnimatePresence initial={false}>
          {quests.map((quest) => (
            <motion.div
              key={quest.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className={`
                group flex items-center gap-3 p-3 rounded-2xl border transition-all duration-300
                ${quest.completed ? 'bg-white/5 border-transparent opacity-40' : 'bg-glass-base border-border-subtle hover:border-border-highlight'}
              `}
            >
              <button
                onClick={() => toggleQuest(quest.id)}
                className={`shrink-0 transition-colors ${quest.completed ? 'text-accent-highlight' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
              >
                {quest.completed ? <CheckCircle2 size={16} /> : <Circle size={16} />}
              </button>
              
              <span className={`flex-1 text-sm font-light tracking-wide ${quest.completed ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-main)]'}`}>
                {quest.text}
              </span>

              <button
                onClick={() => deleteQuest(quest.id)}
                className="opacity-0 group-hover:opacity-100 p-1 text-[var(--text-muted)] hover:text-red-400 transition-all"
              >
                <Trash2 size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {quests.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center opacity-20 py-10">
            <div className="w-10 h-10 rounded-full border border-dashed border-[var(--text-main)] flex items-center justify-center mb-2">
              <Plus size={16} className="text-[var(--text-main)]" />
            </div>
            <span className="text-[10px] font-tech uppercase tracking-widest text-[var(--text-main)]">No Directives</span>
          </div>
        )}
      </div>
    </div>
  );
};
