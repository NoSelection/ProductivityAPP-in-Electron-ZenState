import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Compass,
  Timer,
  Headphones,
  ListTodo,
  Settings,
  Zap,
  ChevronRight,
  ChevronLeft,
  Shield,
  ShieldAlert,
  Flower2
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

interface SidebarProps {
  isCollapsed: boolean;
  toggleCollapse: () => void;
  isSettingsOpen: boolean;
  toggleSettings: () => void;
  isFocusShieldActive: boolean;
  toggleFocusShield: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  toggleCollapse,
  toggleSettings,
  isSettingsOpen,
  isFocusShieldActive,
  toggleFocusShield
}) => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/focus', label: 'Focus', icon: Timer },
    { path: '/codex', label: 'Codex', icon: Compass },
    { path: '/media', label: 'Atmosphere', icon: Headphones },
    { path: '/garden', label: 'Zen Garden', icon: Flower2 },
    { path: '/quests', label: 'Quests', icon: ListTodo },
  ];

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 64 : 240 }}
      className="h-screen bg-black/40 backdrop-blur-xl border-r border-white/5 flex flex-col relative z-50 transition-all duration-300 ease-in-out shrink-0"
    >
      {/* Logo Area */}
      <div className="h-16 flex items-center px-4 border-b border-white/5 overflow-hidden whitespace-nowrap">
        <div className="flex items-center gap-3 min-w-max">
          <div className="relative flex-shrink-0">
            <Zap className="w-6 h-6 text-[var(--prismatic-2)]" style={{ filter: 'drop-shadow(0 0 8px var(--prismatic-2))' }} />
          </div>
          <motion.span
            animate={{ opacity: isCollapsed ? 0 : 1 }}
            className="font-display font-bold text-lg tracking-[0.2em] text-[var(--prismatic-2)] uppercase"
          >
            ZENSTATE
          </motion.span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 flex flex-col gap-2 px-2 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group relative overflow-hidden whitespace-nowrap",
              isActive
                ? "bg-[rgba(var(--prismatic-2-rgb),0.1)] text-[var(--prismatic-2)] shadow-[inset_0_0_10px_rgba(var(--prismatic-2-rgb),0.1)]"
                : "text-white/40 hover:text-white hover:bg-white/5"
            )}
          >
            <item.icon className={cn(
              "w-5 h-5 flex-shrink-0 transition-colors",
            )} />

            <motion.span
              animate={{ opacity: isCollapsed ? 0 : 1, width: isCollapsed ? 0 : 'auto' }}
              className="font-display text-xs font-medium uppercase tracking-widest"
            >
              {item.label}
            </motion.span>

            {/* Active Indicator Bar (Left) */}
            <div className={cn(
              "absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-[var(--prismatic-2)] rounded-r-full transition-all duration-300",
              location.pathname === item.path ? "opacity-100" : "opacity-0"
            )} />
          </NavLink>
        ))}
      </nav>

      {/* Footer / Controls */}
      <div className="p-2 border-t border-white/5 flex flex-col gap-2">
        {/* Focus Shield Toggle */}
        <button
          onClick={toggleFocusShield}
          className={cn(
            "flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 text-white/40 hover:text-white hover:bg-white/5 whitespace-nowrap",
            isFocusShieldActive && "text-[var(--prismatic-2)] bg-[rgba(var(--prismatic-2-rgb),0.05)] shadow-[inset_0_0_10px_rgba(var(--prismatic-2-rgb),0.1)]"
          )}
        >
          {isFocusShieldActive ? (
            <ShieldAlert className="w-5 h-5 flex-shrink-0 animate-pulse text-[var(--prismatic-2)]" style={{ filter: 'drop-shadow(0 0 5px var(--prismatic-2))' }} />
          ) : (
            <Shield className="w-5 h-5 flex-shrink-0" />
          )}
          <motion.span
            animate={{ opacity: isCollapsed ? 0 : 1, width: isCollapsed ? 0 : 'auto' }}
            className="font-display text-xs font-medium uppercase tracking-widest"
          >
            Focus Shield
          </motion.span>
        </button>

        <button
          onClick={toggleSettings}
          className={cn(
            "flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 text-white/40 hover:text-white hover:bg-white/5 whitespace-nowrap",
            isSettingsOpen && "text-[var(--prismatic-2)] bg-[rgba(var(--prismatic-2-rgb),0.05)]"
          )}
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          <motion.span
            animate={{ opacity: isCollapsed ? 0 : 1, width: isCollapsed ? 0 : 'auto' }}
            className="font-display text-xs font-medium uppercase tracking-widest"
          >
            Settings
          </motion.span>
        </button>

        <button
          onClick={toggleCollapse}
          className="flex items-center justify-center p-2 rounded-lg text-white/20 hover:text-white hover:bg-white/5 transition-colors"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </motion.aside>
  );
};
