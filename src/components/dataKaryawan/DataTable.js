// src/components/dataKaryawan/DataTable.js

function getAvatarLink(gdriveUrl) {
    if (!gdriveUrl || gdriveUrl === "-" || gdriveUrl.includes("Upload_Error")) return null;
    const match = gdriveUrl.match(/\/d\/([a-zA-Z0-9-_]+)/); 
    if (match && match[1]) return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w400`;
    return null;
}

export function renderDataTable(containerId, data) {
    const tableContainer = document.getElementById(containerId);
    
    if (!data || data.length === 0) {
        tableContainer.innerHTML = `<div class="flex h-full items-center justify-center"><p class="text-slate-400 font-mono tracking-[0.2em] text-[10px] uppercase font-bold bg-white/50 dark:bg-slate-900/50 px-6 py-3 rounded-xl border border-white dark:border-slate-700/50">Tidak ada record Data yang ditemukan.</p></div>`;
        return;
    }

    // PERBAIKAN: Header duplikat dihapus total. Tabel langsung dirender ke dalam kontainer.
    let tableHTML = `
        <div class="w-full h-full relative bg-white/30 dark:bg-transparent pb-6 overflow-x-auto custom-scrollbar">
            <table class="w-full text-left border-collapse whitespace-nowrap">
                <thead class="sticky top-0 bg-white/90 dark:bg-[#030712]/90 backdrop-blur-xl z-10 border-b border-slate-200/50 dark:border-cyan-500/20 shadow-sm">
                    <tr class="text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-cyan-500/80 font-mono font-bold">
                        <th class="p-4 pl-8">No</th>
                        <th class="p-4 text-center">Foto</th>
                        <th class="p-4">NIK</th>
                        <th class="p-4">Nama Karyawan</th>
                        <th class="p-4 text-center">Gender</th>
                        <th class="p-4">Plant</th>
                        <th class="p-4">Area & Zone</th>
                        <th class="p-4 text-center">Grup</th>
                        <th class="p-4 text-center">Status</th>
                        <th class="p-4 text-right pr-8">Aksi</th>
                    </tr>
                </thead>
                <tbody class="text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300 divide-y divide-slate-100 dark:divide-slate-800/50">
    `;

    data.forEach((row, index) => {
        const rowNo = row[0]; 
        const no = row[0] || (index + 1);
        const idKaryawan = row[1] ? String(row[1]).replace(/'/g, "") : '-';
        const nama = row[2] ? String(row[2]) : '-';
        const gender = row[3] ? String(row[3]) : '-'; 
        const plant = row[4] ? String(row[4]) : '-';  
        const dept = row[5] ? String(row[5]) : '-';
        const area = row[6] ? String(row[6]) : '-';
        const group = row[7] ? String(row[7]) : '-';  
        const zone = row[8] ? String(row[8]) : '-';
        
        let directFotoLink = getAvatarLink(row[9] ? String(row[9]) : "");
        let FotoSrc = directFotoLink ? directFotoLink : `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23f1f5f9'/><text x='50' y='50' font-family='monospace' font-size='45' font-weight='bold' fill='%2394a3b8' text-anchor='middle' dominant-baseline='central'>${nama !== '-' ? nama.charAt(0).toUpperCase() : '?'}</text></svg>`;

        tableHTML += `
            <tr class="hover:bg-white/60 dark:hover:bg-cyan-900/10 transition-colors group cursor-default">
                <td class="p-4 pl-8 text-slate-400 font-bold">${no}</td>
                <td class="p-4 flex justify-center">
                    <div class="w-10 h-10 rounded-xl overflow-hidden border border-white dark:border-slate-700 shadow-sm bg-slate-100 dark:bg-transparent">
                        <img src="${FotoSrc}" alt="Foto" class="w-full h-full object-cover">
                    </div>
                </td>
                <td class="p-4 font-black text-slate-900 dark:text-cyan-400">${idKaryawan}</td>
                <td class="p-4 tracking-widest font-bold text-slate-800 dark:text-white max-w-[200px] truncate" title="${nama}">${nama}</td>
                <td class="p-4 text-center text-slate-500 dark:text-slate-400">${gender}</td>
                <td class="p-4 text-slate-600 dark:text-slate-300"><span class="font-bold">${plant}</span><br><span class="text-[9px] text-slate-400">${dept}</span></td>
                <td class="p-4 text-slate-600 dark:text-slate-300 font-bold max-w-[150px] truncate"><span class="text-cyan-600 dark:text-cyan-400">${area}</span><br><span class="text-[9px] text-slate-400">${zone}</span></td>
                <td class="p-4 text-slate-600 dark:text-slate-400 text-center font-black">${group}</td>
                <td class="p-4 text-center">
                    <span class="inline-flex items-center px-2 py-1 rounded border border-emerald-300/50 dark:border-emerald-500/30 bg-emerald-50/80 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] font-black tracking-widest shadow-sm">AKTIF</span>
                </td>
                <td class="p-4 text-right pr-8">
                    <button class="btn-edit text-slate-400 hover:text-cyan-600 hover:bg-white dark:hover:bg-cyan-900/30 p-2 rounded-xl transition-all mx-0.5 shadow-sm" data-row="${rowNo}" title="Edit Node">
                        <svg class="w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                    </button>
                    <button class="btn-delete text-slate-400 hover:text-rose-500 hover:bg-white dark:hover:bg-rose-900/30 p-2 rounded-xl transition-all mx-0.5 shadow-sm" data-row="${rowNo}" data-nama="${nama}" title="Cabut Akses">
                        <svg class="w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                </td>
            </tr>
        `;
    });

    tableContainer.innerHTML = tableHTML + `</tbody></table></div>`;
}