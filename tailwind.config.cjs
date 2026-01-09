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
                    border: 'var(--glass-border)',
                    glow: 'var(--glass-glow)',
                },
                accent: {
                    primary: 'var(--accent-primary)',
                    secondary: 'var(--accent-secondary)',
                    highlight: 'var(--accent-highlight)',
                },
            },
            fontFamily: {
                sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
                display: ['Cormorant Garamond', 'Times New Roman', 'serif'],
                tech: ['JetBrains Mono', 'SF Mono', 'monospace'],
            },
            borderRadius: {
                '3xl': '2rem',
                '4xl': '2.5rem',
                '5xl': '3rem',
            },
            boxShadow: {
                'artifact': 'var(--shadow-artifact)',
                'glow': 'var(--shadow-glow)',
            },
            animation: {
                'float-slow': 'float 8s ease-in-out infinite',
                'pulse-calm': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'spin-slow': 'spin 20s linear infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                }
            }
        },
    },
    plugins: [],
}
