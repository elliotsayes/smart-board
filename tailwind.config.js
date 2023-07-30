/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        "fade-in": "fade-in 2s ease-in-out",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: 0 },
          "25%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
}

