import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Palette, Zap, Droplets, Sun, Wind, LucideIcon } from 'lucide-react';
import { useTheme, ThemeType } from '../context/ThemeContext';
import { cn } from '../lib/utils';

interface SettingsPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
    const { theme, setTheme } = useTheme();

    const themes: { id: ThemeType; label: string; icon: LucideIcon; color: string }[] = [
        { id: 'cyber', label: 'Cyber', icon: Zap, color: 'hsla(var(--accent-base), 1)' },
        { id: 'sakura', label: 'Sakura', icon: Wind, color: '#f77aa2' },
        { id: 'deep-sea', label: 'Deep Sea', icon: Droplets, color: '#06d4b6' },
        { id: 'matrix', label: 'Matrix', icon: Sun, color: '#00ff41' },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60]"
                    />
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed right-0 top-0 h-full w-96 glass-pane z-[70] p-10 border-l border-white/5 flex flex-col rounded-none"
                    >
                        <div className="flex items-center justify-between mb-16">
                            <div className="flex items-center gap-4">
                                <Palette className="w-5 h-5 text-accent-base" />
                                <h2 className="text-[11px] font-black tracking-[0.4em] uppercase text-white/40 font-mono-tech">
                                    ATMOSPHERE // SETTINGS
                                </h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-3 rounded-full hover:bg-white/5 text-white/20 hover:text-white transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-12">
                            <section>
                                <h3 className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/10 mb-8 font-mono-tech">
                                    Neural Presets
                                </h3>
                                <div className="grid grid-cols-2 gap-5">
                                    {themes.map((t) => (
                                        <button
                                            key={t.id}
                                            onClick={() => setTheme(t.id)}
                                            className={cn(
                                                "flex flex-col items-center gap-4 p-6 rounded-3xl border transition-all group",
                                                theme === t.id
                                                    ? "bg-white/5 border-accent-base/50 shadow-[0_0_30px_hsla(var(--accent-base),0.1)]"
                                                    : "bg-white/[0.02] border-white/5 hover:border-white/20 hover:bg-white/[0.04]"
                                            )}
                                        >
                                            <t.icon className={cn(
                                                "w-6 h-6 transition-transform group-hover:scale-110",
                                                theme === t.id ? "text-accent-base" : "text-white/20"
                                            )} />
                                            <span className={cn(
                                                "text-[10px] font-bold tracking-widest uppercase font-mono-tech",
                                                theme === t.id ? "text-white" : "text-white/40"
                                            )}>
                                                {t.label}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <h3 className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/10 mb-8 font-mono-tech">
                                    Core Performance
                                </h3>
                                <div className="space-y-5">
                                    <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/5 flex items-center justify-between">
                                        <span className="text-[10px] text-white/30 font-mono-tech uppercase tracking-widest">Animations</span>
                                        <span className="text-[10px] text-accent-base font-black font-mono-tech">OPTIMIZED</span>
                                    </div>
                                    <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/5 flex items-center justify-between">
                                        <span className="text-[10px] text-white/30 font-mono-tech uppercase tracking-widest">Neural Blur</span>
                                        <span className="text-[10px] text-accent-base font-black font-mono-tech">40PX</span>
                                    </div>
                                </div>
                            </section>
                        </div>

                        <div className="mt-auto pt-10 border-t border-white/5">
                            <p className="text-[9px] text-center text-white/10 font-mono-tech tracking-[0.5em] uppercase">
                                ZenState // Neural OS // v1.2.0
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
