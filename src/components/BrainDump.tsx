import React from 'react'
import { Brain, Activity } from 'lucide-react'
import { useNeuralStorage } from '../hooks/useNeuralStorage'

export const BrainDump: React.FC = () => {
    const [notes, setNotes, isInitialized] = useNeuralStorage('zen-brain-dump', '')

    return (
        <div className="BrainDump flex-1 glass-pane p-5 flex flex-col gap-4 min-h-0">
            <div className="flex items-center gap-3 shrink-0">
                <div className="p-2 rounded-lg bg-accent-base/10 text-accent-base border border-accent-base/20">
                    <Brain className="w-3.5 h-3.5" />
                </div>
                <h2 className="text-[10px] font-bold tracking-widest text-white/40 uppercase">Notes</h2>
                {!isInitialized && <Activity className="w-3 h-3 animate-spin text-yellow-500/50" />}
            </div>

            <div className="flex-1 min-h-0 relative bg-black/20 rounded-lg border border-white/[0.06] p-4">
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    spellCheck={false}
                    placeholder="Write something..."
                    className="w-full h-full bg-transparent border-none outline-none text-sm text-white/70 placeholder:text-white/20 resize-none custom-scrollbar leading-relaxed"
                />
            </div>
        </div>
    )
}
