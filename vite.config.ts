import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// 相对路径 base：项目站点（/repo/）与用户站点（/）都能直接部署
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1600,
  },
});
