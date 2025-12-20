import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, CheckCircle2, Circle, Activity } from 'lucide-react'
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

    return (
        <div className="QuestLog flex-1 glass-pane flex flex-col relative overflow-hidden min-h-0">
            {/* Header */}
            <div className="flex-none p-5 pb-3 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent-secondary/10 text-accent-secondary border border-accent-secondary/20">
                    <Activity className="w-3.5 h-3.5" />
                </div>
                <h2 className="text-[10px] font-bold tracking-widest text-white/40 uppercase">Tasks</h2>
            </div>

            {/* Input */}
            <div className="flex-none px-5 pb-4">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Add task..."
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-accent-secondary/40 transition-all placeholder:text-white/20"
                        value={newQuest}
                        onChange={(e) => setNewQuest(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addQuest()}
                    />
                    <button
                        onClick={addQuest}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-accent-secondary transition-all"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="flex-1 min-h-0 overflow-y-auto px-5 pb-5 space-y-2 custom-scrollbar">
                <AnimatePresence initial={false}>
                    {quests.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-white/10">
                            <span className="text-xs">No tasks yet</span>
                        </div>
                    ) : (
                        quests.map((quest) => (
                            <motion.div
                                key={quest.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="group/item flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.05] hover:border-white/10 hover:bg-white/[0.04] transition-all"
                            >
                                <button
                                    onClick={() => toggleQuest(quest.id)}
                                    className={cn(
                                        "shrink-0 transition-colors",
                                        quest.completed ? "text-accent-secondary" : "text-white/20 hover:text-white/40"
                                    )}
                                >
                                    {quest.completed ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                                </button>
                                <span className={cn(
                                    "flex-1 text-sm text-white/70 truncate select-text",
                                    quest.completed && "text-white/20 line-through"
                                )}>
                                    {quest.text}
                                </span>
                                <button
                                    onClick={() => deleteQuest(quest.id)}
                                    className="shrink-0 text-white/10 hover:text-red-400 transition-colors opacity-0 group-hover/item:opacity-100"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
