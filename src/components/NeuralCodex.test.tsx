import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import { NeuralCodex } from './NeuralCodex';
import { settingsService } from '../lib/settingsService';
import React from 'react';

// Mock dependencies
vi.mock('../lib/settingsService', () => ({
  settingsService: {
    getAll: vi.fn().mockResolvedValue({
      xp: {
        difficultyMultiplier: 2.0
      }
    })
  }
}));

// Mock hooks
vi.mock('../hooks/useNeuralStorage', () => ({
  useNeuralStorage: (key: string, initialValue: any) => {
    if (key === 'zen-focus-total') return [3600, vi.fn()]; // 1 hour
    return [initialValue, vi.fn()];
  }
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, style }: any) => (
      <div className={className} style={style}>{children}</div>
    ),
  }
}));

describe('NeuralCodex', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('adjusts rank thresholds based on difficulty multiplier', async () => {
    // With 1 hour and multiplier 1.0, rank would be 'Operator' (>= 1 hour)
    // With 1 hour and multiplier 2.0, 1 hour is not enough for 'Operator' (needs 2 hours)
    // So rank should be 'Initiate'
    
    render(<NeuralCodex />);
    
    await waitFor(() => {
        expect(screen.getByText('Initiate')).toBeDefined();
    });
  });
});
