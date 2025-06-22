// Security Check für Firebase Admin Panel
(function() {
    'use strict';
    
    // Entwicklungs-Konfiguration - HIER KANNST DU DEV_MODE EIN/AUSSCHALTEN
    const DEV_MODE = true; // Auf false setzen für Produktion
    
    // Wenn Entwicklungsmodus aktiv ist, alle Sicherheitsmaßnahmen deaktivieren
    if (DEV_MODE) {
        console.log('%c🔧 Entwicklungsmodus aktiv!', 'color: green; font-size: 16px; font-weight: bold;');
        console.log('%c🔓 Alle Sicherheitschecks sind deaktiviert.', 'color: blue; font-size: 12px;');
        console.log('%c🔥 Firebase Admin Panel: Debug-Modus', 'color: orange; font-size: 12px;');
        return; // Beende das Script hier - keine Sicherheitsmaßnahmen werden ausgeführt
    }
    
    // Produktionsmodus - Sicherheitsmaßnahmen aktiviert
    console.log('%c🔐 Produktionsmodus aktiv!', 'color: red; font-size: 16px; font-weight: bold;');
    console.log('%c🛡️ Sicherheitschecks sind aktiviert.', 'color: orange; font-size: 12px;');
    console.log('%c🔥 Firebase Admin Panel: Geschützter Modus', 'color: red; font-size: 12px;');
    
    // Zusätzliche Firebase Admin Panel Sicherheit
    if (typeof window !== 'undefined') {
        // Überwache Firebase Auth State
        window.addEventListener('beforeunload', () => {
            console.log('🔐 Admin Session wird beendet...');
        });
        
        // Blockiere Console-Zugriff auf sensible Firebase-Objekte
        Object.defineProperty(window, 'adminPanel', {
            get() {
                console.warn('🚫 Zugriff auf adminPanel über Console blockiert');
                return undefined;
            },
            set() {
                console.warn('🚫 Manipulation von adminPanel über Console blockiert');
                return false;
            }
        });
    }
    
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
                console.log('%c🔥 Firebase Admin Panel Warnung!', 'color: red; font-size: 20px; font-weight: bold;');
                console.log('%cDies ist eine Browser-Funktion für Entwickler. Wenn dir jemand gesagt hat, dass du hier etwas kopieren und einfügen sollst, um ein Feature zu aktivieren oder jemand anderen zu "hacken", dann ist das ein Betrug und wird dieser Person Zugang zu deinem Admin-Account gewähren.', 'color: red; font-size: 16px;');
                console.log('%c🔐 Dieses Admin Panel verwaltet echte Daten über Firebase!', 'color: orange; font-size: 14px; font-weight: bold;');
                
                // Optional: Seite weiterleiten
                setTimeout(() => {
                    if (confirm('Sicherheitswarnung: DevTools erkannt. Zur Startseite zurückkehren?')) {
                        window.location.href = '/';
                    }
                }, 3000);
            }
        } else {
            devtools.open = false;
        }
    }, 500);
    
    // Disable Right Click Context Menu
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        console.log('🚫 Rechtsklick im Firebase Admin Panel deaktiviert');
        return false;
    });
    
    // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
    document.addEventListener('keydown', function(e) {
        // F12
        if (e.keyCode === 123) {
            e.preventDefault();
            console.log('🚫 F12 im Firebase Admin Panel deaktiviert');
            return false;
        }
        
        // Ctrl+Shift+I (DevTools)
        if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
            e.preventDefault();
            console.log('🚫 Ctrl+Shift+I im Firebase Admin Panel deaktiviert');
            return false;
        }
        
        // Ctrl+Shift+J (Console)
        if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
            e.preventDefault();
            console.log('🚫 Ctrl+Shift+J im Firebase Admin Panel deaktiviert');
            return false;
        }
        
        // Ctrl+U (View Source)
        if (e.ctrlKey && e.keyCode === 85) {
            e.preventDefault();
            console.log('🚫 Ctrl+U im Firebase Admin Panel deaktiviert');
            return false;
        }
        
        // Ctrl+S (Save)
        if (e.ctrlKey && e.keyCode === 83) {
            e.preventDefault();
            console.log('🚫 Ctrl+S im Firebase Admin Panel deaktiviert');
            return false;
        }
    });
    
    // Clear Console periodically (weniger aggressiv für Firebase Debugging)
    setInterval(() => {
        if (!window.location.href.includes('localhost') && !window.location.href.includes('127.0.0.1')) {
            console.clear();
            console.log('%c🔥 Firebase Admin Panel - Produktionsumgebung', 'color: #ff6b35; font-size: 14px; font-weight: bold;');
            console.log('%c🔐 Für Support: contact@rosenrausch.xyz', 'color: #4285f4; font-size: 12px;');
        }
    }, 2000); // Weniger frequent für bessere Firebase Konsolen-Logs
    
})();