/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // HYPER Neon Palette
                neon: {
                    cyan: '#00f0ff',
                    magenta: '#ff00aa',
                    lime: '#39ff14',
                    orange: '#ff6600',
                    purple: '#bf00ff',
                    yellow: '#ffff00',
                },
                hyper: {
                    black: '#0a0a0f',
                    dark: '#12121a',
                    panel: '#1a1a24',
                    border: '#2a2a3a',
                },
                accent: {
                    base: 'hsl(var(--accent-base))',
                    secondary: 'hsl(var(--accent-secondary))',
                },
                bg: {
                    main: 'hsl(var(--bg-main))',
                },
                white: {
                    DEFAULT: '#FFFFFF',
                    5: 'rgba(255, 255, 255, 0.05)',
                    10: 'rgba(255, 255, 255, 0.1)',
                    20: 'rgba(255, 255, 255, 0.2)',
                    40: 'rgba(255, 255, 255, 0.4)',
                }
            },
            fontFamily: {
                sans: ['Rajdhani', 'system-ui', 'sans-serif'],
                display: ['Orbitron', 'sans-serif'],
                mono: ['Share Tech Mono', 'JetBrains Mono', 'monospace'],
            },
            borderRadius: {
                '3xl': '1.5rem',
                '4xl': '2rem',
                '5xl': '3rem',
            },
            animation: {
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
                'scan': 'scan 8s linear infinite',
                'flicker': 'flicker 0.15s infinite',
                'glitch': 'glitch 1s linear infinite',
                'data-stream': 'data-stream 20s linear infinite',
                'border-flow': 'border-flow 3s linear infinite',
                'neon-flicker': 'neon-flicker 3s infinite',
                'float': 'float 6s ease-in-out infinite',
                'cyber-spin': 'cyber-spin 20s linear infinite',
            },
            keyframes: {
                'glow-pulse': {
                    '0%, 100%': { opacity: '1', filter: 'brightness(1)' },
                    '50%': { opacity: '0.8', filter: 'brightness(1.3)' },
                },
                'scan': {
                    '0%': { transform: 'translateY(-100%)' },
                    '100%': { transform: 'translateY(100vh)' },
                },
                'flicker': {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.8' },
                },
                'glitch': {
                    '0%, 100%': { transform: 'translate(0)' },
                    '20%': { transform: 'translate(-2px, 2px)' },
                    '40%': { transform: 'translate(-2px, -2px)' },
                    '60%': { transform: 'translate(2px, 2px)' },
                    '80%': { transform: 'translate(2px, -2px)' },
                },
                'data-stream': {
                    '0%': { backgroundPosition: '0% 0%' },
                    '100%': { backgroundPosition: '0% 100%' },
                },
                'border-flow': {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
                'neon-flicker': {
                    '0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%': {
                        textShadow: '0 0 4px #fff, 0 0 11px #fff, 0 0 19px #fff, 0 0 40px var(--neon-color), 0 0 80px var(--neon-color)',
                        boxShadow: '0 0 4px #fff, 0 0 11px #fff, 0 0 19px #fff, 0 0 40px var(--neon-color), 0 0 80px var(--neon-color)',
                    },
                    '20%, 24%, 55%': {
                        textShadow: 'none',
                        boxShadow: 'none',
                    },
                },
                'float': {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                'cyber-spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                },
            },
            backgroundImage: {
                'grid-pattern': 'linear-gradient(rgba(0,240,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.03) 1px, transparent 1px)',
                'cyber-gradient': 'linear-gradient(135deg, #00f0ff 0%, #bf00ff 50%, #ff00aa 100%)',
                'neon-glow': 'radial-gradient(ellipse at center, rgba(0,240,255,0.15) 0%, transparent 70%)',
            },
            boxShadow: {
                'neon-cyan': '0 0 5px #00f0ff, 0 0 20px #00f0ff, 0 0 40px #00f0ff',
                'neon-magenta': '0 0 5px #ff00aa, 0 0 20px #ff00aa, 0 0 40px #ff00aa',
                'neon-lime': '0 0 5px #39ff14, 0 0 20px #39ff14, 0 0 40px #39ff14',
                'neon-purple': '0 0 5px #bf00ff, 0 0 20px #bf00ff, 0 0 40px #bf00ff',
                'inner-glow': 'inset 0 0 30px rgba(0,240,255,0.1)',
            },
        },
    },
    plugins: [],
}
