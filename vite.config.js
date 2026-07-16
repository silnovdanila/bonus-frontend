import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'ArtixBonus',
        short_name: 'ArtixBonus',
        description: 'Личный кабинет системы лояльности',
        start_url: '/',
        display: 'standalone',
        background_color: '#f5f7fa',
        theme_color: '#42b883',
        icons: [
          {
            src: '/vite.svg',
            sizes: 'any',
            type: 'image/svg+xml'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}']
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'vue': 'vue/dist/vue.esm-bundler.js'
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://bonus-backend-pud0.onrender.com',
        changeOrigin: true,
      },
    },
  },
});
