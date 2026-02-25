import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      colors: {
        accent: {
          DEFAULT: "#7c6dfa",
          dim: "rgba(124,109,250,0.15)",
          glow: "rgba(124,109,250,0.3)",
        },
        surface: {
          DEFAULT: "#0f0f0f",
          card: "#141414",
          inner: "#1a1a1a",
        },
      },
      animation: {
        "fade-up": "fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both",
        "fade-up-delay": "fadeUp 0.5s 0.1s cubic-bezier(0.16,1,0.3,1) both",
        pulse: "pulse 2.5s ease infinite",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(16px) scale(0.98)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
