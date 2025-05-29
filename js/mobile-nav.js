/**
 * Mobile Navigation für die Rosenrausch-Website
 * 
 * Diese Datei stellt eine bessere Navigationserfahrung auf Mobilgeräten bereit.
 */

document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');
    const mobileNavToggle = document.createElement('button');

    // Nur auf kleinen Bildschirmen aktivieren
    function setupMobileNav() {
        if (window.innerWidth <= 480) {
            // Wenn der mobile Nav Toggle noch nicht existiert
            if (!document.querySelector('.mobile-nav-toggle')) {
                // Erstelle Toggle-Button
                mobileNavToggle.className = 'mobile-nav-toggle';
                mobileNavToggle.innerHTML = '☰';
                mobileNavToggle.setAttribute('aria-label', 'Menü öffnen');

                // Füge Button vor der Navbar ein
                document.body.insertBefore(mobileNavToggle, navbar);

                // Verstecke alle Links außer dem aktiven
                const navItems = navbar.querySelectorAll('.nav-item:not(.active)');
                navItems.forEach(item => {
                    item.classList.add('nav-hidden');
                });

                // Füge Event-Listener hinzu
                mobileNavToggle.addEventListener('click', toggleMobileNav);
            }
        } else {
            // Entferne den Toggle-Button und zeige alle Links an
            const existingToggle = document.querySelector('.mobile-nav-toggle');
            if (existingToggle) {
                existingToggle.remove();
            }

            // Zeige alle Links
            const navItems = navbar.querySelectorAll('.nav-item.nav-hidden');
            navItems.forEach(item => {
                item.classList.remove('nav-hidden');
            });

            // Entferne die offene Klasse von der Navbar
            navbar.classList.remove('nav-open');
        }
    }

    // Toggle die mobile Navigation
    function toggleMobileNav() {
        navbar.classList.toggle('nav-open');

        const isOpen = navbar.classList.contains('nav-open');
        mobileNavToggle.innerHTML = isOpen ? '✕' : '☰';
        mobileNavToggle.setAttribute('aria-label', isOpen ? 'Menü schließen' : 'Menü öffnen');

        // Zeige/verstecke die Links
        const navItems = navbar.querySelectorAll('.nav-item:not(.active)');
        navItems.forEach(item => {
            if (isOpen) {
                item.classList.remove('nav-hidden');
            } else {
                item.classList.add('nav-hidden');
            }
        });
    }

    // Initialisiere mobile Navigation
    setupMobileNav();

    // Überprüfe die Größe beim Ändern der Fenstergröße
    window.addEventListener('resize', setupMobileNav);
});
