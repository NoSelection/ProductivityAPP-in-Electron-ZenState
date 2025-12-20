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
        if (adjustedHours < 5) return { name: 'Operator', color: 'text-[var(--prismatic-1)]' }
        if (adjustedHours < 20) return { name: 'Architect', color: 'text-[var(--prismatic-2)]' }
        return { name: 'Singularity', color: 'text-[var(--prismatic-3)]' }
    }

    const rank = getRank(totalFocus)

    const stats = [
        { label: 'Focus Time', val: `${focusHours}h`, icon: Zap, color: 'text-[var(--prismatic-1)]', glow: 'var(--prismatic-1)' },
        { label: 'Cycles', val: pomodoros.toString(), icon: Activity, color: 'text-[var(--prismatic-2)]', glow: 'var(--prismatic-2)' },
        { label: 'Completed', val: completedQuests.toString(), icon: Archive, color: 'text-[var(--prismatic-3)]', glow: 'var(--prismatic-3)' },
        { label: 'Rank', val: rank.name, icon: Award, color: rank.color, glow: 'var(--prismatic-1)' }
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
        <div className="NeuralCodex flex-1 flex gap-6 lg:gap-8 min-h-0 h-full relative">
            {/* Immersive Background */}
            <div className="absolute inset-0 pointer-events-none -z-10">
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(var(--prismatic-1-rgb),0.05)_0%,transparent_70%)] blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[10%] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(var(--prismatic-2-rgb),0.05)_0%,transparent_70%)] blur-[80px]" />
            </div>

            {/* --- SIDEBAR --- */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="w-80 shrink-0 flex flex-col gap-4 bg-[#0a0a0f]/40 backdrop-blur-xl border-r border-white/5 p-4 -ml-4 pl-8" // Integrated sidebar look
            >
                {/* Search & Actions */}
                <div className="flex gap-2">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-[var(--prismatic-1)] transition-colors" />
                        <input
                            type="text"
                            placeholder="SEARCH CODEX..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-lg text-sm font-mono-tech text-[var(--prismatic-1)] placeholder:text-white/20 focus:border-[var(--prismatic-1)]/50 focus:bg-black/60 transition-all outline-none"
                        />
                    </div>
                    <button
                        onClick={handleCreateNote}
                        aria-label="Create Note"
                        className="p-2.5 rounded-lg bg-[var(--prismatic-1)]/10 border border-[var(--prismatic-1)]/20 text-[var(--prismatic-1)] hover:bg-[var(--prismatic-1)]/20 hover:border-[var(--prismatic-1)]/50 transition-all group"
                    >
                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                    </button>
                </div>

                {/* Notes List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-2">
                    {isLoading ? (
                        <div className="flex justify-center p-8">
                            <div className="pulse-dot animate-ping bg-[var(--prismatic-1)]" />
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
                                    ? "bg-[var(--prismatic-1)]/5 border-[var(--prismatic-1)]/30 shadow-[inset_0_0_20px_rgba(var(--prismatic-1-rgb),0.05)]"
                                    : "bg-black/20 border-white/5 hover:border-white/10 hover:bg-black/30"
                            )}
                        >
                            {/* Accent Bar */}
                            {activeNoteId === note.id && (
                                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[var(--prismatic-1)] shadow-[0_0_10px_var(--prismatic-1)]" />
                            )}

                            <div className="flex justify-between items-start mb-1">
                                <h3 className={cn(
                                    "font-display text-sm font-medium truncate pr-4",
                                    activeNoteId === note.id ? "text-[var(--prismatic-1)]" : "text-white/70 group-hover:text-white"
                                )}>
                                    {note.title || 'Untitled'}
                                </h3>

                                <button
                                    onClick={(e) => handleDeleteNote(e, note.id)}
                                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-all"
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
                            <Database className="w-8 h-8 mx-auto mb-2 text-white/50" />
                            <p className="font-mono-tech text-[10px] uppercase tracking-widest text-white/50">No Data Found</p>
                        </div>
                    )}
                </div>
            </motion.div>


            {/* --- MAIN AREA --- */}
            <div className="flex-1 min-w-0 h-full flex flex-col relative overflow-hidden pt-4 pr-4">
                <AnimatePresence mode="wait">
                    {activeNoteId && activeNote ? (
                        /* EDIT MODE (Placeholder for Phase 2) */
                        /* EDIT MODE - ACTIVATED */
                        <motion.div
                            key="editor"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.3 }}
                            className="bg-[#0a0a0f]/80 backdrop-blur-xl border border-white/10 rounded-2xl flex-1 flex flex-col overflow-hidden relative shadow-2xl"
                        >
                            {/* Editor Header */}
                            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/0">
                                <input
                                    type="text"
                                    value={activeNote.title}
                                    onChange={(e) => {
                                        const updated = { ...activeNote, title: e.target.value, updatedAt: Date.now() }
                                        setCodexNotes(prev => prev.map(n => n.id === activeNote.id ? updated : n))
                                        window.neuralDb.saveCodexNote(updated)
                                    }}
                                    placeholder="UNTITLED ENTRY"
                                    className="bg-transparent border-none outline-none font-display text-2xl text-[var(--prismatic-1)] placeholder:text-white/20 w-full"
                                />
                                <div className="flex items-center gap-3">
                                    <div className="px-3 py-1 rounded-full bg-[var(--prismatic-2)]/10 border border-[var(--prismatic-2)]/20 text-[var(--prismatic-2)] font-mono-tech text-xs">
                                        LIVE EDIT
                                    </div>
                                    <div className="w-px h-6 bg-white/10" />
                                    <button
                                        onClick={() => setActiveNoteId(null)}
                                        className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/40 hover:text-white"
                                    >
                                        <kbd className="font-mono text-xs">ESC</kbd>
                                    </button>
                                </div>
                            </div>

                            {/* Editor Body */}
                            <div className="flex-1 relative">
                                <textarea
                                    value={activeNote.content}
                                    onChange={(e) => {
                                        const updated = { ...activeNote, content: e.target.value, updatedAt: Date.now() }
                                        setCodexNotes(prev => prev.map(n => n.id === activeNote.id ? updated : n))
                                        window.neuralDb.saveCodexNote(updated)
                                    }}
                                    placeholder="Initialize neural link..."
                                    className="w-full h-full bg-transparent resize-none p-6 outline-none font-mono-tech text-sm leading-relaxed text-white/80 placeholder:text-white/10 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent selection:bg-[var(--prismatic-1)]/30"
                                    spellCheck={false}
                                />

                                {/* Decorative "Scan Line" */}
                                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--prismatic-1)]/20 to-transparent opacity-50 pointer-events-none" />
                            </div>

                            {/* Editor Footer */}
                            <div className="p-3 border-t border-white/5 bg-black/20 flex justify-between items-center text-[10px] font-mono-tech text-white/30">
                                <div className="flex gap-4">
                                    <span>ID: {activeNote.id.slice(0, 8)}</span>
                                    <span>WORDS: {activeNote.content.split(/\s+/).filter(Boolean).length}</span>
                                    <span>CHARS: {activeNote.content.length}</span>
                                </div>
                                <div className="flex items-center gap-2 text-[var(--prismatic-3)]">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--prismatic-3)] animate-pulse" />
                                    UPLINK ACTIVE
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
                                        className="relative bg-[#0a0a0f]/60 backdrop-blur-md p-5 lg:p-6 flex items-center gap-4 group hover:bg-[#0a0a0f]/80 transition-all duration-300 border border-white/5 rounded-xl overflow-hidden"
                                    >
                                        {/* Hover Glow Background */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                                        <div
                                            className={cn(
                                                "p-3 rounded-xl border transition-all duration-300 group-hover:scale-110 relative z-10",
                                                `bg-black/40 border-white/10 ${stat.color}`
                                            )}
                                            style={{ filter: `drop-shadow(0 0 8px ${stat.glow})` }}
                                        >
                                            <stat.icon className="w-5 h-5" />
                                        </div>
                                        <div className="min-w-0 relative z-10">
                                            <p className="font-mono-tech text-[9px] text-white/30 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                                            <p
                                                className={cn("text-2xl lg:text-3xl font-display font-light tracking-tight", stat.color)}
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
                                <div className="bg-[#0a0a0f]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 lg:p-8 flex flex-col gap-6 overflow-hidden relative group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--prismatic-2)]/5 via-transparent to-transparent opacity-50" />

                                    <div className="flex items-center justify-between relative z-10">
                                        <div className="flex items-center gap-3">
                                            <div className="pulse-dot bg-[var(--prismatic-2)]" style={{ boxShadow: '0 0 10px var(--prismatic-2)' }} />
                                            <span className="font-display text-[11px] font-bold tracking-[0.3em] text-[var(--prismatic-2)] uppercase">Analytics</span>
                                        </div>
                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 border border-[var(--prismatic-2)]/20">
                                            <TrendingUp className="w-3 h-3 text-[var(--prismatic-2)]" />
                                            <span className="font-mono-tech text-[8px] text-[var(--prismatic-2)] uppercase tracking-wider">Live</span>
                                        </div>
                                    </div>
                                    {/* Chart Placeholder */}
                                    <div className="flex-1 flex items-end gap-2 border-b border-white/5 pb-4 relative z-10">
                                        {[45, 70, 40, 90, 65, 80, 55, 60, 85, 50, 75, 95].map((h, i) => (
                                            <div key={i} className="flex-1 group/bar relative">
                                                <div
                                                    className="w-full bg-gradient-to-t from-[var(--prismatic-2)]/20 to-[var(--prismatic-2)]/5 rounded-t-sm transition-all duration-300 hover:from-[var(--prismatic-2)]/40 hover:to-[var(--prismatic-2)]/10"
                                                    style={{ height: `${h}%` }}
                                                />
                                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity text-[9px] font-mono-tech text-[var(--prismatic-2)] bg-black/80 px-1 rounded border border-white/10 pointer-events-none">
                                                    {h}%
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Legacy Archive / Vault Info */}
                                <div className="bg-[#0a0a0f]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 lg:p-8 flex flex-col gap-6 overflow-hidden relative">
                                    <div className="absolute inset-0 bg-gradient-to-bl from-[var(--prismatic-1)]/5 via-transparent to-transparent opacity-50" />

                                    <div className="flex items-center gap-3 relative z-10">
                                        <div className="w-2 h-2 rounded-full bg-[var(--prismatic-1)] animate-pulse" style={{ boxShadow: '0 0 15px var(--prismatic-1)' }} />
                                        <span className="font-display text-[11px] font-bold tracking-[0.3em] text-[var(--prismatic-1)] uppercase">System Status</span>
                                    </div>
                                    <div className="flex-1 flex flex-col justify-center space-y-4 relative z-10">
                                        <div className="p-4 rounded-xl bg-black/20 border border-white/5 flex items-center justify-between group hover:bg-white/5 transition-colors">
                                            <div>
                                                <p className="font-mono-tech text-[10px] text-white/40 uppercase mb-1">Total Fragments</p>
                                                <p className="font-display text-2xl text-white group-hover:text-[var(--prismatic-1)] transition-colors">{codexNotes.length}</p>
                                            </div>
                                            <Database className="w-6 h-6 text-white/10 group-hover:text-[var(--prismatic-1)]/40 transition-colors" />
                                        </div>
                                        <div className="p-4 rounded-xl bg-black/20 border border-white/5 flex items-center justify-between group hover:bg-white/5 transition-colors">
                                            <div>
                                                <p className="font-mono-tech text-[10px] text-white/40 uppercase mb-1">Brain Dump Size</p>
                                                <p className="font-display text-2xl text-white group-hover:text-[var(--prismatic-3)] transition-colors">{brainDump.length} <span className="text-xs text-white/30">chars</span></p>
                                            </div>
                                            <FileText className="w-6 h-6 text-white/10 group-hover:text-[var(--prismatic-3)]/40 transition-colors" />
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
