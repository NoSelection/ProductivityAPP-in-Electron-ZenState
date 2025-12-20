import React, { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { SettingsPanel } from './SettingsPanel'
import { ResetProtocol } from './ResetProtocol'
import { cn } from '../lib/utils'
import {
    Settings, X, Minus, Square,
    LayoutDashboard, Compass,
    Shield, ShieldAlert, Wind
} from 'lucide-react'

interface LayoutProps {
    children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    const location = useLocation()
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isResetOpen, setIsResetOpen] = useState(false)
    const [isFocusShieldActive, setIsFocusShieldActive] = useState(false)

    useEffect(() => {
        if (isFocusShieldActive) {
            document.body.classList.add('focus-shield-active')
        } else {
            document.body.classList.remove('focus-shield-active')
        }
    }, [isFocusShieldActive])

    return (
        <div className="h-screen w-screen overflow-hidden flex flex-col relative font-sans selection:bg-accent-base/30 selection:text-white">
            {/* Nebula 2.0 Background */}
            <div className="nebula-surface">
                <div className="neu-glow absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-accent-base/5 to-transparent pointer-events-none" />
                <div className="nebula-cloud nebula-1" />
                <div className="nebula-cloud nebula-2" />
            </div>

            {/* Cinematic Header */}
            <header className="h-12 lg:h-14 app-drag flex items-center justify-between px-4 lg:px-8 relative z-[70] shrink-0 border-b border-white/[0.03] backdrop-blur-sm">
                <div className="flex items-center gap-4 lg:gap-8">
                    <h1 className="text-[9px] lg:text-[10px] font-black tracking-[0.4em] lg:tracking-[0.5em] text-white/50 uppercase font-mono-tech flex items-center gap-2 lg:gap-3">
                        <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-accent-base animate-pulse" />
                        ZenState
                    </h1>

                    <div className="flex items-center gap-0.5 bg-white/[0.03] border border-white/10 p-1 rounded-lg app-no-drag">
                        {[
                            { path: '/', label: 'Dash', icon: LayoutDashboard },
                            { path: '/codex', label: 'Codex', icon: Compass },
                        ].map((nav) => {
                            const isActive = location.pathname === nav.path
                            return (
                                <Link
                                    key={nav.path}
                                    to={nav.path}
                                    className={cn(
                                        "flex items-center gap-1.5 px-3 lg:px-4 py-2 rounded-md transition-all text-[9px] lg:text-[10px] font-bold uppercase tracking-wider",
                                        isActive ? "text-accent-base bg-white/5" : "text-white/20 hover:text-white/40"
                                    )}
                                >
                                    <nav.icon className={cn("w-3 h-3 lg:w-3.5 lg:h-3.5", isActive ? "opacity-100" : "opacity-40")} />
                                    <span className="hidden sm:inline">{nav.label}</span>
                                </Link>
                            )
                        })}
                    </div>
                </div>

                <div className="flex items-center gap-3 lg:gap-6 app-no-drag">
                    <button
                        onClick={() => setIsSettingsOpen(true)}
                        className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-all"
                    >
                        <Settings className="w-4 h-4" />
                    </button>

                    <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-white/10">
                        <button className="text-white/30 hover:text-white transition-colors p-1"><Minus className="w-3.5 h-3.5" /></button>
                        <button className="text-white/30 hover:text-white transition-colors p-1"><Square className="w-3 h-3" /></button>
                        <button className="text-white/30 hover:text-red-500/80 transition-colors p-1"><X className="w-4 h-4" /></button>
                    </div>
                </div>
            </header>

            {/* Main OS Hub - Handles global scrolling for mobile */}
            <div className="flex-1 min-h-0 relative z-10 flex flex-col overflow-y-auto lg:overflow-hidden custom-scrollbar">
                <main className="flex-1 w-full max-w-[1800px] mx-auto p-4 lg:p-8 pb-20 lg:pb-6 flex flex-col min-h-0">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 15, filter: 'blur(12px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, y: -15, filter: 'blur(12px)' }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            className="flex-1 flex flex-col min-h-0"
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>

            {/* Control Bar */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[80] flex items-center gap-2 p-1.5 rounded-xl bg-black/50 backdrop-blur-xl border border-white/10">
                <button
                    onClick={() => setIsResetOpen(true)}
                    className="p-3 rounded-lg hover:bg-white/5 text-white/30 hover:text-accent-secondary transition-all group relative"
                >
                    <Wind className="w-5 h-5" />
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/90 rounded-md text-[9px] font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity border border-white/10 whitespace-nowrap text-accent-secondary">Reset</span>
                </button>
                <div className="w-px h-6 bg-white/10" />
                <button
                    onClick={() => setIsFocusShieldActive(!isFocusShieldActive)}
                    className={cn(
                        "p-3 rounded-lg transition-all group relative",
                        isFocusShieldActive ? "bg-accent-base/20 text-accent-base" : "hover:bg-white/5 text-white/30 hover:text-accent-base"
                    )}
                >
                    {isFocusShieldActive ? <ShieldAlert className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/90 rounded-md text-[9px] font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity border border-white/10 whitespace-nowrap text-accent-base">Focus</span>
                </button>
            </div>

            {/* Neural Shield Overlay Layer */}
            <AnimatePresence>
                {isFocusShieldActive && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[65] pointer-events-none"
                    >
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-2xl" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] border border-white/5 rounded-[4rem] pointer-events-none opacity-20" />
                    </motion.div>
                )}
            </AnimatePresence>

            <ResetProtocol isOpen={isResetOpen} onClose={() => setIsResetOpen(false)} />
            <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        </div>
    )
}
