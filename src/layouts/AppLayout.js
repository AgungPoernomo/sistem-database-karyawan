// src/layouts/AppLayout.js

export function renderSidebar(containerId, userId, adminRoleDept) {
    const container = document.getElementById(containerId);
    const dbText = adminRoleDept ? `Database ${adminRoleDept}` : 'Database Master';
    const avatarLetter = userId.charAt(0).toUpperCase();

    // Deteksi Halaman Aktif secara Dinamis
    const path = window.location.pathname;
    const isDash = (path.includes('dashboard') || path === '/' || path.endsWith('/')) ? 'active' : '';
    const isData = path.includes('data-karyawan') ? 'active' : '';
    const isPlot = path.includes('plotting-area') ? 'active' : '';
    const isRecv = path.includes('recovery') ? 'active' : '';
    const isAudt = path.includes('activity-log') ? 'active' : '';

    const web3Styles = `
        <style>
            /* --- SPATIAL CANVAS (Floating Islands) --- */
            .spatial-island {
                background: linear-gradient(145deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.3) 100%);
                backdrop-filter: blur(40px) saturate(150%);
                -webkit-backdrop-filter: blur(40px) saturate(150%);
                border-top: 1px solid rgba(255, 255, 255, 1);
                border-left: 1px solid rgba(255, 255, 255, 0.8);
                border-right: 1px solid rgba(255, 255, 255, 0.2);
                border-bottom: 1px solid rgba(255, 255, 255, 0.2);
                box-shadow: 20px 20px 60px rgba(14, 165, 233, 0.05), inset 0 0 20px rgba(255, 255, 255, 0.8);
            }
            .dark .spatial-island {
                background: linear-gradient(145deg, rgba(15, 23, 42, 0.7) 0%, rgba(2, 6, 23, 0.4) 100%);
                border-top: 1px solid rgba(14, 165, 233, 0.2); border-left: 1px solid rgba(14, 165, 233, 0.2);
                border-right: 1px solid rgba(255, 255, 255, 0.02); border-bottom: 1px solid rgba(255, 255, 255, 0.02);
                box-shadow: 20px 20px 60px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(14, 165, 233, 0.05);
            }

            /* --- DOT MATRIX INTERIOR --- */
            .dot-matrix {
                position: absolute; inset: 0; z-index: 0; pointer-events: none; opacity: 0.4;
                background-image: radial-gradient(rgba(14, 165, 233, 0.3) 1px, transparent 1px); background-size: 16px 16px;
                mask-image: linear-gradient(to bottom, black 10%, transparent 90%); -webkit-mask-image: linear-gradient(to bottom, black 10%, transparent 90%);
            }
            .dark .dot-matrix { background-image: radial-gradient(rgba(56, 189, 248, 0.2) 1px, transparent 1px); }

            /* --- HOLOGRAPHIC NAVIGATION --- */
            .holo-nav { position: relative; z-index: 10; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); border-radius: 1rem; overflow: hidden; }
            
            .holo-bracket { opacity: 0; transform: translateX(-10px); color: #0ea5e9; transition: all 0.3s ease; font-weight: 900; }
            .holo-bracket.right { transform: translateX(10px); }
            .holo-nav:hover .holo-bracket { opacity: 1; transform: translateX(0); }
            .holo-nav.active .holo-bracket { opacity: 1; transform: translateX(0); color: #0284c7; text-shadow: 0 0 8px rgba(14,165,233,0.5); }
            .dark .holo-nav.active .holo-bracket { color: #38bdf8; }

            .holo-nav::before {
                content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, rgba(14, 165, 233, 0.1), transparent);
                transform: scaleX(0); transform-origin: left; transition: transform 0.4s ease; z-index: -1;
            }
            .holo-nav:hover::before { transform: scaleX(1); }
            
            .holo-nav.active { background: rgba(255, 255, 255, 0.6); box-shadow: inset 2px 0 0 #0ea5e9, 0 10px 20px rgba(14, 165, 233, 0.05); }
            .dark .holo-nav.active { background: rgba(14, 165, 233, 0.1); box-shadow: inset 2px 0 0 #38bdf8, 0 10px 20px rgba(0, 0, 0, 0.2); }

            .holo-text { color: #64748b; transition: all 0.3s ease; }
            .dark .holo-text { color: #94a3b8; }
            .holo-nav:hover .holo-text { color: #0284c7; transform: translateX(4px); }
            .holo-nav.active .holo-text { color: #0f172a; transform: translateX(4px); font-weight: 800; }
            .dark .holo-nav:hover .holo-text { color: #38bdf8; }
            .dark .holo-nav.active .holo-text { color: #ffffff; text-shadow: 0 0 10px rgba(56, 189, 248, 0.5); }

            .holo-icon { color: #94a3b8; transition: all 0.4s ease; filter: drop-shadow(0 2px 2px rgba(0,0,0,0.05)); }
            .dark .holo-icon { color: #475569; }
            .holo-nav:hover .holo-icon { color: #0ea5e9; transform: scale(1.1) rotate(-5deg); filter: drop-shadow(0 0 5px rgba(14,165,233,0.4)); }
            .holo-nav.active .holo-icon { color: #0284c7; transform: scale(1.1); filter: drop-shadow(0 0 8px rgba(14,165,233,0.5)); }
            .dark .holo-nav.active .holo-icon { color: #38bdf8; }

            /* --- HARDWARE NODE (User Card) --- */
            .hardware-node {
                background: rgba(255, 255, 255, 0.8); border: 1px solid rgba(255, 255, 255, 1); border-radius: 1.5rem;
                box-shadow: 0 10px 30px rgba(14, 165, 233, 0.1), inset 0 -2px 10px rgba(14, 165, 233, 0.05); position: relative; overflow: hidden; z-index: 20;
            }
            .dark .hardware-node {
                background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(56, 189, 248, 0.2);
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), inset 0 -2px 10px rgba(14, 165, 233, 0.1);
            }
            .hardware-node::after {
                content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 2px;
                background: linear-gradient(90deg, transparent, #0ea5e9, transparent); animation: scanNode 4s infinite; opacity: 0.5;
            }
            @keyframes scanNode { 0% { top: -10%; } 100% { top: 110%; } }
        </style>
    `;

    container.innerHTML = `
        ${web3Styles}
        <aside class="w-[280px] m-6 mr-3 spatial-island rounded-[2.5rem] flex flex-col h-[calc(100vh-3rem)] transition-theme relative z-30">
            <div class="dot-matrix"></div>

            <div class="h-32 flex flex-col items-center justify-center px-6 relative z-10 mt-2">
                <div class="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md px-6 py-3 rounded-[1.25rem] border border-white dark:border-cyan-500/30 shadow-[0_10px_25px_rgba(14,165,233,0.1)] transition-transform duration-500 hover:scale-105 group cursor-default relative overflow-hidden">
                    <div class="absolute inset-0 bg-gradient-to-tr from-cyan-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <img src="/assets/logo-satoria.png" alt="Satoria Logo" class="h-9 w-auto object-contain filter drop-shadow-[0_2px_8px_rgba(14,165,233,0.3)] dark:drop-shadow-[0_2px_15px_rgba(14,165,233,0.6)] relative z-10">
                </div>
                <div class="mt-5 flex items-center space-x-2">
                    <span class="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-ping"></span>
                    <span class="text-[9px] font-mono text-cyan-600 dark:text-cyan-400 tracking-[0.3em] uppercase font-black">DATABASE SYSTEM</span>
                </div>
            </div>

            <nav class="flex-1 overflow-y-auto py-6 px-5 space-y-1.5 font-mono text-[11px] font-bold tracking-widest relative z-10 custom-scrollbar">
                <a href="/pages/dashboard.html" class="holo-nav ${isDash} flex items-center px-3 py-4 group">
                    <span class="holo-bracket left mr-2">[</span>
                    <svg class="w-5 h-5 mr-3 holo-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                    <span class="holo-text uppercase flex-1">Dashboard</span>
                    <span class="holo-bracket right ml-2">]</span>
                </a>
                
                <a href="/pages/data-karyawan.html" class="holo-nav ${isData} flex items-center px-3 py-4 group">
                    <span class="holo-bracket left mr-2">[</span>
                    <svg class="w-5 h-5 mr-3 holo-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"></path></svg>
                    <span id="navDbText" class="holo-text truncate uppercase flex-1">${dbText}</span>
                    <span class="holo-bracket right ml-2">]</span>
                </a>
                
                <a href="/pages/plotting-area.html" class="holo-nav ${isPlot} flex items-center px-3 py-4 group">
                    <span class="holo-bracket left mr-2">[</span>
                    <svg class="w-5 h-5 mr-3 holo-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>
                    <span class="holo-text uppercase flex-1">Plotting Area</span>
                    <span class="holo-bracket right ml-2">]</span>
                </a>
                
                <a href="/pages/recovery.html" class="holo-nav ${isRecv} flex items-center px-3 py-4 group">
                    <span class="holo-bracket left mr-2 text-amber-500">[</span>
                    <svg class="w-5 h-5 mr-3 holo-icon group-hover:text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16M10 11v6m4-6v6"></path></svg>
                    <span class="holo-text uppercase flex-1 group-hover:text-amber-600 dark:group-hover:text-amber-400">Sistem Recovery</span>
                    <span class="holo-bracket right ml-2 text-amber-500">]</span>
                </a>
                
                <a href="/pages/activity-log.html" class="holo-nav ${isAudt} flex items-center px-3 py-4 group">
                    <span class="holo-bracket left mr-2">[</span>
                    <svg class="w-5 h-5 mr-3 holo-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                    <span class="holo-text uppercase flex-1">Audit Log</span>
                    <span class="holo-bracket right ml-2">]</span>
                </a>

                <div class="h-8"></div>
                
                <button id="themeToggleBtn" class="w-full holo-nav flex items-center px-3 py-4 group outline-none">
                    <span class="holo-bracket left mr-2 text-indigo-500 dark:text-amber-400">[</span>
                    <svg id="themeIcon" class="w-5 h-5 mr-3 holo-icon group-hover:text-indigo-500 dark:group-hover:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"></svg>
                    <span id="themeText" class="holo-text uppercase flex-1 group-hover:text-indigo-600 dark:group-hover:text-amber-300">Tema Interface</span>
                    <span class="holo-bracket right ml-2 text-indigo-500 dark:text-amber-400">]</span>
                </button>
            </nav>

            <div class="p-5 relative z-10">
                <div class="hardware-node p-4 flex items-center group cursor-default">
                    <div class="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 border border-cyan-200 dark:border-cyan-500/50 flex items-center justify-center text-cyan-600 dark:text-cyan-400 font-black text-xl mr-4 shadow-[0_5px_15px_rgba(14,165,233,0.15)] relative overflow-hidden transition-colors">
                        <div class="absolute inset-0 bg-cyan-400/20 animate-pulse"></div>
                        <span class="relative z-10">${avatarLetter}</span>
                    </div>
                    <div class="flex-1 overflow-hidden font-mono">
                        <p class="text-[13px] font-extrabold text-slate-800 dark:text-white truncate tracking-widest transition-colors">${userId}</p>
                        <div class="flex items-center mt-1.5 space-x-2">
                            <div class="flex space-x-1">
                                <div class="w-1 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                                <div class="w-1 h-3 bg-emerald-500 rounded-full animate-pulse" style="animation-delay: 150ms"></div>
                                <div class="w-1 h-3 bg-emerald-500 rounded-full animate-pulse" style="animation-delay: 300ms"></div>
                            </div>
                            <span class="text-[8px] text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.2em] font-bold">Terhubung</span>
                        </div>
                    </div>
                    <button id="logoutBtn" class="p-3 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/20 rounded-[10px] transition-all border border-transparent hover:border-rose-200 dark:hover:border-rose-500/30" title="Putuskan Koneksi Node">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                    </button>
                </div>
            </div>
        </aside>
    `;
}

