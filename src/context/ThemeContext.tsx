import React, { createContext, useContext, useEffect, useState } from 'react';
import { MotionConfig } from 'framer-motion';
import { settingsService } from '../lib/settingsService';

export type ThemeType = 'matrix' | 'sky' | 'heart' | 'sun' | 'ice';

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
    sky: {
        neon_primary: '#00f0ff',
        neon_secondary: '#ff00aa',
        neon_accent: '#bf00ff',
        accent_base: '185, 100%, 50%',
        accent_secondary: '320, 100%, 50%',
        bg_main: '240, 20%, 5%',
    },
    heart: {
        neon_primary: '#ff6b9d',
        neon_secondary: '#c44569',
        neon_accent: '#ff9ff3',
        accent_base: '340, 100%, 71%',
        accent_secondary: '345, 55%, 52%',
        bg_main: '340, 25%, 6%',
    },
    matrix: {
        neon_primary: '#00ff41',
        neon_secondary: '#008f11',
        neon_accent: '#39ff14',
        accent_base: '130, 100%, 50%',
        accent_secondary: '135, 100%, 28%',
        bg_main: '120, 100%, 2%',
    },
    sun: {
        neon_primary: '#ff6b35',
        neon_secondary: '#f7931e',
        neon_accent: '#ffcc00',
        accent_base: '20, 100%, 60%',
        accent_secondary: '35, 93%, 54%',
        bg_main: '15, 30%, 5%',
    },
    ice: {
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
        const saved = localStorage.getItem('zen-theme') as string;
        // Migration logic for old themes
        if (saved === 'hyper' || saved === 'cyber') return 'sky';
        if (saved === 'ocean' || saved === 'deep-sea') return 'ice';
        if (saved === 'sakura' || saved === 'void') return 'heart';
        if (saved === 'sunset') return 'sun';
        if (saved === 'arctic') return 'ice';
        // Check if saved is valid, else default
        if (['matrix', 'sky', 'heart', 'sun', 'ice'].includes(saved)) {
            return saved as ThemeType;
        }
        return 'sky';
    });

    const [animationsEnabled, setAnimationsEnabled] = useState(true);
    const [blurEnabled, setBlurEnabled] = useState(true);

    const currentColors = Themes[theme] || Themes.sky;

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

        // Map Prismatic variables to Theme Colors for Global Consistency
        root.style.setProperty('--prismatic-1', currentColors.neon_secondary); // Magenta/Secondary
        root.style.setProperty('--prismatic-2', currentColors.neon_primary);   // Cyan/Primary
        root.style.setProperty('--prismatic-3', currentColors.neon_accent);    // Accent

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

        // RGB variants for Prismatic colors (for rgba usage)
        root.style.setProperty('--prismatic-1-rgb', hexToRgb(currentColors.neon_secondary));
        root.style.setProperty('--prismatic-2-rgb', hexToRgb(currentColors.neon_primary));
        root.style.setProperty('--prismatic-3-rgb', hexToRgb(currentColors.neon_accent));

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