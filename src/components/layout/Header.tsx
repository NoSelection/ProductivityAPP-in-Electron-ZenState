import React from 'react';
import { RefreshCw } from 'lucide-react';

export const Header: React.FC = () => {
    return (
        <header className="fixed top-0 left-0 right-0 h-24 z-40 flex items-center justify-between px-10 pointer-events-none select-none">
            {/* Brand - Floating Top Left */}
            <div className="flex flex-col pointer-events-auto">
                <h1 className="font-display text-3xl tracking-[0.05em] text-transparent bg-clip-text bg-gradient-to-r from-text-main via-text-main to-text-muted transition-all duration-700">
                    ZENSTATE
                </h1>
                <span className="text-[10px] font-tech text-accent-highlight tracking-[0.4em] uppercase opacity-60">
                    Crystal OS // v2.0
                </span>
            </div>

            {/* Status Hub - Floating Top Right */}
            <div className="flex items-center gap-6 pointer-events-auto">
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
                    className="group relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                    title="Force Sync"
                >
                    <div className="absolute inset-0 bg-glass-surface rounded-full border border-glass-border group-hover:border-accent-highlight/50 transition-colors" />
                    <RefreshCw size={16} className="text-text-muted group-hover:text-accent-highlight transition-colors group-hover:rotate-180 duration-700" />
                </button>
            </div>
        </header>
    );
};
