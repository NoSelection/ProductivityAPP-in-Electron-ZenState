import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, RotateCcw } from 'lucide-react'
import { useNeuralStorage } from '../hooks/useNeuralStorage'
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
    }, [])

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
        <div className="h-full w-full flex flex-col justify-center items-center relative overflow-hidden bg-transparent">

            {/* Minimal Label */}
            <div className="absolute top-10 flex flex-col items-center gap-2 z-10">
                <span className="text-tech text-[10px] tracking-[0.4em] text-white/40 uppercase">
                    Session Status
                </span>
                <div className={`w-1 h-1 rounded-full ${isActive ? 'bg-white animate-pulse' : 'bg-white/20'}`} />
            </div>

            {/* Main Artifact Ring */}
            <div className="relative w-80 h-80 flex items-center justify-center">

                {/* Ambient Backlight */}
                <div className={`absolute inset-0 rounded-full blur-[80px] transition-opacity duration-1000 ${isActive ? 'bg-white/10 opacity-100' : 'opacity-0'}`} />

                {/* Orbiting Ring */}
                <motion.div
                    className="absolute inset-[10px] border border-white/5 rounded-full"
                    animate={isActive ? { rotate: 360 } : { rotate: 0 }}
                    transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                />

                {/* SVG Circle Progress */}
                <svg className="w-full h-full transform -rotate-90 pointer-events-none" viewBox="0 0 200 200">
                    {/* Track */}
                    <circle cx="100" cy="100" r="88" stroke="rgba(255,255,255,0.02)" strokeWidth="1" fill="transparent" />

                    {/* Progress */}
                    <circle
                        cx="100"
                        cy="100"
                        r="88"
                        stroke="white"
                        strokeWidth="1.5"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className="opacity-80 transition-[stroke-dashoffset] duration-300 ease-linear shadow-[0_0_15px_white]"
                    />
                </svg>

                {/* Center Time */}
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                    <span className="text-display text-7xl font-extralight text-white tracking-tighter">
                        {formatTime(timeLeft)}
                    </span>
                    <span className="text-serif text-sm text-white/30 italic mt-2">
                        {isActive ? 'focusing' : 'ready'}
                    </span>
                </div>
            </div>

            {/* Controls */}
            <div className="absolute bottom-12 flex gap-8 z-10">
                <button
                    onClick={() => setIsActive(!isActive)}
                    className="w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-md border border-white/10 hover:bg-white/5 hover:border-white/30 transition-all group"
                >
                    {isActive
                        ? <Pause className="w-5 h-5 text-white/80 fill-current" />
                        : <Play className="w-5 h-5 text-white/80 fill-current ml-1" />
                    }
                </button>

                <button
                    onClick={resetTimer}
                    className="w-10 h-10 rounded-full flex items-center justify-center border border-transparent hover:border-white/10 text-white/20 hover:text-white mt-2 transition-all"
                >
                    <RotateCcw className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}