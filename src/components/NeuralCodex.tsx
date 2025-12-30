import React, { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Archive, Zap, Activity, Search, Plus, Trash2 } from 'lucide-react'
import { useNeuralStorage } from '../hooks/useNeuralStorage'
import { cn } from '../lib/utils'

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
    const [quests] = useNeuralStorage<Quest[]>('zen-quests', [])
    const [codexNotes, setCodexNotes] = useState<CodexNote[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [activeNoteId, setActiveNoteId] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // --- Stats Logic ---
    useEffect(() => {
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

    return (
        <div className="h-full flex gap-12 relative">

            {/* SIDEBAR: Frosted Glass Strip */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="w-72 shrink-0 flex flex-col gap-6 pt-4 border-r border-white/5 pr-4"
            >
                {/* Search / Header */}
                <div className="flex items-center gap-2">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 text-white/30 group-hover:text-white/60 transition-colors" />
                        <input
                            type="text"
                            placeholder="SEARCH CODEX"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-6 bg-transparent border-b border-transparent focus:border-white/10 text-[10px] font-mono-tech tracking-widest text-white placeholder:text-white/20 outline-none py-2 transition-all"
                        />
                    </div>
                    <button
                        onClick={handleCreateNote}
                        className="p-1.5 text-white/30 hover:text-white transition-colors border border-transparent hover:border-white/10 rounded"
                    >
                        <Plus className="w-3 h-3" />
                    </button>
                </div>

                {/* Notes List */}
                <div className="flex-1 overflow-y-auto space-y-1 -mr-2 pr-2">
                    {filteredNotes.map((note) => (
                        <motion.div
                            key={note.id}
                            layoutId={note.id}
                            onClick={() => setActiveNoteId(note.id)}
                            className={cn(
                                "group p-3 cursor-pointer transition-all duration-300 relative rounded-lg",
                                activeNoteId === note.id
                                    ? "bg-white/5"
                                    : "hover:bg-white/5"
                            )}
                        >
                            <div className="flex justify-between items-start">
                                <h3 className={cn(
                                    "text-sm font-light tracking-wide truncate pr-4 transition-colors",
                                    activeNoteId === note.id ? "text-white" : "text-white/50"
                                )}>
                                    {note.title || 'Untitled'}
                                </h3>

                                <button
                                    onClick={(e) => handleDeleteNote(e, note.id)}
                                    className="opacity-0 group-hover:opacity-100 p-1 text-white/20 hover:text-red-400 transition-all"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Mini Stats Footer */}
                <div className="pt-4 border-t border-white/5 flex justify-between items-center text-[9px] font-mono-tech text-white/20 uppercase tracking-widest">
                    <span>Focus: {(totalFocus / 3600).toFixed(1)}h</span>
                    <span>Notes: {codexNotes.length}</span>
                </div>
            </motion.div>


            {/* MAIN CONTENT AREA */}
            <div className="flex-1 min-w-0 h-full relative overflow-hidden flex flex-col pt-4">
                <AnimatePresence mode="wait">
                    {activeNoteId && activeNote ? (
                        /* EDITOR MODE */
                        <motion.div
                            key="editor"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex-1 flex flex-col h-full bg-white/[0.02] rounded-2xl border border-white/5 overflow-hidden"
                        >
                            <div className="p-8 border-b border-white/5">
                                <input
                                    type="text"
                                    value={activeNote.title}
                                    onChange={(e) => {
                                        const updated = { ...activeNote, title: e.target.value, updatedAt: Date.now() }
                                        setCodexNotes(prev => prev.map(n => n.id === activeNote.id ? updated : n))
                                        window.neuralDb.saveCodexNote(updated)
                                    }}
                                    placeholder="Untitled Entry"
                                    className="bg-transparent border-none outline-none font-display text-4xl text-white/90 placeholder:text-white/10 w-full"
                                />
                            </div>
                            <textarea
                                value={activeNote.content}
                                onChange={(e) => {
                                    const updated = { ...activeNote, content: e.target.value, updatedAt: Date.now() }
                                    setCodexNotes(prev => prev.map(n => n.id === activeNote.id ? updated : n))
                                    window.neuralDb.saveCodexNote(updated)
                                }}
                                placeholder="Write..."
                                className="flex-1 w-full bg-transparent resize-none p-8 outline-none font-serif text-lg leading-relaxed text-white/70 placeholder:text-white/10 scrollbar-thin scrollbar-thumb-white/10"
                                spellCheck={false}
                            />
                        </motion.div>
                    ) : (
                        /* EMPTY STATE / DASHBOARD BACKDROP */
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex-1 flex items-center justify-center text-white/10"
                        >
                            <div className="text-center space-y-4">
                                <Archive size={48} strokeWidth={1} />
                                <p className="font-mono-tech text-xs tracking-[0.3em] uppercase">Select an archive</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
