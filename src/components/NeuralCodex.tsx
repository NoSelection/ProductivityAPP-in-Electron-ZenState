import React, { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Archive, Zap, Award, TrendingUp, Database, Activity, Search, Plus, FileText, Trash2 } from 'lucide-react'
import { useNeuralStorage } from '../hooks/useNeuralStorage'
import { cn } from '../lib/utils'
import { settingsService } from '../lib/settingsService'

// --- Interfaces ---

interface CodexNote {
    id: string
    title: string
    content: string
    tags: string[]
    createdAt: number
    updatedAt: number
}

interface Quest {
    id: string
    text: string
    completed: boolean
}

export const NeuralCodex: React.FC = () => {
    // --- Global State ---
    const [totalFocus] = useNeuralStorage('zen-focus-total', 0)
    const [pomodoros] = useNeuralStorage('zen-pomodoros', 0)
    const [quests] = useNeuralStorage<Quest[]>('zen-quests', [])
    const [brainDump] = useNeuralStorage('zen-brain-dump', '') // Legacy "Memory Fragment"
    const [difficultyMultiplier, setDifficultyMultiplier] = useState(1.0)

    // --- Codex State ---
    const [codexNotes, setCodexNotes] = useState<CodexNote[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [activeNoteId, setActiveNoteId] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // --- Stats Logic ---
    useEffect(() => {
        const loadSettings = async () => {
            const settings = await settingsService.getAll()
            if (settings.xp?.difficultyMultiplier) {
                setDifficultyMultiplier(settings.xp.difficultyMultiplier)
            }
        }
        loadSettings()
        loadCodexNotes()
    }, [])

    const loadCodexNotes = async () => {
        setIsLoading(true)
        try {
            const rawNotes = await window.neuralDb.getCodexNotes()
            const parsedNotes: CodexNote[] = rawNotes.map((n: any) => ({
                ...n,
                tags: n.tags ? JSON.parse(n.tags) : []
            }))
            setCodexNotes(parsedNotes)
        } catch (error) {
            console.error("Failed to load Codex notes:", error)
        } finally {
            setIsLoading(false)
        }
    }

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
        { label: 'Focus Time', val: `${focusHours}h`, icon: Zap, color: 'neon-cyan', glow: 'var(--neon-cyan)' },
        { label: 'Cycles', val: pomodoros.toString(), icon: Activity, color: 'neon-magenta', glow: 'var(--neon-magenta)' },
        { label: 'Completed', val: completedQuests.toString(), icon: Archive, color: 'neon-lime', glow: 'var(--neon-lime)' },
        { label: 'Rank', val: rank.name, icon: Award, color: 'neon-purple', glow: 'var(--neon-purple)' }
    ]

    // --- Actions ---

    const handleCreateNote = async () => {
        const newNote: CodexNote = {
            id: crypto.randomUUID(),
            title: 'New Entry',
            content: '',
            tags: [],
            createdAt: Date.now(),
            updatedAt: Date.now()
        }
        await window.neuralDb.saveCodexNote(newNote)
        setCodexNotes([newNote, ...codexNotes])
        setActiveNoteId(newNote.id)
    }

    const handleDeleteNote = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation()
        if (confirm('Delete this memory fragment?')) {
            await window.neuralDb.deleteCodexNote(id)
            setCodexNotes(codexNotes.filter(n => n.id !== id))
            if (activeNoteId === id) setActiveNoteId(null)
        }
    }

    // Filter Logic
    const filteredNotes = useMemo(() => {
        if (!searchQuery) return codexNotes
        const lowerQ = searchQuery.toLowerCase()
        return codexNotes.filter(n =>
            n.title.toLowerCase().includes(lowerQ) ||
            n.content.toLowerCase().includes(lowerQ)
        )
    }, [codexNotes, searchQuery])

    const activeNote = useMemo(() =>
        codexNotes.find(n => n.id === activeNoteId),
        [codexNotes, activeNoteId])


    return (
        <div className="NeuralCodex flex-1 flex gap-6 lg:gap-8 min-h-0 h-full">

            {/* --- SIDEBAR --- */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="w-80 shrink-0 flex flex-col gap-4"
            >
                {/* Search & Actions */}
                <div className="flex gap-2">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-neon-cyan transition-colors" />
                        <input
                            type="text"
                            placeholder="SEARCH CODEX..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-lg text-sm font-mono-tech text-neon-cyan placeholder:text-white/20 focus:border-neon-cyan/50 focus:bg-black/60 transition-all outline-none"
                        />
                    </div>
                    <button
                        onClick={handleCreateNote}
                        aria-label="Create Note"
                        className="p-2.5 rounded-lg bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan/20 hover:border-neon-cyan/50 transition-all group"
                    >
                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                    </button>
                </div>

                {/* Notes List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-2">
                    {isLoading ? (
                        <div className="flex justify-center p-8">
                            <div className="pulse-dot animate-ping" />
                        </div>
                    ) : filteredNotes.map((note) => (
                        <motion.div
                            key={note.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            onClick={() => setActiveNoteId(note.id)}
                            className={cn(
                                "group p-3 rounded-lg border cursor-pointer transition-all duration-300 relative overflow-hidden",
                                activeNoteId === note.id
                                    ? "bg-neon-cyan/5 border-neon-cyan/30 shadow-[inset_0_0_20px_rgba(var(--accent-base-rgb),0.05)]"
                                    : "bg-black/20 border-white/5 hover:border-white/10 hover:bg-black/30"
                            )}
                        >
                            {/* Accent Bar */}
                            {activeNoteId === note.id && (
                                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-neon-cyan shadow-[0_0_10px_var(--neon-cyan)]" />
                            )}

                            <div className="flex justify-between items-start mb-1">
                                <h3 className={cn(
                                    "font-display text-sm font-medium truncate pr-4",
                                    activeNoteId === note.id ? "text-neon-cyan" : "text-white/70 group-hover:text-white"
                                )}>
                                    {note.title || 'Untitled'}
                                </h3>

                                <button
                                    onClick={(e) => handleDeleteNote(e, note.id)}
                                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-neon-magenta transition-all"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            <p className="font-mono-tech text-[10px] text-white/30 truncate">
                                {new Date(note.updatedAt).toLocaleDateString()}
                            </p>
                        </motion.div>
                    ))}

                    {!isLoading && filteredNotes.length === 0 && (
                        <div className="text-center py-8 opacity-30">
                            <Database className="w-8 h-8 mx-auto mb-2" />
                            <p className="font-mono-tech text-[10px] uppercase tracking-widest">No Data Found</p>
                        </div>
                    )}
                </div>
            </motion.div>


            {/* --- MAIN AREA --- */}
            <div className="flex-1 min-w-0 h-full flex flex-col relative overflow-hidden">
                <AnimatePresence mode="wait">
                    {activeNoteId && activeNote ? (
                        /* EDIT MODE (Placeholder for Phase 2) */
                        <motion.div
                            key="editor"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.3 }}
                            className="hyper-panel flex-1 flex flex-col p-8 overflow-hidden relative"
                        >
                            {/* Editor UI Placeholder */}
                            <div className="flex flex-col h-full items-center justify-center text-center opacity-50 space-y-4">
                                <FileText className="w-16 h-16 text-neon-cyan/20 animate-pulse" />
                                <div>
                                    <h2 className="font-display text-2xl text-neon-cyan tracking-widest">NEURAL EDITOR</h2>
                                    <p className="font-mono-tech text-sm text-white/30 mt-2">Initialize Phase 2 to unlock writing module.</p>
                                    <div className="mt-8 p-4 rounded bg-black/40 border border-white/5 font-mono-tech text-xs text-left">
                                        <p className="text-neon-magenta mb-2">// DEBUG_DATA</p>
                                        <p>ID: {activeNote.id}</p>
                                        <p>TITLE: {activeNote.title}</p>
                                        <p>UPDATED: {new Date(activeNote.updatedAt).toISOString()}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        /* DASHBOARD MODE (Rank & Stats) */
                        <motion.div
                            key="dashboard"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            className="flex-1 flex flex-col gap-6 lg:gap-8 min-h-0"
                        >
                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 shrink-0">
                                {stats.map((stat, i) => (
                                    <motion.div
                                        key={stat.label}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1, duration: 0.6 }}
                                        className="hyper-panel p-5 lg:p-6 flex items-center gap-4 group hover:shadow-lg transition-all duration-300"
                                        style={{ '--hover-glow': stat.glow } as React.CSSProperties}
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
                                                style={{ textShadow: `0 0 20px color-mix(in srgb, ${stat.glow}, transparent 75%)` }}
                                            >
                                                {stat.val}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Main Dashboard Content */}
                            <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 relative">
                                {/* Analytics Panel */}
                                <div className="hyper-panel p-6 lg:p-8 flex flex-col gap-6 overflow-hidden relative group">
                                    <div className="flex items-center justify-between relative z-10">
                                        <div className="flex items-center gap-3">
                                            <div className="pulse-dot" />
                                            <span className="font-display text-[11px] font-bold tracking-[0.3em] text-neon-cyan uppercase">Analytics</span>
                                        </div>
                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/30 border border-neon-cyan/10">
                                            <TrendingUp className="w-3 h-3 text-neon-cyan/40" />
                                            <span className="font-mono-tech text-[8px] text-neon-cyan/40 uppercase tracking-wider">Live</span>
                                        </div>
                                    </div>
                                    {/* Chart Placeholder */}
                                    <div className="flex-1 flex items-end gap-2 border-b border-white/5 pb-4">
                                        {[45, 70, 40, 90, 65, 80, 55].map((h, i) => (
                                            <div key={i} className="flex-1 bg-gradient-to-t from-neon-cyan/20 to-transparent rounded-t-sm transition-all hover:bg-neon-cyan/40" style={{ height: `${h}%` }} />
                                        ))}
                                    </div>
                                </div>

                                {/* Legacy Archive / Vault Info */}
                                <div className="hyper-panel p-6 lg:p-8 flex flex-col gap-6 overflow-hidden relative">
                                    <div className="flex items-center gap-3 relative z-10">
                                        <div className="w-2 h-2 rounded-full bg-neon-purple animate-pulse" style={{ boxShadow: '0 0 15px #bf00ff' }} />
                                        <span className="font-display text-[11px] font-bold tracking-[0.3em] text-neon-purple uppercase">System Status</span>
                                    </div>
                                    <div className="flex-1 flex flex-col justify-center space-y-4">
                                        <div className="p-4 rounded-lg bg-black/20 border border-white/5">
                                            <p className="font-mono-tech text-[10px] text-white/40 uppercase mb-1">Total Fragments</p>
                                            <p className="font-display text-2xl text-white">{codexNotes.length}</p>
                                        </div>
                                        <div className="p-4 rounded-lg bg-black/20 border border-white/5">
                                            <p className="font-mono-tech text-[10px] text-white/40 uppercase mb-1">Brain Dump Size</p>
                                            <p className="font-display text-2xl text-white">{brainDump.length} characters</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
