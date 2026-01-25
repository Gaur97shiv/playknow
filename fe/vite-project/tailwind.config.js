const daisyui = require("daisyui");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: '#FFF8E7',
        'cream-dark': '#F5E6D3',
        'vintage-tan': '#D4B896',
        'vintage-brown': '#8B6914',
        'vintage-orange': '#E07020',
        'vintage-red': '#C45C26',
        'vintage-green': '#2E6B4D',
        'vintage-blue': '#2B4F81',
        'paper': '#FFFEF0',
        'coffee': '#6F4E37',
        'burgundy': '#722F37',
      },
      fontFamily: {
        classic: ['"Times New Roman"', 'Times', 'serif'],
        retro: ['"Comic Sans MS"', 'cursive'],
        system: ['Arial', 'Helvetica', 'sans-serif'],
      },
      boxShadow: {
        'bevel': 'inset -2px -2px 0px #888, inset 2px 2px 0px #fff',
        'bevel-dark': 'inset 2px 2px 0px #888, inset -2px -2px 0px #fff',
        'classic': '3px 3px 0px #888',
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        playknow: {
          primary: "#E07020",
          secondary: "#2E6B4D",
          accent: "#2B4F81",
          neutral: "#D4B896",
          "base-100": "#FFF8E7",
          "base-200": "#F5E6D3",
          "base-300": "#E8D5BC",
          info: "#2B4F81",
          success: "#2E6B4D",
          warning: "#E07020",
          error: "#C45C26",
        },
      },
    ],
    defaultTheme: "playknow",
  },
};
