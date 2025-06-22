//// Diese Datei wurde durch firebase-admin.js ersetzt
// Siehe js/firebase-admin.js für das neue komplett überarbeitete Admin Panelin Script
import AdminAuth from './admin-auth.js';
import AdminDataManager from './admin-data-manager.js';

class AdminPanel {
    constructor() {
        this.auth = new AdminAuth();
        this.dataManager = new AdminDataManager();
        this.currentTab = 'team';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupTabSwitching();
        this.loadInitialData();
    }

    setupEventListeners() {
        // Login Form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Password Toggle
        const passwordToggle = document.getElementById('password-toggle');
        if (passwordToggle) {
            passwordToggle.addEventListener('click', () => this.togglePassword());
        }

        // Logout Button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }

        // Add Buttons
        document.getElementById('add-team-member')?.addEventListener('click', () => this.openTeamMemberModal());
        document.getElementById('add-news-item')?.addEventListener('click', () => this.openNewsModal());
        document.getElementById('add-event')?.addEventListener('click', () => this.openEventModal());
        document.getElementById('add-quote')?.addEventListener('click', () => this.openQuoteModal());

        // Export Button
        document.getElementById('export-all-data')?.addEventListener('click', () => this.exportAllData());

        // Modal Events
        document.getElementById('modal-close')?.addEventListener('click', () => this.closeModal());
        document.getElementById('modal-cancel')?.addEventListener('click', () => this.closeModal());
        document.getElementById('modal-save')?.addEventListener('click', () => this.saveCurrentModal());

        // Close modal on backdrop click
        document.getElementById('edit-modal')?.addEventListener('click', (e) => {
            if (e.target.id === 'edit-modal') {
                this.closeModal();
            }
        });
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
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update active tab content
        document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
        document.getElementById(`${tabName}-tab`).classList.add('active');

        this.currentTab = tabName;
        this.loadTabData(tabName);
    }

