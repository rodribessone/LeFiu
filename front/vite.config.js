import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: "/",  // Asegura que la base de las rutas sea la raíz
  build: {
    outDir: "dist"
  }
});