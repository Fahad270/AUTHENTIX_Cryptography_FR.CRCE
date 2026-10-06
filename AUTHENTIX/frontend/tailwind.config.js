/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        lab: {
          bg: '#0b0f14',
          panel: '#121821',
          panel2: '#161e2a',
          border: '#232c3a',
          accent: '#22d3ee',
          danger: '#f87171',
          success: '#34d399',
          warn: '#fbbf24',
          text: '#e2e8f0',
          muted: '#8b98ab',
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
    },
  },
  plugins: [],
};
