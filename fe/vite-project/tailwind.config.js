const daisyui = require("daisyui");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        saffron: '#FF9933',
        'india-green': '#138808',
        'navy-blue': '#000080',
        'royal-gold': '#FFD700',
        'deep-maroon': '#800000',
        'cream': '#FFF8DC',
        'vintage-brown': '#8B4513',
        'neon-cyan': '#00FFFF',
        'neon-pink': '#FF1493',
        'neon-green': '#39FF14',
      },
      fontFamily: {
        retro: ['"Press Start 2P"', 'cursive'],
        classic: ['"Playfair Display"', 'serif'],
        future: ['"Orbitron"', 'sans-serif'],
      },
      boxShadow: {
        'neon': '0 0 5px theme("colors.neon-cyan"), 0 0 20px theme("colors.neon-cyan")',
        'neon-pink': '0 0 5px theme("colors.neon-pink"), 0 0 20px theme("colors.neon-pink")',
        'gold-glow': '0 0 10px theme("colors.royal-gold"), 0 0 40px theme("colors.royal-gold")',
        'vintage': '4px 4px 0px #000, 8px 8px 0px rgba(0,0,0,0.2)',
      },
      backgroundImage: {
        'retro-gradient': 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        'india-gradient': 'linear-gradient(180deg, #FF9933 0%, #FFFFFF 50%, #138808 100%)',
        'cyber-grid': 'linear-gradient(rgba(0,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.03) 1px, transparent 1px)',
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        playknow: {
          primary: "#FF9933",
          secondary: "#138808",
          accent: "#FFD700",
          neutral: "#1a1a2e",
          "base-100": "#0a0a12",
          "base-200": "#121220",
          "base-300": "#1a1a2e",
          info: "#00FFFF",
          success: "#39FF14",
          warning: "#FFD700",
          error: "#FF1493",
        },
      },
    ],
    defaultTheme: "playknow",
  },
};
