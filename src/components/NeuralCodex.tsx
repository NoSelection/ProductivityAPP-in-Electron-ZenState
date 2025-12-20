import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, Archive, Zap, Award, TrendingUp, Database, Activity, Cpu } from 'lucide-react'
import { useNeuralStorage } from '../hooks/useNeuralStorage'
import { cn } from '../lib/utils'
import { settingsService } from '../lib/settingsService'

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
    const [difficultyMultiplier, setDifficultyMultiplier] = useState(1.0)

    useEffect(() => {
        const loadSettings = async () => {
            const settings = await settingsService.getAll()
            if (settings.xp?.difficultyMultiplier) {
                setDifficultyMultiplier(settings.xp.difficultyMultiplier)
            }
        }
        loadSettings()
    }, [])

    const focusHours = (totalFocus / 3600).toFixed(1)
    const completedQuests = quests.filter(q => q.completed).length

    const getRank = (seconds: number) => {
        const hours = seconds / 3600
        const adjustedHours = hours / difficultyMultiplier
        if (adjustedHours < 1) return { name: 'Initiate', color: 'text-white/60' }
        if (adjustedHours < 5) return { name: 'Operator', color: 'text-neon-cyan' }
        if (adjustedHours < 20) return { name: 'Architect', color: 'text-neon-magenta' }
        return { name: 'Singularity', color: 'text-neon-lime' }
    }

    const rank = getRank(totalFocus)

    const stats = [
        { label: 'Focus Time', val: `${focusHours}h`, icon: Zap, color: 'neon-cyan', glow: '#00f0ff' },
        { label: 'Cycles', val: pomodoros.toString(), icon: Activity, color: 'neon-magenta', glow: '#ff00aa' },
        { label: 'Completed', val: completedQuests.toString(), icon: Archive, color: 'neon-lime', glow: '#39ff14' },
        { label: 'Rank', val: rank.name, icon: Award, color: 'neon-purple', glow: '#bf00ff' }
    ]

    return (
        <div className="NeuralCodex flex-1 flex flex-col gap-6 lg:gap-8 min-h-0">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 shrink-0">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="hyper-panel p-5 lg:p-6 flex items-center gap-4 group hover:shadow-lg transition-all duration-300"
                        style={{
                            '--hover-glow': stat.glow
                        } as React.CSSProperties}
                    >
                        <div
                            className={cn(
                                "p-3 rounded-xl border transition-all duration-300 group-hover:scale-110",
                                `text-${stat.color} bg-${stat.color}/10 border-${stat.color}/20`
                            )}
                            style={{ filter: `drop-shadow(0 0 8px ${stat.glow})` }}
                        >
                            <stat.icon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                            <p className="font-mono-tech text-[9px] text-white/30 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                            <p
                                className={cn("text-2xl lg:text-3xl font-display font-light tracking-tight", `text-${stat.color}`)}
                                style={{ textShadow: `0 0 20px ${stat.glow}40` }}
                            >
                                {stat.val}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="flex-1 min-h-[500px] lg:min-h-0 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 relative pb-16 lg:pb-0">
                {/* Left Panel - Analytics */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="hyper-panel p-6 lg:p-8 flex flex-col gap-6 overflow-hidden relative group"
                >
                    {/* Ambient Glow */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(0,240,255,0.05),transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                    {/* Header */}
                    <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="pulse-dot" />
                            <span className="font-display text-[11px] font-bold tracking-[0.3em] text-neon-cyan uppercase">
                                Analytics
                            </span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/30 border border-neon-cyan/10">
                            <TrendingUp className="w-3 h-3 text-neon-cyan/40" />
                            <span className="font-mono-tech text-[8px] text-neon-cyan/40 uppercase tracking-wider">Live</span>
                        </div>
                    </div>

                    {/* Chart Area */}
                    <div className="flex-1 flex flex-col gap-6 relative z-10">
                        <div className="flex-1 min-h-[120px] lg:min-h-[150px] flex items-end justify-between gap-2 px-2 pb-4 border-b border-white/5">
                            {[45, 70, 40, 90, 65, 80, 55].map((height, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: `${height}%`, opacity: 1 }}
                                    transition={{ delay: 0.6 + (i * 0.08), duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                    className="flex-1 rounded-t-md relative group/bar cursor-pointer"
                                    style={{
                                        background: `linear-gradient(180deg, rgba(0,240,255,0.6) 0%, rgba(191,0,255,0.3) 50%, rgba(255,0,170,0.1) 100%)`,
                                        boxShadow: '0 0 20px rgba(0,240,255,0.2)'
                                    }}
                                >
                                    {/* Hover tooltip */}
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-all duration-200 whitespace-nowrap">
                                        <div className="px-3 py-1.5 bg-black/90 rounded-lg border border-neon-cyan/20 font-mono-tech text-[9px] text-neon-cyan shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                                            {Math.floor(height * 0.8)}m
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-5 rounded-xl bg-black/30 border border-white/5 hover:border-neon-cyan/20 transition-all group/card">
                                <p className="font-mono-tech text-[8px] text-white/20 uppercase tracking-[0.2em] mb-2">Efficiency</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl lg:text-3xl font-display font-light text-white group-hover/card:text-neon-cyan transition-colors">94.2</span>
                                    <span className="font-mono-tech text-[10px] text-neon-cyan">%</span>
                                </div>
                            </div>
                            <div className="p-5 rounded-xl bg-black/30 border border-white/5 hover:border-neon-magenta/20 transition-all group/card">
                                <p className="font-mono-tech text-[8px] text-white/20 uppercase tracking-[0.2em] mb-2">Peak Flow</p>
                                <span className="text-2xl lg:text-3xl font-display font-light text-white group-hover/card:text-neon-magenta transition-colors">14:00</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Right Panel - Archive */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="hyper-panel p-6 lg:p-8 flex flex-col gap-6 overflow-hidden relative"
                >
                    {/* Ambient Glow */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(191,0,255,0.05),transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                    {/* Header */}
                    <div className="flex items-center gap-3 relative z-10">
                        <div className="w-2 h-2 rounded-full bg-neon-purple animate-pulse" style={{ boxShadow: '0 0 15px #bf00ff' }} />
                        <span className="font-display text-[11px] font-bold tracking-[0.3em] text-neon-purple uppercase">
                            Data Vault
                        </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col gap-6 min-h-0 overflow-y-auto pr-2 custom-scrollbar relative z-10">
                        {/* Completed Quests */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="font-mono-tech text-[9px] text-white/20 uppercase tracking-[0.3em]">Archived Objectives</span>
                                <span className="font-mono-tech text-[8px] text-neon-purple/40">{completedQuests} Total</span>
                            </div>

                            <div className="space-y-2">
                                {quests.filter(q => q.completed).length === 0 ? (
                                    <div className="p-6 rounded-xl border border-dashed border-white/5 bg-black/20 text-center">
                                        <Database className="w-6 h-6 text-white/10 mx-auto mb-2" />
                                        <span className="font-mono-tech text-[10px] text-white/10 uppercase tracking-[0.3em]">
                                            Archive Empty
                                        </span>
                                    </div>
                                ) : (
                                    quests.filter(q => q.completed).slice(0, 4).map((quest, i) => (
                                        <motion.div
                                            key={quest.id}
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.7 + (i * 0.1) }}
                                            className="p-4 rounded-lg border border-white/5 bg-black/20 hover:border-neon-purple/20 hover:bg-black/30 transition-all group/item"
                                        >
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-mono-tech text-[8px] text-neon-purple/40 uppercase tracking-wider">ID-{String(i + 1).padStart(3, '0')}</span>
                                                <div className="w-1 h-1 rounded-full bg-white/10" />
                                                <span className="font-mono-tech text-[8px] text-white/15">Archived</span>
                                            </div>
                                            <p className="text-sm text-white/50 group-hover/item:text-white/70 transition-colors truncate">{quest.text}</p>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Neural Log Preview */}
                        <div className="space-y-4">
                            <span className="font-mono-tech text-[9px] text-white/20 uppercase tracking-[0.3em]">Memory Fragment</span>
                            <div className="p-5 rounded-xl border border-white/5 bg-black/20 hover:border-neon-purple/10 transition-all relative overflow-hidden group/log">
                                <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/5 to-transparent opacity-0 group-hover/log:opacity-100 transition-opacity" />
                                <p className="font-mono-tech text-sm text-white/40 italic leading-relaxed relative z-10">
                                    {notes ? (notes.length > 150 ? `${notes.substring(0, 150)}...` : notes) : "> No data in memory buffer."}
                                </p>
                                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between relative z-10">
                                    <div className="flex items-center gap-2">
                                        <Cpu className="w-3 h-3 text-neon-purple/30" />
                                        <span className="font-mono-tech text-[8px] text-white/15 uppercase tracking-wider">Neural Cache</span>
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
