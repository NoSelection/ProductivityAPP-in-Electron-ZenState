import React from 'react';
import { GridLayout } from './GridLayout';
import { useWorkspace } from '../features/workspace/WorkspaceContext';
import { GlassButton } from '../components/atoms/GlassButton';
import { Settings, Layout as LayoutIcon, Home, Compass, PenTool, Radio } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TimerPage } from '../pages/TimerPage';
import { MediaPage } from '../pages/MediaPage';
import { QuestPage } from '../pages/QuestPage';
import { CodexPage } from '../pages/CodexPage';
import { SettingsPage } from '../pages/SettingsPage';
import { ProfilePage } from '../pages/ProfilePage';
import { settingsService } from '../lib/settingsService';
import { useState, useEffect } from 'react';

export const MainLayout: React.FC = () => {
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

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <GridLayout />;
      case 'timer': return <TimerPage />;
      case 'media': return <MediaPage />;
      case 'quest': return <QuestPage />;
      case 'codex': return <CodexPage />;
      case 'settings': return <SettingsPage />;
      case 'profile': return <ProfilePage />;
      default: return <GridLayout />;
    }
  };

  return (
    <div className="flex h-screen w-screen bg-[var(--bg-main)] text-[var(--text-main)] overflow-hidden font-sans selection:bg-accent-highlight/30 transition-colors duration-700">
      {/* Sidebar - Sleek Glass Strip */}
      <aside className="w-20 h-full border-r border-border-subtle bg-glass-base backdrop-blur-2xl flex flex-col items-center py-8 gap-8 z-50 transition-colors duration-700">
        <div className="relative group cursor-pointer" onClick={() => navigateTo('profile')}>
          <div className="w-10 h-10 rounded-2xl overflow-hidden shadow-lg shadow-accent-highlight/20 flex items-center justify-center transform group-hover:rotate-6 transition-transform duration-300 border-2 border-[var(--border-highlight)]">
            {avatar ? (
                <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
                <div className="w-full h-full bg-gradient-to-br from-accent-highlight to-blue-600 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white rounded-full opacity-80" />
                </div>
            )}
          </div>
          <div className="absolute inset-0 bg-accent-highlight blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
        </div>
        
        <nav className="flex flex-col gap-4">
          <GlassButton 
            size="icon" 
            variant={activePage === 'timer' ? 'primary' : 'ghost'} 
            className="rounded-2xl" 
            onClick={() => navigateTo('timer')}
          >
            <Home size={20} className={activePage === 'timer' ? 'text-accent-highlight' : 'text-accent-secondary group-hover:text-[var(--text-main)]'} />
          </GlassButton>
          <GlassButton 
            size="icon" 
            variant={activePage === 'quest' ? 'primary' : 'ghost'} 
            className="rounded-2xl" 
            onClick={() => navigateTo('quest')}
          >
            <Compass size={20} className={activePage === 'quest' ? 'text-accent-highlight' : 'text-accent-secondary group-hover:text-[var(--text-main)]'} />
          </GlassButton>
          <GlassButton 
            size="icon" 
            variant={activePage === 'codex' ? 'primary' : 'ghost'} 
            className="rounded-2xl" 
            onClick={() => navigateTo('codex')}
          >
            <PenTool size={20} className={activePage === 'codex' ? 'text-accent-highlight' : 'text-accent-secondary group-hover:text-[var(--text-main)]'} />
          </GlassButton>
          <GlassButton 
            size="icon" 
            variant={activePage === 'media' ? 'primary' : 'ghost'} 
            className="rounded-2xl" 
            onClick={() => navigateTo('media')}
          >
            <Radio size={20} className={activePage === 'media' ? 'text-accent-highlight' : 'text-accent-secondary group-hover:text-[var(--text-main)]'} />
          </GlassButton>
        </nav>

        <div className="flex-1" />
        
        <div className="flex flex-col gap-4 pb-4">
          <GlassButton 
            size="icon" 
            variant={activePage === 'dashboard' ? 'primary' : 'ghost'} 
            onClick={() => {
              navigateTo('dashboard');
              if (activePage === 'dashboard') toggleEditMode();
            }}
            className="rounded-2xl"
            title={activePage === 'dashboard' ? "Toggle Edit Mode" : "Go to Dashboard"}
          >
            <LayoutIcon size={20} className={activePage === 'dashboard' && isEditMode ? 'text-accent-highlight' : 'text-accent-secondary group-hover:text-[var(--text-main)]'} />
          </GlassButton>
          <GlassButton size="icon" variant="ghost" className="rounded-2xl" onClick={() => navigateTo('settings')}>
            <Settings size={20} className={activePage === 'settings' ? 'text-accent-highlight' : 'text-accent-secondary group-hover:text-[var(--text-main)]'} />
          </GlassButton>
        </div>
      </aside>

      {/* Main Content Stage */}
      <main className="flex-1 h-full relative overflow-hidden flex flex-col transition-colors duration-700">
        {/* Top Bar / Header */}
        <header className="h-20 w-full flex items-center justify-between px-10 border-b border-border-subtle bg-glass-base backdrop-blur-md z-40 transition-colors duration-700">
          <div className="flex flex-col">
            <h1 className="font-display text-2xl tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-[var(--text-main)] via-[var(--text-main)] to-[var(--text-muted)]">
              ZENSTATE
            </h1>
            <span className="text-[10px] font-tech text-accent-highlight/60 tracking-[0.5em] uppercase -mt-1">
              Crystal OS // v2.0
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-xs font-tech text-accent-secondary uppercase">Status</span>
              <span className="text-[10px] text-emerald-400 animate-pulse">Synchronized</span>
            </div>
            <div className="h-8 w-[1px] bg-[var(--border-subtle)]" />
            <button 
              onClick={() => window.location.reload()}
              className="w-10 h-10 rounded-full border border-[var(--border-subtle)] p-0.5 hover:scale-110 transition-transform cursor-pointer group relative"
              title="Force Sync"
            >
              <div className="w-full h-full rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary opacity-50 group-hover:opacity-80 transition-opacity" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Settings size={14} className="text-[var(--text-main)] animate-spin-slow" />
              </div>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full"
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      
      {/* Background Ambience */}
      <div className="bg-nebula-layer">
        {/* Layered Blobs */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-5%] w-[60%] h-[60%] bg-accent-highlight/10 blur-[150px] rounded-full mix-blend-screen" 
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            x: [0, -30, 0],
            y: [0, 50, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] right-[-5%] w-[60%] h-[60%] bg-blue-600/5 blur-[150px] rounded-full mix-blend-screen" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute top-[20%] left-[30%] w-[40%] h-[40%] bg-purple-600/5 blur-[120px] rounded-full mix-blend-screen" 
        />
      </div>
    </div>
  );
};