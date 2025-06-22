// Firebase Configuration für Rosenrausch Admin Panel
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js';

console.log('🔧 Firebase-Konfiguration wird geladen...');

// Sichere API-Key-Funktion
function getSecureApiKey() {
    console.log('🔍 Suche nach Firebase API-Key...');
    
    // 1. Prüfe lokale Entwicklungskonfiguration
    if (typeof window !== 'undefined' && window.FIREBASE_API_KEY) {
        console.log('✅ API-Key aus lokaler Konfiguration geladen');
        return window.FIREBASE_API_KEY;
    }
    
    // 2. Prüfe HTML Meta-Tag
    const metaTag = document.querySelector('meta[name="firebase-api-key"]');
    if (metaTag && metaTag.content) {
        console.log('✅ API-Key aus Meta-Tag geladen');
        return metaTag.content;
    }
    
    // 3. GitHub Actions Placeholder (wird in Produktion ersetzt)
    const buildKey = "API_KEY_RAUSHI";
    if (buildKey !== "API_KEY_RAUSHI") {
        console.log('✅ API-Key durch GitHub Actions ersetzt');
        return buildKey;
    }
    
    console.error('❌ Kein gültiger API-Key gefunden!');
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

// Sichere Konfigurationsanzeige
console.log('📊 Config: ', {
    ...firebaseConfig,
    apiKey: apiKey ? `${apiKey.substring(0, 8)}...` : 'NICHT_GESETZT'
});

// Validierung der Konfiguration
if (!apiKey) {
    console.error('❌ FEHLER: Firebase apiKey ist nicht konfiguriert!');
    console.log('💡 Mögliche Lösungen:');
    console.log('   1. GitHub Actions: Stelle sicher, dass das Secret API_KEY_RAUSHI gesetzt ist');
    console.log('   2. Lokale Entwicklung: Setze window.FIREBASE_API_KEY in einer separaten Datei');
    console.log('   3. HTML Meta-Tag: <meta name="firebase-api-key" content="dein-key">');
    console.log('   4. Umgebungsvariable: FIREBASE_API_KEY=dein-key');
} else if (!apiKey.startsWith('AIza')) {
    console.warn('⚠️ WARNUNG: API-Key hat unerwartetes Format');
} else {
    console.log('✅ Firebase apiKey ist konfiguriert');
}

console.log('✅ Firebase projectId:', firebaseConfig.projectId);

// App initialisieren
let app;
try {
    app = initializeApp(firebaseConfig);
    console.log('✅ Firebase App erfolgreich initialisiert');
    console.log('📱 App Name:', app.name);
} catch (error) {
    console.error('❌ Firebase App Initialisierung fehlgeschlagen:', error);
    throw new Error('Firebase konnte nicht initialisiert werden. Bitte prüfen Sie die Konfiguration.');
}

// Services exportieren
export const auth = getAuth(app);
export const db = getFirestore(app);

console.log('🔐 Auth Service: ✅ Geladen');
console.log('🗄️ Firestore: ✅ Geladen');
console.log('🚀 Firebase-Setup abgeschlossen!');

export default app;