import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Stage } from './Stage';
import { SettingsPanel } from '../SettingsPanel';
import { ResetProtocol } from '../ResetProtocol';
import { AnimatePresence, motion } from 'framer-motion';

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
                        className="fixed inset-0 z-[60] pointer-events-none"
                    >
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" />
                        
                        {/* Cyber Frame - Visual Indicator that you are in Focus Mode */}
                        <div className="absolute inset-4 border border-neon-cyan/20 rounded-3xl pointer-events-none">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-neon-cyan/50 shadow-[0_0_20px_#00f0ff]" />
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-neon-cyan/50 shadow-[0_0_20px_#00f0ff]" />
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
