import { APP_CONFIG } from '../config/api.js';

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. PROTEKSI SESI
    const sessionToken = sessionStorage.getItem('nexus_auth_token');
    const savedUserId = localStorage.getItem('nexus_user');

    if (!sessionToken || !savedUserId) {
        window.location.replace('/'); 
        return; 
    }
    document.getElementById('userNameDisplay').innerText = savedUserId;
    document.getElementById('userAvatar').innerText = savedUserId.charAt(0).toUpperCase();

    // 2. LOGOUT
    document.getElementById('logoutBtn')?.addEventListener('click', () => {
        if(confirm("Akhiri sesi dan putuskan koneksi dari Sistem Organisasi?")) {
            sessionStorage.clear(); localStorage.clear();
            window.location.replace('/');
        }
    });

    // 3. INISIALISASI VARIABEL GLOBAL
    const tableContainer = document.getElementById('tableContainer');
    let employeeDataCache = []; 

    // 4. LOAD DATA (Hanya untuk Analytic Dashboard)
    async function loadEmployeeData() {
        tableContainer.innerHTML = `<div class="p-8 h-full flex items-center justify-center text-cyan-400 font-mono animate-pulse">Menyelaraskan Database Pusat...</div>`;
        try {
            const response = await fetch(APP_CONFIG.GAS_URL, {
                method: 'POST', body: JSON.stringify({ action: 'READ' }) 
            });
            const result = await response.json();
            if (result.status === 'success') {
                employeeDataCache = result.data || [];
                updateWidgets(employeeDataCache);
                renderTable(employeeDataCache);
            } else throw new Error(result.message);
        } catch (error) {
            tableContainer.innerHTML = `<div class="text-rose-500 flex flex-col items-center justify-center h-full"><h4 class="font-bold font-mono text-lg tracking-widest uppercase">Koneksi Terputus</h4><p class="text-xs text-rose-400/80 mt-2 font-mono">${error.message}</p></div>`;
        }
    }

    // 5. UPDATE WIDGET & NAVIGASI
    function updateWidgets(data) {
        const counts = { aktif: data.length, produksi: 0, mechanical: 0, utility: 0, qa: 0, qc: 0, cleaning: 0, other: 0 };
        
        data.forEach(row => {
            const dept = String(row[5] || '').toLowerCase();
            if(dept.includes('produksi')) counts.produksi++;
            else if(dept.includes('mechanical')) counts.mechanical++;
            else if(dept.includes('utility')) counts.utility++;
            else if(dept.includes('qa')) counts.qa++;
            else if(dept.includes('qc')) counts.qc++;
            else if(dept.includes('cleaning')) counts.cleaning++;
            else counts.other++;
        });

        document.getElementById('count-aktif').innerText = counts.aktif.toLocaleString();
        document.getElementById('count-produksi').innerText = counts.produksi.toLocaleString();
        document.getElementById('count-mechanical').innerText = counts.mechanical.toLocaleString();
        document.getElementById('count-utility').innerText = counts.utility.toLocaleString();
        document.getElementById('count-qa').innerText = counts.qa.toLocaleString();
        document.getElementById('count-qc').innerText = counts.qc.toLocaleString();
        document.getElementById('count-cleaning').innerText = counts.cleaning.toLocaleString();
        document.getElementById('count-other').innerText = counts.other.toLocaleString();
    }

    // Shortcut widget ke halaman Data Karyawan
    const setupWidgetLink = (widgetId, deptName) => {
        document.getElementById(widgetId)?.addEventListener('click', () => {
            window.location.href = `/pages/data-karyawan.html?dept=${encodeURIComponent(deptName)}`;
        });
    };
    setupWidgetLink('widget-aktif', 'Semua');
    setupWidgetLink('widget-produksi', 'Produksi');
    setupWidgetLink('widget-mechanical', 'Mechanical');
    setupWidgetLink('widget-utility', 'Utility');
    setupWidgetLink('widget-qa', 'QA');
    setupWidgetLink('widget-qc', 'QC');
    setupWidgetLink('widget-cleaning', 'Cleaning');
    setupWidgetLink('widget-other', 'Other');

    // 6. RENDER TABEL (Mode Read-Only dengan Last Update)
    function renderTable(data) {
        if (data.length === 0) {
            tableContainer.innerHTML = `<p class="text-cyan-500/50 font-mono tracking-widest text-sm uppercase flex justify-center h-full items-center">Database Organisasi Kosong.</p>`;
            return;
        }

        let tableHTML = `
            <div class="w-full h-full overflow-auto custom-scrollbar">
                <table class="w-full text-left border-collapse whitespace-nowrap">
                    <thead class="sticky top-0 bg-slate-900/90 backdrop-blur-md z-10 border-b border-cyan-500/30">
                        <tr class="text-[10px] uppercase tracking-[0.2em] text-cyan-500 font-mono">
                            <th class="p-4 font-bold">No</th>
                            <th class="p-4 font-bold text-center">Visual</th>
                            <th class="p-4 font-bold">ID Personil</th>
                            <th class="p-4 font-bold">Nama Lengkap</th>
                            <th class="p-4 font-bold">Divisi</th>
                            <th class="p-4 font-bold">Lokasi Area</th>
                            <th class="p-4 font-bold text-center">Status</th>
                            <th class="p-4 font-bold text-right">Terakhir Diperbarui</th>
                        </tr>
                    </thead>
                    <tbody class="text-sm font-mono text-slate-300 divide-y divide-cyan-500/10">
        `;

        data.forEach((row, index) => {
            const no = row[0] || (index + 1);
            const idKaryawan = row[1] ? String(row[1]) : '-';
            const nama = row[2] ? String(row[2]) : '-';
            const dept = row[5] ? String(row[5]) : '-';
            const area = row[6] ? String(row[6]) : '-';
            const zone = row[8] ? String(row[8]) : '-';
            
            // Format Timestamp
            const rawDate = row[10];
            let formattedDate = '-';
            if (rawDate) {
                const d = new Date(rawDate);
                formattedDate = d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + 
                                d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
            }
            
            let kodeBase64 = row[11] ? String(row[11]) : ""; 
            let fotoSrc = "";

            if (!kodeBase64 || kodeBase64 === "-" || kodeBase64 === "") {
                const initial = nama !== '-' ? nama.charAt(0).toUpperCase() : '?';
                fotoSrc = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23083344'/><text x='50' y='50' font-family='sans-serif' font-size='45' font-weight='bold' fill='%2322d3ee' text-anchor='middle' dominant-baseline='central'>${initial}</text></svg>`;
            } else {
                fotoSrc = `data:image/jpeg;base64,${kodeBase64}`;
            }

            tableHTML += `
                <tr class="hover:bg-cyan-500/10 transition-colors group cursor-default">
                    <td class="p-4 text-slate-500">${no}</td>
                    <td class="p-4 flex justify-center">
                        <div class="w-10 h-10 rounded-lg overflow-hidden border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                            <img src="${fotoSrc}" alt="Foto" class="w-full h-full object-cover">
                        </div>
                    </td>
                    <td class="p-4 font-bold text-cyan-50">${idKaryawan}</td>
                    <td class="p-4 tracking-wide">${nama}</td>
                    <td class="p-4 text-cyan-100/70">${dept}</td>
                    <td class="p-4 text-cyan-500/70">${area} / ${zone}</td>
                    <td class="p-4 text-center">
                        <span class="inline-flex items-center px-2 py-1 rounded-full text-[9px] border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 tracking-widest">AKTIF</span>
                    </td>
                    <td class="p-4 text-right">
                        <span class="text-[10px] text-cyan-400/80 font-mono tracking-wider">${formattedDate}</span>
                    </td>
                </tr>
            `;
        });

        tableContainer.innerHTML = tableHTML + `</tbody></table></div>`;
    }

    // JALANKAN SAAT STARTUP
    loadEmployeeData();
});