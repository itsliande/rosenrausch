class TeamRenderer {
    constructor() {
        this.container = document.querySelector('.team-container');
    }

    async init() {
        try {
            const data = await this.fetchTeamData();
            this.render(data);
        } catch (error) {
            console.error('Fehler beim Laden der Team-Daten:', error);
            this.renderError();
        }
    }

    async fetchTeamData() {
        const response = await fetch('/data/team.json');
        if (!response.ok) {
            throw new Error('Netzwerk-Antwort war nicht ok');
        }
        return await response.json();
    }

    render(data) {
        // Bestehenden Inhalt speichern
        const profile = this.container.querySelector('.profile');
        
        // Container leeren und Profil wieder einfügen
        this.container.innerHTML = '';
        this.container.appendChild(profile);

        // Kategorien rendern
        data.categories.forEach(category => {
            this.container.appendChild(this.createCategorySection(category));
        });
    }

    createCategorySection(category) {
        const section = document.createElement('div');
        section.className = 'team-category';

        const title = document.createElement('h2');
        title.className = 'category-title';
        title.textContent = category.name;
        section.appendChild(title);

        const grid = document.createElement('div');
        grid.className = 'members-grid';

        category.members.forEach(member => {
            grid.appendChild(this.createMemberCard(member));
        });

        section.appendChild(grid);
        return section;
    }

    createMemberCard(member) {
        const card = document.createElement('div');
        card.className = 'team-member';

        card.innerHTML = `
            <img src="${member.image}" alt="${member.name}" loading="lazy">
            <h3>${member.name}</h3>
            <div class="role">${member.role}</div>
            <div class="bio">${member.bio}</div>
            <div class="social-links">
                ${this.createSocialLinks(member.social)}
            </div>
        `;

        return card;
    }

    createSocialLinks(socialLinks) {
        return socialLinks.map(social => `
            <a href="${social.url}" target="_blank" rel="noopener noreferrer">
                <i class="${social.platform}"></i>
            </a>
        `).join('');
    }

    renderError() {
        this.container.innerHTML = `
            <div class="error-message">
                <h2>Fehler beim Laden der Team-Daten</h2>
                <p>Bitte versuchen Sie es später erneut.</p>
            </div>
        `;
    }
}

// Initialisierung
document.addEventListener('DOMContentLoaded', () => {
    const teamRenderer = new TeamRenderer();
    teamRenderer.init();
});
