import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import fs from "fs";

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

  plugins: [react(), tailwindcss()],

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
    },
  },
});
