/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#3B82F6",
        primaryDark: "#1E3A5F",
        gold: "#F59E0B",
        ink: "#F1F5F9",
        subtext: "#94A3B8",
        surface: "#0A0F1E",
        surfaceAlt: "#0F1526",
        card: "#141E33",
      },
    },
  },
  plugins: [],
};
