import React, { useState, useEffect } from 'react'
import { Play, Pause, RotateCcw } from 'lucide-react'
import { cn } from '../lib/utils'

export const Timer: React.FC = () => {
    const [timeLeft, setTimeLeft] = useState(25 * 60)
    const [isActive, setIsActive] = useState(false)

    useEffect(() => {
        let timer: any
        if (isActive && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1)
            }, 1000)
        } else if (timeLeft === 0) {
            setIsActive(false)
        }
        return () => clearInterval(timer)
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
            "cyber-glass h-full w-full p-8 flex flex-col justify-center items-center rounded-3xl group relative overflow-hidden"
        )}>
            {/* Catch-light accent */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <h2 className="text-slate-500 text-[9px] font-bold tracking-[0.3em] uppercase mb-10 font-mono-tech">
                System // {isActive ? 'Running' : 'Idle'}
            </h2>

            <div className="relative flex items-center justify-center">
                {/* SVG Ring with Neon Juice */}
                <svg className="w-56 h-56 transform -rotate-90 drop-shadow-[0_0_12px_rgba(122,162,247,0.3)]">
                    <circle
                        cx="112"
                        cy="112"
                        r="90"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="transparent"
                        className="text-white/[0.03]"
                    />
                    <circle
                        cx="112"
                        cy="112"
                        r="90"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="transparent"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className="text-primary transition-all duration-1000 ease-linear shadow-primary"
                    />
                </svg>

                {/* Tech Typography */}
                <div className="absolute flex flex-col items-center">
                    <div className="text-6xl font-extralight text-slate-100 font-mono-tech tracking-tighter">
                        {formatTime(timeLeft)}
                    </div>
                </div>
            </div>

            <div className="flex gap-8 mt-10">
                <button
                    onClick={() => setIsActive(!isActive)}
                    className="p-4 rounded-xl bg-white/[0.03] border border-white/5 text-primary hover:bg-primary/20 hover:border-primary/50 transition-all hover:shadow-[0_0_20px_rgba(122,162,247,0.2)]"
                >
                    {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-primary" />}
                </button>
                <button
                    onClick={resetTimer}
                    className="p-4 rounded-xl bg-white/[0.03] border border-white/5 text-slate-600 hover:text-slate-200 hover:bg-white/10 transition-all"
                >
                    <RotateCcw className="w-5 h-5" />
                </button>
            </div>
        </div>
    )
}
