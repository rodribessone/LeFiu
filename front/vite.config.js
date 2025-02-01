import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/",
  build: {
    outDir: "../dist",  // 👈 Apunta a la raíz del proyecto
    emptyOutDir: true,
    assetsDir: "assets"
  },
  publicDir: "public",
  server: {
    historyApiFallback: true
  }
});