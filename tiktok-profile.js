// TikTok Username
const TIKTOK_USERNAME = 'dein_tiktok_username';

async function updateProfileImage() {
    try {
        // TikTok API Endpoint (benötigt CORS Proxy für produktiven Einsatz)
        const response = await fetch(`https://www.tiktok.com/@${rosen.rausch}?lang=en`, {
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        });
        
        if (!response.ok) throw new Error('Failed to fetch TikTok profile');
        
        const html = await response.text();
        // Extrahiere das Profilbild-URL aus den Meta-Tags
        const match = html.match(/<meta property="og:image" content="([^"]+)"/);
        
        if (match && match[1]) {
            const profileImg = document.querySelector('.profile-img');
            profileImg.src = match[1];
        }
    } catch (error) {
        console.error('Error updating profile image:', error);
    }
}

// Aktualisiere das Profilbild beim Laden der Seite
document.addEventListener('DOMContentLoaded', updateProfileImage);
