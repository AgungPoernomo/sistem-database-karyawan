// src/components/plotting/PlottingModals.js
import { APP_CONFIG } from '../../config/api.js';

export function initPlottingModals(containerId, dependencies) {
    const { allDataCache, masterOptions, onSearchFound } = dependencies;
    const container = document.getElementById(containerId);

    container.innerHTML = `
        <div id="searchModal" class="fixed inset-0 z-[60] hidden flex-col items-center justify-center opacity-0 transition-opacity duration-400">
            <div id="searchOverlay" class="absolute inset-0 bg-slate-900/60 backdrop-blur-xl cursor-pointer"></div>
            <div class="relative z-10 w-full max-w-md p-8 spatial-island rounded-[2.5rem] transform scale-95 transition-all duration-400" id="searchContent">
                <div class="flex justify-between items-center mb-6 border-b border-slate-200/50 dark:border-slate-700/50 pb-4">
                    <h3 class="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-[0.2em] flex items-center font-mono">
                        <svg class="w-5 h-5 text-cyan-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg> Lacak Node Personil
                    </h3>
                </div>
                <form id="searchForm" class="space-y-6">
                    <div class="space-y-2">
                        <label class="text-[9px] font-bold text-slate-500 dark:text-cyan-400 uppercase tracking-widest pl-2 font-mono">Kredensial ID / Nama</label>
                        <input type="text" id="searchInputModal" class="w-full px-5 py-4 glass-input rounded-2xl text-slate-900 dark:text-white font-mono text-sm tracking-widest font-bold" placeholder="Pencarian..." required autocomplete="off" />
                    </div>
                    <div class="pt-2 flex justify-end items-center">
                        <button type="button" id="closeSearchBtn" class="mr-4 text-slate-500 font-bold text-xs uppercase tracking-widest font-mono hover:text-slate-900 dark:hover:text-white transition-colors">Batal</button>
                        <button type="submit" class="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest font-mono shadow-[0_5px_15px_rgba(14,165,233,0.3)] transition-all hover:-translate-y-1">Eksekusi</button>
                    </div>
                </form>
            </div>
        </div>

        <div id="adminModal" class="fixed inset-0 z-[60] hidden flex-col items-center justify-center opacity-0 transition-opacity duration-400">
            <div id="adminOverlay" class="absolute inset-0 bg-slate-900/60 backdrop-blur-xl cursor-pointer"></div>
            <div class="relative z-10 w-full max-w-md p-8 spatial-island border-t-purple-400 rounded-[2.5rem] transform scale-95 transition-all duration-400" id="adminContent">
                <h3 class="text-sm font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-200/50 dark:border-slate-700/50 pb-4 uppercase tracking-[0.2em] flex items-center font-mono">
                    <span class="w-2.5 h-2.5 bg-purple-500 rounded-full mr-3 shadow-[0_0_10px_#a855f7] animate-pulse"></span> Integrasi Blueprint
                </h3>
                <form id="uploadLayoutForm" class="space-y-4">
                    <div class="space-y-2">
                        <label class="text-[9px] font-bold text-slate-500 dark:text-purple-300 uppercase tracking-widest pl-2 font-mono">Kategori Matriks</label>
                        <select id="layoutType" class="w-full px-4 py-3 glass-input rounded-2xl text-slate-900 dark:text-white font-mono text-xs font-bold appearance-none">
                            <option value="LINE">1. Blueprint Line Utama</option>
                            <option value="AREA">2. Topologi Area Detail</option>
                            <option value="RUANGAN">3. Detail Ruangan Spesifik</option>
                        </select>
                    </div>
                    <div class="space-y-2">
                        <label class="text-[9px] font-bold text-slate-500 dark:text-purple-300 uppercase tracking-widest pl-2 font-mono">Pilih Line</label>
                        <select id="layoutPlant" required class="w-full px-4 py-3 glass-input rounded-2xl text-slate-900 dark:text-white font-mono text-xs font-bold appearance-none"></select>
                    </div>
                    <div class="space-y-2 hidden" id="divLayoutArea">
                        <label class="text-[9px] font-bold text-slate-500 dark:text-purple-300 uppercase tracking-widest pl-2 font-mono">Pilih Area</label>
                        <select id="layoutAreaSelect" class="w-full px-4 py-3 glass-input rounded-2xl text-slate-900 dark:text-white font-mono text-xs font-bold appearance-none"></select>
                    </div>
                    <div class="space-y-2 hidden" id="divLayoutRuangan">
                        <label class="text-[9px] font-bold text-slate-500 dark:text-purple-300 uppercase tracking-widest pl-2 font-mono">Nama Ruangan</label>
                        <input type="text" id="layoutRuanganInput" class="w-full px-4 py-3 glass-input rounded-2xl text-slate-900 dark:text-white font-mono text-xs font-bold" placeholder="Ketik nama ruangan...">
                    </div>
                    
                    <div class="space-y-2 mt-4 border-t border-slate-200/50 dark:border-slate-700/50 pt-4">
                        <label class="text-[9px] font-bold text-slate-500 dark:text-purple-300 uppercase tracking-widest pl-2 font-mono">File Gambar (Maks 2MB)</label>
                        <div class="relative flex flex-col items-center justify-center w-full">
                            <label for="formLayoutImage" class="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-purple-500/30 rounded-2xl cursor-pointer bg-purple-50/50 dark:bg-purple-900/10 hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:border-purple-400 transition-all group shadow-inner">
                                <svg class="w-6 h-6 text-purple-500/60 mb-1 group-hover:text-purple-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                                <p class="text-[9px] text-purple-600 dark:text-purple-400/80 font-mono tracking-widest font-bold uppercase">Pilih File JPG/PNG</p>
                                <input id="formLayoutImage" type="file" class="hidden" accept="image/png, image/jpeg, image/jpg" required />
                            </label>
                            <p id="layoutFileName" class="text-[9px] text-emerald-600 dark:text-emerald-400 font-mono font-bold text-center mt-2 hidden px-3 py-1.5 bg-emerald-500/10 rounded-lg border border-emerald-500/30 uppercase tracking-widest"></p>
                        </div>
                    </div>

                    <div class="pt-4 mt-2 flex justify-end items-center border-t border-slate-200/50 dark:border-slate-700/50">
                        <button type="button" id="closeAdminBtn" class="mr-4 text-slate-500 font-bold text-xs uppercase tracking-widest font-mono hover:text-slate-800 dark:hover:text-white transition-colors">Batal</button>
                        <button type="submit" id="btnSubmitLayout" class="bg-purple-600 hover:bg-purple-500 text-white px-7 py-3 rounded-2xl text-xs font-black uppercase tracking-widest font-mono shadow-[0_5px_15px_rgba(147,51,234,0.4)] transition-all flex items-center hover:-translate-y-1">
                            <svg id="btnLoader" class="hidden animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            <span id="btnText">Simpan Layout</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;

    // Logika Search (Tetap)
    const searchModal = document.getElementById('searchModal');
    const searchContent = document.getElementById('searchContent');
    const searchInputModal = document.getElementById('searchInputModal');
    
    document.getElementById('btnSearch')?.addEventListener('click', () => {
        searchModal.classList.replace('hidden', 'flex');
        setTimeout(() => { searchModal.classList.remove('opacity-0'); searchContent.classList.remove('scale-95'); }, 10);
        searchInputModal.focus();
    });

    const closeSearch = () => {
        searchModal.classList.add('opacity-0'); searchContent.classList.add('scale-95');
        setTimeout(() => searchModal.classList.replace('flex', 'hidden'), 400);
        searchInputModal.value = '';
    };

    document.getElementById('closeSearchBtn')?.addEventListener('click', closeSearch);
    document.getElementById('searchOverlay')?.addEventListener('click', closeSearch);

    document.getElementById('searchForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const term = searchInputModal.value.trim().toLowerCase();
        if (!term) return;
        const cleanTerm = term.replace(/'/g, ""); 
        const targetPIC = allDataCache.find(row => {
            const id = String(row[1]).replace(/'/g, "").toLowerCase();
            const nm = String(row[2]).toLowerCase();
            return id.includes(cleanTerm) || nm.includes(cleanTerm);
        });
        if (targetPIC) { closeSearch(); onSearchFound(targetPIC); } 
        else { window.plottingApp.showToast(`Node "${term}" tidak ditemukan.`, 'error'); }
    });

    // Logika Admin Upload
    const adminModal = document.getElementById('adminModal');
    const adminContent = document.getElementById('adminContent');
    const pSelect = document.getElementById('layoutPlant');
    const aSelect = document.getElementById('layoutAreaSelect');
    
    if(masterOptions['PLANT']) masterOptions['PLANT'].forEach(p => { pSelect.innerHTML += `<option value="${p}">${p}</option>`; });
    if(masterOptions['AREA']) masterOptions['AREA'].forEach(a => { aSelect.innerHTML += `<option value="${a}">${a}</option>`; });
    
    document.getElementById('layoutType')?.addEventListener('change', (e) => { 
        const val = e.target.value;
        document.getElementById('divLayoutArea').classList.toggle('hidden', val === 'LINE'); 
        document.getElementById('divLayoutRuangan').classList.toggle('hidden', val !== 'RUANGAN'); 
    });
    
    document.getElementById('btnAdminUpload')?.addEventListener('click', () => { 
        adminModal.classList.replace('hidden', 'flex'); 
        setTimeout(() => { adminModal.classList.remove('opacity-0'); adminContent.classList.remove('scale-95'); }, 10); 
    });
    
    const closeAdmin = () => {
        adminModal.classList.add('opacity-0'); adminContent.classList.add('scale-95');
        setTimeout(() => adminModal.classList.replace('flex', 'hidden'), 400);
    }
    document.getElementById('adminOverlay')?.addEventListener('click', closeAdmin);
    document.getElementById('closeAdminBtn')?.addEventListener('click', closeAdmin);
    
    let base64Layout = ""; let fileNameLayout = "";
    document.getElementById('formLayoutImage')?.addEventListener('change', function(e) {
        const file = e.target.files[0];
        const display = document.getElementById('layoutFileName');
        if(file) {
            const reader = new FileReader();
            reader.onload = function(event) { 
                base64Layout = event.target.result.split(',')[1]; 
                fileNameLayout = file.name; 
                display.innerText = "Dimuat: " + file.name;
                display.classList.remove('hidden');
            };
            reader.readAsDataURL(file);
        }
    });

    document.getElementById('uploadLayoutForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        if(!base64Layout) { window.plottingApp.showToast('Matriks Foto kosong. Masukkan file PNG/JPG.', 'error'); return; }
        
        const btnSubmit = document.getElementById('btnSubmitLayout');
        const btnText = document.getElementById('btnText');
        const btnLoader = document.getElementById('btnLoader');
        
        btnText.innerText = "Mengintegrasi..."; btnLoader.classList.remove('hidden'); btnSubmit.disabled = true;

        const tipe = document.getElementById('layoutType').value;
        const payloadData = {
            tipe: tipe,
            plant: document.getElementById('layoutPlant').value,
            area: (tipe === 'AREA' || tipe === 'RUANGAN') ? document.getElementById('layoutAreaSelect').value : '',
            ruangan: tipe === 'RUANGAN' ? document.getElementById('layoutRuanganInput').value : '',
            base64: base64Layout, fileName: fileNameLayout
        };

        try {
            const res = await fetch(APP_CONFIG.GAS_URL, { method: 'POST', body: JSON.stringify({ action: 'UPLOAD_LAYOUT', payload: payloadData }) });
            const resJson = await res.json();
            if(resJson.status === 'success') { 
                window.plottingApp.showToast('Blueprint berhasil diintegrasikan ke Sistem.', 'success');
                setTimeout(() => window.location.reload(), 1500); 
            } else throw new Error(resJson.message);
        } catch(err) { 
            window.plottingApp.showToast('Kegagalan Integrasi: ' + err.message, 'error'); 
        } finally { 
            btnText.innerText = "Simpan Layout"; btnLoader.classList.add('hidden'); btnSubmit.disabled = false; 
        }
    });
}