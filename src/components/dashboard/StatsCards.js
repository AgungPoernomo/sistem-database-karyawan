// src/components/dashboard/StatsCards.js

// Modifikasi pembungkus widget agar memiliki struktur yang lebih elegan
function createClickableStatsWidget(title, contentHTML, onClickFunction) {
    return `
    <div class="spatial-island col-span-2 md:col-span-2 xl:col-span-1 rounded-[2rem] p-6 relative overflow-hidden flex flex-col h-full min-h-[220px] cursor-pointer hover:shadow-[0_20px_40px_rgba(14,165,233,0.12)] hover:-translate-y-1.5 transition-all duration-300 group border-t border-t-white/80 dark:border-t-cyan-400/30 z-10" onclick="${onClickFunction}">
        <div class="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent dark:from-slate-800/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
        
        <div class="flex justify-between items-center border-b border-slate-200/50 dark:border-slate-700/50 pb-3 mb-4 relative z-10">
            <div class="flex items-center space-x-2">
                <div class="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_5px_#0ea5e9]"></div>
                <p class="text-[10px] font-black font-mono text-slate-700 dark:text-cyan-400 uppercase tracking-[0.15em]">${title}</p>
            </div>
            <div class="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center border border-white dark:border-slate-700 group-hover:bg-cyan-50 dark:group-hover:bg-cyan-900/40 transition-colors">
                <svg class="w-3 h-3 text-slate-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"></path></svg>
            </div>
        </div>
        
        <div class="flex-1 flex flex-col justify-center relative z-10 w-full">${contentHTML}</div>
    </div>`;
}

