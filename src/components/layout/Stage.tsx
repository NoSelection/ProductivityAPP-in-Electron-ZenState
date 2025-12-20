import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

interface StageProps {
    children: React.ReactNode;
}

export const Stage: React.FC<StageProps> = ({ children }) => {
    const location = useLocation();

    return (
        <div className="flex-1 h-screen relative overflow-hidden flex flex-col">
            {/* Background System (Moved from old Layout, simplified) */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[#050505]" /> {/* Darker base */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--neon-cyan)_0%,_transparent_70%)] opacity-[0.03]" />
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-cyan/20 to-transparent" />
            </div>

            {/* Content Area */}
            <main className="relative z-10 flex-1 flex flex-col overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, scale: 0.98, filter: 'blur(5px)' }}
                        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, scale: 1.02, filter: 'blur(5px)' }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="flex-1 w-full h-full flex flex-col overflow-y-auto custom-scrollbar p-6 lg:p-8"
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
};
