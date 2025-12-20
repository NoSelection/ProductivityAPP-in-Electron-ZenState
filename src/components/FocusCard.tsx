import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { Circle, CheckCircle2, Target, Zap, X, Crosshair } from 'lucide-react'
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
                "FocusCard h-full w-full flex flex-col items-center justify-center p-8 lg:p-12 relative overflow-hidden hyper-panel min-h-0 corner-accents",
                isInputFocused && "border-neon-cyan/30 shadow-[0_0_40px_rgba(0,240,255,0.15),inset_0_0_40px_rgba(0,240,255,0.05)]"
            )}
        >
            {/* Animated Background Grid */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,240,255,0.08),transparent_70%)]" />
            </div>

            {/* Header Badge */}
            <div className="absolute top-5 left-5 lg:top-6 lg:left-6 flex items-center gap-3 z-10">
                <div className="relative">
                    <Crosshair className="w-5 h-5 text-neon-cyan" style={{ filter: 'drop-shadow(0 0 8px #00f0ff)' }} />
                    {isLocked && (
                        <motion.div
                            className="absolute inset-0"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                        >
                            <div className="w-full h-full border border-neon-cyan/30 rounded-full" />
                        </motion.div>
                    )}
                </div>
                <div className="flex flex-col">
                    <span className="font-display text-[10px] lg:text-xs font-bold tracking-[0.3em] text-neon-cyan uppercase">
                        {isLocked ? 'MISSION ACTIVE' : 'TARGET LOCK'}
                    </span>
                    <span className="font-mono-tech text-[8px] text-white/20 uppercase tracking-widest">
                        {isLocked ? 'Protocol Engaged' : 'Awaiting Input'}
                    </span>
                </div>
            </div>

            {/* Status Indicator */}
            <div className="absolute top-5 right-5 lg:top-6 lg:right-6 flex items-center gap-2">
                <div className={cn(
                    "w-2 h-2 rounded-full",
                    isLocked ? "bg-neon-lime animate-pulse shadow-[0_0_10px_#39ff14]" : "bg-neon-cyan/30"
                )} />
                <span className="font-mono-tech text-[9px] text-white/30 uppercase tracking-wider">
                    {isComplete ? 'COMPLETE' : isLocked ? 'ACTIVE' : 'STANDBY'}
                </span>
            </div>

            <AnimatePresence mode="wait">
                {!isLocked ? (
                    <motion.div
                        key="input-mode"
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 1.1, y: -20 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="w-full max-w-lg flex flex-col items-center gap-10 relative z-10"
                    >
                        {/* Input Field */}
                        <div className="relative w-full group">
                            <input
                                type="text"
                                className="w-full bg-transparent text-center text-2xl md:text-3xl lg:text-4xl font-light text-white outline-none p-6 font-display tracking-wide"
                                style={{
                                    textShadow: isInputFocused ? '0 0 20px rgba(0,240,255,0.3)' : 'none'
                                }}
                                placeholder="Define your mission..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleLock()}
                                onFocus={() => setIsInputFocused(true)}
                                onBlur={() => setIsInputFocused(false)}
                                autoFocus
                            />
                            {/* Animated underline */}
                            <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10" />
                            <motion.div
                                className="absolute bottom-0 left-1/2 h-[2px] bg-gradient-to-r from-neon-cyan via-neon-magenta to-neon-cyan"
                                style={{ boxShadow: '0 0 20px #00f0ff, 0 0 40px #00f0ff' }}
                                initial={{ width: 0, x: '-50%' }}
                                animate={{
                                    width: isInputFocused ? '100%' : '0%',
                                    x: '-50%'
                                }}
                                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            />
                            {/* Corner brackets */}
                            <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-neon-cyan/30 opacity-0 group-focus-within:opacity-100 transition-opacity" />
                            <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-neon-cyan/30 opacity-0 group-focus-within:opacity-100 transition-opacity" />
                            <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-neon-cyan/30 opacity-0 group-focus-within:opacity-100 transition-opacity" />
                            <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-neon-cyan/30 opacity-0 group-focus-within:opacity-100 transition-opacity" />
                        </div>

                        {/* Lock Button */}
                        <motion.button
                            onClick={handleLock}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="hyper-btn group flex items-center gap-3"
                        >
                            <Zap className="w-4 h-4 group-hover:animate-pulse" style={{ filter: 'drop-shadow(0 0 5px #00f0ff)' }} />
                            <span className="relative z-10">Initiate Protocol</span>
                        </motion.button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="locked-mode"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center gap-10 w-full relative z-10"
                    >
                        {/* Mission Text */}
                        <motion.div
                            layoutId="mission-text"
                            className={cn(
                                "text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-display font-light text-center max-w-full break-words leading-tight tracking-wide transition-all duration-500 select-text px-4",
                                isComplete
                                    ? "text-neon-lime/40 line-through blur-[1px]"
                                    : "text-white"
                            )}
                            style={{
                                textShadow: isComplete
                                    ? '0 0 20px rgba(57,255,20,0.3)'
                                    : '0 0 30px rgba(0,240,255,0.2)'
                            }}
                        >
                            {focus}
                        </motion.div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-4">
                            <motion.button
                                onClick={() => setIsComplete(!isComplete)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={cn(
                                    "px-8 py-4 rounded-lg border transition-all duration-300 font-display text-[11px] tracking-[0.2em] font-bold uppercase flex items-center gap-3",
                                    isComplete
                                        ? "bg-neon-lime/10 border-neon-lime/40 text-neon-lime shadow-[0_0_30px_rgba(57,255,20,0.2),inset_0_0_20px_rgba(57,255,20,0.1)]"
                                        : "bg-black/40 border-neon-cyan/20 text-neon-cyan hover:border-neon-cyan/40 hover:bg-neon-cyan/5 hover:shadow-[0_0_20px_rgba(0,240,255,0.2)]"
                                )}
                            >
                                {isComplete ? (
                                    <CheckCircle2 className="w-5 h-5" style={{ filter: 'drop-shadow(0 0 8px #39ff14)' }} />
                                ) : (
                                    <Circle className="w-5 h-5" />
                                )}
                                {isComplete ? 'Mission Complete' : 'Complete Mission'}
                            </motion.button>

                            <motion.button
                                onClick={handleReset}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-4 rounded-lg border border-white/5 bg-black/30 text-white/20 hover:text-neon-magenta hover:bg-neon-magenta/5 hover:border-neon-magenta/30 hover:shadow-[0_0_20px_rgba(255,0,170,0.2)] transition-all duration-300"
                                title="Abort Mission"
                            >
                                <X className="w-5 h-5" />
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bottom Data Stream */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4">
                <div className="w-16 h-px bg-gradient-to-r from-transparent to-neon-cyan/20" />
                <span className="font-mono-tech text-[8px] text-white/10 uppercase tracking-[0.3em]">
                    Neural Link Active
                </span>
                <div className="w-16 h-px bg-gradient-to-l from-transparent to-neon-cyan/20" />
            </div>
        </motion.div>
    )
}
