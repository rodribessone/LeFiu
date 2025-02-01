import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./",  // ⚠️ IMPORTANTE: Usa "./" en lugar de "/"
  build: {
    outDir: "dist"
  },
  server: {
    historyApiFallback: true
  }
});