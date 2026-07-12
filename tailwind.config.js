/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2563EB",
        primaryDark: "#1E3A5F",
        gold: "#F59E0B",
        ink: "#1A202C",
        subtext: "#64748B",
      },
    },
  },
  plugins: [],
};
