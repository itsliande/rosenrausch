// Firebase Configuration für Rosenrausch Admin Panel
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase Konfiguration
// WICHTIG: Diese Werte müssen durch echte Firebase-Konfiguration ersetzt werden
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Firebase initialisieren
const app = initializeApp(firebaseConfig);

// Services exportieren
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;