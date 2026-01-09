import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { Play, Pause, SkipForward, Volume2, CloudRain, TreePine, Rocket, Wind, Radio } from 'lucide-react';
import { GlassButton } from '../atoms/GlassButton';
import { audioService } from '../../lib/audioService';

const AMBIENT_PRESETS = [
  { id: 'rain', name: 'Rainfall', icon: CloudRain },
  { id: 'forest', name: 'Forest', icon: TreePine },
  { id: 'deep-space', name: 'Void', icon: Rocket },
  { id: 'white-noise', name: 'Focus', icon: Wind }
];

const STREAM_PRESETS = [
  { id: 'lofi', name: 'Lofi Girl', url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk' },
  { id: 'synth', name: 'Synthwave', url: 'https://www.youtube.com/watch?v=4xDzrJKXOOY' }
];

export const MediaWidget = () => {
  const [mode, setMode] = useState<'ambient' | 'stream'>('ambient');
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentIndex, setCurrentIndex] = useState(0);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Player = ReactPlayer as any;

  useEffect(() => {
    audioService.setVolume(volume);
  }, [volume]);

  const activeItem = mode === 'ambient' ? AMBIENT_PRESETS[currentIndex] : STREAM_PRESETS[currentIndex];

  const togglePlay = () => {
    const nextState = !playing;
    setPlaying(nextState);

    if (mode === 'ambient') {
      if (nextState) audioService.play(AMBIENT_PRESETS[currentIndex].id);
      else audioService.pause();
    }
  };

  const cycle = () => {
    const list = mode === 'ambient' ? AMBIENT_PRESETS : STREAM_PRESETS;
    const next = (currentIndex + 1) % list.length;
    setCurrentIndex(next);
    
    if (playing) {
      if (mode === 'ambient') audioService.play(list[next].id);
    }
  };

  const switchMode = () => {
    setPlaying(false);
    audioService.pause();
    setMode(mode === 'ambient' ? 'stream' : 'ambient');
    setCurrentIndex(0);
  };

  return (
    <div className="flex flex-col h-full justify-between py-2">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <div className={`w-1 h-1 rounded-full ${playing ? 'bg-accent-highlight shadow-[0_0_8px_rgba(56,189,248,0.5)]' : 'bg-[var(--text-muted)] opacity-50'}`} />
          <span className="text-[10px] font-tech text-[var(--text-muted)] uppercase tracking-widest">{mode}</span>
        </div>
        <GlassButton size="icon" variant="ghost" onClick={switchMode} className="w-6 h-6 rounded-lg">
          <Radio size={12} className="text-[var(--text-muted)]" />
        </GlassButton>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div 
          className="relative group cursor-pointer"
          onClick={togglePlay}
        >
          <div className={`
            w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500
            ${playing ? 'bg-accent-highlight/10 scale-105 border-accent-highlight/30' : 'bg-white/5 border-white/5'}
            border backdrop-blur-md
          `}>
            {mode === 'ambient' ? (
              React.createElement((activeItem as typeof AMBIENT_PRESETS[number]).icon, {
                size: 32,
                className: playing ? 'text-accent-highlight' : 'text-[var(--text-muted)]',
                strokeWidth: 1.5
              })
            ) : (
              <Radio size={32} className={playing ? 'text-accent-highlight' : 'text-[var(--text-muted)]'} strokeWidth={1.5} />
            )}
          </div>
          
          {playing && (
            <div className="absolute -inset-2 border border-accent-highlight/20 border-dashed rounded-full animate-[spin_10s_linear_infinite]" />
          )}
        </div>

        <div className="text-center">
          <h3 className="text-lg font-display text-[var(--text-main)] tracking-wide">{activeItem.name}</h3>
          <p className="text-[10px] font-tech text-[var(--text-muted)] uppercase tracking-[0.2em] mt-0.5">
            {playing ? 'Now Playing' : 'Paused'}
          </p>
        </div>
      </div>

      {mode === 'stream' && (
        <div className="hidden">
          <Player
            ref={playerRef}
            url={(activeItem as typeof STREAM_PRESETS[number]).url}
            playing={playing}
            volume={volume}
          />
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-center gap-4">
          <GlassButton
            size="icon"
            variant={playing ? 'primary' : 'secondary'}
            onClick={togglePlay}
            className="w-12 h-12 rounded-full"
          >
            {playing ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
          </GlassButton>
          <GlassButton
            size="icon"
            variant="ghost"
            onClick={cycle}
            className="w-10 h-10 rounded-full text-[var(--text-muted)] hover:text-[var(--text-main)]"
          >
            <SkipForward size={18} />
          </GlassButton>
        </div>

        <div className="flex items-center gap-3 px-6 pb-2 opacity-40 hover:opacity-100 transition-opacity">
          <Volume2 size={12} className="text-[var(--text-main)]" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full h-1 bg-[var(--text-muted)] rounded-full appearance-none cursor-pointer accent-accent-highlight"
          />
        </div>
      </div>
    </div>
  );
};
