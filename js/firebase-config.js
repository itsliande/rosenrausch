// Firebase Configuration for Rosenrausch Admin Panel
// Based on https://github.com/itsliande/aboutme/blob/main/firebase-config.js

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js';

console.log('🔧 Firebase Configuration wird geladen...');

// Firebase configuration - API key will be replaced by GitHub Actions
const firebaseConfig = {
    apiKey: "API_KEY_RAUSHI",
    authDomain: "rosenrasch.firebaseapp.com",
    projectId: "rosenrasch",
    storageBucket: "rosenrasch.firebasestorage.app",
    messagingSenderId: "238261942819",
    appId: "1:238261942819:web:3294f6c8031303f423cf96"
};

// Check if we're in development mode and API key needs to be set
function getApiKey() {
    // Check if running locally and API key hasn't been replaced
    if (firebaseConfig.apiKey === "API_KEY_RAUSHI") {
        console.log('🔍 API-Key nicht durch GitHub Actions ersetzt - prüfe lokale Konfiguration...');
        
        // Check for local development API key
        if (typeof window !== 'undefined' && window.FIREBASE_API_KEY) {
            console.log('✅ Lokaler API-Key gefunden');
            return window.FIREBASE_API_KEY;
        }
        
        console.error('❌ Kein API-Key verfügbar!');
        console.log('💡 Für lokale Entwicklung: Setze window.FIREBASE_API_KEY in firebase-config.local.js');
        return null;
    }
    
    console.log('✅ API-Key durch GitHub Actions gesetzt');
    return firebaseConfig.apiKey;
}

// Get the actual API key
const actualApiKey = getApiKey();

// Replace error throw with a local-host check and dummy key fallback
if (!actualApiKey) {
    if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
        console.warn('⚠️ Kein API-Key verfügbar, verwende Dummy API Key für lokale Entwicklung.');
        firebaseConfig.apiKey = 'DUMMY_LOCAL_API_KEY'; // Fallback-Dummy-Key
    } else {
        throw new Error('Firebase API Key nicht verfügbar. Bitte lokale Konfiguration setzen oder GitHub Actions prüfen.');
    }
} else {
    // Update config with actual API key
    firebaseConfig.apiKey = actualApiKey;
}

// Initialize Firebase
console.log('🚀 Initialisiere Firebase App...');
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

console.log('✅ Firebase erfolgreich initialisiert');
console.log('📱 Project ID:', firebaseConfig.projectId);

// Export for use in other modules
export { app, auth, db };