    async loadTabData(tabName) {
        this.showLoading();
        
        try {
            switch (tabName) {
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
            console.error(`Fehler beim Laden der ${tabName} Daten:`, error);
            this.showError(`Fehler beim Laden der Daten: ${error.message}`);
        } finally {
            this.hideLoading();
        }
    }

    async loadInitialData() {
        if (this.auth.isAdmin()) {
            await this.loadTabData(this.currentTab);
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('login-error');

        // Verstecke vorherige Fehlermeldungen
        errorDiv.style.display = 'none';

        try {
            this.showLoading();
            console.log('Starte Login-Prozess für:', email);
            
            await this.auth.login(email, password);
            
            console.log('Login erfolgreich, lade Daten');
            
            // Load initial data
            await this.loadInitialData();
            
        } catch (error) {
            console.error('Login Fehler:', error);
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
            await this.auth.logout();
            document.getElementById('admin-user-info').textContent = 'Nicht eingeloggt';
            document.getElementById('logout-btn').style.display = 'none';
            
            // Reset form
            document.getElementById('login-form').reset();
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    togglePassword() {
        const passwordInput = document.getElementById('password');
        const toggleIcon = document.querySelector('#password-toggle i');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleIcon.classList.replace('fa-eye', 'fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            toggleIcon.classList.replace('fa-eye-slash', 'fa-eye');
        }
    }

    // Team Management
    async loadTeamData() {
        const teamData = await this.dataManager.getTeamData();
        const teamList = document.getElementById('team-list');
        
        teamList.innerHTML = '';
        
        teamData.categories.forEach(category => {
            if (category.active !== false) {
                category.members.forEach(member => {
                    teamList.appendChild(this.createTeamMemberItem(member));
                });
            }
        });
    }

    createTeamMemberItem(member) {
        const item = document.createElement('div');
        item.className = 'data-item';
        item.innerHTML = `
            <div class="data-item-header">
                <div>
                    <div class="data-item-title">${member.name}</div>
                    <div class="data-item-meta">${member.role} | ${member.category}</div>
                </div>
                <div class="data-item-actions">
                    <button class="btn-edit" onclick="adminPanel.editTeamMember('${member.id}')">
                        <i class="fas fa-edit"></i> Bearbeiten
                    </button>
                    <button class="btn-delete" onclick="adminPanel.deleteTeamMember('${member.id}')">
                        <i class="fas fa-trash"></i> Löschen
                    </button>
                </div>
            </div>
            <div class="data-item-content">${member.bio}</div>
        `;
        return item;
    }

    // News Management
    async loadNewsData() {
        const newsData = await this.dataManager.getNewsData();
        const newsList = document.getElementById('news-list');
        
        newsList.innerHTML = '';
        
        newsData.forEach(news => {
            newsList.appendChild(this.createNewsItem(news));
        });
    }

    createNewsItem(news) {
        const item = document.createElement('div');
        item.className = 'data-item';
        item.innerHTML = `
            <div class="data-item-header">
                <div>
                    <div class="data-item-title">${news.title}</div>
                    <div class="data-item-meta">${news.date} | ${news.active ? 'Aktiv' : 'Inaktiv'}</div>
                </div>
                <div class="data-item-actions">
                    <button class="btn-edit" onclick="adminPanel.editNews('${news.id}')">
                        <i class="fas fa-edit"></i> Bearbeiten
                    </button>
                    <button class="btn-delete" onclick="adminPanel.deleteNews('${news.id}')">
                        <i class="fas fa-trash"></i> Löschen
                    </button>
                </div>
            </div>
            <div class="data-item-content">${news.content.substring(0, 200)}...</div>
        `;
        return item;
    }

    // Events Management
    async loadEventsData() {
        const eventsData = await this.dataManager.getEventsData();
        const eventsList = document.getElementById('events-list');
        
        eventsList.innerHTML = '';
        
        eventsData.forEach(event => {
            eventsList.appendChild(this.createEventItem(event));
        });
    }

    createEventItem(event) {
        const item = document.createElement('div');
        item.className = 'data-item';
        item.innerHTML = `
            <div class="data-item-header">
                <div>
                    <div class="data-item-title">${event.title}</div>
                    <div class="data-item-meta">${event.date} | ${event.location}</div>
                </div>
                <div class="data-item-actions">
                    <button class="btn-edit" onclick="adminPanel.editEvent('${event.id}')">
                        <i class="fas fa-edit"></i> Bearbeiten
                    </button>
                    <button class="btn-delete" onclick="adminPanel.deleteEvent('${event.id}')">
                        <i class="fas fa-trash"></i> Löschen
                    </button>
                </div>
            </div>
            <div class="data-item-content">${event.description}</div>
        `;
        return item;
    }

    // Quotes Management
    async loadQuotesData() {
        const quotesData = await this.dataManager.getQuotesData();
        const quotesList = document.getElementById('quotes-list');
        
        quotesList.innerHTML = '';
        
        quotesData.forEach(quote => {
            quotesList.appendChild(this.createQuoteItem(quote));
        });
    }

    createQuoteItem(quote) {
        const item = document.createElement('div');
        item.className = 'data-item';
        item.innerHTML = `
            <div class="data-item-header">
                <div>
                    <div class="data-item-title">"${quote.text}"</div>
                    <div class="data-item-meta">${quote.date} | ${quote.context || 'Kein Kontext'}</div>
                </div>
                <div class="data-item-actions">
                    <button class="btn-edit" onclick="adminPanel.editQuote('${quote.id}')">
                        <i class="fas fa-edit"></i> Bearbeiten
                    </button>
                    <button class="btn-delete" onclick="adminPanel.deleteQuote('${quote.id}')">
                        <i class="fas fa-trash"></i> Löschen
                    </button>
                </div>
            </div>
        `;
        return item;
    }

    // Modal Functions
    openTeamMemberModal(memberId = null) {
        // Implementation für Team Member Modal
        this.openModal('Team-Mitglied', this.createTeamMemberForm(memberId));
    }

    openNewsModal(newsId = null) {
        // Implementation für News Modal
        this.openModal('News-Artikel', this.createNewsForm(newsId));
    }

    openEventModal(eventId = null) {
        // Implementation für Event Modal
        this.openModal('Event', this.createEventForm(eventId));
    }

    openQuoteModal(quoteId = null) {
        // Implementation für Quote Modal
        this.openModal('Zitat', this.createQuoteForm(quoteId));
    }

    openModal(title, content) {
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-body').innerHTML = content;
        document.getElementById('edit-modal').style.display = 'flex';
    }

    closeModal() {
        document.getElementById('edit-modal').style.display = 'none';
    }

    // Form Creation Functions
    createTeamMemberForm(memberId) {
        return `
            <div class="form-group">
                <label for="member-name">Name</label>
                <input type="text" id="member-name" required>
            </div>
            <div class="form-group">
                <label for="member-role">Rolle</label>
                <input type="text" id="member-role" required>
            </div>
            <div class="form-group">
                <label for="member-category">Kategorie</label>
                <input type="text" id="member-category" required>
            </div>
            <div class="form-group">
                <label for="member-bio">Bio</label>
                <textarea id="member-bio" required></textarea>
            </div>
            <div class="form-group">
                <label for="member-image">Bild URL</label>
                <input type="url" id="member-image" required>
            </div>
        `;
    }

    createNewsForm(newsId) {
        return `
            <div class="form-group">
                <label for="news-title">Titel</label>
                <input type="text" id="news-title" required>
            </div>
            <div class="form-group">
                <label for="news-date">Datum</label>
                <input type="text" id="news-date" required>
            </div>
            <div class="form-group">
                <label for="news-content">Inhalt</label>
                <textarea id="news-content" required></textarea>
            </div>
            <div class="form-group">
                <label for="news-active">
                    <input type="checkbox" id="news-active" checked> Aktiv
                </label>
            </div>
        `;
    }

    createEventForm(eventId) {
        return `
            <div class="form-group">
                <label for="event-title">Titel</label>
                <input type="text" id="event-title" required>
            </div>
            <div class="form-group">
                <label for="event-date">Datum</label>
                <input type="date" id="event-date" required>
            </div>
            <div class="form-group">
                <label for="event-time">Uhrzeit</label>
                <input type="text" id="event-time" required>
            </div>
            <div class="form-group">
                <label for="event-location">Ort</label>
                <textarea id="event-location" required></textarea>
            </div>
            <div class="form-group">
                <label for="event-description">Beschreibung</label>
                <textarea id="event-description" required></textarea>
            </div>
            <div class="form-group">
                <label for="event-category">Kategorie</label>
                <input type="text" id="event-category" required>
            </div>
        `;
    }

    createQuoteForm(quoteId) {
        return `
            <div class="form-group">
                <label for="quote-text">Zitat</label>
                <textarea id="quote-text" required></textarea>
            </div>
            <div class="form-group">
                <label for="quote-date">Datum</label>
                <input type="text" id="quote-date" required>
            </div>
            <div class="form-group">
                <label for="quote-context">Kontext</label>
                <input type="text" id="quote-context">
            </div>
            <div class="form-group">
                <label for="quote-active">
                    <input type="checkbox" id="quote-active" checked> Aktiv
                </label>
            </div>
        `;
    }

    async saveCurrentModal() {
        // Implementation der Speicherfunktion basierend auf dem aktuellen Modal-Typ
        this.closeModal();
        await this.loadTabData(this.currentTab);
    }

    // Export Function
    async exportAllData() {
        const statusDiv = document.getElementById('export-status');
        
        try {
            this.showLoading();
            const allData = await this.dataManager.exportToJSON();
            
            // Create downloadable files
            this.downloadJSON(allData.team, 'team.json');
            this.downloadJSON(allData.news, 'news.json');
            this.downloadJSON(allData.events, 'events.json');
            this.downloadJSON(allData.quotes, 'quotes.json');
            
            statusDiv.className = 'export-status success';
            statusDiv.textContent = 'Export erfolgreich! JSON-Dateien wurden heruntergeladen.';
            statusDiv.style.display = 'block';
            
        } catch (error) {
            statusDiv.className = 'export-status error';
            statusDiv.textContent = `Export-Fehler: ${error.message}`;
            statusDiv.style.display = 'block';
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

    // Utility Functions
    showLoading() {
        document.getElementById('loading-overlay').style.display = 'flex';
    }

    hideLoading() {
        document.getElementById('loading-overlay').style.display = 'none';
    }

    showError(message) {
        // Implement error notification
        console.error(message);
    }
}

// Initialize Admin Panel
let adminPanel;
document.addEventListener('DOMContentLoaded', () => {
    adminPanel = new AdminPanel();
    window.adminPanel = adminPanel; // Make it globally available for onclick handlers
});