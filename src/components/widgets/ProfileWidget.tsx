import { useState, useEffect, useRef } from 'react';
import { Camera, User, Award, Clock, Zap } from 'lucide-react';
import { GlassPanel } from '../atoms/GlassPanel';
import { settingsService } from '../../lib/settingsService';

export const ProfileWidget = () => {
  const [profile, setProfile] = useState({
    name: 'Operative',
    title: 'System Architect',
    avatar: '',
  });
  const [stats, setStats] = useState({
    focusMinutes: 0,
    questsCompleted: 0,
    level: 1
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const settings = await settingsService.getAll();
    if (settings.profile) {
      setProfile(prev => ({ ...prev, ...settings.profile }));
    }
    
    // Load Stats (Mocking mostly, but connecting to real DB calls if we had them explicit)
    // We can pull from quest count
    const quests = await window.neuralDb.getQuests();
    const completed = quests.filter((q: any) => q.completed).length;
    
    // Calculate level based on completed quests
    const level = 1 + Math.floor(completed / 5);

    setStats(prev => ({
      ...prev,
      questsCompleted: completed,
      level
    }));
  };

  const updateProfile = async (key: string, value: string) => {
    const newProfile = { ...profile, [key]: value };
    setProfile(newProfile);
    await settingsService.set('profile', key, value);
    // Trigger a custom event so MainLayout can update the avatar immediately
    window.dispatchEvent(new Event('profile-updated'));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        updateProfile('avatar', base64);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="h-full flex flex-col gap-8">
      {/* Header / ID Card Section */}
      <div className="flex items-center gap-8">
        <div className="relative group">
          <div className="w-32 h-32 rounded-3xl overflow-hidden border-2 border-[var(--border-highlight)] shadow-2xl relative bg-[var(--glass-surface)]">
            {profile.avatar ? (
              <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent-primary to-accent-secondary opacity-20">
                <User size={48} className="text-[var(--text-main)]" />
              </div>
            )}
            
            {/* Hover Overlay */}
            <div 
              className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera className="text-white" />
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleFileUpload} 
            />
          </div>
          
          {/* Level Badge */}
          <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full bg-gradient-to-br from-accent-highlight to-accent-secondary flex items-center justify-center text-white font-display text-xl shadow-lg border-4 border-[var(--glass-surface)] z-10">
            {stats.level}
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center gap-1">
          <div className="group relative">
            <span className="absolute -top-3 left-0 text-[10px] font-tech uppercase tracking-[0.2em] text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity">Identity</span>
            <input
              value={profile.name}
              onChange={(e) => updateProfile('name', e.target.value)}
              className="w-full bg-transparent border-b border-transparent hover:border-[var(--border-subtle)] focus:border-accent-highlight outline-none text-5xl font-display text-[var(--text-main)] placeholder:text-[var(--text-muted)] transition-all pb-1"
              placeholder="NAME"
            />
          </div>
          <div className="group relative">
             <input
              value={profile.title}
              onChange={(e) => updateProfile('title', e.target.value)}
              className="w-full bg-transparent border-none outline-none text-xl font-light font-sans text-[var(--text-muted)] placeholder:text-[var(--text-muted)]/50 tracking-wide"
              placeholder="TITLE // DESIGNATION"
            />
          </div>
        </div>
      </div>

      <div className="w-full h-[1px] bg-[var(--border-subtle)]" />

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-6">
        <GlassPanel 
          variant="frosted" 
          className="p-6 flex flex-col items-center justify-center gap-2 group hover:-translate-y-1 hover:shadow-xl hover:border-accent-highlight/30 transition-all duration-300"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-2 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
            <Award size={24} />
          </div>
          <span className="text-4xl font-display text-[var(--text-main)] mt-2">{stats.questsCompleted}</span>
          <span className="text-[10px] font-tech uppercase tracking-[0.2em] text-[var(--text-muted)]">Quests Complete</span>
        </GlassPanel>

        <GlassPanel 
          variant="frosted" 
          className="p-6 flex flex-col items-center justify-center gap-2 group hover:-translate-y-1 hover:shadow-xl hover:border-accent-highlight/30 transition-all duration-300"
        >
           <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-2 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
            <Zap size={24} />
          </div>
          <span className="text-4xl font-display text-[var(--text-main)] mt-2">{stats.level * 100}</span>
          <span className="text-[10px] font-tech uppercase tracking-[0.2em] text-[var(--text-muted)]">XP Generated</span>
        </GlassPanel>

        <GlassPanel 
          variant="frosted" 
          className="p-6 flex flex-col items-center justify-center gap-2 group hover:-translate-y-1 hover:shadow-xl hover:border-accent-highlight/30 transition-all duration-300"
        >
           <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-2 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
            <Clock size={24} />
          </div>
          <span className="text-4xl font-display text-[var(--text-main)] mt-2">--</span>
          <span className="text-[10px] font-tech uppercase tracking-[0.2em] text-[var(--text-muted)]">Focus Hours</span>
        </GlassPanel>
      </div>

      <div className="flex-1" />

      {/* Footer Info */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--glass-surface)] border border-[var(--border-subtle)]">
        <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${stats.level > 5 ? 'bg-amber-400 shadow-[0_0_10px_#fbbf24]' : 'bg-emerald-400 shadow-[0_0_10px_#34d399]'} animate-pulse`} />
            <span className="text-xs font-tech uppercase tracking-wider text-[var(--text-muted)]">Neural Link: Online</span>
        </div>
        <div className="text-xs font-serif italic text-[var(--text-muted)] opacity-80 animate-[pulse_4s_infinite]">
            "The mind is the limit. As long as the mind can envision the fact that you can do something, you can do it."
        </div>
      </div>
    </div>
  );
};
