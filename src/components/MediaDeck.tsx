import React, { useState, useRef } from 'react'
import ReactPlayer from 'react-player'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, SkipForward, Volume2, Music, Link, Eye } from 'lucide-react'
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
    const activeName = customUrl ? 'Neural Link' : PRESETS[currentPreset].name
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
            "MediaDeck flex-1 glass-pane flex flex-col justify-between group relative overflow-hidden min-h-0 transition-all duration-700",
            holoMode && "bg-black/95 shadow-neu-glow"
        )}>
            {/* Hidden Player */}
            <div className={cn("absolute inset-0 z-0 transition-opacity duration-1000", holoMode ? "opacity-100" : "opacity-0 pointer-events-none")}>
                <Player
                    ref={playerRef}
                    url={activeUrl}
                    playing={playing}
                    volume={volume}
                    width="100%"
                    height="100%"
                    controls={false}
                    style={{ opacity: holoMode ? 0.4 : 0, filter: 'grayscale(0.6) contrast(1.2)' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60 pointer-events-none" />
            </div>

            {/* Header Area */}
            <div className="flex-none p-6 lg:p-8 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                    <div className="p-2.5 rounded-xl bg-accent-secondary/10 text-accent-secondary border border-accent-secondary/20">
                        <Music className="w-4 h-4" />
                    </div>
                    <h2 className="text-[11px] font-black tracking-[0.5em] text-white/40 uppercase font-mono-tech">
                        NEURAL // AUDIO
                    </h2>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => setHoloMode(!holoMode)} className={cn("p-2.5 rounded-lg transition-all", holoMode ? "text-accent-secondary bg-accent-secondary/10" : "text-white/20 hover:bg-white/5")}>
                        <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => setShowInput(!showInput)} className={cn("p-2.5 rounded-lg transition-all", showInput ? "text-accent-secondary bg-accent-secondary/10" : "text-white/20 hover:bg-white/5")}>
                        <Link className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col px-5 lg:px-6 pb-5 gap-4 relative z-10 min-h-0">
                <div className="flex-1 flex flex-row items-center gap-4 lg:gap-6 min-h-0">
                    {/* Visualizer Circle */}
                    <div className="shrink-0 w-20 h-20 lg:w-24 lg:h-24">
                        <motion.div
                            animate={playing ? { rotate: 360 } : {}}
                            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                            className="w-full h-full rounded-full bg-black/50 border border-white/10 flex items-center justify-center relative"
                        >
                            <div className="w-1/3 h-1/3 rounded-full bg-black border border-white/20 z-10 flex items-center justify-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-accent-secondary animate-pulse" />
                            </div>
                            <div className="absolute inset-[15%] border border-white/10 rounded-full" />
                        </motion.div>
                    </div>

                    {/* Info & Controls */}
                    <div className="flex-1 min-w-0 flex flex-col">
                        <AnimatePresence mode="wait">
                            {showInput ? (
                                <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full">
                                    <input
                                        type="text"
                                        placeholder="Paste URL..."
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:border-accent-secondary/50 outline-none"
                                        value={customUrl}
                                        onChange={(e) => setCustomUrl(e.target.value)}
                                        onKeyDown={handleUrlSubmit}
                                        autoFocus
                                    />
                                </motion.div>
                            ) : (
                                <motion.div key="info" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-1">
                                    <h3 className="text-xl lg:text-2xl font-light text-white tracking-tight truncate">{activeName}</h3>
                                    <p className="text-[9px] lg:text-[10px] text-white/30 font-bold uppercase tracking-widest truncate">{activeSub}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="mt-4 flex items-center gap-3">
                            <button
                                onClick={() => setPlaying(!playing)}
                                className="w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-lg bg-accent-secondary/10 text-accent-secondary hover:bg-accent-secondary hover:text-black transition-all border border-accent-secondary/20"
                            >
                                {playing ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                            </button>
                            <button onClick={cyclePreset} className="text-white/20 hover:text-white transition-all p-2 hover:bg-white/5 rounded-lg">
                                <SkipForward className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Volume Slider */}
                <div className="shrink-0 bg-black/20 border border-white/[0.06] p-3 rounded-lg">
                    <div className="flex items-center gap-3">
                        <Volume2 className="w-4 h-4 text-white/30 shrink-0" />
                        <input
                            type="range" min="0" max="1" step="0.01"
                            className="flex-1 accent-accent-secondary h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer"
                            value={volume}
                            onChange={(e) => setVolume(parseFloat(e.target.value))}
                        />
                        <span className="text-[9px] font-mono-tech text-white/30 w-8 text-right shrink-0">{Math.round(volume * 100)}%</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
