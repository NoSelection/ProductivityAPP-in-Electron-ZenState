import React from 'react';
import { MediaDeck } from '../components/MediaDeck';

export const MediaPage: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto w-full h-full flex flex-col gap-8">
            <header className="mb-4">
                <h1 className="font-display text-3xl font-bold text-white tracking-wider mb-2">ATMOSPHERE</h1>
                <p className="text-white/40 font-mono-tech text-sm">Audio-spatial environmental controls.</p>
            </header>

            <div className="flex-1 flex flex-col items-center justify-center min-h-[500px]">
                <MediaDeck />
            </div>
        </div>
    );
};
