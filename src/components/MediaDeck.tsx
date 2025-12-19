import React, { useState, useRef } from 'react'
import ReactPlayer from 'react-player'
import { motion } from 'framer-motion'
import { Play, Pause, SkipBack, SkipForward, Volume2, Disc, Music } from 'lucide-react'
import { cn } from '../lib/utils'

export const MediaDeck: React.FC = () => {
    const [playing, setPlaying] = useState(false)
    const [volume, setVolume] = useState(0.5)
    const playerRef = useRef<any>(null)

    return (
        <div className={cn(
            "cyber-glass h-full w-full p-8 flex flex-col justify-between group relative overflow-hidden transition-all duration-700 rounded-3xl"
        )}>
            {/* Catch-light accent */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Hidden Player */}
            <div className="hidden">
                {React.createElement(ReactPlayer as any, {
                    ref: playerRef,
                    url: "https://www.youtube.com/watch?v=jfKfPfyJRdk",
                    playing: playing,
                    volume: volume,
                    width: "0px",
                    height: "0px"
                })}
            </div>

            {/* UI Layer */}
            <div className="flex flex-col gap-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-slate-500 text-[9px] font-bold tracking-[0.3em] uppercase opacity-70 font-mono-tech">
                        Neural Audio // Active
                    </h2>
                    <motion.div
                        animate={playing ? { rotate: 360 } : {}}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    >
                        <Music className="w-3.5 h-3.5 text-secondary/40" />
                    </motion.div>
                </div>

                <div className="flex items-center gap-8">
                    <div className="relative">
                        <motion.div
                            animate={playing ? { rotate: 360 } : {}}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                            className="w-28 h-28 rounded-full bg-slate-950 border-[6px] border-white/5 flex items-center justify-center overflow-hidden shadow-2xl relative"
                        >
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent opacity-20" />
                            <div className="w-10 h-10 rounded-full bg-slate-900 border-2 border-white/10 z-10 flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-secondary/40" />
                            </div>
                            <Disc className="w-16 h-16 text-secondary/5 absolute opacity-20" />
                        </motion.div>
                        {playing && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1.1 }}
                                className="absolute -inset-2 bg-secondary/5 blur-2xl rounded-full -z-10"
                            />
                        )}
                    </div>

                    <div className="flex-1">
                        <h3 className="text-xl font-light text-slate-100 tracking-tight">Lofi Girl</h3>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Beats to Study</p>

                        <div className="mt-8 flex items-center gap-5">
                            <button
                                onClick={() => setPlaying(!playing)}
                                className="w-12 h-12 flex items-center justify-center rounded-xl bg-secondary/10 text-secondary hover:bg-secondary hover:text-slate-900 transition-all shadow-lg hover:shadow-secondary/20 border border-secondary/20"
                            >
                                {playing ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                            </button>
                            <SkipBack className="w-5 h-5 text-slate-600 hover:text-white cursor-pointer transition-colors" />
                            <SkipForward className="w-5 h-5 text-slate-600 hover:text-white cursor-pointer transition-colors" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4 px-2 opacity-40 group-hover:opacity-100 transition-opacity">
                <Volume2 className="w-4 h-4 text-slate-500" />
                <input
                    type="range"
                    min="0" max="1" step="0.1"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="flex-1 h-[2px] bg-white/5 rounded-full appearance-none cursor-pointer accent-secondary"
                />
            </div>
        </div>
    )
}
