const appointments = [
    {
        title: "Live-Stream",
        date: "15. Mai",
        time: "20:00",
        description: "Gaming Stream auf Twitch",
        image: "images/stream.jpg",
        link: "https://twitch.tv/rosenrausch"
    },
    {
        title: "Neue Single Release",
        date: "20. Mai",
        time: "00:00",
        description: "Release auf allen Plattformen",
        image: "images/single.jpg",
        link: "https://spotify.com/rosenrausch"
    }
];

function showEventDetails(index) {
    const event = appointments[index];
    const popup = document.getElementById('eventPopup');
    const popupTitle = document.getElementById('popupTitle');
    const popupDetails = document.getElementById('popupDetails');
    
    let linkHtml = event.link ? `<a href="${event.link}" target="_blank" class="event-link">Event Link</a>` : '';
    let imageHtml = event.image ? `<img src="${event.image}" alt="${event.title}" class="event-image">` : '';
    
    popupTitle.textContent = event.title;
    popupDetails.innerHTML = `
        ${imageHtml}
        <p class="mb-2"><strong>Datum:</strong> ${event.date}</p>
        <p class="mb-2"><strong>Uhrzeit:</strong> ${event.time}</p>
        <p class="mb-2"><strong>Beschreibung:</strong> ${event.description}</p>
        ${linkHtml}
    `;
    
    popup.classList.add('active');
}
