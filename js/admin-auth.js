// Admin Authentication Module
// Basiert auf https://github.com/itsliande/aboutme/blob/main/admin-auth.js

import { auth, db } from './firebase-config.js';
import { 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    sendPasswordResetEmail 
} from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js';
import { 
    doc, 
    getDoc 
} from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js';

class AdminAuth {
    constructor() {
        this.currentUser = null;
        this.isAdminUser = false;
        this.authStateCallbacks = [];
        
        // Admin E-Mail Whitelist
        this.adminEmails = [
            'contact@rosenrausch.xyz',
            'admin@rosenrausch.xyz'
        ];
        
        this.init();
    }

    init() {
        console.log('🔐 Admin Auth System wird initialisiert...');
        this.setupAuthStateListener();
    }

    setupAuthStateListener() {
        onAuthStateChanged(auth, async (user) => {
            this.currentUser = user;
            
            if (user) {
                console.log('👤 Benutzer eingeloggt:', user.email);
                
                // Prüfe Admin-Status
                this.isAdminUser = await this.checkAdminStatus(user);
                
                if (this.isAdminUser) {
                    console.log('✅ Admin-Berechtigung bestätigt');
                } else {
                    console.log('❌ Keine Admin-Berechtigung');
                    await this.signOut(); // Nicht-Admin ausloggen
                }
            } else {
                console.log('👤 Benutzer ausgeloggt');
                this.isAdminUser = false;
            }
            
            // Benachrichtige alle Callbacks
            this.authStateCallbacks.forEach(callback => {
                callback(user, this.isAdminUser);
            });
        });
    }

    async checkAdminStatus(user) {
        try {
            // Prüfe E-Mail Whitelist
            if (!this.adminEmails.includes(user.email)) {
                console.log('❌ E-Mail nicht in Admin-Whitelist:', user.email);
                return false;
            }

            // Optional: Zusätzliche Firestore-Prüfung
            try {
                const adminDoc = await getDoc(doc(db, 'admins', user.uid));
                if (adminDoc.exists()) {
                    const adminData = adminDoc.data();
                    console.log('📋 Admin-Daten aus Firestore:', adminData);
                    return adminData.isActive !== false;
                }
            } catch (firestoreError) {
                console.log('⚠️ Firestore Admin-Check fehlgeschlagen, verwende E-Mail-Whitelist');
            }

            // Fallback: E-Mail-Whitelist ist ausreichend
            return true;
            
        } catch (error) {
            console.error('❌ Fehler beim Admin-Status Check:', error);
            return false;
        }
    }

    async signIn(email, password) {
        try {
            console.log('🔑 Login-Versuch für:', email);
            
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            console.log('✅ Firebase Login erfolgreich');
            
            // Admin-Status wird automatisch durch onAuthStateChanged geprüft
            return user;
            
        } catch (error) {
            console.error('❌ Login-Fehler:', error);
            
            let errorMessage = 'Login fehlgeschlagen';
            
            switch (error.code) {
                case 'auth/user-not-found':
                    errorMessage = 'Benutzer nicht gefunden';
                    break;
                case 'auth/wrong-password':
                    errorMessage = 'Falsches Passwort';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Ungültige E-Mail-Adresse';
                    break;
                case 'auth/too-many-requests':
                    errorMessage = 'Zu viele fehlgeschlagene Versuche. Bitte später versuchen.';
                    break;
                case 'auth/network-request-failed':
                    errorMessage = 'Netzwerk-Fehler. Prüfe deine Internetverbindung.';
                    break;
                case 'auth/invalid-credential':
                    errorMessage = 'Ungültige Anmeldedaten';
                    break;
                default:
                    errorMessage = error.message || 'Ein unbekannter Fehler ist aufgetreten';
            }
            
            throw new Error(errorMessage);
        }
    }

    async signOut() {
        try {
            await signOut(auth);
            console.log('👋 Logout erfolgreich');
        } catch (error) {
            console.error('❌ Logout-Fehler:', error);
            throw error;
        }
    }

    async resetPassword(email) {
        try {
            await sendPasswordResetEmail(auth, email);
            console.log('📧 Passwort-Reset E-Mail gesendet an:', email);
            return true;
        } catch (error) {
            console.error('❌ Passwort-Reset Fehler:', error);
            throw error;
        }
    }

    // Callback für Auth-State-Änderungen registrieren
    onAuthStateChanged(callback) {
        this.authStateCallbacks.push(callback);
        
        // Sofortiger Aufruf mit aktuellem Status
        callback(this.currentUser, this.isAdminUser);
    }

    // Getter für aktuellen Status
    getCurrentUser() {
        return this.currentUser;
    }

    isAdmin() {
        return this.isAdminUser;
    }

    isAuthenticated() {
        return this.currentUser !== null && this.isAdminUser;
    }
}

// Singleton Instance
const adminAuth = new AdminAuth();

export default adminAuth;