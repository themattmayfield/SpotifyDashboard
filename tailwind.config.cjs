/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Text"',
          '"SF Pro Display"',
          '"Helvetica Neue"',
          'Inter',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
      },
      colors: {
        canvas: '#000000',
        sidebar: '#0b0b0c',
        elevated: '#1c1c1e',
        label: {
          DEFAULT: '#f5f5f7',
          secondary: 'rgba(235, 235, 245, 0.6)',
          tertiary: 'rgba(235, 235, 245, 0.32)',
        },
        fill: {
          DEFAULT: 'rgba(255, 255, 255, 0.05)',
          strong: 'rgba(255, 255, 255, 0.1)',
          hover: 'rgba(255, 255, 255, 0.15)',
        },
        separator: 'rgba(255, 255, 255, 0.08)',
        'system-green': '#30d158',
        'system-red': '#ff453a',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
