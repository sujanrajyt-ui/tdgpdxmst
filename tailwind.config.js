/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                background: 'oklch(0.17 0.017 157 / <alpha-value>)',
                foreground: 'oklch(0.96 0.006 140 / <alpha-value>)',
                surface: 'oklch(0.21 0.019 157 / <alpha-value>)',
                'surface-2': 'oklch(0.25 0.021 157 / <alpha-value>)',
                border: 'oklch(0.3 0.016 157 / <alpha-value>)',
                primary: 'oklch(0.82 0.15 140 / <alpha-value>)',
                'primary-foreground': 'oklch(0.18 0.03 157 / <alpha-value>)',
                'muted-foreground': 'oklch(0.7 0.015 150 / <alpha-value>)',
                verified: 'oklch(0.82 0.15 140 / <alpha-value>)',
                pending: 'oklch(0.82 0.13 85 / <alpha-value>)',
                unverified: 'oklch(0.68 0.02 150 / <alpha-value>)',
                brand: {
                    50: '#f0f4ff',
                    100: '#e0e8ff',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8',
                    800: '#1e40af',
                    900: '#1e3a8a',
                    950: '#0f172a',
                },
                mst: {
                    cyan: '#06b6d4',
                    emerald: '#10b981',
                    purple: '#8b5cf6',
                    amber: '#f59e0b',
                },
                slate: {
                    850: '#131e32',
                    900: '#0f172a',
                    950: '#080d1a',
                }
            },
            fontFamily: {
                display: ['Archivo', 'Helvetica Neue', 'sans-serif'],
                sans: ['Inter', 'Outfit', 'sans-serif'],
                mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
            },
            transitionTimingFunction: {
                cine: 'cubic-bezier(0.22, 1, 0.36, 1)',
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'glow': 'glow 2s ease-in-out infinite alternate',
            },
            keyframes: {
                glow: {
                    '0%': { boxShadow: '0 0 10px rgba(6, 182, 212, 0.2)' },
                    '100%': { boxShadow: '0 0 25px rgba(6, 182, 212, 0.6)' },
                }
            }
        },
    },
    plugins: [],
}
