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

        'secondary': 'rgb(var(--secondary) / <alpha-value>)',
        'secondary-focus': 'rgb(var(--secondary-focus) / <alpha-value>)',
        'secondary-content': 'rgb(var(--secondary-content) / <alpha-value>)',

        'accent': '#38bdf8', // Light Blue 400
        'accent-focus': '#0ea5e9', // Sky 500
        'accent-content': '#ffffff',

        'neutral': 'rgb(var(--neutral) / <alpha-value>)',
        'neutral-focus': 'rgb(var(--neutral-focus) / <alpha-value>)',
        'neutral-content': 'rgb(var(--neutral-content) / <alpha-value>)',

        'base-100': 'rgb(var(--base-100) / <alpha-value>)',
        'base-200': 'rgb(var(--base-200) / <alpha-value>)',
        'base-300': 'rgb(var(--base-300) / <alpha-value>)',
        'base-content': 'rgb(var(--base-content) / <alpha-value>)',

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