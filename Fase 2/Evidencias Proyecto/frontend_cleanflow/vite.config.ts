import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import fs from 'fs';

const HTTPS_CONFIG = {
  key: fs.readFileSync('./localhost-key.pem'),
  cert: fs.readFileSync('./localhost.pem'),
};

const PROXY_CONFIG = {
  target: 'https://cleanflow-back-v0-1.onrender.com',
  changeOrigin: true,
  secure: false, // permite certificados auto-firmados
  cookieDomainRewrite: 'localhost',
};

export default defineConfig({
  server: {
    https: HTTPS_CONFIG,
    host: 'localhost',
    port: 5173,
    strictPort: true,
    proxy: {
      '/auth': PROXY_CONFIG,
      '/usuarios': PROXY_CONFIG, // 🔹 necesario para info de usuario
      // agrega más rutas si tu frontend llama a otras APIs
    },
  },
  preview: {
    https: HTTPS_CONFIG,
    host: 'localhost',
    port: 5173,
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
