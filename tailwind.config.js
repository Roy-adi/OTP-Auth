/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        brand: {
          50: '#fdf4ff',
          100: '#f9e8ff',
          200: '#f2c9fe',
          300: '#e89ffd',
          400: '#d967f9',
          500: '#c33ef0',
          600: '#a41fd0',
          700: '#8718ab',
          800: '#6f1789',
          900: '#5c1871',
        },
        ink: {
          DEFAULT: '#0f0a1e',
          soft: '#1e1635',
          muted: '#2d2448',
        },
        cream: {
          DEFAULT: '#faf7f2',
          dark: '#f0ebe0',
        }
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
        'slide-in': 'slideIn 0.4s ease forwards',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideIn: {
          '0%': { opacity: 0, transform: 'translateX(-10px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.6 },
        },
      },
      boxShadow: {
        'glow': '0 0 30px rgba(195, 62, 240, 0.25)',
        'glow-sm': '0 0 15px rgba(195, 62, 240, 0.15)',
        'card': '0 4px 24px rgba(15, 10, 30, 0.08)',
        'card-hover': '0 8px 40px rgba(15, 10, 30, 0.14)',
      }
    },
  },
  plugins: [],
}
