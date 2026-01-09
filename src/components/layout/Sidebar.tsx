import React from 'react';
import { Home, Compass, PenTool, Radio, Settings, Layout as LayoutIcon } from 'lucide-react';
import { useWorkspace } from '../../features/workspace/WorkspaceContext';
import { GlassButton } from '../atoms/GlassButton';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { settingsService } from '../../lib/settingsService';

export const Sidebar: React.FC = () => {
    const { toggleEditMode, isEditMode, activePage, navigateTo } = useWorkspace();
    const [avatar, setAvatar] = useState<string | null>(null);

    useEffect(() => {
        const loadAvatar = async () => {
            const settings = await settingsService.getAll();
            if (settings?.profile?.avatar) {
                setAvatar(settings.profile.avatar as string);
            }
        };
        loadAvatar();

        const handleProfileUpdate = () => loadAvatar();
        window.addEventListener('profile-updated', handleProfileUpdate);
        return () => window.removeEventListener('profile-updated', handleProfileUpdate);
    }, []);

    const navItems = [
        { id: 'timer', icon: Home, label: 'Sanctuary' },
        { id: 'quest', icon: Compass, label: 'Quests' },
        { id: 'codex', icon: PenTool, label: 'Codex' },
        { id: 'media', icon: Radio, label: 'Frequency' },
    ];

    return (
        <aside className="fixed left-6 top-1/2 -translate-y-1/2 h-[85vh] w-20 flex flex-col items-center py-6 gap-8 z-50">
            {/* Glass Container */}
            <div className="absolute inset-0 bg-glass-base/80 backdrop-blur-2xl border border-glass-border/50 rounded-full shadow-artifact" />

            {/* Avatar / Profile */}
            <div className="relative z-10 pt-2">
                <button
                    onClick={() => navigateTo('profile')}
                    className="relative group w-12 h-12 rounded-full p-0.5 border border-white/10 overflow-hidden transition-transform hover:scale-105 active:scale-95"
                >
                    <div className="w-full h-full rounded-full overflow-hidden bg-bg-elevated">
                        {avatar ? (
                            <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-accent-highlight to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                                ZS
                            </div>
                        )}
                    </div>
                    {/* Ring Glow */}
                    <div className="absolute inset-0 rounded-full ring-2 ring-accent-highlight/0 group-hover:ring-accent-highlight/50 transition-all duration-500" />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 flex flex-col gap-6 w-full items-center justify-center relative z-10">
                {navItems.map((item) => (
                    <div key={item.id} className="relative group">
                        {activePage === item.id && (
                            <motion.div
                                layoutId="activeNav"
                                className="absolute inset-0 bg-accent-highlight/10 rounded-xl blur-lg"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <GlassButton
                            size="icon"
                            variant={activePage === item.id ? 'primary' : 'ghost'}
                            onClick={() => navigateTo(item.id as any)}
                            aria-label={item.label}
                            className={`rounded-2xl w-10 h-10 transition-all duration-300 ${activePage === item.id ? 'bg-accent-highlight shadow-glow text-white' : 'text-text-muted hover:text-text-main'}`}
                        >
                            <item.icon size={20} strokeWidth={1.5} />
                        </GlassButton>

                        {/* Tooltip */}
                        <div className="absolute left-14 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-glass-surface border border-glass-border rounded-lg text-xs font-medium text-text-main opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 pointer-events-none whitespace-nowrap backdrop-blur-md shadow-lg">
                            {item.label}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Bottom Actions */}
            <div className="relative z-10 pb-2 flex flex-col gap-4">
                <GlassButton
                    size="icon"
                    variant={activePage === 'dashboard' ? 'primary' : 'ghost'}
                    onClick={() => {
                        navigateTo('dashboard');
                        if (activePage === 'dashboard') toggleEditMode();
                    }}
                    className={`rounded-2xl w-10 h-10 ${activePage === 'dashboard' && isEditMode ? 'text-accent-warning' : 'text-text-muted'}`}
                    title={activePage === 'dashboard' ? "Toggle Edit Mode" : "Dashboard"}
                >
                    <LayoutIcon size={20} className={activePage === 'dashboard' && isEditMode ? 'animate-pulse' : ''} />
                </GlassButton>

                <GlassButton
                    size="icon"
                    variant="ghost"
                    onClick={() => navigateTo('settings')}
                    className={`rounded-2xl w-10 h-10 ${activePage === 'settings' ? 'text-text-main bg-glass-surface' : 'text-text-muted'}`}
                >
                    <Settings size={20} className="group-hover:rotate-90 transition-transform duration-500" />
                </GlassButton>
            </div>
        </aside>
    );
};
