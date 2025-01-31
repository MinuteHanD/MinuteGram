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
          50: '#121212',    // Deepest background
          100: '#1E1E1E',   // Slightly lighter background
          200: '#2A2A2A',   // Card/section background
          300: '#E94560',   // Accent color (vibrant red)
          400: '#FFFFFF',   // Text color
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: [],
}