import React from 'react'
import { motion } from 'framer-motion'
import { BarChart3, Archive, Zap, Award } from 'lucide-react'
import { useNeuralStorage } from '../hooks/useNeuralStorage'
import { cn } from '../lib/utils'

interface Quest {
    id: string
    text: string
    completed: boolean
}

export const NeuralCodex: React.FC = () => {
    const [totalFocus] = useNeuralStorage('zen-focus-total', 0)
    const [pomodoros] = useNeuralStorage('zen-pomodoros', 0)
    const [quests] = useNeuralStorage<Quest[]>('zen-quests', [])
    const [notes] = useNeuralStorage('zen-brain-dump', '')

    const focusHours = (totalFocus / 3600).toFixed(1)
    const completedQuests = quests.filter(q => q.completed).length

    // Dynamic Ranking Logic
    const getRank = (seconds: number) => {
        const hours = seconds / 3600
        if (hours < 1) return 'Novice'
        if (hours < 5) return 'Specialist'
        if (hours < 20) return 'Architect'
        return 'Singularity'
    }

    const rank = getRank(totalFocus)

    return (
        <div className="col-span-1 lg:col-span-3 h-full flex flex-col gap-6">
            {/* Top Stat Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 shrink-0">
                {[
                    { label: 'Total Focus', val: `${focusHours}h`, icon: Zap, color: 'text-accent-base' },
                    { label: 'Pomodoros', val: pomodoros.toString(), icon: BarChart3, color: 'text-accent-secondary' },
                    { label: 'Quests Done', val: completedQuests.toString(), icon: Archive, color: 'text-blue-400' },
                    { label: 'Neural Rank', val: rank, icon: Award, color: 'text-purple-400' }
                ].map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-pane p-6 flex items-center gap-4"
                    >
                        <div className={cn("p-3 rounded-2xl bg-white/5 border border-white/10", stat.color)}>
                            <stat.icon className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">{stat.label}</p>
                            <p className="text-xl font-light text-white">{stat.val}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Main Content Area - Split */}
            <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
                {/* Left Side - Insights Chart Placeholder */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-pane p-8 flex flex-col gap-6 overflow-hidden"
                >
                    <div className="flex items-center justify-between">
                        <h2 className="text-[11px] font-black tracking-[0.4em] text-white/50 uppercase font-mono-tech">
                            SIG // INSIGHTS
                        </h2>
                    </div>
                    <div className="flex-1 border border-white/5 rounded-3xl bg-black/20 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
                        <p className="text-white/20 font-mono-tech text-[10px] uppercase tracking-widest">Neural Syncing...</p>
                    </div>
                </motion.div>

                {/* Right Side - History / Records */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-pane p-8 flex flex-col gap-6 overflow-hidden"
                >
                    <div className="flex items-center justify-between">
                        <h2 className="text-[11px] font-black tracking-[0.4em] text-white/50 uppercase font-mono-tech">
                            THE // VAULT
                        </h2>
                    </div>
                    <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
                        {quests.filter(q => q.completed).length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-white/10 font-mono-tech uppercase tracking-[0.4em] text-[10px]">
                                Vault // Empty
                            </div>
                        ) : (
                            quests.filter(q => q.completed).map((quest, i) => (
                                <div key={quest.id} className="flex-none p-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group cursor-pointer">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-[9px] font-black text-accent-base/60 uppercase tracking-widest">Protocol {i + 1}</span>
                                        <span className="text-[9px] text-white/20">2025.12.20</span>
                                    </div>
                                    <p className="text-sm text-white/70 font-light group-hover:text-white transition-colors">{quest.text}</p>
                                </div>
                            ))
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
