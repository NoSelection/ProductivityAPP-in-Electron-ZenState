import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, RotateCcw, Clock, Zap } from 'lucide-react'
import { useNeuralStorage } from '../hooks/useNeuralStorage'
import { cn } from '../lib/utils'
import { settingsService } from '../lib/settingsService'

export const Timer: React.FC = () => {
    const [focusDuration, setFocusDuration] = useState(25)
    const [timeLeft, setTimeLeft] = useState(25 * 60)
    const [isActive, setIsActive] = useState(false)
    const [, setTotalFocus] = useNeuralStorage('zen-focus-total', 0)
    const [, setPomodoros] = useNeuralStorage('zen-pomodoros', 0)

    useEffect(() => {
        const loadSettings = async () => {
            const settings = await settingsService.getAll()
            if (settings.timer?.focusDuration) {
                const duration = settings.timer.focusDuration
                setFocusDuration(duration)
                if (!isActive) {
                    setTimeLeft(duration * 60)
                }
            }
        }
        loadSettings()
    }, []) // Run once on mount

    useEffect(() => {
        let timer: ReturnType<typeof setInterval> | undefined
        if (isActive && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1)
                setTotalFocus((prev: number) => prev + 1)
            }, 1000)
        } else if (timeLeft === 0) {
            setIsActive(false)
            setPomodoros((prev: number) => prev + 1)
        }
        return () => {
            if (timer) clearInterval(timer)
        }
    }, [isActive, timeLeft, setTotalFocus, setPomodoros])

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    const resetTimer = () => {
        setIsActive(false)
        setTimeLeft(focusDuration * 60)
    }

    const percentage = ((focusDuration * 60 - timeLeft) / (focusDuration * 60)) * 100
    const circumference = 2 * Math.PI * 88
    const strokeDashoffset = circumference - (circumference * percentage) / 100

    return (
        <div className="Timer h-full w-full flex flex-col justify-center items-center group relative overflow-hidden hyper-panel min-h-0">
            {/* Background Effects */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,0,170,0.05),transparent_60%)]" />
                {isActive && (
                    <motion.div
                        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,240,255,0.08),transparent_50%)]"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                )}
            </div>

            {/* Header */}
            <div className="absolute top-5 left-5 lg:top-6 lg:left-6 flex items-center gap-3 z-10">
                <div className="relative">
                    <Clock className="w-5 h-5 text-neon-magenta" style={{ filter: 'drop-shadow(0 0 8px #ff00aa)' }} />
                </div>
                <div className="flex flex-col">
                    <span className="font-display text-[10px] lg:text-xs font-bold tracking-[0.3em] text-neon-magenta uppercase">
                        CHRONO
                    </span>
                    <span className="font-mono-tech text-[8px] text-white/20 uppercase tracking-widest">
                        {isActive ? 'Counting Down' : 'Ready'}
                    </span>
                </div>
            </div>

            {/* Status */}
            <div className="absolute top-5 right-5 lg:top-6 lg:right-6 flex items-center gap-2">
                <div className={cn(
                    "w-2 h-2 rounded-full transition-all duration-300",
                    isActive
                        ? "bg-neon-cyan animate-pulse shadow-[0_0_10px_#00f0ff,0_0_20px_#00f0ff]"
                        : "bg-neon-magenta/30"
                )} />
                <span className="font-mono-tech text-[9px] text-white/30 uppercase tracking-wider">
                    {isActive ? 'ACTIVE' : 'STANDBY'}
                </span>
            </div>

            {/* Timer Circle */}
            <div className="flex-1 w-full flex flex-col items-center justify-center relative p-6 lg:p-10">
                <div className="relative w-full max-w-[200px] lg:max-w-[240px] aspect-square flex items-center justify-center">
                    {/* Outer Glow Ring */}
                    <motion.div
                        className="absolute inset-[-10px] rounded-full"
                        animate={isActive ? {
                            boxShadow: [
                                '0 0 20px rgba(0,240,255,0.1), inset 0 0 20px rgba(0,240,255,0.05)',
                                '0 0 40px rgba(0,240,255,0.2), inset 0 0 30px rgba(0,240,255,0.1)',
                                '0 0 20px rgba(0,240,255,0.1), inset 0 0 20px rgba(0,240,255,0.05)',
                            ]
                        } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                    />

                    {/* SVG Circle */}
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                        {/* Background Track */}
                        <circle
                            cx="100"
                            cy="100"
                            r="88"
                            stroke="rgba(255,0,170,0.1)"
                            strokeWidth="2"
                            fill="transparent"
                        />
                        {/* Dotted inner circle */}
                        <circle
                            cx="100"
                            cy="100"
                            r="78"
                            stroke="rgba(0,240,255,0.05)"
                            strokeWidth="1"
                            strokeDasharray="4 8"
                            fill="transparent"
                        />
                        {/* Progress Ring */}
                        <motion.circle
                            cx="100"
                            cy="100"
                            r="88"
                            stroke="url(#timerGradient)"
                            strokeWidth="4"
                            fill="transparent"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            style={{
                                filter: 'drop-shadow(0 0 10px #00f0ff) drop-shadow(0 0 20px #00f0ff)',
                            }}
                            transition={{ duration: 0.5, ease: 'linear' }}
                        />
                        {/* Gradient Definition */}
                        <defs>
                            <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#00f0ff" />
                                <stop offset="50%" stopColor="#bf00ff" />
                                <stop offset="100%" stopColor="#ff00aa" />
                            </linearGradient>
                        </defs>
                    </svg>

                    {/* Center Content */}
                    <div className="absolute flex flex-col items-center gap-2">
                        <motion.div
                            className="font-mono-tech text-4xl lg:text-5xl xl:text-6xl font-light tracking-wider"
                            style={{
                                color: isActive ? '#00f0ff' : '#e0e0ff',
                                textShadow: isActive
                                    ? '0 0 20px #00f0ff, 0 0 40px #00f0ff'
                                    : '0 0 10px rgba(0,240,255,0.3)'
                            }}
                            animate={isActive ? { opacity: [1, 0.8, 1] } : {}}
                            transition={{ duration: 1, repeat: Infinity }}
                        >
                            {formatTime(timeLeft)}
                        </motion.div>
                        <span className="font-mono-tech text-[9px] text-white/20 uppercase tracking-[0.3em]">
                            {Math.round(percentage)}% Complete
                        </span>
                    </div>

                    {/* Spinning Accent Ring */}
                    {isActive && (
                        <motion.div
                            className="absolute inset-[-4px] rounded-full border border-neon-cyan/20"
                            style={{ borderStyle: 'dashed', borderWidth: '1px' }}
                            animate={{ rotate: 360 }}
                            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                        />
                    )}
                </div>
            </div>

            {/* Controls */}
            <div className="flex gap-4 pb-6 lg:pb-8 shrink-0 z-10">
                <motion.button
                    onClick={() => setIsActive(!isActive)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                        "w-14 h-14 lg:w-16 lg:h-16 flex items-center justify-center rounded-xl border transition-all duration-300",
                        isActive
                            ? "bg-neon-cyan/10 border-neon-cyan/40 text-neon-cyan shadow-[0_0_30px_rgba(0,240,255,0.3),inset_0_0_20px_rgba(0,240,255,0.1)]"
                            : "bg-black/40 border-neon-magenta/20 text-neon-magenta hover:border-neon-magenta/40 hover:bg-neon-magenta/5 hover:shadow-[0_0_20px_rgba(255,0,170,0.2)]"
                    )}
                >
                    {isActive ? (
                        <Pause className="w-6 h-6 lg:w-7 lg:h-7 fill-current" style={{ filter: 'drop-shadow(0 0 8px #00f0ff)' }} />
                    ) : (
                        <Play className="w-6 h-6 lg:w-7 lg:h-7 fill-current ml-1" />
                    )}
                </motion.button>

                <motion.button
                    onClick={resetTimer}
                    whileHover={{ scale: 1.05, rotate: -180 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="w-14 h-14 lg:w-16 lg:h-16 flex items-center justify-center rounded-xl bg-black/40 border border-white/10 text-white/30 hover:text-white hover:border-white/20 hover:bg-white/5 transition-colors"
                >
                    <RotateCcw className="w-5 h-5 lg:w-6 lg:h-6" />
                </motion.button>
            </div>

            {/* Bottom Status */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-center gap-2">
                    <Zap className="w-3 h-3 text-neon-cyan/30" />
                    <span className="font-mono-tech text-[8px] text-white/10 uppercase tracking-[0.3em]">
                        Temporal Sync Active
                    </span>
                </div>
            </div>
        </div>
    )
}
