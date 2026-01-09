import { useState, useEffect } from 'react';
import { Settings, Palette, Eye, Shield, RefreshCw } from 'lucide-react';
import { GlassButton } from '../atoms/GlassButton';
import { GlassInput } from '../atoms/GlassInput';
import { settingsService } from '../../lib/settingsService';
import { useTheme, ThemeId } from '../../features/theme/ThemeContext';

interface SettingsState {
  ui?: { particles?: boolean };
  timer?: { focusDuration?: number };
  [key: string]: Record<string, unknown> | undefined;
}

export const SettingsWidget = () => {
  const [settings, setSettings] = useState<SettingsState | null>(null);
  const [activeTab, setActiveTab] = useState<'appearance' | 'system'>('appearance');
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const s = await settingsService.getAll();
    setSettings(s || {});
  };

  const updateSetting = async (category: string, key: string, value: unknown) => {
    await settingsService.set(category, key, value);
    if (settings) {
      setSettings({ ...settings, [category]: { ...settings[category], [key]: value } });
    }
  };

  const themes: { id: ThemeId; name: string; color: string }[] = [
    { id: 'dark', name: 'Void', color: '#020204' },
    { id: 'white', name: 'Pure', color: '#ffffff' },
    { id: 'lotus', name: 'Lotus', color: '#fff0f5' },
    { id: 'zen', name: 'Zen', color: '#020412' },
  ];

  if (!settings) return <div className="animate-pulse h-full bg-white/5 rounded-2xl" />;

  return (
    <div className="flex flex-col h-full gap-8 select-none">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-glass-surface border border-glass-border flex items-center justify-center shadow-glow">
          <Settings size={22} strokeWidth={1.5} className="text-accent-highlight" />
        </div>
        <div className="flex flex-col">
          <h3 className="font-display text-2xl text-text-main tracking-tight">System Settings</h3>
          <p className="text-[10px] font-tech text-text-muted uppercase tracking-[0.2em]">Core // Configurations</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-glass-border pb-1">
        {['appearance', 'system'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`
              relative pb-3 text-xs font-tech uppercase tracking-widest transition-colors duration-300
              ${activeTab === tab ? 'text-accent-highlight' : 'text-text-muted hover:text-text-main'}
            `}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-highlight shadow-[0_0_10px_var(--accent-highlight)]" />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
        {activeTab === 'appearance' ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Global Theme Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-text-muted/60">
                <Palette size={14} />
                <span className="text-[10px] uppercase tracking-widest font-tech">Global Theme</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {themes.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`
                        group relative p-4 rounded-xl border flex items-center gap-4 transition-all duration-300
                        ${theme === t.id
                        ? 'bg-glass-surface border-accent-highlight shadow-[0_0_30px_-10px_rgba(99,102,241,0.3)]'
                        : 'bg-glass-base border-glass-border hover:border-text-muted/40 hover:bg-glass-surface/50'}
                      `}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border border-white/10 shadow-inner`}
                      style={{ backgroundColor: t.color }}
                    />
                    <span className={`text-sm font-medium ${theme === t.id ? 'text-accent-highlight' : 'text-text-muted group-hover:text-text-main'}`}>
                      {t.name}
                    </span>

                    {/* Selection Ring for active state */}
                    {theme === t.id && (
                      <div className="absolute inset-0 rounded-xl border border-accent-highlight opacity-50 pointer-events-none" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Visibility Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-text-muted/60">
                <Eye size={14} />
                <span className="text-[10px] uppercase tracking-widest font-tech">Visibility</span>
              </div>

              <label className="flex items-center justify-between p-5 bg-glass-surface rounded-xl border border-glass-border cursor-pointer group hover:border-text-muted/40 transition-colors">
                <span className="text-sm text-text-main group-hover:text-white transition-colors">Ambient Particles</span>
                <div className="relative">
                  <input
                    type="checkbox"
                    className="peer sr-only "
                    checked={settings.ui?.particles !== false}
                    onChange={(e) => updateSetting('ui', 'particles', e.target.checked)}
                  />
                  <div className="w-5 h-5 border-2 border-text-muted rounded flex items-center justify-center peer-checked:bg-accent-highlight peer-checked:border-accent-highlight transition-all">
                    <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              </label>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Protocol Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-text-muted/60">
                <Shield size={14} />
                <span className="text-[10px] uppercase tracking-widest font-tech">Protocol</span>
              </div>
              <div className="space-y-4">
                <GlassInput
                  label="Focus Duration (Min)"
                  type="number"
                  value={settings.timer?.focusDuration || 25}
                  onChange={(e) => updateSetting('timer', 'focusDuration', parseInt(e.target.value))}
                />

                <div className="mt-8 pt-8 border-t border-glass-border">
                  <div className="flex items-center justify-between p-4 bg-red-500/5 rounded-xl border border-red-500/10 group hover:border-red-500/30 transition-colors">
                    <div>
                      <h4 className="text-sm font-medium text-red-400 group-hover:text-red-300">Emergency Reset</h4>
                      <p className="text-[10px] text-red-400/50 mt-1">Clear all local configurations</p>
                    </div>
                    <GlassButton variant="danger" size="sm">Reset</GlassButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="pt-6 border-t border-glass-border flex items-center justify-between text-text-muted/30">
        <div className="flex items-center gap-2">
          <RefreshCw size={10} className="animate-spin-slow" />
          <span className="text-[8px] font-tech uppercase tracking-widest">Sync Active</span>
        </div>
        <span className="text-[8px] font-tech uppercase tracking-widest">v2.0.42-Stable</span>
      </div>
    </div>
  );
};
