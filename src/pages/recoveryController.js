// src/pages/recoveryController.js

import { APP_CONFIG } from '../config/api.js';
import { renderSidebar, renderHeader, initThemeAndLogout } from '../layouts/AppLayout.js';
import { initRecoveryModals } from '../components/recovery/RecoveryModals.js';
import { renderRecoveryTable } from '../components/recovery/RecoveryTable.js';

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
    
    if(headerTitle) headerTitle.innerText = "DATA RECOVERY VAULT";
    if(headerSub) {
        headerSub.innerText = "Sistem Retensi & Pemulihan Karantina Aset Digital";
        headerSub.classList.replace('text-cyan-600', 'text-amber-600');
        headerSub.classList.replace('dark:text-cyan-400', 'dark:text-amber-400');
    }
    if(headerIndicator) {
        headerIndicator.className = "relative w-6 h-6 bg-gradient-to-br from-white to-amber-200 dark:from-amber-400 dark:to-orange-600 rounded-full border-2 border-white dark:border-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.8)]";
        const aura = headerIndicator.previousElementSibling;
        if (aura) aura.className = "absolute inset-0 bg-amber-400 rounded-full blur-[10px] opacity-50 animate-pulse";
    }

    // 3. FITUR TOAST WEB3
    window.recoveryApp = {
        showToast: function(message, type = 'success') {
            const toast = document.getElementById('customToast');
            const icon = document.getElementById('toastIcon');
            const msg = document.getElementById('toastMessage');
            msg.innerText = message;
            
            toast.classList.remove('border-emerald-500', 'border-rose-500', 'border-amber-500');
            icon.classList.remove('bg-emerald-500/20', 'text-emerald-500', 'bg-rose-500/20', 'text-rose-500', 'bg-amber-500/20', 'text-amber-500');
            
            if(type === 'success') {
                toast.classList.add('border-emerald-500'); icon.classList.add('bg-emerald-500/20', 'text-emerald-500');
                icon.innerHTML = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>`;
            } else if (type === 'error') {
                toast.classList.add('border-rose-500'); icon.classList.add('bg-rose-500/20', 'text-rose-500');
                icon.innerHTML = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>`;
            }
            toast.classList.remove('translate-x-[120%]', 'opacity-0');
            setTimeout(() => this.closeToast(), 4000);
        },
        closeToast: function() { document.getElementById('customToast').classList.add('translate-x-[120%]', 'opacity-0'); }
    };

    // 4. INIT MODAL (Menjalankan fetch data jika user klik Paham)
    initRecoveryModals('app-modal', fetchTrashData);

    const recoveryContainer = document.getElementById('recoveryContainer');
    
    // 5. FUNGSI TARIK DATA
    async function fetchTrashData() {
        recoveryContainer.innerHTML = `<div class="p-8 h-full flex flex-col items-center justify-center text-amber-600 dark:text-amber-400 font-mono text-[10px] tracking-[0.2em] font-bold uppercase animate-pulse"><span class="w-8 h-8 border-t-2 border-amber-500 rounded-full animate-spin mb-4 shadow-[0_0_10px_#f59e0b]"></span>Memindai Celah Karantina...</div>`;
        try {
            const response = await fetch(APP_CONFIG.GAS_URL, {
                method: 'POST', body: JSON.stringify({ action: 'READ_TRASH' }) 
            });
            const result = await response.json();
            
            if (result.status === 'success') {
                let data = result.data || [];
                if (!isSuperAdmin && adminRoleDept) {
                    data = data.filter(row => String(row[6] || '').toUpperCase().includes(adminRoleDept));
                }
                renderRecoveryTable('recoveryContainer', data);
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            recoveryContainer.innerHTML = `<div class="flex h-full items-center justify-center"><div class="text-rose-600 dark:text-rose-500 flex flex-col justify-center items-center font-mono text-xs uppercase tracking-widest font-bold bg-white/50 dark:bg-slate-900/50 p-6 rounded-2xl border border-white dark:border-slate-700/50"><span class="mb-2">GALAT VAULT</span><span>${error.message}</span></div></div>`;
        }
    }

    // 6. EVENT DELEGATION UNTUK TOMBOL RESTORE
    recoveryContainer.addEventListener('click', async (e) => {
        const restoreBtn = e.target.closest('.btn-restore');
        if (!restoreBtn) return;

        const idTarget = restoreBtn.getAttribute('data-id');
        if(!confirm(`OTORISASI PEMULIHAN:\n\nApakah Anda yakin ingin memulihkan personil ID ${idTarget} dan mengembalikannya ke sistem operasional utama Satoria?`)) return;

        const originalHtml = restoreBtn.innerHTML;
        restoreBtn.innerHTML = `<span class="w-3 h-3 border-2 border-amber-500 border-t-transparent rounded-full animate-spin inline-block mr-2"></span> Proses...`;
        restoreBtn.disabled = true;

        try {
            const res = await fetch(APP_CONFIG.GAS_URL, {
                method: 'POST', body: JSON.stringify({ action: 'RESTORE', payload: { userId: savedUserId, idKaryawan: idTarget } })
            });
            const resJson = await res.json();
            
            if(resJson.status === 'success') {
                window.recoveryApp.showToast(`Node Akses personil ID ${idTarget} berhasil dipulihkan.`, 'success');
                fetchTrashData(); 
            } else throw new Error(resJson.message);
        } catch (err) { 
            window.recoveryApp.showToast("Gagalan Pemulihan: " + err.message, 'error'); 
            restoreBtn.innerHTML = originalHtml;
            restoreBtn.disabled = false;
        }
    });
});