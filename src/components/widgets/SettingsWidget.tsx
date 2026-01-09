import { useState, useEffect } from 'react';
import { Settings, Palette, Eye, Shield, RefreshCw } from 'lucide-react';
import { GlassButton } from '../atoms/GlassButton';
import { GlassInput } from '../atoms/GlassInput';
import { settingsService } from '../../lib/settingsService';
import { useTheme, ThemeId } from '../../features/theme/ThemeContext';

export const SettingsWidget = () => {
  const [settings, setSettings] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'appearance' | 'system'>('appearance');
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const s = await settingsService.getAll();
    setSettings(s || {});
  };

  const updateSetting = async (category: string, key: string, value: any) => {
    await settingsService.set(category, key, value);
    setSettings({ ...settings, [category]: { ...settings[category], [key]: value } });
  };

  const themes: { id: ThemeId; name: string; color: string }[] = [
    { id: 'dark', name: 'Void', color: '#0f172a' },
    { id: 'white', name: 'Pure', color: '#f8fafc' },
    { id: 'lotus', name: 'Lotus', color: '#fdf2f8' },
    { id: 'zen', name: 'Zen', color: '#4338ca' },
  ];

  if (!settings) return <div className="animate-pulse h-full bg-white/5 rounded-2xl" />;

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-accent-highlight/10 flex items-center justify-center border border-accent-highlight/20">
          <Settings size={20} className="text-accent-highlight" />
        </div>
        <div>
          <h3 className="text-lg font-display text-[var(--text-main)]">System Settings</h3>
          <p className="text-[10px] font-tech text-[var(--text-muted)] uppercase tracking-widest">Core // Configurations</p>
        </div>
      </div>

      <div className="flex gap-2 border-b border-border-subtle pb-2">
        <button 
          onClick={() => setActiveTab('appearance')}
          className={`px-4 py-2 text-[10px] font-tech uppercase tracking-widest transition-all ${activeTab === 'appearance' ? 'text-accent-highlight border-b border-accent-highlight' : 'text-[var(--text-muted)]'}`}
        >
          Appearance
        </button>
        <button 
          onClick={() => setActiveTab('system')}
          className={`px-4 py-2 text-[10px] font-tech uppercase tracking-widest transition-all ${activeTab === 'system' ? 'text-accent-highlight border-b border-accent-highlight' : 'text-[var(--text-muted)]'}`}
        >
          System
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-6">
        {activeTab === 'appearance' ? (
          <>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[var(--text-muted)]">
                <Palette size={14} />
                <span className="text-xs uppercase tracking-widest font-tech">Global Theme</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                  {themes.map(t => (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      className={`
                        p-3 rounded-xl border flex items-center gap-3 transition-all
                        ${theme === t.id ? 'bg-accent-highlight/10 border-accent-highlight' : 'bg-glass-base border-border-subtle hover:border-border-highlight'}
                      `}
                    >
                      <div className="w-4 h-4 rounded-full border border-[var(--border-subtle)]" style={{ backgroundColor: t.color }} />
                      <span className={`text-xs font-medium ${theme === t.id ? 'text-accent-highlight' : 'text-[var(--text-main)] opacity-70'}`}>
                        {t.name}
                      </span>
                    </button>
                  ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[var(--text-muted)]">
                <Eye size={14} />
                <span className="text-xs uppercase tracking-widest font-tech">Visibility</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-glass-surface rounded-2xl border border-border-subtle">
                 <span className="text-xs text-[var(--text-main)] opacity-80">Ambient Particles</span>
                 <input 
                   type="checkbox" 
                   checked={settings.ui?.particles !== false} 
                   onChange={(e) => updateSetting('ui', 'particles', e.target.checked)}
                   className="accent-accent-highlight"
                 />
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[var(--text-muted)]">
              <Shield size={14} />
              <span className="text-xs uppercase tracking-widest font-tech">Protocol</span>
            </div>
            <div className="space-y-4">
              <GlassInput 
                label="Focus Duration (Min)" 
                type="number" 
                value={settings.timer?.focusDuration || 25}
                onChange={(e) => updateSetting('timer', 'focusDuration', parseInt(e.target.value))}
              />
              <div className="p-4 bg-red-500/5 rounded-2xl border border-red-500/10 flex items-center justify-between">
                 <div>
                    <h4 className="text-xs text-red-400">Emergency Reset</h4>
                    <p className="text-[10px] text-red-400/40">Clear all local configurations</p>
                 </div>
                 <GlassButton variant="danger" size="sm">Reset</GlassButton>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-border-subtle flex items-center justify-between text-[var(--text-muted)] opacity-50">
         <div className="flex items-center gap-2">
            <RefreshCw size={10} />
            <span className="text-[8px] font-tech uppercase tracking-widest">Sync Active</span>
         </div>
         <span className="text-[8px] font-tech uppercase tracking-widest">v2.0.42-Stable</span>
      </div>
    </div>
  );
};
