// Firebase Configuration für Rosenrausch Admin Panel
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js';

console.log('🔧 Firebase-Konfiguration wird geladen...');

// Sichere API-Key-Funktion
function getSecureApiKey() {
    console.log('🔍 Suche nach Firebase API-Key...');
    
    // 1. GitHub Actions ersetzt diesen Wert in der Produktion
    const buildTimeKey = "API_KEY_RAUSHI";
    if (buildTimeKey && buildTimeKey !== "API_KEY_RAUSHI") {
        console.log('✅ API-Key durch GitHub Actions geladen');
        return buildTimeKey;
    }
    
    // 2. Prüfe lokale Entwicklungskonfiguration
    if (typeof window !== 'undefined' && window.FIREBASE_API_KEY) {
        console.log('✅ API-Key aus lokaler Konfiguration geladen');
        return window.FIREBASE_API_KEY;
    }
    
    // 3. Prüfe HTML Meta-Tag
    const metaTag = document.querySelector('meta[name="firebase-api-key"]');
    if (metaTag && metaTag.content) {
        console.log('✅ API-Key aus Meta-Tag geladen');
        return metaTag.content;
    }
    
    // 4. Prüfe Umgebungsvariable (falls verfügbar)
    if (typeof process !== 'undefined' && process.env && process.env.FIREBASE_API_KEY) {
        console.log('✅ API-Key aus Umgebungsvariable geladen');
        return process.env.FIREBASE_API_KEY;
    }
    
    console.error('❌ Kein gültiger API-Key gefunden!');
    console.log('💡 Für lokale Entwicklung: Erstelle js/firebase-config.local.js');
    return null;
}

const apiKey = getSecureApiKey();

// Firebase-Konfiguration
const firebaseConfig = {
    apiKey: apiKey,
    authDomain: "rosenrasch.firebaseapp.com",
    projectId: "rosenrasch",
    storageBucket: "rosenrasch.firebasestorage.app",
    messagingSenderId: "238261942819",
    appId: "1:238261942819:web:3294f6c8031303f423cf96"
};

// Debug-Ausgabe (ohne den echten Key zu zeigen)
console.log('📊 Firebase Config Status:');
console.log('   API-Key:', apiKey ? `${apiKey.substring(0, 8)}...` : 'NICHT_GESETZT');
console.log('   Project ID:', firebaseConfig.projectId);
console.log('   Auth Domain:', firebaseConfig.authDomain);

// Validierung der Konfiguration
if (!apiKey) {
    console.error('❌ FEHLER: Firebase apiKey ist nicht konfiguriert!');
    console.log('💡 Mögliche Lösungen:');
    console.log('   1. GitHub Actions: Stelle sicher, dass das Secret API_KEY_RAUSHI gesetzt ist');
    console.log('   2. Lokale Entwicklung: Erstelle js/firebase-config.local.js mit window.FIREBASE_API_KEY');
    throw new Error('Firebase API-Key fehlt');
} else if (!apiKey.startsWith('AIza')) {
    console.warn('⚠️ WARNUNG: API-Key hat unerwartetes Format');
} else {
    console.log('✅ Firebase API-Key ist konfiguriert');
}

// Firebase App initialisieren
let app, auth, db;

try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    
    console.log('✅ Firebase App erfolgreich initialisiert');
    console.log('📱 App Name:', app.name);
} catch (error) {
    console.error('❌ Fehler beim Initialisieren von Firebase:', error);
    throw error;
}

// Exports für andere Module
window.firebaseApp = app;
window.firebaseAuth = auth;
window.firebaseDB = db;

export { app, auth, db };