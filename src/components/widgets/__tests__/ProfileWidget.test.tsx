import { render, screen } from '@testing-library/react';
import { ProfileWidget } from '../ProfileWidget';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

// Mock ThemeContext
vi.mock('../../features/theme/ThemeContext', () => ({
  useTheme: () => ({ theme: 'dark' }),
}));

// Mock Settings Service
vi.mock('../../lib/settingsService', () => ({
  settingsService: {
    getAll: vi.fn().mockResolvedValue({ profile: { name: 'Test Operative' } }),
  },
}));

describe('ProfileWidget XP Engine', () => {
  beforeEach(() => {
    // Gentler mocking
    Object.defineProperty(window, 'neuralDb', {
      value: {
        getQuests: vi.fn().mockResolvedValue([
          { id: '1', completed: true },  // 50 XP
          { id: '2', completed: true },  // 50 XP
          { id: '3', completed: false }, // 0 XP
        ]),
        getSessions: vi.fn().mockResolvedValue([
          { duration: 60 }, // 60 mins * 10 XP = 600 XP
          { duration: 30 }, // 30 mins * 10 XP = 300 XP
        ]),
        // Fix: Add getSettings mock so settingsService doesn't crash
        getSettings: vi.fn().mockResolvedValue([]),
      },
      writable: true,
    });
  });

  afterEach(() => {
    // @ts-expect-error - Resetting mock for tests
    window.neuralDb = undefined;
  });

  it('should calculate Level, XP, and Hours correctly', async () => {
    render(<ProfileWidget />);

    // Expected XP: 1000
    // Expected Level: 3
    // Expected Hours: 1

    // Use findByText which waits for appearance
    const xp = await screen.findByText('1000');
    const hours = await screen.findByText('1');
    const level = await screen.findByText('3');

    expect(xp).toBeTruthy();
    expect(hours).toBeTruthy();
    expect(level).toBeTruthy();
  });
});
