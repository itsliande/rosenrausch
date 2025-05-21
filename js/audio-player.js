class AudioPlayer {
    constructor() {
        this.audio = new Audio();
        this.playlist = [];
        this.currentTrack = 0;
        this.spotifyPreviewUrl = 'https://open.spotify.com/embed/artist/6LLYzhQh2x8UvS6V0zoSAz';
    }

    init(containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = `
            <div class="audio-player">
                <iframe src="${this.spotifyPreviewUrl}"
                        width="100%"
                        height="80"
                        frameborder="0"
                        allowtransparency="true"
                        allow="encrypted-media">
                </iframe>
            </div>
        `;
    }

    addTrack(title, url) {
        this.playlist.push({ title, url });
    }

    bindEvents(container) {
        // Hier Event-Listener für Player-Steuerung implementieren
    }
}
