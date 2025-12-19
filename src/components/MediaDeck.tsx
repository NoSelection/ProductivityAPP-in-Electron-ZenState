import React, { useState, useRef } from 'react'
import ReactPlayer from 'react-player'
import { motion } from 'framer-motion'
import { Play, Pause, SkipBack, SkipForward, Volume2, Music } from 'lucide-react'
import { cn } from '../lib/utils'

export const MediaDeck: React.FC = () => {
    const [playing, setPlaying] = useState(false)
    const [volume, setVolume] = useState(0.5)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const playerRef = useRef<any>(null)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Player = ReactPlayer as any

    return (
        <div className={cn(
            "glass-pane h-full w-full flex flex-col justify-between group relative overflow-hidden min-h-[45vh] lg:min-h-0"
        )}>
            {/* Hidden Player */}
            <div className="hidden">
                <Player
                    ref={playerRef}
                    url="https://www.youtube.com/watch?v=jfKfPfyJRdk"
                    playing={playing}
                    volume={volume}
                    width="0px"
                    height="0px"
                />
            </div>

            {/* Header */}
            <div className="flex-none p-[3vh] pb-[1vh] flex items-center gap-3">
                <Music className="w-3.5 h-3.5 text-accent-secondary/60" />
                <h2 className="text-white/40 text-[9px] font-black tracking-[0.5em] uppercase font-mono-tech">
                    NEURAL // AUDIO
                </h2>
            </div>

            {/* Content Container - Flex 1 to Consume Space */}
            <div className="flex-1 min-h-0 flex flex-col justify-center gap-[2vh] p-[3vh] pt-[1vh]">
                <div className="flex items-center gap-6 min-h-0">
                    <div className="relative shrink-0 w-[10vh] h-[10vh] max-w-[80px] max-h-[80px]">
                        <motion.div
                            animate={playing ? { rotate: 360 } : {}}
                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                            className="w-full h-full rounded-full bg-black/40 border-[1px] border-white/10 flex items-center justify-center overflow-hidden relative shadow-sm"
                        >
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent opacity-10" />
                            <div className="w-1/4 h-1/4 rounded-full bg-black border border-white/20 z-10 flex items-center justify-center">
                                <div className="w-1 h-1 rounded-full bg-accent-secondary/60" />
                            </div>
                        </motion.div>
                        {playing && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1.1 }}
                                className="absolute -inset-4 bg-accent-secondary/5 blur-2xl rounded-full -z-10"
                            />
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className="text-[2.2vh] font-light text-white tracking-tight truncate leading-tight">Lofi Girl</h3>
                        <p className="text-[1.1vh] text-white/40 font-black uppercase tracking-[0.2em] mt-1 truncate">Beats to study // relax</p>

                        <div className="mt-[2vh] flex items-center gap-[2vh]">
                            <button
                                onClick={() => setPlaying(!playing)}
                                className="w-[5vh] h-[5vh] max-w-[48px] max-h-[48px] flex items-center justify-center rounded-full bg-accent-secondary/20 text-accent-secondary hover:bg-accent-secondary hover:text-black transition-all duration-500 border border-accent-secondary/30"
                            >
                                {playing ? <Pause className="w-[2vh] h-[2vh] fill-current" /> : <Play className="w-[2vh] h-[2vh] fill-current ml-0.5" />}
                            </button>
                            <div className="flex items-center gap-[2vh]">
                                <SkipBack className="w-[2.2vh] h-[2.2vh] text-white/40 hover:text-white cursor-pointer transition-colors" />
                                <SkipForward className="w-[2.2vh] h-[2.2vh] text-white/40 hover:text-white cursor-pointer transition-colors" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 bg-white/[0.02] border border-white/5 px-4 py-[1.2vh] rounded-xl w-full shrink-0">
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
