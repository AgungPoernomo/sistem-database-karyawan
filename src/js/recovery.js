import { APP_CONFIG } from '../config/api.js';

document.addEventListener('DOMContentLoaded', () => {
    const sessionToken = sessionStorage.getItem('nexus_auth_token');
    const savedUserId = localStorage.getItem('nexus_user');
    if (!sessionToken) { window.location.replace('/'); return; }

    const recoveryContainer = document.getElementById('recoveryContainer');
    const policyModal = document.getElementById('policyModal');
    const policyContent = document.getElementById('policyContent');

    // 1. ANIMASI POPUP PROTOKOL (Tampil Saat Awal)
    policyModal.classList.remove('hidden');
    setTimeout(() => {
        policyModal.classList.remove('opacity-0');
        policyContent.classList.remove('scale-95');
    }, 100);

    document.getElementById('acceptPolicyBtn').addEventListener('click', () => {
        policyModal.classList.add('opacity-0');
        policyContent.classList.add('scale-95');
        setTimeout(() => { policyModal.classList.add('hidden'); }, 500);
        fetchTrashData(); 
    });

    // 2. FUNGSI TARIK DATA (MEMINDAI ARSIP)
    async function fetchTrashData() {
        recoveryContainer.innerHTML = `<div class="p-8 h-full flex flex-col items-center justify-center text-amber-400 font-mono animate-pulse"><div class="w-10 h-10 border-t-2 border-amber-400 rounded-full animate-spin mb-4"></div>Memindai Arsip Pemulihan...</div>`;
        try {
            const response = await fetch(APP_CONFIG.GAS_URL, {
                method: 'POST', body: JSON.stringify({ action: 'READ_TRASH' }) 
            });
            const result = await response.json();
            
            if (result.status === 'success') renderRecoveryTable(result.data);
            else throw new Error(result.message);
        } catch (error) {
            recoveryContainer.innerHTML = `<div class="text-rose-500 flex justify-center mt-10 font-mono text-xs uppercase tracking-widest">${error.message}</div>`;
        }
    }

    // 3. FUNGSI RENDER TABEL
    function renderRecoveryTable(data) {
        if (!data || data.length === 0) {
            recoveryContainer.innerHTML = `<p class="text-amber-500/50 font-mono tracking-widest text-xs uppercase flex justify-center mt-20 italic">Tidak ada aset personil di area recovery.</p>`;
            return;
        }

        let tableHTML = `
            <table class="w-full text-left border-collapse whitespace-nowrap">
                <thead class="sticky top-0 bg-[#030712] z-10 border-b border-amber-500/30">
                    <tr class="text-[10px] uppercase tracking-[0.2em] text-amber-500 font-mono">
                        <th class="p-4 font-bold">Waktu Pencabutan</th>
                        <th class="p-4 font-bold text-center">Visual</th>
                        <th class="p-4 font-bold">ID Personil</th>
                        <th class="p-4 font-bold">Nama Lengkap</th>
                        <th class="p-4 font-bold">Divisi Terakhir</th>
                        <th class="p-4 font-bold text-center">Masa Retensi</th>
                        <th class="p-4 font-bold text-right">Otorisasi</th>
                    </tr>
                </thead>
                <tbody class="text-xs font-mono text-slate-300 divide-y divide-amber-500/20">
        `;

        const sekarang = new Date();

        data.forEach((row) => {
            const rawDate = row[1];
            const idKaryawan = row[2] ? String(row[2]) : '-';
            const nama = row[3] ? String(row[3]) : '-';
            const dept = row[6] ? String(row[6]) : '-';
            let kodeBase64 = row[11] ? String(row[11]) : "";
            
            let sisaHari = 30;
            let formattedDate = '-';
            if (rawDate) {
                const d = new Date(rawDate);
                formattedDate = d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
                const selisihHari = Math.floor((sekarang - d) / (1000 * 60 * 60 * 24));
                sisaHari = Math.max(0, 30 - selisihHari);
            }

            let retensiColor = sisaHari < 5 ? 'text-rose-400 bg-rose-500/10 border-rose-500/30' : 'text-amber-400 bg-amber-500/10 border-amber-500/30';

            let fotoSrc = (!kodeBase64 || kodeBase64 === "-" || kodeBase64 === "") 
                ? `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%231e293b'/><text x='50' y='50' font-family='sans-serif' font-size='45' font-weight='bold' fill='%23f59e0b' text-anchor='middle' dominant-baseline='central'>${nama.charAt(0).toUpperCase()}</text></svg>`
                : `data:image/jpeg;base64,${kodeBase64}`;

            tableHTML += `
                <tr class="hover:bg-amber-500/10 transition-colors group cursor-default">
                    <td class="p-4 text-slate-500">${formattedDate}</td>
                    <td class="p-4 flex justify-center">
                        <div class="w-10 h-10 rounded-xl overflow-hidden border border-amber-500/30 opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all shadow-[0_0_10px_rgba(245,158,11,0.1)]">
                            <img src="${fotoSrc}" class="w-full h-full object-cover">
                        </div>
                    </td>
                    <td class="p-4 font-bold text-amber-100">${idKaryawan}</td>
                    <td class="p-4 tracking-wide text-slate-400 line-through">${nama}</td>
                    <td class="p-4 text-amber-200/50">${dept}</td>
                    <td class="p-4 text-center">
                        <span class="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold border tracking-widest shadow-inner ${retensiColor}">
                            SISA ${sisaHari} HARI
                        </span>
                    </td>
                    <td class="p-4 text-right">
                        <button class="btn-restore bg-slate-900 hover:bg-amber-600 border border-amber-500/50 text-amber-500 hover:text-white px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all shadow-[0_0_10px_rgba(245,158,11,0.2)]" data-id="${idKaryawan}">
                            Pulihkan Akses
                        </button>
                    </td>
                </tr>
            `;
        });

        recoveryContainer.innerHTML = tableHTML + `</tbody></table>`;
        attachRestoreListeners();
    }

    // 4. LOGIKA TOMBOL PULIHKAN AKSES
    function attachRestoreListeners() {
        document.querySelectorAll('.btn-restore').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const idTarget = e.currentTarget.getAttribute('data-id');
                
                // Konfirmasi Penghapusan
                if(!confirm(`OTORISASI PEMULIHAN:\n\nApakah Anda yakin ingin memulihkan personil ID ${idTarget} dan mengembalikannya ke sistem operasional utama?`)) return;

                const originalHtml = e.currentTarget.innerHTML;
                e.currentTarget.innerHTML = `<svg class="animate-spin -ml-1 mr-2 h-3 w-3 text-amber-500 inline" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Memproses...`;
                e.currentTarget.disabled = true;

                try {
                    const res = await fetch(APP_CONFIG.GAS_URL, {
                        method: 'POST', body: JSON.stringify({ action: 'RESTORE', payload: { userId: savedUserId, idKaryawan: idTarget } })
                    });
                    const resJson = await res.json();
                    
                    if(resJson.status === 'success') {
                        window.showToast(`Akses personil ID ${idTarget} berhasil dipulihkan.`, 'success');
                        fetchTrashData(); // Refresh tabel
                    } else throw new Error(resJson.message);
                } catch (err) { 
                    window.showToast("Gagal Memulihkan: " + err.message, 'error'); 
                    e.currentTarget.innerHTML = originalHtml;
                    e.currentTarget.disabled = false;
                }
            });
        });
    }
});