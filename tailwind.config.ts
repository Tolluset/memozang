import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: "#9381FF",
        secondary: "#E5DFA9",
      },
    },
  },
  plugins: [],
};
export default config;
