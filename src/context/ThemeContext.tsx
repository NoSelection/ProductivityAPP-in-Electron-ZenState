import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeType = 'cyber' | 'sakura' | 'deep-sea' | 'matrix' | 'custom';

interface ThemeColors {
    accent_base: string;
    accent_secondary: string;
    bg_main: string;
}

interface ThemeContextType {
    theme: ThemeType;
    setTheme: (theme: ThemeType) => void;
    colors: ThemeColors;
    setCustomColors: (colors: Partial<ThemeColors>) => void;
}

const Themes: Record<ThemeType, ThemeColors> = {
    cyber: {
        accent_base: '220, 90%, 65%',
        accent_secondary: '185, 90%, 50%',
        bg_main: '230, 20%, 5%',
    },
    sakura: {
        accent_base: '340, 80%, 65%',
        accent_secondary: '320, 80%, 45%',
        bg_main: '340, 20%, 5%',
    },
    'deep-sea': {
        accent_base: '170, 90%, 45%',
        accent_secondary: '180, 80%, 70%',
        bg_main: '210, 30%, 5%',
    },
    matrix: {
        accent_base: '145, 100%, 50%',
        accent_secondary: '135, 100%, 30%',
        bg_main: '145, 100%, 2%',
    },
    custom: {
        accent_base: '220, 90%, 65%',
        accent_secondary: '185, 90%, 50%',
        bg_main: '230, 20%, 5%',
    }
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setThemeState] = useState<ThemeType>(() => {
        return (localStorage.getItem('zen-theme') as ThemeType) || 'cyber';
    });

    const [customColors, setCustomColorsState] = useState<ThemeColors>(() => {
        const saved = localStorage.getItem('zen-custom-colors');
        return saved ? JSON.parse(saved) : Themes.cyber;
    });

    const currentColors = theme === 'custom' ? customColors : Themes[theme];

    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty('--accent-base', currentColors.accent_base);
        root.style.setProperty('--accent-secondary', currentColors.accent_secondary);
        root.style.setProperty('--bg-main', currentColors.bg_main);

        localStorage.setItem('zen-theme', theme);
    }, [theme, currentColors]);

    const setTheme = (newTheme: ThemeType) => setThemeState(newTheme);

    const setCustomColors = (newColors: Partial<ThemeColors>) => {
        const updated = { ...customColors, ...newColors };
        setCustomColorsState(updated);
        localStorage.setItem('zen-custom-colors', JSON.stringify(updated));
        setThemeState('custom');
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme, colors: currentColors, setCustomColors }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within ThemeProvider');
    return context;
};
