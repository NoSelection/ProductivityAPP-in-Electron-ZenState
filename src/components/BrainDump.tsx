import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Brain, Terminal, Cpu } from 'lucide-react'
import { useNeuralStorage } from '../hooks/useNeuralStorage'
import { cn } from '../lib/utils'

export const BrainDump: React.FC = () => {
    const [notes, setNotes, isInitialized] = useNeuralStorage('zen-brain-dump', '')
    const [isFocused, setIsFocused] = useState(false)

    const wordCount = notes.trim() ? notes.trim().split(/\s+/).length : 0
    const charCount = notes.length

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
                            Direct Interface
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 border border-white/5">
                    <Cpu className="w-3 h-3 text-[var(--prismatic-1)]" />
                    <span className="font-mono-tech text-[9px] text-white/40">
                        {wordCount} WORDS
                    </span>
                </div>
            </div>

            {/* Terminal Entry Area */}
            <div className="flex-1 min-h-0 relative group/terminal">
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    spellCheck={false}
                    placeholder="Initialize neural dump..."
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="w-full h-full bg-transparent border-none outline-none text-sm leading-relaxed px-6 py-4 font-mono-tech text-white/80 placeholder:text-white/10 resize-none custom-scrollbar relative z-10"
                    style={{
                        textShadow: isFocused ? '0 0 10px rgba(var(--prismatic-1-rgb),0.3)' : 'none'
                    }}
                />

                {/* Background Decor */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
                    <div className="absolute right-10 bottom-10">
                        <Brain className="w-64 h-64" />
                    </div>
                </div>
            </div>

            {/* Footer / Status */}
            <div className="flex-none p-3 bg-black/60 border-t border-white/5 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2">
                    <div className={cn(
                        "w-1.5 h-1.5 rounded-full transition-all duration-500",
                        isInitialized
                            ? "bg-[var(--prismatic-1)] shadow-[0_0_8px_var(--prismatic-1)]"
                            : "bg-red-500/50 animate-pulse"
                    )} />
                    <span className="font-mono-tech text-[8px] text-white/30 uppercase tracking-widest">
                        {isInitialized ? 'Uplink Established' : 'Connecting...'}
                    </span>
                </div>
                <div className="flex items-center gap-2 opacity-30">
                    <Terminal className="w-3 h-3" />
                    <span className="font-mono-tech text-[8px] tracking-widest">V.2.0.4</span>
                </div>
            </div>
        </div>
    )
}
