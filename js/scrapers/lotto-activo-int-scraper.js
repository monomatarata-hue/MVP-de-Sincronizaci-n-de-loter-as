const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

/**
 * Scraper for Lotto Activo Internacional using Puppeteer
 * Rules based on Spec.md Section 8.1
 */
async function scrapeLottoActivoInt() {
    const url = 'https://www.lottoactivo.com/resultados/lotto_activo_internacional/';
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    try {
        // Set viewport and user agent for better compatibility
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        
        console.log(`Navigating to ${url}...`);
        await page.goto(url, { waitUntil: 'networkidle2' });

        // OBLIGATORIO: Wait for dynamic content
        console.log('Waiting for #resultados p selector (Internacional)...');
        await page.waitForSelector('#resultados p', { timeout: 15000 });

        const currentCaracasTime = getCurrentCaracasTime();
        console.log(`Current Caracas Time: ${currentCaracasTime}`);

        // Extraction logic inside page.evaluate
        const datosExtraidos = await page.evaluate(() => {
            const items = document.querySelectorAll('#resultados > div');
            const scrapedData = [];

            items.forEach((element, index) => {
                if (scrapedData.length >= 12) return;

                // Rule 3: Extract Time from <p>
                const timeRaw = element.querySelector('p')?.textContent || '';
                const timeMatch = timeRaw.match(/(\d{1,2}:\d{2}\s?(AM|PM))/i);
                const time = timeMatch ? timeMatch[0].toUpperCase() : null;

                // Rule 4: Extract Number from <h6> <span class="badge">
                const number = element.querySelector('h6 span.badge')?.textContent.trim() || '';

                // Rule 5: Extract Animal from <h6> (TextNode)
                const h6 = element.querySelector('h6');
                let animal = '';
                if (h6) {
                    // Filter text nodes only
                    animal = Array.from(h6.childNodes)
                        .filter(node => node.nodeType === 3)
                        .map(node => node.textContent.trim())
                        .join('')
                        .trim();
                }

                if (time && number) {
                    // Local helper for time conversion (since we're in browser context)
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

                    const formattedTime = convertTo24hLocal(time);

                    scrapedData.push({
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

            return scrapedData;
        });

        console.log("🕵️ DATOS CRUDOS ANTES DEL FILTRO (Internacional):", datosExtraidos);

        // Rule 7: Filtro de "Viajeros del Tiempo"
        const results = datosExtraidos.filter(item => item.time <= currentCaracasTime);

        // Save results to physical JSON file
        saveResultsToFile(results);

        console.log('--- Lotto Activo Internacional Scraped Results (Puppeteer) ---');
        console.log(JSON.stringify(results, null, 2));
        return results;

    } catch (error) {
        console.error("🚨 ERROR CRÍTICO EN SCRAPER INTERNACIONAL:", error.message);
        console.error('Error scraping Lotto Activo Internacional:', error.message);
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

// Execute for verification
scrapeLottoActivoInt();