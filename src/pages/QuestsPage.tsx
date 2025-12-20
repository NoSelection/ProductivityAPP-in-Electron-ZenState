import React from 'react';
import { QuestLog } from '../components/QuestLog';
import { BrainDump } from '../components/BrainDump';

export const QuestsPage: React.FC = () => {
    return (
        <div className="max-w-7xl mx-auto w-full h-full flex flex-col gap-6">
            {/* Cinematic Header */}
            <header className="flex items-end justify-between pb-6 border-b border-white/5 relative shrink-0">
                <div className="absolute bottom-0 left-0 w-32 h-px bg-gradient-to-r from-[var(--prismatic-2)] to-transparent" />

                <div>
                    <h1 className="font-display text-4xl font-bold text-white tracking-wider mb-2 flex items-center gap-3">
                        <span className="text-[var(--prismatic-2)] opacity-50">///</span>
                        QUEST LOG
                    </h1>
                    <p className="text-white/40 font-mono-tech text-sm uppercase tracking-widest pl-12">
                        Active Protocols & Data Archive
                    </p>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end">
                        <span className="font-mono-tech text-[9px] text-[var(--prismatic-2)] uppercase tracking-wider">System Status</span>
                        <span className="text-white/60 text-xs font-bold">OPTIMAL</span>
                    </div>
                </div>
            </header>

            <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-6 pb-2">
                {/* Bounty Board (Left - Main) */}
                <div className="lg:col-span-7 h-full min-h-[400px] flex flex-col">
                    <QuestLog />
                </div>

                {/* Grimoire (Right - Side) */}
                <div className="lg:col-span-5 h-full min-h-[400px] flex flex-col">
                    <BrainDump />
                </div>
            </div>
        </div>
    );
};
