/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: "#0A0A0A",
        surfaceAlt: "#0F0F0F",
        ink: "#F5F0E8",
        subtext: "#9C968C",
      },
      borderColor: {
        line: "rgba(255, 255, 255, 0.1)",
        lineFaint: "rgba(255, 255, 255, 0.06)",
      },
      fontFamily: {
        sans: ["Inter", "Pretendard", "-apple-system", "Noto Sans KR", "sans-serif"],
        serif: ['"Instrument Serif"', '"Noto Serif KR"', "serif"],
      },
    },
  },
  plugins: [],
};
