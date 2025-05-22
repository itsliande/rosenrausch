const events = [
    {
        id: 1,
        title: "Festival Unter Leuten",
        date: "2025-06-07",
        time: "20:00",
        location: "Internationaler Garten Meißen\nGroßenhainer Straße 161, 01662 Meißen",
        description: "Das Unter Leuten Festival in Meißen",
        image: "images/festival.jpg",
        links: [
            {
                url: "https://www.instagram.com/stories/highlights/18169382071332225/",
                label: "Tickets kaufen",
                icon: "fa-ticket-alt"
            },
            {
                url: "https://www.instagram.com/unter_leuten_2025/",
                label: "Mehr Informationen",
                icon: "fa-info-circle"
            }
        ],
        price: 25, // Jetzt als Zahl
        category: "Festival",
        info: { // Neues Objekt für zusätzliche Zahlen/Informationen
            capacity: 1000,
            duration: 180,
            minAge: 18
        }
    }
];
