// Firebase Configuration für Rosenrausch Admin Panel
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

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