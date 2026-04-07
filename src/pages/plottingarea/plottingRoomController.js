import { updateRoomStats, renderRoomTable } from '../../components/plotting/cleaningroom/RoomEngine.js';

export function renderRoomView(selectedPlant, selectedArea, allDataCache, dictLine, dictArea, getDirectDriveLink) {
    const imgPlant = document.getElementById('imgPlantR');
    const imgArea = document.getElementById('imgAreaR');
    const imgDetail = document.getElementById('imgDetailR');

    if (!selectedPlant) {
        imgPlant.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text x='50' y='50' font-family='monospace' font-size='5' fill='%2394a3b8' text-anchor='middle'>MENUNGGU LINE</text></svg>"; 
        imgPlant.classList.add('opacity-40'); 
        imgArea.classList.add('opacity-40');
        imgDetail.classList.add('opacity-40');
        renderRoomTable([]); return;
    }
    const directLinkLine = getDirectDriveLink(dictLine[selectedPlant]);
    imgPlant.src = directLinkLine || `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text x='50' y='50' font-family='monospace' font-size='4' fill='%23ef4444' text-anchor='middle'>LAYOUT TIDAK ADA (${selectedPlant})</text></svg>`;
    imgPlant.classList.remove('opacity-40');

    const lineData = allDataCache.filter(row => String(row[4] || '').trim().toUpperCase() === selectedPlant);

    if (!selectedArea) {
        imgArea.classList.add('opacity-40');
        imgDetail.classList.add('opacity-40');
        updateRoomStats(lineData);
        renderRoomTable(lineData);
        return;
    }
    
    const dictKey = `${selectedArea}_${selectedPlant}`;
    const directLinkArea = getDirectDriveLink(dictArea[dictKey]);
    imgArea.src = directLinkArea || `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text x='50' y='50' font-family='monospace' font-size='4' fill='%23ef4444' text-anchor='middle'>AREA TIDAK ADA (${dictKey})</text></svg>`;
    imgArea.classList.remove('opacity-40');

    // Nanti ruangan bisa disinkron ke filter khusus ruangan
    imgDetail.src = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text x='50' y='50' font-family='monospace' font-size='4' fill='%230ea5e9' text-anchor='middle'>RUANGAN SPESIFIK: ${selectedArea}</text></svg>`;
    imgDetail.classList.remove('opacity-40');

    let areaData = lineData.filter(row => String(row[6] || '').trim().toUpperCase() === selectedArea);
    updateRoomStats(areaData.length > 0 ? areaData : lineData); 
    renderRoomTable(areaData);
}