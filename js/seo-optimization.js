/**
 * SEO Optimization Script für die Rosenrausch Website
 * Verbessert die Suchmaschinenoptimierung durch dynamische Meta-Tags und strukturierte Daten
 */

document.addEventListener('DOMContentLoaded', function() {
    // Dynamische Schema.org Structured Data für Events hinzufügen
    addEventStructuredData();
    
    // Lazy Loading für Bilder implementieren
    implementLazyLoading();
    
    // Meta-Description für dynamische Inhalte aktualisieren
    updateDynamicMetaData();
    
    // Performance-Tracking für Core Web Vitals
    trackCoreWebVitals();
});

/**
 * Fügt strukturierte Daten für Events hinzu
 */
function addEventStructuredData() {
    const eventsContainer = document.getElementById('events-container');
    if (!eventsContainer) return;
    
    // Überprüfe, ob Events vorhanden sind
    const events = eventsContainer.querySelectorAll('.event-container');
    if (events.length === 0) return;
    
    const eventsData = [];
    
    events.forEach(event => {
        const title = event.querySelector('.event-title')?.textContent;
        const dateElement = event.querySelector('[data-event-date]');
        const locationElement = event.querySelector('[data-event-location]');
        const descriptionElement = event.querySelector('.event-description');
        
        if (title && dateElement) {
            const eventData = {
                "@type": "Event",
                "name": title,
                "startDate": dateElement.getAttribute('data-event-date'),
                "url": window.location.href,
                "organizer": {
                    "@type": "Person",
                    "name": "Rosenrausch",
                    "url": "https://rosenrausch.xyz"
                }
            };
            
            if (locationElement) {
                eventData.location = {
                    "@type": "Place",
                    "name": locationElement.textContent
                };
            }
            
            if (descriptionElement) {
                eventData.description = descriptionElement.textContent;
            }
            
            eventsData.push(eventData);
        }
    });
    
    if (eventsData.length > 0) {
        const structuredData = {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "itemListElement": eventsData.map((event, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": event
            }))
        };
        
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(structuredData);
        document.head.appendChild(script);
    }
}

/**
 * Implementiert Lazy Loading für bessere Performance
 */
function implementLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback für ältere Browser
        images.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
}

/**
 * Aktualisiert Meta-Daten basierend auf dynamischen Inhalten
 */
function updateDynamicMetaData() {
    // Aktualisiere die Meta-Description basierend auf aktuellen News
    const newsContainer = document.getElementById('news-items-container');
    if (newsContainer && newsContainer.children.length > 0) {
        const firstNews = newsContainer.querySelector('.news-item-title');
        if (firstNews) {
            const currentDescription = document.querySelector('meta[name="description"]');
            const newsTitle = firstNews.textContent;
            
            if (currentDescription && newsTitle) {
                const enhancedDescription = currentDescription.content + ` Aktuelle News: ${newsTitle}`;
                currentDescription.setAttribute('content', enhancedDescription.substring(0, 160));
            }
        }
    }
}

/**
 * Trackt Core Web Vitals für Performance-Monitoring
 */
function trackCoreWebVitals() {
    // Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
        try {
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                console.log('LCP:', lastEntry.startTime);
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
            console.log('LCP monitoring not supported');
        }
        
        // First Input Delay (FID)
        try {
            const fidObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    console.log('FID:', entry.processingStart - entry.startTime);
                });
            });
            fidObserver.observe({ entryTypes: ['first-input'] });
        } catch (e) {
            console.log('FID monitoring not supported');
        }
        
        // Cumulative Layout Shift (CLS)
        try {
            const clsObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (!entry.hadRecentInput) {
                        console.log('CLS:', entry.value);
                    }
                });
            });
            clsObserver.observe({ entryTypes: ['layout-shift'] });
        } catch (e) {
            console.log('CLS monitoring not supported');
        }
    }
}

/**
 * Generiert automatisch alt-Texte für Bilder ohne alt-Attribut
 */
function generateAltTexts() {
    const images = document.querySelectorAll('img:not([alt])');
    
    images.forEach(img => {
        const src = img.src || img.dataset.src || '';
        const filename = src.split('/').pop()?.split('.')[0] || '';
        
        // Generiere sinnvollen alt-Text basierend auf Kontext
        let altText = 'Bild';
        
        if (filename.includes('profile')) {
            altText = 'Rosenrausch Profilbild';
        } else if (filename.includes('event')) {
            altText = 'Event Bild';
        } else if (filename.includes('team')) {
            altText = 'Team Mitglied';
        } else if (img.closest('.event-container')) {
            const eventTitle = img.closest('.event-container')?.querySelector('.event-title')?.textContent;
            altText = eventTitle ? `Event: ${eventTitle}` : 'Event Bild';
        }
        
        img.setAttribute('alt', altText);
    });
}

// Führe alt-Text Generierung aus
generateAltTexts();

/**
 * Fügt Breadcrumb-Struktur hinzu
 */
function addBreadcrumbStructuredData() {
    const path = window.location.pathname;
    const breadcrumbs = [];
    
    // Startseite
    breadcrumbs.push({
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://rosenrausch.xyz/"
    });
    
    // Aktuelle Seite basierend auf Pfad
    const pageNames = {
        '/minecraft': 'Minecraft Server',
        '/termine': 'Termine & Events',
        '/team': 'Unser Team',
        '/news': 'Neuigkeiten',
        '/impressum': 'Impressum',
        '/privacy': 'Datenschutz'
    };
    
    if (pageNames[path]) {
        breadcrumbs.push({
            "@type": "ListItem",
            "position": 2,
            "name": pageNames[path],
            "item": `https://rosenrausch.xyz${path}`
        });
    }
    
    if (breadcrumbs.length > 1) {
        const breadcrumbData = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": breadcrumbs
        };
        
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(breadcrumbData);
        document.head.appendChild(script);
    }
}

// Füge Breadcrumb-Daten hinzu
addBreadcrumbStructuredData();
