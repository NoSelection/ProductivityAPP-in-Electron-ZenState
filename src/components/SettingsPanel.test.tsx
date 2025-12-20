import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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
}));

describe('SettingsPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders timer settings section', async () => {
    render(<SettingsPanel isOpen={true} onClose={() => {}} />);
    
    // Wait for settings to load
    await waitFor(() => {
        expect(screen.getByText('Timer Configuration')).toBeDefined();
    });

    expect(screen.getByLabelText('Focus Duration (min)')).toBeDefined();
    expect(screen.getByLabelText('Short Break (min)')).toBeDefined();
    expect(screen.getByLabelText('Long Break (min)')).toBeDefined();
  });

  it('updates timer settings on change', async () => {
    render(<SettingsPanel isOpen={true} onClose={() => {}} />);

    await waitFor(() => {
        expect(screen.getByLabelText('Focus Duration (min)')).toBeDefined();
    });

    const focusInput = screen.getByLabelText('Focus Duration (min)');
    fireEvent.change(focusInput, { target: { value: '30' } });

    await waitFor(() => {
        expect(settingsService.set).toHaveBeenCalledWith('timer', 'focusDuration', 30);
    });
  });
});
