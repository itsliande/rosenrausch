class AudioPlayer {
    constructor() {
        this.audio = new Audio();
        this.playlist = [];
        this.currentTrack = 0;
        this.spotifyPreviewUrl = 'https://open.spotify.com/embed/playlist/6LLYzhQh2x8UvS6V0zoSAz?utm_source=generator';
    }

    init(containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error('Container nicht gefunden:', containerId);
            return;
        }
        
        container.innerHTML = `
            <div class="audio-player">
                <div class="now-playing">
                    Aktuelle Musik: <span class="track-title">Wähle einen Track</span>
                </div>
                <div class="controls">
                    <button class="prev-btn">⏮</button>
                    <button class="play-btn">▶</button>
                    <button class="next-btn">⏭</button>
                </div>
                <div class="spotify-embed">
                    <iframe style="border-radius:12px" 
                            src="${this.spotifyPreviewUrl}"
                            width="100%" 
                            height="352" 
                            frameBorder="0" 
                            allowfullscreen="" 
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                            loading="lazy">
                    </iframe>
                </div>
            </div>
        `;
        
        this.bindEvents(container);
        this.trackDisplay = container.querySelector('.track-title');
        console.log('Audio Player initialisiert');
    }

    addTrack(title, url) {
        this.playlist.push({ title, url });
    }

    bindEvents(container) {
        const playBtn = container.querySelector('.play-btn');
        const prevBtn = container.querySelector('.prev-btn');
        const nextBtn = container.querySelector('.next-btn');

        playBtn.addEventListener('click', () => this.togglePlay());
        prevBtn.addEventListener('click', () => this.previousTrack());
        nextBtn.addEventListener('click', () => this.nextTrack());

        this.audio.addEventListener('ended', () => this.nextTrack());
    }

    togglePlay() {
        if (this.audio.paused) {
            this.audio.play();
        } else {
            this.audio.pause();
        }
    }

    nextTrack() {
        this.currentTrack = (this.currentTrack + 1) % this.playlist.length;
        this.loadAndPlayTrack();
    }

    previousTrack() {
        this.currentTrack = (this.currentTrack - 1 + this.playlist.length) % this.playlist.length;
        this.loadAndPlayTrack();
    }

    loadAndPlayTrack() {
        if (this.playlist.length > 0) {
            const currentTrack = this.playlist[this.currentTrack];
            this.audio.src = currentTrack.url;
            this.trackDisplay.textContent = currentTrack.title;
            this.audio.play();
        }
    }
}
