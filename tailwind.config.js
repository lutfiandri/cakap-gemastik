/** @type {import('tailwindcss').Config} */

const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  mode: "jit",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "c-01": "#FFB640",
        "c-02": "#FF9D00",
        "c-03": "#FF6254",
        "c-04": "#1BD5E1",
        "c-05": "#129AA3",
        "c-clips": "#8860D0",
        "c-dana": "#84CEEB",
        "c-lilac": "#C2B8FD",
        "c-light-blue": "#84CEEB",
        "c-ovo": "#8860D0",
      },
      fontFamily: {
        poppins: ["Poppins", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
