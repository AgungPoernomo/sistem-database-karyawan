import { APP_CONFIG } from '../config/api.js';

export const EmployeeService = {
    /**
     * Mengambil seluruh data karyawan dari Google Apps Script
     * @returns {Promise<Array>} Array data karyawan mentah
     */
    async getAllEmployees() {
        try {
            const response = await fetch(APP_CONFIG.GAS_URL, {
                method: 'POST',
                body: JSON.stringify({ action: 'READ' })
            });
            const result = await response.json();
            
            if (result.status === 'success') {
                return result.data || [];
            } else {
                throw new Error(result.message || "Gagal memuat data dari server.");
            }
        } catch (error) {
            console.error("EmployeeService Error:", error);
            throw new Error("Koneksi terputus. Pastikan jaringan aman.");
        }
    }
};