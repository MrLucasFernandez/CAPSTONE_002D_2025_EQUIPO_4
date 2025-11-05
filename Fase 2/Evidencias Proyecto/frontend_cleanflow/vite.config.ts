// vite.config.ts

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import path from 'path'; // 1. IMPORTAR PATH

export default defineConfig({
  plugins: [react(), tailwindcss()],
  
  // 2. AÑADIR LA SECCIÓN RESOLVE
  resolve: {
    alias: {
      // Mapea @assets a la ruta absoluta de la carpeta src/assets
      '@assets': path.resolve(__dirname, './src/assets'), 
    },
  },
});