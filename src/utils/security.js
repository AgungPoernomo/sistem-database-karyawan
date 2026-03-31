// src/utils/security.js
import { APP_CONFIG } from '../config/api.js';

/**
 * Menghasilkan hash SHA-256 dari teks biasa + salt.
 * Ini mencegah serangan 'Rainbow Table' jika database bocor.
 */
export async function hashPassword(plainPassword) {
    const textAsBuffer = new TextEncoder().encode(plainPassword + APP_CONFIG.SECURITY_SALT);
    const hashBuffer = await crypto.subtle.digest('SHA-256', textAsBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    
    // Konversi buffer menjadi string heksadesimal
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

/**
 * Menyimpan token sesi yang dienkripsi secara lokal
 */
export function setSecureSession(userId) {
    // Di aplikasi nyata, token ini harusnya digenerate oleh backend (JWT)
    // Untuk GAS, kita membuat pseudo-token terenkripsi sebagai penanda sesi aktif
    const sessionData = btoa(JSON.stringify({
        id: userId,
        timestamp: new Date().getTime(),
        valid: true
    }));
    
    sessionStorage.setItem('nexus_auth_token', sessionData);
    localStorage.setItem('nexus_user', userId);
}