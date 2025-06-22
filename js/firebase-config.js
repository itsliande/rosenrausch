// Firebase Configuration für Rosenrausch Admin Panel
// Basiert auf https://github.com/itsliande/aboutme/blob/main/firebase-config.js

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js';

// Firebase-Konfiguration (API_KEY_RAUSHI wird durch GitHub Actions ersetzt)
const firebaseConfig = {
    apiKey: "API_KEY_RAUSHI",
    authDomain: "rosenrasch.firebaseapp.com",
    projectId: "rosenrasch",
    storageBucket: "rosenrasch.firebasestorage.app",
    messagingSenderId: "238261942819",
    appId: "1:238261942819:web:3294f6c8031303f423cf96"
};

// Überprüfe ob API-Key ersetzt wurde
if (firebaseConfig.apiKey === "API_KEY_RAUSHI") {
    console.error('❌ Firebase API-Key wurde nicht durch GitHub Actions ersetzt!');
    console.log('💡 Für lokale Entwicklung: Setze window.FIREBASE_API_KEY vor dem Laden dieser Datei');
    
    // Fallback für lokale Entwicklung
    if (typeof window !== 'undefined' && window.FIREBASE_API_KEY) {
        firebaseConfig.apiKey = window.FIREBASE_API_KEY;
        console.log('✅ API-Key aus window.FIREBASE_API_KEY geladen');
    } else {
        console.error('❌ Kein API-Key verfügbar! Setze window.FIREBASE_API_KEY für lokale Entwicklung.');
        throw new Error('Firebase API-Key nicht verfügbar');
    }
} else {
    console.log('✅ Firebase API-Key wurde erfolgreich gesetzt');
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
export { app, auth, db };