import React, { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { SettingsPanel } from './SettingsPanel'
import { ResetProtocol } from './ResetProtocol'
import { cn } from '../lib/utils'
import {
    Settings, X, Minus, Square,
    LayoutDashboard, Compass,
    Shield, ShieldAlert, Wind, Zap
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
        <div className="h-screen w-screen overflow-hidden flex flex-col relative">
            {/* HYPER Background System */}
            <div className="hyper-bg">
                <div className="cyber-grid" />
                <div className="scan-beam" />
            </div>

            {/* Scanlines Overlay */}
            <div className="scanlines" />

            {/* HYPER Header */}
            <header className="h-14 lg:h-16 app-drag flex items-center justify-between px-4 lg:px-8 relative z-[70] shrink-0 border-b border-neon-cyan/10 bg-black/30 backdrop-blur-xl">
                {/* Left Section - Logo & Nav */}
                <div className="flex items-center gap-6 lg:gap-10">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Zap className="w-5 h-5 lg:w-6 lg:h-6 text-neon-cyan" style={{ filter: 'drop-shadow(0 0 10px var(--neon-cyan))' }} />
                            <div className="absolute inset-0 animate-ping">
                                <Zap className="w-5 h-5 lg:w-6 lg:h-6 text-neon-cyan opacity-30" />
                            </div>
                        </div>
                        <h1 className="font-display text-sm lg:text-base font-bold tracking-[0.3em] text-neon-cyan uppercase glitch" data-text="ZENSTATE">
                            ZENSTATE
                        </h1>
                    </div>

                    {/* Navigation */}
                    <nav className="flex items-center gap-1 p-1 rounded-lg bg-black/40 border border-neon-cyan/10 app-no-drag">
                        {[
                            { path: '/', label: 'Dashboard', icon: LayoutDashboard },
                            { path: '/codex', label: 'Codex', icon: Compass },
                        ].map((nav) => {
                            const isActive = location.pathname === nav.path
                            return (
                                <Link
                                    key={nav.path}
                                    to={nav.path}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2.5 rounded-md transition-all duration-300 font-display text-[10px] lg:text-xs font-semibold uppercase tracking-widest relative overflow-hidden group",
                                        isActive
                                            ? "text-neon-cyan bg-neon-cyan/10 shadow-[inset_0_0_20px_rgba(0,240,255,0.1)]"
                                            : "text-white/30 hover:text-neon-cyan/70 hover:bg-white/5"
                                    )}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="nav-glow"
                                            className="absolute inset-0 bg-gradient-to-r from-neon-cyan/20 via-transparent to-neon-magenta/10"
                                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                        />
                                    )}
                                    <nav.icon className={cn(
                                        "w-3.5 h-3.5 lg:w-4 lg:h-4 relative z-10 transition-all",
                                        isActive && "drop-shadow-[0_0_8px_#00f0ff]"
                                    )} />
                                    <span className="hidden sm:inline relative z-10">{nav.label}</span>
                                </Link>
                            )
                        })}
                    </nav>
                </div>

                {/* Right Section - Controls */}
                <div className="flex items-center gap-4 lg:gap-6 app-no-drag">
                    {/* System Status */}
                    <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-md bg-black/40 border border-white/5">
                        <div className="pulse-dot" />
                        <span className="font-mono-tech text-[9px] text-neon-cyan/60 uppercase tracking-widest">System Online</span>
                    </div>

                    {/* Settings */}
                    <button
                        onClick={() => setIsSettingsOpen(true)}
                        className="p-2.5 rounded-lg bg-black/30 border border-white/10 text-white/40 hover:text-neon-cyan hover:border-neon-cyan/30 hover:shadow-[0_0_20px_rgba(0,240,255,0.2)] transition-all duration-300"
                    >
                        <Settings className="w-4 h-4 lg:w-5 lg:h-5" />
                    </button>

                    {/* Window Controls */}
                    <div className="hidden sm:flex items-center gap-1 pl-4 border-l border-white/10 app-no-drag">
                        <button
                            onClick={() => (window as Window & { ipcRenderer?: { send: (channel: string) => void } }).ipcRenderer?.send('window-minimize')}
                            className="p-2 rounded text-white/20 hover:text-neon-lime hover:bg-neon-lime/10 transition-all"
                        >
                            <Minus className="w-3.5 h-3.5" />
                        </button>
                        <button
                            onClick={() => (window as Window & { ipcRenderer?: { send: (channel: string) => void } }).ipcRenderer?.send('window-maximize')}
                            className="p-2 rounded text-white/20 hover:text-neon-cyan hover:bg-neon-cyan/10 transition-all"
                        >
                            <Square className="w-3 h-3" />
                        </button>
                        <button
                            onClick={() => (window as Window & { ipcRenderer?: { send: (channel: string) => void } }).ipcRenderer?.send('window-close')}
                            className="p-2 rounded text-white/20 hover:text-neon-magenta hover:bg-neon-magenta/10 transition-all"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="flex-1 min-h-0 relative z-10 flex flex-col overflow-y-auto lg:overflow-hidden custom-scrollbar">
                <main className="flex-1 w-full max-w-[1920px] mx-auto p-4 lg:p-8 pb-28 lg:pb-8 flex flex-col min-h-0">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            className="flex-1 flex flex-col min-h-0"
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>

            {/* HYPER Control Bar */}
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[80] flex items-center gap-2 p-2 rounded-2xl bg-black/70 backdrop-blur-2xl border border-neon-cyan/20 shadow-[0_0_40px_rgba(0,240,255,0.1)]"
            >
                {/* Corner Accents */}
                <div className="absolute -top-px left-4 right-4 h-px bg-gradient-to-r from-transparent via-neon-cyan/50 to-transparent" />
                <div className="absolute -bottom-px left-4 right-4 h-px bg-gradient-to-r from-transparent via-neon-magenta/30 to-transparent" />

                {/* Reset Button */}
                <button
                    onClick={() => setIsResetOpen(true)}
                    className="relative p-3.5 rounded-xl bg-black/50 border border-white/5 text-white/30 hover:text-neon-lime hover:border-neon-lime/30 hover:bg-neon-lime/5 hover:shadow-[0_0_20px_rgba(57,255,20,0.2)] transition-all duration-300 group"
                >
                    <Wind className="w-5 h-5 group-hover:animate-pulse" />
                    <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-black/90 rounded-lg font-display text-[9px] font-bold uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all duration-300 border border-neon-lime/20 whitespace-nowrap text-neon-lime shadow-[0_0_20px_rgba(57,255,20,0.2)]">
                        Reset Protocol
                    </span>
                </button>

                {/* Divider */}
                <div className="w-px h-8 bg-gradient-to-b from-transparent via-neon-cyan/20 to-transparent" />

                {/* Focus Shield */}
                <button
                    onClick={() => setIsFocusShieldActive(!isFocusShieldActive)}
                    className={cn(
                        "relative p-3.5 rounded-xl border transition-all duration-300 group",
                        isFocusShieldActive
                            ? "bg-neon-cyan/10 border-neon-cyan/40 text-neon-cyan shadow-[0_0_30px_rgba(0,240,255,0.3),inset_0_0_20px_rgba(0,240,255,0.1)]"
                            : "bg-black/50 border-white/5 text-white/30 hover:text-neon-cyan hover:border-neon-cyan/30 hover:bg-neon-cyan/5"
                    )}
                >
                    {isFocusShieldActive ? (
                        <ShieldAlert className="w-5 h-5 animate-pulse" style={{ filter: 'drop-shadow(0 0 10px var(--neon-cyan))' }} />
                    ) : (
                        <Shield className="w-5 h-5" />
                    )}
                    <span className={cn(
                        "absolute -top-12 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-black/90 rounded-lg font-display text-[9px] font-bold uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all duration-300 border whitespace-nowrap shadow-lg",
                        isFocusShieldActive
                            ? "border-neon-cyan/30 text-neon-cyan"
                            : "border-white/10 text-white/60"
                    )}>
                        {isFocusShieldActive ? 'Shield Active' : 'Focus Shield'}
                    </span>
                </button>
            </motion.div>

            {/* Focus Shield Overlay */}
            <AnimatePresence>
                {isFocusShieldActive && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8 }}
                        className="fixed inset-0 z-[65] pointer-events-none"
                    >
                        <div className="absolute inset-0 bg-black/70 backdrop-blur-2xl" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" />
                        {/* Cyber Frame */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] h-[75vh] border border-neon-cyan/10 rounded-3xl">
                            <div className="absolute -top-px left-10 right-10 h-px bg-gradient-to-r from-transparent via-neon-cyan/40 to-transparent" />
                            <div className="absolute -bottom-px left-10 right-10 h-px bg-gradient-to-r from-transparent via-neon-magenta/30 to-transparent" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <ResetProtocol isOpen={isResetOpen} onClose={() => setIsResetOpen(false)} />
            <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        </div>
    )
}
