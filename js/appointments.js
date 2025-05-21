const appointments = [
    {
        title: "Festival Unter Leuten",
        date: "07.06.2025",
        time: "20:00",
        location: "Meißen, Stadtpark",
        description: "Das Unter Leuten Festival in Meißen",
        image: "images/festival.jpg",
        link: ""
    },
];

// Neue Funktion zum Rendern der Events
function renderAppointments() {
    const container = document.getElementById('appointments-container');
    if (!container) return;

    appointments.forEach((event, index) => {
        const eventElement = document.createElement('div');
        eventElement.className = 'link-button event-container';
        eventElement.innerHTML = `
            <div class="link-content event-banner" data-event-index="${index}">
                <span>${event.title}</span>
                <span class="event-date">${event.date}</span>
            </div>
            <div class="event-dropdown">
                <div class="dropdown-content">
                    <div class="event-details">
                        ${event.image ? `<img src="${event.image}" alt="Event Bild" class="event-image">` : ''}
                        <p class="mb-2"><strong>Uhrzeit:</strong> ${event.time}</p>
                        <p class="mb-2"><strong>Ort:</strong> ${event.location}</p>
                        <p class="mb-2"><strong>Beschreibung:</strong> ${event.description}</p>
                        ${event.link ? `<a href="${event.link}" target="_blank" class="event-link">Event Link</a>` : ''}
                    </div>
                </div>
            </div>
        `;
        container.appendChild(eventElement);

        const banner = eventElement.querySelector('.event-banner');
        banner.addEventListener('click', () => {
            eventElement.classList.toggle('active');
            const dropdown = eventElement.querySelector('.event-dropdown');
            if (eventElement.classList.contains('active')) {
                dropdown.style.maxHeight = dropdown.scrollHeight + "px";
            } else {
                dropdown.style.maxHeight = "0";
            }
        });
    });
}

// Seite initialisieren
document.addEventListener('DOMContentLoaded', renderAppointments);
