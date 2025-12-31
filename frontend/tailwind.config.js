/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{html,ts}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // Professional, sophisticated palette
                brand: {
                    primary: '#1a1a2e',
                    secondary: '#16213e',
                    accent: '#0f3460',
                    highlight: '#533483',
                },
                neutral: {
                    50: '#f7fafc',
                    100: '#edf2f7',
                    200: '#e2e8f0',
                    300: '#cbd5e0',
                    400: '#a0aec0',
                    500: '#718096',
                    600: '#4a5568',
                    700: '#2d3748',
                    800: '#1a202c',
                    900: '#171923',
                }
            },
            fontFamily: {
                sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                display: ['Playfair Display', 'Georgia', 'serif'],
                mono: ['IBM Plex Mono', 'ui-monospace', 'monospace'],
            },
            fontSize: {
                'xs': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.01em' }],
                'sm': ['0.875rem', { lineHeight: '1.6', letterSpacing: '0.0075em' }],
                'base': ['1rem', { lineHeight: '1.7', letterSpacing: '0' }],
                'lg': ['1.125rem', { lineHeight: '1.7', letterSpacing: '-0.005em' }],
                'xl': ['1.25rem', { lineHeight: '1.6', letterSpacing: '-0.01em' }],
                '2xl': ['1.5rem', { lineHeight: '1.5', letterSpacing: '-0.015em' }],
                '3xl': ['1.875rem', { lineHeight: '1.4', letterSpacing: '-0.02em' }],
                '4xl': ['2.25rem', { lineHeight: '1.3', letterSpacing: '-0.025em' }],
                '5xl': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.03em' }],
                '6xl': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.03em' }],
                '7xl': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.03em' }],
            },
            spacing: {
                '18': '4.5rem',
                '88': '22rem',
                '100': '25rem',
                '112': '28rem',
                '128': '32rem',
            },
            borderRadius: {
                'sm': '0.25rem',
                DEFAULT: '0.5rem',
                'md': '0.75rem',
                'lg': '1rem',
                'xl': '1.5rem',
            },
            boxShadow: {
                'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                'professional': '0 4px 12px rgba(0, 0, 0, 0.08)',
                'professional-hover': '0 12px 24px rgba(0, 0, 0, 0.12)',
            },
            animation: {
                'fade-in': 'fadeIn 400ms ease-out',
                'fade-in-up': 'fadeInUp 600ms ease-out',
                'slide-in-left': 'slideInLeft 600ms ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(24px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideInLeft: {
                    '0%': { opacity: '0', transform: 'translateX(-24px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
            },
            backdropBlur: {
                xs: '2px',
                'professional': '16px',
            },
        },
    },
    plugins: [],
}
