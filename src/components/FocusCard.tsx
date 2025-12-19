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
                "glass-pane h-full w-full flex flex-col items-center justify-center p-[4vh] transition-all duration-1000 relative overflow-hidden min-h-[50vh] lg:min-h-0",
                isInputFocused && "scale-[1.005] border-white/20"
            )}
        >
            <div className="absolute top-[3vh] left-[3vh] flex items-center gap-3">
                <Target className="w-3.5 h-3.5 text-accent-base/60" />
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
                        className="w-full max-w-lg space-y-[4vh] flex flex-col items-center"
                    >
                        <div className="relative w-full">
                            <input
                                type="text"
                                className="w-full bg-transparent border-none text-center text-3xl lg:text-[4vh] font-extralight text-white outline-none placeholder-white/10 p-[1vh] transition-all"
                                placeholder="State your intent..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleLock()}
                                onFocus={() => setIsInputFocused(true)}
                                onBlur={() => setIsInputFocused(false)}
                                autoFocus
                            />
                            <motion.div
                                className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent-base/40 to-transparent"
                                animate={{ opacity: isInputFocused ? 1 : 0.5, scaleX: isInputFocused ? 1 : 0.5 }}
                            />
                        </div>

                        <button
                            onClick={handleLock}
                            className="group flex items-center gap-3 px-8 py-[1.5vh] rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-accent-base hover:border-accent-base transition-all duration-500 font-mono-tech text-[10px] tracking-widest font-bold uppercase"
                        >
                            <Zap className="w-3.5 h-3.5" />
                            Initiate Protocol
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="locked-mode"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center gap-[4vh] w-full"
                    >
                        <motion.div
                            layoutId="mission-text"
                            className={cn(
                                "text-3xl md:text-4xl lg:text-[5vh] font-extralight text-white text-center max-w-full break-words leading-tight tracking-tight transition-all duration-1000",
                                isComplete && "opacity-20 line-through blur-[1px]"
                            )}
                        >
                            {focus}
                        </motion.div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsComplete(!isComplete)}
                                className={cn(
                                    "px-10 py-[1.5vh] rounded-full border transition-all duration-700 font-mono-tech text-[10px] tracking-[0.3em] font-black uppercase flex items-center gap-3",
                                    isComplete
                                        ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                                        : "bg-white/5 border-white/10 text-white/60 hover:border-accent-base hover:text-white hover:bg-accent-base/10"
                                )}
                            >
                                {isComplete ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                                {isComplete ? 'Accomplished' : 'Complete Mission'}
                            </button>

                            <button
                                onClick={handleReset}
                                className="p-[1.5vh] rounded-full border border-white/5 text-white/20 hover:text-red-400 hover:bg-red-400/10 hover:border-red-400/20 transition-all duration-500"
                                title="Abort Protocol"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}
