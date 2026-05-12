// src/components/dashboard/DataTable.js

function getAvatarLink(gdriveUrl) {
    if (!gdriveUrl || gdriveUrl === "-" || gdriveUrl.includes("Upload_Error")) return null;
    const match = gdriveUrl.match(/\/d\/([a-zA-Z0-9-_]+)/); 
    // Menggunakan cara yang SAMA PERSIS dengan halaman Database Karyawan
    if (match && match[1]) return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w400`;
    return null;
}

export function renderDataTable(containerId, data) {
    const tableContainer = document.getElementById(containerId);
    if (data.length === 0) {
        tableContainer.innerHTML = `<p class="text-slate-500 dark:text-cyan-500/50 font-mono tracking-widest text-xs uppercase font-bold flex justify-center h-full items-center">Database Organisasi Kosong.</p>`;
        return;
    }

    let tableHTML = `
        <div class="px-8 py-5 border-b border-white/50 dark:border-slate-800/80 flex justify-between items-center bg-white/40 dark:bg-slate-900/40 backdrop-blur-md z-10 shadow-sm">
            <h3 class="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-[0.2em] flex items-center font-mono">
                <span class="w-2 h-8 bg-cyan-500 rounded-full mr-4 shadow-[0_0_10px_#0ea5e9]"></span> Data Karyawan
            </h3>
            <div class="flex items-center space-x-3 bg-white/60 dark:bg-slate-950/60 px-4 py-1.5 rounded-xl border border-white/80 dark:border-cyan-500/20 shadow-inner">
                <span class="text-[9px] text-slate-500 uppercase font-bold tracking-widest font-mono">Total Karyawan</span>
                <span class="text-xs text-cyan-600 dark:text-cyan-400 font-black font-mono ml-2">${data.length}</span>
            </div>
        </div>

        <div class="w-full h-full relative bg-white/30 dark:bg-transparent pb-6 overflow-x-auto">
            <table class="w-full text-left border-collapse whitespace-nowrap">
                <thead class="sticky top-0 bg-white/90 dark:bg-[#030712]/90 backdrop-blur-xl z-10 border-b border-slate-200/50 dark:border-cyan-500/20 shadow-sm">
                    <tr class="text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-cyan-500/80 font-mono font-bold">
                        <th class="p-4 pl-8">No</th>
                        <th class="p-4 text-center">Foto</th>
                        <th class="p-4">NIK</th>
                        <th class="p-4">Nama Karyawan</th>
                        <th class="p-4">Plant</th>
                        <th class="p-4">Departemen</th>
                        <th class="p-4">Area & Zone</th>
                        <th class="p-4 text-center">Grup</th>
                        <th class="p-4 text-center">Status</th>
                        <th class="p-4 text-right pr-8">Sinkronisasi Terakhir</th>
                    </tr>
                </thead>
                <tbody class="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 divide-y divide-slate-100 dark:divide-slate-800/50">
    `;

    data.forEach((row, index) => {
        const no = row[0] || (index + 1);
        const idKaryawan = row[1] ? String(row[1]).replace(/'/g, "") : '-';
        const nama = row[2] ? String(row[2]) : '-';
        const plant = row[4] ? String(row[4]) : '-'; 
        const dept = row[5] ? String(row[5]) : '-';
        const area = row[6] ? String(row[6]) : '-';
        const group = row[7] ? String(row[7]) : '-'; 
        const zone = row[8] ? String(row[8]) : '-';
        
        const rawDate = row[10];
        let formattedDate = '-';
        if (rawDate) {
            const d = new Date(rawDate);
            formattedDate = d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + 
                            d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
        }

        // --- PENYESUAIAN LOGIKA FOTO ---
        // Menggunakan row[9] karena link foto berada di index ke-9 pada data master (CURRENT_STATE)
        let directFotoLink = getAvatarLink(row[9] ? String(row[9]) : "");
        let FotoSrc = directFotoLink ? directFotoLink : `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23f1f5f9'/><text x='50' y='50' font-family='monospace' font-size='45' font-weight='bold' fill='%2394a3b8' text-anchor='middle' dominant-baseline='central'>${nama !== '-' ? nama.charAt(0).toUpperCase() : '?'}</text></svg>`;

        tableHTML += `
            <tr class="hover:bg-white/60 dark:hover:bg-cyan-900/10 transition-colors cursor-default group">
                <td class="p-4 pl-8 text-slate-400 font-bold">${no}</td>
                <td class="p-4 flex justify-center">
                    <div class="w-10 h-10 rounded-xl overflow-hidden border border-white dark:border-slate-700 shadow-sm bg-slate-100 dark:bg-transparent">
                        <img src="${FotoSrc}" alt="Foto" class="w-full h-full object-cover">
                    </div>
                </td>
                <td class="p-4 font-black text-slate-900 dark:text-cyan-400">${idKaryawan}</td>
                <td class="p-4 tracking-widest font-bold text-slate-800 dark:text-white max-w-[200px] truncate">${nama}</td>
                <td class="p-4 text-slate-600 dark:text-slate-400 tracking-wider">${plant}</td>
                <td class="p-4 text-slate-600 dark:text-slate-400 tracking-wider">${dept}</td>
                <td class="p-4 text-slate-700 dark:text-cyan-500/80 font-bold truncate max-w-[150px]">${area} <span class="text-[9px] text-slate-400 ml-1">/ ${zone}</span></td>
                <td class="p-4 text-slate-700 dark:text-slate-400 text-center font-bold">${group}</td>
                <td class="p-4 text-center">
                    <span class="inline-flex items-center px-2.5 py-1.5 rounded-lg text-[9px] border border-emerald-300/50 dark:border-emerald-500/30 bg-emerald-50/80 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 tracking-[0.2em] font-black shadow-sm">AKTIF</span>
                </td>
                <td class="p-4 text-right pr-8">
                    <span class="text-[9px] text-slate-500 dark:text-slate-500 tracking-widest font-bold">${formattedDate}</span>
                </td>
            </tr>
        `;
    });

    tableContainer.innerHTML = tableHTML + `</tbody></table></div>`;
}