import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { Circle, CheckCircle2, Target, Zap, X } from 'lucide-react'
import { cn } from '../lib/utils'

export const FocusCard: React.FC = () => {
    const [focus, setFocus] = useLocalStorage<string>('zen-focus-task', '')
    const [inputValue, setInputValue] = useState(focus)
    const [isLocked, setIsLocked] = useState(!!focus)
    const [isComplete, setIsComplete] = useState(false)
    const [isInputFocused, setIsInputFocused] = useState(false)

    const handleLock = () => {
        if (!inputValue.trim()) return
        setFocus(inputValue)
        setIsLocked(true)
        setInputValue('')
    }

    const handleReset = () => {
        setIsLocked(false)
        setIsComplete(false)
        setFocus('')
        setInputValue('')
    }

    return (
        <motion.div
            layout
            className={cn(
                "FocusCard h-full w-full flex flex-col items-center justify-center p-8 lg:p-12 transition-all duration-1000 relative overflow-hidden glass-pane min-h-0",
                isInputFocused && "scale-[1.01] border-white/20"
            )}
        >
            <div className="absolute top-6 left-6 lg:top-8 lg:left-8 flex items-center gap-3">
                <Target className="w-4 h-4 text-accent-base/60" />
                <h2 className="text-white/40 text-[9px] font-black tracking-[0.5em] uppercase font-mono-tech">
                    {isLocked ? 'MISSION // ACTIVE' : 'FOCUS // TARGET'}
                </h2>
            </div>

            <AnimatePresence mode="wait">
                {!isLocked ? (
                    <motion.div
                        key="input-mode"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        className="w-full max-w-md flex flex-col items-center gap-8"
                    >
                        <div className="relative w-full">
                            <input
                                type="text"
                                className="w-full bg-transparent border-none text-center text-2xl md:text-3xl lg:text-4xl font-extralight text-white outline-none placeholder:text-white/5 p-4 transition-all"
                                placeholder="State your intent..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleLock()}
                                onFocus={() => setIsInputFocused(true)}
                                onBlur={() => setIsInputFocused(false)}
                                autoFocus
                            />
                            <motion.div
                                className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-base/40 to-transparent"
                                animate={{ opacity: isInputFocused ? 1 : 0.4, scaleX: isInputFocused ? 1 : 0.6 }}
                            />
                        </div>

                        <button
                            onClick={handleLock}
                            className="group flex items-center gap-3 px-8 py-3 rounded-full bg-white/[0.03] border border-white/10 text-white/60 hover:text-white hover:bg-accent-base hover:border-accent-base transition-all font-mono-tech text-[10px] tracking-widest font-black uppercase"
                        >
                            <Zap className="w-4 h-4 group-hover:animate-pulse" />
                            Initiate Protocol
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="locked-mode"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center gap-8 w-full"
                    >
                        <motion.div
                            layoutId="mission-text"
                            className={cn(
                                "text-2xl md:text-3xl lg:text-4xl font-extralight text-white text-center max-w-full break-words leading-tight tracking-tight transition-all select-text",
                                isComplete && "opacity-20 line-through blur-[2px]"
                            )}
                        >
                            {focus}
                        </motion.div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsComplete(!isComplete)}
                                className={cn(
                                    "px-8 py-3 rounded-full border transition-all font-mono-tech text-[10px] tracking-[0.3em] font-black uppercase flex items-center gap-3",
                                    isComplete
                                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                                        : "bg-white/[0.03] border-white/10 text-white/60 hover:border-accent-base hover:text-white hover:bg-accent-base/10"
                                )}
                            >
                                {isComplete ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                                {isComplete ? 'Accomplished' : 'Complete Mission'}
                            </button>

                            <button
                                onClick={handleReset}
                                className="p-3 rounded-full border border-white/5 text-white/20 hover:text-red-400 hover:bg-red-400/10 hover:border-red-400/20 transition-all"
                                title="Abort Protocol"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}
