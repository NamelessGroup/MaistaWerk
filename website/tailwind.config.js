const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        link: '#6a76de',
        primary: {
          ...colors.slate,
          //'500': '#32A189',
          //'700': colors.teal[950]
        }
      },
    },
  },
  plugins: [],
}

