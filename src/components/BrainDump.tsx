import React from 'react'
import { Hash } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { cn } from '../lib/utils'

export const BrainDump: React.FC = () => {
    const [notes, setNotes] = useLocalStorage<string>('zen-brain-dump', '')

    return (
        <div className={cn(
            "cyber-glass h-full w-full p-8 flex flex-col group relative overflow-hidden transition-all duration-700 rounded-3xl"
        )}>
            {/* Catch-light accent */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <div className="flex items-center justify-between mb-6">
                <h2 className="text-slate-500 text-[9px] font-bold tracking-[0.3em] uppercase opacity-70 font-mono-tech flex items-center gap-2">
                    <Hash className="w-3 h-3 text-secondary/40" />
                    Neural Buffer // Scratchpad
                </h2>
                <div className="px-2 py-1 rounded bg-white/[0.03] border border-white/5">
                    <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest font-mono-tech">
                        {notes.length} bytes
                    </span>
                </div>
            </div>

            <textarea
                className="flex-1 w-full bg-transparent border-none outline-none resize-none text-sm font-light leading-relaxed text-slate-400 placeholder-white/5 custom-scrollbar font-sans selection:bg-secondary/20 selection:text-secondary"
                placeholder="> INITIATE NEURAL CACHE DUMP..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                spellCheck={false}
            />
        </div>
    )
}
