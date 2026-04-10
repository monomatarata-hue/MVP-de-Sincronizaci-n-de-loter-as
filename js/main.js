// Main execution file for Pruebas de Monomatarata
// v3.0 - Lotterly Synchronization Layer

document.addEventListener('DOMContentLoaded', () => {
    console.log("Monomatarata MVP v3.0 Initialized.");

    // Slugs defined in Spec.md Section 7.1
    const lotterlySlugs = [
        'guacharo-activo',
        'selva-plus',
        'el-guacharito-millonario'
    ];

    // Execution: Invoke sync for each Lotterly slug
    lotterlySlugs.forEach(slug => {
        syncLotterlyResults(slug);
    });
});
