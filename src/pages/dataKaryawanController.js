// src/pages/dataKaryawanController.js

import { APP_CONFIG } from '../config/api.js';
import { renderSidebar, renderHeader, initThemeAndLogout } from '../layouts/AppLayout.js';
import { initEmployeeModals } from '../components/dataKaryawan/EmployeeModal.js';
import { renderDataTable } from '../components/dataKaryawan/DataTable.js'; // IMPORT KOMPONEN TABEL BARU
import { EmployeeService } from '../services/employeeService.js';

document.addEventListener('DOMContentLoaded', async () => {
    
    // 1. PROTEKSI SESI
    const sessionToken = sessionStorage.getItem('nexus_auth_token');
    const savedUserId = localStorage.getItem('nexus_user');
    if (!sessionToken) { window.location.replace('/'); return; }

    const uppercaseUserId = savedUserId.toUpperCase();
    const isSuperAdmin = uppercaseUserId === 'SUPERADMIN';
    let adminRoleDept = null;
    if (!isSuperAdmin && uppercaseUserId.includes("ADMIN ")) {
        adminRoleDept = uppercaseUserId.replace("ADMIN ", "").trim();
    }

    // 2. RENDER KERANGKA SPASIAL UTAMA
    renderSidebar('app-sidebar', savedUserId, adminRoleDept);
    renderHeader('app-header');
    initThemeAndLogout();

    const headerTitle = document.querySelector('#app-header h2');
    const headerSub = document.querySelector('#app-header p');
    if(headerTitle) headerTitle.innerText = "DATABASE PERSONIL SATORIA";
    if(headerSub) headerSub.innerText = "Manajemen & Tata Kelola Identitas Node";

    // 3. FITUR TOAST WEB3
    window.dataKaryawanApp = {
        showToast: function(message, type = 'success') {
            const toast = document.getElementById('customToast');
            const icon = document.getElementById('toastIcon');
            const msg = document.getElementById('toastMessage');
            msg.innerText = message;
            
            toast.classList.remove('border-emerald-500', 'border-rose-500', 'border-amber-500');
            icon.classList.remove('bg-emerald-500/20', 'text-emerald-500', 'bg-rose-500/20', 'text-rose-500', 'bg-amber-500/20', 'text-amber-500');
            
            if(type === 'success') {
                toast.classList.add('border-emerald-500'); 
                icon.classList.add('bg-emerald-500/20', 'text-emerald-500');
                icon.innerHTML = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>`;
            } else if (type === 'error') {
                toast.classList.add('border-rose-500'); 
                icon.classList.add('bg-rose-500/20', 'text-rose-500');
                icon.innerHTML = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>`;
            }
            toast.classList.remove('translate-x-[120%]', 'opacity-0');
            setTimeout(() => this.closeToast(), 4000);
        },
        closeToast: function() { document.getElementById('customToast').classList.add('translate-x-[120%]', 'opacity-0'); }
    };

    // INISIALISASI MODAL ENGINE
    initEmployeeModals('app-modal', { savedUserId, onSuccess: initSystem });

    // DEKLARASI ELEMEN UI & CACHE
    const tableContainer = document.getElementById('tableContainer');
    const filterBadge = document.getElementById('filterBadge');
    const rowCount = document.getElementById('rowCount');
    const searchInput = document.getElementById('searchInput');
    const resetFilterBtn = document.getElementById('resetFilterBtn');
    
    const fDept = document.getElementById('filterDept');
    const fGender = document.getElementById('filterGender');
    const fPlant = document.getElementById('filterPlant');
    const fGroup = document.getElementById('filterGroup');
    const fArea = document.getElementById('filterArea');
    const fZone = document.getElementById('filterZone');

    let allDataCache = []; 
    let filteredDataCache = []; 
    let masterOptions = {};

    const urlParams = new URLSearchParams(window.location.search);
    const urlDept = urlParams.get('dept'); 

    // 4. LOAD DATA VIA SERVICE
    async function initSystem() {
        tableContainer.innerHTML = `<div class="p-8 h-full flex flex-col items-center justify-center text-cyan-600 dark:text-cyan-400 font-mono text-xs tracking-widest font-black uppercase animate-pulse"><span class="w-8 h-8 border-t-2 border-cyan-500 rounded-full animate-spin mb-4 shadow-[0_0_10px_#0ea5e9]"></span>Sinkronisasi Database...</div>`;
        try {
            const resData = await EmployeeService.getAllEmployees();
            const resMasterFetch = await fetch(APP_CONFIG.GAS_URL, { method: 'POST', body: JSON.stringify({ action: 'GET_MASTER' }) });
            const resMaster = await resMasterFetch.json();
            
            if (resMaster.status === 'success') {
                allDataCache = resData || [];
                masterOptions = resMaster.data || {};
                
                window.dataKaryawanApp.populateDropdowns(masterOptions);
                populateFilterDropdowns();
                applyFilters(); 
            } else throw new Error("Gagal mengambil integritas data master.");
        } catch (error) {
            tableContainer.innerHTML = `<div class="text-rose-600 flex justify-center items-center h-full font-mono uppercase tracking-widest text-xs font-bold">SYSTEM ERROR: ${error.message}</div>`;
        }
    }

    function populateFilterDropdowns() {        
        const fillFilter = (selectElement, dataArray, defaultText) => {
            if(!selectElement) return;
            selectElement.innerHTML = `<option value="Semua">${defaultText}</option>`;
            dataArray.forEach(item => { selectElement.innerHTML += `<option value="${item}">${item}</option>`; });
        };

        fillFilter(fGender, masterOptions['GENDER'] || [], 'GENDER (ALL)');
        fillFilter(fPlant, masterOptions['PLANT'] || [], 'PLANT (ALL)');
        fillFilter(fGroup, masterOptions['GROUP'] || [], 'GRUP (ALL)');
        fillFilter(fArea, masterOptions['AREA'] || [], 'AREA (ALL)');
        fillFilter(fZone, masterOptions['ZONE'] || [], 'ZONE (ALL)');
        
        if(fDept) {
            const deptMaster = masterOptions['DEPARTEMENT'] || masterOptions['DEPARTEMEN'] || [];
            fDept.innerHTML = '<option value="Semua">DEPT (ALL)</option>';
            deptMaster.forEach(d => {
                const isSelected = (urlDept && d.toLowerCase().includes(urlDept.toLowerCase()) && urlDept.toLowerCase() !== 'other') ? 'selected' : '';
                fDept.innerHTML += `<option value="${d}" ${isSelected}>${d}</option>`;
            });
            const isOtherSelected = (urlDept && urlDept.toLowerCase() === 'other') ? 'selected' : '';
            fDept.innerHTML += `<option value="Other" ${isOtherSelected}>DEPT (LAINNYA)</option>`;
        }
    }

    // 5. FILTER DATA
    function applyFilters() {
        let dataToRender = [...allDataCache];
        
        const valSearch = searchInput.value.toLowerCase().trim();
        const valDept = fDept ? fDept.value : 'Semua';
        const valGender = fGender ? fGender.value : 'Semua';
        const valPlant = fPlant ? fPlant.value : 'Semua';
        const valGroup = fGroup ? fGroup.value : 'Semua';
        const valArea = fArea ? fArea.value : 'Semua';
        const valZone = fZone ? fZone.value : 'Semua';

        let activeFilterCount = 0;

        dataToRender = dataToRender.filter(row => {
            const idKaryawan = String(row[1] || '').toLowerCase();
            const nama = String(row[2] || '').toLowerCase();
            const gender = String(row[3] || '');
            const plant = String(row[4] || '');
            const dept = String(row[5] || '').toLowerCase();
            const area = String(row[6] || '');
            const group = String(row[7] || '');
            const zone = String(row[8] || '');

            let isMatch = true;

            if (valSearch && !(idKaryawan.includes(valSearch) || nama.includes(valSearch))) isMatch = false;
            if (valGender !== 'Semua' && gender !== valGender) isMatch = false;
            if (valPlant !== 'Semua' && plant !== valPlant) isMatch = false;
            if (valGroup !== 'Semua' && group !== valGroup) isMatch = false;
            if (valArea !== 'Semua' && area !== valArea) isMatch = false;
            if (valZone !== 'Semua' && zone !== valZone) isMatch = false;

            if (valDept !== 'Semua') {
                if (valDept === 'Other') {
                    if (dept.includes('produksi') || dept.includes('mechanical') || dept.includes('utility') || dept.includes('qa') || dept.includes('qc')) isMatch = false;
                } else {
                    if (!dept.includes(valDept.toLowerCase())) isMatch = false;
                }
            }

            if (!isSuperAdmin && adminRoleDept) {
                if (!dept.includes(adminRoleDept.toLowerCase())) isMatch = false;
            }

            return isMatch;
        });

        [valDept, valGender, valPlant, valGroup, valArea, valZone].forEach(v => {
            if (v !== 'Semua') activeFilterCount++;
        });

        if (activeFilterCount > 0 || valSearch !== '') {
            filterBadge.classList.remove('hidden'); filterBadge.classList.add('inline-flex');
            filterBadge.innerText = `${activeFilterCount + (valSearch ? 1 : 0)} FILTER AKTIF`;
            resetFilterBtn?.classList.remove('hidden');
        } else {
            filterBadge.classList.add('hidden'); filterBadge.classList.remove('inline-flex');
            resetFilterBtn?.classList.add('hidden');
        }

        filteredDataCache = dataToRender;
        rowCount.innerText = filteredDataCache.length.toLocaleString();
        
        // PANGGIL KOMPONEN RENDER TABEL EKSTERNAL
        renderDataTable('tableContainer', filteredDataCache);
    }

    searchInput.addEventListener('input', applyFilters);
    [fDept, fGender, fPlant, fGroup, fArea, fZone].forEach(el => {
        if(el) el.addEventListener('change', applyFilters);
    });

    resetFilterBtn?.addEventListener('click', () => {
        searchInput.value = '';
        [fDept, fGender, fPlant, fGroup, fArea, fZone].forEach(el => { if(el) el.value = 'Semua'; });
        applyFilters();
    });

    // 6. EVENT DELEGATION UNTUK TOMBOL TABEL KE MODAL ENGINE
    document.getElementById('openAddModalBtn')?.addEventListener('click', () => {
        window.dataKaryawanApp.openModal('CREATE');
    });

    tableContainer.addEventListener('click', (e) => {
        const editBtn = e.target.closest('.btn-edit');
        if (editBtn) {
            const targetRow = editBtn.getAttribute('data-row');
            const rowData = allDataCache.find(r => String(r[0]) === targetRow);
            if(rowData) window.dataKaryawanApp.openModal('UPDATE', rowData); 
            return; 
        }

        const deleteBtn = e.target.closest('.btn-delete');
        if (deleteBtn) {
            const targetRow = deleteBtn.getAttribute('data-row');
            const targetNama = deleteBtn.getAttribute('data-nama');
            window.dataKaryawanApp.openDeleteModal(targetRow, targetNama);
        }
    });

    initSystem();
});