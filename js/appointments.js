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
    const popup = document.getElementById('eventPopup');
    const popupTitle = document.getElementById('popupTitle');
    const popupDetails = document.getElementById('popupDetails');
    
    let linkHtml = event.link ? `<a href="${event.link}" target="_blank" class="event-link">Event Link</a>` : '';
    let imageHtml = event.image ? `<img src="${event.image}" alt="Event Bild" class="event-image">` : '';
    
    popupTitle.textContent = event.title;
    popupDetails.innerHTML = `
        ${imageHtml}
        <p class="mb-2"><strong>Datum:</strong> ${event.date}</p>
        <p class="mb-2"><strong>Uhrzeit:</strong> ${event.time}</p>
        <p class="mb-2"><strong>Ort:</strong> ${event.location}</p>
        <p class="mb-2"><strong>Beschreibung:</strong> ${event.description}</p>
        ${linkHtml}
    `;
    
    popup.classList.add('active');
}
