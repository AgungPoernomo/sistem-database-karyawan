// src/pages/plottingarea/mainPlottingOrchestrator.js

import { APP_CONFIG } from '../../config/api.js';
import { initLayout, initThemeAndLogout } from '../../layouts/AppLayout.js';
import { initPlottingModals } from '../../components/plotting/PlottingModals.js';
import { renderMachineView } from './plottingMachineController.js';

document.addEventListener('DOMContentLoaded', async () => {
    
    // 1. PROTEKSI SESI & IDENTIFIKASI
    const sessionToken = sessionStorage.getItem('nexus_auth_token');
    const savedUserId = localStorage.getItem('nexus_user');
    if (!sessionToken || !savedUserId) { window.location.replace('/'); return; }

    const uppercaseUserId = savedUserId.toUpperCase();
    const isSuperAdmin = uppercaseUserId === 'SUPERADMIN';
    let adminRoleDept = null;
    if (!isSuperAdmin && uppercaseUserId.includes("ADMIN ")) {
        adminRoleDept = uppercaseUserId.replace("ADMIN ", "").trim();
    }

    // 2. RENDER KERANGKA SPASIAL
    initLayout(savedUserId, adminRoleDept);
    initThemeAndLogout();

    const headerTitle = document.querySelector('#app-header h2');
    const headerSub = document.querySelector('#app-header p');
    if(headerTitle) headerTitle.innerText = "PLOTTING AREA";
    if(headerSub) headerSub.innerText = "Kordinator & PIC Area";

    if (isSuperAdmin) {
        const btnAdminUpload = document.getElementById('btnAdminUpload');
        if(btnAdminUpload) btnAdminUpload.classList.remove('hidden');
    }

    // 3. FITUR TOAST WEB3
    window.plottingApp = {
        showToast: function(message, type = 'success') {
            const toast = document.getElementById('customToast');
            const icon = document.getElementById('toastIcon');
            const msg = document.getElementById('toastMessage');
            msg.innerText = message;
            toast.classList.remove('border-emerald-500', 'border-rose-500', 'border-amber-500');
            icon.classList.remove('bg-emerald-500/20', 'text-emerald-500', 'bg-rose-500/20', 'text-rose-500', 'bg-amber-500/20', 'text-amber-500');
            if(type === 'success') { toast.classList.add('border-emerald-500'); icon.classList.add('bg-emerald-500/20', 'text-emerald-500'); icon.innerHTML = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>`; } 
            else { toast.classList.add('border-rose-500'); icon.classList.add('bg-rose-500/20', 'text-rose-500'); icon.innerHTML = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>`; }
            toast.classList.remove('translate-x-[120%]', 'opacity-0');
            setTimeout(() => this.closeToast(), 4000);
        },
        closeToast: function() { document.getElementById('customToast').classList.add('translate-x-[120%]', 'opacity-0'); }
    };

    // 4. SYSTEM STATE
    let allDataCache = []; let masterOptions = {}; let dictLine = {}; let dictArea = {};
    const selectPlant = document.getElementById('selectPlant');
    const selectArea = document.getElementById('selectArea');

    // 5. ZOOM CONTROLS
    function applyZoom(sliderValue, imgElement) {
        if(!imgElement) return;
        const val = parseInt(sliderValue);
        let widthPercent = 100; if (val < 0) widthPercent = 100 + (val * 0.8); else if (val > 0) widthPercent = 100 + (val * 3);
        imgElement.style.width = widthPercent + '%';
    }

    document.getElementById('zoomSliderLineM')?.addEventListener('input', (e) => applyZoom(e.target.value, document.getElementById('imgPlantM'), document.getElementById('zoomTextLineM')));
    document.getElementById('zoomSliderAreaM')?.addEventListener('input', (e) => applyZoom(e.target.value, document.getElementById('imgAreaM'), document.getElementById('zoomTextAreaM')));

    // 6. ORCHESTRATOR ROUTING
    function dispatchRender() {
        const plant = selectPlant.value.trim().toUpperCase();
        const area = selectArea.value.trim().toUpperCase();
        // HANYA MENGGUNAKAN SATU RENDERER YAITU MESIN
        renderMachineView(plant, area, allDataCache, dictLine, dictArea, getDirectDriveLink);
    }

    function getDirectDriveLink(gdriveUrl) {
        if (!gdriveUrl || gdriveUrl === "-" || gdriveUrl.includes("Upload_Error")) return null;
        const match = gdriveUrl.match(/\/d\/([a-zA-Z0-9-_]+)/); 
        if (match && match[1]) return `https://drive.google.com/uc?export=view&id=${match[1]}`;
        return null;
    }

    // 7. EVENT LISTENERS DROPDOWN
    selectPlant?.addEventListener('change', () => {
        const selectedPlant = selectPlant.value.trim().toUpperCase();
        if (!selectedPlant) { selectArea.disabled = true; selectArea.innerHTML = '<option value="">-- Menunggu Line --</option>'; } 
        else {
            const areas = masterOptions['AREA'] || [];
            selectArea.innerHTML = '<option value="">-- SEMUA AREA DI ' + selectedPlant + ' --</option>';
            areas.forEach(a => { selectArea.innerHTML += `<option value="${a}">${a}</option>`; });
            selectArea.disabled = false; selectArea.classList.remove('opacity-50', 'cursor-not-allowed');
        }
        dispatchRender();
    });

    selectArea?.addEventListener('change', () => dispatchRender());

    // 8. FETCH DATA INIT
    async function initSystem() {
        const tContainerM = document.getElementById('tableContainerM');
        if(tContainerM) tContainerM.innerHTML = `<div class="p-8 flex flex-col items-center justify-center text-cyan-600 font-mono text-xs font-bold animate-pulse tracking-widest"><span class="w-8 h-8 border-t-2 border-cyan-500 rounded-full animate-spin mb-4 shadow-[0_0_10px_#0ea5e9]"></span>SINKRONISASI DATA...</div>`;
        
        try {
            const [resData, resMaster, resLayout] = await Promise.all([
                fetch(APP_CONFIG.GAS_URL, { method: 'POST', body: JSON.stringify({ action: 'READ', payload: { userId: savedUserId } }) }).then(r => r.json()),
                fetch(APP_CONFIG.GAS_URL, { method: 'POST', body: JSON.stringify({ action: 'GET_MASTER' }) }).then(r => r.json()),
                fetch(APP_CONFIG.GAS_URL, { method: 'POST', body: JSON.stringify({ action: 'GET_LAYOUTS' }) }).then(r => r.json())
            ]);

            allDataCache = resData.data || [];
            masterOptions = resMaster.data || {};
            
            if(resLayout.data) {
                if(resLayout.data.lines) resLayout.data.lines.forEach(r => { if(r[0]) dictLine[String(r[0]).trim().toUpperCase()] = r[2]; });
                if(resLayout.data.areas) resLayout.data.areas.forEach(r => { if(r[0] && r[1]) dictArea[`${String(r[0]).trim().toUpperCase()}_${String(r[1]).trim().toUpperCase()}`] = r[3]; });
            }

            const plants = masterOptions['PLANT'] || [];
            if(selectPlant) {
                selectPlant.innerHTML = '<option value="">-- PILIH LINE --</option>';
                plants.forEach(p => { selectPlant.innerHTML += `<option value="${p}">${p}</option>`; });
            }

            initPlottingModals('app-modal', {
                allDataCache, masterOptions,
                onSearchFound: (targetPIC) => {
                    const targetLine = String(targetPIC[4]).trim().toUpperCase();
                    const targetArea = String(targetPIC[6]).trim().toUpperCase();

                    if(selectPlant) selectPlant.value = targetLine;
                    
                    const areas = masterOptions['AREA'] || [];
                    if(selectArea) {
                        selectArea.innerHTML = '<option value="">-- SEMUA AREA DI ' + targetLine + ' --</option>';
                        areas.forEach(a => { selectArea.innerHTML += `<option value="${a}">${a}</option>`; });
                        selectArea.disabled = false; selectArea.classList.remove('opacity-50', 'cursor-not-allowed');
                        selectArea.value = targetArea; 
                    }
                    dispatchRender(); 
                    window.plottingApp.showToast(`Node terdeteksi di Koordinat: ${targetLine} - ${targetArea}`, 'success');
                }
            });

            if(tContainerM) tContainerM.innerHTML = `<div class="flex h-full items-center justify-center"><p class="text-slate-400 font-mono tracking-[0.2em] text-[10px] uppercase font-bold bg-white/50 px-6 py-3 rounded-xl border border-white dark:border-slate-700/50">SIAP. SILAKAN PILIH LINE.</p></div>`;
        } catch (error) {
            if(tContainerM) tContainerM.innerHTML = `<div class="text-rose-500 font-mono font-bold text-xs uppercase p-8">GALAT: ${error.message}</div>`;
        }
    }

    initSystem();
});