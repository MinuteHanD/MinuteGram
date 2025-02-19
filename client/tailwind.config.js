/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin-slow 20s linear infinite',
      },
      keyframes: {
        'spin-slow': {
          'from': { transform: 'rotate(0deg)' },
          'to': { transform: 'rotate(360deg)' },
        }
      },
      colors: {
        dark: {
          50: '#121212',    
          100: '#1E1E1E',   
          200: '#2A2A2A',   
          300: '#E94560',   
          400: '#FFFFFF',   
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: [],
}