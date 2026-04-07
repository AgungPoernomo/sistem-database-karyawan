import { renderOutdoorTable } from '../../components/plotting/areaoutdoor/OutdoorEngine.js';

export function renderOutdoorView(selectedPlant, selectedArea, allDataCache, dictLine, dictArea, getDirectDriveLink) {
    const imgPlant = document.getElementById('imgPlantOut');

    if (!selectedPlant) {
        imgPlant.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text x='50' y='50' font-family='monospace' font-size='5' fill='%2394a3b8' text-anchor='middle'>MENUNGGU INISIALISASI OUTDOOR</text></svg>"; 
        imgPlant.classList.add('opacity-40'); 
        renderOutdoorTable([]); return;
    }
    const directLinkLine = getDirectDriveLink(dictLine[selectedPlant]);
    imgPlant.src = directLinkLine || `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text x='50' y='50' font-family='monospace' font-size='4' fill='%23ef4444' text-anchor='middle'>LAYOUT TIDAK DITEMUKAN (${selectedPlant})</text></svg>`;
    imgPlant.classList.remove('opacity-40');

    const lineData = allDataCache.filter(row => String(row[4] || '').trim().toUpperCase() === selectedPlant);

    if (!selectedArea) {
        renderOutdoorTable(lineData);
        return;
    }

    let areaData = lineData.filter(row => String(row[6] || '').trim().toUpperCase() === selectedArea);
    renderOutdoorTable(areaData);
}