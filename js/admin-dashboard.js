// Admin Dashboard Module
// Based on https://github.com/itsliande/aboutme/blob/main/admin-dashboard.js

import { db } from './firebase-config.js';
import adminAuth from './admin-auth.js';
import {
    collection,
    doc,
    getDocs,
    setDoc,
    deleteDoc,
    addDoc,
    query,
    orderBy,
    Timestamp
} from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js';

class AdminDashboard {
    constructor() {
        this.currentTab = 'team';
        this.collections = {
            team: 'team-members',
            news: 'news-items',
            events: 'events',
            quotes: 'quotes'
        };
        this.init();
    }

    init() {
        console.log('📊 Admin Dashboard wird initialisiert...');
        
        // Wait for auth state
        adminAuth.onAuthStateChange((isAuthenticated, user) => {
            this.updateUIState(isAuthenticated, user);
            if (isAuthenticated) {
                this.loadCurrentTabData();
            }
        });

        this.setupEventListeners();
        this.setupTabSwitching();
    }

    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }

        // Password toggle
        const passwordToggle = document.getElementById('password-toggle');
        if (passwordToggle) {
            passwordToggle.addEventListener('click', () => this.togglePassword());
        }

        // Modal events
        const modalClose = document.getElementById('modal-close');
        const modalCancel = document.getElementById('modal-cancel');
        const modalSave = document.getElementById('modal-save');
        
        if (modalClose) modalClose.addEventListener('click', () => this.closeModal());
        if (modalCancel) modalCancel.addEventListener('click', () => this.closeModal());
        if (modalSave) modalSave.addEventListener('click', () => this.saveCurrentModal());

        // Close modal on backdrop click
        const modal = document.getElementById('edit-modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target.id === 'edit-modal') {
                    this.closeModal();
                }
            });
        }
    }

    setupTabSwitching() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabName = btn.getAttribute('data-tab');
                this.switchTab(tabName);
            });
        });
    }

    switchTab(tabName) {
        // Update active tab button
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-tab="${tabName}"]`)?.classList.add('active');

        // Update active tab content
        document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
        document.getElementById(`${tabName}-tab`)?.classList.add('active');

        this.currentTab = tabName;
        
        if (adminAuth.isAdmin()) {
            this.loadCurrentTabData();
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('login-error');

        errorDiv.style.display = 'none';

        try {
            this.showLoading();
            await adminAuth.signIn(email, password);
            // Auth state change will be handled by the listener
        } catch (error) {
            console.error('❌ Login error:', error);
            errorDiv.textContent = error.message;
            errorDiv.style.display = 'block';
            
            setTimeout(() => {
                errorDiv.style.display = 'none';
            }, 5000);
        } finally {
            this.hideLoading();
        }
    }

    async handleLogout() {
        try {
            await adminAuth.signOut();
            // Reset form
            const loginForm = document.getElementById('login-form');
            if (loginForm) loginForm.reset();
        } catch (error) {
            console.error('❌ Logout error:', error);
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

    updateUIState(isAuthenticated, user) {
        const loginSection = document.getElementById('login-section');
        const adminPanel = document.getElementById('admin-panel');
        const userInfo = document.getElementById('admin-user-info');
        const logoutBtn = document.getElementById('logout-btn');
        
        if (isAuthenticated && user) {
            if (loginSection) loginSection.style.display = 'none';
            if (adminPanel) adminPanel.style.display = 'block';
            if (userInfo) userInfo.textContent = `Eingeloggt als: ${user.email}`;
            if (logoutBtn) logoutBtn.style.display = 'block';
        } else {
            if (loginSection) loginSection.style.display = 'block';
            if (adminPanel) adminPanel.style.display = 'none';
            if (userInfo) userInfo.textContent = 'Nicht eingeloggt';
            if (logoutBtn) logoutBtn.style.display = 'none';
        }
    }

    async loadCurrentTabData() {
        if (!adminAuth.isAdmin()) return;
        
        this.showLoading();
        
        try {
            console.log(`📊 Lade ${this.currentTab} Daten...`);
            
            switch (this.currentTab) {
                case 'team':
                    await this.loadTeamData();
                    break;
                case 'news':
                    await this.loadNewsData();
                    break;
                case 'events':
                    await this.loadEventsData();
                    break;
                case 'quotes':
                    await this.loadQuotesData();
                    break;
            }
            
        } catch (error) {
            console.error(`❌ Fehler beim Laden der ${this.currentTab} Daten:`, error);
            this.showError(`Fehler beim Laden der Daten: ${error.message}`);
        } finally {
            this.hideLoading();
        }
    }

    async loadTeamData() {
        try {
            const querySnapshot = await getDocs(collection(db, this.collections.team));
            const categories = {};
            
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (!categories[data.category]) {
                    categories[data.category] = {
                        name: data.category,
                        active: data.categoryActive !== false,
                        members: []
                    };
                }
                categories[data.category].members.push({
                    id: doc.id,
                    ...data
                });
            });

            this.renderTeamData(Object.values(categories));
        } catch (error) {
            console.error('❌ Error loading team data:', error);
            throw error;
        }
    }

    async loadNewsData() {
        try {
            const q = query(collection(db, this.collections.news), orderBy('date', 'desc'));
            const querySnapshot = await getDocs(q);
            const news = [];
            
            querySnapshot.forEach((doc) => {
                news.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            this.renderNewsData(news);
        } catch (error) {
            console.error('❌ Error loading news data:', error);
            throw error;
        }
    }

    async loadEventsData() {
        try {
            const q = query(collection(db, this.collections.events), orderBy('date', 'asc'));
            const querySnapshot = await getDocs(q);
            const events = [];
            
            querySnapshot.forEach((doc) => {
                events.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            this.renderEventsData(events);
        } catch (error) {
            console.error('❌ Error loading events data:', error);
            throw error;
        }
    }

    async loadQuotesData() {
        try {
            const q = query(collection(db, this.collections.quotes), orderBy('date', 'desc'));
            const querySnapshot = await getDocs(q);
            const quotes = [];
            
            querySnapshot.forEach((doc) => {
                quotes.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            this.renderQuotesData(quotes);
        } catch (error) {
            console.error('❌ Error loading quotes data:', error);
            throw error;
        }
    }

    renderTeamData(categories) {
        const teamList = document.getElementById('team-list');
        if (!teamList) return;

        teamList.innerHTML = '';
        
        categories.forEach(category => {
            if (category.active !== false) {
                category.members.forEach(member => {
                    const item = this.createDataItem({
                        title: member.name,
                        meta: `${member.role} | ${member.category}`,
                        content: member.bio,
                        id: member.id,
                        type: 'team'
                    });
                    teamList.appendChild(item);
                });
            }
        });
    }

    renderNewsData(news) {
        const newsList = document.getElementById('news-list');
        if (!newsList) return;

        newsList.innerHTML = '';
        
        news.forEach(item => {
            const dataItem = this.createDataItem({
                title: item.title,
                meta: `${item.date} | ${item.active ? 'Aktiv' : 'Inaktiv'}`,
                content: item.content.substring(0, 200) + '...',
                id: item.id,
                type: 'news'
            });
            newsList.appendChild(dataItem);
        });
    }

    renderEventsData(events) {
        const eventsList = document.getElementById('events-list');
        if (!eventsList) return;

        eventsList.innerHTML = '';
        
        events.forEach(event => {
            const item = this.createDataItem({
                title: event.title,
                meta: `${event.date} | ${event.location}`,
                content: event.description,
                id: event.id,
                type: 'events'
            });
            eventsList.appendChild(item);
        });
    }

    renderQuotesData(quotes) {
        const quotesList = document.getElementById('quotes-list');
        if (!quotesList) return;

        quotesList.innerHTML = '';
        
        quotes.forEach(quote => {
            const item = this.createDataItem({
                title: `"${quote.text}"`,
                meta: `${quote.date} | ${quote.context || 'Kein Kontext'}`,
                content: '',
                id: quote.id,
                type: 'quotes'
            });
            quotesList.appendChild(item);
        });
    }

    createDataItem({ title, meta, content, id, type }) {
        const item = document.createElement('div');
        item.className = 'data-item';
        item.innerHTML = `
            <div class="data-item-header">
                <div>
                    <div class="data-item-title">${title}</div>
                    <div class="data-item-meta">${meta}</div>
                </div>
                <div class="data-item-actions">
                    <button class="btn-edit" onclick="adminDashboard.editItem('${type}', '${id}')">
                        <i class="fas fa-edit"></i> Bearbeiten
                    </button>
                    <button class="btn-delete" onclick="adminDashboard.deleteItem('${type}', '${id}')">
                        <i class="fas fa-trash"></i> Löschen
                    </button>
                </div>
            </div>
            ${content ? `<div class="data-item-content">${content}</div>` : ''}
        `;
        return item;
    }

    // Modal and CRUD operations
    openModal(type, data = null) {
        const title = data ? `${type} bearbeiten` : `Neuen ${type} hinzufügen`;
        document.getElementById('modal-title').textContent = title;
        
        const formContent = this.getFormContent(type, data);
        document.getElementById('modal-body').innerHTML = formContent;
        
        document.getElementById('edit-modal').style.display = 'flex';
        
        this.currentEdit = { type, data };
    }

    closeModal() {
        document.getElementById('edit-modal').style.display = 'none';
        this.currentEdit = null;
    }

    getFormContent(type, data) {
        switch (type) {
            case 'team':
                return this.getTeamForm(data);
            case 'news':
                return this.getNewsForm(data);
            case 'events':
                return this.getEventsForm(data);
            case 'quotes':
                return this.getQuotesForm(data);
            default:
                return '<p>Unbekannter Typ</p>';
        }
    }

    getTeamForm(data) {
        return `
            <div class="form-group">
                <label for="member-name">Name</label>
                <input type="text" id="member-name" value="${data?.name || ''}" required>
            </div>
            <div class="form-group">
                <label for="member-role">Rolle</label>
                <input type="text" id="member-role" value="${data?.role || ''}" required>
            </div>
            <div class="form-group">
                <label for="member-category">Kategorie</label>
                <input type="text" id="member-category" value="${data?.category || ''}" required>
            </div>
            <div class="form-group">
                <label for="member-bio">Bio</label>
                <textarea id="member-bio" required>${data?.bio || ''}</textarea>
            </div>
            <div class="form-group">
                <label for="member-image">Bild URL</label>
                <input type="url" id="member-image" value="${data?.image || ''}" required>
            </div>
        `;
    }

    getNewsForm(data) {
        return `
            <div class="form-group">
                <label for="news-title">Titel</label>
                <input type="text" id="news-title" value="${data?.title || ''}" required>
            </div>
            <div class="form-group">
                <label for="news-date">Datum</label>
                <input type="text" id="news-date" value="${data?.date || ''}" required>
            </div>
            <div class="form-group">
                <label for="news-content">Inhalt</label>
                <textarea id="news-content" required>${data?.content || ''}</textarea>
            </div>
            <div class="form-group">
                <label for="news-active">
                    <input type="checkbox" id="news-active" ${data?.active !== false ? 'checked' : ''}> Aktiv
                </label>
            </div>
        `;
    }

    getEventsForm(data) {
        return `
            <div class="form-group">
                <label for="event-title">Titel</label>
                <input type="text" id="event-title" value="${data?.title || ''}" required>
            </div>
            <div class="form-group">
                <label for="event-date">Datum</label>
                <input type="date" id="event-date" value="${data?.date || ''}" required>
            </div>
            <div class="form-group">
                <label for="event-time">Uhrzeit</label>
                <input type="text" id="event-time" value="${data?.time || ''}" required>
            </div>
            <div class="form-group">
                <label for="event-location">Ort</label>
                <textarea id="event-location" required>${data?.location || ''}</textarea>
            </div>
            <div class="form-group">
                <label for="event-description">Beschreibung</label>
                <textarea id="event-description" required>${data?.description || ''}</textarea>
            </div>
            <div class="form-group">
                <label for="event-category">Kategorie</label>
                <input type="text" id="event-category" value="${data?.category || ''}" required>
            </div>
        `;
    }

    getQuotesForm(data) {
        return `
            <div class="form-group">
                <label for="quote-text">Zitat</label>
                <textarea id="quote-text" required>${data?.text || ''}</textarea>
            </div>
            <div class="form-group">
                <label for="quote-date">Datum</label>
                <input type="text" id="quote-date" value="${data?.date || ''}" required>
            </div>
            <div class="form-group">
                <label for="quote-context">Kontext</label>
                <input type="text" id="quote-context" value="${data?.context || ''}">
            </div>
            <div class="form-group">
                <label for="quote-active">
                    <input type="checkbox" id="quote-active" ${data?.active !== false ? 'checked' : ''}> Aktiv
                </label>
            </div>
        `;
    }

    async saveCurrentModal() {
        if (!this.currentEdit) return;
        
        try {
            this.showLoading();
            
            const { type, data } = this.currentEdit;
            const formData = this.getFormData(type);
            
            if (data) {
                // Update existing item
                await setDoc(doc(db, this.collections[type], data.id), formData);
                console.log(`✅ ${type} erfolgreich aktualisiert`);
            } else {
                // Add new item
                await addDoc(collection(db, this.collections[type]), formData);
                console.log(`✅ ${type} erfolgreich hinzugefügt`);
            }
            
            this.closeModal();
            await this.loadCurrentTabData();
            
        } catch (error) {
            console.error(`❌ Fehler beim Speichern von ${this.currentEdit.type}:`, error);
            this.showError(`Fehler beim Speichern: ${error.message}`);
        } finally {
            this.hideLoading();
        }
    }

    getFormData(type) {
        switch (type) {
            case 'team':
                return {
                    name: document.getElementById('member-name').value,
                    role: document.getElementById('member-role').value,
                    category: document.getElementById('member-category').value,
                    bio: document.getElementById('member-bio').value,
                    image: document.getElementById('member-image').value,
                    categoryActive: true,
                    social: []
                };
            case 'news':
                return {
                    title: document.getElementById('news-title').value,
                    date: document.getElementById('news-date').value,
                    content: document.getElementById('news-content').value,
                    active: document.getElementById('news-active').checked
                };
            case 'events':
                return {
                    title: document.getElementById('event-title').value,
                    date: document.getElementById('event-date').value,
                    time: document.getElementById('event-time').value,
                    location: document.getElementById('event-location').value,
                    description: document.getElementById('event-description').value,
                    category: document.getElementById('event-category').value
                };
            case 'quotes':
                return {
                    text: document.getElementById('quote-text').value,
                    date: document.getElementById('quote-date').value,
                    context: document.getElementById('quote-context').value,
                    active: document.getElementById('quote-active').checked
                };
        }
    }

    async editItem(type, id) {
        try {
            // Get document
            const querySnapshot = await getDocs(collection(db, this.collections[type]));
            let itemData = null;
            
            querySnapshot.forEach((doc) => {
                if (doc.id === id) {
                    itemData = { id: doc.id, ...doc.data() };
                }
            });
            
            if (itemData) {
                this.openModal(type, itemData);
            } else {
                console.error(`❌ Item mit ID ${id} nicht gefunden`);
            }
        } catch (error) {
            console.error(`❌ Fehler beim Laden von ${type}:`, error);
        }
    }

    async deleteItem(type, id) {
        if (confirm(`Möchten Sie dieses ${type}-Element wirklich löschen?`)) {
            try {
                this.showLoading();
                await deleteDoc(doc(db, this.collections[type], id));
                console.log(`✅ ${type} mit ID ${id} erfolgreich gelöscht`);
                await this.loadCurrentTabData();
            } catch (error) {
                console.error(`❌ Fehler beim Löschen von ${type}:`, error);
                this.showError(`Fehler beim Löschen: ${error.message}`);
            } finally {
                this.hideLoading();
            }
        }
    }

    async exportData() {
        try {
            this.showLoading();
            
            const exportData = {};
            
            for (const [key, collectionName] of Object.entries(this.collections)) {
                const querySnapshot = await getDocs(collection(db, collectionName));
                const data = [];
                
                querySnapshot.forEach((doc) => {
                    data.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });
                
                exportData[key] = data;
            }
            
            // Download each as separate JSON files
            Object.keys(exportData).forEach(key => {
                this.downloadJSON(exportData[key], `${key}.json`);
            });
            
            const statusDiv = document.getElementById('export-status');
            if (statusDiv) {
                statusDiv.className = 'export-status success';
                statusDiv.textContent = 'Export erfolgreich! JSON-Dateien wurden heruntergeladen.';
                statusDiv.style.display = 'block';
            }
            
        } catch (error) {
            console.error('❌ Export-Fehler:', error);
            const statusDiv = document.getElementById('export-status');
            if (statusDiv) {
                statusDiv.className = 'export-status error';
                statusDiv.textContent = `Export-Fehler: ${error.message}`;
                statusDiv.style.display = 'block';
            }
        } finally {
            this.hideLoading();
        }
    }

    downloadJSON(data, filename) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Utility functions
    showLoading() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) overlay.style.display = 'flex';
    }

    hideLoading() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) overlay.style.display = 'none';
    }

    showError(message) {
        console.error('❌ Fehler:', message);
        alert(message);
    }
}

// Create and export singleton instance
const adminDashboard = new AdminDashboard();
export default adminDashboard;

// Make it globally available for onclick handlers
window.adminDashboard = adminDashboard;