class AudioPlayer {
    constructor() {
        this.audio = new Audio();
        this.playlist = [];
        this.currentTrack = 0;
    }

    init(containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = `
            <div class="audio-player">
                <div class="track-info">
                    <span class="track-title">-</span>
                    <div class="progress-bar">
                        <div class="progress"></div>
                    </div>
                </div>
                <div class="controls">
                    <button class="prev">⏮</button>
                    <button class="play">▶</button>
                    <button class="next">⏭</button>
                </div>
            </div>
        `;

        this.bindEvents(container);
    }

    addTrack(title, url) {
        this.playlist.push({ title, url });
    }

    bindEvents(container) {
        // Hier Event-Listener für Player-Steuerung implementieren
    }
}
