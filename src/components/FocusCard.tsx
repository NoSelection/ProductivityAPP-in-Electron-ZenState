import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { Circle, CheckCircle2, Lock } from 'lucide-react'
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
        <div className={cn(
            "cyber-glass h-full w-full p-10 flex flex-col justify-center items-center group relative overflow-hidden transition-all duration-700 rounded-3xl",
            isInputFocused && "border-cyan-500/40 shadow-[0_0_40px_rgba(6,182,212,0.15)]",
            isLocked && !isComplete && "border-primary/30 shadow-[0_0_40px_rgba(122,162,247,0.1)]"
        )}>
            {/* Catch-light accent */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <motion.h2
                initial={{ opacity: 0.5 }}
                animate={{ opacity: isLocked ? 1 : 0.6 }}
                className="text-slate-500 text-[9px] font-bold tracking-[0.3em] uppercase mb-10 font-mono-tech"
            >
                {isLocked ? 'Mission // Initiated' : 'Select Mission'}
            </motion.h2>

            <AnimatePresence mode="wait">
                {!isLocked ? (
                    <motion.div
                        key="input-mode"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="w-full max-w-lg space-y-6"
                    >
                        <input
                            type="text"
                            className="w-full bg-transparent border-b border-white/5 text-center text-4xl font-extralight text-slate-100 outline-none focus:border-cyan-500/50 transition-all placeholder-white/5 p-6 hover:bg-white/[0.02]"
                            placeholder="WHAT IS THE ONE THING?"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleLock()}
                            onFocus={() => setIsInputFocused(true)}
                            onBlur={() => setIsInputFocused(false)}
                            autoFocus
                        />
                        <div className="flex justify-center">
                            <span className="text-[10px] text-slate-700 font-mono-tech tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                                Press [Enter] to Execute
                            </span>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="locked-mode"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center gap-10"
                    >
                        <div className={cn(
                            "text-5xl font-extralight text-text/90 text-center max-w-full break-words leading-[1.2] tracking-tight transition-all duration-1000",
                            isComplete && "line-through opacity-20 grayscale blur-[1px]"
                        )}>
                            {focus}
                        </div>

                        <div className="flex gap-6">
                            <button
                                onClick={() => setIsComplete(!isComplete)}
                                className={cn(
                                    "flex items-center gap-4 px-10 py-4 rounded-xl border transition-all duration-500 font-mono-tech text-[10px] tracking-[0.2em] font-bold",
                                    isComplete
                                        ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400"
                                        : "bg-primary/5 border-primary/40 text-primary hover:bg-primary/20 hover:shadow-[0_0_30px_rgba(122,162,247,0.3)]"
                                )}
                            >
                                {isComplete ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                                {isComplete ? 'ACCOMPLISHED' : 'COMPLETE MISSION'}
                            </button>

                            <button
                                onClick={handleReset}
                                className="p-4 rounded-xl border border-white/10 text-slate-600 hover:text-white hover:bg-white/5 hover:border-white/20 transition-all"
                                title="Abort Mission"
                            >
                                <Lock className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
