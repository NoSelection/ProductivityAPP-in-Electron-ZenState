import React, { useState, useRef, useEffect } from 'react'
import ReactPlayer from 'react-player'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, SkipForward, Volume2, Radio, Link, Eye, CloudRain, TreePine, Rocket, Wind, Music } from 'lucide-react'
import { cn } from '../lib/utils'
import { audioService } from '../lib/audioService'
import { AudioVisualizer } from './AudioVisualizer'
import { useNeuralStorage } from '../hooks/useNeuralStorage'

const AMBIENT_PRESETS = [
    { id: 'rain', name: 'Rainfall', sub: 'Muted raindrops // City', icon: CloudRain },
    { id: 'forest', name: 'Pine Forest', sub: 'Whispering leaves // Birds', icon: TreePine },
    { id: 'deep-space', name: 'Deep Space', sub: 'Low drone // Void', icon: Rocket },
    { id: 'white-noise', name: 'Neural Hum', sub: 'Static // Pure focus', icon: Wind }
]

const STREAM_PRESETS = [
    { name: 'Lofi Girl', sub: 'Beats to study // relax', url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk' },
    { name: 'Synthwave Radio', sub: 'Neon nights // Cyberpunk', url: 'https://www.youtube.com/watch?v=4xDzrJKXOOY' }
]

export const MediaDeck: React.FC = () => {
    const [mode, setMode] = useState<'ambient' | 'stream'>('ambient')
    const [playing, setPlaying] = useState(false)
    const [volume, setVolume] = useState(0.5)
    const [currentAmbient, setCurrentAmbient] = useState(0)
    const [currentStream, setCurrentStream] = useState(0)
    const [customUrl, setCustomUrl] = useState('')
    const [holoMode, setHoloMode] = useState(false)
    const [timerActive] = useNeuralStorage('zen-timer-active', false)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const playerRef = useRef<any>(null)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Player = ReactPlayer as any

    useEffect(() => {
        audioService.setVolume(volume)
    }, [volume])

    const activeName = mode === 'ambient'
        ? AMBIENT_PRESETS[currentAmbient].name
        : (customUrl ? 'Custom Signal' : STREAM_PRESETS[currentStream].name)

    const activeSub = mode === 'ambient'
        ? AMBIENT_PRESETS[currentAmbient].sub
        : (customUrl ? 'External Stream' : STREAM_PRESETS[currentStream].sub)

    const togglePlay = () => {
        const nextState = !playing
        setPlaying(nextState)

        if (mode === 'ambient') {
            if (nextState) {
                audioService.play(AMBIENT_PRESETS[currentAmbient].id)
            } else {
                audioService.pause()
            }
        }
    }

    const cycleContent = () => {
        if (mode === 'ambient') {
            const next = (currentAmbient + 1) % AMBIENT_PRESETS.length
            setCurrentAmbient(next)
            if (playing) audioService.play(AMBIENT_PRESETS[next].id)
        } else {
            setCustomUrl('')
            const next = (currentStream + 1) % STREAM_PRESETS.length
            setCurrentStream(next)
            setPlaying(true)
        }
    }

    return (
        <div className={cn(
            "MediaDeck relative w-full aspect-[3/4] max-h-[600px] flex flex-col justify-between bg-[#0a0a0f]/90 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden transition-all duration-700",
            holoMode && "shadow-[0_0_50px_rgba(var(--prismatic-2-rgb),0.15)]"
        )}>
            {/* Prismatic Border Highlight */}
            <div className="absolute inset-0 p-[1px] rounded-3xl pointer-events-none z-30 opacity-50">
                <div className="absolute inset-0 bg-gradient-to-b from-[var(--prismatic-2)]/30 via-transparent to-[var(--prismatic-2)]/10" />
            </div>

            {/* Audio Visualizer Overlay (Background) */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-40 mix-blend-screen">
                <AudioVisualizer isPlaying={playing} intensity={timerActive ? 1.0 : 0.4} />
            </div>

            {/* Hidden Player for Streams */}
            {mode === 'stream' && (
                <div className={cn(
                    "absolute inset-0 z-0 transition-opacity duration-1000",
                    holoMode ? "opacity-100" : "opacity-0 pointer-events-none"
                )}>
                    <Player
                        ref={playerRef}
                        url={customUrl || STREAM_PRESETS[currentStream].url}
                        playing={playing}
                        volume={volume}
                        width="100%"
                        height="100%"
                        controls={false}
                        style={{ opacity: holoMode ? 0.3 : 0, filter: 'grayscale(0.5) contrast(1.3) hue-rotate(180deg)' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />
                </div>
            )}

            {/* Background Effect */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute top-0 right-0 w-full h-[300px] bg-gradient-to-b from-[rgba(var(--prismatic-2-rgb),0.1)] to-transparent" />
            </div>

            {/* Header / Mode Switch */}
            <div className="flex-none p-6 flex items-start justify-between relative z-20">
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "w-2 h-2 rounded-full",
                        playing ? "bg-[var(--prismatic-2)] shadow-[0_0_10px_var(--prismatic-2)]" : "bg-white/20"
                    )} />
                    <span className="font-mono-tech text-[9px] tracking-[0.2em] text-white/40 uppercase">
                        {mode === 'ambient' ? 'ENV // SIM' : 'NET // STRM'}
                    </span>
                </div>

                <motion.button
                    onClick={() => setMode(mode === 'ambient' ? 'stream' : 'ambient')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                        "px-3 py-1.5 rounded-full border text-[10px] font-mono-tech tracking-wider uppercase transition-all",
                        mode === 'stream'
                            ? "border-[var(--prismatic-1)] text-[var(--prismatic-1)] bg-[var(--prismatic-1)]/10"
                            : "border-white/10 text-white/40 hover:text-white"
                    )}
                >
                    SWITCH INPUT
                </motion.button>
            </div>

            {/* Central Visualizer (The Core) */}
            <div className="flex-1 flex flex-col items-center justify-center relative z-20">
                <div className="relative w-48 h-48 lg:w-56 lg:h-56 flex items-center justify-center">
                    {/* Spinning Rings */}
                    <motion.div
                        animate={playing ? { rotate: 360 } : { rotate: 0 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border border-dashed border-[var(--prismatic-2)]/20 rounded-full"
                    />
                    <motion.div
                        animate={playing ? { rotate: -360 } : { rotate: 0 }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-4 border border-[var(--prismatic-2)]/10 rounded-full"
                    />

                    {/* Core Glow */}
                    <div className={cn(
                        "w-32 h-32 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-700 border",
                        playing
                            ? "bg-[var(--prismatic-2)]/10 border-[var(--prismatic-2)]/40 shadow-[0_0_60px_rgba(var(--prismatic-2-rgb),0.2)]"
                            : "bg-white/5 border-white/5"
                    )}>
                        {mode === 'ambient' ? (
                            React.createElement(AMBIENT_PRESETS[currentAmbient].icon, {
                                className: "w-12 h-12 text-[var(--prismatic-2)] transition-all duration-500",
                                style: { filter: playing ? 'drop-shadow(0 0 20px var(--prismatic-2))' : 'none' }
                            })
                        ) : (
                            <Radio className="w-12 h-12 text-[var(--prismatic-2)]" />
                        )}
                    </div>
                </div>

                {/* Track Title */}
                <div className="text-center mt-8 space-y-2">
                    <h2 className="font-display text-3xl font-bold text-white tracking-widest uppercase glow-text">
                        {activeName}
                    </h2>
                    <p className="font-mono-tech text-[10px] text-[var(--prismatic-2)] uppercase tracking-[0.4em] opacity-80">
                        {activeSub}
                    </p>
                </div>
            </div>

            {/* Controls Footer */}
            <div className="flex-none p-6 lg:p-8 space-y-6 relative z-20 bg-gradient-to-t from-black/80 to-transparent">
                {/* Playback Controls */}
                <div className="flex items-center justify-center gap-8">
                    {/* Play/Pause Main Button */}
                    <motion.button
                        onClick={togglePlay}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className={cn(
                            "w-16 h-16 rounded-full flex items-center justify-center border transition-all duration-300",
                            playing
                                ? "border-[var(--prismatic-2)] bg-[var(--prismatic-2)] text-black shadow-[0_0_30px_rgba(var(--prismatic-2-rgb),0.4)]"
                                : "border-white/20 bg-white/5 text-white hoer:bg-white/10"
                        )}
                    >
                        {playing ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
                    </motion.button>

                    {/* Skip Button */}
                    <motion.button
                        onClick={cycleContent}
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-3 rounded-full text-white/30 hover:text-white border border-transparent hover:border-white/20 transition-all"
                    >
                        <SkipForward className="w-6 h-6" />
                    </motion.button>
                </div>

                {/* Volume Slider */}
                <div className="flex items-center gap-4 px-4">
                    <Volume2 className="w-4 h-4 text-white/30 shrink-0" />
                    <div className="flex-1 relative h-1 bg-white/10 rounded-full overflow-hidden group/vol">
                        <div
                            className="absolute top-0 left-0 h-full bg-[var(--prismatic-2)] shadow-[0_0_10px_var(--prismatic-2)] transition-all duration-100"
                            style={{ width: `${volume * 100}%` }}
                        />
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={(e) => setVolume(parseFloat(e.target.value))}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
