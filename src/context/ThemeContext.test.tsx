import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, waitFor, cleanup } from '@testing-library/react';
import { ThemeProvider, useTheme } from './ThemeContext';

// Mock dependencies
vi.mock('../lib/settingsService', () => ({
  settingsService: {
    getAll: vi.fn().mockResolvedValue({
      visual: {
        animationsEnabled: true,
        blurEnabled: true
      }
    }),
    set: vi.fn().mockResolvedValue(undefined)
  }
}));

const TestComponent = () => {
  const { animationsEnabled, blurEnabled } = useTheme() as { animationsEnabled: boolean; blurEnabled: boolean };
  return (
    <div>
      <span data-testid="animations">{animationsEnabled ? 'on' : 'off'}</span>
      <span data-testid="blur">{blurEnabled ? 'on' : 'off'}</span>
    </div>
  );
};

describe('ThemeContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
  });

  it('loads visual settings from settingsService', async () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(getByTestId('animations').textContent).toBe('on');
      expect(getByTestId('blur').textContent).toBe('on');
    });
  });
});
