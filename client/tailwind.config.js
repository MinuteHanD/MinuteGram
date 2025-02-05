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