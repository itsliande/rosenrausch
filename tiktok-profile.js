// TikTok Username
const TIKTOK_USERNAME = 'rauschipromo.fanacc';

const TikTokProfileLoader = {
    isLive: false,
    checkInterval: null,

    async loadProfilePic() {
        const img = document.querySelector('img[data-tiktok]');
        const username = img.getAttribute('data-tiktok');

        try {
            // Nutze TikTok Username Info Endpoint
            const response = await fetch(`https://www.tiktok.com/@${username}`, {
                method: 'GET',
                headers: {
                    'User-Agent': 'Mozilla/5.0'
                }
            });

            if (!response.ok) {
                throw new Error('Fehler beim Laden des Profilbilds');
            }

            const text = await response.text();
            const avatar = text.match(/<meta property="og:image" content="([^"]+)"/);

            if (avatar && avatar[1]) {
                img.src = avatar[1];
            }
        } catch (error) {
            console.error('Fehler:', error);
            // Fallback zum Standard-Profilbild
            img.src = 'profile.jpg';
        }
    },

    async checkLiveStatus() {
        try {
            // Versuche TikTok Live-Status zu ermitteln
            const response = await fetch(`https://www.tiktok.com/@${TIKTOK_USERNAME}`, {
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
