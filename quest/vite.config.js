// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import path from "path";

// ✅ Load environment variables from .env
dotenv.config();

export default defineConfig({
  plugins: [
    react({
      jsxImportSource: "react",
      babel: {
        plugins: [
          ["@babel/plugin-transform-react-jsx", { runtime: "automatic" }],
        ],
      },
    }),
  ],

  // ✅ Ensure Vite outputs to /dist (important for Netlify or production)
  build: {
    outDir: "dist",
  },

  server: {
    port: 5173,
    strictPort: true,
    open: true,
    watch: {
      usePolling: true,
      interval: 100,
    },
    proxy: {
      "/api": {
        target: process.env.VITE_API_BASE_URL || "http://localhost:5000",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  define: {
    "process.env": {
      VITE_API_BASE_URL: JSON.stringify(
        process.env.VITE_API_BASE_URL || "http://localhost:5000"
      ),
      NODE_ENV: JSON.stringify(process.env.NODE_ENV || "development"),
    },
  },
});
