// src/components/dashboard/TopModules.js

function getAvatarLink(gdriveUrl) {
    if (!gdriveUrl || gdriveUrl === "-" || gdriveUrl.includes("Upload_Error")) return null;
    const match = gdriveUrl.match(/\/d\/([a-zA-Z0-9-_]+)/); 
    if (match && match[1]) return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w400`;
    return null;
}

export function renderTopModules(containerId, adminRoleDept) {
    const container = document.getElementById(containerId);
    const dbLink = adminRoleDept ? `/pages/data-karyawan.html?dept=${encodeURIComponent(adminRoleDept)}` : '/pages/data-karyawan.html';
    const dbTitle = adminRoleDept ? `Database ${adminRoleDept}` : 'Database Master';

    // Desain Card Web3: Terdapat ping-dot di kanan atas, ikon dibungkus glass-badge, teks lebih tegas
    container.innerHTML = `
        <button onclick="window.location.href='${dbLink}'" class="spatial-island group rounded-[2rem] p-6 flex flex-col justify-between h-40 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(14,165,233,0.15)] transition-all duration-300 text-left outline-none overflow-hidden relative z-10 border-t border-t-white/80 dark:border-t-cyan-400/30">
            <div class="absolute top-6 right-6 w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_8px_#22d3ee] animate-pulse"></div>
            <div class="absolute right-0 bottom-0 w-32 h-32 bg-cyan-400/10 blur-[40px] rounded-full group-hover:bg-cyan-400/30 transition-colors duration-500 pointer-events-none"></div>
            
            <div class="flex items-start relative z-10">
                <div class="w-14 h-14 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-[1rem] border border-white dark:border-cyan-500/30 shadow-[0_8px_16px_rgba(14,165,233,0.1)] flex items-center justify-center text-cyan-600 dark:text-cyan-400 group-hover:scale-110 group-hover:text-cyan-500 group-hover:shadow-[0_10px_25px_rgba(14,165,233,0.4)] transition-all duration-300">
                    <svg class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"></path></svg>
                </div>
            </div>
            
            <div class="relative z-10 mt-auto">
                <h3 class="font-black text-slate-800 dark:text-white uppercase tracking-[0.1em] text-base truncate font-mono drop-shadow-sm">${dbTitle}</h3>
                <p class="text-[10px] text-slate-500 dark:text-cyan-300/80 font-mono uppercase tracking-[0.2em] font-bold mt-1">Akses Node Utama</p>
            </div>
        </button>

        <button onclick="window.location.href='/pages/plotting-area.html'" class="spatial-island group rounded-[2rem] p-6 flex flex-col justify-between h-40 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(16,185,129,0.15)] transition-all duration-300 text-left outline-none overflow-hidden relative z-10 border-t border-t-white/80 dark:border-t-emerald-400/30">
            <div class="absolute top-6 right-6 w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_8px_#34d399] animate-pulse"></div>
            <div class="absolute right-0 bottom-0 w-32 h-32 bg-emerald-400/10 blur-[40px] rounded-full group-hover:bg-emerald-400/30 transition-colors duration-500 pointer-events-none"></div>
            
            <div class="flex items-start relative z-10">
                <div class="w-14 h-14 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-[1rem] border border-white dark:border-emerald-500/30 shadow-[0_8px_16px_rgba(16,185,129,0.1)] flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 group-hover:text-emerald-500 group-hover:shadow-[0_10px_25px_rgba(16,185,129,0.4)] transition-all duration-300">
                    <svg class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>
                </div>
            </div>
            
            <div class="relative z-10 mt-auto">
                <h3 class="font-black text-slate-800 dark:text-white uppercase tracking-[0.1em] text-base truncate font-mono drop-shadow-sm">Plotting Area</h3>
                <p class="text-[10px] text-slate-500 dark:text-emerald-300/80 font-mono uppercase tracking-[0.2em] font-bold mt-1">Visualisasi Spasial 2D</p>
            </div>
        </button>

        <button onclick="window.location.href='/pages/recovery.html'" class="spatial-island group rounded-[2rem] p-6 flex flex-col justify-between h-40 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(245,158,11,0.15)] transition-all duration-300 text-left outline-none overflow-hidden relative z-10 border-t border-t-white/80 dark:border-t-amber-400/30">
            <div class="absolute top-6 right-6 w-2 h-2 bg-amber-400 rounded-full shadow-[0_0_8px_#fbbf24] animate-pulse"></div>
            <div class="absolute right-0 bottom-0 w-32 h-32 bg-amber-400/10 blur-[40px] rounded-full group-hover:bg-amber-400/30 transition-colors duration-500 pointer-events-none"></div>
            
            <div class="flex items-start relative z-10">
                <div class="w-14 h-14 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-[1rem] border border-white dark:border-amber-500/30 shadow-[0_8px_16px_rgba(245,158,11,0.1)] flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-110 group-hover:text-amber-500 group-hover:shadow-[0_10px_25px_rgba(245,158,11,0.4)] transition-all duration-300">
                    <svg class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16M10 11v6m4-6v6"></path></svg>
                </div>
            </div>
            
            <div class="relative z-10 mt-auto">
                <h3 class="font-black text-slate-800 dark:text-white uppercase tracking-[0.1em] text-base truncate font-mono drop-shadow-sm">Data Recovery</h3>
                <p class="text-[10px] text-slate-500 dark:text-amber-300/80 font-mono uppercase tracking-[0.2em] font-bold mt-1">Karantina & Retensi</p>
            </div>
        </button>
    `;
}