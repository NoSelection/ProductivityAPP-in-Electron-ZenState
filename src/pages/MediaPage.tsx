import React from 'react';
import { MediaDeck } from '../components/MediaDeck';

export const MediaPage: React.FC = () => {
    return (
        <div className="max-w-7xl mx-auto w-full h-full flex flex-col relative overflow-hidden">
            {/* Immersive Background (Static Gradient Mesh) */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[10%] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(var(--prismatic-2-rgb),0.15)_0%,transparent_70%)] blur-[100px] animate-pulse-slow" />
                <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(var(--prismatic-1-rgb),0.1)_0%,transparent_70%)] blur-[80px]" />
            </div>

            {/* Header */}
            <header className="relative z-10 flex items-center justify-between pb-8 border-b border-white/5 mx-6">
                <div>
                    <h1 className="font-display text-4xl font-bold text-white tracking-wider mb-1 flex items-center gap-3">
                        <span className="text-[var(--prismatic-2)] opacity-50">///</span>
                        ATMOSPHERE
                    </h1>
                    <p className="text-white/40 font-mono-tech text-sm uppercase tracking-widest pl-12">
                        Audio-Spatial Environmental Controls
                    </p>
                </div>
            </header>

            <div className="flex-1 flex flex-col items-center justify-center min-h-[500px] relative z-20 p-6">
                <div className="w-full max-w-lg relative">
                    {/* Decor lines around the deck */}
                    <div className="absolute -left-12 top-1/2 -translate-y-1/2 w-8 h-[1px] bg-gradient-to-r from-transparent to-white/20 hidden lg:block" />
                    <div className="absolute -right-12 top-1/2 -translate-y-1/2 w-8 h-[1px] bg-gradient-to-l from-transparent to-white/20 hidden lg:block" />

                    <MediaDeck />
                </div>
            </div>
        </div>
    );
};
