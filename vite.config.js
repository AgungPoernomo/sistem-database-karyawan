import { defineConfig } from 'vite';
import { resolve } from 'path';
import tailwindcss from '@tailwindcss/vite'; // INI ADALAH MESIN KOMPILATORNYA

export default defineConfig({
  plugins: [
    tailwindcss(), // AKTIFKAN PLUGIN DI SINI
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        dashboard: resolve(__dirname, 'pages/dashboard.html'),
        karyawan: resolve(__dirname, 'pages/data-karyawan.html'),
        plotting: resolve(__dirname, 'pages/plotting-area.html'),
        recovery: resolve(__dirname, 'pages/recovery.html'),
        activity: resolve(__dirname, 'pages/activity-log.html')
      }
    }
  }
});