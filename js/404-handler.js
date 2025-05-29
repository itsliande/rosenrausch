/**
 * Error-Handler für die Rosenrausch-Website
 * 
 * Diese Datei stellt zusätzliche Funktionalität für alle Fehlerseiten (404, 500, 403, usw.) bereit.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Easter Egg: Konami-Code und lustige Sprüche werden in easter-eggs.js verwaltet

    // Versuche, dem Benutzer zu helfen, indem ähnliche Seiten vorgeschlagen werden
    const path = window.location.pathname;
    const fileName = path.split('/').pop();

    // Wenn es einen Seitennamen gibt, füge einen Hinweis in die Fehlermeldung ein
    if (fileName && !['404.html', '500.html', '403.html', '401.html', '418.html', 'error.html'].includes(fileName)) {
        const messageElement = document.querySelector('.error-message');
        if (messageElement) {
            // Bestimme den aktuellen Fehlertyp basierend auf der Seite
            const errorCode = document.querySelector('.error-code')?.textContent.trim() || '';

            if (errorCode === '404') {
                messageElement.innerHTML = `Ups! Seite <span style="color: #A855F7;">${fileName}</span> nicht gefunden`;
            } else if (errorCode === '403') {
                messageElement.innerHTML = `Zugriff auf <span style="color: #A855F7;">${fileName}</span> verweigert`;
            } else if (errorCode === '401') {
                messageElement.innerHTML = `Nicht autorisiert für <span style="color: #A855F7;">${fileName}</span>`;
            } else if (errorCode === '500') {
                messageElement.innerHTML = `Serverfehler bei <span style="color: #A855F7;">${fileName}</span>`;
            } else if (errorCode === '418') {
                messageElement.innerHTML = `I'm a teapot, kann <span style="color: #A855F7;">${fileName}</span> nicht ausgeben`;
            } else {
                messageElement.innerHTML = `Fehler mit <span style="color: #A855F7;">${fileName}</span>`;
            }
        }

        // Füge einen Ereignislistener für die Schaltfläche "Zur Startseite" hinzu
        const homeButton = document.querySelector('a[href="index.html"]');
        if (homeButton) {
            homeButton.addEventListener('click', function() {
                // Optional: Tracking für 404-Fehler, falls später Analytics hinzugefügt werden
                console.log('404-Fehler behoben: Nutzer ging zur Startseite');
            });
        }
    }
});
