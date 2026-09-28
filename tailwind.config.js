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
                sans: ['Inter', 'Outfit', 'sans-serif'],
                mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
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
