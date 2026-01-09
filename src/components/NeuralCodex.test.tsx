import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { NeuralCodex } from './NeuralCodex';

const mockNotes = [
  { id: '1', title: 'First Note', content: 'Content 1', tags: '[]', createdAt: Date.now(), updatedAt: Date.now() },
  { id: '2', title: 'Second Note', content: 'Content 2', tags: '[]', createdAt: Date.now() - 1000, updatedAt: Date.now() - 1000 }
];

// Mock dependencies
vi.mock('../lib/settingsService', () => ({
  settingsService: {
    getAll: vi.fn().mockResolvedValue({
      xp: { difficultyMultiplier: 1.0 }
    })
  }
}));

// Mock hooks - must return stable values
vi.mock('../hooks/useNeuralStorage', () => ({
  useNeuralStorage: <T,>(_key: string, initialValue: T) => [initialValue, vi.fn()]
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, style, onClick, layoutId, ...rest }: { children?: React.ReactNode; className?: string; style?: React.CSSProperties; onClick?: () => void; layoutId?: string; [key: string]: unknown }) => (
      <div className={className} style={style} onClick={onClick} data-layoutid={layoutId} {...rest}>{children}</div>
    ),
    button: ({ children, className, onClick }: { children?: React.ReactNode; className?: string; onClick?: () => void }) => (
      <button className={className} onClick={onClick}>{children}</button>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

// Setup window.neuralDb mock
const mockGetCodexNotes = vi.fn().mockResolvedValue(mockNotes);
const mockSaveCodexNote = vi.fn().mockResolvedValue({});
const mockDeleteCodexNote = vi.fn().mockResolvedValue({});

beforeEach(() => {
  // @ts-expect-error - mocking window.neuralDb for tests
  window.neuralDb = {
    getQuests: vi.fn().mockResolvedValue([]),
    saveQuests: vi.fn(),
    getStats: vi.fn().mockResolvedValue([]),
    saveStat: vi.fn(),
    getNotes: vi.fn().mockResolvedValue(''),
    saveNotes: vi.fn(),
    getSettings: vi.fn().mockResolvedValue([]),
    saveSetting: vi.fn(),
    getCodexNotes: mockGetCodexNotes,
    saveCodexNote: mockSaveCodexNote,
    deleteCodexNote: mockDeleteCodexNote
  };
});

describe('NeuralCodex', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetCodexNotes.mockResolvedValue(mockNotes);
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

    const searchInput = screen.getByPlaceholderText(/search codex/i);
    fireEvent.change(searchInput, { target: { value: 'First' } });

    expect(screen.getByText('First Note')).toBeDefined();
    expect(screen.queryByText('Second Note')).toBeNull();
  });
});
