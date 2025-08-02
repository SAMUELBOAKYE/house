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
  server: {
    port: 5173, // ✅ Dev server port
    strictPort: true, // ✅ Fail if port is in use
    open: true, // ✅ Auto-open browser
    watch: {
      usePolling: true, // ✅ Important for WSL or Docker
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
      "@": path.resolve(__dirname, "./src"), // ✅ Use @ to import from src
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
