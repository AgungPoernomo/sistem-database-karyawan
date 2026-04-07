import { updateMachineStats, renderMachineTable } from '../../components/plotting/cleaningmachine/MachineEngine.js';

export function renderMachineView(selectedPlant, selectedArea, allDataCache, dictLine, dictArea, getDirectDriveLink) {
    const imgPlant = document.getElementById('imgPlantM');
    const imgArea = document.getElementById('imgAreaM');

    // 1. Render Line Image
    if (!selectedPlant) {
        imgPlant.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text x='50' y='50' font-family='monospace' font-size='5' fill='%2394a3b8' text-anchor='middle'>MENUNGGU INISIALISASI LINE</text></svg>"; 
        imgPlant.classList.add('opacity-40'); 
        renderMachineTable([]); return;
    }
    const directLinkLine = getDirectDriveLink(dictLine[selectedPlant]);
    imgPlant.src = directLinkLine || `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text x='50' y='50' font-family='monospace' font-size='4' fill='%23ef4444' text-anchor='middle'>LAYOUT TIDAK DITEMUKAN (${selectedPlant})</text></svg>`;
    imgPlant.classList.remove('opacity-40');

    const lineData = allDataCache.filter(row => String(row[4] || '').trim().toUpperCase() === selectedPlant);

    // 2. Render Area Image & Data
    if (!selectedArea) {
        imgArea.classList.add('opacity-40');
        updateMachineStats(lineData, []);
        renderMachineTable(lineData);
        return;
    }
    const dictKey = `${selectedArea}_${selectedPlant}`;
    const directLinkArea = getDirectDriveLink(dictArea[dictKey]);
    imgArea.src = directLinkArea || `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text x='50' y='50' font-family='monospace' font-size='4' fill='%23ef4444' text-anchor='middle'>BLUEPRINT AREA TIDAK DITEMUKAN (${dictKey})</text></svg>`;
    imgArea.classList.remove('opacity-40');

    let areaData = lineData.filter(row => String(row[6] || '').trim().toUpperCase() === selectedArea);
    updateMachineStats(lineData, areaData);
    renderMachineTable(areaData);
}