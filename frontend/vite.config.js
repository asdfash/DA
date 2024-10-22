import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root:'./',
  server: { 
    host: 'localhost',
    port: 5173 },
});
