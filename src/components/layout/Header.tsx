import React from 'react';
import { RefreshCw, X } from 'lucide-react';

export const Header: React.FC = () => {
    return (
        <header className="fixed top-0 left-0 right-0 h-24 z-40 flex items-center justify-between px-10 pointer-events-none select-none">
            {/* Drag Region */}
            <div className="absolute inset-0 z-0" style={{ WebkitAppRegion: 'drag' } as any} />

            {/* Brand - Floating Top Left */}
            <div className="flex flex-col pointer-events-auto relative z-10" style={{ WebkitAppRegion: 'no-drag' } as any}>
                <h1 className="font-display text-3xl tracking-[0.05em] text-transparent bg-clip-text bg-gradient-to-r from-text-main via-text-main to-text-muted transition-all duration-700">
                    ZENSTATE
                </h1>
                <span className="text-[10px] font-tech text-accent-highlight tracking-[0.4em] uppercase opacity-60">
                    Crystal OS // v2.0
                </span>
            </div>

            {/* Status Hub - Floating Top Right */}
            <div className="flex items-center gap-4 pointer-events-auto" style={{ WebkitAppRegion: 'no-drag' } as any}>
                <div className="hidden md:flex flex-col items-end">
                    <span className="text-[10px] font-tech text-accent-secondary uppercase tracking-widest">System Status</span>
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-xs text-text-main font-medium">Synchronized</span>
                    </div>
                </div>

                <div className="h-8 w-[1px] bg-glass-border hidden md:block" />

                <button
                    onClick={() => window.location.reload()}
                    className="group relative w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                    title="Force Sync"
                >
                    <div className="absolute inset-0 bg-glass-surface rounded-full border border-glass-border group-hover:border-accent-highlight/50 transition-colors" />
                    <RefreshCw size={14} className="text-text-muted group-hover:text-accent-highlight transition-colors group-hover:rotate-180 duration-700" />
                </button>

                <div className="h-8 w-[1px] bg-glass-border hidden md:block" />

                {/* Window Controls */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => window.ipcRenderer.send('window-minimize')}
                        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-glass-surface text-text-muted hover:text-text-main transition-colors"
                    >
                        <div className="w-3 h-0.5 bg-current opacity-70" />
                    </button>
                    <button
                        onClick={() => window.ipcRenderer.send('window-maximize')}
                        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-glass-surface text-text-muted hover:text-text-main transition-colors"
                    >
                        <div className="w-3 h-3 border-2 border-current opacity-70 rounded-[2px]" />
                    </button>
                    <button
                        onClick={() => window.ipcRenderer.send('window-close')}
                        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-500/20 text-text-muted hover:text-red-400 transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>
        </header>
    );
};
