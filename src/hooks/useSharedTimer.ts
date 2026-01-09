import { useState, useEffect, useCallback, useRef } from 'react';
import { settingsService } from '../lib/settingsService';

// Event types for the broadcast channel
type TimerEvent =
    | { type: 'SYNC_STATE', payload: { timeLeft: number; isActive: boolean; focusDuration: number } }
    | { type: 'TOGGLE' }
    | { type: 'RESET' }
    | { type: 'UPDATE_DURATION', payload: number };

export const useSharedTimer = () => {
    const [focusDuration, setFocusDuration] = useState(25);
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const channelRef = useRef<BroadcastChannel | null>(null);
    const isLeader = useRef(false); // Only one tab/window should run the interval

    // Initialize BroadcastChannel
    useEffect(() => {
        const channel = new BroadcastChannel('zen-timer-sync');
        channelRef.current = channel;

        channel.onmessage = (event: MessageEvent<TimerEvent>) => {
            const { type, payload } = event.data;

            switch (type) {
                case 'SYNC_STATE':
                    // Another window pushed its state to us
                    if (payload) {
                        setTimeLeft(payload.timeLeft);
                        setIsActive(payload.isActive);
                        setFocusDuration(payload.focusDuration);
                    }
                    break;
                case 'TOGGLE':
                    setIsActive(prev => !prev);
                    break;
                case 'RESET':
                    // We can't access current focusDuration inside callback easily without ref or dep, 
                    // but we can trust the state update cycle or re-fetch settings? 
                    // For simplicity, we'll let the leader handle the specific reset state broadcast if needed,
                    // or just locally reset if we are synced.
                    // Actually, 'RESET' just signals "Hey, everyone stop and reset".
                    setIsActive(false);
                    // We will update timeLeft in the effect below when interactions happen
                    break;
                case 'UPDATE_DURATION':
                    if (typeof payload === 'number') {
                        setFocusDuration(payload);
                        setTimeLeft(payload * 60);
                        setIsActive(false);
                    }
                    break;
            }
        };

        // Determine leadership simply: Main window is usually leader, artifacts follow?
        // Or just race. For now, we'll let the logic flow.
        // If we are main window (not in /artifact route), we might want to enforce leadership.
        // But simplest is: Interval only runs if isActive is true. 
        // Problem: If 2 windows are open, both running intervals = double speed.
        // userSharedTimer needs to know if it should control the tick.
        // "Official" way: use a shared worker or store start_time.
        // "Simple" way for this app: The MAIN window runs the tick. Artifacts just listen.
        // If Main window is closed? Artifact takes over? 
        // Let's assume Main Window stays open for now as per "Eject" logic usually implies.
        // We will check route to decide if we run the ticker.
        isLeader.current = !window.location.hash.includes('artifact');

        return () => {
            channel.close();
        };
    }, []);

    // Sync settings on mount
    useEffect(() => {
        const loadSettings = async () => {
            const settings = await settingsService.getAll();
            if (settings.timer?.focusDuration) {
                const duration = settings.timer.focusDuration as number;
                setFocusDuration(duration);
                if (!isActive) {
                    setTimeLeft(duration * 60);
                }
            }
        };
        loadSettings();
    }, [isActive]);


    // Timer Interval (Leader Only)
    useEffect(() => {
        let timer: ReturnType<typeof setInterval> | undefined;

        // We run the timer logic IF we are the leader (Main Window)
        // OR if we are an artifact but we haven't received a heartbeat in a while? 
        // For MVP: Main Window runs the timer logic. Artifacts display it.
        // Actually, to make it smoother, sync START_TIME and let local calculate?
        // That's more robust. But standard interval sync via message every second is "okay" for a minimalist app.
        // Let's have the leader broadcast state every second.

        const isArtifact = window.location.href.includes('artifact');

        if (!isArtifact && isActive && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => {
                    const newState = prev - 1;
                    // Broadcast new state
                    channelRef.current?.postMessage({
                        type: 'SYNC_STATE',
                        payload: { timeLeft: newState, isActive: true, focusDuration }
                    });
                    return newState;
                });
            }, 1000);
        }
        else if (!isArtifact && timeLeft === 0 && isActive) {
            setIsActive(false);
            // Save Session
            if (window.neuralDb?.saveSession) {
                window.neuralDb.saveSession(focusDuration);
            }
            channelRef.current?.postMessage({
                type: 'SYNC_STATE',
                payload: { timeLeft: 0, isActive: false, focusDuration }
            });
        }

        return () => {
            if (timer) clearInterval(timer);
        };
    }, [isActive, timeLeft, focusDuration]);

    const toggleTimer = useCallback(() => {
        setIsActive(prev => {
            const newState = !prev;
            channelRef.current?.postMessage({ type: 'TOGGLE' });
            // Also broadcast state immediately to ensure sync
            channelRef.current?.postMessage({
                type: 'SYNC_STATE',
                payload: { timeLeft, isActive: newState, focusDuration }
            });
            return newState;
        });
    }, [timeLeft, focusDuration]);

    const resetTimer = useCallback(() => {
        setIsActive(false);
        setTimeLeft(focusDuration * 60);
        channelRef.current?.postMessage({ type: 'RESET' });
        channelRef.current?.postMessage({
            type: 'SYNC_STATE',
            payload: { timeLeft: focusDuration * 60, isActive: false, focusDuration }
        });
    }, [focusDuration]);

    return {
        focusDuration,
        timeLeft,
        isActive,
        toggleTimer,
        resetTimer
    };
};
