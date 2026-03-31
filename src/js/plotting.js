import { APP_CONFIG } from '../config/api.js';

document.addEventListener('DOMContentLoaded', () => {
    const sessionToken = sessionStorage.getItem('nexus_auth_token');
    const savedUserId = localStorage.getItem('nexus_user');
    if (!sessionToken) { window.location.replace('/'); return; }

    const isSuperAdmin = savedUserId === 'SUPERADMIN';
    if (isSuperAdmin) document.getElementById('btnAdminUpload').classList.remove('hidden');

    let allDataCache = []; 
    let masterOptions = {}; 
    let dictLine = {}; 
    let dictArea = {};

    const picContainer = document.getElementById('picContainer');
    const selectPlant = document.getElementById('selectPlant');
    const selectArea = document.getElementById('selectArea');
    const imgPlant = document.getElementById('imgPlant');
    const imgArea = document.getElementById('imgArea');

    // ==========================================
    // 1. LOGIKA ZOOM SLIDER
    // ==========================================
    const zoomSliderLine = document.getElementById('zoomSliderLine');
    const zoomSliderArea = document.getElementById('zoomSliderArea');
    const zoomTextLine = document.getElementById('zoomTextLine');
    const zoomTextArea = document.getElementById('zoomTextArea');

    function applyZoom(sliderValue, imgElement, textElement) {
        const val = parseInt(sliderValue);
        let widthPercent = 100; 
        if (val < 0) widthPercent = 100 + (val * 0.8);
        else if (val > 0) widthPercent = 100 + (val * 3);
        
        imgElement.style.width = widthPercent + '%';
        textElement.innerText = (val > 0 ? '+' : '') + val + '%';
    }

    zoomSliderLine.addEventListener('input', (e) => applyZoom(e.target.value, imgPlant, zoomTextLine));
    zoomSliderArea.addEventListener('input', (e) => applyZoom(e.target.value, imgArea, zoomTextArea));

    function getDirectDriveLink(gdriveUrl) {
        if (!gdriveUrl || gdriveUrl === "-" || gdriveUrl.includes("Upload_Error")) return null;
        const match = gdriveUrl.match(/\/d\/([a-zA-Z0-9-_]+)/); 
        if (match && match[1]) return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w2000`;
        return null;
    }

    // ==========================================
    // 2. INISIALISASI DATA
    // ==========================================
    async function initSystem() {
        picContainer.innerHTML = `<tr><td colspan="9" class="p-8 text-center text-violet-400 font-mono text-xs animate-pulse">Memuat data dari server...</td></tr>`;
        try {
            const [resData, resMaster, resLayout] = await Promise.all([
                fetch(APP_CONFIG.GAS_URL, { method: 'POST', body: JSON.stringify({ action: 'READ' }) }).then(r => r.json()),
                fetch(APP_CONFIG.GAS_URL, { method: 'POST', body: JSON.stringify({ action: 'GET_MASTER' }) }).then(r => r.json()),
                fetch(APP_CONFIG.GAS_URL, { method: 'POST', body: JSON.stringify({ action: 'GET_LAYOUTS' }) }).then(r => r.json())
            ]);

            allDataCache = resData.data || [];
            masterOptions = resMaster.data || {};
            
            if(resLayout.data) {
                if(resLayout.data.lines) resLayout.data.lines.forEach(r => { if(r[0]) dictLine[String(r[0]).trim().toUpperCase()] = r[2]; });
                if(resLayout.data.areas) resLayout.data.areas.forEach(r => { 
                    if(r[0] && r[1]) dictArea[`${String(r[0]).trim().toUpperCase()}_${String(r[1]).trim().toUpperCase()}`] = r[3]; 
                });
            }

            setupUIMain();
            if(isSuperAdmin) setupAdminPanel();
            setupSearchSystem();

            picContainer.innerHTML = `<tr><td colspan="9" class="p-8 text-center text-slate-500 text-[10px] font-mono uppercase tracking-widest">Sistem siap digunakan.<br>Silakan pilih Line & Area.</td></tr>`;
        } catch (error) {
            picContainer.innerHTML = `<tr><td colspan="9" class="p-8 text-center text-rose-500 font-mono">${error.message}</td></tr>`;
        }
    }

    function setupUIMain() {
        const plants = masterOptions['PLANT'] || [];
        selectPlant.innerHTML = '<option value="" class="bg-slate-900">-- Pilih Line --</option>';
        plants.forEach(p => { selectPlant.innerHTML += `<option value="${p}" class="bg-slate-900">${p}</option>`; });
    }

    // ==========================================
    // 3. FUNGSI PEMUATAN LOKASI
    // ==========================================
    function loadLine(selectedPlant) {
        if (!selectedPlant) {
            selectArea.disabled = true; imgPlant.src = "https://placehold.co/1200x800/ffffff/e2e8f0?text=MENUNGGU+PILIHAN"; 
            imgPlant.classList.add('opacity-30'); renderPIC([]); return;
        }

        const directLinkLine = getDirectDriveLink(dictLine[selectedPlant]);
        imgPlant.src = directLinkLine || `https://placehold.co/1200x800/ffffff/e2e8f0?text=LAYOUT+TIDAK+TERSEDIA:\\n${selectedPlant}`;
        imgPlant.classList.remove('opacity-30');
        zoomSliderLine.value = 0; applyZoom(0, imgPlant, zoomTextLine); 

        const areas = masterOptions['AREA'] || [];
        selectArea.innerHTML = '<option value="" class="bg-slate-900">-- Semua Area di ' + selectedPlant + ' --</option>';
        areas.forEach(a => { selectArea.innerHTML += `<option value="${a}" class="bg-slate-900">${a}</option>`; });
        selectArea.disabled = false; selectArea.classList.remove('opacity-50', 'cursor-not-allowed');

        const lineData = allDataCache.filter(row => String(row[4] || '').trim().toUpperCase() === selectedPlant);
        updateFullStats(lineData, []);
        renderPIC(lineData); 
    }

    function loadArea(selectedPlant, selectedArea) {
        const lineData = allDataCache.filter(row => String(row[4] || '').trim().toUpperCase() === selectedPlant);

        if (!selectedArea) {
            imgArea.src = "https://placehold.co/800x600/ffffff/e2e8f0?text=PILIH+AREA"; imgArea.classList.add('opacity-30');
            updateFullStats(lineData, []); renderPIC(lineData); return;
        }

        const dictKey = `${selectedArea}_${selectedPlant}`;
        const directLinkArea = getDirectDriveLink(dictArea[dictKey]);
        
        imgArea.src = directLinkArea || `https://placehold.co/800x600/ffffff/e2e8f0?text=LAYOUT+TIDAK+TERSEDIA:\\n${dictKey}`;
        imgArea.classList.remove('opacity-30');
        zoomSliderArea.value = 0; applyZoom(0, imgArea, zoomTextArea); 

        const areaData = lineData.filter(row => String(row[6] || '').trim().toUpperCase() === selectedArea);
        updateFullStats(lineData, areaData);
        renderPIC(areaData);
    }

    selectPlant.addEventListener('change', (e) => loadLine(e.target.value.trim().toUpperCase()));
    selectArea.addEventListener('change', (e) => loadArea(selectPlant.value.trim().toUpperCase(), e.target.value.trim().toUpperCase()));

    // ==========================================
    // 4. STATISTIK AKURAT
    // ==========================================
    function updateFullStats(lineData, areaData) {
        let pria = 0, wanita = 0; 
        let depts = { PRODUKSI:0, MECHANICAL:0, ELECTRICAL:0, UTILITY:0, QA:0, QC:0, CLEANING:0, OTHER:0 };
        
        lineData.forEach(row => {
            const g = String(row[3] || '').trim().toUpperCase();
            if (g === 'P' || g === 'PEREMPUAN' || g === 'WANITA' || g.includes('WANITA') || g.includes('PEREMPUAN')) wanita++;
            else pria++; 
            
            const d = String(row[5] || '').trim().toUpperCase();
            if(d.includes('PRODUKSI')) depts.PRODUKSI++; else if(d.includes('MECHANICAL') || d === 'ME') depts.MECHANICAL++; else if(d.includes('ELECTRICAL') || d === 'EL') depts.ELECTRICAL++; else if(d.includes('UTILITY') || d === 'UT') depts.UTILITY++; else if(d.includes('QA')) depts.QA++; else if(d.includes('QC')) depts.QC++; else if(d.includes('CLEANING') || d.includes('CLEAN')) depts.CLEANING++; else depts.OTHER++;
        });

        document.getElementById('statLinePria').innerText = pria; document.getElementById('statLineWanita').innerText = wanita; document.getElementById('statLineTotal').innerText = lineData.length;
        document.getElementById('statDeptPro').innerText = depts.PRODUKSI; document.getElementById('statDeptMe').innerText = depts.MECHANICAL; document.getElementById('statDeptEl').innerText = depts.ELECTRICAL; document.getElementById('statDeptUt').innerText = depts.UTILITY; document.getElementById('statDeptQa').innerText = depts.QA; document.getElementById('statDeptQc').innerText = depts.QC; document.getElementById('statDeptCln').innerText = depts.CLEANING; document.getElementById('statDeptOth').innerText = depts.OTHER;

        let zones = new Set(); let groups = { A:0, B:0, C:0, D:0, NS:0 };
        
        areaData.forEach(row => {
            const z = String(row[8] || '').trim(); if (z && z !== '-') zones.add(z);
            const gr = String(row[7] || '').trim().toUpperCase().replace(/(GROUP|GR\.|GR\s|-)/g, '').trim();
            if(gr === 'A') groups.A++; else if(gr === 'B') groups.B++; else if(gr === 'C') groups.C++; else if(gr === 'D') groups.D++; else groups.NS++;
        });

        document.getElementById('statAreaZone').innerText = zones.size; document.getElementById('statAreaTotal').innerText = areaData.length;
        document.getElementById('statGrpA').innerText = groups.A; document.getElementById('statGrpB').innerText = groups.B; document.getElementById('statGrpC').innerText = groups.C; document.getElementById('statGrpD').innerText = groups.D; document.getElementById('statGrpNs').innerText = groups.NS;
    }

    // ==========================================
    // 5. RENDER TABEL PIC
    // ==========================================
    function renderPIC(data) {
        if (data.length === 0) {
            picContainer.innerHTML = `<tr><td colspan="9" class="p-8 text-center text-slate-600 font-mono text-[10px] uppercase tracking-widest italic">Tidak ada personil di area pilihan.</td></tr>`; return;
        }
        
        let html = '';
        data.forEach(row => {
            const id = row[1] || '-'; const nama = row[2] || '-'; const gender = row[3] || '-';
            const dept = row[5] || '-'; const area = row[6] || '-'; const grp = row[7] || '-'; const zone = row[8] || '-';
            
            let kodePloting = row[12];
            if(!kodePloting || kodePloting === "-") {
                let kLine = (row[4] === "LINE 1") ? "L1" : (row[4] === "LINE 2") ? "L2" : (row[4] === "LINE 3") ? "L3" : (row[4] === "LINE 4") ? "L4" : "LX";
                let kDept = {"PRODUKSI":"DPT-PRO", "MECHANICAL":"DPT-ME", "ELECTRICAL":"DPT-EL", "UTILITY":"DPT-UT", "QA":"DPT-QA", "QC":"DPT-QC"}[String(dept).toUpperCase()] || "DPT-X";
                let kID = String(id).replace(/\D/g, '').slice(-6).padStart(6, '0');
                let kArea = ({"MIXING":"MW", "PREFORM":"PF", "BLOWING":"BL", "PACKAGING":"P", "UTILITY":"UT"}[String(area).toUpperCase()] || "X") + "-" + String(zone).toUpperCase();
                kodePloting = `${kLine}/${kDept}/${kID}/${kArea}`;
            }

            const base64 = row[11] || '';
            const fotoSrc = (base64 && base64 !== "-") ? `data:image/jpeg;base64,${base64}` : `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%231e293b'/><text x='50' y='50' font-family='sans-serif' font-size='40' font-weight='bold' fill='%2334d399' text-anchor='middle' dominant-baseline='central'>${nama.charAt(0).toUpperCase()}</text></svg>`;
            const genderColor = (String(gender).toUpperCase().startsWith('P') || String(gender).toUpperCase().includes('WANITA')) ? 'text-pink-400' : 'text-cyan-400';

            html += `
                <tr id="row-${id}" class="hover:bg-slate-800/60 border-b border-slate-800/50 transition-colors">
                    <td class="p-2 flex justify-center"><img src="${fotoSrc}" class="w-8 h-8 rounded object-cover border border-slate-700"></td>
                    <td class="p-2 font-bold text-white">${id}</td>
                    <td class="p-2 text-slate-300 truncate max-w-[120px]">${nama}</td>
                    <td class="p-2 font-bold text-center ${genderColor}">${gender}</td>
                    <td class="p-2 text-slate-400">${dept}</td>
                    <td class="p-2 text-slate-400">${area}</td>
                    <td class="p-2 text-center text-slate-300">${grp}</td>
                    <td class="p-2 text-center text-fuchsia-400 font-bold">${zone}</td>
                    <td class="p-2"><span class="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded font-bold">${kodePloting}</span></td>
                </tr>`;
        });
        picContainer.innerHTML = html;
    }

    // ==========================================
    // 6. SISTEM PENCARIAN GLOBAL
    // ==========================================
    function setupSearchSystem() {
        const searchModal = document.getElementById('searchModal');
        const searchInput = document.getElementById('searchInput');
        
        document.getElementById('btnSearch').addEventListener('click', () => {
            searchModal.classList.replace('hidden', 'flex');
            setTimeout(() => searchModal.classList.replace('opacity-0', 'opacity-100'), 10);
            searchInput.focus();
        });

        const closeSearch = () => {
            searchModal.classList.replace('opacity-100', 'opacity-0');
            setTimeout(() => searchModal.classList.replace('flex', 'hidden'), 300);
            searchInput.value = '';
        };

        document.getElementById('closeSearchBtn').addEventListener('click', closeSearch);
        document.getElementById('searchOverlay').addEventListener('click', closeSearch);

        document.getElementById('searchForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const term = searchInput.value.trim().toLowerCase();
            if (!term) return;

            const targetPIC = allDataCache.find(row => String(row[1]).toLowerCase().includes(term) || String(row[2]).toLowerCase().includes(term));
            
            if (targetPIC) {
                const targetLine = String(targetPIC[4]).trim().toUpperCase();
                const targetArea = String(targetPIC[6]).trim().toUpperCase();

                selectPlant.value = targetLine;
                loadLine(targetLine);
                
                selectArea.value = targetArea; 
                loadArea(targetLine, targetArea);

                closeSearch();

                setTimeout(() => {
                    const rowElement = document.getElementById(`row-${targetPIC[1]}`);
                    if (rowElement) {
                        rowElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        rowElement.classList.add('bg-emerald-900/60', 'border-emerald-400');
                        setTimeout(() => rowElement.classList.remove('bg-emerald-900/60', 'border-emerald-400'), 3000);
                    }
                }, 500);
            } else {
                window.showToast(`Personil "${term}" tidak ditemukan di area manapun.`, 'warning');
            }
        });
    }

    // ==========================================
    // 7. UPLOAD LAYOUT SUPERADMIN (DENGAN TOAST & LOADER)
    // ==========================================
    function setupAdminPanel() {
        const adminModal = document.getElementById('adminModal');
        masterOptions['PLANT'].forEach(p => { document.getElementById('layoutPlant').innerHTML += `<option value="${p}">${p}</option>`; });
        masterOptions['AREA'].forEach(a => { document.getElementById('layoutAreaSelect').innerHTML += `<option value="${a}">${a}</option>`; });
        document.getElementById('layoutType').addEventListener('change', (e) => { document.getElementById('divLayoutArea').classList.toggle('hidden', e.target.value === 'LINE'); });
        document.getElementById('btnAdminUpload').addEventListener('click', () => { adminModal.classList.replace('hidden', 'flex'); setTimeout(() => adminModal.classList.replace('opacity-0', 'opacity-100'), 10); });
        document.getElementById('adminOverlay').addEventListener('click', () => adminModal.classList.add('hidden'));
        
        let base64Layout = ""; let fileNameLayout = "";
        
        // Menampilkan nama file yang dipilih
        document.getElementById('formLayoutImage').addEventListener('change', function(e) {
            const file = e.target.files[0];
            const display = document.getElementById('layoutFileName');
            if(file) {
                const reader = new FileReader();
                reader.onload = function(event) { 
                    base64Layout = event.target.result.split(',')[1]; 
                    fileNameLayout = file.name; 
                    display.innerText = "File Siap: " + file.name;
                    display.classList.remove('hidden');
                };
                reader.readAsDataURL(file);
            }
        });

        document.getElementById('uploadLayoutForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            if(!base64Layout) { window.showToast('Silakan pilih file gambar terlebih dahulu.', 'warning'); return; }
            
            const btnSubmit = document.getElementById('btnSubmitLayout');
            const btnText = document.getElementById('btnText');
            const btnLoader = document.getElementById('btnLoader');
            
            // Efek Loading pada Tombol
            btnText.innerText = "Menyimpan..."; 
            btnLoader.classList.remove('hidden');
            btnSubmit.disabled = true;

            const payloadData = {
                tipe: document.getElementById('layoutType').value,
                plant: document.getElementById('layoutPlant').value,
                area: document.getElementById('layoutType').value === 'AREA' ? document.getElementById('layoutAreaSelect').value : '',
                base64: base64Layout, fileName: fileNameLayout
            };

            try {
                const res = await fetch(APP_CONFIG.GAS_URL, { method: 'POST', body: JSON.stringify({ action: 'UPLOAD_LAYOUT', payload: payloadData }) });
                const resJson = await res.json();
                if(resJson.status === 'success') { 
                    window.showToast('Layout berhasil diunggah ke server!', 'success');
                    setTimeout(() => window.location.reload(), 1500); 
                } else throw new Error(resJson.message);
            } catch(err) { 
                window.showToast('Gagal: ' + err.message, 'error'); 
            } finally { 
                btnText.innerText = "Simpan Layout"; 
                btnLoader.classList.add('hidden');
                btnSubmit.disabled = false; 
            }
        });
    }

    initSystem();
});