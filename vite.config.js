import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon-32.png", "apple-touch-icon.png"],
      manifest: {
        name: "스마트 캠퍼스 DX",
        short_name: "Smart Campus DX",
        description: "공공기관 연수원 운영 디지털 전환 플랫폼 소개",
        start_url: "/-smart-campus-dx-landing/",
        scope: "/-smart-campus-dx-landing/",
        display: "standalone",
        background_color: "#FFFFFF",
        theme_color: "#2563EB",
        lang: "ko",
        icons: [
          { src: "icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
      },
    }),
  ],
  base: "/-smart-campus-dx-landing/",
  server: { port: 5174 },
});
