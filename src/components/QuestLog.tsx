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
        <div className="QuestLog flex-1 hyper-panel flex flex-col relative overflow-hidden min-h-0 group">
            {/* Prismatic Border Highlight */}
            <div className="absolute inset-0 border border-white/5 group-hover:border-white/20 transition-colors pointer-events-none" />

            {/* Header */}
            <div className="flex-none p-5 pb-4 flex items-center justify-between border-b border-white/10 bg-black/20">
                <div className="flex items-center gap-3">
                    <div className="relative w-8 h-8 flex items-center justify-center bg-white/5 rounded-sm rotate-45 border border-white/10">
                        <ListTodo className="w-4 h-4 text-[var(--prismatic-3)] -rotate-45" style={{ filter: 'drop-shadow(0 0 8px var(--prismatic-3))' }} />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-display text-[10px] lg:text-xs font-bold tracking-[0.3em] text-[var(--prismatic-3)] uppercase">
                            BOUNTIES
                        </span>
                        <span className="font-mono-tech text-[8px] text-white/40 uppercase tracking-widest">
                            {quests.length} Active Protocols
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                    <Target className="w-3 h-3 text-[rgba(var(--prismatic-3-rgb),0.7)]" />
                    <span className="font-mono-tech text-[10px] text-white/60">
                        {completedCount}/{quests.length}
                    </span>
                </div>
            </div>

            {/* Input */}
            <div className="flex-none px-5 py-4">
                <div className={cn(
                    "relative transition-all duration-300",
                    isFocused && "shadow-[0_0_20px_rgba(var(--prismatic-3-rgb),0.1)]"
                )}>
                    <input
                        type="text"
                        placeholder="Acquire new bounty..."
                        className="w-full bg-[#0a0a0f] border border-white/10 rounded-sm px-4 py-3.5 text-sm text-white outline-none focus:border-[rgba(var(--prismatic-3-rgb),0.4)] transition-all font-mono-tech placeholder:text-white/20"
                        value={newQuest}
                        onChange={(e) => setNewQuest(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addQuest()}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                    />
                    <motion.button
                        onClick={addQuest}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-sm text-white/20 hover:text-[var(--prismatic-3)] hover:bg-[rgba(var(--prismatic-3-rgb),0.1)] transition-all"
                    >
                        <Plus className="w-5 h-5" />
                    </motion.button>
                </div>
            </div>

            {/* Quest List */}
            <div className="flex-1 min-h-0 overflow-y-auto px-5 pb-5 space-y-2 custom-scrollbar">
                <AnimatePresence initial={false}>
                    {quests.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="h-full flex flex-col items-center justify-center gap-4 text-center py-10"
                        >
                            <div className="w-16 h-16 rounded-full border border-dashed border-white/10 flex items-center justify-center animate-spin-slow">
                                <Target className="w-6 h-6 text-white/10" />
                            </div>
                            <span className="font-mono-tech text-[10px] text-white/20 uppercase tracking-[0.2em]">
                                Awaiting New Directives
                            </span>
                        </motion.div>
                    ) : (
                        quests.map((quest, index) => (
                            <motion.div
                                key={quest.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20, height: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                className={cn(
                                    "group/item flex items-center gap-3 p-4 border transition-all duration-300 relative overflow-hidden",
                                    quest.completed
                                        ? "bg-[rgba(var(--prismatic-3-rgb),0.05)] border-[rgba(var(--prismatic-3-rgb),0.2)]"
                                        : "bg-black/20 border-white/5 hover:border-white/20 hover:bg-white/5"
                                )}
                                style={{
                                    clipPath: 'polygon(10px 0, 100% 0, 100% 100%, 0 100%, 0 10px)' // Tab top-left
                                }}
                            >
                                <motion.button
                                    onClick={() => toggleQuest(quest.id)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className={cn(
                                        "shrink-0 transition-all duration-300 rotate-45 border p-0.5",
                                        quest.completed
                                            ? "border-[var(--prismatic-3)] bg-[var(--prismatic-3)] text-black"
                                            : "border-white/30 text-transparent hover:border-[var(--prismatic-3)]"
                                    )}
                                >
                                    <div className="-rotate-45">
                                        <CheckCircle2 className="w-3 h-3" />
                                    </div>
                                </motion.button>

                                <span className={cn(
                                    "flex-1 text-sm select-text transition-all duration-300 font-mono-tech tracking-wide",
                                    quest.completed
                                        ? "text-[rgba(var(--prismatic-3-rgb),0.6)] line-through"
                                        : "text-white/80"
                                )}>
                                    {quest.text}
                                </span>

                                <motion.button
                                    onClick={() => deleteQuest(quest.id)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="shrink-0 p-1.5 text-white/10 hover:text-red-500 hover:bg-red-500/10 transition-all opacity-0 group-hover/item:opacity-100"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </motion.button>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>

            {/* Progress Bar (Gold) */}
            {quests.length > 0 && (
                <div className="flex-none px-0">
                    <div className="h-0.5 w-full bg-white/5 relative overflow-hidden">
                        <motion.div
                            className="absolute top-0 left-0 h-full bg-[var(--prismatic-3)]"
                            initial={{ width: 0 }}
                            animate={{ width: `${(completedCount / quests.length) * 100}%` }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            style={{
                                boxShadow: '0 0 10px var(--prismatic-3)'
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}
