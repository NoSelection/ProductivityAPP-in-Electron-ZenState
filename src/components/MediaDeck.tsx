import React, { useState, useRef } from 'react'
import ReactPlayer from 'react-player'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, SkipBack, SkipForward, Volume2, Music, Link, Eye, Radio, X } from 'lucide-react'
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
            "glass-pane h-full w-full flex flex-col justify-between group relative overflow-hidden min-h-[45vh] lg:min-h-0 transition-all duration-500",
            holoMode && "bg-black/80"
        )}>
            {/* Hidden Player (or Holo View) */}
            <div className={cn("absolute inset-0 z-0 transition-opacity duration-1000", holoMode ? "opacity-100" : "opacity-0 pointer-events-none")}>
                <Player
                    ref={playerRef}
                    url={activeUrl}
                    playing={playing}
                    volume={volume}
                    width="100%"
                    height="100%"
                    controls={false}
                    style={{ opacity: holoMode ? 0.6 : 0, filter: 'grayscale(0.4) contrast(1.1)' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            </div>

            {/* Header */}
            <div className="flex-none p-[3vh] pb-[1vh] flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                    <Music className="w-3.5 h-3.5 text-accent-secondary/60" />
                    <h2 className="text-white/40 text-[9px] font-black tracking-[0.5em] uppercase font-mono-tech">
                        NEURAL // AUDIO
                    </h2>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setHoloMode(!holoMode)}
                        className={cn(
                            "p-1.5 rounded-full transition-all duration-300 hover:bg-white/10",
                            holoMode ? "text-accent-secondary bg-accent-secondary/10" : "text-white/20"
                        )}
                        title="Toggle Holo-View"
                    >
                        <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                        onClick={() => setShowInput(!showInput)}
                        className={cn(
                            "p-1.5 rounded-full transition-all duration-300 hover:bg-white/10",
                            showInput ? "text-accent-secondary bg-accent-secondary/10" : "text-white/20"
                        )}
                        title="Neural Link Input"
                    >
                        <Link className="w-3.5 h-3.5" />
                    </button>
                    <button
                        onClick={cyclePreset}
                        className="p-1.5 rounded-full text-white/20 hover:text-white hover:bg-white/10 transition-all duration-300"
                        title="Cycle Frequency"
                    >
                        <Radio className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* Content Container */}
            <div className="flex-1 min-h-0 flex flex-col justify-center gap-[2vh] p-[3vh] pt-[1vh] relative z-10">
                <div className="flex items-center gap-6 min-h-0">
                    {/* Art / Visualizer */}
                    <div className="relative shrink-0 w-[10vh] h-[10vh] max-w-[80px] max-h-[80px]">
                        <motion.div
                            animate={playing ? { rotate: 360 } : {}}
                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                            className="w-full h-full rounded-full bg-black/40 border-[1px] border-white/10 flex items-center justify-center overflow-hidden relative shadow-sm backdrop-blur-md"
                        >
                            {!holoMode && (
                                <>
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent opacity-10" />
                                    <div className="w-1/4 h-1/4 rounded-full bg-black border border-white/20 z-10 flex items-center justify-center">
                                        <div className="w-1 h-1 rounded-full bg-accent-secondary/60" />
                                    </div>
                                </>
                            )}
                        </motion.div>
                        {playing && !holoMode && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1.1 }}
                                className="absolute -inset-4 bg-accent-secondary/5 blur-2xl rounded-full -z-10"
                            />
                        )}
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <AnimatePresence mode="wait">
                            {showInput ? (
                                <motion.div
                                    key="input"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    className="w-full"
                                >
                                    <input
                                        type="text"
                                        placeholder="Paste Neural Link..."
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:border-accent-secondary/50 outline-none font-mono-tech"
                                        value={customUrl}
                                        onChange={(e) => setCustomUrl(e.target.value)}
                                        onKeyDown={handleUrlSubmit}
                                        autoFocus
                                    />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="info"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                >
                                    <h3 className="text-[2.2vh] font-light text-white tracking-tight truncate leading-tight">{activeName}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="w-1 h-1 rounded-full bg-accent-secondary animate-pulse" />
                                        <p className="text-[1.1vh] text-white/40 font-black uppercase tracking-[0.2em] truncate">{activeSub}</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="mt-[2vh] flex items-center gap-[2vh]">
                            <button
                                onClick={() => setPlaying(!playing)}
                                className="w-[5vh] h-[5vh] max-w-[48px] max-h-[48px] flex items-center justify-center rounded-full bg-accent-secondary/20 text-accent-secondary hover:bg-accent-secondary hover:text-black transition-all duration-500 border border-accent-secondary/30 backdrop-blur-sm"
                            >
                                {playing ? <Pause className="w-[2vh] h-[2vh] fill-current" /> : <Play className="w-[2vh] h-[2vh] fill-current ml-0.5" />}
                            </button>
                            <div className="flex items-center gap-[2vh]">
                                <SkipBack
                                    onClick={() => cyclePreset()}
                                    className="w-[2.2vh] h-[2.2vh] text-white/40 hover:text-white cursor-pointer transition-colors"
                                />
                                <SkipForward
                                    onClick={() => cyclePreset()}
                                    className="w-[2.2vh] h-[2.2vh] text-white/40 hover:text-white cursor-pointer transition-colors"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 bg-white/[0.02] border border-white/5 px-4 py-[1.2vh] rounded-xl w-full shrink-0 backdrop-blur-md">
                    <Volume2 className="w-4 h-4 text-white/40" />
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        className="flex-1 accent-accent-secondary h-1 bg-white/5 rounded-full appearance-none cursor-pointer"
                        value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                    />
                </div>
            </div>
        </div>
    )
}
