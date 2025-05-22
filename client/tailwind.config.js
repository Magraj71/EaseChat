/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "#facc15", // Yellow border (Tailwind's yellow-400)
        ring: "#facc15", // Yellow outline
        background: "#ffffff", // White background
        foreground: "#000000", // Black text
      },
    },
  },
  plugins: [],
};
