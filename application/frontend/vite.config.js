import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import sass from "vite-plugin-sass";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    sass({
      includePaths: ["src/styles"],
    }),
    react(),
  ],
  server: {
    // override default port 5173
    // @see https://stackoverflow.com/a/74923755
    // @see https://vitejs.dev/config/
    port: 3000,
    host: true,
    strictPort: true,
    watch: {
      usePolling: true,
    },
  },
});
