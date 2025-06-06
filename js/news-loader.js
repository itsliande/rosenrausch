document.addEventListener('DOMContentLoaded', function() {
    // News-Container finden
    const newsContainer = document.getElementById('news-items-container');
    
    if (!newsContainer) return;
    
    // Spinner/Ladeanzeige einfügen
    newsContainer.innerHTML = '<div class="loading-indicator">Neuigkeiten werden geladen...</div>';
    
    // Bestimme die aktuelle Seite
    const currentUrl = window.location.href;
    const isMainPage = !currentUrl.includes('news.html');
    
    console.log('Ist Hauptseite:', isMainPage);
    
    // News-Daten von der JSON-Datei laden
    const jsonPath = './data/news.json';
    
    console.log('Versuche, News zu laden von:', jsonPath);
    
    // Verwende einen Timestamp, um Cache-Probleme zu vermeiden
    const timestamp = new Date().getTime();
    const urlWithTimestamp = `${jsonPath}?t=${timestamp}`;
    
    fetch(urlWithTimestamp)
        .then(response => {
            console.log('Server-Antwort:', response.status);
            if (!response.ok) {
                console.error('Fehlerhafte Antwort:', response.status, response.statusText);
                throw new Error('Netzwerkantwort war nicht ok');
            }
            return response.json();
        })
        .then(newsItems => {
            console.log('Geladene News:', newsItems);
            
            // Filtere nur aktive News-Items
            // Wenn active nicht definiert ist, gilt der Artikel als aktiv
            const activeNewsItems = newsItems.filter(item => item.active !== false);
            
            console.log('Aktive News nach Filterung:', activeNewsItems);
            
            // News nach ID sortieren (höchste zuerst = neueste)
            activeNewsItems.sort((a, b) => b.id - a.id);
            
            // Container leeren
            newsContainer.innerHTML = '';
            
            // Funktion zum Konvertieren von \n zu <br> Tags
            function convertNewlines(text) {
                return text.replace(/\n/g, '<br>');
            }
            
            // News-Items erstellen und anzeigen
            if (activeNewsItems.length === 0) {
                newsContainer.innerHTML = '<div class="no-news">Keine aktuellen Neuigkeiten verfügbar.</div>';
                return;
            }
            
            // Nur die neuesten 2 News auf der Hauptseite anzeigen
            const itemsToShow = isMainPage ? activeNewsItems.slice(0, 2) : activeNewsItems;
            
            itemsToShow.forEach(item => {
                const newsItem = document.createElement('div');
                newsItem.className = 'news-item';
                
                // Erstelle Termin-Link falls vorhanden
                let terminLinkHtml = '';
                if (item.terminLink) {
                    terminLinkHtml = `<div class="news-termin-link">
                        <a href="./termine#${item.terminLink}" class="termin-link-button">
                            <i class="fas fa-calendar-alt"></i> Zum Termin
                        </a>
                    </div>`;
                }
                
                newsItem.innerHTML = `
                    <span class="news-date">${item.date}</span>
                    <div class="news-item-title">${item.title}</div>
                    <div class="news-content">${convertNewlines(item.content)}</div>
                    ${terminLinkHtml}
                `;
                
                newsContainer.appendChild(newsItem);
            });
            
            // "Ältere ansehen" Button nur auf der Hauptseite hinzufügen, wenn es mehr als 2 aktive News gibt
            if (isMainPage && activeNewsItems.length > 2) {
                const viewMoreContainer = document.createElement('div');
                viewMoreContainer.className = 'news-all';
                viewMoreContainer.innerHTML = '<a href="./news">Ältere ansehen →</a>';
                
                // Sicherstellen, dass der Button nach dem Container eingefügt wird
                const newsContainerParent = newsContainer.parentElement;
                newsContainerParent.appendChild(viewMoreContainer);
            }
        })
        .catch(error => {
            console.error('Problem beim Laden der News:', error);
            newsContainer.innerHTML = `<div class="error-message">Die Neuigkeiten konnten nicht geladen werden: ${error.message}</div>`;
        });
});
