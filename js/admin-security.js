// Security Check für Admin Panel
(function() {
    'use strict';
    
    // Entwicklungs-Konfiguration - HIER KANNST DU DEV_MODE EIN/AUSSCHALTEN
    const DEV_MODE = true; // Auf false setzen für Produktion
    
    // Wenn Entwicklungsmodus aktiv ist, alle Sicherheitsmaßnahmen deaktivieren
    if (DEV_MODE) {
        console.log('%cEntwicklungsmodus aktiv!', 'color: green; font-size: 16px; font-weight: bold;');
        console.log('%cAlle Sicherheitschecks sind deaktiviert.', 'color: blue; font-size: 12px;');
        return; // Beende das Script hier - keine Sicherheitsmaßnahmen werden ausgeführt
    }
    
    // Produktionsmodus - Sicherheitsmaßnahmen aktiviert
    console.log('%cProduktionsmodus aktiv!', 'color: red; font-size: 16px; font-weight: bold;');
    console.log('%cSicherheitschecks sind aktiviert.', 'color: orange; font-size: 12px;');
    
    // DevTools Detection
    let devtools = {
        open: false,
        orientation: null
    };
    
    const threshold = 160;
    
    setInterval(() => {
        if (window.outerHeight - window.innerHeight > threshold || 
            window.outerWidth - window.innerWidth > threshold) {
            if (!devtools.open) {
                devtools.open = true;
                console.clear();
                console.log('%cSTOP!', 'color: red; font-size: 50px; font-weight: bold;');
                console.log('%cDies ist eine Browser-Funktion für Entwickler. Wenn dir jemand gesagt hat, dass du hier etwas kopieren und einfügen sollst, um ein Feature zu aktivieren oder jemand anderen zu "hacken", dann ist das ein Betrug und wird dieser Person Zugang zu deinem Konto gewähren.', 'color: red; font-size: 16px;');
                
                // Optional: Seite weiterleiten
                setTimeout(() => {
                    window.location.href = '/';
                }, 3000);
            }
        } else {
            devtools.open = false;
        }
    }, 500);
    
    // Disable Right Click Context Menu
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });
    
    // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
    document.addEventListener('keydown', function(e) {
        // F12
        if (e.keyCode === 123) {
            e.preventDefault();
            return false;
        }
        
        // Ctrl+Shift+I (DevTools)
        if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
            e.preventDefault();
            return false;
        }
        
        // Ctrl+Shift+J (Console)
        if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
            e.preventDefault();
            return false;
        }
        
        // Ctrl+U (View Source)
        if (e.ctrlKey && e.keyCode === 85) {
            e.preventDefault();
            return false;
        }
        
        // Ctrl+S (Save)
        if (e.ctrlKey && e.keyCode === 83) {
            e.preventDefault();
            return false;
        }
    });
    
    // Clear Console periodically
    setInterval(() => {
        console.clear();
    }, 1000);
    
})();