import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MediaDeck } from './MediaDeck';
import { audioService } from '../lib/audioService';
import React from 'react';

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
  ThemeProvider: ({ children }: any) => <div>{children}</div>
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, onClick, style }: any) => (
      <div className={className} onClick={onClick} style={style}>{children}</div>
    ),
    button: ({ children, onClick, className, title }: any) => (
      <button className={className} onClick={onClick} title={title}>{children}</button>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
  MotionConfig: ({ children }: any) => <>{children}</>
}));

// Mock Lucide icons
vi.mock('lucide-react', () => ({
  Play: () => <svg data-testid="icon-play" aria-label="play" />,
  Pause: () => <svg data-testid="icon-pause" aria-label="pause" />,
  SkipForward: () => <svg data-testid="icon-skip" aria-label="skip" />,
  Volume2: () => <svg data-testid="icon-volume" aria-label="volume" />,
  Radio: () => <svg data-testid="icon-radio" aria-label="radio" />,
  Link: () => <svg data-testid="icon-link" aria-label="link" />,
  Eye: () => <svg data-testid="icon-eye" aria-label="eye" />,
  CloudRain: () => <svg data-testid="icon-rain" />,
  TreePine: () => <svg data-testid="icon-tree" />,
  Rocket: () => <svg data-testid="icon-rocket" />,
  Wind: () => <svg data-testid="icon-wind" />,
  Music: () => <svg data-testid="icon-music" aria-label="music" />,
}));

// Mock ReactPlayer
vi.mock('react-player', () => ({
  default: () => <div data-testid="mock-player" />
}));

describe('MediaDeck', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders and defaults to ambient mode', async () => {
    render(<MediaDeck />);
    expect(screen.getByText(/AUDIO DECK/i)).toBeDefined();
    expect(screen.getAllByText(/Rainfall/i)[0]).toBeDefined();
  });

  it('calls audioService.play with rain when play is clicked in ambient mode', async () => {
    render(<MediaDeck />);
    const playButton = screen.getAllByRole('button')[2]; 
    fireEvent.click(playButton);
    expect(audioService.play).toHaveBeenCalledWith('rain');
  });

  it('updates volume via audioService', async () => {
    render(<MediaDeck />);
    const volumeSlider = screen.getAllByRole('slider')[0];
    fireEvent.change(volumeSlider, { target: { value: '0.8' } });
    expect(audioService.setVolume).toHaveBeenCalledWith(0.8);
  });

  it('cycles ambient content', async () => {
    render(<MediaDeck />);
    expect(screen.getAllByText(/Rainfall/i)[0]).toBeDefined();
    
    const skipButton = screen.getAllByLabelText('skip')[0].parentElement;
    if (skipButton) fireEvent.click(skipButton);
    
    expect(screen.getAllByText(/Pine Forest/i)[0]).toBeDefined();
  });

  it('switches to stream mode', async () => {
    render(<MediaDeck />);
    const modeButton = screen.getAllByLabelText('music')[0].parentElement;
    if (modeButton) fireEvent.click(modeButton);
    
    expect(screen.getAllByText(/Lofi Girl/i)[0]).toBeDefined();
  });
});