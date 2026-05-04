// src/components/recovery/RecoveryTable.js

function getAvatarLink(gdriveUrl) {
    if (!gdriveUrl || gdriveUrl === "-" || gdriveUrl.includes("Upload_Error")) return null;
    const match = gdriveUrl.match(/\/d\/([a-zA-Z0-9-_]+)/); 
    if (match && match[1]) return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w400`;
    return null;
}

export function renderRecoveryTable(containerId, data) {
    const recoveryContainer = document.getElementById(containerId);
    if (!recoveryContainer) return;

    if (!data || data.length === 0) {
        recoveryContainer.innerHTML = `<div class="flex h-full items-center justify-center"><p class="text-slate-400 font-mono tracking-[0.2em] text-[10px] uppercase font-bold bg-white/50 dark:bg-slate-900/50 px-6 py-3 rounded-xl border border-white dark:border-slate-700/50">Karantina Kosong. Tidak ada data yang tertahan.</p></div>`;
        return;
    }

    let tableHTML = `
        <div class="w-full h-full overflow-auto custom-scrollbar relative bg-white/30 dark:bg-transparent pb-6">
            <table class="w-full text-left whitespace-nowrap text-[10px] font-mono tracking-widest">
                <thead class="sticky top-0 bg-white/90 dark:bg-[#030712]/90 backdrop-blur-xl z-10 border-b border-slate-200/50 dark:border-amber-500/20 text-amber-700 dark:text-amber-500 shadow-sm">
                    <tr>
                        <th class="p-4 font-bold pl-8">Waktu Isolasi</th>
                        <th class="p-4 font-bold text-center">Foto</th>
                        <th class="p-4 font-bold">ID Personil</th>
                        <th class="p-4 font-bold">Nama Karyawan</th>
                        <th class="p-4 font-bold">Posisi Terakhir</th>
                        <th class="p-4 font-bold">Reason</th>
                        <th class="p-4 font-bold text-center">Masa Retensi</th>
                        <th class="p-4 font-bold text-right pr-8">Otorisasi</th>
                    </tr>
                </thead>
                <tbody class="text-slate-700 dark:text-slate-300 divide-y divide-slate-100 dark:divide-slate-800/50">
    `;

    const sekarang = new Date();

    data.forEach((row) => {
        const rawDate = row[1];
        const idKaryawan = row[2] ? String(row[2]).replace(/'/g, "") : '-';
        const nama = row[3] ? String(row[3]) : '-';
        const dept = row[6] ? String(row[6]) : '-';
        const alasan = row[12] ? String(row[12]) : '-'; // AMBIL DATA ALASAN
        
        let sisaHari = 30;
        let formattedDate = '-';
        if (rawDate) {
            const d = new Date(rawDate);
            formattedDate = d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
            const selisihHari = Math.floor((sekarang - d) / (1000 * 60 * 60 * 24));
            sisaHari = Math.max(0, 30 - selisihHari);
        }

        let retensiColor = sisaHari < 5 
            ? 'text-rose-600 bg-rose-50 border-rose-200 dark:text-rose-400 dark:bg-rose-900/30 dark:border-rose-500/40 shadow-[0_0_10px_rgba(244,63,94,0.3)] animate-pulse' 
            : 'text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-900/30 dark:border-amber-500/40 shadow-sm';

        let directFotoLink = getAvatarLink(row[10] ? String(row[10]) : "");
        let FotoSrc = directFotoLink ? directFotoLink : `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23f1f5f9'/><text x='50' y='50' font-family='monospace' font-size='40' font-weight='bold' fill='%2394a3b8' text-anchor='middle' dominant-baseline='central'>${nama !== '-' ? nama.charAt(0).toUpperCase() : '?'}</text></svg>`;

        tableHTML += `
            <tr class="hover:bg-white/60 dark:hover:bg-amber-900/10 transition-colors group cursor-default">
                <td class="p-4 pl-8 text-slate-500 font-bold">${formattedDate}</td>
                <td class="p-4 flex justify-center">
                    <div class="w-10 h-10 rounded-xl overflow-hidden border border-white dark:border-slate-700 shadow-sm bg-slate-100 dark:bg-transparent opacity-70 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all dark:shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                        <img src="${FotoSrc}" class="w-full h-full object-cover">
                    </div>
                </td>
                <td class="p-4 font-black text-slate-900 dark:text-amber-400">${idKaryawan}</td>
                <td class="p-4 tracking-wider text-slate-400 dark:text-slate-500 line-through decoration-rose-500 font-bold">${nama}</td>
                <td class="p-4 text-slate-500 dark:text-amber-100/50">${dept}</td>
                <td class="p-4 whitespace-normal min-w-[150px] max-w-[250px]">
                    <span class="inline-block bg-rose-500/10 text-rose-600 dark:text-rose-400 px-2.5 py-1 rounded-lg border border-rose-500/20 text-[9px] font-bold leading-relaxed break-words shadow-inner">
                        ${alasan}
                    </span>
                </td>
                <td class="p-4 text-center">
                    <span class="inline-flex items-center px-3 py-1.5 rounded-lg border text-[9px] font-bold tracking-widest ${retensiColor}">
                        SISA ${sisaHari} HARI
                    </span>
                </td>
                <td class="p-4 text-right pr-8">
                    <button class="btn-restore bg-white/50 hover:bg-amber-100 dark:bg-slate-900/50 dark:hover:bg-amber-600 border border-white dark:border-amber-500/50 text-amber-700 dark:text-amber-500 hover:text-amber-800 dark:hover:text-white px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm hover:shadow-[0_5px_15px_rgba(245,158,11,0.3)] hover:-translate-y-1" data-id="${idKaryawan}">
                        Pulihkan Data
                    </button>
                </td>
            </tr>
        `;
    });

    recoveryContainer.innerHTML = tableHTML + `</tbody></table></div>`;
}