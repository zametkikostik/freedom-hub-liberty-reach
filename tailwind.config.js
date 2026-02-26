/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          black: '#0A0A0F',
          dark: '#12121A',
          gray: '#1A1A25',
          cyan: {
            DEFAULT: '#00FFFF',
            glow: '#00FFFF40',
            dark: '#00CCCC',
          },
          purple: {
            DEFAULT: '#BF00FF',
            glow: '#BF00FF40',
            dark: '#9900CC',
          },
          green: {
            DEFAULT: '#39FF14',
            glow: '#39FF1440',
            dark: '#2DCC0F',
          },
          pink: {
            DEFAULT: '#FF0080',
            glow: '#FF008040',
            dark: '#CC0066',
          },
          orange: {
            DEFAULT: '#FF8000',
            glow: '#FF800040',
            dark: '#CC6600',
          },
          red: {
            DEFAULT: '#FF0040',
            glow: '#FF004040',
            dark: '#CC0033',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'neon-cyan': '0 0 10px #00FFFF, 0 0 20px #00FFFF40, 0 0 30px #00FFFF20',
        'neon-purple': '0 0 10px #BF00FF, 0 0 20px #BF00FF40, 0 0 30px #BF00FF20',
        'neon-green': '0 0 10px #39FF14, 0 0 20px #39FF1440, 0 0 30px #39FF1420',
        'neon-pink': '0 0 10px #FF0080, 0 0 20px #FF008040, 0 0 30px #FF008020',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-sm': '0 4px 16px 0 rgba(0, 0, 0, 0.25)',
        'inner-glow': 'inset 0 0 20px rgba(0, 255, 255, 0.1)',
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '40px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'cyber-grid': `
          linear-gradient(rgba(0, 255, 255, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 255, 255, 0.03) 1px, transparent 1px)
        `,
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'scan': 'scan 3s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'marquee': 'marquee 15s linear infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #00FFFF, 0 0 10px #00FFFF40' },
          '100%': { boxShadow: '0 0 20px #00FFFF, 0 0 30px #00FFFF80' },
        },
        scan: {
          '0%': { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '0% 100%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}
