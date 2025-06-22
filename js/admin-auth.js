// Admin Authentication Module
// Based on https://github.com/itsliande/aboutme/blob/main/admin-auth.js

import { auth } from './firebase-config.js';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js';

class AdminAuth {
    constructor() {
        this.currentUser = null;
        this.isAuthenticated = false;
        this.adminEmails = [
            'contact@rosenrausch.xyz',
            'admin@rosenrausch.xyz'
            // Add more admin emails here
        ];
        this.authCallbacks = [];
        this.init();
    }

    init() {
        console.log('🔐 Admin Auth System wird initialisiert...');
        
        // Setup auth state listener
        onAuthStateChanged(auth, (user) => {
            this.handleAuthChange(user);
        });
    }

    handleAuthChange(user) {
        this.currentUser = user;
        
        if (user) {
            console.log('👤 Benutzer eingeloggt:', user.email);
            
            // Check if user is admin
            if (this.adminEmails.includes(user.email)) {
                this.isAuthenticated = true;
                console.log('✅ Admin-Berechtigung bestätigt');
            } else {
                this.isAuthenticated = false;
                console.log('❌ E-Mail nicht in Admin-Whitelist');
                this.signOut(); // Sign out non-admin users
                return;
            }
        } else {
            this.isAuthenticated = false;
            console.log('👤 Benutzer ausgeloggt');
        }

        // Notify callbacks
        this.authCallbacks.forEach(callback => callback(this.isAuthenticated, this.currentUser));
    }

    async signIn(email, password) {
        try {
            console.log('🔑 Attempting sign in for:', email);
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log('✅ Sign in successful');
            return userCredential.user;
        } catch (error) {
            console.error('❌ Sign in error:', error);
            throw this.handleAuthError(error);
        }
    }

    async signOut() {
        try {
            await signOut(auth);
            console.log('🚪 Sign out successful');
        } catch (error) {
            console.error('❌ Sign out error:', error);
            throw error;
        }
    }

    handleAuthError(error) {
        switch (error.code) {
            case 'auth/user-not-found':
                return new Error('Benutzer nicht gefunden');
            case 'auth/wrong-password':
                return new Error('Falsches Passwort');
            case 'auth/invalid-email':
                return new Error('Ungültige E-Mail-Adresse');
            case 'auth/too-many-requests':
                return new Error('Zu viele fehlgeschlagene Versuche. Bitte später nochmal versuchen.');
            case 'auth/network-request-failed':
                return new Error('Netzwerkfehler. Bitte Internetverbindung prüfen.');
            default:
                return new Error(`Authentifizierungsfehler: ${error.message}`);
        }
    }

    onAuthStateChange(callback) {
        this.authCallbacks.push(callback);
        // Call immediately with current state
        callback(this.isAuthenticated, this.currentUser);
    }

    getCurrentUser() {
        return this.currentUser;
    }

    isAdmin() {
        return this.isAuthenticated;
    }
}

// Create and export singleton instance
const adminAuth = new AdminAuth();
export default adminAuth;