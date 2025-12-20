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
        <div className="QuestLog flex-1 hyper-panel flex flex-col relative overflow-hidden min-h-0">
            {/* Header */}
            <div className="flex-none p-5 pb-4 flex items-center justify-between border-b border-neon-lime/10">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <ListTodo className="w-5 h-5 text-neon-lime" style={{ filter: 'drop-shadow(0 0 8px #39ff14)' }} />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-display text-[10px] lg:text-xs font-bold tracking-[0.3em] text-neon-lime uppercase">
                            QUEST LOG
                        </span>
                        <span className="font-mono-tech text-[8px] text-white/20 uppercase tracking-widest">
                            Active Objectives
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/30 border border-neon-lime/10">
                    <Target className="w-3 h-3 text-neon-lime/50" />
                    <span className="font-mono-tech text-[10px] text-neon-lime/60">
                        {completedCount}/{quests.length}
                    </span>
                </div>
            </div>

            {/* Input */}
            <div className="flex-none px-5 py-4">
                <div className={cn(
                    "relative rounded-lg transition-all duration-300",
                    isFocused && "shadow-[0_0_20px_rgba(57,255,20,0.15)]"
                )}>
                    <input
                        type="text"
                        placeholder="Add new objective..."
                        className="w-full bg-black/40 border border-neon-lime/10 rounded-lg px-4 py-3.5 text-sm text-white outline-none focus:border-neon-lime/40 transition-all font-mono-tech placeholder:text-white/15"
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
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-white/20 hover:text-neon-lime hover:bg-neon-lime/10 transition-all"
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
                            className="h-full flex flex-col items-center justify-center gap-3 text-center py-10"
                        >
                            <div className="w-12 h-12 rounded-full border border-dashed border-neon-lime/10 flex items-center justify-center">
                                <Target className="w-5 h-5 text-neon-lime/20" />
                            </div>
                            <span className="font-mono-tech text-[10px] text-white/15 uppercase tracking-widest">
                                No Active Objectives
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
                                    "group/item flex items-center gap-3 p-4 rounded-lg border transition-all duration-300",
                                    quest.completed
                                        ? "bg-neon-lime/5 border-neon-lime/10"
                                        : "bg-black/20 border-white/5 hover:border-neon-lime/20 hover:bg-black/40"
                                )}
                            >
                                <motion.button
                                    onClick={() => toggleQuest(quest.id)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className={cn(
                                        "shrink-0 transition-all duration-300",
                                        quest.completed
                                            ? "text-neon-lime"
                                            : "text-white/20 hover:text-neon-lime/60"
                                    )}
                                    style={quest.completed ? { filter: 'drop-shadow(0 0 6px #39ff14)' } : {}}
                                >
                                    {quest.completed ? (
                                        <CheckCircle2 className="w-5 h-5" />
                                    ) : (
                                        <Circle className="w-5 h-5" />
                                    )}
                                </motion.button>

                                <span className={cn(
                                    "flex-1 text-sm select-text transition-all duration-300",
                                    quest.completed
                                        ? "text-neon-lime/40 line-through"
                                        : "text-white/70"
                                )}>
                                    {quest.text}
                                </span>

                                <motion.button
                                    onClick={() => deleteQuest(quest.id)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="shrink-0 p-1.5 rounded text-white/10 hover:text-neon-magenta hover:bg-neon-magenta/10 transition-all opacity-0 group-hover/item:opacity-100"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </motion.button>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>

            {/* Progress Bar */}
            {quests.length > 0 && (
                <div className="flex-none px-5 pb-4">
                    <div className="hyper-progress">
                        <motion.div
                            className="hyper-progress-bar"
                            initial={{ width: 0 }}
                            animate={{ width: `${(completedCount / quests.length) * 100}%` }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            style={{
                                background: 'linear-gradient(90deg, #39ff14, #00f0ff)',
                                boxShadow: '0 0 10px #39ff14, 0 0 20px #39ff14'
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}
