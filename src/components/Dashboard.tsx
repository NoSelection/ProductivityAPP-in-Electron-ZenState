import React from 'react'
import { FocusCard } from './FocusCard'
import { Timer } from './Timer'
import { BrainDump } from './BrainDump'
import { QuestLog } from './QuestLog'
import { MediaDeck } from './MediaDeck'

export const Dashboard: React.FC = () => {
    return (
        <div className="flex-1 min-h-0 container mx-auto flex flex-col gap-4 lg:gap-6">
            {/* Top Grid: Focus + Timer */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6 shrink-0">
                <div className="md:col-span-2 lg:col-span-3 flex flex-col min-h-[280px] lg:min-h-0">
                    <FocusCard />
                </div>
                <div className="md:col-span-1 lg:col-span-2 flex flex-col min-h-[280px] lg:min-h-0">
                    <Timer />
                </div>
            </div>

            {/* Bottom Grid: Quest, Brain, Media */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 flex-1 min-h-0">
                <div className="flex flex-col min-h-[280px] lg:min-h-0 lg:flex-1">
                    <QuestLog />
                </div>
                <div className="flex flex-col min-h-[280px] lg:min-h-0 lg:flex-1">
                    <BrainDump />
                </div>
                <div className="md:col-span-2 lg:col-span-1 flex flex-col min-h-[280px] lg:min-h-0 lg:flex-1">
                    <MediaDeck />
                </div>
            </div>
        </div>
    )
}
