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
        // Auth State Listener
        onAuthStateChanged(auth, (user) => {
            this.currentUser = user;
            this.updateUIState();
        });
    }

    async login(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            // Prüfen ob User Admin ist
            if (!this.adminEmails.includes(user.email)) {
                await this.logout();
                throw new Error('Kein Admin-Zugriff für diese E-Mail-Adresse');
            }
            
            console.log('Admin erfolgreich eingeloggt:', user.email);
            return user;
        } catch (error) {
            console.error('Login Fehler:', error);
            throw error;
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
        
        if (this.isAdmin()) {
            if (loginSection) loginSection.style.display = 'none';
            if (adminPanel) adminPanel.style.display = 'block';
        } else {
            if (loginSection) loginSection.style.display = 'block';
            if (adminPanel) adminPanel.style.display = 'none';
        }
    }

    getCurrentUser() {
        return this.currentUser;
    }
}

export default AdminAuth;