const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

/**
 * Scraper for La Granjita using Puppeteer
 * Rules based on Spec.md Section 9
 */
async function scrapeLaGranjita() {
    const url = 'https://loteriadehoy.com/animalito/lagranjita/resultados/';
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    try {
        // Set viewport and user agent for better compatibility
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        
        console.log(`Navigating to ${url}...`);
        await page.goto(url, { waitUntil: 'networkidle2' });

        // Rule 1: Evasión de Anuncios - Esperar por .circle-legend
        console.log('Waiting for .circle-legend selector...');
        await page.waitForSelector('.circle-legend', { timeout: 15000 });

        const currentCaracasTime = getCurrentCaracasTime();
        console.log(`Current Caracas Time: ${currentCaracasTime}`);

        // Extraction logic inside page.evaluate
        const datosExtraidos = await page.evaluate(() => {
            // Rule 1: Iterar SOLO sobre elementos .circle-legend
            const items = document.querySelectorAll('.circle-legend');
            const scrapedData = [];

            items.forEach((element) => {
                // Rule 2: Separación de Texto (Animal y Número) en <h4>
                const h4Text = element.querySelector('h4')?.textContent.trim() || '';
                // Split by first space: "32 Ardilla" -> ["32", "Ardilla"]
                const firstSpaceIndex = h4Text.indexOf(' ');
                let result = '';
                let animal = '';

                if (firstSpaceIndex !== -1) {
                    result = h4Text.substring(0, firstSpaceIndex).trim();
                    animal = h4Text.substring(firstSpaceIndex + 1).trim();
                } else {
                    result = h4Text;
                }

                // Rule 3: Limpieza de Hora en <h5>
                // "La Granjita 09:00 AM" -> "09:00 AM"
                const h5Text = element.querySelector('h5')?.textContent.trim() || '';
                const timeCleaned = h5Text.replace('La Granjita ', '').trim();

                if (timeCleaned && result) {
                    // Local helper for time conversion to 24h (since we're in browser context)
                    const convertTo24hLocal = (time12h) => {
                        const match = time12h.match(/(\d{1,2}):(\d{2})\s?(AM|PM)/i);
                        if (!match) return "00:00:00";
                        let [_, hours, minutes, modifier] = match;
                        hours = parseInt(hours, 10);
                        modifier = modifier.toUpperCase();
                        if (modifier === 'PM' && hours < 12) hours += 12;
                        if (modifier === 'AM' && hours === 12) hours = 0;
                        return `${String(hours).padStart(2, '0')}:${minutes}:00`;
                    };

                    const formattedTime = convertTo24hLocal(timeCleaned);

                    scrapedData.push({
                        time: formattedTime,
                        results: [
                            {
                                result: result,
                                animal: animal
                            }
                        ]
                    });
                }
            });

            return scrapedData;
        });

        console.log("🕵️ DATOS CRUDOS ANTES DEL FILTRO:", datosExtraidos);

        // Section 8.1 Rule 7 (referenced in instructions): Filtro de "Viajeros del Tiempo"
        const results = datosExtraidos.filter(item => item.time <= currentCaracasTime);

        // Rule 4: Almacenamiento en la-granjita-today.json
        saveResultsToFile(results);

        console.log('--- La Granjita Scraped Results (Puppeteer) ---');
        console.log(JSON.stringify(results, null, 2));
        return results;

    } catch (error) {
        console.error("🚨 ERROR CRÍTICO EN SCRAPER:", error.message);
        return [];
    } finally {
        await browser.close();
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
    const filePath = path.join(dataDir, 'la-granjita-today.json');
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

// Execute
scrapeLaGranjita();
