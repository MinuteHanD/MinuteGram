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
        'primary': '#10b981', // Emerald 500
        'primary-focus': '#059669', // Emerald 600
        'primary-content': '#ffffff',

        'secondary': '#374151', // Gray 700
        'secondary-focus': '#1f2937', // Gray 800
        'secondary-content': '#ffffff',

        'accent': '#38bdf8', // Light Blue 400
        'accent-focus': '#0ea5e9', // Sky 500
        'accent-content': '#ffffff',

        'neutral': '#1f2937', // Gray 800
        'neutral-focus': '#111827', // Gray 900
        'neutral-content': '#ffffff',

        'base-100': '#0d1117', // A dark, slightly blue-ish black
        'base-200': '#161b22', // A slightly lighter dark shade
        'base-300': '#21262d', // An even lighter shade for borders
        'base-content': '#c9d1d9', // Light gray for text

        'info': '#3abff8',
        'success': '#36d399',
        'warning': '#fbbd23',
        'error': '#f87272',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.4s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
}