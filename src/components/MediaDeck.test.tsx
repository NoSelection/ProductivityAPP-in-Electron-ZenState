import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MediaDeck } from './MediaDeck';
import { audioService } from '../lib/audioService';

// Mock audioService
vi.mock('../lib/audioService', () => ({
  audioService: {
    play: vi.fn(),
    pause: vi.fn(),
    setVolume: vi.fn(),
    getFrequencyData: vi.fn().mockReturnValue(new Uint8Array(128).fill(0))
  }
}));

// Mock useTheme
vi.mock('../context/ThemeContext', () => ({
  useTheme: () => ({
    colors: { neon_primary: '#00f0ff', neon_secondary: '#ff00aa' }
  }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, onClick, style, animate, transition, ...rest }: { children?: React.ReactNode; className?: string; onClick?: () => void; style?: React.CSSProperties; animate?: unknown; transition?: unknown; [key: string]: unknown }) => (
      <div className={className} onClick={onClick} style={style} {...rest}>{children}</div>
    ),
    button: ({ children, onClick, className, title }: { children?: React.ReactNode; onClick?: () => void; className?: string; title?: string }) => (
      <button className={className} onClick={onClick} title={title}>{children}</button>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  MotionConfig: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

// Mock Lucide icons
vi.mock('lucide-react', () => ({
  Play: () => <svg data-testid="icon-play" />,
  Pause: () => <svg data-testid="icon-pause" />,
  SkipForward: () => <svg data-testid="icon-skip" />,
  Volume2: () => <svg data-testid="icon-volume" />,
  CloudRain: () => <svg data-testid="icon-rain" />,
  TreePine: () => <svg data-testid="icon-tree" />,
  Rocket: () => <svg data-testid="icon-rocket" />,
  Wind: () => <svg data-testid="icon-wind" />,
}));

// Mock ReactPlayer
vi.mock('react-player', () => ({
  default: () => <div data-testid="mock-player" />
}));

// Mock AudioVisualizer to avoid canvas issues
vi.mock('./AudioVisualizer', () => ({
  AudioVisualizer: () => <div data-testid="mock-visualizer" />
}));

describe('MediaDeck', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders and defaults to ambient mode', () => {
    render(<MediaDeck />);
    // Check mode indicator shows "ambient"
    expect(screen.getByText('ambient')).toBeDefined();
    // Check initial preset name is shown
    expect(screen.getByText('Rainfall')).toBeDefined();
  });

  it('calls audioService.play with rain when play is clicked in ambient mode', () => {
    render(<MediaDeck />);
    // Find the play button (the larger one with icon-play)
    const playIcon = screen.getByTestId('icon-play');
    const playButton = playIcon.closest('button');
    if (playButton) {
      fireEvent.click(playButton);
      expect(audioService.play).toHaveBeenCalledWith('rain');
    }
  });

  it('updates volume via audioService', () => {
    render(<MediaDeck />);
    const volumeSlider = screen.getByRole('slider');
    fireEvent.change(volumeSlider, { target: { value: '0.8' } });
    expect(audioService.setVolume).toHaveBeenCalledWith(0.8);
  });

  it('cycles ambient content', () => {
    render(<MediaDeck />);
    expect(screen.getByText('Rainfall')).toBeDefined();

    // Find skip button
    const skipIcon = screen.getByTestId('icon-skip');
    const skipButton = skipIcon.closest('button');
    if (skipButton) {
      fireEvent.click(skipButton);
    }

    // Should show next preset (Forest)
    expect(screen.getByText('Forest')).toBeDefined();
  });

  it('switches to stream mode', () => {
    render(<MediaDeck />);
    // Find Switch button
    const switchButton = screen.getByText('Switch');
    fireEvent.click(switchButton);

    // Should show stream mode and first stream preset
    expect(screen.getByText('stream')).toBeDefined();
    expect(screen.getByText('Lofi Girl')).toBeDefined();
  });
});
