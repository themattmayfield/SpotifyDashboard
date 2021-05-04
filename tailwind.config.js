module.exports = {
  mode: 'jit',
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'spotify-dark': 'rgb(24, 24, 24)',
        'spotify-green': 'rgb(29, 185, 84)',
        'custom-darkgray': '#1B1B1B',
        'custom-darkgray2': '#0E0E0E'
      }
    },
  },
  variants: {
    extend: {
      display: ['hover'],
      animation: ['hover', 'focus']
    },
  },
  plugins: [],
}
