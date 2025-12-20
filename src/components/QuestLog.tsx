import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, CheckCircle2, Circle, ListTodo, Target } from 'lucide-react'
import { useNeuralStorage } from '../hooks/useNeuralStorage'
import { cn } from '../lib/utils'

interface Quest {
    id: string
    text: string
    completed: boolean
}

export const QuestLog: React.FC = () => {
    const [quests, setQuests] = useNeuralStorage<Quest[]>('zen-quests', [])
    const [newQuest, setNewQuest] = useState('')
    const [isFocused, setIsFocused] = useState(false)

    const addQuest = () => {
        if (!newQuest.trim()) return
        const quest: Quest = {
            id: Math.random().toString(36).substr(2, 9),
            text: newQuest,
            completed: false
        }
        setQuests([...quests, quest])
        setNewQuest('')
    }

    const toggleQuest = (id: string) => {
        setQuests(quests.map(q => q.id === id ? { ...q, completed: !q.completed } : q))
    }

    const deleteQuest = (id: string) => {
        setQuests(quests.filter(q => q.id !== id))
    }

    const completedCount = quests.filter(q => q.completed).length

    return (
        <div className="QuestLog flex-1 flex flex-col relative min-h-0 group bg-[#0a0a0f]/80 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden">
            {/* Prismatic Border Highlight */}
            <div className="absolute inset-0 p-[1px] rounded-2xl pointer-events-none opacity-50">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--prismatic-3)]/20 via-transparent to-[var(--prismatic-2)]/20" />
            </div>

            {/* Header */}
            <div className="flex-none p-6 flex items-center justify-between border-b border-white/5 bg-black/40 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="relative w-10 h-10 flex items-center justify-center bg-[var(--prismatic-3)]/10 rounded-lg border border-[var(--prismatic-3)]/30">
                        <ListTodo className="w-5 h-5 text-[var(--prismatic-3)]" style={{ filter: 'drop-shadow(0 0 8px var(--prismatic-3))' }} />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-display text-sm font-bold tracking-[0.3em] text-[var(--prismatic-3)] uppercase glow-text">
                            Active Contracts
                        </span>
                        <span className="font-mono-tech text-[10px] text-white/30 uppercase tracking-widest">
                            {quests.length} Pending Bounties
                        </span>
                    </div>
                </div>

                {/* Add New Button (Floating) */}
                <div className={cn(
                    "relative transition-all duration-300 w-64",
                    isFocused && "shadow-[0_0_20px_rgba(var(--prismatic-3-rgb),0.1)]"
                )}>
                    <input
                        type="text"
                        placeholder="New Directive..."
                        className="w-full bg-black/60 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white outline-none focus:border-[var(--prismatic-3)]/50 transition-all font-mono-tech placeholder:text-white/20"
                        value={newQuest}
                        onChange={(e) => setNewQuest(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addQuest()}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                    />
                    <button
                        onClick={addQuest}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-white/20 hover:text-[var(--prismatic-3)] transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Quest List */}
            <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3 custom-scrollbar relative z-10">
                <AnimatePresence initial={false}>
                    {quests.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="h-full flex flex-col items-center justify-center gap-6 text-center opacity-50"
                        >
                            <div className="w-20 h-20 rounded-full border border-dashed border-white/10 flex items-center justify-center animate-spin-slow">
                                <Target className="w-8 h-8 text-white/10" />
                            </div>
                            <span className="font-mono-tech text-xs text-white/20 uppercase tracking-[0.2em]">
                                No Active Directives
                            </span>
                        </motion.div>
                    ) : (
                        quests.map((quest, index) => (
                            <motion.div
                                key={quest.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2, delay: index * 0.05 }}
                                className={cn(
                                    "group/item flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 relative overflow-hidden backdrop-blur-sm",
                                    quest.completed
                                        ? "bg-[rgba(var(--prismatic-3-rgb),0.02)] border-[rgba(var(--prismatic-3-rgb),0.1)] opacity-60"
                                        : "bg-white/5 border-white/5 hover:border-[var(--prismatic-3)]/30 hover:bg-white/[0.07] hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
                                )}
                            >
                                {/* Selection Indicator */}
                                <div className={cn(
                                    "absolute left-0 top-0 bottom-0 w-1 transition-all duration-300",
                                    quest.completed ? "bg-transparent" : "bg-[var(--prismatic-3)] group-hover/item:shadow-[0_0_10px_var(--prismatic-3)]"
                                )} />

                                <button
                                    onClick={() => toggleQuest(quest.id)}
                                    className={cn(
                                        "shrink-0 w-6 h-6 rounded border flex items-center justify-center transition-all duration-300 z-10",
                                        quest.completed
                                            ? "border-[var(--prismatic-3)] bg-[var(--prismatic-3)]/20 text-[var(--prismatic-3)]"
                                            : "border-white/20 text-transparent hover:border-[var(--prismatic-3)]"
                                    )}
                                >
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                </button>

                                <span className={cn(
                                    "flex-1 text-sm font-mono-tech tracking-wide transition-colors duration-300 z-10",
                                    quest.completed
                                        ? "text-white/30 line-through"
                                        : "text-white/90 group-hover/item:text-white"
                                )}>
                                    {quest.text}
                                </span>

                                <button
                                    onClick={() => deleteQuest(quest.id)}
                                    className="shrink-0 p-2 text-white/10 hover:text-red-400 hover:bg-red-400/10 rounded transition-all opacity-0 group-hover/item:opacity-100 z-10"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>

            {/* Completion Status Bar */}
            <div className="flex-none p-4 bg-black/40 border-t border-white/5 relative z-10">
                <div className="flex items-center justify-between text-[10px] font-mono-tech text-white/40 uppercase mb-2">
                    <span>Protocol Completion</span>
                    <span className="text-[var(--prismatic-3)]">{Math.round((completedCount / (quests.length || 1)) * 100)}%</span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-[var(--prismatic-3)] rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${(completedCount / (quests.length || 1)) * 100}%` }}
                        transition={{ duration: 0.5 }}
                        style={{ boxShadow: '0 0 10px var(--prismatic-3)' }}
                    />
                </div>
            </div>
        </div>
    )
}
