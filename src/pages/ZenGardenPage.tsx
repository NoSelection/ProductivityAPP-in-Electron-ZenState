import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flower2 } from 'lucide-react';

export const ZenGardenPage: React.FC = () => {
    const [breatheState, setBreatheState] = useState<'in' | 'hold' | 'out'>('in');
    const [showGreeting, setShowGreeting] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);

    // Breathing Cycle
    useEffect(() => {
        const interval = setInterval(() => {
            setBreatheState(prev => {
                if (prev === 'in') return 'hold';
                if (prev === 'hold') return 'out';
                return 'in';
            });
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    // Initial Greeting Timer
    useEffect(() => {
        const timer = setTimeout(() => setShowGreeting(false), 5000);
        return () => clearTimeout(timer);
    }, []);

    const artifactVariants = {
        in: { scale: 1.05, filter: "blur(0px)", opacity: 1 },
        hold: { scale: 1.05, filter: "blur(0px)", opacity: 0.9 },
        out: { scale: 1.0, filter: "blur(2px)", opacity: 0.6 }
    };

    return (
        <div ref={containerRef} className="h-full w-full relative overflow-hidden flex flex-col items-center justify-center select-none">

            {/* Minimal Greeting */}
            <AnimatePresence>
                {showGreeting && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, filter: 'blur(10px)' }}
                        transition={{ duration: 1.5 }}
                        className="absolute inset-0 flex items-center justify-center z-50 bg-[#030712]/80 backdrop-blur-xl"
                    >
                        <h1 className="text-display text-4xl text-white/80 font-light tracking-[0.2em] uppercase">
                            Breathe
                        </h1>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Central Artifact - Pure Light */}
            <motion.div className="relative w-96 h-96 flex items-center justify-center">
                {/* The Core Glow */}
                <motion.div
                    animate={breatheState}
                    variants={{
                        in: { opacity: 0.6, scale: 1.2 },
                        hold: { opacity: 0.8, scale: 1.3 },
                        out: { opacity: 0.3, scale: 1 }
                    }}
                    transition={{ duration: 4, ease: "easeInOut" }}
                    className="absolute inset-0 bg-white/5 rounded-full blur-[80px]"
                />

                {/* Geometric Rings */}
                {[...Array(3)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute border border-white/10 rounded-full"
                        style={{
                            width: `${60 + i * 20}%`,
                            height: `${60 + i * 20}%`,
                        }}
                        animate={{
                            rotate: i % 2 === 0 ? 360 : -360,
                            scale: breatheState === 'in' ? 1.05 : 1
                        }}
                        transition={{
                            rotate: { duration: 60 + i * 20, repeat: Infinity, ease: "linear" },
                            scale: { duration: 4, ease: "easeInOut" }
                        }}
                    />
                ))}

                {/* The Lotus */}
                <motion.div
                    animate={breatheState}
                    variants={artifactVariants}
                    transition={{ duration: 4, ease: "easeInOut" }}
                    className="relative z-10 text-white/80"
                >
                    <Flower2 size={64} strokeWidth={0.5} />
                </motion.div>
            </motion.div>

            {/* Breathing Text */}
            <motion.div
                className="absolute bottom-20 flex flex-col items-center gap-4"
                animate={breatheState}
                transition={{ duration: 4 }}
            >
                <div className="h-px w-12 bg-white/20" />
                <span className="text-tech text-[10px] tracking-[0.4em] uppercase text-white/40">
                    {breatheState === 'in' ? 'Inhale' : breatheState === 'hold' ? 'Hold' : 'Exhale'}
                </span>
            </motion.div>

        </div>
    );
};
