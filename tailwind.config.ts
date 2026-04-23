import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    "animate-fade-up",
    "stagger-1",
    "stagger-2",
    "stagger-3",
    "prose-link",
    "blur-md",
    "blur-none",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
export default config;
