/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        bg: '#FDFBEA',
        primary: '#FF535A',
        dark: '#303030',
        gold: '#FFAF34',
        'light-blue': '#DBE5E7',
        salmon: '#FFA292',
        olive: '#C4C45C',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'xl': '12px',
      },
    },
  },
  plugins: [],
};

