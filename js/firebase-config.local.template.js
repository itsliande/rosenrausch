/**
 * Lokale Entwicklungskonfiguration für Firebase
 * 
 * Für lokale Entwicklung:
 * 1. Kopiere diese Datei zu: firebase-config.local.js
 * 2. Ersetze 'DEIN_ECHTER_API_KEY_HIER' mit deinem echten Firebase API-Key
 * 3. Lade diese Datei VOR firebase-config.js in deinem HTML
 * 
 * Beispiel HTML:
 * <script src="js/firebase-config.local.js"></script>
 * <script type="module" src="js/firebase-config.js"></script>
 */

// Lokale Firebase-Konfiguration für Entwicklung
// Template basierend auf https://github.com/itsliande/aboutme/blob/main/firebase-config.js

// ANWEISUNG FÜR LOKALE ENTWICKLUNG:
// 1. Kopiere diese Datei zu: js/firebase-config.local.js
// 2. Ersetze "DEIN_ECHTER_API_KEY_HIER" mit deinem echten Firebase API-Key
// 3. Diese Datei sollte NICHT in Git committed werden (.gitignore)

if (typeof window !== 'undefined') {
    // Setze den API-Key für lokale Entwicklung
    window.FIREBASE_API_KEY = 'DEIN_ECHTER_API_KEY_HIER';
    
    console.log('🔧 Lokale Firebase-Konfiguration Template geladen');
    console.log('💡 Bitte ersetze DEIN_ECHTER_API_KEY_HIER mit dem echten API-Key');
    console.log('🔐 Für Produktion wird dieser Key durch GitHub Actions ersetzt');
    
    // Warnung falls der Template-Key noch aktiv ist
    if (window.FIREBASE_API_KEY === 'DEIN_ECHTER_API_KEY_HIER') {
        console.warn('⚠️ WARNUNG: Template API-Key erkannt!');
        console.warn('   Bitte ersetze den API-Key in js/firebase-config.local.js');
        console.warn('   Beispiel: window.FIREBASE_API_KEY = "AIzaSyDSj2Xi-deinEchterKey...";');
    }
}