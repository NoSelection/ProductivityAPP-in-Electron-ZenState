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
        <div className="BrainDump flex-1 hyper-panel p-5 flex flex-col gap-4 min-h-0 relative overflow-hidden group">
            {/* Background Lore Texture */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(46,16,101,0.2),transparent_60%)]" />
                <div className="absolute top-0 right-0 w-full h-px bg-gradient-to-l from-white/10 to-transparent" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between shrink-0 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="relative w-8 h-8 flex items-center justify-center bg-white/5 rounded-full border border-white/10">
                        <Brain className="w-4 h-4 text-[var(--prismatic-1)]" style={{ filter: 'drop-shadow(0 0 10px var(--prismatic-1))' }} />
                        <div className="absolute inset-0 border border-white/5 rounded-full animate-ping opacity-20" style={{ animationDuration: '3s' }} />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-display text-[10px] lg:text-xs font-bold tracking-[0.3em] text-[var(--prismatic-1)] uppercase">
                            GRIMOIRE
                        </span>
                        <span className="font-serif italic text-[9px] text-white/30 tracking-widest">
                            Whispers & Logic
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 border border-[rgba(var(--prismatic-1-rgb),0.2)]">
                        <Cpu className="w-3 h-3 text-[rgba(var(--prismatic-1-rgb),0.4)]" />
                        <span className="font-mono-tech text-[9px] text-[rgba(var(--prismatic-1-rgb),0.6)]">
                            {wordCount}w / {charCount}c
                        </span>
                    </div>
                </div>
            </div>

            {/* Terminal-style Text Area (Lore Entry) */}
            <div className={cn(
                "flex-1 min-h-0 relative transition-all duration-300 overflow-hidden",
                isFocused
                    ? "border-l-2 border-[var(--prismatic-1)] bg-black/20"
                    : "border-l-2 border-white/5 bg-transparent"
            )}>
                {/* Header Line */}
                <div className="absolute top-0 left-0 w-full h-px bg-white/5" />

                {/* Text Area */}
                <div className="relative h-full">
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        spellCheck={false}
                        placeholder="Transcribe the whispers..."
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        className="w-full h-full bg-transparent border-none outline-none text-sm text-white/80 placeholder:text-white/10 resize-none custom-scrollbar leading-relaxed px-6 py-4 font-serif relative z-10 tracking-wide"
                        style={{
                            textShadow: isFocused ? '0 0 10px rgba(var(--prismatic-1-rgb),0.2)' : 'none'
                        }}
                    />

                    {/* Decorative Watermark */}
                    <div className="absolute bottom-4 right-4 pointer-events-none opacity-5">
                        <Brain className="w-24 h-24 text-white" />
                    </div>
                </div>
            </div>

            {/* Bottom Status */}
            <div className="flex items-center justify-between shrink-0 relative z-10 border-t border-white/5 pt-3">
                <div className="flex items-center gap-2">
                    <div className={cn(
                        "w-1.5 h-1.5 rounded-full transition-all",
                        isInitialized
                            ? "bg-[var(--prismatic-1)] shadow-[0_0_8px_var(--prismatic-1)]"
                            : "bg-white/20 animate-pulse"
                    )} />
                    <span className="font-mono-tech text-[8px] text-white/20 uppercase tracking-widest">
                        {isInitialized ? 'Archives Synced' : 'Establishing Uplink...'}
                    </span>
                </div>
                <span className="font-mono-tech text-[8px] text-white/10 uppercase tracking-widest">
                    // END TRANSMISSION
                </span>
            </div>
        </div>
    )
}
