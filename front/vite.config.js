import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/",
  build: {
    outDir: "dist", // ✅ Directorio dentro del proyecto front/
    emptyOutDir: true,
    assetsDir: "assets"
  },
  publicDir: "public",
  server: {
    historyApiFallback: true
  }
});