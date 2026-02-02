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
          beige: "#F5F5F0",
          greige: "#D9D9D2",
          pale: "#EAE7E2",
          accent: "#C2B9AC",
          translucent: "rgba(255, 255, 255, 0.6)",
        },
      },
      fontFamily: {
        serif: ['"Noto Serif JP"', '"Playfair Display"', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
      },
      aspectRatio: {
        'story': '9/16',
      },
    },
  },
  plugins: [],
}
