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
                    <div class="calendar-dropdown">
                        <button class="event-button calendar-trigger">
                            <i class="far fa-calendar-plus"></i> Zum Kalender hinzufügen
                        </button>
                        <div class="calendar-options">
                            <a href="#" onclick="addToCalendar('${event.title}', '${event.date}', '${event.time}', 'google')" class="calendar-option">
                                <i class="fab fa-google"></i> Google Kalender
                            </a>
                            <a href="#" onclick="addToCalendar('${event.title}', '${event.date}', '${event.time}', 'apple')" class="calendar-option">
                                <i class="fab fa-apple"></i> Apple Kalender
                            </a>
                            <a href="#" onclick="addToCalendar('${event.title}', '${event.date}', '${event.time}', 'ics')" class="calendar-option">
                                <i class="far fa-calendar"></i> ICS Download
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;

        element.querySelector('.event-header').addEventListener('click', () => {
            this.toggleEvent(element);
        });

        // Füge Event-Listener für Calendar-Dropdown hinzu
        element.querySelector('.calendar-trigger').addEventListener('click', (e) => {
            e.stopPropagation();
            const dropdown = e.target.closest('.calendar-dropdown');
            dropdown.classList.toggle('active');
        });

        // Schließe Dropdown wenn außerhalb geklickt wird
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.calendar-dropdown')) {
                element.querySelector('.calendar-dropdown').classList.remove('active');
            }
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

function addToCalendar(title, date, time, type) {
    const dateTime = new Date(`${date}T${time}`);
    const endTime = new Date(dateTime.getTime() + 2 * 60 * 60 * 1000);
    
    const formatDateTime = (date) => date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    
    const calendarUrls = {
        google: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${formatDateTime(dateTime)}/${formatDateTime(endTime)}`,
        apple: `webcal://p133-caldav.icloud.com/published/2/MTM0NTI4MDgwMTM0NTI4MMGxv5D0dR7QC3JHrm1VSXGWwE7UqwCAAtjxE_UryPWT9cXEVgxN_sgG8OAxd9rIlOuaKqPHhG5xG5rIlOuaKqPHhG5xG5`,
        ics: `data:text/calendar;charset=utf8,BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
URL:${document.URL}
DTSTART:${formatDateTime(dateTime)}
DTEND:${formatDateTime(endTime)}
SUMMARY:${title}
END:VEVENT
END:VCALENDAR`
    };

    if (type === 'ics') {
        const element = document.createElement('a');
        element.setAttribute('href', calendarUrls.ics);
        element.setAttribute('download', `${title}.ics`);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    } else {
        window.open(calendarUrls[type], '_blank');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const eventManager = new EventManager('events-container');
    eventManager.render();
});
