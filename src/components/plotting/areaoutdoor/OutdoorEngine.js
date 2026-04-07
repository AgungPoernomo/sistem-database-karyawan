// src/components/plotting/areaoutdoor/OutdoorEngine.js

function getAvatarLink(gdriveUrl) {
    if (!gdriveUrl || gdriveUrl === "-" || gdriveUrl.includes("Upload_Error")) return null;
    const match = gdriveUrl.match(/\/d\/([a-zA-Z0-9-_]+)/); 
    if (match && match[1]) return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w400`;
    return null;
}

export function renderOutdoorTable(data) {
    const tableContainer = document.getElementById('tableContainerOut');
    if (!tableContainer) return;

    if (data.length === 0) {
        tableContainer.innerHTML = `<div class="flex h-full items-center justify-center"><p class="text-slate-400 font-mono tracking-[0.2em] text-[10px] uppercase font-bold bg-white/50 dark:bg-slate-900/50 px-6 py-3 rounded-xl border border-white dark:border-slate-700/50">Kosong. Tidak ada entri di koordinat ini.</p></div>`; 
        return;
    }
    
    let tbodyHTML = '';
    data.forEach(row => {
        const id = row[1] ? String(row[1]).replace(/'/g, "") : '-'; 
        const nama = row[2] || '-'; const plant = row[4] || '-';
        const area = row[6] || '-'; const zone = row[8] || '-';
        
        let directFotoLink = getAvatarLink(row[9] ? String(row[9]) : "");
        let fotoSrc = directFotoLink ? directFotoLink : `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23f1f5f9'/><text x='50' y='50' font-family='monospace' font-size='40' font-weight='bold' fill='%2394a3b8' text-anchor='middle' dominant-baseline='central'>${nama !== '-' ? nama.charAt(0).toUpperCase() : '?'}</text></svg>`;

        tbodyHTML += `
            <tr class="hover:bg-white/60 dark:hover:bg-emerald-900/10 transition-colors group cursor-default">
                <td class="p-3 pl-6 flex justify-center"><div class="w-10 h-10 rounded-xl overflow-hidden border border-white dark:border-slate-700 shadow-sm bg-slate-100 dark:bg-transparent"><img src="${fotoSrc}" class="w-full h-full object-cover"></div></td>
                <td class="p-3 text-slate-800 dark:text-white font-bold truncate max-w-[150px]"><span class="text-xs">${nama}</span><br><span class="text-[9px] text-slate-400 tracking-wider">${id}</span></td>
                <td class="p-3 text-center text-slate-600 dark:text-emerald-100 font-bold">${plant}</td>
                <td class="p-3 text-center text-emerald-600 dark:text-emerald-400 font-bold">${area}</td>
                <td class="p-3 text-center text-slate-600 dark:text-emerald-100 font-bold">${zone}</td>
                <td class="p-3 pr-6"><span class="bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30 px-2.5 py-1.5 rounded-lg font-black shadow-sm text-[9px] uppercase">Clear Responsibility</span></td>
            </tr>`;
    });
    
    tableContainer.innerHTML = `
        <table class="w-full text-left whitespace-nowrap text-[10px] font-mono tracking-widest">
            <thead class="sticky top-0 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl z-10 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-emerald-500/80 shadow-sm">
                <tr><th class="p-4 font-bold text-center pl-6">Visual</th><th class="p-4 font-bold">PIC (Otorisator)</th><th class="p-4 font-bold text-center">Line / Plant</th><th class="p-4 font-bold text-center">Area Name</th><th class="p-4 font-bold text-center">Zone Type</th><th class="p-4 font-bold pr-6">Purpose</th></tr>
            </thead>
            <tbody class="text-slate-700 dark:text-slate-300 divide-y divide-slate-100 dark:divide-slate-800/50">${tbodyHTML}</tbody>
        </table>`;
}