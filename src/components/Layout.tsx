import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../lib/utils'

interface LayoutProps {
    children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="relative h-screen w-screen bg-[#090a0f] text-slate-200 font-sans overflow-hidden border border-white/5 rounded-lg">
            {/* 1. The Background (Depth) */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800/10 via-slate-950/40 to-[#090a0f] pointer-events-none" />
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />

            {/* Custom Drag Region / Title Bar */}
            <div className="h-10 w-full flex items-center justify-between px-6 select-none app-drag relative z-50">
                <div className="text-[10px] font-bold tracking-[0.3em] text-slate-500/80 uppercase">
                    ZenState <span className="text-slate-700 mx-2">//</span> Focus OS
                </div>
                <div className="flex gap-3 app-no-drag">
                    <div className="w-3 h-3 rounded-full bg-white/5 border border-white/5 hover:bg-yellow-500/50 transition-colors cursor-pointer" title="Minimize"></div>
                    <div className="w-3 h-3 rounded-full bg-white/5 border border-white/5 hover:bg-red-500/50 transition-colors cursor-pointer" title="Close" onClick={() => window.close()}></div>
                </div>
            </div>

            {/* Content Area - Bento Grid */}
            <motion.main
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex-1 p-6 grid grid-cols-1 md:grid-cols-3 grid-rows-2 gap-6 relative z-10 h-[calc(100vh-40px)]"
            >
                {children}
            </motion.main>
        </div>
    )
}
