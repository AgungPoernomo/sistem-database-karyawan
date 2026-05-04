// src/pages/activityLogController.js

import { APP_CONFIG } from '../config/api.js';
import { renderSidebar, renderHeader, initThemeAndLogout } from '../layouts/AppLayout.js';
import { renderActivityTable } from '../components/activity/ActivityTable.js';

document.addEventListener('DOMContentLoaded', async () => {
    
    // 1. PROTEKSI SESI
    const sessionToken = sessionStorage.getItem('nexus_auth_token');
    const savedUserId = localStorage.getItem('nexus_user');

    if (!sessionToken) { window.location.replace('/'); return; }

    const uppercaseUserId = savedUserId.toUpperCase();
    const isSuperAdmin = uppercaseUserId === 'SUPERADMIN';
    let adminRoleDept = null;
    if (!isSuperAdmin && uppercaseUserId.includes("ADMIN ")) {
        adminRoleDept = uppercaseUserId.replace("ADMIN ", "").trim();
    }

    // 2. RENDER KERANGKA SPASIAL
    renderSidebar('app-sidebar', savedUserId, adminRoleDept);
    renderHeader('app-header');
    initThemeAndLogout();

    const headerTitle = document.querySelector('#app-header h2');
    const headerSub = document.querySelector('#app-header p');
    const headerIndicator = document.querySelector('#app-header .bg-gradient-to-br');
    
    if(headerTitle) headerTitle.innerText = "SYSTEM AUDIT LOG";
    if(headerSub) {
        headerSub.innerText = "Jejak Aktivitas Otorisator";
        headerSub.classList.replace('text-cyan-600', 'text-indigo-600');
        headerSub.classList.replace('dark:text-cyan-400', 'dark:text-indigo-400');
    }
    if(headerIndicator) {
        headerIndicator.className = "relative w-6 h-6 bg-gradient-to-br from-white to-indigo-200 dark:from-indigo-400 dark:to-violet-600 rounded-full border-2 border-white dark:border-indigo-200 shadow-[0_0_15px_rgba(99,102,241,0.8)]";
        const aura = headerIndicator.previousElementSibling;
        if (aura) aura.className = "absolute inset-0 bg-indigo-400 rounded-full blur-[10px] opacity-50 animate-pulse";
    }

    // 3. FUNGSI TARIK DATA LOG
    const logContainer = document.getElementById('logContainer');

    async function fetchLogs() {
        logContainer.innerHTML = `<div class="p-8 h-full flex flex-col items-center justify-center text-indigo-600 dark:text-indigo-400 font-mono text-[10px] tracking-[0.2em] font-bold uppercase animate-pulse"><span class="w-8 h-8 border-t-2 border-indigo-500 rounded-full animate-spin mb-4 shadow-[0_0_10px_#6366f1]"></span>Mengekstrak Rekam Jejak Forensik...</div>`;
        try {
            const response = await fetch(APP_CONFIG.GAS_URL, {
                method: 'POST', body: JSON.stringify({ action: 'GET_LOGS' }) 
            });
            const result = await response.json();
            
            if (result.status === 'success') {
                // Render tabel melalui komponen eksternal
                renderActivityTable('logContainer', result.data);
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            logContainer.innerHTML = `<div class="flex h-full items-center justify-center"><div class="text-rose-600 dark:text-rose-500 flex flex-col justify-center items-center font-mono text-xs uppercase tracking-widest font-bold bg-white/50 dark:bg-slate-900/50 p-6 rounded-2xl border border-white dark:border-slate-700/50"><span class="mb-2">GALAT SISTEM</span><span>${error.message}</span></div></div>`;
        }
    }

    // Eksekusi penarikan data
    fetchLogs();
});