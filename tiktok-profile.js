// TikTok Username (Fallback)
const TIKTOK_USERNAME = 'rauschipromo.fanacc';

const TikTokProfileLoader = {
    isLive: false,
    checkInterval: null,
    currentUsername: null,

    async loadProfilePic() {
        const img = document.querySelector('img[data-tiktok]');
        const username = img.getAttribute('data-tiktok');
        this.currentUsername = username; // Speichere den aktuellen Username

        try {
            // Nutze den Username aus dem HTML-Attribut
            const response = await fetch(`https://www.tiktok.com/@${username}`, {
                method: 'GET',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });

            if (!response.ok) {
                throw new Error('Fehler beim Laden des Profilbilds');
            }

            const text = await response.text();
            
            // Mehrere Methoden zum Finden des Profilbilds
            let avatarUrl = null;
            
            // Methode 1: og:image Meta-Tag
            const ogImage = text.match(/<meta property="og:image" content="([^"]+)"/);
            if (ogImage && ogImage[1]) {
                avatarUrl = ogImage[1];
            }
            
            // Methode 2: JSON-LD Struktur
            if (!avatarUrl) {
                const jsonLd = text.match(/<script type="application\/ld\+json"[^>]*>(.*?)<\/script>/s);
                if (jsonLd) {
                    try {
                        const data = JSON.parse(jsonLd[1]);
                        if (data.author && data.author.image) {
                            avatarUrl = data.author.image;
                        }
                    } catch (e) {}
                }
            }
            
            // Methode 3: Suche nach Avatar-URLs im Text
            if (!avatarUrl) {
                const avatarMatch = text.match(/"avatarLarger":"([^"]+)"/);
                if (avatarMatch && avatarMatch[1]) {
                    avatarUrl = avatarMatch[1].replace(/\\u002F/g, '/');
                }
            }
            
            // Methode 4: Alternative Avatar-Suche
            if (!avatarUrl) {
                const altAvatarMatch = text.match(/"avatar":"([^"]+)"/);
                if (altAvatarMatch && altAvatarMatch[1]) {
                    avatarUrl = altAvatarMatch[1].replace(/\\u002F/g, '/');
                }
            }

            if (avatarUrl) {
                img.src = avatarUrl;
                console.log('Profilbild geladen:', avatarUrl);
            } else {
                throw new Error('Profilbild nicht gefunden');
            }
        } catch (error) {
            console.error('Fehler beim Laden des Profilbilds:', error);
            // Fallback zum Standard-Profilbild
            img.src = 'profile.jpg';
        }
    },

    async checkLiveStatus() {
        try {
            // Verwende den gespeicherten Username oder Fallback
            const username = this.currentUsername || TIKTOK_USERNAME;
            const response = await fetch(`https://www.tiktok.com/@${username}`, {
                method: 'GET',
                headers: {
                    'User-Agent': 'Mozilla/5.0'
                }
            });

            if (!response.ok) {
                throw new Error('Fehler beim Laden des Live-Status');
            }

            const text = await response.text();
            
            // Suche nach Live-Indikatoren im HTML
            const isCurrentlyLive = text.includes('"is_live":true') || 
                                  text.includes('class="live-indicator"') ||
                                  text.includes('data-e2e="live-avatar"') ||
                                  text.includes('"liveStatus":"live"');

            if (isCurrentlyLive !== this.isLive) {
                this.isLive = isCurrentlyLive;
                this.updateLiveIndicator();
            }
        } catch (error) {
            console.error('Fehler beim Live-Status-Check:', error);
            // Bei Fehlern Live-Status ausblenden
            this.isLive = false;
            this.updateLiveIndicator();
        }
    },

    updateLiveIndicator() {
        const profileImg = document.querySelector('.profile-img');
        
        if (this.isLive) {
            profileImg.classList.add('live-ring', 'live-glow');
            profileImg.classList.remove('offline-ring');
        } else {
            profileImg.classList.add('offline-ring');
            profileImg.classList.remove('live-ring', 'live-glow');
        }
    },

    startLiveCheck() {
        // Initialer Check
        this.checkLiveStatus();
        
        // Überprüfe alle 2 Minuten den Live-Status
        this.checkInterval = setInterval(() => {
            this.checkLiveStatus();
        }, 120000); // 2 Minuten
    },

    stopLiveCheck() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
        }
    }
};

// Lade Profilbild und starte Live-Check wenn die Seite geladen ist
document.addEventListener('DOMContentLoaded', () => {
    TikTokProfileLoader.loadProfilePic();
    TikTokProfileLoader.startLiveCheck();
    
    // Initialer Ring-Status (offline)
    const profileImg = document.querySelector('.profile-img');
    if (profileImg) {
        profileImg.classList.add('offline-ring');
    }
});

// Stoppe Live-Check beim Verlassen der Seite
window.addEventListener('beforeunload', () => {
    TikTokProfileLoader.stopLiveCheck();
});
