/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}", // Quét tất cả file trong src
  ],
  theme: {
    extend: {
      colors: {
        'hin-green': '#166534',
      }
    },
  },
  plugins: [],
}