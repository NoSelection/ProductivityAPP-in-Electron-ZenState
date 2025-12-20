import React, { useState, useRef } from 'react'
import ReactPlayer from 'react-player'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, SkipForward, Volume2, Radio, Link, Eye, Disc3 } from 'lucide-react'
import { cn } from '../lib/utils'

const PRESETS = [
    { name: 'Lofi Girl', sub: 'Beats to study // relax', url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk' },
    { name: 'Synthwave Radio', sub: 'Neon nights // Cyberpunk', url: 'https://www.youtube.com/watch?v=4xDzrJKXOOY' },
    { name: 'Dark Ambient', sub: 'Deep focus // Drone', url: 'https://www.youtube.com/watch?v=S7bCg4cOebE' }
]

export const MediaDeck: React.FC = () => {
    const [playing, setPlaying] = useState(false)
    const [volume, setVolume] = useState(0.5)
    const [currentPreset, setCurrentPreset] = useState(0)
    const [customUrl, setCustomUrl] = useState('')
    const [showInput, setShowInput] = useState(false)
    const [holoMode, setHoloMode] = useState(false)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const playerRef = useRef<any>(null)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Player = ReactPlayer as any

    const activeUrl = customUrl || PRESETS[currentPreset].url
    const activeName = customUrl ? 'Custom Stream' : PRESETS[currentPreset].name
    const activeSub = customUrl ? 'External Signal' : PRESETS[currentPreset].sub

    const cyclePreset = () => {
        setCustomUrl('')
        setCurrentPreset((prev) => (prev + 1) % PRESETS.length)
        setPlaying(true)
    }

    const handleUrlSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setShowInput(false)
            setPlaying(true)
        }
    }

    return (
        <div className={cn(
            "MediaDeck flex-1 hyper-panel flex flex-col justify-between group relative overflow-hidden min-h-0 transition-all duration-700",
            holoMode && "shadow-[0_0_40px_rgba(0,240,255,0.2),inset_0_0_40px_rgba(0,240,255,0.05)]"
        )}>
            {/* Hidden Player */}
            <div className={cn(
                "absolute inset-0 z-0 transition-opacity duration-1000",
                holoMode ? "opacity-100" : "opacity-0 pointer-events-none"
            )}>
                <Player
                    ref={playerRef}
                    url={activeUrl}
                    playing={playing}
                    volume={volume}
                    width="100%"
                    height="100%"
                    controls={false}
                    style={{ opacity: holoMode ? 0.3 : 0, filter: 'grayscale(0.5) contrast(1.3) hue-rotate(180deg)' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />
            </div>

            {/* Background Effect */}
            <div className="absolute inset-0 opacity-40">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(0,240,255,0.08),transparent_60%)]" />
            </div>

            {/* Header */}
            <div className="flex-none p-5 lg:p-6 flex items-center justify-between relative z-10 border-b border-neon-cyan/10">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Radio className="w-5 h-5 text-neon-cyan" style={{ filter: 'drop-shadow(0 0 8px #00f0ff)' }} />
                        {playing && (
                            <motion.div
                                className="absolute inset-0"
                                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <div className="w-full h-full rounded-full border border-neon-cyan/30" />
                            </motion.div>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <span className="font-display text-[10px] lg:text-xs font-bold tracking-[0.3em] text-neon-cyan uppercase">
                            AUDIO DECK
                        </span>
                        <span className="font-mono-tech text-[8px] text-white/20 uppercase tracking-widest">
                            {playing ? 'Broadcasting' : 'Standby'}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <motion.button
                        onClick={() => setHoloMode(!holoMode)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={cn(
                            "p-2.5 rounded-lg border transition-all duration-300",
                            holoMode
                                ? "text-neon-cyan bg-neon-cyan/10 border-neon-cyan/30 shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                                : "text-white/20 border-transparent hover:text-neon-cyan hover:bg-white/5"
                        )}
                    >
                        <Eye className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                        onClick={() => setShowInput(!showInput)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={cn(
                            "p-2.5 rounded-lg border transition-all duration-300",
                            showInput
                                ? "text-neon-magenta bg-neon-magenta/10 border-neon-magenta/30"
                                : "text-white/20 border-transparent hover:text-neon-magenta hover:bg-white/5"
                        )}
                    >
                        <Link className="w-4 h-4" />
                    </motion.button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col px-5 lg:px-6 py-4 gap-4 relative z-10 min-h-0">
                <div className="flex-1 flex flex-row items-center gap-5 lg:gap-6 min-h-0">
                    {/* Visualizer Disc */}
                    <div className="shrink-0 w-20 h-20 lg:w-28 lg:h-28 relative">
                        <motion.div
                            animate={playing ? { rotate: 360 } : {}}
                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                            className="w-full h-full rounded-full bg-black/60 border border-neon-cyan/20 flex items-center justify-center relative overflow-hidden"
                            style={{
                                boxShadow: playing
                                    ? '0 0 30px rgba(0,240,255,0.2), inset 0 0 20px rgba(0,240,255,0.1)'
                                    : 'none'
                            }}
                        >
                            {/* Disc Rings */}
                            <div className="absolute inset-[15%] border border-neon-cyan/10 rounded-full" />
                            <div className="absolute inset-[30%] border border-neon-magenta/10 rounded-full" />
                            <div className="absolute inset-[45%] border border-neon-cyan/10 rounded-full" />

                            {/* Center */}
                            <div className="w-1/4 h-1/4 rounded-full bg-black border border-neon-cyan/30 z-10 flex items-center justify-center">
                                <motion.div
                                    className="w-2 h-2 rounded-full bg-neon-cyan"
                                    animate={playing ? { opacity: [0.5, 1, 0.5] } : {}}
                                    transition={{ duration: 1, repeat: Infinity }}
                                    style={{ boxShadow: '0 0 10px #00f0ff' }}
                                />
                            </div>
                        </motion.div>

                        {/* Outer Ring Animation */}
                        {playing && (
                            <motion.div
                                className="absolute inset-[-4px] rounded-full border border-neon-cyan/20"
                                animate={{ rotate: -360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                style={{ borderStyle: 'dashed' }}
                            />
                        )}
                    </div>

                    {/* Track Info & Controls */}
                    <div className="flex-1 min-w-0 flex flex-col gap-4">
                        <AnimatePresence mode="wait">
                            {showInput ? (
                                <motion.div
                                    key="input"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="w-full"
                                >
                                    <input
                                        type="text"
                                        placeholder="Paste stream URL..."
                                        className="w-full bg-black/50 border border-neon-magenta/20 rounded-lg px-4 py-3 text-sm text-white focus:border-neon-magenta/50 outline-none font-mono-tech placeholder:text-white/15 focus:shadow-[0_0_20px_rgba(255,0,170,0.15)]"
                                        value={customUrl}
                                        onChange={(e) => setCustomUrl(e.target.value)}
                                        onKeyDown={handleUrlSubmit}
                                        autoFocus
                                    />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="info"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-1"
                                >
                                    <h3
                                        className="text-xl lg:text-2xl font-display font-light text-white tracking-wide truncate"
                                        style={{ textShadow: playing ? '0 0 20px rgba(0,240,255,0.3)' : 'none' }}
                                    >
                                        {activeName}
                                    </h3>
                                    <p className="font-mono-tech text-[9px] lg:text-[10px] text-neon-cyan/40 uppercase tracking-[0.2em] truncate">
                                        {activeSub}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Control Buttons */}
                        <div className="flex items-center gap-3">
                            <motion.button
                                onClick={() => setPlaying(!playing)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={cn(
                                    "w-12 h-12 lg:w-14 lg:h-14 flex items-center justify-center rounded-xl border transition-all duration-300",
                                    playing
                                        ? "bg-neon-cyan/10 border-neon-cyan/40 text-neon-cyan shadow-[0_0_25px_rgba(0,240,255,0.3)]"
                                        : "bg-black/40 border-neon-cyan/20 text-neon-cyan hover:border-neon-cyan/40 hover:bg-neon-cyan/5"
                                )}
                            >
                                {playing ? (
                                    <Pause className="w-5 h-5 lg:w-6 lg:h-6 fill-current" style={{ filter: 'drop-shadow(0 0 5px #00f0ff)' }} />
                                ) : (
                                    <Play className="w-5 h-5 lg:w-6 lg:h-6 fill-current ml-0.5" />
                                )}
                            </motion.button>

                            <motion.button
                                onClick={cyclePreset}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-3 rounded-xl text-white/20 hover:text-neon-magenta hover:bg-neon-magenta/5 border border-transparent hover:border-neon-magenta/20 transition-all"
                            >
                                <SkipForward className="w-5 h-5" />
                            </motion.button>
                        </div>
                    </div>
                </div>

                {/* Volume Control */}
                <div className="shrink-0 bg-black/30 border border-white/5 p-4 rounded-lg">
                    <div className="flex items-center gap-4">
                        <Volume2 className="w-4 h-4 text-neon-cyan/40 shrink-0" />
                        <div className="flex-1 relative">
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                className="w-full h-1 cursor-pointer"
                                value={volume}
                                onChange={(e) => setVolume(parseFloat(e.target.value))}
                            />
                        </div>
                        <span className="font-mono-tech text-[10px] text-neon-cyan/40 w-10 text-right shrink-0">
                            {Math.round(volume * 100)}%
                        </span>
                    </div>
                </div>
            </div>

            {/* Bottom Visualizer Bar */}
            {playing && (
                <div className="absolute bottom-0 left-0 right-0 h-1 flex gap-px overflow-hidden">
                    {Array.from({ length: 40 }).map((_, i) => (
                        <motion.div
                            key={i}
                            className="flex-1 bg-gradient-to-t from-neon-cyan to-neon-magenta"
                            animate={{
                                scaleY: [0.3, Math.random() * 0.7 + 0.3, 0.3],
                            }}
                            transition={{
                                duration: 0.5 + Math.random() * 0.5,
                                repeat: Infinity,
                                delay: i * 0.02,
                            }}
                            style={{ transformOrigin: 'bottom' }}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
