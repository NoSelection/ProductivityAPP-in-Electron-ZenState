import React, { useState, useRef, useEffect } from 'react'
import ReactPlayer from 'react-player'
import { motion } from 'framer-motion'
import { Play, Pause, SkipForward, Volume2, CloudRain, TreePine, Rocket, Wind } from 'lucide-react'
import { cn } from '../lib/utils'
import { audioService } from '../lib/audioService'
import { AudioVisualizer } from './AudioVisualizer'

const AMBIENT_PRESETS = [
    { id: 'rain', name: 'Rainfall', sub: 'City', icon: CloudRain },
    { id: 'forest', name: 'Forest', sub: 'Nature', icon: TreePine },
    { id: 'deep-space', name: 'Void', sub: 'Deep', icon: Rocket },
    { id: 'white-noise', name: 'Focus', sub: 'Noise', icon: Wind }
]

const STREAM_PRESETS = [
    { name: 'Lofi Girl', sub: 'Study', url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk' },
    { name: 'Synthwave', sub: 'Chill', url: 'https://www.youtube.com/watch?v=4xDzrJKXOOY' }
]

export const MediaDeck: React.FC = () => {
    const [mode, setMode] = useState<'ambient' | 'stream'>('ambient')
    const [playing, setPlaying] = useState(false)
    const [volume, setVolume] = useState(0.5)
    const [currentAmbient, setCurrentAmbient] = useState(0)
    const [currentStream, setCurrentStream] = useState(0)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const playerRef = useRef<any>(null)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Player = ReactPlayer as any

    useEffect(() => {
        audioService.setVolume(volume)
    }, [volume])

    const activeName = mode === 'ambient'
        ? AMBIENT_PRESETS[currentAmbient].name
        : STREAM_PRESETS[currentStream].name

    const activeSub = mode === 'ambient'
        ? AMBIENT_PRESETS[currentAmbient].sub
        : STREAM_PRESETS[currentStream].sub

    const togglePlay = () => {
        const nextState = !playing
        setPlaying(nextState)

        if (mode === 'ambient') {
            if (nextState) audioService.play(AMBIENT_PRESETS[currentAmbient].id)
            else audioService.pause()
        }
    }

    const cycleContent = () => {
        if (mode === 'ambient') {
            const next = (currentAmbient + 1) % AMBIENT_PRESETS.length
            setCurrentAmbient(next)
            if (playing) audioService.play(AMBIENT_PRESETS[next].id)
        } else {
            const next = (currentStream + 1) % STREAM_PRESETS.length
            setCurrentStream(next)
            setPlaying(true)
        }
    }

    return (
        <div className="w-full aspect-square md:aspect-[4/5] flex flex-col justify-between relative overflow-hidden">

            {/* Visualizer Background */}
            <div className="absolute inset-0 z-0 opacity-30 pointer-events-none mix-blend-plus-lighter">
                <AudioVisualizer isPlaying={playing} intensity={0.6} />
            </div>

            {/* Hidden Player */}
            {mode === 'stream' && (
                <div className="hidden">
                    <Player
                        ref={playerRef}
                        url={STREAM_PRESETS[currentStream].url}
                        playing={playing}
                        volume={volume}
                    />
                </div>
            )}

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between p-2">
                <div className="flex items-center gap-2">
                    <div className={cn("w-1.5 h-1.5 rounded-full transition-colors", playing ? "bg-white shadow-[0_0_10px_white]" : "bg-white/20")} />
                    <span className="text-tech text-[10px] tracking-widest text-white/40 uppercase">
                        {mode}
                    </span>
                </div>
                <button
                    onClick={() => setMode(mode === 'ambient' ? 'stream' : 'ambient')}
                    className="text-tech text-[10px] text-white/40 hover:text-white transition-colors uppercase tracking-widest"
                >
                    Switch
                </button>
            </div>

            {/* Core Display */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center gap-8">

                {/* Icon Circle */}
                <div className="relative group cursor-pointer" onClick={togglePlay}>
                    <motion.div
                        animate={playing ? { rotate: 360 } : { rotate: 0 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="absolute -inset-4 border border-dashed border-white/10 rounded-full"
                    />

                    <div className={cn(
                        "w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500",
                        playing ? "bg-white/10 backdrop-blur-md shadow-[0_0_30px_rgba(255,255,255,0.1)]" : "bg-white/5"
                    )}>
                        {mode === 'ambient' ? (
                            React.createElement(AMBIENT_PRESETS[currentAmbient].icon, {
                                className: "w-8 h-8 text-white/80",
                                strokeWidth: 1
                            })
                        ) : (
                            <Wind className="w-8 h-8 text-white/80" strokeWidth={1} />
                        )}
                    </div>
                </div>

                {/* Info */}
                <div className="text-center space-y-1">
                    <h2 className="text-display text-2xl text-white/90 font-light tracking-wide">
                        {activeName}
                    </h2>
                    <p className="text-serif text-sm text-white/40 italic">
                        {activeSub}
                    </p>
                </div>

            </div>

            {/* Controls */}
            <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-center gap-8">
                    <button
                        onClick={togglePlay}
                        className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 hover:border-white/30 transition-all group"
                    >
                        {playing
                            ? <Pause className="w-5 h-5 text-white/80 fill-current" />
                            : <Play className="w-5 h-5 text-white/80 fill-current ml-1" />
                        }
                    </button>

                    <button
                        onClick={cycleContent}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white/30 hover:text-white transition-all"
                    >
                        <SkipForward className="w-5 h-5" />
                    </button>
                </div>

                {/* Volume */}
                <div className="flex items-center gap-4 px-8 pb-4 opacity-0 hover:opacity-100 transition-opacity duration-500">
                    <Volume2 className="w-3 h-3 text-white/30" />
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                    />
                </div>
            </div>
        </div>
    )
}
