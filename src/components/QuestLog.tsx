import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, CheckCircle2, Circle } from 'lucide-react'
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
        <div className="flex-1 flex flex-col relative min-h-0 bg-transparent overflow-hidden">

            {/* Minimal Header */}
            <div className="flex-none p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <span className="text-display text-2xl font-light text-white/90">
                        Directives
                    </span>
                    <span className="text-tech text-[10px] text-white/40 uppercase tracking-widest">
                        {completedCount} / {quests.length}
                    </span>
                </div>

                {/* Input Field */}
                <div className={cn(
                    "relative transition-all duration-300 rounded-lg overflow-hidden border",
                    isFocused ? "border-white/20 bg-white/5" : "border-white/5 bg-white/[0.02]"
                )}>
                    <input
                        type="text"
                        placeholder="Add new objective..."
                        className="w-full bg-transparent px-4 py-3 text-sm font-light text-white outline-none placeholder:text-white/20 font-sans tracking-wide"
                        value={newQuest}
                        onChange={(e) => setNewQuest(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addQuest()}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                    />
                    <button
                        onClick={addQuest}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Quest List */}
            <div className="flex-1 min-h-0 overflow-y-auto px-6 pb-6 space-y-2 custom-scrollbar">
                <AnimatePresence initial={false}>
                    {quests.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="h-32 flex items-center justify-center"
                        >
                            <span className="text-tech text-[10px] text-white/20 uppercase tracking-[0.2em] italic">
                                No active objectives
                            </span>
                        </motion.div>
                    ) : (
                        quests.map((quest, index) => (
                            <motion.div
                                key={quest.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2, delay: index * 0.05 }}
                                className={cn(
                                    "group flex items-center gap-3 p-3 rounded-lg border transition-all duration-300",
                                    quest.completed
                                        ? "bg-transparent border-transparent opacity-50"
                                        : "bg-white/[0.02] border-white/5 hover:bg-white/5 hover:border-white/10"
                                )}
                            >
                                <button
                                    onClick={() => toggleQuest(quest.id)}
                                    className={cn(
                                        "shrink-0 w-5 h-5 flex items-center justify-center transition-colors",
                                        quest.completed ? "text-white/40" : "text-white/20 hover:text-white"
                                    )}
                                >
                                    {quest.completed ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                                </button>

                                <span className={cn(
                                    "flex-1 text-sm font-light tracking-wide transition-all",
                                    quest.completed ? "text-white/30 line-through decoration-white/10" : "text-white/80"
                                )}>
                                    {quest.text}
                                </span>

                                <button
                                    onClick={() => deleteQuest(quest.id)}
                                    className="shrink-0 p-2 text-white/10 hover:text-white/60 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
