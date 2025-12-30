import React from 'react';
import { motion } from 'framer-motion';

export const DashboardPage: React.FC = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="max-w-6xl mx-auto w-full flex flex-col justify-center min-h-[80vh] gap-16"
        >
            {/* Minimalist Hero */}
            <header className="relative z-10 space-y-2">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                >
                    <span className="text-tech text-xs uppercase tracking-[0.3em] text-white/40 ml-1">
                        System Online
                    </span>
                    <h1 className="text-display text-7xl lg:text-9xl text-white tracking-tighter text-glow-subtle mix-blend-overlay">
                        ZenState
                    </h1>
                </motion.div>

                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="text-serif text-2xl lg:text-3xl text-white/60 font-light max-w-2xl"
                >
                    "The mind is a void. Let the code fill it."
                </motion.p>
            </header>

            {/* Floating Glass Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { label: 'Deep Work', value: '4.2', unit: 'hrs' },
                    { label: 'Flow State', value: '87', unit: '%' },
                    { label: 'Streak', value: '12', unit: 'days' },
                ].map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6 + (i * 0.1), duration: 0.8 }}
                        className="glass-panel rounded-2xl p-8 flex flex-col justify-between group h-48"
                    >
                        <div className="flex justify-between items-start">
                            <span className="text-tech text-[10px] uppercase tracking-widest text-white/30 group-hover:text-white/60 transition-colors">
                                {stat.label}
                            </span>
                            <div className="w-1 h-1 rounded-full bg-white/20 group-hover:bg-white/80 transition-colors" />
                        </div>

                        <div className="flex items-baseline gap-2">
                            <span className="text-display text-6xl text-white/90 group-hover:text-white transition-colors">
                                {stat.value}
                            </span>
                            <span className="text-serif text-xl text-white/40 italic">
                                {stat.unit}
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Subtle Action Line */}
            <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: '100%', opacity: 1 }}
                transition={{ delay: 1, duration: 1.5 }}
                className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
            />
        </motion.div>
    );
};
