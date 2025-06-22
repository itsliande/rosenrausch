// Einfache Firebase Configuration für Rosenrausch Admin Panel
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js';

console.log('🔧 Firebase-Konfiguration wird geladen...');

// Firebase-Konfiguration - API_KEY_RAUSHI wird von GitHub Actions ersetzt
const firebaseConfig = {
    apiKey: "API_KEY_RAUSHI",
    authDomain: "rosenrasch.firebaseapp.com",
    projectId: "rosenrasch",
    storageBucket: "rosenrasch.firebasestorage.app",
    messagingSenderId: "238261942819",
    appId: "1:238261942819:web:3294f6c8031303f423cf96"
};

// Konfigurationsprüfung
if (firebaseConfig.apiKey === "API_KEY_RAUSHI") {
    console.error('❌ FEHLER: API-Key wurde nicht durch GitHub Actions ersetzt!');
    console.log('💡 Für lokale Entwicklung: Setze window.FIREBASE_API_KEY');
    
    // Fallback für lokale Entwicklung
    if (typeof window !== 'undefined' && window.FIREBASE_API_KEY) {
        firebaseConfig.apiKey = window.FIREBASE_API_KEY;
        console.log('✅ API-Key über window.FIREBASE_API_KEY geladen');
    }
} else {
    console.log('✅ API-Key erfolgreich von GitHub Actions ersetzt');
}

// Sichere Konfigurationsanzeige (API-Key wird versteckt)
console.log('� Config:', {
    ...firebaseConfig,
    apiKey: firebaseConfig.apiKey && firebaseConfig.apiKey !== "API_KEY_RAUSHI" ? 
        `${firebaseConfig.apiKey.substring(0, 8)}...` : 'NICHT_GESETZT'
});

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