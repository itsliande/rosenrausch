const appointments = [
    {
        title: "Festival Unter Leuten",
        date: "07.06.2025",
        shortInfo: "Live-Auftritt beim Unter Leuten Festival am 07.06.25",  // Neue Kurzinfo
        time: "20:00",
        location: "Meißen, Stadtpark",
        description: "Das Unter Leuten Festival in Meißen",
        image: "images/festival.jpg",
        link: ""
    },
];

function renderAppointments() {
    const container = document.getElementById('appointments-container');
    if (!container) return;

    appointments.forEach((event, index) => {
        const eventElement = document.createElement('div');
        eventElement.className = 'link-button event-container';
        
        // Kurzansicht (immer sichtbar)
        eventElement.innerHTML = `
            <div class="link-content event-banner" data-event-index="${index}">
                <div class="event-preview">
                    <span>${event.title}</span>
                    <span class="event-date">${event.date}</span>
                </div>
                <div class="event-short-info">${event.shortInfo || ''}</div>
            </div>
            <div class="event-dropdown">
                ${event.image ? `<img src="${event.image}" alt="Event Bild" class="event-image">` : ''}
                <div class="event-additional-info">
                    <p><strong>Uhrzeit:</strong> ${event.time}</p>
                    <p><strong>Ort:</strong> ${event.location}</p>
                    <p><strong>Beschreibung:</strong> ${event.description}</p>
                    ${event.link ? `<a href="${event.link}" target="_blank" class="event-link">Event Link</a>` : ''}
                </div>
            </div>
        `;
        container.appendChild(eventElement);

        const banner = eventElement.querySelector('.event-banner');
        const dropdown = eventElement.querySelector('.event-dropdown');
        
        // Initial geschlossen
        dropdown.style.maxHeight = '0';
        
        banner.addEventListener('click', () => {
            eventElement.classList.toggle('active');
            dropdown.style.maxHeight = eventElement.classList.contains('active') ? 
                `${dropdown.scrollHeight}px` : '0';
        });
    });
}

// Seite initialisieren
document.addEventListener('DOMContentLoaded', renderAppointments);
