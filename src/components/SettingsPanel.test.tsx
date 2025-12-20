import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { SettingsPanel } from './SettingsPanel';
import { settingsService } from '../lib/settingsService';

// Mock dependencies
vi.mock('../context/ThemeContext', () => ({
  useTheme: () => ({
    theme: 'hyper',
    setTheme: vi.fn(),
    colors: { neon_primary: '#00f0ff', neon_secondary: '#ff00aa' }
  }),
}));

vi.mock('../lib/settingsService', () => ({
  settingsService: {
    getAll: vi.fn().mockResolvedValue({
      timer: {
        focusDuration: 25,
        shortBreakDuration: 5,
        longBreakDuration: 15
      },
      xp: {
        difficultyMultiplier: 1.0
      },
      visual: {
        animationsEnabled: true,
        blurEnabled: true
      }
    }),
    set: vi.fn().mockResolvedValue(undefined)
  }
}));

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, onClick, style }: any) => (
      <div className={className} onClick={onClick} style={style}>{children}</div>
    ),
    button: ({ children, onClick, className }: any) => (
      <button className={className} onClick={onClick}>{children}</button>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock Lucide icons
vi.mock('lucide-react', () => ({
  X: () => <svg data-testid="icon-x" />,
  Palette: () => <svg data-testid="icon-palette" />,
  Zap: () => <svg data-testid="icon-zap" />,
  Waves: () => <svg data-testid="icon-waves" />,
  Leaf: () => <svg data-testid="icon-leaf" />,
  Sun: () => <svg data-testid="icon-sun" />,
  Snowflake: () => <svg data-testid="icon-snowflake" />,
  Sparkles: () => <svg data-testid="icon-sparkles" />,
  Settings: () => <svg data-testid="icon-settings" />,
  Timer: () => <svg data-testid="icon-timer" />,
  Gamepad2: () => <svg data-testid="icon-gamepad" />,
  Eye: () => <svg data-testid="icon-eye" />,
}));

describe('SettingsPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders timer settings section', async () => {
    render(<SettingsPanel isOpen={true} onClose={() => {}} />);
    
    await waitFor(() => {
        const elements = screen.getAllByText('Timer Configuration');
        expect(elements.length).toBeGreaterThan(0);
    });

    expect(screen.getAllByLabelText('Focus Duration (min)')[0]).toBeDefined();
    expect(screen.getAllByLabelText('Short Break (min)')[0]).toBeDefined();
    expect(screen.getAllByLabelText('Long Break (min)')[0]).toBeDefined();
  });

  it('updates timer settings on change', async () => {
    render(<SettingsPanel isOpen={true} onClose={() => {}} />);

    await waitFor(() => {
        expect(screen.getAllByLabelText('Focus Duration (min)')[0]).toBeDefined();
    });

    const focusInput = screen.getAllByLabelText('Focus Duration (min)')[0];
    fireEvent.change(focusInput, { target: { value: '30' } });

    await waitFor(() => {
        expect(settingsService.set).toHaveBeenCalledWith('timer', 'focusDuration', 30);
    });
  });

  it('renders XP settings section', async () => {
    render(<SettingsPanel isOpen={true} onClose={() => {}} />);
    
    await waitFor(() => {
        const elements = screen.getAllByText('Progression & XP');
        expect(elements.length).toBeGreaterThan(0);
    });

    expect(screen.getAllByLabelText('Difficulty Multiplier (x)')[0]).toBeDefined();
  });

  it('updates XP settings on change', async () => {
    render(<SettingsPanel isOpen={true} onClose={() => {}} />);

    await waitFor(() => {
        expect(screen.getAllByLabelText('Difficulty Multiplier (x)')[0]).toBeDefined();
    });

    const input = screen.getAllByLabelText('Difficulty Multiplier (x)')[0];
    fireEvent.change(input, { target: { value: '1.5' } });

    await waitFor(() => {
        expect(settingsService.set).toHaveBeenCalledWith('xp', 'difficultyMultiplier', 1.5);
    });
  });

    it('renders Visual Identity settings', async () => {

      render(<SettingsPanel isOpen={true} onClose={() => {}} />);

      

      await waitFor(() => {

          const elements = screen.getAllByText('Visual Identity');

          expect(elements.length).toBeGreaterThan(0);

      });

  

      expect(screen.getAllByText('Animations Enabled')[0]).toBeDefined();

      expect(screen.getAllByText('Blur Effects')[0]).toBeDefined();

    });

  

    it('toggles visual settings on click', async () => {

      render(<SettingsPanel isOpen={true} onClose={() => {}} />);

  

      await waitFor(() => {

          expect(screen.getAllByText('Animations Enabled')[0]).toBeDefined();

      });

  

      const toggleLabel = screen.getAllByText('Animations Enabled')[0];

      fireEvent.click(toggleLabel);

  

      await waitFor(() => {

          expect(settingsService.set).toHaveBeenCalledWith('visual', 'animationsEnabled', false);

      });

    });

  });

  