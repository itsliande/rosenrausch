/**
 * Lokale Entwicklungskonfiguration für Firebase
 * 
 * WICHTIG: Diese Datei wird von .gitignore ausgeschlossen!
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

// Setze den API-Key im window-Objekt für lokale Entwicklung
window.FIREBASE_API_KEY = 'DEIN_ECHTER_API_KEY_HIER';

console.log('🔧 Lokale Firebase-Konfiguration geladen');
console.log('💡 Für Produktion wird dieser Key durch GitHub Actions ersetzt');