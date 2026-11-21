/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        arcade: {
          bg: "#0B0F17",
          panel: "#131A26",
          card: "#192233",
          border: "#26354D",
          borderLight: "#374B6B",
          textMuted: "#8E9EB5",
        },
      },
    },
  },
  plugins: [],
};
