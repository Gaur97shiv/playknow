const daisyui = require("daisyui");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'soil': '#5C4033',
        'mud': '#6B4423',
        'clay': '#8B5A2B',
        'earth': '#A0522D',
        'sand': '#C4A77D',
        'wheat': '#D4B896',
        'parchment': '#E8D5B5',
        'aged-paper': '#D9C9A3',
        'rust': '#B7410E',
        'terracotta': '#C04000',
        'moss': '#556B2F',
        'forest': '#2E5A1C',
        'bark': '#3D2914',
        'coffee': '#4A2C2A',
        'sepia': '#704214',
      },
      fontFamily: {
        classic: ['"Times New Roman"', 'Times', 'serif'],
        system: ['Arial', 'Helvetica', 'sans-serif'],
      },
      boxShadow: {
        'bevel': 'inset -2px -2px 0px #3D2914, inset 2px 2px 0px #C4A77D',
        'bevel-dark': 'inset 2px 2px 0px #3D2914, inset -2px -2px 0px #C4A77D',
        'classic': '4px 4px 0px #3D2914',
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        playknow: {
          primary: "#B7410E",
          secondary: "#556B2F",
          accent: "#8B5A2B",
          neutral: "#5C4033",
          "base-100": "#C4A77D",
          "base-200": "#A08060",
          "base-300": "#8B7355",
          info: "#6B4423",
          success: "#556B2F",
          warning: "#C04000",
          error: "#B7410E",
        },
      },
    ],
    defaultTheme: "playknow",
  },
};
