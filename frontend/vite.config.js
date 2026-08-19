import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  preview: {
    allowedHosts: [
      "carefree-illumination-production-e062.up.railway.app"
    ]
  }
});