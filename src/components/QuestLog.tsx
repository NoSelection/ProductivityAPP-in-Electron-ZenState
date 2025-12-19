import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, CheckCircle2, Circle, Hash } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { cn } from '../lib/utils'

interface Quest {
    id: string
    text: string
    completed: boolean
}

export const QuestLog: React.FC = () => {
    const [quests, setQuests] = useLocalStorage<Quest[]>('zen-quests', [])
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
        <div className={cn(
            "cyber-glass h-full w-full flex flex-col p-8 group relative overflow-hidden transition-all duration-700 rounded-3xl row-span-2"
        )}>
            {/* Catch-light accent */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <div className="flex items-center justify-between mb-8">
                <h2 className="text-slate-500 text-[9px] font-bold tracking-[0.3em] uppercase opacity-70 font-mono-tech flex items-center gap-2">
                    <Hash className="w-3 h-3 text-secondary/40" />
                    Quest Log // {quests.length}
                </h2>
            </div>

            <div className="relative mb-8">
                <input
                    type="text"
                    placeholder="INITIATE NEW QUEST..."
                    className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-5 py-4 text-xs font-mono-tech text-slate-100 outline-none focus:border-secondary/40 focus:bg-white/[0.05] transition-all placeholder-white/10 tracking-widest"
                    value={newQuest}
                    onChange={(e) => setNewQuest(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addQuest()}
                />
                <button
                    onClick={addQuest}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-secondary transition-colors"
                >
                    <Plus className="w-5 h-5" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
                <AnimatePresence initial={false}>
                    {quests.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="h-full flex flex-col items-center justify-center opacity-10 font-mono-tech uppercase tracking-[0.3em] text-[10px]"
                        >
                            System // Empty
                        </motion.div>
                    ) : (
                        quests.map((quest) => (
                            <motion.div
                                key={quest.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="group/item flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all duration-300"
                            >
                                <div className="flex items-center gap-4">
                                    <button onClick={() => toggleQuest(quest.id)} className="text-secondary/30 hover:text-secondary transition-colors">
                                        {quest.completed ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                                    </button>
                                    <span className={cn(
                                        "text-sm font-light text-slate-300 transition-all duration-500",
                                        quest.completed && "line-through opacity-20 grayscale"
                                    )}>
                                        {quest.text}
                                    </span>
                                </div>
                                <button
                                    onClick={() => deleteQuest(quest.id)}
                                    className="opacity-0 group-hover/item:opacity-100 p-2 rounded-lg hover:bg-red-500/10 text-slate-700 hover:text-red-400/60 transition-all"
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
