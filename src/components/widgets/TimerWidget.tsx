import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { GlassButton } from '../atoms/GlassButton';
import { settingsService } from '../../lib/settingsService';

export const TimerWidget = () => {
  const [focusDuration, setFocusDuration] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      const settings = await settingsService.getAll();
      if (settings.timer?.focusDuration) {
        const duration = settings.timer.focusDuration as number;
        setFocusDuration(duration);
        setTimeLeft(duration * 60);
      }
    };
    loadSettings();
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
        // We could emit events here or use a global store for total focus time
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Notify completion
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(focusDuration * 60);
  };

  const percentage = ((focusDuration * 60 - timeLeft) / (focusDuration * 60)) * 100;
  const circumference = 2 * Math.PI * 45; // Smaller radius for widget
  const strokeDashoffset = circumference - (circumference * percentage) / 100;

  return (
    <div className="flex flex-col items-center justify-between h-full py-8">
      <div className="flex flex-col items-center gap-2">
        <span className="text-[10px] font-tech text-accent-secondary uppercase tracking-[0.3em]">
          Session Alpha
        </span>
        <div className={`h-1 w-1 rounded-full ${isActive ? 'bg-accent-highlight animate-pulse' : 'bg-white/10'}`} />
      </div>

      <div className="relative flex items-center justify-center">
        {/* Glow */}
        <div className={`absolute inset-0 bg-accent-highlight/5 blur-3xl rounded-full transition-opacity duration-1000 ${isActive ? 'opacity-100' : 'opacity-0'}`} />
        
        <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="0.5"
            fill="transparent"
            className="text-white/5"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="text-accent-highlight transition-[stroke-dashoffset] duration-300 ease-linear shadow-[0_0_10px_rgba(56,189,248,0.5)]"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-display font-light text-[var(--text-main)] tracking-tighter">
            {formatTime(timeLeft)}
          </span>
          <span className="text-[10px] font-tech text-[var(--text-muted)] uppercase tracking-widest mt-1">
            {isActive ? 'Active' : 'Standby'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <GlassButton
          size="icon"
          variant={isActive ? 'primary' : 'secondary'}
          onClick={() => setIsActive(!isActive)}
          className="rounded-full w-12 h-12"
        >
          {isActive ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
        </GlassButton>
        <GlassButton
          size="icon"
          variant="ghost"
          onClick={resetTimer}
          className="rounded-full w-10 h-10 text-[var(--text-muted)] hover:text-[var(--text-main)]"
        >
          <RotateCcw size={16} />
        </GlassButton>
      </div>
    </div>
  );
};
