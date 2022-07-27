/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      animation: {
        fluid: "5s linear 0s infinite alternate fluid",
      },
      keyframes: {
        fluid: {
          "0%": {
            transform: "rotate(0deg) scale(1, 1)",
            filter: "blur(5rem) hue-rotate(0deg)",
          },
          "50%": {
    