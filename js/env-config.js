// Environment Configuration für Frontend
// Diese Datei lädt Umgebungsvariablen für das Frontend

// API-Key wird durch GitHub Actions zur Build-Zeit ersetzt
// Lokaler Fallback für Entwicklung
export const FIREBASE_API_KEY = 'DEIN_ECHTER_API_KEY_HIER';

export const FIREBASE_CONFIG = {
    apiKey: FIREBASE_API_KEY,
    authDomain: "rosenrasch.firebaseapp.com",
    projectId: "rosenrasch",
    storageBucket: "rosenrasch.firebasestorage.app",
    messagingSenderId: "238261942819",
    appId: "1:238261942819:web:3294f6c8031303f423cf96"
};

// Debug-Information
if (FIREBASE_API_KEY === 'DEIN_ECHTER_API_KEY_HIER') {
    console.warn('⚠️ WARNUNG: Standard API-Key wird verwendet. Bitte echten API-Key konfigurieren oder GitHub Actions verwenden.');
    console.log('💡 Für lokale Entwicklung: Ersetze "DEIN_ECHTER_API_KEY_HIER" mit echtem API-Key');
    console.log('🚀 Für Production: GitHub Secret API_KEY_RAUSHI wird automatisch verwendet');
} else {
    console.log('✅ Firebase API-Key ist konfiguriert');
}

console.log('🔧 Environment-Konfiguration geladen');