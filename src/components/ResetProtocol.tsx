import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '../lib/utils'

interface ResetProtocolProps {
    isOpen: boolean
    onClose: () => void
}

export const ResetProtocol: React.FC<ResetProtocolProps> = ({ isOpen, onClose }) => {
    const [phase, setPhase] = useState<'In' | 'Hold' | 'Out' | 'Pause'>('In')
    const [timer, setTimer] = useState(4)

    useEffect(() => {
        if (!isOpen) return

        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev === 1) {
                    if (phase === 'In') { setPhase('Hold'); return 4 }
                    if (phase === 'Hold') { setPhase('Out'); return 4 }
                    if (phase === 'Out') { setPhase('Pause'); return 4 }
                    if (phase === 'Pause') { setPhase('In'); return 4 }
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(interval)
    }, [isOpen, phase])

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-2xl"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-12 right-12 text-white/20 hover:text-white transition-colors"
                    >
                        <X className="w-8 h-8" />
                    </button>

                    <div className="flex flex-col items-center gap-12">
                        <div className="text-center space-y-2">
                            <h2 className="text-accent-base text-xs font-black tracking-[0.8em] uppercase font-mono-tech">
                                RESET // PROTOCOL
                            </h2>
                            <p className="text-white/40 text-[10px] tracking-widest uppercase font-mono-tech">
                                BOX BREATHING ENABLED
                            </p>
                        </div>

                        {/* The Neural Orb */}
                        <div className="relative w-64 h-64 flex items-center justify-center">
                            {/* Outer Glows */}
                            <motion.div
                                animate={{
                                    scale: phase === 'In' ? 1.5 : (phase === 'Out' ? 1 : (phase === 'Hold' ? 1.5 : 1)),
                                    opacity: [0.1, 0.2, 0.1]
                                }}
                                transition={{ duration: 4, ease: "easeInOut" }}
                                className="absolute inset-0 bg-accent-base/20 rounded-full blur-3xl"
                            />

                            <motion.div
                                animate={{
                                    scale: phase === 'In' ? 1.2 : (phase === 'Out' ? 0.8 : (phase === 'Hold' ? 1.2 : 0.8)),
                                }}
                                transition={{ duration: 4, ease: "linear" }}
                                className="relative w-40 h-40 rounded-full border border-white/10 flex items-center justify-center overflow-hidden bg-black"
                            >
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--accent-base-rgb),0.2)_0%,transparent_70%)]" />

                                {/* Inner Orb */}
                                <motion.div
                                    animate={{
                                        scale: phase === 'In' ? 1.4 : (phase === 'Out' ? 0.6 : (phase === 'Hold' ? 1.4 : 0.6)),
                                        backgroundColor: phase === 'Hold' ? 'hsla(var(--accent-base), 0.8)' : 'hsla(var(--accent-base), 0.4)'
                                    }}
                                    transition={{ duration: 4, ease: "easeInOut" }}
                                    className="w-20 h-20 rounded-full"
                                />

                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-white text-3xl font-light font-mono-tech tabular-nums">
                                        {timer}
                                    </span>
                                </div>
                            </motion.div>
                        </div>

                        <div className="text-center">
                            <motion.p
                                key={phase}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-white text-xl font-light tracking-[0.2em] uppercase font-mono-tech h-8"
                            >
                                {phase === 'In' && 'Breathe In'}
                                {phase === 'Hold' && 'Hold'}
                                {phase === 'Out' && 'Exhale'}
                                {phase === 'Pause' && 'Hold'}
                            </motion.p>
                        </div>
                    </div>

                    <div className="absolute bottom-12 flex flex-col items-center gap-4">
                        <div className="flex gap-2">
                            {['In', 'Hold', 'Out', 'Pause'].map((p) => (
                                <div
                                    key={p}
                                    className={cn(
                                        "w-2 h-2 rounded-full transition-all duration-500",
                                        phase === p ? "bg-accent-base w-8" : "bg-white/10"
                                    )}
                                />
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
