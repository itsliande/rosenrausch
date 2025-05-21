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
                <div class="controls">
                    <button class="prev-btn">⏮</button>
                    <button class="play-btn">▶</button>
                    <button class="next-btn">⏭</button>
                </div>
                <iframe src="${this.spotifyPreviewUrl}"
                        width="100%"
                        height="80"
                        frameborder="0"
                        allowtransparency="true"
                        allow="encrypted-media">
                </iframe>
            </div>
        `;
        this.bindEvents(container);
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
            this.audio.src = this.playlist[this.currentTrack].url;
            this.audio.play();
        }
    }
}
