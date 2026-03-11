import plugin from "tailwindcss/plugin";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#5f5FFF",
        beige: "#B99A6A",
        light_beige: "#E3D5B3",
      },
      gridTemplateColumns: {
        auto: "repeat(auto-fill,minmax(200px,1fr))",
      },
      keyframes: {
        expandWidth: {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
        cardIn: {
          "0%": { opacity: "0", transform: "translateY(20px) scale(0.97)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        shimmer: {
          "0%, 100%": { "background-position": "0% 50%" },
          "50%": { "background-position": "100% 50%" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        expandWidth: "expandWidth 1s linear infinite",
        cardIn: "cardIn 0.5s cubic-bezier(0.34, 1.4, 0.64, 1) both",
        shimmer: "shimmer 4s ease-in-out infinite",
        fadeUp: "fadeUp 0.35s ease both",
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".animate-expandWidth": {
          animation: "expandWidth 2s linear infinite",
        },
      });
    }),
  ],
};
