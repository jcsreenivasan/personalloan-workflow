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
          DEFAULT: '#EA2523',
          light: '#FEE2E2',
          dark: '#C41E1C',
        },
        secondary: {
          DEFAULT: '#233B86',
          light: '#EEF1FB',
          dark: '#1A2B63',
        },
      },
      fontFamily: {
        sans: ['Open Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
