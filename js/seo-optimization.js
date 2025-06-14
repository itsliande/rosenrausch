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
    
    // Füge strukturierte Daten für News-Links hinzu
    addNewsLinksStructuredData();
}

/**
 * Fügt strukturierte Daten für News-Links hinzu
 */
function addNewsLinksStructuredData() {
    const newsItems = document.querySelectorAll('.news-item');
    if (newsItems.length === 0) return;
    
    const articles = [];
    
    newsItems.forEach((item, index) => {
        const title = item.querySelector('.news-item-title')?.textContent;
        const date = item.querySelector('.news-date')?.textContent;
        const content = item.querySelector('.news-content')?.textContent;
        const links = item.querySelectorAll('.news-link-button');
        
        if (title && date) {
            const article = {
                "@type": "NewsArticle",
                "headline": title,
                "datePublished": convertDateToISO(date),
                "author": {
                    "@type": "Person",
                    "name": "Rosenrausch"
                },
                "publisher": {
                    "@type": "Organization",
                    "name": "Rosenrausch",
                    "url": "https://rosenrausch.xyz"
                }
            };
            
            if (content) {
                article.description = content.substring(0, 200);
            }
            
            // Füge externe Links als Referenzen hinzu
            if (links.length > 0) {
                article.mentions = Array.from(links).map(link => ({
                    "@type": "WebPage",
                    "url": link.href,
                    "name": link.querySelector('span')?.textContent || 'External Link'
                }));
            }
            
            articles.push(article);
        }
    });
    
    if (articles.length > 0) {
        const structuredData = {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "itemListElement": articles.map((article, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": article
            }))
        };
        
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(structuredData);
        document.head.appendChild(script);
    }
}

/**
 * Konvertiert deutsches Datum zu ISO-Format
 */
function convertDateToISO(germanDate) {
    const months = {
        'Januar': '01', 'Februar': '02', 'März': '03', 'April': '04',
        'Mai': '05', 'Juni': '06', 'Juli': '07', 'August': '08',
        'September': '09', 'Oktober': '10', 'November': '11', 'Dezember': '12'
    };
    
    // Format: "1. Juni 2025"
    const parts = germanDate.replace('.', '').split(' ');
    if (parts.length === 3) {
        const day = parts[0].padStart(2, '0');
        const month = months[parts[1]] || '01';
        const year = parts[2];
        return `${year}-${month}-${day}`;
    }
    
    // Fallback: aktuelles Datum
    return new Date().toISOString().split('T')[0];
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
        '/quotes': 'Zitate & Sprüche',
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

/**
 * Validiert die Sitemap auf korrekte Formate
 */
function validateSitemap() {
    // Sitemap-Validierung für Development
    if (window.location.hostname === 'localhost') {
        console.log('Sitemap-Validierung wird nur in der Development-Umgebung ausgeführt');
        
        // Überprüfe, ob Sitemap existiert
        fetch('/sitemap.xml')
            .then(response => {
                if (!response.ok) {
                    console.warn('Sitemap.xml nicht gefunden oder nicht erreichbar');
                    return;
                }
                return response.text();
            })
            .then(xmlText => {
                if (!xmlText) return;
                
                try {
                    const parser = new DOMParser();
                    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
                    
                    // Überprüfe auf Parser-Fehler
                    const parseError = xmlDoc.querySelector('parsererror');
                    if (parseError) {
                        console.error('Sitemap XML Parse Error:', parseError.textContent);
                        return;
                    }
                    
                    // Validiere URLs und Daten
                    const urls = xmlDoc.querySelectorAll('url');
                    urls.forEach((url, index) => {
                        const loc = url.querySelector('loc')?.textContent;
                        const lastmod = url.querySelector('lastmod')?.textContent;
                        
                        if (!loc) {
                            console.warn(`URL ${index + 1}: loc fehlt`);
                        } else if (!loc.startsWith('https://rosenrausch.xyz/')) {
                            console.warn(`URL ${index + 1}: Ungültige Domain in loc`);
                        }
                        
                        if (lastmod && !isValidDate(lastmod)) {
                            console.warn(`URL ${index + 1}: Ungültiges Datumsformat in lastmod: ${lastmod}`);
                        }
                    });
                    
                    console.log(`Sitemap validiert: ${urls.length} URLs gefunden`);
                    
                } catch (e) {
                    console.error('Sitemap-Validierung fehlgeschlagen:', e);
                }
            })
            .catch(e => console.error('Fehler beim Laden der Sitemap:', e));
    }
}

/**
 * Überprüft, ob ein Datum im ISO 8601 Format vorliegt
 */
function isValidDate(dateString) {
    const iso8601Regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!iso8601Regex.test(dateString)) {
        return false;
    }
    
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
}

/**
 * Generiert automatisch eine Sitemap für dynamische Inhalte
 */
function generateDynamicSitemap() {
    const staticUrls = [
        { url: '/', priority: 1.0, changefreq: 'daily' },
        { url: '/minecraft', priority: 0.9, changefreq: 'weekly' },
        { url: '/termine', priority: 0.8, changefreq: 'weekly' },
        { url: '/team', priority: 0.7, changefreq: 'monthly' },
        { url: '/news', priority: 0.8, changefreq: 'daily' },
        { url: '/quotes', priority: 0.6, changefreq: 'weekly' },
        { url: '/impressum', priority: 0.3, changefreq: 'yearly' },
        { url: '/privacy', priority: 0.3, changefreq: 'yearly' }
    ];
    
    const currentDate = new Date().toISOString().split('T')[0];
    
    let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    sitemapContent += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    
    staticUrls.forEach(page => {
        sitemapContent += `  <url>\n`;
        sitemapContent += `    <loc>https://rosenrausch.xyz${page.url}</loc>\n`;
        sitemapContent += `    <lastmod>${currentDate}</lastmod>\n`;
        sitemapContent += `    <changefreq>${page.changefreq}</changefreq>\n`;
        sitemapContent += `    <priority>${page.priority}</priority>\n`;
        sitemapContent += `  </url>\n`;
    });
    
    sitemapContent += `</urlset>`;
    
    // Nur in Development-Umgebung ausgeben
    if (window.location.hostname === 'localhost') {
        console.log('Generierte Sitemap:', sitemapContent);
    }
    
    return sitemapContent;
}

// Führe Sitemap-Validierung aus
validateSitemap();
