import React, { useState, useEffect } from 'react'
import { Play, Pause, RotateCcw, Activity } from 'lucide-react'
import { cn } from '../lib/utils'

export const Timer: React.FC = () => {
    const [timeLeft, setTimeLeft] = useState(25 * 60)
    const [isActive, setIsActive] = useState(false)

    useEffect(() => {
        let timer: ReturnType<typeof setInterval> | undefined
        if (isActive && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1)
            }, 1000)
        } else if (timeLeft === 0) {
            setIsActive(false)
        }
        return () => {
            if (timer) clearInterval(timer)
        }
    }, [isActive, timeLeft])

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
        <div className={cn(
            "glass-pane h-full w-full flex flex-col justify-center items-center group relative overflow-hidden min-h-[45vh] lg:min-h-0"
        )}>
            {/* Header */}
            <div className="absolute top-[3vh] left-[3vh] flex items-center gap-3 z-10">
                <Activity className="w-3.5 h-3.5 text-accent-base/60" />
                <h2 className="text-white/40 text-[9px] font-black tracking-[0.5em] uppercase font-mono-tech">
                    CHRONO // {isActive ? 'ACTIVE' : 'STANDBY'}
                </h2>
            </div>

            {/* Content Container - Flex 1 to Consume Space */}
            <div className="flex-1 min-h-0 w-full flex flex-col items-center justify-center relative p-[4vh]">
                <div className="w-full h-full max-h-[35vh] aspect-square relative flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 224 224">
                        <circle
                            cx="112"
                            cy="112"
                            r="95"
                            stroke="hsla(var(--accent-base), 0.1)"
                            strokeWidth="1"
                            fill="transparent"
                        />
                        <circle
                            cx="112"
                            cy="112"
                            r="95"
                            stroke="hsla(var(--accent-base), 0.5)"
                            strokeWidth="2"
                            fill="transparent"
                            strokeDasharray={strokeDasharray}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-linear"
                        />
                    </svg>

                    <div className="absolute flex flex-col items-center">
                        <div className="text-[5vh] font-mono-tech font-light tracking-tighter text-white text-glow-accent">
                            {formatTime(timeLeft)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer / Controls - Pushed to bottom with explicit spacing */}
            <div className="flex gap-[3vh] pb-[4vh] shrink-0 z-10">
                <button
                    onClick={() => setIsActive(!isActive)}
                    className="w-[8vh] h-[8vh] max-w-[80px] max-h-[80px] flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-accent-base hover:bg-accent-base hover:text-white transition-all duration-500 shadow-sm"
                >
                    {isActive ? <Pause className="w-[3vh] h-[3vh] fill-current" /> : <Play className="w-[3vh] h-[3vh] fill-current ml-1" />}
                </button>
                <button
                    onClick={resetTimer}
                    className="w-[8vh] h-[8vh] max-w-[80px] max-h-[80px] flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/30 hover:text-white hover:bg-white/10 transition-all duration-500 shadow-sm"
                >
                    <RotateCcw className="w-[2.5vh] h-[2.5vh]" />
                </button>
            </div>
        </div>
    )
}
