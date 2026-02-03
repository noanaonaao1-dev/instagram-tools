/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lumi: {
          beige: "#F8F8F5",
          greige: "#D9D9D2",
          pale: "#F2F2EE",
          sage: "#E2E7E2",
          slate: "#E2E4E7",
          dark: "#3A3A38",
          accent: "#A0A096",
          translucent: "rgba(255, 255, 255, 0.6)",
        },
      },
      fontFamily: {
        serif: ['"Noto Serif JP"', '"Playfair Display"', 'serif'],
        sans: ['"M PLUS Rounded 1c"', '"Inter"', 'sans-serif'],
      },
      aspectRatio: {
        'story': '9/16',
      },
      borderRadius: {
        'lumi': '2rem',
        'lumi-lg': '3rem',
      },
    },
  },
  plugins: [],
}
