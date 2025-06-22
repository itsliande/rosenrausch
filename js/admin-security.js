// Security Check für Admin Panel
(function() {
    'use strict';
    
    // Prüfe ob wir uns auf der Admin-Seite befinden
    if (!window.location.pathname.includes('admin')) {
        return;
    }
    
    // Blockiere DevTools nur in Produktion (nicht localhost/development)
    const isProduction = window.location.hostname !== 'localhost' && 
                        window.location.hostname !== '127.0.0.1' && 
                        !window.location.hostname.includes('github.dev') &&
                        !window.location.hostname.includes('gitpod') &&
                        !window.location.hostname.includes('codespaces');
    
    if (isProduction) {
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
    }
    
    // Disable Right Click Context Menu (nur in Produktion)
    if (isProduction) {
        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            return false;
        });
    }
    
    // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U (nur in Produktion)
    if (isProduction) {
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
    }
    
    // Clear Console periodically (nur in Produktion)
    if (isProduction) {
        setInterval(() => {
            console.clear();
        }, 1000);
    }
    
    // Add warning message
    console.log('%cSicherheitswarnung!', 'color: red; font-size: 20px; font-weight: bold;');
    console.log('%cDieser Bereich ist nur für autorisierte Administratoren zugänglich.', 'color: orange; font-size: 14px;');
    
})();