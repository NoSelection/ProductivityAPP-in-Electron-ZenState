import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Brain, Terminal, Cpu, Plus, X } from 'lucide-react'
import { useNeuralStorage } from '../hooks/useNeuralStorage'
import { cn } from '../lib/utils'

interface Note {
    id: string
    title: string
    content: string
    updatedAt: number
}

export const BrainDump: React.FC = () => {
    const [notes, setNotes, isInitialized] = useNeuralStorage<Note[]>('zen-brain-dump-multi', [])
    const [activeNoteId, setActiveNoteId] = useState<string | null>(null)
    const [isFocused, setIsFocused] = useState(false)

    // Ensure there's always at least one note
    React.useEffect(() => {
        if (isInitialized && notes.length === 0) {
            const newNote: Note = {
                id: crypto.randomUUID(),
                title: 'ROOT_ACCESS',
                content: '',
                updatedAt: Date.now()
            }
            setNotes([newNote])
            setActiveNoteId(newNote.id)
        } else if (isInitialized && !activeNoteId && notes.length > 0) {
            setActiveNoteId(notes[0].id)
        }
    }, [isInitialized, notes.length, activeNoteId])

    const activeNote = notes.find(n => n.id === activeNoteId) || notes[0]

    const handleUpdate = (content: string) => {
        if (!activeNote) return

        const lines = content.trim().split('\n')
        const title = lines[0]?.substring(0, 20) || 'UNTITLED_SIGNAL'

        setNotes(notes.map(n => n.id === activeNote.id ? {
            ...n,
            content,
            title: content.trim() ? (title.length === 20 ? title + '...' : title) : 'EMPTY_SIGNAL',
            updatedAt: Date.now()
        } : n))
    }

    const createNote = () => {
        const newNote: Note = {
            id: crypto.randomUUID(),
            title: 'NEW_vLINK',
            content: '',
            updatedAt: Date.now()
        }
        setNotes([newNote, ...notes])
        setActiveNoteId(newNote.id)
    }

    const deleteNote = (e: React.MouseEvent, id: string) => {
        e.stopPropagation()
        const newNotes = notes.filter(n => n.id !== id)
        setNotes(newNotes)
        if (activeNoteId === id) {
            setActiveNoteId(newNotes[0]?.id || null)
        }
    }

    const wordCount = activeNote?.content.trim() ? activeNote.content.trim().split(/\s+/).length : 0

    return (
        <div className="BrainDump flex-1 flex flex-col relative overflow-hidden group bg-[#0a0a0f]/80 backdrop-blur-xl border border-white/5 rounded-2xl min-h-0 h-full">
            {/* Prismatic Border Highlight */}
            <div className="absolute inset-0 p-[1px] rounded-2xl pointer-events-none opacity-50">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--prismatic-1)]/20 via-transparent to-[var(--prismatic-1)]/10" />
            </div>

            {/* Header */}
            <div className="flex-none p-6 flex items-center justify-between border-b border-white/5 bg-black/40 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="relative w-10 h-10 flex items-center justify-center bg-[var(--prismatic-1)]/10 rounded-lg border border-[var(--prismatic-1)]/30">
                        <Brain className="w-5 h-5 text-[var(--prismatic-1)]" style={{ filter: 'drop-shadow(0 0 8px var(--prismatic-1))' }} />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-display text-sm font-bold tracking-[0.3em] text-[var(--prismatic-1)] uppercase glow-text">
                            Neural Uplink
                        </span>
                        <span className="font-serif italic text-[10px] text-white/30 tracking-widest">
                            Multi-Thread Archives
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={createNote}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--prismatic-1)]/10 border border-[var(--prismatic-1)]/30 hover:bg-[var(--prismatic-1)]/20 transition-all group/btn"
                    >
                        <Plus className="w-3 h-3 text-[var(--prismatic-1)]" />
                        <span className="font-mono-tech text-[9px] text-[var(--prismatic-1)] tracking-wider">NEW THREAD</span>
                    </button>
                </div>
            </div>

            <div className="flex-1 min-h-0 flex relative z-10">
                {/* Sidebar / Threads List */}
                <div className="w-48 border-r border-white/5 bg-black/20 flex flex-col">
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                        {notes.map(note => (
                            <div
                                key={note.id}
                                onClick={() => setActiveNoteId(note.id)}
                                className={cn(
                                    "group/item w-full p-3 rounded-lg text-left transition-all cursor-pointer relative overflow-hidden flex items-center justify-between",
                                    activeNoteId === note.id
                                        ? "bg-[var(--prismatic-1)]/10 border border-[var(--prismatic-1)]/20"
                                        : "hover:bg-white/5 border border-transparent"
                                )}
                            >
                                <div className="flex flex-col gap-0.5 min-w-0">
                                    <span className={cn(
                                        "font-mono-tech text-[10px] truncate uppercase tracking-wider",
                                        activeNoteId === note.id ? "text-[var(--prismatic-1)]" : "text-white/60 group-hover/item:text-white/80"
                                    )}>
                                        {note.title}
                                    </span>
                                    <span className="text-[8px] text-white/20">
                                        {new Date(note.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>

                                {notes.length > 1 && (
                                    <button
                                        onClick={(e) => deleteNote(e, note.id)}
                                        className="opacity-0 group-hover/item:opacity-100 p-1 hover:text-red-400 text-white/20 transition-all"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Editor Area */}
                <div className="flex-1 flex flex-col min-w-0 bg-transparent relative group/terminal">
                    {activeNote && (
                        <textarea
                            value={activeNote.content}
                            onChange={(e) => handleUpdate(e.target.value)}
                            spellCheck={false}
                            placeholder="Initialize neural dump..."
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            className="w-full h-full bg-transparent border-none outline-none text-sm leading-relaxed px-6 py-4 font-mono-tech text-white/80 placeholder:text-white/10 resize-none custom-scrollbar relative z-10"
                            style={{
                                textShadow: isFocused ? '0 0 10px rgba(var(--prismatic-1-rgb),0.3)' : 'none'
                            }}
                        />
                    )}

                    {/* Background Decor */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
                        <div className="absolute right-10 bottom-10">
                            <Brain className="w-64 h-64" />
                        </div>
                    </div>

                    {/* Footer Status Overlay */}
                    <div className="absolute bottom-3 right-6 pointer-events-none flex items-center gap-3 opacity-50">
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-black/40 border border-white/10">
                            <Cpu className="w-3 h-3 text-[var(--prismatic-1)]" />
                            <span className="font-mono-tech text-[9px] text-[var(--prismatic-1)]">
                                {wordCount} WORDS
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Status Bar */}
            <div className="flex-none p-3 bg-black/60 border-t border-white/5 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2">
                    <div className={cn(
                        "w-1.5 h-1.5 rounded-full transition-all duration-500",
                        isInitialized
                            ? "bg-[var(--prismatic-1)] shadow-[0_0_8px_var(--prismatic-1)]"
                            : "bg-red-500/50 animate-pulse"
                    )} />
                    <span className="font-mono-tech text-[8px] text-white/30 uppercase tracking-widest">
                        {isInitialized ? 'Archives Synced' : 'Establishing Uplink...'}
                    </span>
                </div>
                <div className="flex items-center gap-2 opacity-30">
                    <Terminal className="w-3 h-3" />
                    <span className="font-mono-tech text-[8px] tracking-widest">V.2.1.0 // MULTI-THREAD</span>
                </div>
            </div>
        </div>
    )
}
