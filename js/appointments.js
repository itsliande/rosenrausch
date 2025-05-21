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

function showEventDetails(index) {
    const event = appointments[index];
    const banner = document.querySelector(`[data-event-index="${index}"]`);
    const dropdown = banner.nextElementSibling;
    
    // Toggle active class
    banner.classList.toggle('active');
    dropdown.classList.toggle('active');
    
    // Nur beim ersten Öffnen den Inhalt laden
    if (!dropdown.hasAttribute('data-loaded')) {
        let linkHtml = event.link ? `<a href="${event.link}" target="_blank" class="event-link">Event Link</a>` : '';
        let imageHtml = event.image ? `<img src="${event.image}" alt="Event Bild" class="event-image">` : '';
        
        dropdown.innerHTML = `
            ${imageHtml}
            <p class="mb-2"><strong>Datum:</strong> ${event.date}</p>
            <p class="mb-2"><strong>Uhrzeit:</strong> ${event.time}</p>
            <p class="mb-2"><strong>Ort:</strong> ${event.location}</p>
            <p class="mb-2"><strong>Beschreibung:</strong> ${event.description}</p>
            ${linkHtml}
        `;
        dropdown.setAttribute('data-loaded', 'true');
    }
}
