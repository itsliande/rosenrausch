// Einfache Firebase Configuration für Rosenrausch Admin Panel
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js';

console.log('🔧 Firebase-Konfiguration wird geladen...');

// Sichere API-Key-Beschaffung mit mehreren Fallback-Optionen
function getSecureApiKey() {
    // 1. Prüfe ob GitHub Actions den Key ersetzt hat
    const buildTimeKey = "API_KEY_RAUSHI";
    if (buildTimeKey && buildTimeKey !== "API_KEY_RAUSHI" && buildTimeKey.startsWith("AIza")) {
        console.log('✅ API-Key über GitHub Actions Build geladen');
        return buildTimeKey;
    }
    
    // 2. Prüfe window-Objekt (für externe Key-Injection)
    if (typeof window !== 'undefined' && window.FIREBASE_API_KEY && window.FIREBASE_API_KEY.startsWith("AIza")) {
        console.log('✅ API-Key über window-Objekt geladen');
        return window.FIREBASE_API_KEY;
    }
    
    // 3. Prüfe meta-Tag im HTML
    if (typeof document !== 'undefined') {
        const metaTag = document.querySelector('meta[name="firebase-api-key"]');
        if (metaTag && metaTag.getAttribute('content') && metaTag.getAttribute('content').startsWith("AIza")) {
            console.log('✅ API-Key über Meta-Tag geladen');
            return metaTag.getAttribute('content');
        }
    }
    
    // 4. Prüfe Umgebungsvariable (für lokale Entwicklung)
    if (typeof process !== 'undefined' && process.env && process.env.FIREBASE_API_KEY && process.env.FIREBASE_API_KEY.startsWith("AIza")) {
        console.log('✅ API-Key über Umgebungsvariable geladen');
        return process.env.FIREBASE_API_KEY;
    }
    
    console.error('❌ Kein gültiger API-Key gefunden!');
    return null;
}

// Firebase-Konfiguration mit sicherem API-Key
const firebaseConfig = {
    apiKey: getSecureApiKey(),
    authDomain: "rosenrasch.firebaseapp.com",
    projectId: "rosenrasch",
    storageBucket: "rosenrasch.firebasestorage.app",
    messagingSenderId: "238261942819",
    appId: "1:238261942819:web:3294f6c8031303f423cf96"
};

// Sichere Konfigurationsanzeige (API-Key wird versteckt)
console.log('📊 Config:', {
    ...firebaseConfig,
    apiKey: firebaseConfig.apiKey ? `${firebaseConfig.apiKey.substring(0, 8)}...` : 'NICHT_GESETZT'
});

// Erweiterte Konfigurationsprüfung
if (!firebaseConfig.apiKey) {
    console.error('❌ FEHLER: Firebase apiKey ist nicht konfiguriert!');
    console.log('💡 Mögliche Lösungen:');
    console.log('   1. GitHub Actions: Stelle sicher, dass das Secret API_KEY_RAUSHI gesetzt ist');
    console.log('   2. Lokale Entwicklung: Setze window.FIREBASE_API_KEY in einer separaten Datei');
    console.log('   3. HTML Meta-Tag: <meta name="firebase-api-key" content="dein-key">');
    console.log('   4. Umgebungsvariable: FIREBASE_API_KEY=dein-key');
} else if (firebaseConfig.apiKey === 'API_KEY_RAUSHI') {
    console.error('❌ FEHLER: API-Key wurde nicht durch GitHub Actions ersetzt!');
    console.log('💡 Prüfe GitHub Actions Workflow und Secrets-Konfiguration');
} else if (!firebaseConfig.apiKey.startsWith('AIza')) {
    console.error('❌ FEHLER: Ungültiger Firebase API-Key Format!');
    console.log('💡 Firebase API-Keys beginnen normalerweise mit "AIza"');
} else {
    console.log('✅ Firebase API-Key erfolgreich und sicher geladen');
}

console.log('✅ Firebase projectId:', firebaseConfig.projectId);

// App und Services initialisieren
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
export const storage = getStorage(app);

console.log('🔐 Auth Service: ✅ Geladen');
console.log('🗄️ Firestore: ✅ Geladen');
console.log('💾 Storage: ✅ Geladen');
console.log('🚀 Firebase-Setup abgeschlossen!');

export default app;