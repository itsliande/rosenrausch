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
                    <div class="calendar-dropdown">
                        <button type="button" class="event-button calendar-trigger">
                            <i class="far fa-calendar-plus"></i> Zum Kalender hinzufügen
                        </button>
                        <div class="calendar-overlay"></div>
                        <div class="calendar-options">
                            <button type="button" class="calendar-option" data-calendar="google">
                                <i class="fab fa-google"></i> Google Kalender
                            </button>
                            <button type="button" class="calendar-option" data-calendar="apple">
                                <i class="fab fa-apple"></i> Apple Kalender
                            </button>
                            <button type="button" class="calendar-option" data-calendar="ics">
                                <i class="far fa-calendar"></i> ICS Download
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        element.querySelector('.event-header').addEventListener('click', () => {
            this.toggleEvent(element);
        });

        // Event-Handler für den Kalender
        const calendarTrigger = element.querySelector('.calendar-trigger');
        const calendarOverlay = element.querySelector('.calendar-overlay');

        const closeAllDropdowns = () => {
            document.querySelectorAll('.calendar-dropdown.active').forEach(dropdown => {
                dropdown.classList.remove('active');
            });
            document.body.style.overflow = '';
        };

        calendarTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            closeAllDropdowns();
            const dropdown = e.currentTarget.closest('.calendar-dropdown');
            dropdown.classList.add('active');
            if (this.isMobile) {
                document.body.style.overflow = 'hidden';
            }
        });

        // Schließen beim Klick auf Overlay oder außerhalb
        [calendarOverlay, document].forEach(elem => {
            elem.addEventListener('click', (e) => {
                if (!e.target.closest('.calendar-options') && 
                    !e.target.closest('.calendar-trigger')) {
                    closeAllDropdowns();
                }
            });
        });

        // Event-Handler für die Kalender-Optionen
        element.querySelector('.calendar-options').querySelectorAll('.calendar-option').forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const calendarType = e.currentTarget.dataset.calendar;
                addToCalendar(event.title, event.date, event.time, calendarType);
                e.currentTarget.closest('.calendar-dropdown').classList.remove('active');
            });
        });

        // Schließen des Dropdowns beim Klick außerhalb
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.calendar-dropdown')) {
                element.querySelector('.calendar-dropdown')?.classList.remove('active');
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

// Verbessere die addToCalendar Funktion für Mobile
function addToCalendar(title, date, time, type) {
    const dateTime = new Date(`${date}T${time}`);
    const endTime = new Date(dateTime.getTime() + 2 * 60 * 60 * 1000);
    
    const formatDateTime = (date) => date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isAndroid = /Android/i.test(navigator.userAgent);
    
    const calendarUrls = {
        google: isAndroid 
            ? `content://com.android.calendar/time/${dateTime.getTime()}`
            : `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${formatDateTime(dateTime)}/${formatDateTime(endTime)}`,
        apple: isIOS
            ? `data:text/calendar;charset=utf8,BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${formatDateTime(dateTime)}
DTEND:${formatDateTime(endTime)}
SUMMARY:${title}
DESCRIPTION:${title}
END:VEVENT
END:VCALENDAR`
            : null,
        ics: `data:text/calendar;charset=utf8,BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${formatDateTime(dateTime)}
DTEND:${formatDateTime(endTime)}
SUMMARY:${title}
DESCRIPTION:${title}
END:VEVENT
END:VCALENDAR`
    };

    if (type === 'apple' && isIOS) {
        const element = document.createElement('a');
        element.setAttribute('href', calendarUrls.apple);
        element.setAttribute('target', '_blank');
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    } else if (type === 'ics' || (type === 'apple' && !isIOS)) {
        const element = document.createElement('a');
        element.setAttribute('href', calendarUrls.ics);
        element.setAttribute('download', `${title}.ics`);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    } else {
        window.location.href = calendarUrls[type];
    }

    // Schließe das Modal nach der Aktion auf Mobilgeräten
    const dropdown = document.querySelector('.calendar-dropdown.active');
    if (dropdown) {
        dropdown.classList.remove('active');
        document.body.style.overflow = '';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const eventManager = new EventManager('events-container');
    eventManager.render();
});
