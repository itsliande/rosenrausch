// Environment Configuration für Frontend
// Diese Datei lädt Umgebungsvariablen für das Frontend

// API-Key wird durch GitHub Actions zur Build-Zeit ersetzt
// Lokaler Fallback für Entwicklung
window.FIREBASE_API_KEY = 'DEIN_ECHTER_API_KEY_HIER';

// Debug-Information
if (window.FIREBASE_API_KEY === 'DEIN_ECHTER_API_KEY_HIER') {
    console.warn('⚠️ WARNUNG: Standard API-Key wird verwendet. Bitte echten API-Key konfigurieren oder GitHub Actions verwenden.');
    console.log('💡 Für lokale Entwicklung: Ersetze "DEIN_ECHTER_API_KEY_HIER" mit echtem API-Key');
    console.log('🚀 Für Production: GitHub Secret API_KEY_RAUSHI wird automatisch verwendet');
} else {
    console.log('✅ Firebase API-Key ist konfiguriert');
}

console.log('🔧 Environment-Konfiguration geladen');