// Einfache Firebase Configuration für Rosenrausch Admin Panel
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js';

console.log('🔧 Firebase-Konfiguration wird geladen...');

// Direkte Firebase-Konfiguration
// Der API-Key wird durch GitHub Actions zur Build-Zeit ersetzt
const firebaseConfig = {
    apiKey: "API_KEY_RAUSHI",
    authDomain: "rosenrasch.firebaseapp.com",
    projectId: "rosenrasch",
    storageBucket: "rosenrasch.firebasestorage.app",
    messagingSenderId: "238261942819",
    appId: "1:238261942819:web:3294f6c8031303f423cf96"
};

console.log('📊 Config:', firebaseConfig);

// Prüfe Konfiguration
if (!firebaseConfig.apiKey || firebaseConfig.apiKey === 'API_KEY_RAUSHI') {
    console.error('❌ FEHLER: Firebase apiKey ist nicht konfiguriert!');
    console.log('💡 Stelle sicher, dass GitHub Actions den API-Key ersetzt hat.');
} else {
    console.log('✅ Firebase apiKey ist konfiguriert');
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