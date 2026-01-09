import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { CheckCircle2, X } from 'lucide-react'
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
                "FocusCard h-full w-full flex flex-col items-center justify-center p-8 lg:p-12 relative overflow-hidden min-h-0",
                "bg-[#0a0a0f] border-0 backdrop-blur-3xl", // Deep Void Base
                isInputFocused && "shadow-prism-glow"
            )}
            style={{
                clipPath: 'polygon(0 20px, 20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)' // Double Chamfer
            }}
        >
            {/* Prismatic Border (Animated) */}
            <div className="absolute inset-0 p-[1px] opacity-40">
                <div className="absolute inset-0 bg-prismatic-ray animate-spin-slow opacity-50" style={{ animationDuration: '10s' }} />
                <div className="absolute inset-[1px] bg-[#0a0a0f]" style={{ clipPath: 'polygon(0 20px, 20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)' }} />
            </div>

            {/* Surreal Background Texture */}
            <div className="absolute inset-0 opacity-40 pointer-events-none">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
                <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-b from-transparent via-[var(--prismatic-1)]/10 to-transparent rotate-45 animate-pulse" style={{ animationDuration: '8s' }} />
            </div>

            {/* Header Badge (Floating Geometry) */}
            <div className="absolute top-8 left-8 flex items-center gap-4 z-10">
                <div className="relative w-6 h-6">
                    <div className="absolute inset-0 border border-white/30 rotate-45" />
                    <div className="absolute inset-1 bg-white/10 rotate-45" />
                </div>
                <div className="flex flex-col">
                    <span className="font-display text-xs font-bold tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50 uppercase">
                        {isLocked ? 'Manifesting' : 'Commune'}
                    </span>
                    <div className="h-px w-full bg-gradient-to-r from-white/30 to-transparent mt-1" />
                </div>
            </div>

            <AnimatePresence mode="wait">
                {!isLocked ? (
                    <motion.div
                        key="input-mode"
                        initial={{ opacity: 0, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, filter: 'blur(10px)' }}
                        className="w-full max-w-lg flex flex-col items-center gap-12 relative z-10"
                    >
                        {/* Input Field */}
                        <div className="relative w-full group">
                            <input
                                type="text"
                                className="w-full bg-transparent text-center text-4xl lg:text-5xl font-thin text-white outline-none py-6 font-display tracking-widest placeholder:text-white/10"
                                placeholder="Shape Reality..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleLock()}
                                onFocus={() => setIsInputFocused(true)}
                                onBlur={() => setIsInputFocused(false)}
                                autoFocus
                            />
                            {/* Prismatic Underline */}
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r from-[var(--prismatic-1)] via-[var(--prismatic-2)] to-[var(--prismatic-3)] group-focus-within:w-2/3 transition-all duration-700 ease-out" />
                        </div>

                        {/* Lock Button (Surreal) */}
                        <motion.button
                            onClick={handleLock}
                            whileHover={{ scale: 1.02, textShadow: "0 0 8px var(--prismatic-2)" }}
                            whileTap={{ scale: 0.98 }}
                            className="relative z-50 cursor-pointer px-10 py-4 bg-black/40 border border-white/10 text-white/80 font-display text-xs tracking-[0.2em] uppercase transition-all flex items-center gap-3 backdrop-blur-md hover:border-[var(--prismatic-2)] hover:bg-[var(--prismatic-2)]/10 hover:shadow-[0_0_20px_rgba(var(--prismatic-2-rgb),0.2)] hover:text-[var(--prismatic-2)]"
                        >
                            <span className="w-1.5 h-1.5 bg-[var(--prismatic-2)] rounded-full shadow-[0_0_5px_var(--prismatic-2)]" />
                            <span>Bind Intent</span>
                            <span className="w-1.5 h-1.5 bg-[var(--prismatic-2)] rounded-full shadow-[0_0_5px_var(--prismatic-2)]" />
                        </motion.button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="locked-mode"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center gap-12 w-full relative z-10"
                    >
                        {/* Mission Objective Text */}
                        <div className="relative py-10 w-full text-center">
                            {/* Organic Glow Behind Text */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-32 bg-gradient-to-r from-transparent via-[rgba(var(--prismatic-1-rgb),0.1)] to-transparent blur-3xl" />

                            <motion.div
                                layoutId="mission-text"
                                className={cn(
                                    "text-4xl md:text-5xl lg:text-6xl font-display font-thin text-white tracking-wide leading-tight px-8 mix-blend-overlay",
                                    isComplete && "line-through opacity-50"
                                )}
                                style={{
                                    textShadow: '0 0 30px rgba(255,255,255,0.3)'
                                }}
                            >
                                {focus}
                            </motion.div>
                        </div>

                        {/* Action Buttons (Artifacts) */}
                        <div className="flex items-center gap-8">
                            <motion.button
                                onClick={() => setIsComplete(!isComplete)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className={cn(
                                    "w-20 h-20 rounded-full flex items-center justify-center border transition-all duration-500 relative overflow-hidden",
                                    isComplete
                                        ? "border-[var(--prismatic-3)]/50 bg-[var(--prismatic-3)]/10 shadow-[0_0_40px_rgba(var(--prismatic-3-rgb),0.2)]"
                                        : "border-white/20 hover:border-white/60 bg-white/5"
                                )}
                            >
                                <div className="absolute inset-0 bg-prismatic-ray opacity-10 animate-spin-slow" />
                                <CheckCircle2 className={cn("w-8 h-8 relative z-10", isComplete ? "text-[var(--prismatic-3)]" : "text-white/60")} strokeWidth={1} />
                            </motion.button>

                            <motion.button
                                onClick={handleReset}
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                                className="w-14 h-14 rounded-full flex items-center justify-center border border-white/5 bg-black/40 hover:bg-white/5 transition-all"
                            >
                                <X className="w-6 h-6 text-white/30" strokeWidth={1} />
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}
