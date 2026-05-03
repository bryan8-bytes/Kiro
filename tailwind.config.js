/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sky: {
          50: '#F5FCFF',
          100: '#E6F8FF',
          200: '#C7EEFF',
          300: '#AEE4FF', // Celeste solicitado
          400: '#8BD8FF',
          500: '#60C8FF',
          600: '#3BAEF0',
          700: '#2389C9',
          800: '#1D6E9E',
          900: '#1B5B82',
        },
        pink: {
          50: '#FFF7F9',
          100: '#FFEBF0',
          200: '#FFD1DC',
          300: '#FFB6C1', // Rosado solicitado
          400: '#FF91A4',
          500: '#FF6380',
          600: '#F03A5F',
          700: '#C92445',
          800: '#A8223E',
          900: '#8C2138',
        },
        cream: {
          50: '#FFFFFA',
          100: '#FFFDF0',
          200: '#FFF9DB',
          300: '#FFF5CC', // Crema solicitado
          400: '#FFEDA3',
          500: '#FFE170',
          600: '#EDC645',
          700: '#C29C25',
          800: '#A17F23',
          900: '#856821',
        }
      }
    },
  },
  plugins: [],
}