// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import dotenv from "dotenv";

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

  // ✅ Output directory for Netlify
  build: {
    outDir: "dist",
  },

  // ✅ Dev server config (used only in dev mode)
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

  // ✅ Path alias (e.g., import from "@/components/Button")
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // ✅ Inject safe runtime env variables
  define: {
    "process.env": {
      VITE_API_BASE_URL: JSON.stringify(
        process.env.VITE_API_BASE_URL || "http://localhost:5000"
      ),
      NODE_ENV: JSON.stringify("production"), // Force production mode during Netlify build
    },
  },
});
