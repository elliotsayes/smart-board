/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        "fade-in": "fade-in 1s ease-in-out",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },
    },
    colors: {
      'block': '#050008',
      'pink': 'rgb(213, 109, 251, .5)',
      'blue': '#0085FF',
      'purple': 'rgb(136, 140, 246, .5)',
      'green': '#00CA14',
      'red': '#FF0000',
      'list-highlight': '#2C2A2D',
    }
  },
  plugins: [],
}