export function renderStatsCards(containerId, data) {
    const container = document.getElementById(containerId);
    container.className = "grid grid-cols-2 md:grid-cols-4 xl:grid-cols-4 gap-6 auto-rows-fr"; 
    
    let lines = { "LINE 1": 0, "LINE 2": 0, "LINE 3": 0, "LINE 4": 0 };
    let genders = { "L": 0, "P": 0 };
    let groups = { "A": 0, "B": 0, "C": 0, "D": 0 };
    let status = { "AKTIF": 0, "INAKTIF": 0 };
    let areas = {};

    data.forEach(row => {
        const plantStr = String(row[4] || '').toUpperCase();
        if(plantStr.includes("LINE 1")) lines["LINE 1"]++;
        else if(plantStr.includes("LINE 2")) lines["LINE 2"]++;
        else if(plantStr.includes("LINE 3")) lines["LINE 3"]++;
        else if(plantStr.includes("LINE 4")) lines["LINE 4"]++;

        const area = String(row[6] || 'Unassigned').toUpperCase();
        areas[area] = (areas[area] || 0) + 1;

        const gender = String(row[3] || '').toUpperCase();
        if(gender.startsWith('L') || gender === 'PRIA' || gender === 'MALE') genders["L"]++;
        else genders["P"]++;

        const grp = String(row[7] || '').toUpperCase();
        if(grp === 'A') groups["A"]++;
        else if(grp === 'B') groups["B"]++;
        else if(grp === 'C') groups["C"]++;
        else if(grp === 'D') groups["D"]++;

        const stat = String(row[11] || '').toUpperCase();
        if(stat.includes('TIDAK') || stat.includes('INAKTIF') || stat.includes('NON')) status["INAKTIF"]++;
        else status["AKTIF"]++;
    });

    const total = data.length || 1;

    // 1. DESAIN METRIK LINE: Dibungkus dalam kotak-kotak terpisah dengan progress bar bercahaya
    let lineHTML = `<div class="space-y-2.5 w-full">` + Object.entries(lines).map(([k,v]) => `
        <div class="flex items-center justify-between text-[11px] font-mono bg-white/60 dark:bg-slate-900/40 p-2.5 rounded-xl border border-white dark:border-slate-700/50 shadow-sm hover:shadow-md transition-shadow group/line">
            <span class="text-slate-600 dark:text-slate-300 font-bold w-14 group-hover/line:text-cyan-600 dark:group-hover/line:text-cyan-400 transition-colors">${k}</span>
            <div class="flex-1 mx-3 h-2 bg-slate-200/50 dark:bg-slate-950/80 rounded-full overflow-hidden shadow-inner relative">
                <div class="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full bar-animate shadow-[0_0_10px_rgba(14,165,233,0.8)]" style="width: ${(v/total)*100}%"></div>
            </div>
            <span class="text-slate-900 dark:text-white font-black text-sm w-8 text-right drop-shadow-sm">${v}</span>
        </div>
    `).join('') + `</div>`;

    // 2. DESAIN METRIK AREA: Daftar scroll yang disembunyikan scrollbarnya, desain seperti log data
    const sortedAreas = Object.entries(areas).sort((a,b) => b[1] - a[1]);
    let areaHTML = `<div class="max-h-[145px] overflow-y-auto space-y-2 w-full pr-1" style="scrollbar-width: none; -ms-overflow-style: none;">` + 
        sortedAreas.map(([k,v]) => `
        <div class="flex justify-between items-center text-[10px] font-mono bg-white/50 dark:bg-slate-900/30 px-3 py-2.5 rounded-xl border border-slate-100 dark:border-slate-700/30 hover:bg-cyan-50/50 dark:hover:bg-cyan-900/20 transition-colors">
            <div class="flex items-center space-x-2 w-[75%]">
                <span class="w-1.5 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full"></span>
                <span class="text-slate-700 dark:text-slate-300 font-bold truncate tracking-widest">${k}</span>
            </div>
            <span class="text-cyan-700 dark:text-cyan-400 font-black text-sm drop-shadow-sm">${v}</span>
        </div>
    `).join('') + `</div>`;

    // 3. DESAIN METRIK GRUP: Grid 2x2 seperti panel LED instrumen kokpit
    let groupHTML = `<div class="grid grid-cols-2 gap-3 h-full w-full">` + 
        ['A','B','C','D'].map(g => `
        <div class="bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-900/40 rounded-2xl p-3 flex flex-col items-center justify-center border border-white dark:border-slate-700/50 shadow-[0_4px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_15px_rgba(14,165,233,0.15)] transition-all relative overflow-hidden">
            <div class="absolute inset-0 bg-cyan-400/5 opacity-0 hover:opacity-100 transition-opacity"></div>
            <span class="text-[9px] text-slate-400 dark:text-slate-500 font-black tracking-[0.2em] mb-1">GRUP ${g}</span>
            <span class="text-3xl font-black text-slate-800 dark:text-white font-mono drop-shadow-md">${groups[g]}</span>
        </div>
    `).join('') + `</div>`;

    // 4. DESAIN METRIK STATUS: Indikator nyala/mati seperti server health monitor
    let statusHTML = `
        <div class="flex flex-col h-full justify-center space-y-4 w-full">
            <div class="flex items-center justify-between bg-white/70 dark:bg-slate-900/60 p-4 rounded-2xl border border-white dark:border-slate-700/50 shadow-sm relative overflow-hidden">
                <div class="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
                <div class="flex items-center pl-2">
                    <span class="text-[10px] font-black font-mono tracking-[0.2em] text-slate-600 dark:text-slate-300 uppercase">Operasional</span>
                </div>
                <span class="text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400 drop-shadow-md">${status["AKTIF"]}</span>
            </div>
            
            <div class="flex items-center justify-between bg-white/70 dark:bg-slate-900/60 p-4 rounded-2xl border border-white dark:border-slate-700/50 shadow-sm relative overflow-hidden">
                <div class="absolute left-0 top-0 bottom-0 w-1.5 bg-rose-500 shadow-[0_0_8px_#f43f5e]"></div>
                <div class="flex items-center pl-2">
                    <span class="text-[10px] font-black font-mono tracking-[0.2em] text-slate-600 dark:text-slate-300 uppercase">Non-Aktif</span>
                </div>
                <span class="text-3xl font-black font-mono text-rose-600 dark:text-rose-400 drop-shadow-md">${status["INAKTIF"]}</span>
            </div>
        </div>
    `;

    let html = '';
    html += createClickableStatsWidget('Distribusi Line', lineHTML, "window.dashboardApp.openLineModal('SEMUA LINE')");
    html += createClickableStatsWidget('Densitas Area', areaHTML, "window.dashboardApp.openAreaModal()");
    html += createClickableStatsWidget('Matrix Shift', groupHTML, "window.dashboardApp.openGroupModal()");
    html += createClickableStatsWidget('Health Status', statusHTML, "window.dashboardApp.openStatusModal()");

    container.innerHTML = html;
}