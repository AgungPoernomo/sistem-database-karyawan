import { APP_CONFIG } from '../config/api.js';

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. PROTEKSI SESI & INISIALISASI
    const sessionToken = sessionStorage.getItem('nexus_auth_token');
    const savedUserId = localStorage.getItem('nexus_user');
    if (!sessionToken) { window.location.replace('/'); return; }

    const tableContainer = document.getElementById('tableContainer');
    const filterBadge = document.getElementById('filterBadge');
    const filterDescription = document.getElementById('filterDescription');
    const tableTitle = document.getElementById('tableTitle');
    const rowCount = document.getElementById('rowCount');
    const searchInput = document.getElementById('searchInput');

    let allDataCache = []; 
    let filteredDataCache = []; 
    let masterOptions = {};

    // 2. DETEKSI FILTER URL
    const urlParams = new URLSearchParams(window.location.search);
    const deptFilter = urlParams.get('dept'); 

    // 3. LOAD DATA (PARALEL UNTUK KECEPATAN)
    async function initSystem() {
        tableContainer.innerHTML = `<div class="p-8 h-full flex flex-col items-center justify-center text-cyan-400 font-mono animate-pulse"><div class="w-12 h-12 border-t-2 border-cyan-400 rounded-full animate-spin mb-4"></div>Menyelaraskan Database Pusat...</div>`;
        try {
            const [resData, resMaster] = await Promise.all([
                fetch(APP_CONFIG.GAS_URL, { method: 'POST', body: JSON.stringify({ action: 'READ' }) }).then(r => r.json()),
                fetch(APP_CONFIG.GAS_URL, { method: 'POST', body: JSON.stringify({ action: 'GET_MASTER' }) }).then(r => r.json())
            ]);
            
            if (resData.status === 'success' && resMaster.status === 'success') {
                allDataCache = resData.data || [];
                masterOptions = resMaster.data || {};
                populateDropdowns();
                applyFilters(); 
            } else throw new Error("Gagal mengambil integritas data.");
        } catch (error) {
            tableContainer.innerHTML = `<div class="text-rose-500 flex justify-center items-center h-full font-mono uppercase tracking-widest text-sm">Error: ${error.message}</div>`;
        }
    }

    function populateDropdowns() {        
        fillSelect('formDataGender', masterOptions['GENDER'] || []);
        fillSelect('formDataPlant', masterOptions['PLANT'] || []);
        fillSelect('formDataDept', masterOptions['DEPARTEMENT'] || masterOptions['DEPARTEMEN'] || []);
        fillSelect('formDataArea', masterOptions['AREA'] || []);
        fillSelect('formDataGroup', masterOptions['GROUP'] || []);
        fillSelect('formDataZone', masterOptions['ZONE'] || []);
    }

    function fillSelect(elementId, dataArray) {
        const select = document.getElementById(elementId);
        if(!select) return;
        select.innerHTML = '<option value="">-- Pilih Otorisasi --</option>';
        dataArray.forEach(item => { select.innerHTML += `<option value="${item}">${item}</option>`; });
    }

    // 4. LOGIKA PENYARINGAN DATA (FILTERING)
    function applyFilters() {
        let dataToRender = [...allDataCache];

        if (deptFilter && deptFilter !== 'Semua') {
            dataToRender = dataToRender.filter(row => {
                const dept = String(row[5] || '').toLowerCase();
                if (deptFilter.toLowerCase() === 'other') {
                    return !dept.includes('produksi') && !dept.includes('mechanical') && !dept.includes('utility') && !dept.includes('qa') && !dept.includes('qc') && !dept.includes('cleaning');
                }
                return dept.includes(deptFilter.toLowerCase());
            });

            filterBadge.classList.remove('hidden');
            filterDescription.innerText = `Menyaring Data: Divisi ${deptFilter}`;
            tableTitle.innerText = `Divisi ${deptFilter}`;
        }

        const searchTerm = searchInput.value.toLowerCase().trim();
        if (searchTerm) {
            dataToRender = dataToRender.filter(row => {
                const idKaryawan = String(row[1] || '').toLowerCase();
                const nama = String(row[2] || '').toLowerCase();
                return idKaryawan.includes(searchTerm) || nama.includes(searchTerm);
            });
        }

        filteredDataCache = dataToRender;
        rowCount.innerText = filteredDataCache.length.toLocaleString();
        renderTable(filteredDataCache);
    }

    searchInput.addEventListener('input', applyFilters);

    // 5. RENDER TABEL (Dilengkapi Kolom Aksi Edit & Delete)
    function renderTable(data) {
        if (data.length === 0) {
            tableContainer.innerHTML = `<p class="text-cyan-500/50 font-mono tracking-widest text-xs uppercase flex justify-center mt-20">Tidak ada personil yang sesuai dengan parameter pencarian.</p>`;
            return;
        }

        let tableHTML = `
            <div class="w-full h-full overflow-auto custom-scrollbar">
                <table class="w-full text-left border-collapse whitespace-nowrap">
                    <thead class="sticky top-0 bg-slate-900/95 backdrop-blur-md z-10 border-b border-cyan-500/30">
                        <tr class="text-[10px] uppercase tracking-[0.2em] text-cyan-400 font-mono">
                            <th class="p-4 font-bold">No</th>
                            <th class="p-4 font-bold text-center">Visual</th>
                            <th class="p-4 font-bold">ID Personil</th>
                            <th class="p-4 font-bold">Nama Lengkap</th>
                            <th class="p-4 font-bold">Departemen</th>
                            <th class="p-4 font-bold">Area / Zone</th>
                            <th class="p-4 font-bold text-center">Status</th>
                            <th class="p-4 font-bold text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="text-xs font-mono text-slate-300 divide-y divide-cyan-500/10">
        `;

        data.forEach((row, index) => {
            const idKaryawan = row[1] ? String(row[1]) : '-';
            const nama = row[2] ? String(row[2]) : '-';
            const dept = row[5] ? String(row[5]) : '-';
            const area = row[6] ? String(row[6]) : '-';
            const zone = row[8] ? String(row[8]) : '-';
            
            let kodeBase64 = row[11] ? String(row[11]) : ""; 
            let fotoSrc = (!kodeBase64 || kodeBase64 === "-" || kodeBase64 === "") 
                ? `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23083344'/><text x='50' y='50' font-family='sans-serif' font-size='45' font-weight='bold' fill='%2322d3ee' text-anchor='middle' dominant-baseline='central'>${nama !== '-' ? nama.charAt(0).toUpperCase() : '?'}</text></svg>` 
                : `data:image/jpeg;base64,${kodeBase64}`;

            tableHTML += `
                <tr class="hover:bg-cyan-500/10 transition-colors group cursor-default">
                    <td class="p-4 text-slate-500">${index + 1}</td>
                    <td class="p-4 flex justify-center">
                        <div class="w-10 h-10 rounded-xl overflow-hidden border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                            <img src="${fotoSrc}" class="w-full h-full object-cover">
                        </div>
                    </td>
                    <td class="p-4 font-bold text-cyan-50">${idKaryawan}</td>
                    <td class="p-4 tracking-wide">${nama}</td>
                    <td class="p-4 text-cyan-100/70">${dept}</td>
                    <td class="p-4 text-cyan-500/70">${area} / ${zone}</td>
                    <td class="p-4 text-center">
                        <span class="inline-flex items-center px-2 py-1 rounded-full text-[9px] border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 tracking-widest font-bold">ACTIVE</span>
                    </td>
                    <td class="p-4 text-right">
                        <button class="btn-edit text-slate-400 hover:text-cyan-400 bg-slate-800 hover:bg-slate-700 p-1.5 rounded-lg transition-all mx-0.5 shadow-sm" data-id="${idKaryawan}" title="Edit Personil">
                            <svg class="w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                        </button>
                        <button class="btn-delete text-slate-400 hover:text-rose-400 bg-slate-800 hover:bg-slate-700 p-1.5 rounded-lg transition-all mx-0.5 shadow-sm" data-id="${idKaryawan}" title="Cabut Akses">
                            <svg class="w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                    </td>
                </tr>
            `;
        });

        tableContainer.innerHTML = tableHTML + `</tbody></table></div>`;
    }

    // ==========================================
    // 6. LOGIKA MODAL FORM (CREATE & EDIT)
    // ==========================================
    const formModal = document.getElementById('formModal');
    const modalContent = document.getElementById('modalContent');
    const karyawanForm = document.getElementById('karyawanForm');
    let base64FotoData = ""; let namaFileFoto = "";

    const openModal = (mode = 'CREATE', data = null) => {
        document.getElementById('formMode').value = mode;
        document.getElementById('modalTitle').innerHTML = mode === 'CREATE' ? `<span class="w-2 h-2 bg-cyan-400 rounded-full mr-3 shadow-[0_0_8px_#22d3ee]"></span> Registrasi Personil Baru` : `<span class="w-2 h-2 bg-amber-400 rounded-full mr-3 shadow-[0_0_8px_#f59e0b]"></span> Pembaruan Data Personil`;
        
        const previewFoto = document.getElementById('previewFoto');
        const previewInitials = document.getElementById('previewInitials');

        if (mode === 'UPDATE' && data) {
            document.getElementById('formDataId').value = data[1];
            document.getElementById('formDataId').readOnly = true; 
            document.getElementById('formDataId').classList.add('opacity-50', 'cursor-not-allowed', 'bg-slate-800');
            document.getElementById('formDataNama').value = data[2];
            document.getElementById('formDataGender').value = data[3];
            document.getElementById('formDataPlant').value = data[4];
            document.getElementById('formDataDept').value = data[5];
            document.getElementById('formDataArea').value = data[6];
            document.getElementById('formDataGroup').value = data[7];
            document.getElementById('formDataZone').value = data[8];

            let kodeBase64 = data[11] ? String(data[11]) : "";
            if (!kodeBase64 || kodeBase64 === "-" || kodeBase64 === "") {
                previewFoto.classList.add('hidden');
                previewInitials.classList.remove('hidden');
                previewInitials.innerText = data[2] ? data[2].charAt(0).toUpperCase() : '?';
            } else {
                previewFoto.src = `data:image/jpeg;base64,${kodeBase64}`;
                previewFoto.classList.remove('hidden');
                previewInitials.classList.add('hidden');
            }
        } else {
            document.getElementById('formDataId').readOnly = false;
            document.getElementById('formDataId').classList.remove('opacity-50', 'cursor-not-allowed', 'bg-slate-800');
            previewFoto.classList.add('hidden');
            previewInitials.classList.remove('hidden');
            previewInitials.innerText = '?';
        }

        formModal.classList.remove('hidden'); formModal.classList.add('flex');
        setTimeout(() => { formModal.classList.remove('opacity-0'); modalContent.classList.remove('scale-95'); }, 10);
    };

    const closeModal = () => {
        formModal.classList.add('opacity-0'); modalContent.classList.add('scale-95');
        setTimeout(() => {
            formModal.classList.add('hidden'); formModal.classList.remove('flex');
            karyawanForm.reset(); 
            base64FotoData = ""; namaFileFoto = "";
            document.getElementById('fileNameDisplay').classList.add('hidden');
        }, 300); 
    };

    document.getElementById('openAddModalBtn')?.addEventListener('click', () => openModal('CREATE'));
    document.getElementById('closeModalBtn')?.addEventListener('click', closeModal);
    document.getElementById('cancelBtn')?.addEventListener('click', closeModal);
    document.getElementById('modalOverlay')?.addEventListener('click', closeModal);

    // ==========================================
    // 7. KOMPRESI GAMBAR (ENGINE CANVAS)
    // ==========================================
    const fotoInput = document.getElementById('formFoto');
    const fileNameDisplay = document.getElementById('fileNameDisplay');
    const uploadLoader = document.getElementById('uploadLoader'); 
    
    if(fotoInput) {
        fotoInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if(file) {
                if (file.size > 2097152) {
                    window.showToast("Ukuran file asli maksimal 2 MB.", "warning");
                    fotoInput.value = ""; return; 
                }

                uploadLoader.classList.replace('hidden', 'flex');
                document.getElementById('submitFormBtn').disabled = true; 
                fileNameDisplay.innerText = `Menyiapkan Identitas Visual...`;
                fileNameDisplay.classList.remove('hidden');

                const reader = new FileReader();
                reader.onload = function(event) {
                    const img = new Image();
                    img.onload = function() {
                        const canvas = document.createElement('canvas');
                        const MAX_WIDTH = 400; 
                        const scaleSize = MAX_WIDTH / img.width;
                        canvas.width = MAX_WIDTH;
                        canvas.height = img.height * scaleSize;

                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                        base64FotoData = dataUrl.split(',')[1];
                        namaFileFoto = file.name;

                        document.getElementById('previewFoto').src = dataUrl;
                        document.getElementById('previewFoto').classList.remove('hidden');
                        document.getElementById('previewInitials').classList.add('hidden');

                        const newSizeKb = Math.round((base64FotoData.length * 3 / 4) / 1024);
                        fileNameDisplay.innerText = `Visual Siap: ${file.name} (${newSizeKb} KB)`;
                        
                        uploadLoader.classList.replace('flex', 'hidden');
                        document.getElementById('submitFormBtn').disabled = false; 
                    };
                    img.src = event.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // ==========================================
    // 8. SUBMIT FORM (CREATE / UPDATE API)
    // ==========================================
    if(karyawanForm) {
        karyawanForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = document.getElementById('submitFormBtn');
            const originalHtml = submitBtn.innerHTML;
            submitBtn.innerHTML = `<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-slate-900" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Menyelaraskan...`; 
            submitBtn.disabled = true;

            const mode = document.getElementById('formMode').value;
            const payloadData = {
                userId: savedUserId, 
                idKaryawan: document.getElementById('formDataId').value.trim(),
                nama: document.getElementById('formDataNama').value.trim(),
                gender: document.getElementById('formDataGender').value,
                plant: document.getElementById('formDataPlant').value,
                dept: document.getElementById('formDataDept').value,
                area: document.getElementById('formDataArea').value,
                group: document.getElementById('formDataGroup').value,
                zone: document.getElementById('formDataZone').value,
                fotoBase64: base64FotoData, 
                fotoName: namaFileFoto      
            };

            try {
                const response = await fetch(APP_CONFIG.GAS_URL, {
                    method: 'POST', body: JSON.stringify({ action: mode, payload: payloadData })
                });
                const result = await response.json();
                if (result.status === 'success') {
                    window.showToast(`Registrasi personil berhasil divalidasi.`, 'success');
                    closeModal(); 
                    initSystem(); // Muat ulang data
                } else throw new Error(result.message);
            } catch (error) {
                window.showToast(`Kegagalan Sistem: ${error.message}`, 'error');
            } finally {
                submitBtn.innerHTML = originalHtml; submitBtn.disabled = false;
            }
        });
    }

    // ==========================================
    // 9. DELEGASI EVENT AKSI TABEL (EDIT & HAPUS)
    // ==========================================
    const deleteModal = document.getElementById('deleteConfirmModal');
    const deleteModalContent = document.getElementById('deleteModalContent');
    let pendingDeleteId = null;

    if (tableContainer) {
        tableContainer.addEventListener('click', (e) => {
            const editBtn = e.target.closest('.btn-edit');
            if (editBtn) {
                const idTarget = editBtn.getAttribute('data-id'); 
                const rowData = allDataCache.find(r => String(r[1]) === idTarget);
                if(rowData) openModal('UPDATE', rowData);
                return; 
            }

            const deleteBtn = e.target.closest('.btn-delete');
            if (deleteBtn) {
                pendingDeleteId = deleteBtn.getAttribute('data-id'); 
                if (deleteModal) {
                    document.getElementById('deleteTargetId').innerText = `ID ${pendingDeleteId}`;
                    deleteModal.classList.remove('hidden'); deleteModal.classList.add('flex');
                    setTimeout(() => {
                        deleteModal.classList.remove('opacity-0');
                        deleteModalContent.classList.remove('scale-95');
                    }, 10);
                }
                return;
            }
        });
    }

    const closeDeleteModal = () => {
        deleteModal.classList.add('opacity-0'); deleteModalContent.classList.add('scale-95');
        setTimeout(() => {
            deleteModal.classList.add('hidden'); deleteModal.classList.remove('flex');
            pendingDeleteId = null;
        }, 300);
    };

    document.getElementById('cancelDeleteBtn')?.addEventListener('click', closeDeleteModal);
    document.getElementById('deleteOverlay')?.addEventListener('click', closeDeleteModal);

    // EKSEKUSI API HAPUS
    document.getElementById('confirmDeleteBtn')?.addEventListener('click', async () => {
        if(!pendingDeleteId) return;
        
        const btn = document.getElementById('confirmDeleteBtn');
        const originalHtml = btn.innerHTML;
        btn.innerHTML = `<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Mencabut...`;
        btn.disabled = true;

        try {
            const res = await fetch(APP_CONFIG.GAS_URL, {
                method: 'POST', body: JSON.stringify({ action: 'DELETE', payload: { userId: savedUserId, idKaryawan: pendingDeleteId } })
            });
            const resJson = await res.json();
            if(resJson.status === 'success') {
                closeDeleteModal();
                window.showToast(`Personil ID ${pendingDeleteId} berhasil dipindahkan ke sistem Recovery.`, 'success');
                initSystem(); // Refresh tabel otomatis
            } else throw new Error(resJson.message);
        } catch (err) { 
            window.showToast("Gagal Mencabut Akses: " + err.message, 'error'); 
        } finally {
            btn.innerHTML = originalHtml; btn.disabled = false;
        }
    });

    // MULAI SISTEM
    initSystem();
});