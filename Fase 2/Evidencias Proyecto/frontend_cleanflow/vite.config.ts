import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import fs from 'fs';

// 🔐 SOLO PARA DESARROLLO LOCAL (NO AFECTA PRODUCCIÓN)
const HTTPS_CONFIG = {
  key: fs.readFileSync('./localhost-key.pem'),
  cert: fs.readFileSync('./localhost.pem'),
};

// 🛠️ PROXY LOCAL — SOLO FUNCIONA EN DESARROLLO
// En producción (Vercel) NO se usa.
// Las peticiones deben ir a import.meta.env.VITE_API_URL.
const PROXY_CONFIG = {
  target: process.env.VITE_API_URL || 'https://cleanflow-back-v0-1.onrender.com',
  changeOrigin: true,
  secure: false,
  cookieDomainRewrite: 'localhost',
};

export default defineConfig({
  // 🌐 CONFIGURACIÓN SOLO PARA DESARROLLO
  server: {
    https: HTTPS_CONFIG,
    host: 'localhost',
    port: 5173,
    strictPort: true,

    // ⚠️ Solo se usa en local, NO en Vercel
    proxy: {
      '/auth': PROXY_CONFIG,
      '/usuarios': PROXY_CONFIG,
    },
  },

  // Vista previa local (tampoco afecta Vercel)
  preview: {
    https: HTTPS_CONFIG,
    host: 'localhost',
    port: 4173,
    strictPort: true,
    proxy: {
      '/auth': PROXY_CONFIG,
      '/usuarios': PROXY_CONFIG,
    },
  },

  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      '@assets': path.resolve(__dirname, './src/assets'),
    },
  },
});
