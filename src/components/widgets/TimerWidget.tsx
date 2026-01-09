import { useMemo } from 'react';
import { Play, Pause, RotateCcw, ExternalLink } from 'lucide-react';
import { GlassButton } from '../atoms/GlassButton';
import { useSharedTimer } from '../../hooks/useSharedTimer';

// Pure utility function
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

interface TimerWidgetProps {
  isArtifact?: boolean;
}

export const TimerWidget = ({ isArtifact = false }: TimerWidgetProps) => {
  const { focusDuration, timeLeft, isActive, toggleTimer, resetTimer } = useSharedTimer();

  // Memoize SVG calculations
  const { circumference, strokeDashoffset } = useMemo(() => {
    const circ = 2 * Math.PI * 45;
    const percentage = ((focusDuration * 60 - timeLeft) / (focusDuration * 60)) * 100;
    return {
      circumference: circ,
      strokeDashoffset: circ - (circ * percentage) / 100
    };
  }, [focusDuration, timeLeft]);

  const handleEject = () => {
    window.electron.openArtifact('timer');
  };

  return (
    <div className={`flex flex-col items-center justify-center h-full gap-6 ${isArtifact ? '' : 'py-8'}`}>
      {!isArtifact ? (
        <div className="flex flex-col items-center gap-2">
          <div className="relative">
            <span className="text-[10px] font-tech text-accent-secondary uppercase tracking-[0.3em]">
              Session Alpha
            </span>
            <button
              onClick={handleEject}
              className="absolute -right-8 top-1/2 -translate-y-1/2 p-1 text-accent-secondary hover:text-accent-highlight transition-colors opacity-50 hover:opacity-100"
              title="Eject Artifact"
            >
              <ExternalLink size={10} />
            </button>
          </div>

          <div className={`h-1 w-1 rounded-full ${isActive ? 'bg-accent-highlight animate-pulse' : 'bg-white/10'}`} />
        </div>
      ) : null}

      <div className={`relative flex items-center justify-center ${isArtifact ? 'mb-4' : ''}`}>
        {/* Glow */}
        <div className={`absolute inset-0 bg-accent-highlight/10 blur-3xl rounded-full transition-opacity duration-1000 ${isActive ? 'opacity-100' : 'opacity-0'}`} />

        {/* Ring */}
        <svg className={`${isArtifact ? 'w-48 h-48' : 'w-48 h-48'} transform -rotate-90`} viewBox="0 0 100 100" aria-hidden="true">
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="0.5"
            fill="transparent"
            className="text-white/10"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth={isArtifact ? 2 : 1.5}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="text-accent-highlight transition-[stroke-dashoffset] duration-300 ease-linear shadow-[0_0_15px_var(--accent-highlight)]"
          />
        </svg>

        {/* Digital Time */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span
            className={`${isArtifact ? 'text-4xl translate-y-[-10px]' : 'text-4xl'} font-display font-medium text-[var(--text-main)] tracking-tight transition-transform`}
            role="timer"
            aria-live="polite"
            aria-atomic="true"
          >
            {formatTime(timeLeft)}
          </span>
          <span className={`${isArtifact ? 'text-[9px] translate-y-[-10px]' : 'text-[10px]'} font-tech text-[var(--text-muted)] uppercase tracking-widest mt-2 opacity-80 transition-transform`}>
            {isActive ? 'Flowing' : 'Standby'}
          </span>
        </div>

        {/* Overlay Controls for Artifact Mode */}
        {isArtifact && (
          <div className="absolute bottom-6 flex items-center justify-center gap-4 z-20 pointer-events-auto" style={{ WebkitAppRegion: 'no-drag' } as any}>
            <GlassButton
              size="icon"
              variant={isActive ? 'primary' : 'secondary'}
              onClick={toggleTimer}
              className="rounded-full w-12 h-12 shadow-lg hover:scale-105 active:scale-95 transition-all text-white bg-glass-surface/80 border border-white/10 hover:bg-accent-primary/20 backdrop-blur-md"
              aria-label={isActive ? 'Pause timer' : 'Start timer'}
            >
              {isActive ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
            </GlassButton>

            <GlassButton
              size="icon"
              variant="ghost"
              onClick={resetTimer}
              className="rounded-full w-8 h-8 text-white/40 hover:text-white hover:bg-white/10 transition-colors absolute -right-12"
              aria-label="Reset timer"
            >
              <RotateCcw size={14} />
            </GlassButton>
          </div>
        )}
      </div>

      {/* Main App Controls (Hidden in Artifact) */}
      {!isArtifact && (
        <div className="flex items-center gap-6" role="group" aria-label="Timer controls">
          <GlassButton
            size="icon"
            variant={isActive ? 'primary' : 'secondary'}
            onClick={toggleTimer}
            className="rounded-full w-12 h-12"
            aria-label={isActive ? 'Pause timer' : 'Start timer'}
          >
            {isActive ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
          </GlassButton>

          <GlassButton
            size="icon"
            variant="ghost"
            onClick={resetTimer}
            className="rounded-full w-10 h-10 text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-glass-surface"
            aria-label="Reset timer"
          >
            <RotateCcw size={16} />
          </GlassButton>
        </div>
      )}
    </div>
  );
};
