module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },

  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          50: '#1A1A2E',   // Deepest background
          100: '#16213E',   // Slightly lighter background
          200: '#0F3460',   // Card/section background
          300: '#E94560',   // Accent color (vibrant red)
          400: '#FFFFFF',   // Text color
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif']
      }
    }
  }
}