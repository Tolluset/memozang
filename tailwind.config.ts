import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: "#E5DFA9",
        secondary: "#9381FF",
      },
    },
  },
  plugins: [],
};
export default config;
