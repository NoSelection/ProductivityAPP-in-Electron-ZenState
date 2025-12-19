import React from 'react'
import { FileText } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { cn } from '../lib/utils'

export const BrainDump: React.FC = () => {
    const [notes, setNotes] = useLocalStorage<string>('zen-brain-dump', '')

    return (
        <div className={cn(
            "glass-pane h-full w-full flex flex-col group relative overflow-hidden min-h-[40vh] lg:min-h-0"
        )}>
            <div className="flex-none p-[3vh] pb-[1vh] flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <FileText className="w-3.5 h-3.5 text-white/40" />
                    <h2 className="text-white/30 text-[9px] font-black tracking-[0.5em] uppercase font-mono-tech">
                        NEURAL // SCRATCHPAD
                    </h2>
                </div>
                <div className="px-3 py-1 rounded-full bg-white/[0.05] border border-white/10">
                    <span className="text-[8px] text-white/40 font-black uppercase tracking-widest font-mono-tech">
                        {notes.length} B
                    </span>
                </div>
            </div>

            {/* Strictly flexible textarea area */}
            <div className="flex-1 min-h-0 w-full p-[3vh] pt-[1vh]">
                <textarea
                    className="w-full h-full bg-transparent border-none outline-none resize-none text-[1.8vh] font-light leading-relaxed text-white/80 placeholder-white/20 scrollbar-none font-sans"
                    placeholder="> Initiate thoughts..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    spellCheck={false}
                />
            </div>
        </div>
    )
}
