const events = [
    {
        id: 1,
        title: "Festival Unter Leuten",
        date: "2025-06-07",
        time: "20:00",
        location: "Meißen, Stadtpark",
        description: "Das Unter Leuten Festival in Meißen",
        image: "images/festival.jpg",
        links: [
            {
                url: "https://ticket-link.de",
                label: "Tickets kaufen",
                icon: "fa-ticket-alt"
            },
            {
                url: "https://festival-info.de",
                label: "Mehr Informationen",
                icon: "fa-info-circle"
            }
        ],
        price: "25€",
        category: "Festival"
    }
];

class EventManager {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.activeEvent = null;
        this.activeDropdown = null;
        this.isMobile = window.innerWidth <= 520;
        
        // Close calendar dropdown on backdrop click (mobile)
        document.addEventListener('click', (e) => {
            if (this.isMobile && e.target.classList.contains('calendar-options')) {
                const dropdown = e.target.closest('.calendar-dropdown');
                if (dropdown) dropdown.classList.remove('active');
            }
        });

        // Update isMobile on resize
        window.addEventListener('resize', () => {
            this.isMobile = window.innerWidth <= 520;
        });
    }

    formatDate(dateStr) {
        return new Date(dateStr).toLocaleDateString('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    createEventElement(event) {
        const element = document.createElement('div');
        element.className = 'event-container';
        element.innerHTML = `
            <div class="event-header">
                <div class="event-header-left">
                    <div class="event-title">${event.title}</div>
                    <div class="event-meta">
                        <span><i class="far fa-calendar"></i> ${this.formatDate(event.date)}</span>
                        <span><i class="far fa-clock"></i> ${event.time}</span>
                    </div>
                </div>
                <i class="fas fa-chevron-down"></i>
            </div>
            <div class="event-content">
                <div class="event-details">
                    <div class="event-info-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${event.location}</span>
                    </div>
                    ${event.price ? `
                    <div class="event-info-item">
                        <i class="fas fa-ticket-alt"></i>
                        <span>${event.price}</span>
                    </div>
                    ` : ''}
                    <div class="event-info-item">
                        <i class="fas fa-tag"></i>
                        <span>${event.category}</span>
                    </div>
                </div>
                <div class="event-description">${event.description}</div>
                ${event.image ? `<img src="${event.image}" alt="${event.title}" class="event-image">` : ''}
                <div class="event-actions">
                    ${event.links ? event.links.map(link => `
                        <a href="${link.url}" class="event-button" target="_blank">
                            <i class="fas ${link.icon}"></i> ${link.label}
                        </a>
                    `).join('') : ''}
                </div>
            </div>
        `;

        element.querySelector('.event-header').addEventListener('click', () => {
            this.toggleEvent(element);
        });

        return element;
    }

    toggleEvent(element) {
        const content = element.querySelector('.event-content');
        const isActive = element.classList.contains('active');

        if (this.activeEvent && this.activeEvent !== element) {
            this.activeEvent.classList.remove('active');
            const activeContent = this.activeEvent.querySelector('.event-content');
            activeContent.style.height = '0px';
        }

        if (!isActive) {
            element.classList.add('active');
            content.style.height = content.scrollHeight + 'px';
            this.activeEvent = element;
        } else {
            element.classList.remove('active');
            content.style.height = '0px';
            this.activeEvent = null;
        }
    }

    render() {
        this.container.innerHTML = '';
        events
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .forEach(event => {
                this.container.appendChild(this.createEventElement(event));
            });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const eventManager = new EventManager('events-container');
    eventManager.render();
});
