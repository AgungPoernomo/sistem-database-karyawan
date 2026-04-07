// src/components/recovery/RecoveryModals.js

export function initRecoveryModals(containerId, onAcceptPolicy) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <div id="policyModal" class="fixed inset-0 z-[100] flex flex-col items-center justify-center opacity-0 transition-opacity duration-500 hidden">
            <div class="absolute inset-0 bg-slate-900/70 dark:bg-slate-950/90 backdrop-blur-xl"></div>
            <div class="relative z-10 w-full max-w-xl p-10 spatial-island rounded-[3rem] text-center transform scale-95 transition-all duration-500 border-t-amber-400 dark:border-t-amber-500/40 shadow-[0_20px_80px_rgba(245,158,11,0.2)] dark:shadow-[0_20px_80px_rgba(245,158,11,0.1)]" id="policyContent">
                
                <div class="w-24 h-24 rounded-full bg-white/60 dark:bg-amber-900/30 border border-white dark:border-amber-500/50 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(245,158,11,0.3)] relative">
                    <div class="absolute inset-0 bg-amber-500/20 rounded-full animate-ping"></div>
                    <svg class="w-12 h-12 text-amber-600 dark:text-amber-400 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                
                <h3 class="text-[1.75rem] font-black text-slate-800 dark:text-white mb-3 uppercase tracking-[0.15em] font-mono drop-shadow-sm">Sistem Retensi Data</h3>
                
                <p class="text-sm text-slate-600 dark:text-amber-100/70 mb-10 leading-relaxed font-mono font-bold tracking-wide">
                    Anda memasuki Zona Pemulihan. Sesuai dengan protokol manajemen penyimpanan, semua data di area ini akan <span class="text-rose-600 dark:text-rose-400 font-black uppercase">dihancurkan permanen</span> dari sistem utama dan Satelit G-Drive jika telah melewati masa retensi <span class="text-rose-600 dark:text-rose-400 font-black border-b border-rose-400">30 Hari</span> sejak tanggal pencabutan.
                </p>
                
                <button id="acceptPolicyBtn" class="w-full bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-500 text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest font-mono shadow-[0_5px_20px_rgba(245,158,11,0.4)] transition-all hover:-translate-y-1 active:scale-95 outline-none">
                    Pahami & Buka Kunci Vault
                </button>
            </div>
        </div>
    `;

    const policyModal = document.getElementById('policyModal');
    const policyContent = document.getElementById('policyContent');

    // Tampilkan Modal secara otomatis saat modul diinisialisasi
    policyModal.classList.remove('hidden');
    setTimeout(() => {
        policyModal.classList.remove('opacity-0');
        policyContent.classList.remove('scale-95');
    }, 100);

    document.getElementById('acceptPolicyBtn').addEventListener('click', () => {
        policyModal.classList.add('opacity-0');
        policyContent.classList.add('scale-95');
        setTimeout(() => { 
            policyModal.classList.add('hidden'); 
            if(onAcceptPolicy) onAcceptPolicy(); // Panggil fungsi fetch data setelah setuju
        }, 500);
    });
}