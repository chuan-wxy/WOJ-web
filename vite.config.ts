import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 8088,
  },
  resolve: {
    alias: {
      // 将 @ 设置为 src 目录
      '@': path.resolve(__dirname, './src')
    }
  }
})
