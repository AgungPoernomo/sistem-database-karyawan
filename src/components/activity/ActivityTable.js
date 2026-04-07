// src/components/activity/ActivityTable.js

export function renderActivityTable(containerId, data) {
    const logContainer = document.getElementById(containerId);
    if (!logContainer) return;

    if (!data || data.length === 0) {
        logContainer.innerHTML = `<div class="flex h-full items-center justify-center"><p class="text-slate-400 dark:text-slate-500 font-mono tracking-[0.2em] text-[10px] uppercase font-bold bg-white/50 dark:bg-slate-900/50 px-6 py-3 rounded-xl border border-white dark:border-slate-700/50 shadow-sm">Basis Data Log Bersih. Tidak ada jejak terdeteksi.</p></div>`;
        return;
    }

    let tableHTML = `
        <div class="w-full h-full overflow-auto custom-scrollbar relative bg-white/30 dark:bg-transparent pb-6">
            <table class="w-full text-left whitespace-nowrap text-[10px] font-mono tracking-widest border-collapse">
                <thead class="sticky top-0 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl z-10 border-b border-slate-200/50 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-400 shadow-sm">
                    <tr>
                        <th class="p-5 font-bold pl-8">Timestamp Server</th>
                        <th class="p-5 font-bold">Protokol & Otorisator</th>
                        <th class="p-5 font-bold">ID Entitas Target</th>
                        <th class="p-5 font-bold pr-8">Label Entitas</th>
                    </tr>
                </thead>
                <tbody class="text-slate-700 dark:text-slate-300 divide-y divide-slate-100 dark:divide-indigo-500/10">
    `;

    data.forEach(row => {
        const rawDate = row[1];
        const idTarget = row[2] ? String(row[2]).replace(/'/g, "") : '-';
        const namaTarget = row[3] ? String(row[3]) : '-';
        const detailLog = row[11] ? String(row[11]) : 'Protokol Tidak Dikenal';

        let formattedDate = '-';
        if(rawDate) {
            const d = new Date(rawDate);
            formattedDate = d.toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit', second:'2-digit' }) + ' WIB';
        }

        // Lencana Indikator Aksi Web3 Style
        let badgeColor = "bg-white border-slate-200 text-slate-600 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-500/50 shadow-sm";
        let glow = "";
        
        if(detailLog.includes("TAMBAH") || detailLog.includes("PULIHKAN")) {
            badgeColor = "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-500/50 shadow-sm";
            glow = "dark:shadow-[0_0_10px_rgba(16,185,129,0.2)]";
        }
        else if(detailLog.includes("UPDATE") || detailLog.includes("MODIFIKASI")) {
            badgeColor = "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-500/50 shadow-sm";
            glow = "dark:shadow-[0_0_10px_rgba(245,158,11,0.2)]";
        }
        else if(detailLog.includes("HAPUS") || detailLog.includes("CABUT")) {
            badgeColor = "bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-500/50 shadow-sm";
            glow = "dark:shadow-[0_0_10px_rgba(244,63,94,0.2)]";
        }

        tableHTML += `
            <tr class="hover:bg-white/60 dark:hover:bg-indigo-900/10 transition-colors group cursor-default">
                <td class="p-5 pl-8 text-slate-500 font-bold">${formattedDate}</td>
                <td class="p-5">
                    <span class="inline-flex items-center px-3 py-1.5 rounded-lg text-[9px] font-black border tracking-widest ${badgeColor} ${glow} transition-transform group-hover:scale-[1.02]">
                        ${detailLog}
                    </span>
                </td>
                <td class="p-5 font-black text-slate-900 dark:text-indigo-300">${idTarget}</td>
                <td class="p-5 tracking-widest text-slate-600 dark:text-indigo-100/70 font-bold pr-8">${namaTarget}</td>
            </tr>
        `;
    });

    logContainer.innerHTML = tableHTML + `</tbody></table></div>`;
}