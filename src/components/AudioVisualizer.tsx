import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { audioService } from '../lib/audioService';

interface AudioVisualizerProps {
    isPlaying: boolean;
    intensity?: number; // 0 to 1
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isPlaying, intensity = 1 }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { colors } = useTheme();

    useEffect(() => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;

        const draw = () => {
            const data = audioService.getFrequencyData();
            const width = canvas.width;
            const height = canvas.height;

            ctx.clearRect(0, 0, width, height);

            const barWidth = (width / data.length) * 2.5;
            let barHeight;
            let x = 0;

            for (let i = 0; i < data.length; i++) {
                barHeight = (data[i] / 255) * height * intensity;

                const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight);
                gradient.addColorStop(0, `${colors.neon_primary}40`);
                gradient.addColorStop(1, colors.neon_primary);

                ctx.fillStyle = gradient;
                ctx.fillRect(x, height - barHeight, barWidth, barHeight);

                x += barWidth + 1;
            }

            if (isPlaying) {
                animationFrameId = requestAnimationFrame(draw);
            }
        };

        if (isPlaying) {
            draw();
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [isPlaying, colors, intensity]);

    return (
        <canvas
            ref={canvasRef}
            className="w-full h-full opacity-60"
            width={300}
            height={100}
        />
    );
};
