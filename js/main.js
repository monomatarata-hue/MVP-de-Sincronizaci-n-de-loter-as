// Main execution file for Pruebas de Monomatarata
// v3.0 - Synchronization Layer (API + Scraper)

document.addEventListener('DOMContentLoaded', () => {
    console.log("Monomatarata MVP v3.0 Initialized.");

    // 1. Lotterly APIs (Section 7)
    const lotterlySlugs = [
        'guacharo-activo',
        'selva-plus',
        'el-guacharito-millonario'
    ];

    lotterlySlugs.forEach(slug => {
        syncLotterlyResults(slug);
    });

    // 2. Lotto Activo Scraper Data (Section 8)
    loadLottoActivoResults();
});

/**
 * Fetches and renders Lotto Activo results from local JSON file
 */
async function loadLottoActivoResults() {
    const jsonPath = './data/lotto-activo-today.json';
    const sectionId = 'lotto-activo';
    const section = document.getElementById(sectionId);

    if (!section) {
        console.warn(`Section with ID "${sectionId}" not found.`);
        return;
    }

    try {
        console.log(`Fetching Lotto Activo results from ${jsonPath}...`);
        const response = await fetch(jsonPath);
        
        if (!response.ok) {
            throw new Error(`Could not load ${jsonPath}. Ensure the scraper has run.`);
        }

        const data = await response.json();
        
        if (data && Array.isArray(data)) {
            console.log('Lotto Activo data loaded successfully.');
            
            data.forEach(item => {
                const drawTime = item.time; // Format "HH:MM:SS"
                const winnerNumber = item.results && item.results[0] ? String(item.results[0].result) : null;

                if (drawTime && winnerNumber) {
                    // Reusing updateCard from lotterly-api.js logic
                    // Note: lotterly-api.js is loaded BEFORE main.js in index.html
                    if (typeof updateCard === 'function') {
                        updateCard(section, drawTime, winnerNumber);
                    } else {
                        // Fallback implementation if lotterly-api.js is not loaded
                        injectResultToCard(section, drawTime, winnerNumber);
                    }
                }
            });
        }
    } catch (error) {
        console.error('Error loading Lotto Activo results:', error.message);
    }
}

/**
 * Fallback injector if updateCard is not globally available
 */
function injectResultToCard(section, drawTime, winnerNumber) {
    const card = section.querySelector(`.result-card[data-time="${drawTime}"]`);
    if (card) {
        const imgContainer = card.querySelector('.animal-img');
        // ANIMAL_MAPPER is globally available from lotterly-api.js
        const fileName = (typeof ANIMAL_MAPPER !== 'undefined') ? ANIMAL_MAPPER[winnerNumber] : null;
        
        if (fileName && imgContainer) {
            const imgPath = `assets/animalitos/${fileName}`;
            imgContainer.innerHTML = `<img src="${imgPath}" alt="${winnerNumber}">`;
        }
    }
}
