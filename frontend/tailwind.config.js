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
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        beige: {
          50: '#fffcf5',
          100: '#fdf5e6',
          200: '#f5f5dc',
          300: '#efefd0',
          400: '#e5e4b5',
          500: '#dcdba1',
        },
        khaki: {
          50: '#fdfcf0',
          100: '#faf9e0',
          200: '#f5f4cd',
          300: '#f0e68c',
          400: '#e6d97a',
          500: '#d9c866',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
