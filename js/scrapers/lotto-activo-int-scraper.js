const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

/**
 * Scraper for Lotto Activo Internacional
 * Rules based on Spec.md Section 8.1 (Same as national version)
 */
async function scrapeLottoActivoInt() {
    const url = 'https://www.lottoactivo.com/resultados/lotto_activo_internacional/';
    const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://www.lottoactivo.com/',
        'Accept-Language': 'es-ES,es;q=0.9'
    };

    try {
        const { data } = await axios.get(url, { 
            headers,
            timeout: 5000 
        });
        const $ = cheerio.load(data);
        let results = [];

        // 1. Target container id="resultados"
        const items = $('#resultados .thumbnail');
        console.log('Found results items (International):', items.length);

        const currentCaracasTime = getCurrentCaracasTime();
        console.log(`Current Caracas Time: ${currentCaracasTime}`);

        items.each((index, element) => {
            if (results.length >= 12) return false;

            // Rule 3: Extract Time from <p>
            const timeRaw = $(element).find('p').text();
            const timeMatch = timeRaw.match(/(\d{1,2}:\d{2}\s?(AM|PM))/i);
            const time = timeMatch ? timeMatch[0].toUpperCase() : null;

            // Rule 4: Extract Number from <h6> <span class="badge">
            const number = $(element).find('h6 span.badge').text().trim();

            // Rule 5: Extract Animal from <h6> (Text Node)
            const animal = $(element).find('h6').contents().filter(function() {
                return this.nodeType === 3;
            }).text().trim();

            if (time && number) {
                const formattedTime = convertTo24h(time);

                // Rule 7: Filtro de "Viajeros del Tiempo"
                if (formattedTime > currentCaracasTime) {
                    console.log(`Skipping future/yesterday draw (Int): ${time} (${formattedTime})`);
                    return; 
                }

                results.push({
                    time: formattedTime,
                    results: [
                        {
                            result: number,
                            animal: animal
                        }
                    ]
                });
            }
        });

        // Save to physical JSON file
        saveResultsToFile(results);

        console.log('--- Lotto Activo Internacional Scraped Results ---');
        console.log(JSON.stringify(results, null, 2));
        return results;

    } catch (error) {
        console.error('Error scraping Lotto Activo Internacional:', error.message);
        return [];
    }
}

/**
 * Saves the scraped results to a JSON file in /data directory
 */
function saveResultsToFile(data) {
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
    const filePath = path.join(dataDir, 'lotto-activo-int-today.json');
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Results saved to: ${filePath}`);
}

/**
 * Gets current time in Caracas timezone (UTC-4)
 */
function getCurrentCaracasTime() {
    const now = new Date();
    const options = {
        timeZone: 'America/Caracas',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    };
    return new Intl.DateTimeFormat('en-US', options).format(now);
}

/**
 * Helper to convert 12h (AM/PM) to 24h (HH:MM:SS)
 */
function convertTo24h(time12h) {
    const match = time12h.match(/(\d{1,2}):(\d{2})\s?(AM|PM)/i);
    if (!match) return "00:00:00";
    
    let [_, hours, minutes, modifier] = match;
    hours = parseInt(hours, 10);
    modifier = modifier.toUpperCase();

    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;

    return `${String(hours).padStart(2, '0')}:${minutes}:00`;
}

// Execute for verification
scrapeLottoActivoInt();