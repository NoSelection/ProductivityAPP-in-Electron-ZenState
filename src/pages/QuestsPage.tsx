import React from 'react';
import { QuestLog } from '../components/QuestLog';
import { BrainDump } from '../components/BrainDump';

export const QuestsPage: React.FC = () => {
    return (
        <div className="max-w-6xl mx-auto w-full h-full flex flex-col gap-8">
            <header className="mb-4">
                <h1 className="font-display text-3xl font-bold text-white tracking-wider mb-2">QUEST LOG</h1>
                <p className="text-white/40 font-mono-tech text-sm">Task management and rapid data entry.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full min-h-0">
                <div className="h-full min-h-[400px]">
                    <QuestLog />
                </div>
                <div className="h-full min-h-[400px]">
                    <BrainDump />
                </div>
            </div>
        </div>
    );
};
