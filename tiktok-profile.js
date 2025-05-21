// TikTok Username
const TIKTOK_USERNAME = 'rosen.rausch';

const TikTokProfileLoader = {
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
    }
};

// Lade Profilbild wenn die Seite geladen ist
document.addEventListener('DOMContentLoaded', () => {
    TikTokProfileLoader.loadProfilePic();
});
