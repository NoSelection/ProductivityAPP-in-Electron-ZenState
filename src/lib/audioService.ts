let audio: HTMLAudioElement | null = null;
let audioContext: AudioContext | null = null;
let analyser: AnalyserNode | null = null;
let source: MediaElementAudioSourceNode | null = null;
let currentVolume = 1;

export const audioService = {
    play(soundId: string) {
        if (!audio) {
            audio = new Audio();
            audio.loop = true;
        }
        
        audio.src = `/audio/${soundId}.mp3`;
        audio.volume = currentVolume;

        if (!audioContext) {
            // @ts-expect-error webkitAudioContext exists in Safari
            const Context = globalThis.AudioContext || globalThis.webkitAudioContext;
            if (Context) {
                audioContext = new Context();
                analyser = audioContext.createAnalyser();
                analyser.fftSize = 256;
                source = audioContext.createMediaElementSource(audio);
                source.connect(analyser);
                analyser.connect(audioContext.destination);
            }
        }

        if (audioContext && audioContext.state === 'suspended') {
            audioContext.resume();
        }

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

    getFrequencyData(): Uint8Array {
        if (!analyser) return new Uint8Array(0);
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(dataArray);
        return dataArray;
    },

    // For testing
    getAudioInstance() {
        return audio;
    }
};