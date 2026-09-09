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
        background: '#090D16',
        surface: '#0F172A',
        surfaceLight: '#1E293B',
        accentPrimary: '#2563EB',
        accentCyan: '#06B6D4',
        accentEmerald: '#10B981',
        accentAmber: '#F59E0B',
        accentRose: '#F43F5E',
        textPrimary: '#F8FAFC',
        textSecondary: '#94A3B8',
        borderDark: '#334155'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
