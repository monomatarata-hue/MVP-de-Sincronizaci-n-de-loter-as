const cron = require('node-cron'); 
const { exec } = require('child_process'); 

console.log("🕒 Iniciando el Reloj Maestro (Scheduler)..."); 
console.log("Esperando la próxima hora programada para ejecutar los scrapers."); 

// Tarea 1: Lotto Activo Nacional (Minutos 0, 2 y 5, entre las 8am y las 7pm) 
cron.schedule('0,2,5 8-19 * * *', () => { 
    console.log(`[${new Date().toLocaleTimeString()}] 🇻🇪 Despachando Scraper Nacional...`); 
    exec('node js/scrapers/lotto-activo-scraper.js', (error, stdout, stderr) => { 
        if (error) console.error(`🚨 Error Nacional: ${error.message}`); 
        if (stdout) console.log(stdout.trim()); 
    }); 
}); 

// Tarea 2: Lotto Activo Internacional (Minutos 30, 32 y 35, entre las 8am y las 7pm) 
cron.schedule('30,32,35 8-19 * * *', () => { 
    console.log(`[${new Date().toLocaleTimeString()}] 🌎 Despachando Scraper Internacional...`); 
    exec('node js/scrapers/lotto-activo-int-scraper.js', (error, stdout, stderr) => { 
        if (error) console.error(`🚨 Error Internacional: ${error.message}`); 
        if (stdout) console.log(stdout.trim()); 
    }); 
});