export function renderHeader(containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = `
        <header class="mx-6 mt-6 mb-2 spatial-island rounded-[2rem] h-24 flex-shrink-0 flex items-center justify-between px-10 z-20 relative transition-theme">
            <div class="flex items-center">
                <div class="relative w-12 h-12 mr-6 flex items-center justify-center">
                    <div class="absolute inset-0 bg-cyan-400 rounded-full blur-[10px] opacity-50 animate-pulse"></div>
                    <div class="relative w-6 h-6 bg-gradient-to-br from-white to-cyan-200 dark:from-cyan-400 dark:to-blue-600 rounded-full border-2 border-white dark:border-cyan-200 shadow-[0_0_15px_rgba(14,165,233,0.8)]"></div>
                </div>
                <div>
                    <h2 class="text-[1.35rem] font-black text-slate-800 dark:text-white tracking-[0.15em] uppercase transition-colors font-mono drop-shadow-sm">Executive Command Center</h2>
                    <p class="text-[10px] font-bold font-mono text-cyan-600 dark:text-cyan-400 mt-1 uppercase tracking-[0.25em] transition-colors">Platform Tata Kelola Data Terdesentralisasi</p>
                </div>
            </div>
            
            <div class="hidden lg:flex items-center space-x-3 text-[10px] font-mono font-bold text-cyan-700 dark:text-cyan-300 uppercase tracking-widest bg-white/50 dark:bg-slate-900/50 px-6 py-3 rounded-2xl border border-white dark:border-cyan-500/30 shadow-sm dark:shadow-[inset_0_0_15px_rgba(14,165,233,0.1)] transition-colors backdrop-blur-md">
                <div class="flex space-x-1 mr-1">
                    <span class="w-1.5 h-1.5 bg-cyan-500 dark:bg-cyan-400 rounded-full animate-bounce"></span>
                    <span class="w-1.5 h-1.5 bg-cyan-500 dark:bg-cyan-400 rounded-full animate-bounce" style="animation-delay: 100ms"></span>
                </div>
                <span>Enkripsi: AES-256 Valid</span>
            </div>
        </header>
    `;
}

