import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#17212b",
        muted: "#5f6b76",
        paper: "#f7f5ef",
        line: "#ded8cd",
        forest: "#1f6f5b",
        coral: "#d65f4c",
      },
      boxShadow: {
        soft: "0 18px 45px rgba(23, 33, 43, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
