// Firebase Configuration für Rosenrausch Admin Panel
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js';
import { FIREBASE_CONFIG } from './env-config.js';

console.log('🔧 Verwende Build-Zeit-Konfiguration');

// Firebase-Konfiguration von env-config.js verwenden
const firebaseConfig = FIREBASE_CONFIG;

// Firebase initialisieren
console.log('🔧 Firebase-Konfiguration wird geladen...');
console.log('📊 Config:', firebaseConfig);

// Prüfe Konfiguration
if (!firebaseConfig || !firebaseConfig.apiKey || firebaseConfig.apiKey === 'YOUR_API_KEY_HERE' || firebaseConfig.apiKey === 'DEIN_ECHTER_API_KEY_HIER') {
    console.error('❌ FEHLER: Firebase apiKey ist nicht konfiguriert!');
    console.log('💡 Bitte echte Firebase-Konfigurationswerte eintragen.');
} else {
    console.log('✅ Firebase apiKey ist konfiguriert');
    console.log('🔑 API-Key beginnt mit:', firebaseConfig.apiKey.substring(0, 10) + '...');
}

if (!firebaseConfig.projectId) {
    console.error('❌ FEHLER: Firebase projectId fehlt!');
} else {
    console.log('✅ Firebase projectId:', firebaseConfig.projectId);
}

// App und Services initialisieren
let app;
try {
    app = initializeApp(firebaseConfig);
    console.log('✅ Firebase App erfolgreich initialisiert');
    console.log('📱 App Name:', app.name);
    console.log('🔧 App Options:', app.options);
} catch (error) {
    console.error('❌ Firebase App Initialisierung fehlgeschlagen:', error);
    throw new Error('Firebase konnte nicht initialisiert werden. Bitte prüfen Sie die Konfiguration.');
}

// Services exportieren
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Debug-Informationen für Services
console.log('🔐 Auth Service:', auth ? '✅ Geladen' : '❌ Fehler');
console.log('🗄️ Firestore:', db ? '✅ Geladen' : '❌ Fehler');
console.log('💾 Storage:', storage ? '✅ Geladen' : '❌ Fehler');
console.log('🚀 Firebase-Setup abgeschlossen!');

export default app;