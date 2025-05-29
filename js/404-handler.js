/**
 * 404-Handler für die Rosenrausch-Website
 * 
 * Diese Datei stellt zusätzliche Funktionalität für die 404-Fehlerseite bereit.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Versuche, dem Benutzer zu helfen, indem ähnliche Seiten vorgeschlagen werden
    const path = window.location.pathname;
    const fileName = path.split('/').pop();

    // Wenn es einen Seitennamen gibt, füge einen Hinweis in die Fehlermeldung ein
    if (fileName && fileName !== '404.html') {
        const messageElement = document.querySelector('.error-message');
        if (messageElement) {
            messageElement.innerHTML = `Ups! Seite <span style="color: #A855F7;">${fileName}</span> nicht gefunden`;
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
