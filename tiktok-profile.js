// TikTok Username (Fallback) - ohne @
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
        console.log('IMG Element gefunden:', img ? 'Ja' : 'Nein');
        console.log('data-tiktok Attribut:', username);

        // Einfacher Ansatz: Verwende nur Proxy-Methode
        try {
            await this.tryProxyFetch(username, img);
        } catch (error) {
            console.log('Alle Methoden fehlgeschlagen, verwende Standard-Profilbild');
            img.src = 'profile.jpg';
        }
    },

    async tryProxyFetch(username, img) {
        try {
            // Verwende CORS-Proxy mit besserer Fehlerbehandlung
            const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(`https://www.tiktok.com/@${username}`)}`;
            console.log('Proxy URL:', proxyUrl);
            
            const response = await fetch(proxyUrl);
            console.log('Proxy Response Status:', response.status);
            
            if (!response.ok) {
                throw new Error(`Proxy-Anfrage fehlgeschlagen: ${response.status}`);
            }

            const data = await response.json();
            console.log('Proxy Response erhalten, Länge:', data.contents ? data.contents.length : 'undefined');
            
            const avatarUrl = this.extractAvatarFromHtml(data.contents);
            
            if (avatarUrl) {
                img.src = avatarUrl;
                console.log('✓ Profilbild erfolgreich geladen:', avatarUrl);
                return;
            } else {
                console.log('Kein Avatar in HTML gefunden, versuche direkte CDN-URLs...');
                await this.tryDirectCdnUrls(username, img);
            }
        } catch (error) {
            console.error('Proxy-Fehler:', error);
            await this.tryDirectCdnUrls(username, img);
        }
    },

    async tryDirectCdnUrls(username, img) {
        // Teste bekannte TikTok CDN-Patterns
        const cdnPatterns = [
            `https://p16-sign-va.tiktokcdn.com/tos-maliva-avt-0068/default_${username}~c5_720x720.jpeg`,
            `https://p16-sign-va.tiktokcdn.com/tos-maliva-avt-0068/${username}~c5_720x720.jpeg`,
            `https://p77-sign-va.tiktokcdn.com/tos-maliva-avt-0068/default_${username}~c5_300x300.jpeg`,
            // Fallback zur statischen Datei
            'profile.jpg'
        ];

        for (const url of cdnPatterns) {
            try {
                console.log('Teste CDN URL:', url);
                
                // Teste ob das Bild existiert
                const testImg = new Image();
                testImg.crossOrigin = 'anonymous';
                
                const imageLoaded = await new Promise((resolve) => {
                    testImg.onload = () => resolve(true);
                    testImg.onerror = () => resolve(false);
                    testImg.src = url;
                    
                    // Timeout nach 3 Sekunden
                    setTimeout(() => resolve(false), 3000);
                });

                if (imageLoaded) {
                    img.src = url;
                    console.log('✓ Profilbild von CDN geladen:', url);
                    return;
                }
            } catch (e) {
                console.log('CDN URL fehlgeschlagen:', url);
                continue;
            }
        }
        
        throw new Error('Alle CDN-URLs fehlgeschlagen');
    },

    extractAvatarFromHtml(text) {
        if (!text) {
            console.log('Kein HTML-Text erhalten');
            return null;
        }
        
        console.log('Durchsuche HTML nach Avatar-URLs...');
        
        // Verbesserte Regex-Patterns
        const patterns = [
            /"avatarLarger":"([^"]+)"/,
            /"avatarMedium":"([^"]+)"/,
            /"avatar":"([^"]+)"/,
            /<meta property="og:image" content="([^"]+)"/,
            /"profilePicUrlHD":"([^"]+)"/
        ];

        for (const pattern of patterns) {
            const match = text.match(pattern);
            if (match && match[1]) {
                let url = match[1].replace(/\\u002F/g, '/').replace(/\\\//g, '/');
                console.log('Avatar URL gefunden:', url);
                return url;
            }
        }
        
        console.log('Keine Avatar-URL im HTML gefunden');
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
