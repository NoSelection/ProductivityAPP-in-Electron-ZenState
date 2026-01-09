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
        <div className="relative w-screen h-screen overflow-hidden bg-transparent flex items-center justify-center p-4">

            {/* Container - Floating Glass Sphere */}
            <div className="relative w-[280px] h-[280px] flex flex-col items-center justify-center bg-glass-surface/20 backdrop-blur-md rounded-full border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] overflow-hidden group hover:scale-[1.02] transition-transform duration-500 ease-out">
                {/* Drag Handle - Global */}
                <div className="absolute inset-0 z-0 rounded-full" style={{ WebkitAppRegion: 'drag' } as any} />

                {/* Close Button - Visible on Hover */}
                <div className="absolute top-8 right-8 z-50 no-drag opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ WebkitAppRegion: 'no-drag' } as any}>
                    <button
                        onClick={() => window.close()}
                        className="p-1.5 rounded-full bg-white/10 hover:bg-red-500/20 text-white/60 hover:text-red-400 transition-all backdrop-blur-md"
                    >
                        <X size={12} />
                    </button>
                </div>

                {/* Content */}
                <div className="relative z-10 w-full h-full flex items-center justify-center p-0 pointer-events-none">
                    <div className="pointer-events-auto">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};
