let events = [];

class EventManager {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.activeEvent = null;
        this.activeDropdown = null;
        this.isMobile = window.innerWidth <= 520;
        this.showPastEvents = false;
        this.toggleButton = null;
        
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

    // Add method to load events from JSON
    async loadEvents() {
        try {
            const response = await fetch('data/events.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            events = await response.json();
            return events;
        } catch (error) {
            console.error('Error loading events:', error);
            // Fallback to empty array if loading fails
            events = [];
            return events;
        }
    }

    // Check if an event is in the past
    isEventPast(event) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // If event has an end date, use that for comparison
        const eventEndDate = new Date(event.endDate || event.date);
        eventEndDate.setHours(23, 59, 59, 999);
        
        return eventEndDate < today;
    }

    // Create toggle button for past events
    createToggleButton() {
        const pastEventsCount = events.filter(event => this.isEventPast(event)).length;
        
        if (pastEventsCount === 0) return;

        // Remove existing button if it exists
        const existingContainer = document.querySelector('.past-events-toggle-container');
        if (existingContainer) {
            existingContainer.remove();
        }

        const toggleContainer = document.createElement('div');
        toggleContainer.className = 'past-events-toggle-container';
        
        this.toggleButton = document.createElement('button');
        this.toggleButton.className = 'past-events-toggle';
        this.updateButtonText(pastEventsCount);
        
        this.toggleButton.addEventListener('click', () => {
            this.togglePastEvents();
        });
        
        toggleContainer.appendChild(this.toggleButton);
        
        // Store reference to toggle container for later placement
        this.toggleContainer = toggleContainer;
    }

    // New method to update button text
    updateButtonText(pastEventsCount) {
        if (this.showPastEvents) {
            this.toggleButton.innerHTML = `
                <i class="fas fa-arrow-left"></i>
                Zurück zu aktuellen Terminen
            `;
            this.toggleButton.classList.add('active');
        } else {
            this.toggleButton.innerHTML = `
                <i class="fas fa-history"></i>
                Vergangene Termine ansehen (${pastEventsCount})
            `;
            this.toggleButton.classList.remove('active');
        }
    }

    // Toggle past events visibility
    togglePastEvents() {
        this.showPastEvents = !this.showPastEvents;
        
        const pastEventsCount = events.filter(event => this.isEventPast(event)).length;
        this.updateButtonText(pastEventsCount);
        
        // Add class to container when showing past events for additional styling
        if (this.toggleContainer) {
            if (this.showPastEvents) {
                this.toggleContainer.classList.add('showing-past-events');
            } else {
                this.toggleContainer.classList.remove('showing-past-events');
            }
        }
        
        this.render();
    }

    formatDate(dateStr) {
        return new Date(dateStr).toLocaleDateString('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    // Format date range for multi-day events
    formatDateRange(startDate, endDate) {
        if (!endDate) {
            return this.formatDate(startDate);
        }
        
        const start = this.formatDate(startDate);
        const end = this.formatDate(endDate);
        
        return `${start} - ${end}`;
    }

    createEventElement(event) {
        const element = document.createElement('div');
        element.className = 'event-container';
        if (this.isEventPast(event)) {
            element.classList.add('past-event');
        }
        element.id = event.id;
        
        const dateDisplay = this.formatDateRange(event.date, event.endDate);
        
        element.innerHTML = `
            <div class="event-header">
                <div class="event-header-left">
                    <div class="event-title">${event.title}</div>
                    <div class="event-meta">
                        <span><i class="far fa-calendar"></i> ${dateDisplay}</span>
                        <span><i class="far fa-clock"></i> ${event.time}</span>
                    </div>
                </div>
                <i class="fas fa-chevron-down"></i>
            </div>
            <div class="event-content">
                <div class="event-details">
                    <div class="event-info-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <div style="white-space: pre-line">${event.location}</div>
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
                <div class="event-description">
                    <h3 class="event-description-title">Beschreibung</h3>
                    ${event.description}
                </div>
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

    // Function to scroll to specific event based on URL fragment
    scrollToEvent() {
        const fragment = window.location.hash.substring(1);
        if (fragment) {
            setTimeout(() => {
                const element = document.getElementById(fragment);
                if (element) {
                    // Open the event if it's not already open
                    if (!element.classList.contains('active')) {
                        this.toggleEvent(element);
                    }
                    // Scroll to the event
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    
                    // Add highlight effect
                    element.style.boxShadow = '0 0 20px rgba(168, 85, 247, 0.5)';
                    setTimeout(() => {
                        element.style.boxShadow = '';
                    }, 2000);
                }
            }, 300);
        }
    }

    async render() {
        // Load events if not already loaded
        if (events.length === 0) {
            await this.loadEvents();
        }
        
        // Create toggle button after events are loaded
        this.createToggleButton();
        
        this.container.innerHTML = '';
        
        // Filter events based on showPastEvents setting
        const filteredEvents = events.filter(event => {
            return this.showPastEvents || !this.isEventPast(event);
        });
        
        // Separate past and future events
        const futureEvents = filteredEvents.filter(event => !this.isEventPast(event));
        const pastEvents = filteredEvents.filter(event => this.isEventPast(event));
        
        // Check if there are no current events
        if (futureEvents.length === 0 && !this.showPastEvents) {
            const noEventsMessage = document.createElement('div');
            noEventsMessage.className = 'no-events-message';
            noEventsMessage.innerHTML = `
                <i class="fas fa-calendar-times"></i>
                <h3>Momentan stehen keine Termine an</h3>
                <p>Schau später wieder vorbei oder folge uns in den sozialen Medien, um über neue Termine informiert zu werden!</p>
            `;
            this.container.appendChild(noEventsMessage);
        } else {
            // Sort future events by date (ascending), past events by date (descending)
            futureEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
            pastEvents.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            // Render future events first, then past events
            [...futureEvents, ...pastEvents].forEach(event => {
                this.container.appendChild(this.createEventElement(event));
            });
        }
        
        // Add toggle button at the end in all cases
        if (this.toggleContainer) {
            this.container.appendChild(this.toggleContainer);
        }
        
        // After rendering, check for URL fragment
        this.scrollToEvent();
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const eventManager = new EventManager('events-container');
    await eventManager.render();
});

// Listen for hash changes (when someone changes the URL fragment)
window.addEventListener('hashchange', () => {
    const eventManager = new EventManager('events-container');
    eventManager.scrollToEvent();
});
