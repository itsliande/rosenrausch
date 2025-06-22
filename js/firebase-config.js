// Firebase Configuration für Rosenrausch Admin Panel
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js';

// Firebase Konfiguration
// WICHTIG: Diese Werte müssen durch echte Firebase-Konfiguration ersetzt werden
const firebaseConfig = {
  apiKey: "API_KEY_RAUSHI",
  authDomain: "rosenrasch.firebaseapp.com",
  projectId: "rosenrasch",
  storageBucket: "rosenrasch.firebasestorage.app",
  messagingSenderId: "238261942819",
  appId: "1:238261942819:web:3294f6c8031303f423cf96"
};

// Entwicklungs-Konfiguration
const DEV_MODE = true; // Auf false setzen für Produktion

// Firebase initialisieren
const app = initializeApp(firebaseConfig);

// Services exportieren
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;