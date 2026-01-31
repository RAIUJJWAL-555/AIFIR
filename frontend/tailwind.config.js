/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E6EBF2',
          100: '#C0CCD9',
          200: '#94A8BF',
          300: '#6985A6',
          400: '#40638C',
          500: '#1A4373',
          600: '#13355B',
          700: '#0B1F3A', // Official Deep Navy
          800: '#071527',
          900: '#040B15',
        },
        secondary: {
          50: '#F2F4F7', // Light Ash Grey
          100: '#E2E6EA',
          200: '#C5CED6',
          300: '#A4B4C1',
          400: '#849AAD',
          500: '#1E293B', // Slate replacement
          600: '#475569',
          700: '#334155',
          800: '#0B1F3A', // Dark Navy for contrast
          900: '#0F172A',
        },
        accent: {
          DEFAULT: '#C9A227', // Government Gold
          light: '#E3C151',
          dark: '#A48218',
        },
        success: '#1E7F5C',
        error: '#8B1E1E',
        text: '#1C1C1C',
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'system-ui', 'sans-serif'],
        serif: ['Merriweather', 'serif'], 
      },
      backgroundImage: {
        'gov-pattern': "url('https://www.transparenttextures.com/patterns/cubes.png')", // Subtle pattern placeholder
      }
    },
  },
  plugins: [],
}
