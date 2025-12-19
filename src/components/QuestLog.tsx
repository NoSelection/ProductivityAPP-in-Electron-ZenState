import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, CheckCircle2, Circle, List } from 'lucide-react'
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
            "glass-pane h-full w-full flex flex-col lg:row-span-2 relative overflow-hidden min-h-[60vh] lg:min-h-0"
        )}>
            {/* Header Area */}
            <div className="flex-none p-[3vh] pb-[1vh] flex items-center gap-3">
                <List className="w-3.5 h-3.5 text-accent-secondary/60" />
                <h2 className="text-white/40 text-[9px] font-black tracking-[0.5em] uppercase font-mono-tech">
                    ARCHIVE // QUESTS
                </h2>
            </div>

            {/* Input Area */}
            <div className="flex-none px-[3vh] py-[1vh] relative mb-[1vh]">
                <input
                    type="text"
                    placeholder="INITIATE..."
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-[1.5vh] text-[1.5vh] font-mono-tech text-white outline-none focus:border-accent-secondary/40 focus:bg-white/[0.05] transition-all placeholder-white/20 tracking-wider"
                    value={newQuest}
                    onChange={(e) => setNewQuest(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addQuest()}
                />
                <button
                    onClick={addQuest}
                    className="absolute right-[4vh] top-1/2 -translate-y-1/2 text-white/40 hover:text-accent-secondary transition-all"
                >
                    <Plus className="w-[2.5vh] h-[2.5vh] p-0.5 hover:scale-110" />
                </button>
            </div>

            {/* Scrollable List - flex-1 min-h-0 is KEY for squishing */}
            <div className="flex-1 min-h-0 overflow-y-auto px-[3vh] pb-[2vh] space-y-[1vh] scrollbar-none">
                <AnimatePresence initial={false}>
                    {quests.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="h-full flex flex-col items-center justify-center text-white/10 font-mono-tech uppercase tracking-[0.4em] text-[1.2vh]"
                        >
                            Log // Empty
                        </motion.div>
                    ) : (
                        quests.map((quest) => (
                            <motion.div
                                key={quest.id}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                className="group/item flex items-center justify-between p-[1.5vh] rounded-xl bg-white/[0.01] border border-white/5 hover:border-white/10 hover:bg-white/[0.03] transition-all duration-300 min-h-[5vh]"
                            >
                                <div className="flex items-center gap-[1.5vh] min-w-0 flex-1">
                                    <button onClick={() => toggleQuest(quest.id)} className="text-accent-secondary/60 hover:text-accent-secondary transition-colors shrink-0">
                                        {quest.completed ? <CheckCircle2 className="w-[2vh] h-[2vh]" /> : <Circle className="w-[2vh] h-[2vh]" />}
                                    </button>
                                    <span className={cn(
                                        "text-[1.8vh] font-light text-white/80 transition-all duration-500 truncate leading-none pt-0.5",
                                        quest.completed && "opacity-30 line-through blur-[0.5px]"
                                    )}>
                                        {quest.text}
                                    </span>
                                </div>
                                <button
                                    onClick={() => deleteQuest(quest.id)}
                                    className="text-white/20 hover:text-red-400/80 transition-colors shrink-0 opacity-0 group-hover/item:opacity-100"
                                >
                                    <Trash2 className="w-[2vh] h-[2vh]" />
                                </button>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
