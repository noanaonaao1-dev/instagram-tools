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
          beige: "#FDFCFB", // Lighter, milkier beige
          greige: "#E9E9E2",
          pale: "#F7F7F5",
          mist: "#E6EEF2", // New misty blue
          rose: "#F7E6E9", // New soft rose
          lavender: "#EDE7F2", // New soft lavender
          dark: "#4A4A48",
          accent: "#C2C2B8",
          translucent: "rgba(255, 255, 255, 0.4)", // More transparent
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
        'lumi': '2.5rem', // Even more rounded
        'lumi-lg': '4rem',
      },
    },
  },
  plugins: [],
}
