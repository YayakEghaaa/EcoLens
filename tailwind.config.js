/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        green: {
          light: '#52B788',
          mid:   '#3A9E6B',
          dark:  '#2D6A4F',
        },
        teal: {
          light: '#40BFB0',
          mid:   '#2A9D8F',
          dark:  '#1A6B60',
        },
        eco: {
          bg:      '#0A0F0D',
          surface: '#111A14',
          card:    '#162019',
          border:  '#1E2D22',
        },
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'scan-line': 'scanLine 2s ease-in-out infinite',
        'pulse-dot': 'pulseDot 2s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'fade-in-up': 'fadeInUp 0.5s ease both',
        'counter-up': 'counterUp 1.5s ease both',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-20px)' },
        },
        scanLine: {
          '0%':   { top: '0%', opacity: '1' },
          '100%': { top: '100%', opacity: '0' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%':      { opacity: '0.5', transform: 'scale(1.3)' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
