class CookieConsent {
    constructor() {
        if (this.getCookie('cookie-consent')) return;
        this.createBanner();
    }

    createBanner() {
        const banner = document.createElement('div');
        banner.className = 'cookie-banner';
        banner.innerHTML = `
            <p>Diese Website verwendet Cookies. Mit der Nutzung stimmen Sie der Verwendung von Cookies zu.</p>
            <div class="cookie-buttons">
                <button id="accept-cookies">Akzeptieren</button>
                <a href="privacy.html">Mehr erfahren</a>
            </div>
        `;
        document.body.appendChild(banner);

        document.getElementById('accept-cookies').addEventListener('click', () => {
            this.setCookie('cookie-consent', 'accepted', 365);
            banner.remove();
        });
    }

    setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
    }

    getCookie(name) {
        return document.cookie.split(';').some(c => c.trim().startsWith(name + '='));
    }
}
