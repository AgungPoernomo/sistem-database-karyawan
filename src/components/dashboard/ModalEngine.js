// src/components/dashboard/ModalEngine.js

export function initModalEngine(containerId, rawEmployeeData) {
    const modalContainer = document.getElementById(containerId);
    
    modalContainer.innerHTML = `
        <div id="masterModal" class="hidden fixed inset-0 z-[60] flex items-center justify-center opacity-0 transition-opacity duration-500">
            <div class="absolute inset-0 modal-overlay cursor-pointer" onclick="window.dashboardApp.closeModal()"></div>
            <div class="relative modal-content w-full max-w-5xl max-h-[90vh] spatial-island rounded-[3rem] border-t border-t-cyan-400/50 flex flex-col overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.4)] transform scale-95">
                <div class="px-8 py-5 border-b border-white/50 dark:border-slate-800/80 bg-white/30 dark:bg-slate-900/30 flex justify-between items-center z-10 relative backdrop-blur-md">
                    <div class="flex items-center">
                        <div class="w-1.5 h-8 bg-cyan-500 rounded-full mr-4 shadow-[0_0_10px_#0ea5e9] animate-pulse"></div>
                        <h2 id="modalTitle" class="text-lg font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] font-mono drop-shadow-sm">Title</h2>
                    </div>
                    <button onclick="window.dashboardApp.closeModal()" class="p-2.5 bg-white/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-500/20 rounded-full transition-all border border-white/80 hover:border-rose-200 dark:border-transparent dark:hover:border-rose-500/30">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                <div id="modalBody" class="flex-1 overflow-y-auto custom-scrollbar flex flex-col lg:flex-row relative z-10"></div>
            </div>
        </div>
    `;

    const masterModal = document.getElementById('masterModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const modalContent = masterModal.querySelector('.modal-content');

    window.dashboardApp = {
        closeModal: function() { 
            masterModal.classList.add('opacity-0');
            modalContent.classList.add('scale-95');
            setTimeout(() => masterModal.classList.add('hidden'), 500);
        },
        
        openLineModal: function(lineName) {
            let filteredData = rawEmployeeData;
            if(lineName !== 'SEMUA LINE') {
                filteredData = rawEmployeeData.filter(row => {
                    const loc = String(row[4]||'').toUpperCase();
                    return loc.includes(lineName.toUpperCase());
                });
            }

            let depts = {}, groups = {}, genders = {L:0, P:0}, status = {Aktif:0, Inaktif:0};
            filteredData.forEach(row => {
                let d = String(row[5]||'Unknown').toUpperCase(); depts[d] = (depts[d]||0)+1;
                let g = String(row[7]||'NON').toUpperCase(); groups[g] = (groups[g]||0)+1;
                let gen = String(row[3]||'').toUpperCase();
                if(gen.startsWith('L') || gen==='PRIA') genders.L++; else genders.P++;
                let st = String(row[11]||'').toUpperCase();
                if(st.includes('TIDAK') || st.includes('INAKTIF')) status.Inaktif++; else status.Aktif++;
            });
            const tTotal = filteredData.length || 1;

            modalTitle.innerText = `Analisis Presisi Blueprint: ${lineName}`;
            modalBody.innerHTML = `
                <div class="w-full lg:w-[40%] bg-cyan-900/90 dark:bg-slate-900/90 p-8 flex flex-col items-center justify-center relative overflow-hidden">
                    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.15)_0%,transparent_70%)] pointer-events-none"></div>
                    <div class="text-center z-10 w-full">
                        <p class="text-cyan-300 font-mono text-[10px] font-bold tracking-[0.2em] uppercase mb-2">Kapasitas Node Aktual</p>
                        <h2 class="text-[5rem] font-black text-white font-mono mb-8 drop-shadow-[0_0_15px_rgba(14,165,233,0.5)]">${filteredData.length}</h2>
                        <div class="w-full mb-6">
                            <div class="flex justify-between text-[10px] font-bold font-mono mb-2 text-white uppercase tracking-widest">
                                <span class="text-blue-300">Pria (${genders.L})</span><span class="text-pink-300">Wanita (${genders.P})</span>
                            </div>
                            <div class="w-full h-2 bg-pink-500/50 rounded-full flex overflow-hidden shadow-inner">
                                <div class="h-full bg-blue-500 bar-animate shadow-[0_0_8px_#3b82f6]" style="width: ${(genders.L/tTotal)*100}%"></div>
                            </div>
                        </div>
                        <div class="w-full">
                            <div class="flex justify-between text-[10px] font-bold font-mono mb-2 text-white uppercase tracking-widest">
                                <span class="text-emerald-300">Karyawan Aktif (${status.Aktif})</span>
                            </div>
                            <div class="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden shadow-inner">
                                <div class="h-full bg-emerald-500 bar-animate shadow-[0_0_8px_#10b981]" style="width: ${(status.Aktif/tTotal)*100}%"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="w-full lg:w-[60%] p-8 overflow-y-auto bg-white/40 dark:bg-slate-950/40">
                    <h3 class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] border-b border-slate-200/50 dark:border-slate-800 pb-2 mb-4 font-mono">Komposisi Departemen di ${lineName}</h3>
                    <div class="space-y-3.5 mb-8">
                        ${Object.entries(depts).sort((a,b)=>b[1]-a[1]).map(([k,v]) => `
                            <div class="flex items-center justify-between text-xs font-mono font-bold">
                                <span class="text-slate-700 dark:text-cyan-100 truncate w-1/2">${k}</span>
                                <div class="flex-1 mx-4 h-1 bg-slate-200/50 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div class="h-full bg-cyan-500 bar-animate" style="width: ${(v/tTotal)*100}%"></div>
                                </div>
                                <span class="text-slate-900 dark:text-cyan-400 w-10 text-right">${v}</span>
                            </div>
                        `).join('')}
                    </div>
                    <h3 class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] border-b border-slate-200/50 dark:border-slate-800 pb-2 mb-4 font-mono">Distribusi Matrix Shift</h3>
                    <div class="grid grid-cols-4 gap-4">
                        ${['A','B','C','D'].map(g => `
                            <div class="bg-white/60 dark:bg-slate-900/60 p-4 rounded-2xl border border-white dark:border-slate-700/50 text-center shadow-sm">
                                <p class="text-[9px] text-slate-500 mb-1 font-bold tracking-widest font-mono">GRUP ${g}</p>
                                <p class="text-2xl font-black text-cyan-700 dark:text-white font-mono">${groups[g]||0}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            masterModal.classList.remove('hidden');
            setTimeout(() => { masterModal.classList.remove('opacity-0'); modalContent.classList.remove('scale-95'); }, 10);
        },

        openAreaModal: function() {
            let allAreasObj = {};
            rawEmployeeData.forEach(row => {
                const area = String(row[6] || 'Unassigned').toUpperCase();
                allAreasObj[area] = (allAreasObj[area] || 0) + 1;
            });
            const allAreasList = Object.keys(allAreasObj).sort();

            window.dashboardApp.renderAreaDetail = function(selectedArea) {
                const filtered = rawEmployeeData.filter(r => String(r[6]||'').toUpperCase() === selectedArea);
                const tTotal = filtered.length || 1;
                
                let lines = { "LINE 1":0, "LINE 2":0, "LINE 3":0, "LINE 4":0 };
                let genders = { L:0, P:0 };
                let groups = { A:0, B:0, C:0, D:0 };

                filtered.forEach(row => {
                    const loc = String(row[4]||'').toUpperCase();
                    if(loc.includes('LINE 1')) lines["LINE 1"]++;
                    else if(loc.includes('LINE 2')) lines["LINE 2"]++;
                    else if(loc.includes('LINE 3')) lines["LINE 3"]++;
                    else if(loc.includes('LINE 4')) lines["LINE 4"]++;

                    const gen = String(row[3]||'').toUpperCase();
                    if(gen.startsWith('L') || gen==='PRIA') genders.L++; else genders.P++;

                    const grp = String(row[7]||'NON').toUpperCase();
                    if(['A','B','C','D'].includes(grp)) groups[grp]++;
                });

                document.getElementById('areaDetailCenter').innerHTML = `
                    <div class="w-full h-full bg-cyan-950/90 dark:bg-slate-900/90 rounded-[2rem] flex flex-col items-center justify-center p-6 relative overflow-hidden border border-cyan-500/30">
                        <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.15)_1px,transparent_1px)]" style="background-size: 20px 20px;"></div>
                        <h3 class="text-2xl font-black text-white font-mono text-center z-10 drop-shadow-[0_0_10px_#0ea5e9] mb-2 uppercase tracking-widest">${selectedArea}</h3>
                        <p class="text-cyan-300 font-mono text-[10px] tracking-[0.2em] font-bold z-10 mb-8">KAPASITAS AKTUAL: <span class="font-black text-white text-base ml-1">${filtered.length}</span></p>
                        <div class="w-full max-w-xs space-y-4 z-10">
                            ${['LINE 1','LINE 2','LINE 3','LINE 4'].map(l => `
                                <div class="flex items-center text-[10px] font-mono font-bold text-cyan-100 tracking-widest">
                                    <span class="w-16">${l}</span>
                                    <div class="flex-1 h-1.5 bg-slate-800 mx-3 rounded-full shadow-inner"><div class="h-full bg-cyan-400 bar-animate shadow-[0_0_8px_#22d3ee]" style="width: ${(lines[l]/tTotal)*100}%"></div></div>
                                    <span class="w-6 text-right">${lines[l]}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;

                document.getElementById('areaDetailRight').innerHTML = `
                    <h4 class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] mb-4 border-b border-white/50 dark:border-slate-700/50 pb-2 font-mono">Distribusi Grup & Gender</h4>
                    <div class="space-y-6 font-mono text-sm">
                        <div>
                            <div class="flex justify-between text-[10px] mb-2 font-bold uppercase tracking-widest dark:text-white"><span class="text-blue-500">Pria (${genders.L})</span><span class="text-pink-500">Wanita (${genders.P})</span></div>
                            <div class="w-full h-1.5 bg-pink-500/30 rounded-full flex overflow-hidden shadow-inner">
                                <div class="h-full bg-blue-500 bar-animate shadow-[0_0_5px_#3b82f6]" style="width: ${(genders.L/tTotal)*100}%"></div>
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-4 pt-4">
                            ${['A','B','C','D'].map(g => `
                                <div class="bg-white/60 dark:bg-slate-800/80 p-4 rounded-2xl border border-white dark:border-slate-700/50 text-center shadow-sm">
                                    <p class="text-[10px] text-slate-500 mb-1 font-bold tracking-widest">Grup ${g}</p>
                                    <p class="text-2xl font-black text-cyan-700 dark:text-white">${groups[g]}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            };

            modalTitle.innerText = "SEBARAN DATA KARYAWAN (ALL PLANT)";
            modalBody.innerHTML = `
                <div class="w-full p-8 grid grid-cols-12 gap-6 h-[70vh] bg-white/40 dark:bg-slate-950/40">
                    <div class="col-span-3 border-r border-white/50 dark:border-slate-800 pr-4 overflow-y-auto custom-scrollbar space-y-1.5">
                        <p class="text-[9px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-[0.2em] mb-4 sticky top-0 bg-white/80 dark:bg-[#030712]/80 backdrop-blur-md py-3 font-mono">Pilih Area</p>
                        ${allAreasList.map(a => `
                            <button onclick="window.dashboardApp.renderAreaDetail('${a}')" class="w-full text-left p-3.5 rounded-xl hover:bg-white dark:hover:bg-slate-800 text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300 transition-colors truncate focus:bg-cyan-50 dark:focus:bg-cyan-900/30 border border-transparent focus:border-cyan-300 shadow-sm" title="${a}">
                                ${a}
                            </button>
                        `).join('')}
                    </div>
                    <div class="col-span-5 h-full" id="areaDetailCenter"></div>
                    <div class="col-span-4 h-full bg-white/60 dark:bg-slate-900/50 rounded-[2rem] p-6 border border-white/80 dark:border-slate-700/50 overflow-y-auto shadow-sm" id="areaDetailRight"></div>
                </div>
            `;
            masterModal.classList.remove('hidden');
            setTimeout(() => { masterModal.classList.remove('opacity-0'); modalContent.classList.remove('scale-95'); }, 10);
            if(allAreasList.length > 0) window.dashboardApp.renderAreaDetail(allAreasList[0]);
        },

        openGroupModal: function() {
            let groupsData = { 'A': [], 'B': [], 'C': [], 'D': [] };
            rawEmployeeData.forEach(row => {
                const grp = String(row[7]||'').toUpperCase();
                if(['A','B','C','D'].includes(grp)) groupsData[grp].push(row);
            });

            function buildRealGroupCard(gName, gData) {
                const gTotal = gData.length || 1;
                let lines = { "L1":0, "L2":0, "L3":0, "L4":0 };
                let genders = { L:0, P:0 };
                gData.forEach(r => {
                    const loc = String(r[4]||'').toUpperCase();
                    if(loc.includes('LINE 1')) lines["L1"]++;
                    else if(loc.includes('LINE 2')) lines["L2"]++;
                    else if(loc.includes('LINE 3')) lines["L3"]++;
                    else if(loc.includes('LINE 4')) lines["L4"]++;
                    
                    const gen = String(r[3]||'').toUpperCase();
                    if(gen.startsWith('L') || gen==='PRIA') genders.L++; else genders.P++;
                });

                return `
                    <div class="bg-white/60 dark:bg-slate-900/80 border border-white/80 dark:border-slate-700/50 p-6 rounded-[2rem] shadow-sm">
                        <div class="flex justify-between items-center mb-6 border-b border-white/50 dark:border-slate-800 pb-3">
                            <h4 class="text-xl font-black font-mono text-slate-800 dark:text-white">GRUP <span class="text-cyan-500">${gName}</span></h4>
                            <span class="text-xl font-black font-mono text-cyan-600 dark:text-cyan-400 bg-white dark:bg-cyan-900/30 px-3 py-1.5 rounded-xl border border-cyan-100 dark:border-transparent shadow-inner">${gData.length}</span>
                        </div>
                        <div class="space-y-5 font-mono text-[10px] font-bold uppercase tracking-widest">
                            <div>
                                <div class="flex justify-between mb-1.5 text-slate-500"><span>Line 1 & 2</span><span class="dark:text-white">${lines.L1 + lines.L2}</span></div>
                                <div class="w-full h-1 bg-slate-200/50 dark:bg-slate-800 rounded-full overflow-hidden"><div class="h-full bg-cyan-400 bar-animate" style="width: ${((lines.L1+lines.L2)/gTotal)*100}%"></div></div>
                            </div>
                            <div>
                                <div class="flex justify-between mb-1.5 text-slate-500"><span>Line 3 & 4</span><span class="dark:text-white">${lines.L3 + lines.L4}</span></div>
                                <div class="w-full h-1 bg-slate-200/50 dark:bg-slate-800 rounded-full overflow-hidden"><div class="h-full bg-cyan-400 bar-animate" style="width: ${((lines.L3+lines.L4)/gTotal)*100}%"></div></div>
                            </div>
                            <div class="pt-5 border-t border-white/50 dark:border-slate-800/50">
                                <div class="flex justify-between mb-1.5"><span class="text-blue-500">Laki: ${genders.L}</span><span class="text-pink-500">Wanita: ${genders.P}</span></div>
                                <div class="w-full h-1.5 bg-pink-500/30 rounded-full overflow-hidden flex"><div class="h-full bg-blue-500 bar-animate" style="width: ${(genders.L/gTotal)*100}%"></div></div>
                            </div>
                        </div>
                    </div>
                `;
            }

            modalTitle.innerText = "Distribusi Formasi Matriks Shift";
            modalBody.innerHTML = `
                <div class="w-full p-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 bg-white/40 dark:bg-transparent">
                    ${['A','B','C','D'].map(g => buildRealGroupCard(g, groupsData[g])).join('')}
                </div>
            `;
            masterModal.classList.remove('hidden');
            setTimeout(() => { masterModal.classList.remove('opacity-0'); modalContent.classList.remove('scale-95'); }, 10);
        }
    };
}