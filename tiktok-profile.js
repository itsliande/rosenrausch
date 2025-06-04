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
            // Verwende verschiedene Proxy-Services nacheinander
            const proxyServices = [
                'https://corsproxy.io/?',
                'https://cors-anywhere.herokuapp.com/',
                'https://api.codetabs.com/v1/proxy?quest='
            ];

            for (const proxy of proxyServices) {
                try {
                    console.log(`Versuche Proxy: ${proxy}`);
                    await this.tryProxyService(proxy, username, img);
                    return; // Erfolgreich, beende Schleife
                } catch (error) {
                    console.log(`Proxy ${proxy} fehlgeschlagen:`, error.message);
                    continue;
                }
            }

            // Wenn alle Proxies fehlschlagen, verwende lokales Bild
            console.log('Alle Proxy-Services fehlgeschlagen, verwende Standard-Profilbild');
            img.src = 'profile.jpg';
        } catch (error) {
            console.log('Alle Methoden fehlgeschlagen, verwende Standard-Profilbild');
            img.src = 'profile.jpg';
        }
    },

    async tryProxyService(proxyUrl, username, img) {
        const fullUrl = `${proxyUrl}${encodeURIComponent(`https://www.tiktok.com/@${username}`)}`;
        
        const response = await fetch(fullUrl, {
            method: 'GET',
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        let htmlContent;
        if (proxyUrl.includes('allorigins')) {
            const data = await response.json();
            htmlContent = data.contents;
        } else {
            htmlContent = await response.text();
        }

        const avatarUrl = this.extractAvatarFromHtml(htmlContent);
        
        if (avatarUrl) {
            // Teste ob das Bild tatsächlich ladbar ist
            await this.testImageLoad(avatarUrl);
            img.src = avatarUrl;
            console.log('✓ Profilbild erfolgreich geladen:', avatarUrl);
        } else {
            throw new Error('Kein Avatar gefunden');
        }
    },

    async testImageLoad(url) {
        return new Promise((resolve, reject) => {
            const testImg = new Image();
            testImg.onload = () => resolve(true);
            testImg.onerror = () => reject(new Error('Bild nicht ladbar'));
            testImg.src = url;
            
            // Timeout nach 5 Sekunden
            setTimeout(() => reject(new Error('Timeout')), 5000);
        });
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
            /<meta name="twitter:image" content="([^"]+)"/,
            /"profilePicUrlHD":"([^"]+)"/,
            /"seoProps":[^}]*"metaParams":[^}]*"image":"([^"]+)"/
        ];

        for (let i = 0; i < patterns.length; i++) {
            const match = text.match(patterns[i]);
            if (match && match[1]) {
                let url = match[1]
                    .replace(/\\u002F/g, '/')
                    .replace(/\\\//g, '/')
                    .replace(/\\"/g, '"');
                
                // Überspringe offensichtlich falsche URLs
                if (url.includes('default-avatar') || url.length < 10) {
                    continue;
                }
                
                console.log(`Avatar URL gefunden (Pattern ${i+1}):`, url);
                return url;
            }
        }
        
        return null;
    },

    async checkLiveStatus() {
        try {
            const username = this.currentUsername || TIKTOK_USERNAME;
            
            // Verwende den gleichen Proxy-Ansatz für Live-Status
            const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(`https://www.tiktok.com/@${username}`)}`;
            
            const response = await fetch(proxyUrl, {
                method: 'GET',
                headers: {
                    'User-Agent': 'Mozilla/5.0'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
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
