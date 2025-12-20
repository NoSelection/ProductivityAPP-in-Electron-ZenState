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
            "MediaDeck flex-1 hyper-panel flex flex-col justify-between group relative overflow-hidden min-h-0 transition-all duration-700",
            holoMode && "shadow-[0_0_40px_rgba(var(--prismatic-2-rgb),0.2),inset_0_0_40px_rgba(var(--prismatic-2-rgb),0.05)]"
        )}>
            {/* Audio Visualizer Overlay */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-30 mix-blend-screen">
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
            <div className="absolute inset-0 opacity-40">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(var(--prismatic-2-rgb),0.08),transparent_60%)]" />
                <div className="absolute bottom-0 right-0 w-32 h-32 border-t border-l border-white/5 rounded-tl-3xl opacity-20" />
            </div>

            {/* Header */}
            <div className="flex-none p-5 lg:p-6 flex items-center justify-between relative z-10 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="relative w-8 h-8 flex items-center justify-center bg-white/5 rounded-full border border-white/10">
                        <Radio className="w-4 h-4 text-[var(--prismatic-2)]" style={{ filter: 'drop-shadow(0 0 8px var(--prismatic-2))' }} />
                        {playing && (
                            <motion.div
                                className="absolute inset-0"
                                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <div className="w-full h-full rounded-full border border-[var(--prismatic-2)]/30" />
                            </motion.div>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <span className="font-display text-[10px] lg:text-xs font-bold tracking-[0.3em] text-[var(--prismatic-2)] uppercase">
                            TRANSMISSION
                        </span>
                        <span className="font-mono-tech text-[8px] text-white/20 uppercase tracking-widest">
                            {playing ? 'Signal Locked' : 'Searching Frequencies'}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <motion.button
                        onClick={() => setMode(mode === 'ambient' ? 'stream' : 'ambient')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        title={mode === 'ambient' ? "Switch to Streams" : "Switch to Ambient"}
                        className={cn(
                            "p-2.5 rounded-full border transition-all duration-300",
                            mode === 'stream'
                                ? "text-[var(--prismatic-1)] bg-[rgba(var(--prismatic-1-rgb),0.1)] border-[rgba(var(--prismatic-1-rgb),0.3)]"
                                : "text-white/20 border-white/5 hover:text-[var(--prismatic-2)] hover:bg-white/5"
                        )}
                    >
                        {mode === 'ambient' ? <Music className="w-4 h-4" /> : <Radio className="w-4 h-4" />}
                    </motion.button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col px-5 lg:px-6 py-4 gap-4 relative z-10 min-h-0">
                <div className="flex-1 flex flex-row items-center gap-5 lg:gap-6 min-h-0">
                    {/* Visualizer Disc (Ghost Core) */}
                    <div className="shrink-0 w-20 h-20 lg:w-28 lg:h-28 relative perspective-1000">
                        <motion.div
                            animate={playing ? { rotateY: 180 } : {}}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            className="w-full h-full rounded-full bg-black/60 border border-[var(--prismatic-2)]/20 flex items-center justify-center relative preserve-3d"
                            style={{
                                boxShadow: playing
                                    ? '0 0 30px rgba(var(--prismatic-2-rgb),0.2), inset 0 0 20px rgba(var(--prismatic-2-rgb),0.1)'
                                    : 'none'
                            }}
                        >
                            {/* Ambient Icon or Disc Rings */}
                            {mode === 'ambient' ? (
                                React.createElement(AMBIENT_PRESETS[currentAmbient].icon, {
                                    className: "w-8 h-8 text-[rgba(var(--prismatic-2-rgb),0.6)]",
                                    style: { filter: playing ? 'drop-shadow(0 0 10px var(--prismatic-2))' : 'none' }
                                })
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-16 h-16 border-2 border-[var(--prismatic-1)]/20 rounded-full animate-ping-slow" />
                                </div>
                            )}

                            {/* Center Core */}
                            <div className="absolute w-4 h-4 bg-white rounded-full shadow-[0_0_15px_white]" />
                        </motion.div>
                    </div>

                    {/* Track Info & Controls */}
                    <div className="flex-1 min-w-0 flex flex-col gap-4">
                        <div className="space-y-1">
                            <h3
                                className="text-xl lg:text-2xl font-display font-light text-white tracking-wide truncate"
                                style={{ textShadow: playing ? '0 0 20px rgba(var(--prismatic-2-rgb),0.3)' : 'none' }}
                            >
                                {activeName}
                            </h3>
                            <p className="font-mono-tech text-[9px] lg:text-[10px] text-[rgba(var(--prismatic-2-rgb),0.4)] uppercase tracking-[0.2em] truncate">
                                {activeSub}
                            </p>
                        </div>

                        {/* Control Buttons */}
                        <div className="flex items-center gap-3">
                            <motion.button
                                onClick={togglePlay}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={cn(
                                    "w-12 h-12 lg:w-14 lg:h-14 flex items-center justify-center rounded-full border transition-all duration-300",
                                    playing
                                        ? "bg-[rgba(var(--prismatic-2-rgb),0.1)] border-[rgba(var(--prismatic-2-rgb),0.4)] text-[var(--prismatic-2)] shadow-[0_0_25px_rgba(var(--prismatic-2-rgb),0.3)]"
                                        : "bg-black/40 border-white/10 text-white/60 hover:border-[var(--prismatic-2)]/40 hover:bg-[var(--prismatic-2)]/5"
                                )}
                            >
                                {playing ? (
                                    <Pause className="w-5 h-5 lg:w-6 lg:h-6 fill-current" />
                                ) : (
                                    <Play className="w-5 h-5 lg:w-6 lg:h-6 fill-current ml-0.5" />
                                )}
                            </motion.button>

                            <motion.button
                                onClick={cycleContent}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-3 rounded-full text-white/20 hover:text-[var(--prismatic-1)] hover:bg-[rgba(var(--prismatic-1-rgb),0.05)] border border-transparent hover:border-[rgba(var(--prismatic-1-rgb),0.2)] transition-all"
                            >
                                <SkipForward className="w-5 h-5" />
                            </motion.button>
                        </div>
                    </div>
                </div>

                {/* Volume Control */}
                <div className="shrink-0 bg-transparent pt-2">
                    <div className="flex items-center gap-4">
                        <Volume2 className="w-4 h-4 shrink-0" style={{ color: 'rgba(var(--prismatic-2-rgb), 0.4)' }} />
                        <div className="flex-1 relative h-0.5 bg-white/10 overflow-hidden">
                            <div
                                className="absolute top-0 left-0 h-full bg-[var(--prismatic-2)] shadow-[0_0_10px_var(--prismatic-2)]"
                                style={{ width: `${volume * 100}%` }}
                            />
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                value={volume}
                                onChange={(e) => setVolume(parseFloat(e.target.value))}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
