let audio: HTMLAudioElement | null = null;
let currentVolume = 1;

export const audioService = {
    play(soundId: string) {
        if (audio) {
            audio.pause();
        }
        audio = new Audio(`/audio/${soundId}.mp3`);
        audio.loop = true;
        audio.volume = currentVolume;
        audio.play().catch(err => console.error('Audio playback failed:', err));
    },

    pause() {
        if (audio) {
            audio.pause();
        }
    },

    setVolume(volume: number) {
        currentVolume = volume;
        if (audio) {
            audio.volume = volume;
        }
    },

    // For testing
    getAudioInstance() {
        return audio;
    }
};
