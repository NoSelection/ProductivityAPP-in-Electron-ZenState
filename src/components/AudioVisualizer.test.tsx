import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { AudioVisualizer } from './AudioVisualizer';
import React from 'react';

// Mock useTheme
vi.mock('../context/ThemeContext', () => ({
  useTheme: () => ({
    colors: { neon_primary: '#00f0ff', neon_secondary: '#ff00aa' }
  })
}));

// Mock audioService
vi.mock('../lib/audioService', () => ({
  audioService: {
    getFrequencyData: vi.fn().mockReturnValue(new Uint8Array(128).fill(0))
  }
}));

describe('AudioVisualizer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders a canvas element', () => {
    const { container } = render(<AudioVisualizer isPlaying={true} />);
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeDefined();
  });
});
