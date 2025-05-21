const appointments = [
    {
        title: "Festival Unter Leuten",
        date: "07.06.2025",
        shortInfo: "",
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
        
        eventElement.innerHTML = `
            <div class="link-content event-banner" data-event-index="${index}">
                <div class="event-preview">
                    <h2 class="event-title">${event.title}</h2>
                    <span class="event-date">${event.date}</span>
                </div>
            </div>
            <div class="event-dropdown" style="display: none;">
                <div class="event-details">
                    <div class="event-description">${event.shortInfo}</div>
                    ${event.image ? `<img src="${event.image}" alt="Event Bild" class="event-image">` : ''}
                    <div class="event-additional-info">
                        <p><strong>Uhrzeit:</strong> ${event.time}</p>
                        <p><strong>Ort:</strong> ${event.location}</p>
                        <p><strong>Beschreibung:</strong> ${event.description}</p>
                        ${event.link ? `<a href="${event.link}" target="_blank" class="event-link">Event Link</a>` : ''}
                    </div>
                </div>
            </div>
        `;
        container.appendChild(eventElement);

        const banner = eventElement.querySelector('.event-banner');
        const dropdown = eventElement.querySelector('.event-dropdown');
        
        banner.addEventListener('click', () => {
            const isActive = eventElement.classList.contains('active');
            eventElement.classList.toggle('active');
            
            if (!isActive) {
                dropdown.style.display = 'block';
                setTimeout(() => {
                    dropdown.style.maxHeight = dropdown.scrollHeight + 'px';
                    dropdown.style.opacity = '1';
                }, 10);
            } else {
                dropdown.style.maxHeight = '0';
                dropdown.style.opacity = '0';
                setTimeout(() => {
                    dropdown.style.display = 'none';
                }, 300);
            }
        });
    });
}

// Seite initialisieren
document.addEventListener('DOMContentLoaded', renderAppointments);
