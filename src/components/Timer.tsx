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
    const [, setTimerActive] = useNeuralStorage('zen-timer-active', false)

    useEffect(() => {
        setTimerActive(isActive)
    }, [isActive, setTimerActive])

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
        <div className="Timer h-full w-full flex flex-col justify-center items-center group relative overflow-hidden min-h-0 bg-[#0a0a0f] border-0 backdrop-blur-3xl"
            style={{ clipPath: 'circle(120% at 50% 120%)' }} // Subtle organic curve at bottom
        >
            {/* Header Badge */}
            <div className="absolute top-8 left-8 flex items-center gap-3 z-10">
                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span className="font-display text-xs font-bold tracking-[0.3em] text-white/60 uppercase">
                    CHRONOMETRY
                </span>
            </div>

            {/* Main Artifact Ring */}
            <div className="flex-1 w-full flex flex-col items-center justify-center relative p-10">
                <div className="relative w-72 h-72 flex items-center justify-center">

                    {/* Background Surreal Glow */}
                    <div className="absolute inset-0 bg-gradient-radial from-white/10 to-transparent opacity-50 blur-3xl animate-pulse" />

                    {/* Orbiting Artifact Parts */}
                    <motion.div
                        className="absolute inset-0 border border-white/10 rounded-full"
                        animate={{ rotate: 360, scale: [1, 1.05, 1] }}
                        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    />
                    <motion.div
                        className="absolute inset-[20px] border border-white/20 rounded-full"
                        style={{ borderStyle: 'dotted' }}
                        animate={{ rotate: -360 }}
                        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
                    />

                    {/* SVG Circle (Gold/Prismatic) */}
                    <svg className="w-full h-full transform -rotate-90 drop-shadow-prism-glow" viewBox="0 0 200 200">
                        {/* Track */}
                        <circle cx="100" cy="100" r="80" stroke="rgba(255,255,255,0.05)" strokeWidth="1" fill="transparent" />

                        {/* Progress */}
                        <motion.circle
                            cx="100"
                            cy="100"
                            r="80"
                            stroke="url(#prismaticFlux)"
                            strokeWidth="3"
                            fill="transparent"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            transition={{ duration: 0.5, ease: 'linear' }}
                        />
                        <defs>
                            <linearGradient id="prismaticFlux" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="var(--prismatic-1)" />
                                <stop offset="50%" stopColor="var(--prismatic-2)" />
                                <stop offset="100%" stopColor="var(--prismatic-3)" />
                            </linearGradient>
                        </defs>
                    </svg>

                    {/* Center Time (Surreal Serif) */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                        <span className="font-serif text-6xl text-white drop-shadow-2xl mix-blend-overlay">
                            {formatTime(timeLeft)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Controls (Floating Orbs) */}
            <div className="flex gap-8 pb-12 z-10">
                <motion.button
                    onClick={() => setIsActive(!isActive)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={cn(
                        "w-16 h-16 rounded-full flex items-center justify-center backdrop-blur-md transition-all",
                        isActive
                            ? "bg-white/10 shadow-[0_0_30px_rgba(125,249,255,0.2)]"
                            : "bg-white/5 hover:bg-white/10"
                    )}
                >
                    {isActive ? <Pause className="w-5 h-5 fill-white text-white opacity-80" /> : <Play className="w-5 h-5 fill-white text-white ml-1 opacity-80" />}
                </motion.button>

                <motion.button
                    onClick={resetTimer}
                    whileHover={{ scale: 1.1, rotate: -90 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-12 h-12 rounded-full flex items-center justify-center border border-white/5 hover:bg-white/5 transition-all text-white/40 hover:text-white"
                >
                    <RotateCcw className="w-4 h-4" />
                </motion.button>
            </div>
        </div>
    )
}