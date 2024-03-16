/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      white: "#E6E6E6",

      dark: {
        100: "#000000",
        200: "#0F1117",
        250: "#101012",
        300: "#151821",
        400: "#212734",
      },
      light: {
        100: "#FFFFFF",
        200: "#F4F6F8",
        250: "#FDFDFD",
        300: "#DCE3F1",
      },
      gray: {
        100: "#EEEEEE",
        200: "#A2A2A2",
        300: "#7B7B7B",
        400: "#585858",
        500: "#141414",
      },
    },
    extend: {
      fontFamily: {
        Poppins: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};
