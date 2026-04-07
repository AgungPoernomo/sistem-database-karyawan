// src/pages/dashboardController.js

import { renderSidebar, renderHeader, initThemeAndLogout } from '../layouts/AppLayout.js';
// PERHATIKAN: Kita memanggil 4 modul baru di bawah ini, bukan lagi DashboardMetrics.js
import { renderTopModules } from '../components/dashboard/TopModules.js';
import { renderStatsCards } from '../components/dashboard/StatsCards.js';
import { renderDataTable } from '../components/dashboard/DataTable.js';
import { initModalEngine } from '../components/dashboard/ModalEngine.js';
import { EmployeeService } from '../services/employeeService.js';

document.addEventListener('DOMContentLoaded', async () => {
    
    // 1. PROTEKSI SESI
    const sessionToken = sessionStorage.getItem('nexus_auth_token');
    const savedUserId = localStorage.getItem('nexus_user');

    if (!sessionToken || !savedUserId) {
        window.location.replace('/'); 
        return; 
    }
    
    const uppercaseUserId = savedUserId.toUpperCase();
    const isSuperAdmin = uppercaseUserId === 'SUPERADMIN';
    
    let adminRoleDept = null;
    if (!isSuperAdmin && uppercaseUserId.includes("ADMIN ")) {
        adminRoleDept = uppercaseUserId.replace("ADMIN ", "").trim();
    }

    // 2. RENDER KERANGKA SPASIAL
    renderSidebar('app-sidebar', savedUserId, adminRoleDept);
    renderHeader('app-header');
    initThemeAndLogout();

    // 3. INIT ENGINE MODAL & PEMUATAN DATA
    const tableContainer = document.getElementById('tableContainer');
    tableContainer.innerHTML = `<div class="flex-1 flex flex-col items-center justify-center text-cyan-600 dark:text-cyan-400 font-mono text-xs font-bold tracking-[0.2em] uppercase animate-pulse"><span class="w-8 h-8 border-t-2 border-cyan-500 rounded-full animate-spin mb-4 shadow-[0_0_10px_#0ea5e9]"></span>Sinkronisasi Data...</div>`;

    try {
        const allData = await EmployeeService.getAllEmployees();
        let processedData = [];

        if (isSuperAdmin) {
            processedData = allData;
        } else if (adminRoleDept) {
            processedData = allData.filter(row => String(row[5] || '').toUpperCase().includes(adminRoleDept));
        }
        
        // Panggil pabrik-pabrik modul kecil
        initModalEngine('app-modal', processedData);
        renderTopModules('topModulesContainer', adminRoleDept);
        renderStatsCards('widgetContainer', processedData);
        renderDataTable('tableContainer', processedData);

    } catch (error) {
        tableContainer.innerHTML = `<div class="text-rose-600 flex flex-col items-center justify-center h-full"><h4 class="font-bold text-lg font-mono uppercase tracking-widest">Sistem Terputus</h4><p class="text-xs mt-2 font-mono">${error.message}</p></div>`;
    }
});