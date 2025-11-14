/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: "#06080F",
        primary: {
          DEFAULT: "#007AFF",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#22C55E",
          foreground: "#FFFFFF",
        },
        elite: {
          space: "#06080F",
          glass: "rgba(255, 255, 255, 0.05)",
          border: "rgba(255, 255, 255, 0.1)",
        },
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "24px",
      },
      backgroundImage: {
        "metro-gradient": "linear-gradient(135deg, #007AFF 0%, #22C55E 100%)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
}
