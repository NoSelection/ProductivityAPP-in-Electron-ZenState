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
        <div className="BrainDump flex-1 hyper-panel p-5 flex flex-col gap-4 min-h-0 relative overflow-hidden">
            {/* Background Effect */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(191,0,255,0.08),transparent_60%)]" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between shrink-0 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Brain className="w-5 h-5 text-neon-purple" style={{ filter: 'drop-shadow(0 0 8px #bf00ff)' }} />
                        {!isInitialized && (
                            <motion.div
                                className="absolute inset-0"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                            >
                                <div className="w-full h-full border border-neon-purple/30 rounded-full border-t-transparent" />
                            </motion.div>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <span className="font-display text-[10px] lg:text-xs font-bold tracking-[0.3em] text-neon-purple uppercase">
                            NEURAL DUMP
                        </span>
                        <span className="font-mono-tech text-[8px] text-white/20 uppercase tracking-widest">
                            Memory Cache
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/30 border border-neon-purple/10">
                        <Cpu className="w-3 h-3 text-neon-purple/40" />
                        <span className="font-mono-tech text-[9px] text-neon-purple/50">
                            {wordCount}w / {charCount}c
                        </span>
                    </div>
                </div>
            </div>

            {/* Terminal-style Text Area */}
            <div className={cn(
                "flex-1 min-h-0 relative rounded-lg border transition-all duration-300 overflow-hidden",
                isFocused
                    ? "border-neon-purple/30 shadow-[0_0_30px_rgba(191,0,255,0.15),inset_0_0_30px_rgba(191,0,255,0.05)]"
                    : "border-white/5 bg-black/30"
            )}>
                {/* Terminal Header */}
                <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5 bg-black/40">
                    <Terminal className="w-3 h-3 text-neon-purple/40" />
                    <span className="font-mono-tech text-[9px] text-white/20 uppercase tracking-wider">
                        neural_cache.log
                    </span>
                    <div className="flex-1" />
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-neon-magenta/40" />
                        <div className="w-2 h-2 rounded-full bg-neon-cyan/40" />
                        <div className="w-2 h-2 rounded-full bg-neon-lime/40" />
                    </div>
                </div>

                {/* Text Area */}
                <div className="relative h-[calc(100%-32px)]">
                    {/* Line Numbers Column */}
                    <div className="absolute left-0 top-0 bottom-0 w-10 bg-black/20 border-r border-white/5 flex flex-col pt-4 overflow-hidden">
                        {Array.from({ length: Math.max(10, notes.split('\n').length + 1) }).map((_, i) => (
                            <span
                                key={i}
                                className="font-mono-tech text-[10px] text-white/10 text-right pr-2 leading-relaxed"
                            >
                                {String(i + 1).padStart(2, '0')}
                            </span>
                        ))}
                    </div>

                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        spellCheck={false}
                        placeholder="> Initialize memory stream..."
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        className="w-full h-full bg-transparent border-none outline-none text-sm text-white/80 placeholder:text-neon-purple/20 resize-none custom-scrollbar leading-relaxed pl-14 pr-4 py-4 font-mono-tech"
                        style={{
                            textShadow: isFocused ? '0 0 10px rgba(191,0,255,0.2)' : 'none'
                        }}
                    />

                    {/* Cursor Blink Effect */}
                    {isFocused && notes.length === 0 && (
                        <motion.span
                            className="absolute left-14 top-4 w-2 h-5 bg-neon-purple/60"
                            animate={{ opacity: [1, 0] }}
                            transition={{ duration: 0.8, repeat: Infinity }}
                        />
                    )}
                </div>
            </div>

            {/* Bottom Status */}
            <div className="flex items-center justify-between shrink-0 relative z-10">
                <div className="flex items-center gap-2">
                    <div className={cn(
                        "w-1.5 h-1.5 rounded-full transition-all",
                        isInitialized
                            ? "bg-neon-lime shadow-[0_0_8px_#39ff14]"
                            : "bg-neon-orange animate-pulse"
                    )} />
                    <span className="font-mono-tech text-[8px] text-white/20 uppercase tracking-widest">
                        {isInitialized ? 'Synced' : 'Syncing...'}
                    </span>
                </div>
                <span className="font-mono-tech text-[8px] text-white/10 uppercase tracking-widest">
                    Auto-save enabled
                </span>
            </div>
        </div>
    )
}
