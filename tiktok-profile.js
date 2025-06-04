// TikTok Username (Fallback)
const TIKTOK_USERNAME = 'rauschipromo.fanacc';

const TikTokProfileLoader = {
    isLive: false,
    checkInterval: null,
    currentUsername: null,

    async loadProfilePic() {
        const img = document.querySelector('img[data-tiktok]');
        const username = img.getAttribute('data-tiktok');
        this.currentUsername = username;
        
        console.log('Versuche Profilbild zu laden für Username:', username);

        try {
            // Methode 1: Versuche direkte TikTok-Anfrage
            await this.tryDirectTikTokFetch(username, img);
        } catch (error) {
            console.log('Direkte TikTok-Anfrage fehlgeschlagen, versuche Alternativen...');
            
            try {
                // Methode 2: Verwende CORS-Proxy
                await this.tryProxyFetch(username, img);
            } catch (proxyError) {
                console.log('Proxy-Anfrage fehlgeschlagen, verwende Fallback...');
                
                // Methode 3: Verwende TikTok API Fallback
                await this.tryApiFallback(username, img);
            }
        }
    },

    async tryDirectTikTokFetch(username, img) {
        const response = await fetch(`https://www.tiktok.com/@${username}`, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        if (!response.ok) {
            throw new Error('Direkte TikTok-Anfrage fehlgeschlagen');
        }

        const text = await response.text();
        const avatarUrl = this.extractAvatarFromHtml(text);
        
        if (avatarUrl) {
            img.src = avatarUrl;
            console.log('Profilbild geladen (direkt):', avatarUrl);
        } else {
            throw new Error('Profilbild nicht gefunden');
        }
    },

    async tryProxyFetch(username, img) {
        // Verwende CORS-Proxy
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(`https://www.tiktok.com/@${username}`)}`;
        
        const response = await fetch(proxyUrl);
        if (!response.ok) {
            throw new Error('Proxy-Anfrage fehlgeschlagen');
        }

        const data = await response.json();
        const avatarUrl = this.extractAvatarFromHtml(data.contents);
        
        if (avatarUrl) {
            img.src = avatarUrl;
            console.log('Profilbild geladen (proxy):', avatarUrl);
        } else {
            throw new Error('Profilbild nicht gefunden');
        }
    },

    async tryApiFallback(username, img) {
        // Fallback: Verwende generisches TikTok-Profilbild-Pattern
        const fallbackUrls = [
            `https://p16-sign-va.tiktokcdn.com/tos-maliva-avt-0068/${username}~c5_720x720.jpeg`,
            `https://p16-sign-va.tiktokcdn.com/tos-maliva-avt-0068/${username}~c5_300x300.jpeg`,
            'profile.jpg'
        ];

        for (const url of fallbackUrls) {
            try {
                const response = await fetch(url, { method: 'HEAD' });
                if (response.ok) {
                    img.src = url;
                    console.log('Profilbild geladen (fallback):', url);
                    return;
                }
            } catch (e) {
                continue;
            }
        }
        
        // Letzter Fallback
        img.src = 'profile.jpg';
        console.log('Verwende Standard-Profilbild');
    },

    extractAvatarFromHtml(text) {
        // Debug: Zeige ob Username im HTML gefunden wird
        if (text.includes(this.currentUsername)) {
            console.log('Username gefunden im HTML');
        } else {
            console.log('Username NICHT im HTML gefunden');
        }
        
        // Methode 1: og:image Meta-Tag
        const ogImage = text.match(/<meta property="og:image" content="([^"]+)"/);
        if (ogImage && ogImage[1]) {
            return ogImage[1];
        }
        
        // Methode 2: JSON-LD Struktur
        const jsonLd = text.match(/<script type="application\/ld\+json"[^>]*>(.*?)<\/script>/s);
        if (jsonLd) {
            try {
                const data = JSON.parse(jsonLd[1]);
                if (data.author && data.author.image) {
                    return data.author.image;
                }
            } catch (e) {}
        }
        
        // Methode 3: Suche nach Avatar-URLs im Text
        const avatarMatch = text.match(/"avatarLarger":"([^"]+)"/);
        if (avatarMatch && avatarMatch[1]) {
            return avatarMatch[1].replace(/\\u002F/g, '/');
        }
        
        // Methode 4: Alternative Avatar-Suche
        const altAvatarMatch = text.match(/"avatar":"([^"]+)"/);
        if (altAvatarMatch && altAvatarMatch[1]) {
            return altAvatarMatch[1].replace(/\\u002F/g, '/');
        }

        return null;
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
