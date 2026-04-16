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
    loadScraperResults('./data/lotto-activo-today.json', 'lotto-activo');
    loadScraperResults('./data/lotto-activo-int-today.json', 'lotto-activo-internacional');

    // 3. La Granjita Scraper Data (Section 9)
    loadScraperResults('./data/la-granjita-today.json', 'la-granjita');
});


/**
 * Fetches and renders scraper results from local JSON file
 * @param {string} jsonPath - Path to the JSON data file
 * @param {string} sectionId - HTML ID of the lottery section
 */
async function loadScraperResults(jsonPath, sectionId) {
    const section = document.getElementById(sectionId);

    if (!section) {
        console.warn(`Section with ID "${sectionId}" not found.`);
        return;
    }

    try {
        console.log(`Fetching results from ${jsonPath}...`);
        const response = await fetch(jsonPath);
        
        if (!response.ok) {
            throw new Error(`Could not load ${jsonPath}. Ensure the scraper has run.`);
        }

        const data = await response.json();
        
        if (data && Array.isArray(data)) {
            console.log(`${sectionId} data loaded successfully.`);
            
            data.forEach(item => {
                const drawTime = item.time;
                const resultData = item.results && item.results[0] ? item.results[0] : null;

                if (drawTime && resultData) {
                    const winnerNumber = String(resultData.result);
                    const animalName = String(resultData.animal || '');
                    
                    // Priorizamos la función de inyección de main.js para aplicar el parche de sanitización
                    injectResultToCard(section, drawTime, winnerNumber, animalName);
                }
            });
        }
    } catch (error) {
        console.error(`Error loading results for ${sectionId}:`, error.message);
    }
}

/**
 * Fallback injector if updateCard is not globally available
 * UPDATED: Includes security patch for single-digit numbers and animal name sanitization
 */
function injectResultToCard(section, drawTime, winnerNumber, animalName = '') {
    const card = section.querySelector(`.result-card[data-time="${drawTime}"]`);
    if (card) {
        const imgContainer = card.querySelector('.animal-img');
        
        // PARCHE DE SEGURIDAD: Sanitización estricta de número y animal
        const sanitizedNumber = winnerNumber.toString().padStart(2, '0');
        const sanitizedAnimal = animalName.toLowerCase()
            .trim()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Quitar tildes (acentos)

        // 1. Intentar obtener el nombre del archivo desde el ANIMAL_MAPPER global
        let fileName = (typeof ANIMAL_MAPPER !== 'undefined') ? ANIMAL_MAPPER[sanitizedNumber] : null;
        
        // 2. Fallback: Si no está en el mapper, construirlo según la convención XX-animal.webp
        if (!fileName && sanitizedAnimal) {
            fileName = `${sanitizedNumber}-${sanitizedAnimal}.webp`;
        }
        
        if (fileName && imgContainer) {
            const imgPath = `assets/animalitos/${fileName}`;
            imgContainer.innerHTML = `<img src="${imgPath}" alt="${sanitizedNumber}">`;
        }
    }
}

