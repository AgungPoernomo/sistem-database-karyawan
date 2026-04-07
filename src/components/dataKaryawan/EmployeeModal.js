// src/components/dataKaryawan/EmployeeModal.js
import { APP_CONFIG } from '../../config/api.js';

function getAvatarLink(gdriveUrl) {
    if (!gdriveUrl || gdriveUrl === "-" || gdriveUrl.includes("Upload_Error")) return null;
    const match = gdriveUrl.match(/\/d\/([a-zA-Z0-9-_]+)/); 
    if (match && match[1]) return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w400`;
    return null;
}

export function initEmployeeModals(containerId, dependencies) {
    const { savedUserId, onSuccess } = dependencies;
    const container = document.getElementById(containerId);

    // HTML Modal yang sudah dirampingkan (max-w-2xl, gap-4, p-6)
    container.innerHTML = `
        <div id="formModal" class="fixed inset-0 z-[60] hidden flex-col items-center justify-center opacity-0 transition-opacity duration-400">
            <div id="modalOverlay" class="absolute inset-0 bg-slate-900/60 backdrop-blur-xl cursor-pointer"></div>
            <div class="relative z-10 w-full max-w-2xl p-7 spatial-island rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.3)] transform scale-95 transition-all duration-400" id="modalContent">
                
                <div class="flex justify-between items-center mb-6 border-b border-slate-200/50 dark:border-slate-700/50 pb-4">
                    <h3 id="modalTitle" class="text-base font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center font-mono drop-shadow-sm">
                        <span class="w-2 h-6 bg-cyan-500 rounded-full mr-3 shadow-[0_0_10px_#0ea5e9]"></span> Registrasi Node Personil
                    </h3>
                    <button id="closeModalBtn" class="text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-all p-2 rounded-xl">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                <form id="karyawanForm" class="space-y-4">
                    <input type="hidden" id="formMode" value="CREATE"> 
                    <input type="hidden" id="formRowNo" value=""> 

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="space-y-1.5">
                            <label class="text-[9px] font-bold text-slate-500 dark:text-cyan-400/80 uppercase tracking-widest pl-2 font-mono">ID Personil (Angka)</label>
                            <input type="text" id="formDataId" pattern="[0-9]*" class="w-full px-4 py-3 rounded-xl font-mono text-xs font-bold glass-input">
                        </div>
                        <div class="space-y-1.5">
                            <label class="text-[9px] font-bold text-slate-500 dark:text-cyan-400/80 uppercase tracking-widest pl-2 font-mono">Nama Lengkap</label>
                            <input type="text" id="formDataNama" class="w-full px-4 py-3 rounded-xl font-mono text-xs font-bold glass-input">
                        </div>
                        <div class="space-y-1.5">
                            <label class="text-[9px] font-bold text-slate-500 dark:text-cyan-400/80 uppercase tracking-widest pl-2 font-mono">Gender</label>
                            <select id="formDataGender" class="w-full px-4 py-3 rounded-xl font-mono text-xs font-bold glass-input appearance-none"><option value="">-- Pilih --</option></select>
                        </div>
                        <div class="space-y-1.5">
                            <label class="text-[9px] font-bold text-slate-500 dark:text-cyan-400/80 uppercase tracking-widest pl-2 font-mono">Plant / Line</label>
                            <select id="formDataPlant" class="w-full px-4 py-3 rounded-xl font-mono text-xs font-bold glass-input appearance-none"><option value="">-- Pilih --</option></select>
                        </div>
                        <div class="space-y-1.5">
                            <label class="text-[9px] font-bold text-slate-500 dark:text-cyan-400/80 uppercase tracking-widest pl-2 font-mono">Departemen</label>
                            <select id="formDataDept" class="w-full px-4 py-3 rounded-xl font-mono text-xs font-bold glass-input appearance-none"><option value="">-- Pilih --</option></select>
                        </div>
                        <div class="space-y-1.5">
                            <label class="text-[9px] font-bold text-slate-500 dark:text-cyan-400/80 uppercase tracking-widest pl-2 font-mono">Alokasi Area</label>
                            <select id="formDataArea" class="w-full px-4 py-3 rounded-xl font-mono text-xs font-bold glass-input appearance-none"><option value="">-- Pilih --</option></select>
                        </div>
                        <div class="space-y-1.5">
                            <label class="text-[9px] font-bold text-slate-500 dark:text-cyan-400/80 uppercase tracking-widest pl-2 font-mono">Grup Kerja</label>
                            <select id="formDataGroup" class="w-full px-4 py-3 rounded-xl font-mono text-xs font-bold glass-input appearance-none"><option value="">-- Pilih --</option></select>
                        </div>
                        <div class="space-y-1.5">
                            <label class="text-[9px] font-bold text-slate-500 dark:text-cyan-400/80 uppercase tracking-widest pl-2 font-mono">Spesifik Zone</label>
                            <select id="formDataZone" class="w-full px-4 py-3 rounded-xl font-mono text-xs font-bold glass-input appearance-none"><option value="">-- Pilih --</option></select>
                        </div>
                    </div>

                    <div class="space-y-1.5 mt-5 border-t border-slate-200/50 dark:border-slate-700/50 pt-5">
                        <label class="text-[9px] font-bold text-slate-500 dark:text-cyan-400/80 uppercase tracking-widest pl-2 font-mono">Unggah Identitas Visual (Maks 2MB)</label>
                        <div class="flex items-center space-x-5">
                            <div class="w-20 h-20 rounded-2xl overflow-hidden glass-input flex-shrink-0 relative group shadow-sm flex items-center justify-center">
                                <img id="previewFoto" src="" alt="Preview" class="w-full h-full object-cover hidden">
                                <div id="previewInitials" class="text-2xl font-black text-slate-400 dark:text-cyan-500/50">?</div>
                                <div id="uploadLoader" class="absolute inset-0 bg-white/80 dark:bg-slate-900/80 hidden flex-col items-center justify-center backdrop-blur-sm z-10">
                                    <span class="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></span>
                                </div>
                            </div>

                            <div class="relative flex-1">
                                <label for="formFoto" class="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-cyan-500/30 rounded-2xl cursor-pointer bg-cyan-50/50 dark:bg-cyan-900/10 hover:bg-cyan-100 dark:hover:bg-cyan-900/30 hover:border-cyan-400 transition-all group shadow-inner">
                                    <svg class="w-5 h-5 text-cyan-500/60 mb-1 group-hover:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                                    <p class="text-[9px] text-cyan-700 dark:text-cyan-300 font-mono tracking-widest uppercase font-bold">Otorisasi File Visual</p>
                                    <input id="formFoto" type="file" class="hidden" accept="image/png, image/jpeg, image/jpg" />
                                </label>
                            </div>
                        </div>
                        <p id="fileNameDisplay" class="text-[9px] text-emerald-600 dark:text-emerald-400 font-mono mt-2 hidden bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/30 font-bold inline-block tracking-widest uppercase"></p>
                    </div>

                    <div class="pt-5 mt-5 flex justify-end items-center border-t border-slate-200/50 dark:border-slate-700/50">
                        <button type="button" id="cancelBtn" class="px-5 py-2.5 mr-3 text-slate-500 hover:text-slate-800 dark:hover:text-white font-mono text-[10px] font-bold uppercase tracking-widest transition-colors rounded-xl">Batal</button>
                        <button type="submit" id="submitFormBtn" class="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-[0_5px_15px_rgba(14,165,233,0.3)] transition-all flex items-center hover:-translate-y-1 font-mono">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path></svg> Simpan Entri
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <div id="deleteConfirmModal" class="fixed inset-0 z-[70] hidden flex-col items-center justify-center opacity-0 transition-opacity duration-300">
            <div id="deleteOverlay" class="absolute inset-0 bg-slate-900/60 backdrop-blur-md cursor-pointer"></div>
            <div class="relative z-10 w-full max-w-md p-8 spatial-island border-t-rose-500 rounded-[2.5rem] shadow-[0_20px_50px_rgba(244,63,94,0.2)] transform scale-95 transition-all duration-300 text-center" id="deleteModalContent">
                <div class="w-20 h-20 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto mb-5 shadow-[0_0_20px_rgba(244,63,94,0.3)] relative">
                    <div class="absolute inset-0 rounded-full bg-rose-500/20 animate-ping"></div>
                    <svg class="w-10 h-10 text-rose-500 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                </div>
                <h3 class="text-lg font-black text-slate-900 dark:text-white mb-2 uppercase tracking-widest font-mono">Cabut Otorisasi?</h3>
                <p class="text-[10px] font-mono text-slate-600 dark:text-slate-400 mb-8 leading-relaxed font-bold">Personil <span id="deleteTargetId" class="text-rose-600 dark:text-rose-400 font-black tracking-wider block mt-1 mb-1 text-xs"></span>akan diisolasi ke sistem <span class="text-amber-500 font-black">Data Recovery Vault</span>.</p>
                <div class="flex justify-center space-x-3">
                    <button id="cancelDeleteBtn" class="px-5 py-2.5 text-slate-500 font-mono text-[10px] font-bold uppercase tracking-widest hover:text-slate-800 dark:hover:text-white transition-colors rounded-xl">Batal</button>
                    <button id="confirmDeleteBtn" class="bg-rose-600 hover:bg-rose-500 text-white px-6 py-3 rounded-xl text-[11px] font-black font-mono uppercase tracking-widest shadow-[0_5px_15px_rgba(244,63,94,0.4)] transition-all flex items-center hover:-translate-y-1">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg> Eksekusi
                    </button>
                </div>
            </div>
        </div>
    `;

    // DEKLARASI STATE LOKAL MODAL
    let base64FotoData = ""; let namaFileFoto = "";
    let pendingDeleteRow = null; 
    
    const formModal = document.getElementById('formModal');
    const modalContent = document.getElementById('modalContent');
    const karyawanForm = document.getElementById('karyawanForm');
    
    const deleteModal = document.getElementById('deleteConfirmModal');
    const deleteModalContent = document.getElementById('deleteModalContent');

    // FUNGSI POPULASI DROPDOWN (Dipanggil oleh Controller)
    window.dataKaryawanApp.populateDropdowns = function(masterOptions) {
        const fill = (id, data) => {
            const el = document.getElementById(id);
            if(!el) return;
            el.innerHTML = '<option value="">-- Pilih --</option>';
            data.forEach(item => { el.innerHTML += `<option value="${item}">${item}</option>`; });
        };
        fill('formDataGender', masterOptions['GENDER'] || []);
        fill('formDataPlant', masterOptions['PLANT'] || []);
        fill('formDataDept', masterOptions['DEPARTEMENT'] || masterOptions['DEPARTEMEN'] || []);
        fill('formDataArea', masterOptions['AREA'] || []);
        fill('formDataGroup', masterOptions['GROUP'] || []);
        fill('formDataZone', masterOptions['ZONE'] || []);
    };

    // FUNGSI BUKA/TUTUP FORM MODAL
    window.dataKaryawanApp.openModal = function(mode, data = null) {
        document.getElementById('formMode').value = mode;
        document.getElementById('formRowNo').value = (mode === 'UPDATE' && data) ? data[0] : '';
        document.getElementById('modalTitle').innerHTML = mode === 'CREATE' ? `<span class="w-2 h-6 bg-cyan-500 rounded-full mr-3 shadow-[0_0_10px_#0ea5e9]"></span> Registrasi Node Personil` : `<span class="w-2 h-6 bg-amber-500 rounded-full mr-3 shadow-[0_0_10px_#f59e0b]"></span> Modifikasi Node Personil`;
        
        const previewFoto = document.getElementById('previewFoto');
        const previewInitials = document.getElementById('previewInitials');

        document.getElementById('formDataId').readOnly = false;
        document.getElementById('formDataId').classList.remove('opacity-50', 'cursor-not-allowed');

        if (mode === 'UPDATE' && data) {
            let cleanId = data[1] && data[1] !== '-' ? String(data[1]).replace(/'/g, "") : '';
            document.getElementById('formDataId').value = cleanId;
            document.getElementById('formDataNama').value = data[2] && data[2] !== '-' ? data[2] : '';
            document.getElementById('formDataGender').value = data[3] && data[3] !== '-' ? data[3] : '';
            document.getElementById('formDataPlant').value = data[4] && data[4] !== '-' ? data[4] : '';
            document.getElementById('formDataDept').value = data[5] && data[5] !== '-' ? data[5] : '';
            document.getElementById('formDataArea').value = data[6] && data[6] !== '-' ? data[6] : '';
            document.getElementById('formDataGroup').value = data[7] && data[7] !== '-' ? data[7] : '';
            document.getElementById('formDataZone').value = data[8] && data[8] !== '-' ? data[8] : '';

            let directFotoLink = getAvatarLink(data[9] ? String(data[9]) : "");
            if (directFotoLink) {
                previewFoto.src = directFotoLink;
                previewFoto.classList.remove('hidden'); previewInitials.classList.add('hidden');
            } else {
                previewFoto.classList.add('hidden'); previewInitials.classList.remove('hidden');
                previewInitials.innerText = data[2] && data[2] !== '-' ? data[2].charAt(0).toUpperCase() : '?';
            }
        } else {
            previewFoto.classList.add('hidden'); previewInitials.classList.remove('hidden');
            previewInitials.innerText = '?';
        }

        formModal.classList.remove('hidden'); formModal.classList.add('flex');
        setTimeout(() => { formModal.classList.remove('opacity-0'); modalContent.classList.remove('scale-95'); }, 10);
    };

    const closeFormModal = () => {
        formModal.classList.add('opacity-0'); modalContent.classList.add('scale-95');
        setTimeout(() => {
            formModal.classList.add('hidden'); formModal.classList.remove('flex');
            karyawanForm.reset(); base64FotoData = ""; namaFileFoto = "";
            document.getElementById('fileNameDisplay').classList.add('hidden');
        }, 300); 
    };

    document.getElementById('closeModalBtn')?.addEventListener('click', closeFormModal);
    document.getElementById('cancelBtn')?.addEventListener('click', closeFormModal);
    document.getElementById('modalOverlay')?.addEventListener('click', closeFormModal);

    // LOGIKA UPLOAD FOTO
    const fotoInput = document.getElementById('formFoto');
    const fileNameDisplay = document.getElementById('fileNameDisplay');
    const uploadLoader = document.getElementById('uploadLoader'); 
    
    if(fotoInput) {
        fotoInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if(file) {
                if (file.size > 2097152) { window.dataKaryawanApp.showToast("Ukuran memori maksimal 2 MB.", "error"); fotoInput.value = ""; return; }
                uploadLoader.classList.replace('hidden', 'flex');
                document.getElementById('submitFormBtn').disabled = true; 
                fileNameDisplay.innerText = `Memproses Paket...`;
                fileNameDisplay.classList.remove('hidden');

                const reader = new FileReader();
                reader.onload = function(event) {
                    const img = new Image();
                    img.onload = function() {
                        const canvas = document.createElement('canvas');
                        const scaleSize = 400 / img.width;
                        canvas.width = 400; canvas.height = img.height * scaleSize;
                        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
                        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                        
                        base64FotoData = dataUrl.split(',')[1]; namaFileFoto = file.name;
                        document.getElementById('previewFoto').src = dataUrl;
                        document.getElementById('previewFoto').classList.remove('hidden');
                        document.getElementById('previewInitials').classList.add('hidden');
                        
                        fileNameDisplay.innerText = `Data Siap: ${file.name} (${Math.round((base64FotoData.length * 3 / 4) / 1024)} KB)`;
                        uploadLoader.classList.replace('flex', 'hidden');
                        document.getElementById('submitFormBtn').disabled = false; 
                    };
                    img.src = event.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // LOGIKA SUBMIT FORM
    if(karyawanForm) {
        karyawanForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = document.getElementById('submitFormBtn');
            const originalHtml = submitBtn.innerHTML;
            submitBtn.innerHTML = `<span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span> Transmisi...`; 
            submitBtn.disabled = true;

            const payloadData = {
                userId: savedUserId, rowNo: document.getElementById('formRowNo').value, 
                idKaryawan: document.getElementById('formDataId').value.trim() || "-",
                nama: document.getElementById('formDataNama').value.trim() || "-",
                gender: document.getElementById('formDataGender').value || "-",
                plant: document.getElementById('formDataPlant').value || "-",
                dept: document.getElementById('formDataDept').value || "-",
                area: document.getElementById('formDataArea').value || "-",
                group: document.getElementById('formDataGroup').value || "-",
                zone: document.getElementById('formDataZone').value || "-",
                fotoBase64: base64FotoData, fotoName: namaFileFoto      
            };

            try {
                const response = await fetch(APP_CONFIG.GAS_URL, {
                    method: 'POST', body: JSON.stringify({ action: document.getElementById('formMode').value, payload: payloadData })
                });
                const result = await response.json();
                if (result.status === 'success') {
                    window.dataKaryawanApp.showToast(`Transmisi Berhasil Disahkan.`, 'success');
                    closeFormModal(); onSuccess(); 
                } else throw new Error(result.message);
            } catch (error) {
                window.dataKaryawanApp.showToast(`Galat Jaringan: ${error.message}`, 'error');
            } finally {
                submitBtn.innerHTML = originalHtml; submitBtn.disabled = false;
            }
        });
    }

    // FUNGSI MODAL DELETE
    window.dataKaryawanApp.openDeleteModal = function(rowNo, nama) {
        pendingDeleteRow = rowNo;
        document.getElementById('deleteTargetId').innerText = nama;
        deleteModal.classList.remove('hidden'); deleteModal.classList.add('flex');
        setTimeout(() => { deleteModal.classList.remove('opacity-0'); deleteModalContent.classList.remove('scale-95'); }, 10);
    };

    const closeDeleteModal = () => {
        deleteModal.classList.add('opacity-0'); deleteModalContent.classList.add('scale-95');
        setTimeout(() => { deleteModal.classList.add('hidden'); deleteModal.classList.remove('flex'); pendingDeleteRow = null; }, 300);
    };

    document.getElementById('cancelDeleteBtn')?.addEventListener('click', closeDeleteModal);
    document.getElementById('deleteOverlay')?.addEventListener('click', closeDeleteModal);

    document.getElementById('confirmDeleteBtn')?.addEventListener('click', async () => {
        if(!pendingDeleteRow) return;
        const btn = document.getElementById('confirmDeleteBtn');
        const originalHtml = btn.innerHTML;
        btn.innerHTML = `<span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span> Mencabut...`;
        btn.disabled = true;

        try {
            const res = await fetch(APP_CONFIG.GAS_URL, { method: 'POST', body: JSON.stringify({ action: 'DELETE', payload: { userId: savedUserId, rowNo: pendingDeleteRow } }) });
            const resJson = await res.json();
            if(resJson.status === 'success') {
                closeDeleteModal(); window.dataKaryawanApp.showToast(`Otorisasi Node Berhasil Dicabut.`, 'success'); onSuccess(); 
            } else throw new Error(resJson.message);
        } catch (err) { 
            window.dataKaryawanApp.showToast("Gagal Mencabut Akses: " + err.message, 'error'); 
        } finally {
            btn.innerHTML = originalHtml; btn.disabled = false;
        }
    });
}