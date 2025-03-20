/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx,html}"], // Includes HTML files
  theme: {
    extend: {}, // You can customize this if needed
  },
  plugins: [require("daisyui")], // Adds DaisyUI plugin
  daisyui: {
    themes: ["light"],
  },
};
