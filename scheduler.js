const cron = require('node-cron'); 
const { exec } = require('child_process'); 

console.log("🕒 Iniciando el Reloj Maestro (Scheduler)..."); 
console.log("Esperando la próxima hora programada para ejecutar los scrapers."); 

// Tarea 1: Lotto Activo Nacional (Minutos 0, 3, 6, 9, 12 y 15, entre las 8am y las 7pm) 
cron.schedule('0,3,6,9,12,15 8-19 * * *', () => { 
    console.log(`[${new Date().toLocaleTimeString()}] 🇻🇪 Despachando Scraper Nacional...`); 
    exec('node js/scrapers/lotto-activo-scraper.js', { timeout: 60000, windowsHide: true }, (error, stdout, stderr) => { 
        if (error) { 
            if (error.killed) console.error('[LOTERIA] Proceso terminado por Timeout de 60s'); 
            else console.error(`🚨 Error Nacional: ${error.message}`); 
        } 
        const output = stdout && stdout.trim(); 
        if (output) console.log(output); 
    }); 
}); 

// Tarea 2: Lotto Activo Internacional (Minutos 30, 33, 36, 39, 42 y 45, entre las 8am y las 7pm) 
cron.schedule('30,33,36,39,42,45 8-19 * * *', () => { 
    console.log(`[${new Date().toLocaleTimeString()}] 🌎 Despachando Scraper Internacional...`); 
    exec('node js/scrapers/lotto-activo-int-scraper.js', { timeout: 60000, windowsHide: true }, (error, stdout, stderr) => { 
        if (error) { 
            if (error.killed) console.error('[LOTERIA] Proceso terminado por Timeout de 60s'); 
            else console.error(`🚨 Error Internacional: ${error.message}`); 
        } 
        const output = stdout && stdout.trim(); 
        if (output) console.log(output); 
    }); 
}); 

// Tarea 3: La Granjita (Minutos 1, 4, 7, 10, 13 y 16, entre las 8am y las 7pm) 
cron.schedule('1,4,7,10,13,16 8-19 * * *', () => { 
    console.log(`[${new Date().toLocaleTimeString()}] 🚜 Despachando Scraper La Granjita...`); 
    exec('node js/scrapers/la-granjita-scraper.js', { timeout: 60000, windowsHide: true }, (error, stdout, stderr) => { 
        if (error) { 
            if (error.killed) console.error('[LOTERIA] Proceso terminado por Timeout de 60s'); 
            else console.error(`🚨 Error La Granjita: ${error.message}`); 
        } 
        const output = stdout && stdout.trim(); 
        if (output) console.log(output); 
    }); 
}); 
