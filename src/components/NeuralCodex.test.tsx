import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { NeuralCodex } from './NeuralCodex';
import { settingsService } from '../lib/settingsService';
import React from 'react';

// Mock dependencies
vi.mock('../lib/settingsService', () => ({
  settingsService: {
    getAll: vi.fn().mockResolvedValue({
      xp: { difficultyMultiplier: 1.0 }
    })
  }
}));

const mockNotes = [
  { id: '1', title: 'First Note', content: 'Content 1', tags: '[]', updatedAt: Date.now() },
  { id: '2', title: 'Second Note', content: 'Content 2', tags: '[]', updatedAt: Date.now() - 1000 }
];

// @ts-ignore
global.window = {
  neuralDb: {
    getCodexNotes: vi.fn().mockResolvedValue(mockNotes),
    saveCodexNote: vi.fn(),
    deleteCodexNote: vi.fn()
  }
};

// Mock hooks
vi.mock('../hooks/useNeuralStorage', () => ({
  useNeuralStorage: (key: string, initialValue: any) => [initialValue, vi.fn()]
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, style, initial, animate, transition }: any) => (
      <div className={className} style={style}>{children}</div>
    ),
    button: ({ children, className, onClick }: any) => (
      <button className={className} onClick={onClick}>{children}</button>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>
}));

describe('NeuralCodex', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders the sidebar with a list of notes', async () => {
    render(<NeuralCodex />);
    
    await waitFor(() => {
        expect(screen.getByText('First Note')).toBeDefined();
        expect(screen.getByText('Second Note')).toBeDefined();
    });
  });

  it('filters notes based on search query', async () => {
    render(<NeuralCodex />);
    
    await waitFor(() => {
        expect(screen.getByText('First Note')).toBeDefined();
    });

    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: 'First' } });

    expect(screen.getByText('First Note')).toBeDefined();
    expect(screen.queryByText('Second Note')).toBeNull();
  });
});