import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Wind } from 'lucide-react'
import { cn } from '../lib/utils'

interface ResetProtocolProps {
    isOpen: boolean
    onClose: () => void
}

export const ResetProtocol: React.FC<ResetProtocolProps> = ({ isOpen, onClose }) => {
    const [phase, setPhase] = useState<'In' | 'Hold' | 'Out' | 'Pause'>('In')
    const [timer, setTimer] = useState(4)

    useEffect(() => {
        if (!isOpen) {
            setPhase('In')
            setTimer(4)
            return
        }

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

    const phaseColors = {
        In: { primary: '#00f0ff', secondary: '#bf00ff' },
        Hold: { primary: '#bf00ff', secondary: '#ff00aa' },
        Out: { primary: '#ff00aa', secondary: '#00f0ff' },
        Pause: { primary: '#39ff14', secondary: '#00f0ff' }
    }

    const currentColors = phaseColors[phase]

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center"
                >
                    {/* Background */}
                    <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl" />

                    {/* Cyber Grid */}
                    <div className="absolute inset-0 opacity-20">
                        <div
                            className="absolute inset-0"
                            style={{
                                backgroundImage: `
                                    linear-gradient(rgba(0,240,255,0.03) 1px, transparent 1px),
                                    linear-gradient(90deg, rgba(0,240,255,0.03) 1px, transparent 1px)
                                `,
                                backgroundSize: '60px 60px'
                            }}
                        />
                    </div>

                    {/* Close Button */}
                    <motion.button
                        onClick={onClose}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="absolute top-8 right-8 p-3 rounded-xl border border-white/10 text-white/20 hover:text-neon-magenta hover:border-neon-magenta/30 hover:bg-neon-magenta/5 transition-all z-10"
                    >
                        <X className="w-6 h-6" />
                    </motion.button>

                    {/* Main Content */}
                    <div className="relative flex flex-col items-center gap-12 z-10">
                        {/* Header */}
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-center space-y-3"
                        >
                            <div className="flex items-center justify-center gap-3 mb-4">
                                <Wind className="w-5 h-5 text-neon-cyan" style={{ filter: 'drop-shadow(0 0 10px #00f0ff)' }} />
                                <h2 className="font-display text-sm font-bold tracking-[0.5em] text-neon-cyan uppercase">
                                    Reset Protocol
                                </h2>
                            </div>
                            <p className="font-mono-tech text-[10px] text-white/30 uppercase tracking-[0.3em]">
                                Box Breathing Sequence
                            </p>
                        </motion.div>

                        {/* Breathing Orb */}
                        <div className="relative w-72 h-72 lg:w-80 lg:h-80 flex items-center justify-center">
                            {/* Outer Pulsing Rings */}
                            {[1, 2, 3].map((ring) => (
                                <motion.div
                                    key={ring}
                                    className="absolute rounded-full border"
                                    style={{
                                        width: `${100 + ring * 20}%`,
                                        height: `${100 + ring * 20}%`,
                                        borderColor: `${currentColors.primary}${10 - ring * 2}0`
                                    }}
                                    animate={{
                                        scale: phase === 'In' || phase === 'Hold' ? [1, 1.05, 1] : [1, 0.95, 1],
                                        opacity: [0.3, 0.1, 0.3]
                                    }}
                                    transition={{
                                        duration: 4,
                                        delay: ring * 0.2,
                                        repeat: Infinity
                                    }}
                                />
                            ))}

                            {/* Main Breathing Circle */}
                            <motion.div
                                animate={{
                                    scale: phase === 'In' ? 1.3 : (phase === 'Out' ? 0.7 : (phase === 'Hold' ? 1.3 : 0.7)),
                                }}
                                transition={{ duration: 4, ease: "easeInOut" }}
                                className="relative w-48 h-48 lg:w-56 lg:h-56 rounded-full flex items-center justify-center overflow-hidden"
                                style={{
                                    background: `radial-gradient(circle at 30% 30%, ${currentColors.primary}30, transparent 50%), radial-gradient(circle at 70% 70%, ${currentColors.secondary}20, transparent 50%)`,
                                    border: `2px solid ${currentColors.primary}40`,
                                    boxShadow: `
                                        0 0 60px ${currentColors.primary}30,
                                        0 0 120px ${currentColors.primary}20,
                                        inset 0 0 60px ${currentColors.primary}10
                                    `
                                }}
                            >
                                {/* Inner Orb */}
                                <motion.div
                                    animate={{
                                        scale: phase === 'In' ? 1.5 : (phase === 'Out' ? 0.5 : (phase === 'Hold' ? 1.5 : 0.5)),
                                        opacity: phase === 'Hold' || phase === 'Pause' ? 0.8 : 0.5
                                    }}
                                    transition={{ duration: 4, ease: "easeInOut" }}
                                    className="w-20 h-20 rounded-full"
                                    style={{
                                        background: `radial-gradient(circle, ${currentColors.primary} 0%, transparent 70%)`,
                                        boxShadow: `0 0 40px ${currentColors.primary}`
                                    }}
                                />

                                {/* Timer Display */}
                                <div className="absolute flex flex-col items-center">
                                    <motion.span
                                        key={timer}
                                        initial={{ scale: 1.2, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="font-mono-tech text-5xl lg:text-6xl font-light tabular-nums"
                                        style={{
                                            color: currentColors.primary,
                                            textShadow: `0 0 30px ${currentColors.primary}, 0 0 60px ${currentColors.primary}`
                                        }}
                                    >
                                        {timer}
                                    </motion.span>
                                </div>
                            </motion.div>

                            {/* Spinning Accent Ring */}
                            <motion.div
                                className="absolute inset-[-8px] rounded-full"
                                style={{
                                    border: `1px dashed ${currentColors.primary}30`
                                }}
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            />
                        </div>

                        {/* Phase Indicator */}
                        <motion.div
                            key={phase}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center"
                        >
                            <p
                                className="font-display text-2xl lg:text-3xl font-light tracking-[0.3em] uppercase"
                                style={{
                                    color: currentColors.primary,
                                    textShadow: `0 0 20px ${currentColors.primary}60`
                                }}
                            >
                                {phase === 'In' && 'Breathe In'}
                                {phase === 'Hold' && 'Hold'}
                                {phase === 'Out' && 'Exhale'}
                                {phase === 'Pause' && 'Rest'}
                            </p>
                        </motion.div>

                        {/* Phase Progress */}
                        <div className="flex gap-3">
                            {(['In', 'Hold', 'Out', 'Pause'] as const).map((p) => (
                                <motion.div
                                    key={p}
                                    className={cn(
                                        "h-1.5 rounded-full transition-all duration-500",
                                        phase === p ? "w-10" : "w-3"
                                    )}
                                    style={{
                                        backgroundColor: phase === p ? currentColors.primary : 'rgba(255,255,255,0.1)',
                                        boxShadow: phase === p ? `0 0 15px ${currentColors.primary}` : 'none'
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
