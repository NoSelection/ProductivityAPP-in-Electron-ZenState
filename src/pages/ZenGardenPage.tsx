import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flower2, Wind, Sparkles } from 'lucide-react';


export const ZenGardenPage: React.FC = () => {
    const [breatheState, setBreatheState] = useState<'in' | 'hold' | 'out'>('in');
    const [showBirthday, setShowBirthday] = useState(true);

    // Breathing Cycle
    useEffect(() => {
        const interval = setInterval(() => {
            setBreatheState(prev => {
                if (prev === 'in') return 'hold';
                if (prev === 'hold') return 'out';
                return 'in';
            });
        }, 4000); // 4 second cycle

        return () => clearInterval(interval);
    }, []);

    // Birthday Message Timer
    useEffect(() => {
        const timer = setTimeout(() => setShowBirthday(false), 8000);
        return () => clearTimeout(timer);
    }, []);

    const bloomVariants = {
        in: { scale: 1.5, rotate: 180, opacity: 1, filter: 'hue-rotate(0deg)' },
        hold: { scale: 1.6, rotate: 190, opacity: 0.9, filter: 'hue-rotate(45deg)' },
        out: { scale: 1.0, rotate: 0, opacity: 0.6, filter: 'hue-rotate(90deg)' }
    };

    const textVariants = {
        in: { opacity: 1, y: 0 },
        hold: { opacity: 0.8, y: -5 },
        out: { opacity: 0.4, y: 10 }
    };

    return (
        <div className="h-full w-full relative overflow-hidden flex flex-col items-center justify-center bg-[#050510]">
            {/* Ambient Background */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute inset-0 bg-gradient-radial from-[var(--prismatic-2)]/10 to-transparent animate-pulse" style={{ animationDuration: '8s' }} />
                <div className="absolute bottom-0 left-0 w-full h-[50%] bg-gradient-to-t from-[var(--prismatic-1)]/10 to-transparent" />
            </div>

            {/* Special Birthday Greeting */}
            <AnimatePresence>
                {showBirthday && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 1.2, filter: 'blur(20px)' }}
                        transition={{ duration: 1.5, ease: "circOut" }}
                        className="absolute top-20 z-50 flex flex-col items-center"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <Sparkles className="w-5 h-5 text-[var(--prismatic-3)] animate-spin-slow" />
                            <span className="font-mono-tech text-[var(--prismatic-3)] text-xs tracking-[0.5em] uppercase">System Notification</span>
                            <Sparkles className="w-5 h-5 text-[var(--prismatic-3)] animate-spin-slow" />
                        </div>
                        <h1 className="font-display text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--prismatic-1)] via-[var(--prismatic-2)] to-[var(--prismatic-3)] opacity-90 drop-shadow-prism-glow text-center">
                            HAPPY BIRTHDAY
                        </h1>
                        <p className="font-display text-lg text-white/60 tracking-widest mt-4 uppercase">
                            Level Up Detected
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* The Fractal Lotus (Breathing Art) */}
            <div className="relative z-10 w-[600px] h-[600px] flex items-center justify-center">
                {/* Core */}
                <motion.div
                    className="absolute w-32 h-32 bg-[var(--prismatic-2)]/10 rounded-full blur-xl"
                    animate={breatheState}
                    variants={bloomVariants}
                    transition={{ duration: 4, ease: "easeInOut" }}
                />

                {/* Petals - Layer 1 */}
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={`petal-1-${i}`}
                        className="absolute w-40 h-40 border border-[var(--prismatic-1)]/30 rounded-full mix-blend-screen"
                        style={{ rotate: i * 60 }}
                        animate={breatheState}
                        variants={{
                            in: { scale: 1.5, x: 50, rotate: i * 60 + 45 },
                            hold: { scale: 1.55, x: 55, rotate: i * 60 + 50 },
                            out: { scale: 1, x: 0, rotate: i * 60 }
                        }}
                        transition={{ duration: 4, ease: "easeInOut" }}
                    />
                ))}

                {/* Petals - Layer 2 */}
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={`petal-2-${i}`}
                        className="absolute w-56 h-56 border border-[var(--prismatic-2)]/20 rounded-full mix-blend-screen"
                        style={{ rotate: i * 60 + 30 }}
                        animate={breatheState}
                        variants={{
                            in: { scale: 1.8, x: 80, rotate: i * 60 + 30 + 90 },
                            hold: { scale: 1.85, x: 85, rotate: i * 60 + 30 + 95 },
                            out: { scale: 1, x: 0, rotate: i * 60 + 30 }
                        }}
                        transition={{ duration: 4, ease: "easeInOut", delay: 0.2 }}
                    />
                ))}

                {/* Center Icon */}
                <motion.div
                    animate={breatheState}
                    variants={{
                        in: { scale: 1.2, opacity: 1 },
                        hold: { scale: 1.3, opacity: 0.8 },
                        out: { scale: 1.0, opacity: 0.5 }
                    }}
                    transition={{ duration: 4 }}
                >
                    <Flower2 className="w-16 h-16 text-white/80 opacity-50" strokeWidth={0.5} />
                </motion.div>
            </div>

            {/* Instruction Text */}
            <motion.div
                className="absolute bottom-20 flex flex-col items-center gap-4 z-20"
                animate={breatheState}
                variants={textVariants}
                transition={{ duration: 4 }}
            >
                <div className="flex items-center gap-3 text-[var(--prismatic-2)]/50">
                    <Wind className="w-4 h-4" />
                    <span className="font-mono-tech text-xs tracking-[0.3em] uppercase">
                        {breatheState === 'in' ? 'Inhale' : breatheState === 'hold' ? 'Hold' : 'Exhale'}
                    </span>
                </div>
            </motion.div>
        </div>
    );
};
