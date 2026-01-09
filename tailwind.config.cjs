/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                glass: {
                    base: 'var(--glass-base)',
                    surface: 'var(--glass-surface)',
                    highlight: 'var(--glass-highlight)',
                },
                accent: {
                    primary: 'var(--accent-primary)',
                    secondary: 'var(--accent-secondary)',
                    highlight: 'var(--accent-highlight)',
                },
                border: {
                    subtle: 'var(--border-subtle)',
                    highlight: 'var(--border-highlight)',
                }
            },
            fontFamily: {
                sans: ['Outfit', 'system-ui', 'sans-serif'],
                serif: ['Cormorant Garamond', 'serif'],
                tech: ['Space Grotesk', 'monospace'],
                display: ['Outfit', 'sans-serif'],
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
                'pale-gradient': 'linear-gradient(to bottom right, #fce7f3 0%, #e0e7ff 50%, #f3e8ff 100%)',
                'void-cloud': 'radial-gradient(circle at 50% 50%, #2e1065 0%, #000000 100%)',
                'prismatic-ray': 'conic-gradient(from 180deg at 50% 50%, #ff0080 0deg, #7DF9FF 120deg, #ffd700 240deg, #ff0080 360deg)',
                'surreal-glow': 'radial-gradient(ellipse at center, rgba(255,255,255,0.1) 0%, transparent 60%)',
            },
            boxShadow: {
                'prism-glow': '0 0 20px rgba(255,0,128,0.3), 0 0 40px rgba(125,249,255,0.2)',
                'pale-glow': '0 0 30px rgba(252, 231, 243, 0.1)',
                'artifact-shadow': '0 10px 30px -10px rgba(0,0,0,0.5)',
            },
        },
    },
    plugins: [],
}
