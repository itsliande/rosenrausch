// Environment Configuration für Frontend
// Diese Datei lädt Umgebungsvariablen für das Frontend

// Für lokale Entwicklung - kann durch Build-Prozess ersetzt werden
window.FIREBASE_API_KEY = window.FIREBASE_API_KEY || 'DEIN_ECHTER_API_KEY_HIER';

// Debug-Information
if (window.FIREBASE_API_KEY === 'DEIN_ECHTER_API_KEY_HIER') {
    console.warn('⚠️ WARNUNG: Standard API-Key wird verwendet. Bitte echten API-Key konfigurieren.');
}

console.log('🔧 Environment-Konfiguration geladen');