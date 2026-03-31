// src/main.js
import { APP_CONFIG } from './config/api.js';
import { setSecureSession } from './utils/security.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const userIdInput = document.getElementById('userId');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('loginBtn');
    const errorMsg = document.getElementById('errorMessage');

    // Simpan teks tombol asli untuk dikembalikan jika terjadi error
    const originalBtnText = loginBtn.innerHTML;

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 1. Ubah UI Tombol menjadi status Loading (Spinner Futuristic)
        loginBtn.innerHTML = `
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Memverifikasi Kredensial...
        `;
        loginBtn.disabled = true;
        errorMsg.innerText = "";

        try {
            const userId = userIdInput.value.trim();
            const password = passwordInput.value;

            // 2. Kirim Request ke Google Apps Script
            const response = await fetch(APP_CONFIG.GAS_URL, {
                method: 'POST',
                body: JSON.stringify({
                    action: 'LOGIN',
                    payload: {
                        userId: userId,
                        password: password, 
                        userName: userId // Sementara username disamakan dengan ID
                    }
                })
            });

            const result = await response.json();

            // 3. Evaluasi Hasil dari Backend
            if (result.status === 'success' && result.data.loginStatus === true) {
                
                // Simpan token sesi yang aman
                setSecureSession(result.data.userId);

                // Ubah tombol menjadi hijau dengan icon centang
                loginBtn.innerHTML = `
                    <svg class="w-6 h-6 text-white inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Akses Diberikan
                `;
                loginBtn.classList.remove('from-indigo-600', 'to-blue-600', 'hover:from-indigo-500', 'hover:to-blue-500');
                loginBtn.classList.add('from-emerald-500', 'to-teal-500', 'hover:from-emerald-400', 'hover:to-teal-400');

                // Jeda 1 detik agar animasi sukses terlihat, lalu pindah halaman
                setTimeout(() => {
                    window.location.href = '/pages/dashboard.html';
                }, 1000);

            } else {
                throw new Error(result.message || "ID atau Kata Sandi tidak valid.");
            }

        } catch (error) {
            // Tampilkan pesan error dan kembalikan tombol ke semula
            errorMsg.innerText = "Otorisasi Gagal: " + error.message;
            loginBtn.innerHTML = originalBtnText;
            loginBtn.disabled = false;
        }
    });
});