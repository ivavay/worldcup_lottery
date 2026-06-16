import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "gold-glow": "0 0 36px rgba(244, 190, 74, 0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
