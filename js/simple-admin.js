// Simple Admin Panel - Ohne Firebase Dependencies
class SimpleAdmin {
    constructor() {
        this.isAuthenticated = false;
        this.currentUser = null;
        this.data = {
            team: [],
            news: [],
            events: [],
            quotes: []
        };
        this.init();
    }

    init() {
        console.log('🔧 Simple Admin Panel wird initialisiert...');
        this.setupEventListeners();
        this.loadMockData();
        this.updateUIState();
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
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('login-error');

        console.log('🔐 Login-Versuch für:', email);

        // Simple Authentication Check
        const validCredentials = [
            { email: 'contact@rosenrausch.xyz', password: 'admin123' },
            { email: 'admin@rosenrausch.xyz', password: 'admin123' }
        ];

        const user = validCredentials.find(cred => 
            cred.email === email && cred.password === password
        );

        if (user) {
            this.isAuthenticated = true;
            this.currentUser = { email: user.email };
            console.log('✅ Login erfolgreich für:', email);
            this.updateUIState();
            this.loadData();
        } else {
            console.log('❌ Login fehlgeschlagen für:', email);
            errorDiv.textContent = 'Ungültige Anmeldedaten. Verwende contact@rosenrausch.xyz mit Passwort: admin123';
            errorDiv.style.display = 'block';
            setTimeout(() => {
                errorDiv.style.display = 'none';
            }, 5000);
        }
    }

    handleLogout() {
        this.isAuthenticated = false;
        this.currentUser = null;
        console.log('🚪 Logout erfolgreich');
        this.updateUIState();
        
        // Reset form
        const loginForm = document.getElementById('login-form');
        if (loginForm) loginForm.reset();
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

    updateUIState() {
        const loginSection = document.getElementById('login-section');
        const adminPanel = document.getElementById('admin-panel');
        const userInfo = document.getElementById('admin-user-info');
        const logoutBtn = document.getElementById('logout-btn');
        
        if (this.isAuthenticated && this.currentUser) {
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

    loadMockData() {
        // Mock Data für Demonstration
        this.data = {
            team: [
                {
                    id: '1',
                    name: 'Rosenrausch',
                    role: 'Artist',
                    category: '🌹Artist🌹',
                    bio: 'Der Künstler um den es sich hier dreht.',
                    image: 'profile.jpg'
                }
            ],
            news: [
                {
                    id: '1',
                    title: 'Willkommen im neuen Admin Panel!',
                    date: '1. Januar 2025',
                    content: 'Das Admin Panel wurde erfolgreich neu implementiert.',
                    active: true
                }
            ],
            events: [
                {
                    id: '1',
                    title: 'Test Event',
                    date: '2025-06-01',
                    time: '20:00',
                    location: 'Online',
                    description: 'Ein Test-Event für das neue Admin Panel.',
                    category: 'Test'
                }
            ],
            quotes: [
                {
                    id: '1',
                    text: 'Ein neuer Anfang für das Admin Panel!',
                    date: '1. Januar 2025',
                    context: 'System Update',
                    active: true
                }
            ]
        };
    }

    loadData() {
        if (!this.isAuthenticated) return;
        
        console.log('📊 Lade Admin-Daten...');
        // Hier würden normalerweise echte Daten geladen werden
        // Für jetzt verwenden wir Mock-Daten
        this.renderData();
    }

    renderData() {
        this.renderTeamData();
        this.renderNewsData();
        this.renderEventsData();
        this.renderQuotesData();
    }

    renderTeamData() {
        const teamList = document.getElementById('team-list');
        if (!teamList) return;

        teamList.innerHTML = '';
        this.data.team.forEach(member => {
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

    renderNewsData() {
        const newsList = document.getElementById('news-list');
        if (!newsList) return;

        newsList.innerHTML = '';
        this.data.news.forEach(news => {
            const item = this.createDataItem({
                title: news.title,
                meta: `${news.date} | ${news.active ? 'Aktiv' : 'Inaktiv'}`,
                content: news.content,
                id: news.id,
                type: 'news'
            });
            newsList.appendChild(item);
        });
    }

    renderEventsData() {
        const eventsList = document.getElementById('events-list');
        if (!eventsList) return;

        eventsList.innerHTML = '';
        this.data.events.forEach(event => {
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

    renderQuotesData() {
        const quotesList = document.getElementById('quotes-list');
        if (!quotesList) return;

        quotesList.innerHTML = '';
        this.data.quotes.forEach(quote => {
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
                    <button class="btn-edit" onclick="simpleAdmin.editItem('${type}', '${id}')">
                        <i class="fas fa-edit"></i> Bearbeiten
                    </button>
                    <button class="btn-delete" onclick="simpleAdmin.deleteItem('${type}', '${id}')">
                        <i class="fas fa-trash"></i> Löschen
                    </button>
                </div>
            </div>
            ${content ? `<div class="data-item-content">${content}</div>` : ''}
        `;
        return item;
    }

    editItem(type, id) {
        console.log(`✏️ Bearbeite ${type} mit ID: ${id}`);
        alert(`Bearbeitung von ${type} mit ID ${id} - Feature wird noch implementiert`);
    }

    deleteItem(type, id) {
        if (confirm(`Möchten Sie dieses ${type}-Element wirklich löschen?`)) {
            console.log(`🗑️ Lösche ${type} mit ID: ${id}`);
            
            // Remove from data
            this.data[type] = this.data[type].filter(item => item.id !== id);
            
            // Re-render
            this.renderData();
            
            console.log(`✅ ${type} mit ID ${id} erfolgreich gelöscht`);
        }
    }

    exportData() {
        console.log('📤 Exportiere Daten...');
        
        // Create JSON exports
        Object.keys(this.data).forEach(key => {
            const blob = new Blob([JSON.stringify(this.data[key], null, 2)], { 
                type: 'application/json' 
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${key}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
        
        console.log('✅ Export abgeschlossen');
        alert('Daten wurden erfolgreich als JSON-Dateien exportiert!');
    }
}

// Initialize Simple Admin Panel
let simpleAdmin;
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Starte Simple Admin Panel...');
    simpleAdmin = new SimpleAdmin();
    window.simpleAdmin = simpleAdmin; // Make it globally available
    console.log('✅ Simple Admin Panel bereit!');
});