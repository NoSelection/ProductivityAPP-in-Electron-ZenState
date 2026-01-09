import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent, cleanup } from '@testing-library/react';
import { Timer } from './Timer';

// Mock dependencies
vi.mock('../lib/settingsService', () => ({
  settingsService: {
    getAll: vi.fn().mockResolvedValue({
      timer: {
        focusDuration: 45,
        shortBreakDuration: 5,
        longBreakDuration: 15
      }
    })
  }
}));

// Mock hooks
vi.mock('../hooks/useNeuralStorage', () => ({
  useNeuralStorage: <T,>(_key: string, initialValue: T) => [initialValue, vi.fn()]
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, style }: { children?: React.ReactNode; className?: string; style?: React.CSSProperties }) => (
      <div className={className} style={style}>{children}</div>
    ),
    button: ({ children, onClick, className }: { children?: React.ReactNode; onClick?: () => void; className?: string }) => (
      <button className={className} onClick={onClick}>{children}</button>
    ),
    circle: ({ children, ...props }: React.SVGProps<SVGCircleElement>) => <circle {...props}>{children}</circle>
  }
}));

// Mock Lucide icons
vi.mock('lucide-react', () => ({
  X: () => <svg data-testid="icon-x" aria-label="x" />,
  Palette: () => <svg data-testid="icon-palette" aria-label="palette" />,
  Zap: () => <svg data-testid="icon-zap" aria-label="zap" />,
  Waves: () => <svg data-testid="icon-waves" aria-label="waves" />,
  Leaf: () => <svg data-testid="icon-leaf" aria-label="leaf" />,
  Sun: () => <svg data-testid="icon-sun" aria-label="sun" />,
  Snowflake: () => <svg data-testid="icon-snowflake" aria-label="snowflake" />,
  Sparkles: () => <svg data-testid="icon-sparkles" aria-label="sparkles" />,
  Settings: () => <svg data-testid="icon-settings" aria-label="settings" />,
  Timer: () => <svg data-testid="icon-timer" aria-label="timer" />,
  Gamepad2: () => <svg data-testid="icon-gamepad" aria-label="gamepad" />,
  Eye: () => <svg data-testid="icon-eye" aria-label="eye" />,
  Play: () => <svg data-testid="icon-play" aria-label="play" />,
  Pause: () => <svg data-testid="icon-pause" aria-label="pause" />,
  RotateCcw: () => <svg data-testid="icon-rotate-ccw" aria-label="rotate-ccw" />,
  Clock: () => <svg data-testid="icon-clock" aria-label="clock" />,
}));

describe('Timer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('initializes with focus duration from settings', async () => {
    render(<Timer />);
    
    await waitFor(() => {
        expect(screen.getByText('45:00')).toBeDefined();
    });
  });

  it('resets to the configured duration', async () => {
    render(<Timer />);
    
    await waitFor(() => {
        expect(screen.getByText('45:00')).toBeDefined();
    });

    const resetButton = screen.getByLabelText('rotate-ccw').parentElement;
    if (resetButton) fireEvent.click(resetButton);

    expect(screen.getByText('45:00')).toBeDefined();
  });
});