import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        // Daftarkan semua pintu masuk (halaman) aplikasi Anda di sini
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