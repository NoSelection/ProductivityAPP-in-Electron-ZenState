import React from 'react';
import { X } from 'lucide-react';


export const ArtifactLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    React.useEffect(() => {
        // Force body transparency for artifact windows to remove global theme background
        document.body.style.backgroundColor = 'transparent';
        document.documentElement.style.backgroundColor = 'transparent';

        return () => {
            document.body.style.backgroundColor = '';
            document.documentElement.style.backgroundColor = '';
        };
    }, []);

    return (
        <div className="relative w-screen h-screen overflow-hidden bg-transparent flex items-center justify-center p-6">

            {/* Container - Floating Glass Rectangular Card */}
            <div className="relative w-[300px] h-[340px] flex flex-col items-center justify-center bg-cute-gradient backdrop-blur-xl rounded-[40px] border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.4)] overflow-hidden group hover:scale-[1.01] transition-all duration-500 ease-out">

                {/* Visual Accent - Top Light Beam */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />

                {/* Drag Handle - Global Overlay */}
                <div className="absolute inset-0 z-0 rounded-[40px]" style={{ WebkitAppRegion: 'drag' } as any} />

                {/* Close Button - Premium Positioning */}
                <div className="absolute top-4 right-4 z-50 no-drag opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100" style={{ WebkitAppRegion: 'no-drag' } as any}>
                    <button
                        onClick={() => window.close()}
                        className="p-2 rounded-full bg-white/10 hover:bg-black/5 text-black/40 hover:text-black/80 transition-all backdrop-blur-md border border-white/20 shadow-sm"
                    >
                        <X size={14} strokeWidth={2.5} />
                    </button>
                </div>

                {/* Content Area */}
                <div className="relative z-10 w-full h-full flex items-center justify-center p-6 pointer-events-none">
                    <div className="pointer-events-auto w-full h-full flex items-center justify-center">
                        {children}
                    </div>
                </div>

                {/* Subtle Bottom Glow */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-white/10 blur-2xl rounded-full" />
            </div>
        </div>
    );
};
