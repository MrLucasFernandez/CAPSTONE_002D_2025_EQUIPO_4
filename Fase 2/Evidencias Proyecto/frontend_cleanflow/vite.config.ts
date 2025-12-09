import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import fs from "fs";
import {VitePWA} from "vite-plugin-pwa";
// SOLO PARA DESARROLLO LOCAL (NO AFECTA PRODUCCIÓN)
const HTTPS_CONFIG = {
  key: fs.readFileSync("./localhost-key.pem"),
  cert: fs.readFileSync("./localhost.pem"),
};

// PROXY LOCAL — SOLO FUNCIONA EN DESARROLLO
const PROXY_CONFIG = {
  target: process.env.VITE_API_URL || "https://cleanflow-back-v0-1.onrender.com",
  changeOrigin: true,
  secure: false,
  cookieDomainRewrite: "localhost",
};

const BACKEND = process.env.VITE_API_URL || "https://cleanflow-back-v0-1.onrender.com";

export default defineConfig({
  server: {
    https: HTTPS_CONFIG,
    host: "localhost",
    port: 5173,
    strictPort: true,
    proxy: {
      "/auth": PROXY_CONFIG,
      "/usuarios": PROXY_CONFIG,
    },
  },

  preview: {
    https: HTTPS_CONFIG,
    host: "localhost",
    port: 4173,
    strictPort: true,
    proxy: {
      "/auth": PROXY_CONFIG,
      "/usuarios": PROXY_CONFIG,
    },
  },

  plugins: [react(), tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logo.png', 'vite.svg'],
      manifest: {
        name: 'Donde Don Gino',
        short_name: 'DDG',
        description: 'Tienda online Donde Don Gino',
        start_url: '/',
        display: 'standalone',
        theme_color: '#405562',
        background_color: '#F5F5F8',
        icons: [
          {
            src: '/logo.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        runtimeCaching: [
          // API del backend
          {
            urlPattern: new RegExp(`^${BACKEND.replace(/\./g, '\\.')}/.*$`),
            handler: 'NetworkFirst',
            options: { 
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 300 // 5 minutos
              }
            }
          },
          // /api en desarrollo
          { 
            urlPattern: /^\/api\/.*$/,
            handler: 'NetworkFirst',
            options: { cacheName: 'api-dev-cache' }
          },
          // imágenes
          { 
            urlPattern: /\.(png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 30 * 24 * 60 * 60 // 30 días
              }
            }
          }
        ]
      },
      devOptions: { enabled: true, type: 'module' }
    })
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@atoms": path.resolve(__dirname, "./src/components/atoms"),
      "@molecules": path.resolve(__dirname, "./src/components/molecules"),
      "@organisms": path.resolve(__dirname, "./src/components/organisms"),
      "@modules": path.resolve(__dirname, "./src/modules"),
      "@admin": path.resolve(__dirname, "./src/modules/admin"),
      "@models": path.resolve(__dirname, "./src/types"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@api": path.resolve(__dirname, "./src/api"),
    },
  },

  // OPTIMIZACIÓN REAL
    build: {
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor";
          }

          if (id.includes("/src/modules/admin/")) {
            return "admin-module";
          }

          if (id.includes("/src/modules/auth/")) {
            return "auth-module";
          }

          if (id.includes("/src/modules/products/")) {
            return "products-module";
          }

          if (id.includes("/src/components/")) {
            return "ui-components";
          }
          if (id.includes("/src/modules/mercadopago/")) {
            return "mercadopago-module";
          }

          return null;
        },
      },
    },
  },

  define: {
    'process.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL),
    'process.env.VITE_FRONTEND_URL': JSON.stringify(process.env.VITE_FRONTEND_URL),
    'process.env.VITE_FIREBASE_API_KEY': JSON.stringify(process.env.VITE_FIREBASE_API_KEY),
    'process.env.VITE_FIREBASE_AUTH_DOMAIN': JSON.stringify(process.env.VITE_FIREBASE_AUTH_DOMAIN),
    'process.env.VITE_FIREBASE_PROJECT_ID': JSON.stringify(process.env.VITE_FIREBASE_PROJECT_ID),
    'process.env.VITE_FIREBASE_STORAGE_BUCKET': JSON.stringify(process.env.VITE_FIREBASE_STORAGE_BUCKET),
    'process.env.VITE_FIREBASE_MESSAGING_SENDER_ID': JSON.stringify(process.env.VITE_FIREBASE_MESSAGING_SENDER_ID),
    'process.env.VITE_FIREBASE_APP_ID': JSON.stringify(process.env.VITE_FIREBASE_APP_ID),
  },
});
