/**
 * Google Search Console Helper Script
 * Unterstützt bei der SEO-Optimierung und Monitoring
 */

document.addEventListener('DOMContentLoaded', function() {
    // SEO Health Check durchführen
    performSEOHealthCheck();
    
    // Schema.org Validation
    validateStructuredData();
    
    // Performance Monitoring
    monitorPagePerformance();
});

/**
 * Führt einen grundlegenden SEO Health Check durch
 */
function performSEOHealthCheck() {
    const issues = [];
    
    // Title Tag prüfen
    const title = document.querySelector('title');
    if (!title || title.textContent.length < 30 || title.textContent.length > 60) {
        issues.push('Title Tag sollte zwischen 30-60 Zeichen haben');
    }
    
    // Meta Description prüfen
    const description = document.querySelector('meta[name="description"]');
    if (!description || description.content.length < 120 || description.content.length > 160) {
        issues.push('Meta Description sollte zwischen 120-160 Zeichen haben');
    }
    
    // H1 Tag prüfen
    const h1Tags = document.querySelectorAll('h1');
    if (h1Tags.length !== 1) {
        issues.push('Seite sollte genau ein H1 Tag haben');
    }
    
    // Alt-Texte für Bilder prüfen
    const imagesWithoutAlt = document.querySelectorAll('img:not([alt])');
    if (imagesWithoutAlt.length > 0) {
        issues.push(`${imagesWithoutAlt.length} Bilder ohne Alt-Text gefunden`);
    }
    
    // Canonical URL prüfen
    const canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
        issues.push('Canonical URL fehlt');
    }
    
    // Strukturierte Daten prüfen
    const structuredData = document.querySelectorAll('script[type="application/ld+json"]');
    if (structuredData.length === 0) {
        issues.push('Keine strukturierten Daten gefunden');
    }
    
    // Issues in Konsole ausgeben (nur im Development)
    if (issues.length > 0 && window.location.hostname === 'localhost') {
        console.group('SEO Health Check Issues:');
        issues.forEach(issue => console.warn(issue));
        console.groupEnd();
    }
    
    return issues;
}

/**
 * Validiert strukturierte Daten
 */
function validateStructuredData() {
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    
    scripts.forEach((script, index) => {
        try {
            const data = JSON.parse(script.textContent);
            
            // Grundlegende Validierung
            if (!data['@context'] || !data['@type']) {
                console.warn(`Strukturierte Daten ${index + 1}: @context oder @type fehlt`);
            }
            
            // Spezifische Validierungen je nach Type
            if (data['@type'] === 'Person') {
                if (!data.name || !data.url) {
                    console.warn(`Person Schema ${index + 1}: name oder url fehlt`);
                }
            }
            
            if (data['@type'] === 'Event') {
                if (!data.name || !data.startDate) {
                    console.warn(`Event Schema ${index + 1}: name oder startDate fehlt`);
                }
            }
            
        } catch (e) {
            console.error(`Ungültiges JSON in strukturierten Daten ${index + 1}:`, e);
        }
    });
}

/**
 * Überwacht Page Performance für Core Web Vitals
 */
function monitorPagePerformance() {
    // Nur im Production Environment
    if (window.location.hostname === 'localhost') return;
    
    // Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
        try {
            new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                
                // LCP sollte unter 2.5s sein
                if (lastEntry.startTime > 2500) {
                    console.warn(`LCP Performance Issue: ${lastEntry.startTime}ms (sollte < 2500ms sein)`);
                }
            }).observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
            // Browser unterstützt LCP nicht
        }
        
        // First Input Delay (FID)
        try {
            new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    const fid = entry.processingStart - entry.startTime;
                    
                    // FID sollte unter 100ms sein
                    if (fid > 100) {
                        console.warn(`FID Performance Issue: ${fid}ms (sollte < 100ms sein)`);
                    }
                });
            }).observe({ entryTypes: ['first-input'] });
        } catch (e) {
            // Browser unterstützt FID nicht
        }
        
        // Cumulative Layout Shift (CLS)
        try {
            new PerformanceObserver((list) => {
                const entries = list.getEntries();
                let cumulativeScore = 0;
                
                entries.forEach(entry => {
                    if (!entry.hadRecentInput) {
                        cumulativeScore += entry.value;
                    }
                });
                
                // CLS sollte unter 0.1 sein
                if (cumulativeScore > 0.1) {
                    console.warn(`CLS Performance Issue: ${cumulativeScore} (sollte < 0.1 sein)`);
                }
            }).observe({ entryTypes: ['layout-shift'] });
        } catch (e) {
            // Browser unterstützt CLS nicht
        }
    }
}

/**
 * Generiert automatisch einen SEO-Report
 */
function generateSEOReport() {
    const report = {
        url: window.location.href,
        timestamp: new Date().toISOString(),
        title: document.title,
        description: document.querySelector('meta[name="description"]')?.content || 'Keine Description gefunden',
        h1Count: document.querySelectorAll('h1').length,
        imageCount: document.querySelectorAll('img').length,
        imagesWithoutAlt: document.querySelectorAll('img:not([alt])').length,
        hasCanonical: !!document.querySelector('link[rel="canonical"]'),
        structuredDataCount: document.querySelectorAll('script[type="application/ld+json"]').length,
        issues: performSEOHealthCheck()
    };
    
    return report;
}

/**
 * Export für andere Scripts
 */
window.SEOHelper = {
    performHealthCheck: performSEOHealthCheck,
    generateReport: generateSEOReport,
    validateStructuredData: validateStructuredData
};

/**
 * Automatische Sitemap-Generierung für dynamische Inhalte
 */
function generateDynamicSitemapEntries() {
    const entries = [];
    
    // Events auf der Termine-Seite
    const events = document.querySelectorAll('.event-container');
    events.forEach(event => {
        const eventTitle = event.querySelector('.event-title')?.textContent;
        const eventDate = event.querySelector('[data-event-date]')?.getAttribute('data-event-date');
        
        if (eventTitle && eventDate) {
            entries.push({
                url: `${window.location.origin}/termine#${encodeURIComponent(eventTitle)}`,
                lastmod: eventDate,
                changefreq: 'weekly',
                priority: 0.7
            });
        }
    });
    
    // Team-Mitglieder
    const teamMembers = document.querySelectorAll('.team-member');
    teamMembers.forEach(member => {
        const memberName = member.querySelector('.member-name')?.textContent;
        if (memberName) {
            entries.push({
                url: `${window.location.origin}/team#${encodeURIComponent(memberName)}`,
                lastmod: new Date().toISOString().split('T')[0],
                changefreq: 'monthly',
                priority: 0.6
            });
        }
    });
    
    return entries;
}