export function initThemeAndLogout() {
    const htmlElement = document.documentElement;
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const themeIcon = document.getElementById('themeIcon');
    const themeText = document.getElementById('themeText');
    
    let currentTheme = localStorage.getItem('satoria_theme') || 'light';

    function updateThemeUI(theme) {
        if (theme === 'dark') {
            if(themeText) themeText.innerText = 'Mode Terang';
            if(themeIcon) themeIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>`;
        } else {
            if(themeText) themeText.innerText = 'Mode Gelap';
            if(themeIcon) themeIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>`;
        }
    }
    
    updateThemeUI(currentTheme);

    themeToggleBtn?.addEventListener('click', () => {
        // 1. Tambahkan class untuk mematikan transisi secara global
        htmlElement.classList.add('no-transitions');

        // 2. Logika pergantian tema
        currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('satoria_theme', currentTheme);
        
        if (currentTheme === 'dark') {
            htmlElement.classList.add('dark');
        } else {
            htmlElement.classList.remove('dark');
        }
        
        updateThemeUI(currentTheme);

        // 3. Paksa browser untuk menerapkan perubahan tanpa animasi (Force Reflow)
        // Ini trik teknis agar perubahan warna terjadi di frame yang sama
        window.getComputedStyle(htmlElement).opacity;

        // 4. Lepaskan kembali class anti-transisi agar UI tetap interaktif
        setTimeout(() => {
            htmlElement.classList.remove('no-transitions');
        }, 0);
    });

    document.getElementById('logoutBtn')?.addEventListener('click', () => {
        if(confirm("Apakah Anda yakin ingin memutus koneksi dari Node Organisasi Satoria?")) {
            sessionStorage.clear(); localStorage.clear();
            window.location.replace('/');
        }
    });
}