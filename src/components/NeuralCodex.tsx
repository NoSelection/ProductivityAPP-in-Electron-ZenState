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

    const getRank = (seconds: number) => {
        const hours = seconds / 3600
        if (hours < 1) return 'Novice'
        if (hours < 5) return 'Specialist'
        if (hours < 20) return 'Architect'
        return 'Singularity'
    }

    const rank = getRank(totalFocus)

    return (
        <div className="NeuralCodex flex-1 flex flex-col gap-8 min-h-0">
            {/* Top Stat Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 shrink-0">
                {[
                    { label: 'Total Focus', val: `${focusHours}h`, icon: Zap, color: 'text-accent-base' },
                    { label: 'Pomodoros', val: pomodoros.toString(), icon: BarChart3, color: 'text-accent-secondary' },
                    { label: 'Quests Done', val: completedQuests.toString(), icon: Archive, color: 'text-emerald-400' },
                    { label: 'Neural Rank', val: rank, icon: Award, color: 'text-purple-400' }
                ].map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1, duration: 0.8 }}
                        className="glass-pane p-6 flex items-center gap-5 group hover:border-white/20"
                    >
                        <div className={cn("p-3 rounded-2xl bg-white/[0.03] border border-white/10 group-hover:scale-110 transition-transform duration-500", stat.color)}>
                            <stat.icon className="w-5 h-5 shadow-sm" />
                        </div>
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 mb-0.5">{stat.label}</p>
                            <p className="text-2xl font-light text-white tracking-tight">{stat.val}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Main Content Area - Split */}
            <div className="flex-1 min-h-[600px] lg:min-h-0 grid grid-cols-1 lg:grid-cols-2 gap-8 relative pb-12 lg:pb-0">
                {/* Left Side - Insights Chart */}
                <motion.div
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass-pane p-10 flex flex-col gap-8 overflow-hidden relative group"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-accent-base/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-2 h-2 rounded-full bg-accent-base animate-pulse shadow-[0_0_15px_rgba(var(--accent-base-rgb),0.4)]" />
                            <h2 className="text-[11px] font-black tracking-[0.5em] text-white/50 uppercase font-mono-tech">
                                SIG // INSIGHTS
                            </h2>
                        </div>
                        <span className="text-[8px] font-mono-tech text-accent-base/40 uppercase tracking-widest border border-accent-base/10 px-2 py-1 rounded">Live Analysis Active</span>
                    </div>

                    <div className="flex-1 flex flex-col gap-8 relative z-10">
                        <div className="flex-1 min-h-[150px] flex items-end justify-between gap-2 px-2 pb-4 border-b border-white/5">
                            {[45, 70, 40, 90, 65, 80, 55].map((height, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: `${height}%`, opacity: 1 }}
                                    transition={{ delay: 0.8 + (i * 0.1), duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                                    className="flex-1 bg-gradient-to-t from-accent-base/10 via-accent-base/30 to-accent-base/50 rounded-t-lg relative group/bar hover:to-accent-base/80"
                                >
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-all duration-300 whitespace-nowrap text-[9px] font-mono-tech text-accent-base bg-black/80 px-2 py-1 rounded border border-white/10 translate-y-2 group-hover:translate-y-0">
                                        {Math.floor(height * 0.8)}m
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="p-6 rounded-3xl bg-white/[0.01] border border-white/5 hover:bg-white/[0.03] transition-all">
                                <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-2">Efficiency Rating</p>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-3xl font-light text-white">94.2</p>
                                    <span className="text-[10px] text-accent-base font-black">%</span>
                                </div>
                            </div>
                            <div className="p-6 rounded-3xl bg-white/[0.01] border border-white/5 hover:bg-white/[0.03] transition-all">
                                <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-2">Peak Neural Flow</p>
                                <p className="text-3xl font-light text-white tracking-tight">14:00</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Right Side - The Vault */}
                <motion.div
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="glass-pane p-10 flex flex-col gap-10 overflow-hidden relative"
                >
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse-slow shadow-[0_0_15px_rgba(168,85,247,0.4)]" />
                        <h2 className="text-[11px] font-black tracking-[0.5em] text-white/50 uppercase font-mono-tech">
                            THE // VAULT
                        </h2>
                    </div>

                    <div className="flex-1 flex flex-col gap-10 min-h-0 overflow-y-auto pr-4 custom-scrollbar relative z-10">
                        {/* Completed Quests section */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">Quests // Transcended</h3>
                                <span className="text-[8px] font-mono-tech text-white/10 uppercase tracking-widest">{completedQuests} Total</span>
                            </div>

                            <div className="space-y-3">
                                {quests.filter(q => q.completed).length === 0 ? (
                                    <div className="p-8 rounded-3xl border border-dashed border-white/5 bg-white/[0.01] text-[10px] text-white/10 uppercase tracking-[0.5em] font-mono-tech text-center">
                                        Data Grid Empty
                                    </div>
                                ) : (
                                    quests.filter(q => q.completed).slice(0, 5).map((quest, i) => (
                                        <div key={quest.id} className="p-5 rounded-2xl border border-white/[0.03] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 transition-all group flex items-center justify-between">
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <span className="text-[8px] font-black text-accent-base/50 uppercase tracking-widest">Archive ID-0{i + 1}</span>
                                                    <span className="w-1 h-1 rounded-full bg-white/10" />
                                                    <span className="text-[8px] text-white/20">2025.12.20</span>
                                                </div>
                                                <p className="text-sm text-white/60 font-light group-hover:text-white transition-colors truncate">{quest.text}</p>
                                            </div>
                                            <Archive className="w-4 h-4 text-white/5 opacity-0 group-hover:opacity-20 transition-opacity ml-4" />
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Neural Logs section */}
                        <div className="space-y-6">
                            <h3 className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">Neural // Logs</h3>
                            <div className="p-8 rounded-[2rem] border border-white/[0.05] bg-white/[0.01] relative overflow-hidden group hover:bg-white/[0.02] transition-all">
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                                <div className="relative z-10">
                                    <p className="text-sm text-white/40 font-light italic leading-relaxed">
                                        {notes ? (notes.length > 250 ? `${notes.substring(0, 250)}...` : notes) : "> NO NEURAL LOGS DETECTED IN LOCAL CLUSTER."}
                                    </p>
                                    <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500/40" />
                                            <span className="text-[8px] text-white/20 font-mono-tech uppercase tracking-widest">Last Sync: 02:25</span>
                                        </div>
                                        <button className="text-[9px] font-black text-purple-400 hover:text-purple-300 transition-colors uppercase tracking-[0.3em] font-mono-tech hover:underline">Full Archive Access</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
