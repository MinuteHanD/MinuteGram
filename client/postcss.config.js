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
          50: '#1A1A2E',   
          100: '#16213E',   
          200: '#0F3460',   
          300: '#E94560',   
          400: '#FFFFFF',   
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif']
      }
    }
  }
}