// src/components/plotting/cleaningmachine/MachineEngine.js

function getAvatarLink(gdriveUrl) {
    if (!gdriveUrl || gdriveUrl === "-" || gdriveUrl.includes("Upload_Error")) return null;
    const match = gdriveUrl.match(/\/d\/([a-zA-Z0-9-_]+)/); 
    if (match && match[1]) return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w400`;
    return null;
}

export function updateMachineStats(lineData, areaData) {
    let pria = 0, wanita = 0; 
    let depts = { PRODUKSI:0, MECHANICAL:0, ELECTRICAL:0, UTILITY:0, QA:0, QC:0, CLEANING:0, OTHER:0 };
    
    lineData.forEach(row => {
        const g = String(row[3] || '').trim().toUpperCase();
        if (g === 'P' || g === 'PEREMPUAN' || g === 'WANITA' || g.includes('WANITA') || g.includes('PEREMPUAN')) wanita++;
        else pria++; 
        
        const d = String(row[5] || '').trim().toUpperCase();
        if(d.includes('PRODUKSI')) depts.PRODUKSI++; else if(d.includes('MECHANICAL') || d === 'ME') depts.MECHANICAL++; else if(d.includes('ELECTRICAL') || d === 'EL') depts.ELECTRICAL++; else if(d.includes('UTILITY') || d === 'UT') depts.UTILITY++; else if(d.includes('QA')) depts.QA++; else if(d.includes('QC')) depts.QC++; else if(d.includes('CLEANING') || d.includes('CLEAN')) depts.CLEANING++; else depts.OTHER++;
    });

    let zones = new Set(); let groups = { A:0, B:0, C:0, D:0, NS:0 };
    areaData.forEach(row => {
        const z = String(row[8] || '').trim(); if (z && z !== '-') zones.add(z);
        const gr = String(row[7] || '').trim().toUpperCase().replace(/(GROUP|GR\.|GR\s|-)/g, '').trim();
        if(gr === 'A') groups.A++; else if(gr === 'B') groups.B++; else if(gr === 'C') groups.C++; else if(gr === 'D') groups.D++; else groups.NS++;
    });

    const statsContainer = document.getElementById('statsContainerM');
    if(statsContainer) {
        statsContainer.innerHTML = `
            <div class="space-y-3">
                <div class="flex justify-between items-center bg-white/60 dark:bg-slate-900/60 border border-white dark:border-slate-700/50 px-4 py-3 rounded-2xl shadow-sm">
                    <span class="text-slate-500 font-bold">NODE PRIA AKTIF</span> <span class="text-blue-600 dark:text-blue-400 font-black text-sm">${pria}</span>
                </div>
                <div class="flex justify-between items-center bg-white/60 dark:bg-slate-900/60 border border-white dark:border-slate-700/50 px-4 py-3 rounded-2xl shadow-sm">
                    <span class="text-slate-500 font-bold">NODE WANITA AKTIF</span> <span class="text-pink-500 dark:text-pink-400 font-black text-sm">${wanita}</span>
                </div>
                <div class="flex justify-between items-center bg-cyan-50/80 dark:bg-cyan-900/30 border border-cyan-200 dark:border-cyan-500/40 px-4 py-3.5 rounded-2xl shadow-inner mt-2">
                    <span class="text-cyan-800 dark:text-cyan-300 font-black">TOTAL KAPASITAS NODE</span> <span class="text-cyan-600 dark:text-white font-black text-xl drop-shadow-[0_0_5px_rgba(14,165,233,0.5)]">${lineData.length}</span>
                </div>
            </div>
            <div class="space-y-3 mt-4">
                <p class="text-slate-400 uppercase font-bold tracking-[0.2em] border-b border-white dark:border-slate-700/50 pb-2">DISTRIBUSI DEPARTEMEN</p>
                <div class="grid grid-cols-2 gap-x-4 gap-y-2.5 bg-white/40 dark:bg-slate-900/40 p-4 rounded-2xl border border-white dark:border-slate-700/50 shadow-sm">
                    <div class="flex justify-between border-b border-slate-200/50 dark:border-slate-800 pb-1.5"><span class="text-slate-500 font-bold">PRODUKSI</span> <span class="text-slate-900 dark:text-cyan-400 font-black">${depts.PRODUKSI}</span></div>
                    <div class="flex justify-between border-b border-slate-200/50 dark:border-slate-800 pb-1.5"><span class="text-slate-500 font-bold">MECHANICAL</span> <span class="text-slate-900 dark:text-cyan-400 font-black">${depts.MECHANICAL}</span></div>
                    <div class="flex justify-between border-b border-slate-200/50 dark:border-slate-800 pb-1.5"><span class="text-slate-500 font-bold">ELECTRICAL</span> <span class="text-slate-900 dark:text-cyan-400 font-black">${depts.ELECTRICAL}</span></div>
                    <div class="flex justify-between border-b border-slate-200/50 dark:border-slate-800 pb-1.5"><span class="text-slate-500 font-bold">UTILITY</span> <span class="text-slate-900 dark:text-cyan-400 font-black">${depts.UTILITY}</span></div>
                    <div class="flex justify-between border-b border-slate-200/50 dark:border-slate-800 pb-1.5"><span class="text-slate-500 font-bold">QA</span> <span class="text-slate-900 dark:text-cyan-400 font-black">${depts.QA}</span></div>
                    <div class="flex justify-between border-b border-slate-200/50 dark:border-slate-800 pb-1.5"><span class="text-slate-500 font-bold">QC</span> <span class="text-slate-900 dark:text-cyan-400 font-black">${depts.QC}</span></div>
                    <div class="flex justify-between border-b border-slate-200/50 dark:border-slate-800 pb-1.5"><span class="text-slate-500 font-bold">CLEANING</span> <span class="text-slate-900 dark:text-cyan-400 font-black">${depts.CLEANING}</span></div>
                    <div class="flex justify-between border-b border-slate-200/50 dark:border-slate-800 pb-1.5"><span class="text-slate-500 font-bold">OTHER</span> <span class="text-slate-900 dark:text-cyan-400 font-black">${depts.OTHER}</span></div>
                </div>
            </div>
        `;
    }

    const miniStatsContainer = document.getElementById('miniStatsContainerM');
    if(miniStatsContainer) {
        miniStatsContainer.innerHTML = `
            <div class="text-center"><p class="text-[9px] font-bold font-mono text-slate-500 tracking-widest uppercase">Zonasi Aktif</p><p class="text-xl font-black text-cyan-600 dark:text-cyan-400 font-mono drop-shadow-sm">${zones.size}</p></div>
            <div class="w-px h-10 bg-slate-200 dark:bg-slate-700"></div>
            <div class="text-center"><p class="text-[9px] font-bold font-mono text-slate-500 tracking-widest uppercase">Populasi Area</p><p class="text-xl font-black text-cyan-600 dark:text-cyan-400 font-mono drop-shadow-sm">${areaData.length}</p></div>
            <div class="w-px h-10 bg-slate-200 dark:bg-slate-700"></div>
            <div class="text-center flex gap-3">
                <div class="bg-white/60 dark:bg-slate-800 p-2 rounded-xl border border-white dark:border-slate-700 shadow-sm"><p class="text-[8px] font-bold font-mono text-slate-400 uppercase tracking-widest">GRP A</p><p class="font-black text-slate-800 dark:text-white font-mono text-base">${groups.A}</p></div>
                <div class="bg-white/60 dark:bg-slate-800 p-2 rounded-xl border border-white dark:border-slate-700 shadow-sm"><p class="text-[8px] font-bold font-mono text-slate-400 uppercase tracking-widest">GRP B</p><p class="font-black text-slate-800 dark:text-white font-mono text-base">${groups.B}</p></div>
                <div class="bg-white/60 dark:bg-slate-800 p-2 rounded-xl border border-white dark:border-slate-700 shadow-sm"><p class="text-[8px] font-bold font-mono text-slate-400 uppercase tracking-widest">GRP C</p><p class="font-black text-slate-800 dark:text-white font-mono text-base">${groups.C}</p></div>
                <div class="bg-white/60 dark:bg-slate-800 p-2 rounded-xl border border-white dark:border-slate-700 shadow-sm"><p class="text-[8px] font-bold font-mono text-slate-400 uppercase tracking-widest">GRP D</p><p class="font-black text-slate-800 dark:text-white font-mono text-base">${groups.D}</p></div>
            </div>
        `;
    }
}

export function renderMachineTable(data) {
    const tableContainer = document.getElementById('tableContainerM');
    if (!tableContainer) return;

    if (data.length === 0) {
        tableContainer.innerHTML = `<div class="flex h-full items-center justify-center"><p class="text-slate-400 font-mono tracking-[0.2em] text-[10px] uppercase font-bold bg-white/50 dark:bg-slate-900/50 px-6 py-3 rounded-xl border border-white dark:border-slate-700/50">Kosong. Tidak ada entri di koordinat ini.</p></div>`; 
        return;
    }
    
    let tbodyHTML = '';
    data.forEach(row => {
        const id = row[1] ? String(row[1]).replace(/'/g, "") : '-'; 
        const nama = row[2] || '-'; const plant = row[4] || '-';
        const dept = row[5] || '-'; const area = row[6] || '-'; const grp = row[7] || '-'; const zone = row[8] || '-';
        
        let kodePloting = row[12];
        if(!kodePloting || kodePloting === "-") {
            let kLine = (plant === "LINE 1") ? "L1" : (plant === "LINE 2") ? "L2" : (plant === "LINE 3") ? "L3" : (plant === "LINE 4") ? "L4" : "LX";
            let kDept = {"PRODUKSI":"PRO", "MECHANICAL":"MEC", "ELECTRICAL":"ELC", "UTILITY":"UTI", "QA":"DQA", "QC":"DQC"}[String(dept).toUpperCase()] || "XX";
            let kID = String(id).replace(/\D/g, '').slice(-4).padStart(4, '0');
            let kArea = String(area).substring(0,2).toUpperCase() + "-" + String(zone).toUpperCase();
            kodePloting = `${kLine}/${kDept}/${kID}/${kArea}`;
        }

        let directFotoLink = getAvatarLink(row[9] ? String(row[9]) : "");
        let FotoSrc = directFotoLink ? directFotoLink : `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23f1f5f9'/><text x='50' y='50' font-family='monospace' font-size='40' font-weight='bold' fill='%2394a3b8' text-anchor='middle' dominant-baseline='central'>${nama !== '-' ? nama.charAt(0).toUpperCase() : '?'}</text></svg>`;

        tbodyHTML += `
            <tr class="hover:bg-white/60 dark:hover:bg-emerald-900/10 transition-colors group cursor-default">
                <td class="p-3 pl-6 flex justify-center"><div class="w-10 h-10 rounded-xl overflow-hidden border border-white dark:border-slate-700 shadow-sm bg-slate-100 dark:bg-transparent"><img src="${FotoSrc}" class="w-full h-full object-cover"></div></td>
                <td class="p-3 font-black text-slate-900 dark:text-emerald-400 text-xs">${id}</td>
                <td class="p-3 text-slate-800 dark:text-white font-bold truncate max-w-[150px]"><span class="text-xs">${nama}</span><br><span class="text-[9px] text-slate-400 tracking-wider">${dept}</span></td>
                <td class="p-3 text-center text-slate-600 dark:text-emerald-100 font-bold">${grp}</td>
                <td class="p-3 text-center text-emerald-600 dark:text-emerald-400 font-bold">${zone}</td>
                <td class="p-3 pr-6"><span class="bg-white/80 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 px-2.5 py-1.5 rounded-lg font-black shadow-sm">${kodePloting}</span></td>
            </tr>`;
    });
    
    tableContainer.innerHTML = `
        <table class="w-full text-left whitespace-nowrap text-[10px] font-mono tracking-widest">
            <thead class="sticky top-0 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl z-10 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-emerald-500/80 shadow-sm">
                <tr><th class="p-4 font-bold text-center pl-6">Foto</th><th class="p-4 font-bold">NIK</th><th class="p-4 font-bold">Nama Karyawan</th><th class="p-4 font-bold text-center">Grup</th><th class="p-4 font-bold text-center">Zonasi</th><th class="p-4 font-bold pr-6">Kode Spasial</th></tr>
            </thead>
            <tbody class="text-slate-700 dark:text-slate-300 divide-y divide-slate-100 dark:divide-slate-800/50">${tbodyHTML}</tbody>
        </table>`;
}