// Admin Login Script
// Basiert auf https://github.com/itsliande/aboutme/blob/main/admin-login.js

import { auth } from './firebase-config.js';
import { 
    signInWithEmailAndPassword,
    onAuthStateChanged 
} from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js';

class AdminLogin {
    constructor() {
        this.adminEmails = [
            'contact@rosenrausch.xyz',
            'admin@rosenrausch.xyz'
        ];
        this.init();
    }

    init() {
        console.log('🔑 Admin Login System wird initialisiert...');
        this.setupEventListeners();
        this.setupAuthListener();
    }

    setupEventListeners() {
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        const passwordToggle = document.getElementById('password-toggle');
        if (passwordToggle) {
            passwordToggle.addEventListener('click', () => this.togglePassword());
        }
    }

    setupAuthListener() {
        onAuthStateChanged(auth, (user) => {
            if (user && this.adminEmails.includes(user.email)) {
                console.log('✅ Admin bereits eingeloggt, weiterleiten...');
                this.redirectToAdmin();
            }
        });
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('login-error');
        const successDiv = document.getElementById('login-success');

        this.clearMessages();

        try {
            this.showLoading();
            console.log('🔑 Login-Versuch für:', email);
            
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            console.log('✅ Firebase-Login erfolgreich für:', user.email);
            
            // Prüfen ob User Admin ist
            if (!this.adminEmails.includes(user.email)) {
                console.error('❌ Kein Admin-Zugriff für:', user.email);
                throw new Error('Kein Admin-Zugriff für diese E-Mail-Adresse');
            }
            
            console.log('✅ Admin-Login erfolgreich');
            this.showSuccess('Login erfolgreich! Weiterleitung...');
            
            setTimeout(() => {
                this.redirectToAdmin();
            }, 1500);
            
        } catch (error) {
            console.error('❌ Login-Fehler:', error);
            this.showError(this.getErrorMessage(error));
        } finally {
            this.hideLoading();
        }
    }

    getErrorMessage(error) {
        switch (error.code) {
            case 'auth/user-not-found':
                return 'Benutzer nicht gefunden';
            case 'auth/wrong-password':
                return 'Falsches Passwort';
            case 'auth/invalid-email':
                return 'Ungültige E-Mail-Adresse';
            case 'auth/too-many-requests':
                return 'Zu viele fehlgeschlagene Versuche. Bitte später versuchen.';
            case 'auth/network-request-failed':
                return 'Netzwerk-Fehler. Prüfe deine Internetverbindung.';
            case 'auth/invalid-credential':
                return 'Ungültige Anmeldedaten';
            default:
                return error.message || 'Ein unbekannter Fehler ist aufgetreten';
        }
    }

    togglePassword() {
        const passwordInput = document.getElementById('password');
        const toggleIcon = document.querySelector('#password-toggle i');
        
        if (passwordInput && toggleIcon) {
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                toggleIcon.classList.replace('fa-eye', 'fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                toggleIcon.classList.replace('fa-eye-slash', 'fa-eye');
            }
        }
    }

    showError(message) {
        const errorDiv = document.getElementById('login-error');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
            
            setTimeout(() => {
                errorDiv.style.display = 'none';
            }, 5000);
        }
    }

    showSuccess(message) {
        const successDiv = document.getElementById('login-success');
        if (successDiv) {
            successDiv.textContent = message;
            successDiv.style.display = 'block';
        }
    }

    clearMessages() {
        const errorDiv = document.getElementById('login-error');
        const successDiv = document.getElementById('login-success');
        
        if (errorDiv) errorDiv.style.display = 'none';
        if (successDiv) successDiv.style.display = 'none';
    }

    showLoading() {
        const loginBtn = document.querySelector('.login-btn');
        if (loginBtn) {
            loginBtn.disabled = true;
            loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Anmelden...';
        }
    }

    hideLoading() {
        const loginBtn = document.querySelector('.login-btn');
        if (loginBtn) {
            loginBtn.disabled = false;
            loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Anmelden';
        }
    }

    redirectToAdmin() {
        window.location.href = 'admin.html';
    }
}

// CSS für Success-Message hinzufügen
const style = document.createElement('style');
style.textContent = `
    .success-message {
        background: rgba(34, 197, 94, 0.2);
        color: #22c55e;
        padding: 10px;
        border-radius: 8px;
        margin-top: 15px;
        border: 1px solid rgba(34, 197, 94, 0.3);
    }
`;
document.head.appendChild(style);

// Initialize Admin Login
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Admin Login wird gestartet...');
    new AdminLogin();
    console.log('✅ Admin Login bereit!');
});