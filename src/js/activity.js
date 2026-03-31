import { APP_CONFIG } from '../config/api.js';

document.addEventListener('DOMContentLoaded', () => {
    if (!sessionStorage.getItem('nexus_auth_token')) { window.location.replace('/'); return; }

    const logContainer = document.getElementById('logContainer');

    async function fetchLogs() {
        try {
            const response = await fetch(APP_CONFIG.GAS_URL, {
                method: 'POST', body: JSON.stringify({ action: 'GET_LOGS' }) 
            });
            const result = await response.json();
            
            if (result.status === 'success') renderLogs(result.data);
            else throw new Error(result.message);
        } catch (error) {
            logContainer.innerHTML = `<div class="text-rose-500 text-center mt-10 font-mono">${error.message}</div>`;
        }
    }

    function renderLogs(data) {
        if (!data || data.length === 0) {
            logContainer.innerHTML = `<p class="text-cyan-500/50 font-mono tracking-widest text-sm uppercase flex justify-center mt-20">Belum ada jejak aktivitas tercatat.</p>`;
            return;
        }

        let tableHTML = `
            <table class="w-full text-left border-collapse whitespace-nowrap">
                <thead class="sticky top-0 bg-slate-900/95 backdrop-blur-md z-10 border-b border-cyan-500/30">
                    <tr class="text-[10px] uppercase tracking-[0.2em] text-cyan-500 font-mono">
                        <th class="p-4 font-bold">Waktu Eksekusi</th>
                        <th class="p-4 font-bold">Aktivitas & Otorisator</th>
                        <th class="p-4 font-bold">ID Karyawan</th>
                        <th class="p-4 font-bold">Nama Target</th>
                    </tr>
                </thead>
                <tbody class="text-sm font-mono text-slate-300 divide-y divide-cyan-500/10">
        `;

        data.forEach(row => {
            // Index: 1=Timestamp, 2=ID, 3=Nama, 11=Detail Log
            const rawDate = row[1];
            const idTarget = row[2] ? String(row[2]) : '-';
            const namaTarget = row[3] ? String(row[3]) : '-';
            const detailLog = row[11] ? String(row[11]) : 'Aktivitas Tidak Diketahui';

            // Format Waktu ke lokal Indonesia
            let formattedDate = '-';
            if(rawDate) {
                const d = new Date(rawDate);
                formattedDate = d.toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit', second:'2-digit' });
            }

            // Tentukan warna berdasarkan jenis aksi
            let badgeColor = "bg-slate-500/20 text-slate-400 border-slate-500/30";
            if(detailLog.includes("TAMBAH")) badgeColor = "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
            else if(detailLog.includes("UPDATE")) badgeColor = "bg-amber-500/20 text-amber-400 border-amber-500/30";
            else if(detailLog.includes("HAPUS")) badgeColor = "bg-rose-500/20 text-rose-400 border-rose-500/30";

            tableHTML += `
                <tr class="hover:bg-cyan-500/5 transition-colors group cursor-default">
                    <td class="p-4 text-slate-500">${formattedDate}</td>
                    <td class="p-4">
                        <span class="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] border tracking-wider ${badgeColor}">
                            ${detailLog}
                        </span>
                    </td>
                    <td class="p-4 font-bold text-cyan-100/70">${idTarget}</td>
                    <td class="p-4 text-cyan-500/70">${namaTarget}</td>
                </tr>
            `;
        });

        logContainer.innerHTML = tableHTML + `</tbody></table>`;
    }

    fetchLogs();
});