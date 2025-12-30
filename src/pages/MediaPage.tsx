import React from 'react';
import { MediaDeck } from '../components/MediaDeck';
import { motion } from 'framer-motion';

export const MediaPage: React.FC = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="h-full w-full flex flex-col items-center justify-center relative overflow-hidden"
        >
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-sky-500/5 blur-[120px] rounded-full animate-pulse-slow" />
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full" />
            </div>

            <div className="relative z-10 w-full max-w-2xl px-6 flex flex-col gap-12">

                {/* Minimal Header */}
                <div className="text-center space-y-2">
                    <motion.h1
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-display text-4xl lg:text-5xl text-white/90 font-light tracking-tight"
                    >
                        Atmosphere
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-serif text-lg text-white/40 italic"
                    >
                        Design your silence.
                    </motion.p>
                </div>

                {/* The Deck */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="glass-panel rounded-3xl p-1"
                >
                    <div className="bg-black/20 rounded-[20px] p-8 backdrop-blur-md">
                        <MediaDeck />
                    </div>
                </motion.div>

            </div>
        </motion.div>
    );
};
