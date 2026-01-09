import { render, act, screen } from '@testing-library/react';
import { TimerWidget } from '../TimerWidget';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

// Stability: Mock the service directly to bypass async DB logic for loading
vi.mock('../../../lib/settingsService', () => ({
  settingsService: {
    getAll: vi.fn().mockResolvedValue({ timer: { focusDuration: 25 } }),
  },
}));

describe('TimerWidget RPG Mechanics', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Gentler mocking for the Save action
    Object.defineProperty(window, 'neuralDb', {
      value: {
        saveSession: vi.fn(),
      },
      writable: true,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    // @ts-expect-error - Resetting mock for tests
    window.neuralDb = undefined;
  });

  it('should save session XP data when timer completes', async () => {
    render(<TimerWidget />);

    // Allow initial effects and async settings load to settle
    await act(async () => {
      await vi.runAllTimersAsync();
    });

    // Find the play button (it's the first button)
    const buttons = document.querySelectorAll('button');
    const playButton = buttons[0];

    // Start Timer
    await act(async () => {
      playButton.click();
    });

    // Check if it's active
    expect(screen.getByText('Active')).toBeTruthy();

    // Advance time by 25 minutes (25 * 60 * 1000ms) - need to tick through each second
    // The timer decrements timeLeft by 1 every 1000ms, starting at 1500 (25*60)
    // We need 1500 ticks to reach 0, plus one more interval to trigger the completion check
    for (let i = 0; i <= 25 * 60; i++) {
      await act(async () => {
        vi.advanceTimersByTime(1000);
      });
    }

    // Verify neuralDb.saveSession was called with 25 minutes
    expect(window.neuralDb.saveSession).toHaveBeenCalledWith(25);
  });
});
