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

// Enhanced error handling for production
if (!actualApiKey) {
    const isLocalhost = typeof window !== 'undefined' && 
        (window.location.hostname === 'localhost' || 
         window.location.hostname === '127.0.0.1' ||
         window.location.hostname === '');
    
    if (isLocalhost) {
        console.warn('⚠️ Kein API-Key verfügbar, verwende Dummy API Key für lokale Entwicklung.');
        firebaseConfig.apiKey = 'DUMMY_LOCAL_API_KEY';
    } else {
        // In production, show more helpful error
        console.error('🚨 PRODUCTION ERROR: Firebase API Key nicht verfügbar!');
        console.error('🔧 GitHub Actions Deployment-Problem erkannt');
        console.error('💡 Admin: Prüfe GitHub Secrets und Deployment-Logs');
        
        // Don't throw error immediately, try to provide fallback
        console.warn('🔄 Versuche Fallback-Initialisierung...');
        firebaseConfig.apiKey = 'PRODUCTION_ERROR_FALLBACK';
    }
} else {
    // Update config with actual API key
    firebaseConfig.apiKey = actualApiKey;
}

// Initialize Firebase with error handling
console.log('🚀 Initialisiere Firebase App...');
try {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);
    
    console.log('✅ Firebase erfolgreich initialisiert');
    console.log('📱 Project ID:', firebaseConfig.projectId);
    
    // Export for use in other modules
    export { app, auth, db };
} catch (error) {
    console.error('🚨 Firebase Initialisierung fehlgeschlagen:', error);
    
    // Create dummy exports to prevent import errors
    const dummyApp = { name: 'dummy-app' };
    const dummyAuth = { currentUser: null };
    const dummyDb = { app: dummyApp };
    
    console.warn('🔄 Dummy Firebase Objekte erstellt um Import-Fehler zu vermeiden');
    export { dummyApp as app, dummyAuth as auth, dummyDb as db };
}