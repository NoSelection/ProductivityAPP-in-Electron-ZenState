import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Stage } from './Stage';
import { SettingsPanel } from '../SettingsPanel';
import { ResetProtocol } from '../ResetProtocol';
import { AnimatePresence, motion } from 'framer-motion';
import { Minus, Square, X } from 'lucide-react';

interface MainLayoutProps {
    children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isResetOpen, setIsResetOpen] = useState(false);
    const [isFocusShieldActive, setIsFocusShieldActive] = useState(false);

    useEffect(() => {
        if (isFocusShieldActive) {
            document.body.classList.add('focus-shield-active');
        } else {
            document.body.classList.remove('focus-shield-active');
        }
    }, [isFocusShieldActive]);

    return (
        <div className="h-screen w-screen overflow-hidden flex bg-black text-white relative font-sans selection:bg-neon-cyan/30 selection:text-neon-cyan">

            {/* --- WINDOW CONTROLS & DRAG REGION --- */}
            <div className="fixed top-0 left-0 right-0 h-8 z-[9999] flex justify-end items-start pointer-events-none select-none">
                {/* Drag Area (invisible layer that captures drag) */}
                <div className="absolute inset-0 h-8 app-drag" />

                {/* Control Buttons (Top Right) */}
                <div className="relative z-[10000] flex items-center gap-1 p-2 pointer-events-auto app-no-drag bg-black/50 backdrop-blur-md rounded-bl-xl border-b border-l border-white/5">
                    <button
                        onClick={() => (window as any).ipcRenderer?.send('window-minimize')}
                        className="p-1.5 rounded-md text-white/40 hover:text-[var(--prismatic-2)] hover:bg-[var(--prismatic-2)]/10 transition-colors"
                        title="Minimize"
                    >
                        <Minus className="w-3.5 h-3.5" />
                    </button>
                    <button
                        onClick={() => (window as any).ipcRenderer?.send('window-maximize')}
                        className="p-1.5 rounded-md text-white/40 hover:text-[var(--prismatic-2)] hover:bg-[var(--prismatic-2)]/10 transition-colors"
                        title="Maximize"
                    >
                        <Square className="w-3 h-3" />
                    </button>
                    <button
                        onClick={() => (window as any).ipcRenderer?.send('window-close')}
                        className="p-1.5 rounded-md text-white/40 hover:text-[var(--prismatic-1)] hover:bg-[var(--prismatic-1)]/10 transition-colors"
                        title="Close"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* GLOBAL BACKGROUND - Renders behind everything */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                {/* Cyber Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />

                {/* Scanlines */}
                <div className="scanlines opacity-50" />
            </div>

            {/* SIDEBAR */}
            <Sidebar
                isCollapsed={isSidebarCollapsed}
                toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                isSettingsOpen={isSettingsOpen}
                toggleSettings={() => setIsSettingsOpen(!isSettingsOpen)}
                isFocusShieldActive={isFocusShieldActive}
                toggleFocusShield={() => setIsFocusShieldActive(!isFocusShieldActive)}
            />

            {/* STAGE (Main Content) */}
            <Stage>
                {/* Add top padding to account for window controls if needed, generally layout handles it */}
                {children}
            </Stage>

            {/* FOCUS SHIELD OVERLAY */}
            <AnimatePresence>
                {isFocusShieldActive && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8 }}
                        className="fixed inset-0 z-[60] flex flex-col items-center justify-end pb-20"
                    >
                        <div className="absolute inset-0 bg-black/95 backdrop-blur-md -z-10" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50 -z-10" />

                        {/* DEACTIVATE BUTTON (Escape Hatch) */}
                        <motion.button
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 1 }}
                            onClick={() => setIsFocusShieldActive(false)}
                            className="group relative px-8 py-3 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 font-display text-xs tracking-[0.2em] hover:bg-red-500/20 hover:text-red-300 transition-all z-50 flex items-center gap-3 overflow-hidden"
                        >
                            <span className="relative z-10">DEACTIVATE SHIELD</span>
                            <div className="absolute inset-0 bg-red-500/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        </motion.button>

                        {/* Cyber Frame - Visual Indicator that you are in Focus Mode */}
                        <div className="absolute inset-4 border border-neon-cyan/5 rounded-3xl pointer-events-none">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-neon-cyan/20 shadow-[0_0_20px_#00f0ff]" />
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-neon-cyan/20 shadow-[0_0_20px_#00f0ff]" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* GLOBAL MODALS */}
            <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
            <ResetProtocol isOpen={isResetOpen} onClose={() => setIsResetOpen(false)} />
        </div>
    );
};
