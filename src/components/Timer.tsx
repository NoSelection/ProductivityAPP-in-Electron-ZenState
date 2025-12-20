import React, { useState, useEffect } from 'react'
import { Play, Pause, RotateCcw, Activity } from 'lucide-react'
import { useNeuralStorage } from '../hooks/useNeuralStorage'

export const Timer: React.FC = () => {
    const [timeLeft, setTimeLeft] = useState(25 * 60)
    const [isActive, setIsActive] = useState(false)
    const [, setTotalFocus] = useNeuralStorage('zen-focus-total', 0)
    const [, setPomodoros] = useNeuralStorage('zen-pomodoros', 0)

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
        setTimeLeft(25 * 60)
    }

    const percentage = ((25 * 60 - timeLeft) / (25 * 60)) * 100
    const strokeDasharray = 283
    const strokeDashoffset = strokeDasharray - (strokeDasharray * percentage) / 100

    return (
        <div className="Timer h-full w-full flex flex-col justify-center items-center group relative overflow-hidden glass-pane min-h-0">
            {/* Header */}
            <div className="absolute top-6 left-6 lg:top-8 lg:left-8 flex items-center gap-3 z-10">
                <Activity className="w-4 h-4 text-accent-base/60" />
                <h2 className="text-white/40 text-[9px] font-black tracking-[0.5em] uppercase font-mono-tech">
                    CHRONO // {isActive ? 'ACTIVE' : 'STANDBY'}
                </h2>
            </div>

            {/* Content Container */}
            <div className="flex-1 w-full flex flex-col items-center justify-center relative p-6 lg:p-10">
                <div className="relative w-full max-w-[200px] lg:max-w-[240px] aspect-square flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 224 224">
                        <circle
                            cx="112"
                            cy="112"
                            r="100"
                            stroke="hsla(var(--accent-base), 0.05)"
                            strokeWidth="1"
                            fill="transparent"
                        />
                        <circle
                            cx="112"
                            cy="112"
                            r="100"
                            stroke="hsla(var(--accent-base), 0.5)"
                            strokeWidth="3"
                            fill="transparent"
                            strokeDasharray={strokeDasharray}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-linear"
                        />
                    </svg>

                    <div className="absolute flex flex-col items-center">
                        <div className="text-4xl lg:text-5xl font-mono-tech font-light tracking-tighter text-white text-glow-accent">
                            {formatTime(timeLeft)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex gap-4 pb-6 lg:pb-10 shrink-0 z-10">
                <button
                    onClick={() => setIsActive(!isActive)}
                    className="w-12 h-12 lg:w-14 lg:h-14 flex items-center justify-center rounded-xl bg-white/[0.03] border border-white/10 text-accent-base hover:bg-accent-base hover:text-black transition-all"
                >
                    {isActive ? <Pause className="w-5 h-5 lg:w-6 lg:h-6 fill-current" /> : <Play className="w-5 h-5 lg:w-6 lg:h-6 fill-current ml-0.5 group-hover/btn:scale-110 transition-transform" />}
                </button>
                <button
                    onClick={resetTimer}
                    className="w-12 h-12 lg:w-14 lg:h-14 flex items-center justify-center rounded-xl bg-white/[0.03] border border-white/10 text-white/30 hover:text-white hover:bg-white/10 transition-all"
                >
                    <RotateCcw className="w-4 h-4 lg:w-5 lg:h-5 group-hover:rotate-180 transition-transform duration-700" />
                </button>
            </div>

            <div className="absolute bottom-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[8px] font-mono-tech text-white/10 uppercase tracking-[0.4em]">Temporal Link Sync</span>
            </div>
        </div>
    )
}
