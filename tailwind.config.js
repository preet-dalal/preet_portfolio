/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend:  {
      colors: {
        cosmic: {
          900: '#0a0e27',
          800: '#1a1f3a',
          700: '#2a2f4f',
        },
      },
      backgroundImage: {
        'cosmic-gradient': 'linear-gradient(135deg, #fb923c 0%, #dc2626 100%)',
      },
    },
  },
  plugins: [],
}