import { defineConfig } from "vite";

export default defineConfig({
  base: "memozang",
  resolve: {
    alias: [{ find: "~", replacement: "/src" }],
  },
  css: {
    modules: {
      localsConvention: "camelCaseOnly",
    },
  },
});
