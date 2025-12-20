import React, { createContext, useContext, useEffect, useState } from 'react';
import { MotionConfig } from 'framer-motion';
import { settingsService } from '../lib/settingsService';

export type ThemeType = 'hyper' | 'sakura' | 'ocean' | 'matrix' | 'sunset' | 'arctic';

interface ThemeColors {
    // Primary neon colors
    neon_primary: string;
    neon_secondary: string;
    neon_accent: string;
    // Legacy HSL support
    accent_base: string;
    accent_secondary: string;
    bg_main: string;
}

interface ThemeContextType {
    theme: ThemeType;
    setTheme: (theme: ThemeType) => void;
    colors: ThemeColors;
    animationsEnabled: boolean;
    blurEnabled: boolean;
}

const Themes: Record<ThemeType, ThemeColors> = {
    hyper: {
        neon_primary: '#00f0ff',
        neon_secondary: '#ff00aa',
        neon_accent: '#bf00ff',
        accent_base: '185, 100%, 50%',
        accent_secondary: '320, 100%, 50%',
        bg_main: '240, 20%, 5%',
    },
    sakura: {
        neon_primary: '#ff6b9d',
        neon_secondary: '#c44569',
        neon_accent: '#ff9ff3',
        accent_base: '340, 100%, 71%',
        accent_secondary: '345, 55%, 52%',
        bg_main: '340, 25%, 6%',
    },
    ocean: {
        neon_primary: '#00d9ff',
        neon_secondary: '#0099cc',
        neon_accent: '#66ffff',
        accent_base: '190, 100%, 50%',
        accent_secondary: '195, 100%, 40%',
        bg_main: '210, 40%, 5%',
    },
    matrix: {
        neon_primary: '#00ff41',
        neon_secondary: '#008f11',
        neon_accent: '#39ff14',
        accent_base: '130, 100%, 50%',
        accent_secondary: '135, 100%, 28%',
        bg_main: '120, 100%, 2%',
    },
    sunset: {
        neon_primary: '#ff6b35',
        neon_secondary: '#f7931e',
        neon_accent: '#ffcc00',
        accent_base: '20, 100%, 60%',
        accent_secondary: '35, 93%, 54%',
        bg_main: '15, 30%, 5%',
    },
    arctic: {
        neon_primary: '#a8e6ff',
        neon_secondary: '#7dd3fc',
        neon_accent: '#e0f2fe',
        accent_base: '195, 100%, 83%',
        accent_secondary: '199, 95%, 74%',
        bg_main: '210, 30%, 6%',
    },
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setThemeState] = useState<ThemeType>(() => {
        const saved = localStorage.getItem('zen-theme') as ThemeType;
        // Map old theme names to new ones
        if (saved === 'cyber' as string) return 'hyper';
        if (saved === 'deep-sea' as string) return 'ocean';
        return saved || 'hyper';
    });

    const [animationsEnabled, setAnimationsEnabled] = useState(true);
    const [blurEnabled, setBlurEnabled] = useState(true);

    const currentColors = Themes[theme] || Themes.hyper;

    useEffect(() => {
        const loadVisualSettings = async () => {
            const settings = await settingsService.getAll();
            if (settings.visual) {
                if (settings.visual.animationsEnabled !== undefined) {
                    setAnimationsEnabled(settings.visual.animationsEnabled);
                }
                if (settings.visual.blurEnabled !== undefined) {
                    setBlurEnabled(settings.visual.blurEnabled);
                }
            }
        };
        loadVisualSettings();
    }, []);

    useEffect(() => {
        const root = document.documentElement;

        // Set neon colors as CSS variables
        root.style.setProperty('--neon-cyan', currentColors.neon_primary);
        root.style.setProperty('--neon-magenta', currentColors.neon_secondary);
        root.style.setProperty('--neon-purple', currentColors.neon_accent);

        // Legacy HSL support
        root.style.setProperty('--accent-base', currentColors.accent_base);
        root.style.setProperty('--accent-secondary', currentColors.accent_secondary);
        root.style.setProperty('--bg-main', currentColors.bg_main);

        // Store RGB values for box-shadows and other effects
        const hexToRgb = (hex: string) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result
                ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
                : '0, 240, 255';
        };

        root.style.setProperty('--accent-base-rgb', hexToRgb(currentColors.neon_primary));
        root.style.setProperty('--accent-secondary-rgb', hexToRgb(currentColors.neon_secondary));

        localStorage.setItem('zen-theme', theme);
    }, [theme, currentColors]);

    const setTheme = (newTheme: ThemeType) => setThemeState(newTheme);

    return (
        <ThemeContext.Provider value={{ theme, setTheme, colors: currentColors, animationsEnabled, blurEnabled }}>
            <MotionConfig reducedMotion={animationsEnabled ? 'user' : 'always'}>
                {children}
            </MotionConfig>
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within ThemeProvider');
    return context;
};