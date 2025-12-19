import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { SettingsPanel } from './SettingsPanel'
import { Settings, X, Minus, Square } from 'lucide-react'

interface LayoutProps {
    children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    return (
        <div className="h-screen w-screen overflow-hidden flex flex-col relative font-sans selection:bg-accent-base/30 selection:text-white">
            {/* Nebula 2.0 Background */}
            <div className="nebula-surface">
                <div className="nebula-cloud nebula-1" />
                <div className="nebula-cloud nebula-2" />
            </div>

            {/* Cinematic Header */}
            <header className="h-14 lg:h-16 app-drag flex items-center justify-between px-4 lg:px-10 relative z-50 shrink-0">
                <div className="flex items-center gap-6">
                    <div className="flex flex-col">
                        <h1 className="text-[10px] font-black tracking-[0.6em] text-white/50 uppercase font-mono-tech flex items-center gap-4">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent-base animate-pulse shadow-[0_0_15px_hsla(var(--accent-base),0.8)]" />
                            ZenState // Neural OS
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-8 app-no-drag">
                    <button
                        onClick={() => setIsSettingsOpen(true)}
                        className="p-2 lg:p-2.5 rounded-2xl hover:bg-white/5 text-white/50 hover:text-white transition-all group border border-transparent hover:border-white/10"
                    >
                        <Settings className="w-4 h-4 group-hover:rotate-90 transition-transform duration-700" />
                    </button>

                    <div className="flex items-center gap-4 pl-4 border-l border-white/10">
                        <button className="text-white/40 hover:text-white transition-colors">
                            <Minus className="w-4 h-4" />
                        </button>
                        <button className="text-white/40 hover:text-white transition-colors">
                            <Square className="w-3 h-3" />
                        </button>
                        <button className="text-white/40 hover:text-red-400 transition-colors">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Settings Side Panel */}
            <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

            {/* Content Area - ADAPTIVE: Flow on Mobile, Locked on Desktop */}
            <div className="flex-1 min-h-0 overflow-hidden relative z-10 flex flex-col">
                <motion.main
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="flex-1 min-h-0 p-4 lg:p-6 xl:p-10 grid grid-cols-1 lg:grid-cols-3 lg:grid-rows-[minmax(0,1fr)_minmax(0,1fr)] gap-4 lg:gap-6 max-w-[1800px] w-full mx-auto overflow-y-auto lg:overflow-hidden pb-10 lg:pb-10"
                >
                    {children}
                </motion.main>
            </div>
        </div>
    )
}
