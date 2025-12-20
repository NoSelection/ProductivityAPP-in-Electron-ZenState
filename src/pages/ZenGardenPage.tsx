import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flower2, Activity } from 'lucide-react';

export const ZenGardenPage: React.FC = () => {
    const [breatheState, setBreatheState] = useState<'in' | 'hold' | 'out'>('in');
    const [showBirthday, setShowBirthday] = useState(true);
    const [clickBursts, setClickBursts] = useState<{ id: number, x: number, y: number }[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    // Breathing Cycle (staggered for more natural feel)
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

    // Birthday Message Timer
    useEffect(() => {
        const timer = setTimeout(() => setShowBirthday(false), 12000);
        return () => clearTimeout(timer);
    }, []);

    const handleClick = (e: React.MouseEvent) => {
        const id = Date.now();
        setClickBursts(prev => [...prev, { id, x: e.clientX, y: e.clientY }]);
        setTimeout(() => {
            setClickBursts(prev => prev.filter(b => b.id !== id));
        }, 1000);
    };

    const artifactVariants = {
        in: { scale: 1.1, rotateY: 15, rotateX: -5, boxShadow: "0 0 50px rgba(var(--prismatic-2-rgb), 0.3)" },
        hold: { scale: 1.15, rotateY: 20, rotateX: -10, boxShadow: "0 0 80px rgba(var(--prismatic-2-rgb), 0.5)" },
        out: { scale: 1.0, rotateY: 0, rotateX: 0, boxShadow: "0 0 20px rgba(var(--prismatic-2-rgb), 0.1)" }
    };

    return (
        <div
            ref={containerRef}
            onClick={handleClick}
            className="h-full w-full relative overflow-hidden flex bg-[#050510] mesh-bg cursor-none"
        >
            {/* NOISE & GRAIN */}
            <div className="noise-overlay" />

            {/* ASYMMETRIC HUD - LEFT TELEMETRY */}
            <div className="absolute left-8 top-0 bottom-0 w-24 border-x border-white/5 py-20 flex flex-col gap-8 items-center z-10 hidden lg:flex">
                <div className="flex flex-col items-center gap-2 opacity-20">
                    <Activity className="w-4 h-4 text-[var(--prismatic-2)]" />
                    <span className="font-mono-tech text-[8px] vertical-text tracking-[0.5em] uppercase text-white">Neural Load</span>
                </div>
                <div className="flex-1 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
                <div className="flex flex-col gap-1 font-mono-tech text-[7px] text-white/20 select-none">
                    {[...Array(20)].map((_, i) => (
                        <motion.span
                            key={i}
                            animate={{ opacity: [0.1, 0.4, 0.1] }}
                            transition={{ duration: 2 + i % 3, repeat: Infinity, delay: i * 0.1 }}
                        >
                            {Math.random().toString(16).substring(2, 10).toUpperCase()}
                        </motion.span>
                    ))}
                </div>
            </div>

            {/* MAIN SANCTUARY AREA */}
            <div className="flex-1 relative flex flex-col items-center justify-center p-20">

                {/* BIRTHDAY PROTOCOL (Sacred Edition) */}
                <AnimatePresence>
                    {showBirthday && (
                        <motion.div
                            initial={{ opacity: 0, filter: 'blur(20px)', letterSpacing: '2em' }}
                            animate={{ opacity: 1, filter: 'blur(0px)', letterSpacing: '0.5em' }}
                            exit={{ opacity: 0, y: -100, filter: 'blur(40px)' }}
                            transition={{ duration: 3, ease: [0.16, 1, 0.3, 1] }}
                            className="absolute inset-0 flex flex-col items-center justify-center z-50 pointer-events-none"
                        >
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.4 }}
                                className="font-serif-elegant italic text-2xl text-[var(--prismatic-3)] mb-8"
                            >
                                An Archival Record of Existence
                            </motion.span>
                            <h1 className="font-display text-7xl md:text-9xl font-bold text-white tracking-[0.5em] uppercase leading-none text-center">
                                HAPPY<br />BIRTHDAY
                            </h1>
                            <div className="mt-12 flex items-center gap-6">
                                <div className="h-px w-24 bg-gradient-to-r from-transparent to-white/30" />
                                <span className="font-mono-tech text-xs text-white/40 tracking-[0.8em]">LEVEL_INCREMENT_CONFIRMED</span>
                                <div className="h-px w-24 bg-gradient-to-l from-transparent to-white/30" />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* THE CORE ARTIFACT (Monolith) */}
                <motion.div
                    className="relative w-80 h-80 lg:w-[500px] lg:h-[500px] flex items-center justify-center overflow-visible"
                    style={{ perspective: 1000 }}
                >
                    {/* Shadow Plate */}
                    <div className="absolute inset-0 bg-black/40 blur-[100px] rounded-full" />

                    {/* Central Harmonic Resonator */}
                    <motion.div
                        className="relative z-10 w-full h-full flex items-center justify-center"
                        animate={breatheState}
                        variants={artifactVariants}
                        transition={{ duration: 4, ease: "easeInOut" }}
                    >
                        {/* THE "FLOWER OF LIFE" GEOMETRY */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            {[...Array(3)].map((_, layer) => (
                                <motion.div
                                    key={`geo-${layer}`}
                                    className="absolute border border-white/5 rounded-full"
                                    style={{
                                        width: `${100 - layer * 20}%`,
                                        height: `${100 - layer * 20}%`,
                                        borderStyle: layer % 2 === 0 ? 'solid' : 'dashed'
                                    }}
                                    animate={{ rotate: (layer + 1) * 60 }}
                                    transition={{ duration: 20 + layer * 10, repeat: Infinity, ease: "linear" }}
                                />
                            ))}

                            {/* Hexagonal Core */}
                            <motion.div
                                className="w-1/2 h-1/2 border-2 border-[var(--prismatic-2)]/40 flex items-center justify-center bg-black/20 backdrop-blur-xl"
                                style={{ clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' }}
                                animate={breatheState}
                                variants={{
                                    in: { scale: 1.2, rotate: 180 },
                                    hold: { scale: 1.3, rotate: 190 },
                                    out: { scale: 1.0, rotate: 0 }
                                }}
                                transition={{ duration: 4, ease: "easeInOut" }}
                            >
                                <Flower2 className="w-16 h-16 text-white opacity-80" strokeWidth={0.5} />
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Orbiting HUD Shards */}
                    <AnimatePresence>
                        {[...Array(8)].map((_, i) => (
                            <motion.div
                                key={`shard-${i}`}
                                className="absolute w-12 h-px bg-gradient-to-r from-transparent via-[var(--prismatic-2)] to-transparent"
                                style={{
                                    rotate: i * 45,
                                    originX: 0.5,
                                    originY: 0.5,
                                    translateX: 240,
                                }}
                                animate={{
                                    rotate: [i * 45, i * 45 + 360],
                                    opacity: [0.2, 0.5, 0.2]
                                }}
                                transition={{
                                    rotate: { duration: 15 + i, repeat: Infinity, ease: "linear" },
                                    opacity: { duration: 3, repeat: Infinity, delay: i * 0.5 }
                                }}
                            />
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* ASYMMETRIC QUOTE - RIGHT SIDE */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1, duration: 2 }}
                    className="absolute right-20 bottom-20 max-w-xs text-right hidden xl:block"
                >
                    <p className="font-serif-elegant italic text-xl text-white/40 leading-relaxed text-justify-extreme">
                        "The soul is a frequency, a resonance in the void of the digital age. In stillness, we find the carrier signal."
                    </p>
                    <div className="mt-4 flex flex-col items-end gap-1">
                        <span className="font-mono-tech text-[9px] uppercase tracking-[0.4em] text-[var(--prismatic-3)]">Operator Protocol</span>
                        <div className="h-px w-full bg-white/10" />
                    </div>
                </motion.div>
            </div>

            {/* CLICK BURST EFFECT */}
            <AnimatePresence>
                {clickBursts.map(burst => (
                    <motion.div
                        key={burst.id}
                        initial={{ opacity: 1, scale: 0 }}
                        animate={{ opacity: 0, scale: 4 }}
                        exit={{ opacity: 0 }}
                        className="fixed pointer-events-none z-[100] w-12 h-12 border border-[var(--prismatic-2)] rounded-full border-dashed"
                        style={{ left: burst.x - 24, top: burst.y - 24 }}
                    />
                ))}
            </AnimatePresence>

            {/* CUSTOM CURSOR REPLACEMENT */}
            <CursorOverlay />

            {/* BREATH INDICATOR - ABSOLUTE BOTTOM */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
                <motion.span
                    animate={breatheState}
                    variants={{
                        in: { opacity: 1, y: 0 },
                        hold: { opacity: 0.7, scale: 1.1 },
                        out: { opacity: 0.4, y: 10 }
                    }}
                    className="font-mono-tech text-xs tracking-[1em] uppercase text-white/40"
                >
                    {breatheState === 'in' ? 'Deep Inhale' : breatheState === 'hold' ? 'Neural Seal' : 'Slow Release'}
                </motion.span>
                <div className="w-1 h-32 bg-white/5 relative overflow-hidden rounded-full">
                    <motion.div
                        className="absolute bottom-0 left-0 right-0 bg-white/20"
                        animate={breatheState}
                        variants={{
                            in: { height: '100%', backgroundColor: 'rgba(var(--prismatic-2-rgb), 0.4)' },
                            hold: { height: '100%', backgroundColor: 'rgba(var(--prismatic-3-rgb), 0.4)' },
                            out: { height: '0%', backgroundColor: 'rgba(var(--prismatic-1-rgb), 0.4)' }
                        }}
                        transition={{ duration: 4, ease: "easeInOut" }}
                    />
                </div>
            </div>
        </div>
    );
};

// Custom Cursor component
const CursorOverlay = () => {
    const [pos, setPos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMove = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
        window.addEventListener('mousemove', handleMove);
        return () => window.removeEventListener('mousemove', handleMove);
    }, []);

    return (
        <>
            <motion.div
                className="fixed w-3 h-3 bg-white rounded-full z-[99999] pointer-events-none mix-blend-difference"
                animate={{ x: pos.x - 6, y: pos.y - 6 }}
                transition={{ type: 'spring', damping: 30, stiffness: 200, mass: 0.5 }}
            />
            <motion.div
                className="fixed w-8 h-8 border border-white/20 rounded-full z-[99999] pointer-events-none"
                animate={{ x: pos.x - 16, y: pos.y - 16 }}
                transition={{ type: 'spring', damping: 20, stiffness: 100, mass: 1 }}
            />
        </>
    );
};
