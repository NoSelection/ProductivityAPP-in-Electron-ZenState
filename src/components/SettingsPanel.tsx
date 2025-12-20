import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, X, Timer, Gamepad2, Eye, Palette } from 'lucide-react';
import { useTheme, ThemeType } from '../context/ThemeContext';
import { cn } from '../lib/utils';
import { settingsService } from '../lib/settingsService';

interface SettingsPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
    const { theme, setTheme, colors } = useTheme();
    const [timerSettings, setTimerSettings] = useState({
        focusDuration: 25,
        shortBreakDuration: 5,
        longBreakDuration: 15
    });
    const [xpSettings, setXpSettings] = useState({
        difficultyMultiplier: 1.0
    });
    const [visualSettings, setVisualSettings] = useState({
        animationsEnabled: true,
        blurEnabled: true
    });

    useEffect(() => {
        const loadSettings = async () => {
            const settings = await settingsService.getAll();
            if (settings.timer) {
                setTimerSettings(prev => ({ ...prev, ...settings.timer }));
            }
            if (settings.xp) {
                setXpSettings(prev => ({ ...prev, ...settings.xp }));
            }
            if (settings.visual) {
                setVisualSettings(prev => ({ ...prev, ...settings.visual }));
            }
        };
        if (isOpen) {
            loadSettings();
        }
    }, [isOpen]);

    const handleTimerChange = async (key: string, value: string) => {
        const numValue = parseInt(value) || 0;
        setTimerSettings(prev => ({ ...prev, [key]: numValue }));
        await settingsService.set('timer', key, numValue);
    };

    const handleXpChange = async (key: string, value: string) => {
        const numValue = parseFloat(value) || 0;
        setXpSettings(prev => ({ ...prev, [key]: numValue }));
        await settingsService.set('xp', key, numValue);
    };

    const handleVisualChange = async (key: string, value: boolean) => {
        setVisualSettings(prev => ({ ...prev, [key]: value }));
        await settingsService.set('visual', key, value);
    };

    const themes: { id: ThemeType; name: string; color: string; glow: string; colorHex: string }[] = [
        { id: 'sky', name: 'SKY', color: 'bg-neon-cyan', glow: 'shadow-[0_0_20px_#00f0ff]', colorHex: '#00f0ff' },
        { id: 'heart', name: 'HEART', color: 'bg-neon-magenta', glow: 'shadow-[0_0_20px_#ff6b9d]', colorHex: '#ff6b9d' },
        { id: 'matrix', name: 'MATRIX', color: 'bg-neon-lime', glow: 'shadow-[0_0_20px_#00ff41]', colorHex: '#00ff41' },
        { id: 'ice', name: 'ICE', color: 'bg-neon-purple', glow: 'shadow-[0_0_20px_#a8e6ff]', colorHex: '#a8e6ff' },
        { id: 'sun', name: 'SUN', color: 'bg-neon-orange', glow: 'shadow-[0_0_20px_#ff6b35]', colorHex: '#ff6b35' },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/70 backdrop-blur-xl z-[90]"
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ x: '100%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0 }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed right-0 top-0 h-full w-full sm:w-[420px] z-[95] flex flex-col"
                        style={{
                            background: 'linear-gradient(135deg, rgba(10,10,15,0.98) 0%, rgba(15,15,25,0.98) 100%)',
                            borderLeft: `1px solid ${colors.neon_primary}20`,
                            boxShadow: `
                                -20px 0 60px rgba(0,0,0,0.5),
                                inset 1px 0 0 ${colors.neon_primary}10
                            `
                        }}
                    >
                        {/* Top Glow Line */}
                        <div
                            className="absolute top-0 left-0 right-0 h-px"
                            style={{
                                background: `linear-gradient(90deg, transparent, ${colors.neon_primary}60, transparent)`
                            }}
                        />

                        {/* Header */}
                        <div className="flex items-center justify-between p-6 lg:p-8 border-b border-white/5">
                            <div className="flex items-center gap-4">
                                <div
                                    className="p-2.5 rounded-xl"
                                    style={{
                                        background: `${colors.neon_primary}15`,
                                        border: `1px solid ${colors.neon_primary}30`
                                    }}
                                >
                                    <Settings
                                        className="w-5 h-5"
                                        style={{ color: colors.neon_primary, filter: `drop-shadow(0 0 8px ${colors.neon_primary})` }}
                                    />
                                </div>
                                <div>
                                    <h2
                                        className="font-display text-sm font-bold tracking-[0.3em] uppercase"
                                        style={{ color: colors.neon_primary }}
                                    >
                                        Settings
                                    </h2>
                                    <p className="font-mono-tech text-[9px] text-white/30 uppercase tracking-widest mt-0.5">
                                        System Configuration
                                    </p>
                                </div>
                            </div>
                            <motion.button
                                onClick={onClose}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-3 rounded-xl border border-white/10 text-white/30 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all"
                            >
                                <X className="w-5 h-5" />
                            </motion.button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-8 space-y-8">
                            {/* Timer Configuration Section */}
                            <section>
                                <div className="flex items-center gap-3 mb-6">
                                    <Timer className="w-4 h-4" style={{ color: colors.neon_primary }} />
                                    <h3 className="font-display text-[11px] font-bold tracking-[0.3em] uppercase text-white/50">
                                        Timer Configuration
                                    </h3>
                                </div>
                                <div className="space-y-4">
                                    {[
                                        { label: 'Focus Duration (min)', key: 'focusDuration', value: timerSettings.focusDuration },
                                        { label: 'Short Break (min)', key: 'shortBreakDuration', value: timerSettings.shortBreakDuration },
                                        { label: 'Long Break (min)', key: 'longBreakDuration', value: timerSettings.longBreakDuration }
                                    ].map((item) => (
                                        <div key={item.key} className="space-y-2">
                                            <label htmlFor={item.key} className="block font-mono-tech text-[10px] text-white/40 uppercase tracking-widest">
                                                {item.label}
                                            </label>
                                            <input
                                                id={item.key}
                                                type="number"
                                                value={item.value}
                                                onChange={(e) => handleTimerChange(item.key, e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white font-mono text-sm focus:outline-none focus:border-white/20 transition-colors"
                                                style={{ caretColor: colors.neon_primary }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Progression & XP Section */}
                            <section>
                                <div className="flex items-center gap-3 mb-6">
                                    <Gamepad2 className="w-4 h-4" style={{ color: colors.neon_primary }} />
                                    <h3 className="font-display text-[11px] font-bold tracking-[0.3em] uppercase text-white/50">
                                        Progression & XP
                                    </h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label htmlFor="difficultyMultiplier" className="block font-mono-tech text-[10px] text-white/40 uppercase tracking-widest">
                                            Difficulty Multiplier (x)
                                        </label>
                                        <input
                                            id="difficultyMultiplier"
                                            type="number"
                                            step="0.1"
                                            value={xpSettings.difficultyMultiplier}
                                            onChange={(e) => handleXpChange('difficultyMultiplier', e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white font-mono text-sm focus:outline-none focus:border-white/20 transition-colors"
                                            style={{ caretColor: colors.neon_primary }}
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Visual Identity Section */}
                            <section>
                                <div className="flex items-center gap-3 mb-6">
                                    <Eye className="w-4 h-4" style={{ color: colors.neon_primary }} />
                                    <h3 className="font-display text-[11px] font-bold tracking-[0.3em] uppercase text-white/50">
                                        Visual Identity
                                    </h3>
                                </div>
                                <div className="space-y-3">
                                    <div
                                        className="p-4 rounded-xl border flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
                                        style={{
                                            background: 'rgba(0,0,0,0.3)',
                                            borderColor: 'rgba(255,255,255,0.05)'
                                        }}
                                        onClick={() => handleVisualChange('animationsEnabled', !visualSettings.animationsEnabled)}
                                    >
                                        <label className="font-mono-tech text-[10px] text-white/30 uppercase tracking-widest cursor-pointer pointer-events-none">
                                            Animations Enabled
                                        </label>
                                        <div
                                            className={cn(
                                                "w-8 h-4 rounded-full relative transition-colors duration-300",
                                                visualSettings.animationsEnabled ? "bg-emerald-500/20" : "bg-white/10"
                                            )}
                                        >
                                            <div
                                                className={cn(
                                                    "absolute top-1 w-2 h-2 rounded-full transition-all duration-300",
                                                    visualSettings.animationsEnabled ? "left-5 bg-emerald-400" : "left-1 bg-white/20"
                                                )}
                                                style={{ boxShadow: visualSettings.animationsEnabled ? `0 0 10px ${colors.neon_primary}` : 'none' }}
                                            />
                                        </div>
                                    </div>
                                    <div
                                        className="p-4 rounded-xl border flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
                                        style={{
                                            background: 'rgba(0,0,0,0.3)',
                                            borderColor: 'rgba(255,255,255,0.05)'
                                        }}
                                        onClick={() => handleVisualChange('blurEnabled', !visualSettings.blurEnabled)}
                                    >
                                        <label className="font-mono-tech text-[10px] text-white/30 uppercase tracking-widest cursor-pointer pointer-events-none">
                                            Blur Effects
                                        </label>
                                        <div
                                            className={cn(
                                                "w-8 h-4 rounded-full relative transition-colors duration-300",
                                                visualSettings.blurEnabled ? "bg-emerald-500/20" : "bg-white/10"
                                            )}
                                        >
                                            <div
                                                className={cn(
                                                    "absolute top-1 w-2 h-2 rounded-full transition-all duration-300",
                                                    visualSettings.blurEnabled ? "left-5 bg-emerald-400" : "left-1 bg-white/20"
                                                )}
                                                style={{ boxShadow: visualSettings.blurEnabled ? `0 0 10px ${colors.neon_primary}` : 'none' }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Theme Section */}
                            <section>
                                <div className="flex items-center gap-3 mb-6">
                                    <Palette className="w-4 h-4" style={{ color: colors.neon_primary }} />
                                    <h3 className="font-display text-[11px] font-bold tracking-[0.3em] uppercase text-white/50">
                                        Theme Presets
                                    </h3>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {themes.map((t) => {
                                        const isActive = theme === t.id;
                                        return (
                                            <motion.button
                                                key={t.id}
                                                onClick={() => setTheme(t.id)}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className={cn(
                                                    "relative flex flex-col items-center gap-3 p-4 border transition-all duration-300 overflow-hidden group",
                                                    /* Destiny Node Shape */
                                                    "clip-path-chamfer"
                                                )}
                                                style={{
                                                    background: isActive
                                                        ? `linear-gradient(135deg, ${t.colorHex}15, ${t.colorHex}05)`
                                                        : 'rgba(255,255,255,0.03)',
                                                    borderColor: isActive ? `${t.colorHex}50` : 'rgba(255,255,255,0.1)',
                                                    clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)'
                                                }}
                                            >
                                                {/* Hover Glow */}
                                                <div
                                                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                                                    style={{
                                                        background: `radial-gradient(circle at 50% 50%, ${t.colorHex}15, transparent 70%)`
                                                    }}
                                                />

                                                {/* Icon (Diamond) */}
                                                <div
                                                    className="relative w-8 h-8 flex items-center justify-center rotate-45 border"
                                                    style={{
                                                        borderColor: isActive ? t.colorHex : 'rgba(255,255,255,0.2)',
                                                        background: isActive ? `${t.colorHex}20` : 'transparent',
                                                        boxShadow: isActive ? `0 0 10px ${t.colorHex}40` : 'none'
                                                    }}
                                                >
                                                    <div className={cn("w-2 h-2 rounded-full", isActive ? "bg-white" : "bg-white/20")} />
                                                </div>

                                                {/* Label */}
                                                <span
                                                    className="relative font-display text-[11px] font-bold tracking-[0.2em] uppercase transition-colors duration-300"
                                                    style={{
                                                        color: isActive ? t.colorHex : 'rgba(255,255,255,0.4)',
                                                        textShadow: isActive ? `0 0 10px ${t.colorHex}80` : 'none'
                                                    }}
                                                >
                                                    {t.name}
                                                </span>

                                                {/* Active Indicator Bar */}
                                                {isActive && (
                                                    <motion.div
                                                        layoutId="activeTheme"
                                                        className="absolute bottom-0 left-0 w-full h-0.5"
                                                        style={{ background: t.colorHex }}
                                                    />
                                                )}
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </section>

                            {/* System Info */}
                            <section>
                                <h3 className="font-display text-[11px] font-bold tracking-[0.3em] uppercase text-white/50 mb-6">
                                    System Status
                                </h3>
                                <div className="space-y-3">
                                    <div
                                        className="p-4 rounded-xl border flex items-center justify-between"
                                        style={{
                                            background: 'rgba(0,0,0,0.3)',
                                            borderColor: 'rgba(255,255,255,0.05)'
                                        }}
                                    >
                                        <span className="font-mono-tech text-[10px] text-white/30 uppercase tracking-widest">
                                            Animations
                                        </span>
                                        <span
                                            className="font-mono-tech text-[10px] font-bold uppercase tracking-wider"
                                            style={{ color: colors.neon_primary }}
                                        >
                                            Enabled
                                        </span>
                                    </div>
                                    <div
                                        className="p-4 rounded-xl border flex items-center justify-between"
                                        style={{
                                            background: 'rgba(0,0,0,0.3)',
                                            borderColor: 'rgba(255,255,255,0.05)'
                                        }}
                                    >
                                        <span className="font-mono-tech text-[10px] text-white/30 uppercase tracking-widest">
                                            Blur Effects
                                        </span>
                                        <span
                                            className="font-mono-tech text-[10px] font-bold uppercase tracking-wider"
                                            style={{ color: colors.neon_primary }}
                                        >
                                            Active
                                        </span>
                                    </div>
                                    <div
                                        className="p-4 rounded-xl border flex items-center justify-between"
                                        style={{
                                            background: 'rgba(0,0,0,0.3)',
                                            borderColor: 'rgba(255,255,255,0.05)'
                                        }}
                                    >
                                        <span className="font-mono-tech text-[10px] text-white/30 uppercase tracking-widest">
                                            Auto-save
                                        </span>
                                        <span
                                            className="font-mono-tech text-[10px] font-bold uppercase tracking-wider"
                                            style={{ color: '#39ff14' }}
                                        >
                                            Synced
                                        </span>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Footer */}
                        <div className="p-6 lg:p-8 border-t border-white/5">
                            <div className="flex items-center justify-center gap-3">
                                <div
                                    className="w-1.5 h-1.5 rounded-full animate-pulse"
                                    style={{
                                        background: colors.neon_primary,
                                        boxShadow: `0 0 10px ${colors.neon_primary}`
                                    }}
                                />
                                <p className="font-mono-tech text-[9px] text-white/20 tracking-[0.4em] uppercase">
                                    ZenState v2.0 // {theme} Edition
                                </p>
                            </div>
                        </div>

                        {/* Bottom Glow Line */}
                        <div
                            className="absolute bottom-0 left-0 right-0 h-px"
                            style={{
                                background: `linear-gradient(90deg, transparent, ${colors.neon_secondary}40, transparent)`
                            }}
                        />
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
