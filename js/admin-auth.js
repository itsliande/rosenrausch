// Firebase Admin Authentication Manager
import { auth } from './firebase-config.js';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

class AdminAuth {
    constructor() {
        this.currentUser = null;
        this.adminEmails = [
            'contact@rosenrausch.xyz',
            'admin@rosenrausch.xyz',
            // Weitere Admin-E-Mails hier hinzufügen
        ];
        this.init();
    }

    init() {
        // Teste Firebase-Verbindung
        this.testFirebaseConnection();
        
        // Auth State Listener
        onAuthStateChanged(auth, (user) => {
            this.currentUser = user;
            console.log('Auth state changed:', user ? user.email : 'No user');
            this.updateUIState();
        });
    }

    async testFirebaseConnection() {
        try {
            console.log('Teste Firebase-Verbindung...');
            console.log('Auth object:', auth);
            console.log('Firebase config loaded:', !!auth.app);
            
            // Teste ob Firebase korrekt konfiguriert ist
            if (!auth.app.options.apiKey || auth.app.options.apiKey === 'YOUR_API_KEY_HERE') {
                console.error('Firebase ist nicht korrekt konfiguriert! Bitte die echten Werte in firebase-config.js eintragen.');
                this.showConfigError();
                return false;
            }
            
            console.log('Firebase-Verbindung erfolgreich');
            return true;
        } catch (error) {
            console.error('Firebase-Verbindungsfehler:', error);
            this.showConfigError();
            return false;
        }
    }

    showConfigError() {
        const errorDiv = document.getElementById('login-error');
        if (errorDiv) {
            errorDiv.textContent = 'Firebase ist nicht konfiguriert. Bitte die echten Konfigurationswerte in firebase-config.js eintragen.';
            errorDiv.style.display = 'block';
        }
    }

    async login(email, password) {
        try {
            console.log('Versuche Login mit:', email);
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            console.log('Login erfolgreich, prüfe Admin-Status für:', user.email);
            
            // Prüfen ob User Admin ist
            if (!this.adminEmails.includes(user.email)) {
                console.error('Kein Admin-Zugriff für:', user.email);
                await this.logout();
                throw new Error('Kein Admin-Zugriff für diese E-Mail-Adresse');
            }
            
            console.log('Admin erfolgreich eingeloggt:', user.email);
            return user;
        } catch (error) {
            console.error('Login Fehler:', error);
            if (error.code === 'auth/user-not-found') {
                throw new Error('Benutzer nicht gefunden');
            } else if (error.code === 'auth/wrong-password') {
                throw new Error('Falsches Passwort');
            } else if (error.code === 'auth/invalid-email') {
                throw new Error('Ungültige E-Mail-Adresse');
            } else if (error.code === 'auth/too-many-requests') {
                throw new Error('Zu viele fehlgeschlagene Versuche. Bitte versuchen Sie es später noch einmal.');
            } else {
                throw new Error(`Login-Fehler: ${error.message}`);
            }
        }
    }

    async logout() {
        try {
            await signOut(auth);
            console.log('Admin erfolgreich ausgeloggt');
        } catch (error) {
            console.error('Logout Fehler:', error);
            throw error;
        }
    }

    isAdmin() {
        return this.currentUser && this.adminEmails.includes(this.currentUser.email);
    }

    updateUIState() {
        const loginSection = document.getElementById('login-section');
        const adminPanel = document.getElementById('admin-panel');
        const userInfo = document.getElementById('admin-user-info');
        const logoutBtn = document.getElementById('logout-btn');
        
        if (this.isAdmin()) {
            if (loginSection) loginSection.style.display = 'none';
            if (adminPanel) adminPanel.style.display = 'block';
            if (userInfo) userInfo.textContent = `Eingeloggt als: ${this.currentUser.email}`;
            if (logoutBtn) logoutBtn.style.display = 'block';
        } else {
            if (loginSection) loginSection.style.display = 'block';
            if (adminPanel) adminPanel.style.display = 'none';
            if (userInfo) userInfo.textContent = 'Nicht eingeloggt';
            if (logoutBtn) logoutBtn.style.display = 'none';
        }
    }

    getCurrentUser() {
        return this.currentUser;
    }
}

export default AdminAuth;