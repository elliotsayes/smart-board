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
    fontSize: {
      sm: '1rem',
      base: '1.125rem',
      'mid': '1.5rem',
      'subtitle': '1.75rem',
      'title': '2.5rem',
    },
    colors: {
      'black': '#050008',
      // 'pink': 'rgb(213, 109, 251, .5)',
      'pink': '#D56DFB',
      'blue': '#0085FF',
      'purple': 'rgb(136, 140, 246, .5)',
      'green': '#00CA14',
      'red': '#FF0000',
      'list-highlight': '#2C2A2D',
      'code-pen': '#242424',
      'input-field': '#D9D9D9',
    }
  },
  plugins: [],
}

