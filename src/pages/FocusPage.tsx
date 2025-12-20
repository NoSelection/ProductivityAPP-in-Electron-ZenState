import React from 'react';
import { Timer } from '../components/Timer';
import { FocusCard } from '../components/FocusCard';

export const FocusPage: React.FC = () => {
    return (
        <div className="h-full w-full flex flex-col gap-6 lg:gap-8 max-w-7xl mx-auto">
            <header className="shrink-0">
                <h1 className="font-display text-3xl font-bold text-white tracking-wider mb-2">NEURAL SYNC</h1>
                <p className="text-white/40 font-mono-tech text-sm">Initiate focus protocols.</p>
            </header>

            <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                <div className="w-full h-full min-h-[300px]">
                    <FocusCard />
                </div>
                <div className="w-full h-full min-h-[300px]">
                    <Timer />
                </div>
            </div>
        </div>
    );
};
