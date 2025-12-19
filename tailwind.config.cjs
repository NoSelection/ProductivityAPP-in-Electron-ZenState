/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
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
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            borderRadius: {
                '3xl': '1.5rem',
                '4xl': '2rem',
                '5xl': '3rem',
            },
            animation: {
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }
        },
    },
    plugins: [],
}
