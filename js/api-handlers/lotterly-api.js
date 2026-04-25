/**
 * Animal results mapper for lotteries
 * Relates number strings to webp filenames in /assets/animalitos/
 * Based on file availability in /assets/animalitos/
 */
const ANIMAL_MAPPER = {
    "0": "0-delfin.webp",
    "00": "00-ballena.webp",
    "01": "01-carnero.webp",
    "02": "02-toro.webp",
    "03": "03-ciempies.webp",
    "04": "04-alacran.webp",
    "05": "05-leon.webp",
    "06": "06-rana.webp",
    "07": "07-perico.webp",
    "08": "08-raton.webp",
    "09": "09-aguila.webp",
    "10": "10-tigre.webp",
    "11": "11-gato.webp",
    "12": "12-caballo.webp",
    "13": "13-mono.webp",
    "14": "14-paloma.webp",
    "15": "15-zorro.webp",
    "16": "16-oso.webp",
    "17": "17-pavo.webp",
    "18": "18-burro.webp",
    "19": "19-chivo.webp",
    "20": "20-cochino.webp",
    "21": "21-gallo.webp",
    "22": "22-camello.webp",
    "23": "23-cebra.webp",
    "24": "24-iguana.webp",
    "25": "25-gallina.webp",
    "26": "26-vaca.webp",
    "27": "27-perro.webp",
    "28": "28-zamuro.webp",
    "29": "29-elefante.webp",
    "30": "30-caiman.webp",
    "31": "31-lapa.webp",
    "32": "32-ardilla.webp",
    "33": "33-pescado.webp",
    "34": "34-venado.webp",
    "35": "35-jirafa.webp",
    "36": "36-culebra.webp",
    "37": "37-tortuga.webp",
    "38": "38-bufalo.webp",
    "39": "39-lechuza.webp",
    "40": "40-avispa.webp",
    "41": "41-canguro.webp",
    "42": "42-tucan.webp",
    "43": "43-mariposa.webp",
    "44": "44-chiguire.webp",
    "45": "45-garza.webp",
    "46": "46-puma.webp",
    "47": "47-pavo.webp",
    "48": "48-puercoespin.webp",
    "49": "49-pereza.webp",
    "50": "50-canario.webp",
    "51": "51-pelicano.webp",
    "52": "52-pulpo.webp",
    "53": "53-caracol.webp",
    "54": "54-grillo.webp",
    "55": "55-oso-hormiguero.webp",
    "56": "56-tiburon.webp",
    "57": "57-pato.webp",
    "58": "58-hormiga.webp",
    "59": "59-pantera.webp",
    "60": "60-camaleon.webp",
    "61": "61-panda.webp",
    "62": "62-cachicamo.webp",
    "63": "63-cangrejo.webp",
    "64": "64-gavilan.webp",
    "65": "65-arana.webp",
    "66": "66-lobo.webp",
    "67": "67-avestruz.webp",
    "68": "68-jaguar.webp",
    "69": "69-conejo.webp",
    "70": "70-bisonte.webp",
    "71": "71-guacamaya.webp",
    "72": "72-gorila.webp",
    "73": "73-hipopotamo.webp",
    "74": "74-turpial.webp",
    "75": "75-guacharo.webp",
    "76": "76-rinoceronte.webp",
    "77": "77-pinguino.webp",
    "78": "78-antilope.webp",
    "79": "79-calamar.webp",
    "80": "80-murcielago.webp",
    "81": "81-cuervo.webp",
    "82": "82-cucaracha.webp",
    "83": "83-buho.webp",
    "84": "84-camaron.webp",
    "85": "85-hamster.webp",
    "86": "86-buey.webp",
    "87": "87-cabra.webp",
    "88": "88-erizo-de-mar.webp",
    "89": "89-anguila.webp",
    "90": "90-huron.webp",
    "91": "91-morrocoy.webp",
    "92": "92-cisne.webp",
    "93": "93-gaviota.webp",
    "94": "94-paujil.webp",
    "95": "95-escarabajo.webp",
    "96": "96-caballito-de-mar.webp",
    "97": "97-loro.webp",
    "98": "98-cocodrilo.webp",
    "99": "99-guacharito.webp"
};

/**
 * Gets current date in Caracas timezone (UTC-4)
 * @returns {string} Date in YYYY-MM-DD format
 */
function getCaracasDate() {
    const now = new Date();
    // Use Intl.DateTimeFormat to get Caracas date parts
    const formatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'America/Caracas',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
    return formatter.format(now);
}

/**
 * Main function to fetch results for Lotterly provider
 * @param {string} slug - The lottery slug (guacharo-activo, selva-plus, el-guacharito-millonario)
 */
async function syncLotterlyResults(slug) {
    const date = getCaracasDate();
    const url = `https://api.lotterly.co/v1/results/${slug}/?exact_date=${date}&extended=true`;
    
    const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://lotterly.co/',
        'Accept-Language': 'es-ES,es;q=0.9'
    };

    try {
        console.log(`Syncing ${slug} for date ${date}...`);
        const response = await fetch(url, { headers });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data && Array.isArray(data)) {
            processResults(slug, data);
        }
    } catch (error) {
        console.error(`Error syncing ${slug}:`, error);
    }
}

/**
 * Processes the JSON data and updates the DOM
 * @param {string} slug - The lottery slug
 * @param {Array} items - The results array from API
 */
function processResults(slug, items) {
    // Match slug to section ID in HTML
    const sectionId = slug; // Our IDs match slugs exactly
    const section = document.getElementById(sectionId);
    
    if (!section) {
        console.warn(`Section with ID "${sectionId}" not found.`);
        return;
    }

    items.forEach(item => {
        const drawTime = item.time; // Format "HH:MM:SS"
        const winnerNumber = item.results && item.results[0] ? String(item.results[0].result) : null;

        if (drawTime && winnerNumber) {
            updateCard(section, drawTime, winnerNumber);
        }
    });
}

/**
 * Updates a specific card in the DOM
 * @param {HTMLElement} section - The lottery section element
 * @param {string} drawTime - The time to match (data-time attribute)
 * @param {string} winnerNumber - The winning number string
 */
function updateCard(section, drawTime, winnerNumber) {
    const card = section.querySelector(`.result-card[data-time="${drawTime}"]`);
    
    if (card) {
        const imgContainer = card.querySelector('.animal-img');
        const fileName = ANIMAL_MAPPER[winnerNumber];
        
        if (fileName && imgContainer) {
            const imgPath = `assets/animalitos/${fileName}`;
            imgContainer.innerHTML = `<img src="${imgPath}" alt="${winnerNumber}">`;
        }
    }
}
