import React from 'react';
import { useWorkspace } from '../features/workspace/WorkspaceContext';
import { ErrorBoundary } from '../components/atoms/ErrorBoundary';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { motion, AnimatePresence } from 'framer-motion';
import { TimerPage } from '../pages/TimerPage';
import { MediaPage } from '../pages/MediaPage';
import { QuestPage } from '../pages/QuestPage';
import { CodexPage } from '../pages/CodexPage';
import { SettingsPage } from '../pages/SettingsPage';
import { ProfilePage } from '../pages/ProfilePage';
import { GridLayout } from './GridLayout';

export const MainLayout: React.FC = () => {
  const { activePage } = useWorkspace();

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
    <div className="relative h-screen w-screen overflow-hidden bg-bg-main text-text-main font-sans selection:bg-accent-highlight/30 transition-colors duration-1000">

      {/* --- AMBIENT BACKGROUND LAYERS --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Dynamic Gradient Mesh */}
        <div className="absolute inset-0 bg-nebula-layer" />

        {/* Animated Orbs */}
        <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] bg-accent-highlight/5 blur-[120px] rounded-full mix-blend-screen animate-blob-1" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-purple-500/5 blur-[120px] rounded-full mix-blend-screen animate-blob-2" />

        {/* Grain Overlay */}
        <div className="absolute inset-0 bg-noise opacity-[0.03]" />
      </div>

      {/* --- UI LAYER --- */}
      <div className="relative z-10 h-full flex">

        {/* Navigation Layer */}
        <Sidebar />

        {/* Content Layer */}
        <main className="flex-1 h-full pl-28 pr-6 pt-24 pb-6 flex flex-col relative perspective-1000">
          <Header />

          <div className="flex-1 relative overflow-hidden rounded-3xl z-20">
            {/* Content Glass Backdrop (Optional, depending on page preference) */}
            <div className="absolute inset-0 pointer-events-none" />

            {/* Page Transition Stage */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activePage}
                initial={{ opacity: 0, y: 10, scale: 0.98, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -10, scale: 0.98, filter: 'blur(4px)' }}
                transition={{ duration: 0.4, ease: "circOut" }}
                className="w-full h-full overflow-y-auto custom-scrollbar pr-2"
              >
                <ErrorBoundary>
                  {renderPage()}
                </ErrorBoundary>
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};