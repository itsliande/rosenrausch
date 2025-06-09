document.addEventListener('DOMContentLoaded', function() {
    const quotesContainer = document.getElementById('quotes-container');
    
    if (!quotesContainer) return;
    
    console.log('Lade Zitate...');
    
    // Verwende einen Timestamp, um Cache-Probleme zu vermeiden
    const timestamp = new Date().getTime();
    const jsonPath = `./data/quotes.json?t=${timestamp}`;
    
    fetch(jsonPath)
        .then(response => {
            console.log('Server-Antwort:', response.status);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(quotes => {
            console.log('Geladene Zitate:', quotes);
            
            // Filtere nur aktive Zitate
            const activeQuotes = quotes.filter(quote => quote.active !== false);
            
            // Sortiere nach ID (neueste zuerst)
            activeQuotes.sort((a, b) => b.id - a.id);
            
            // Container leeren
            quotesContainer.innerHTML = '';
            
            if (activeQuotes.length === 0) {
                quotesContainer.innerHTML = `
                    <div class="no-quotes">
                        <h3>Noch keine Zitate verfügbar</h3>
                        <p>Bald gibt es hier die lustigsten Sprüche aus den Livestreams!</p>
                    </div>
                `;
                return;
            }
            
            // Zitate erstellen und anzeigen
            activeQuotes.forEach(quote => {
                const quoteCard = document.createElement('div');
                quoteCard.className = 'quote-card';
                
                quoteCard.innerHTML = `
                    <div class="quote-text">${quote.text}</div>
                    <div class="quote-meta">
                        <span class="quote-date">${quote.date}</span>
                        ${quote.context ? `<span class="quote-context">${quote.context}</span>` : ''}
                    </div>
                `;
                
                quotesContainer.appendChild(quoteCard);
            });
            
            // Füge strukturierte Daten für die Zitate hinzu
            addQuotesStructuredData(activeQuotes);
        })
        .catch(error => {
            console.error('Problem beim Laden der Zitate:', error);
            quotesContainer.innerHTML = `
                <div class="no-quotes">
                    <h3>Fehler beim Laden</h3>
                    <p>Die Zitate konnten nicht geladen werden: ${error.message}</p>
                </div>
            `;
        });
});

/**
 * Fügt strukturierte Daten für die Zitate hinzu
 */
function addQuotesStructuredData(quotes) {
    const quotationsData = quotes.map(quote => ({
        "@type": "Quotation",
        "text": quote.text,
        "dateCreated": quote.date,
        "creator": {
            "@type": "Person",
            "name": "Rosenrausch"
        },
        "about": quote.context || "Livestream"
    }));
    
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": quotationsData.map((quote, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": quote
        }))
    };
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
}
