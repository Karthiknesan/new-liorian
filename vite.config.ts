import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    outDir: "dist/spa",
  },
  plugins: [react(), expressPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
}));

function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    apply: "serve", // Only apply during development (serve mode)
    async configureServer(server) {
      // Import the createServer function
      try {
        const serverModule = await import("./server/index.js");
        const createServer = serverModule.default || serverModule.createServer;
        
        if (typeof createServer === 'function') {
          const app = createServer();
          // Add Express app as middleware to Vite dev server
          server.middlewares.use(app);
        } else {
          console.error('createServer is not a function:', typeof createServer);
        }
      } catch (error) {
        console.error('Failed to import server:', error);
      }
    },
  };
}
