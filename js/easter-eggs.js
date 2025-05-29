/**
 * Easter Eggs für die Rosenrausch-Website
 * - Wechselnde lustige Sprüche auf Fehlerseiten (404, 500, etc.)
 */

document.addEventListener('DOMContentLoaded', function() {
    // Fehlerseiten-Sprüche initialisieren
    initErrorPageQuotes();

    // Funktion zur Initialisierung der Fehlerseiten-Sprüche
    function initErrorPageQuotes() {
        // Prüfen ob wir uns auf einer Fehlerseite befinden
        const isErrorPage = document.querySelector('.error-container');
        if (!isErrorPage) return;

        // Den Fehlercode aus dem Titel oder URL extrahieren
        const errorCodeElement = document.querySelector('.error-code');
        let errorCode = '404'; // Standard-Fehlercode

        if (errorCodeElement) {
            errorCode = errorCodeElement.textContent.trim();
        } else if (window.location.pathname.includes('error')) {
            // Versuchen, den Fehlercode aus der URL zu extrahieren (z.B. 500.html oder error-500.html)
            const errorMatch = window.location.pathname.match(/(\d{3})/); 
            if (errorMatch) errorCode = errorMatch[1];
        }

        // Sprüche nach Fehlercode-Kategorien
        const errorQuotes = {
            // 404 - Seite nicht gefunden
            '404': [
                'Diese Seite scheint im digitalen Nirvana verschwunden zu sein.<br>Vielleicht hast du dich vertippt oder die Seite ist umgezogen?',
                'Die gute Nachricht: Du hast eine 404-Seite gefunden! Die schlechte: Es ist nicht die Seite, die du gesucht hast.',
                'Wenn diese Seite ein Minecraft-Block wäre, wäre sie unsichtbar.',
                'Diese Seite ist wie ein Ninja - sie war nie wirklich hier.',
                'Die von dir gesuchte Seite macht gerade Pause. Vermutlich am Strand mit einem kühlen Getränk.',
                'Willkommen im Club der verlorenen Seiten! Wir haben Kekse.',
                'Diese Seite hat Soziale Distanz sehr ernst genommen und ist komplett verschwunden.',
                'Error 404: Witz nicht gefunden. Genau wie diese Seite.',
                'Diese Seite wurde von Endermen entführt. Wir arbeiten an ihrer Rettung.',
                'Wenn du diese Seite siehst, hast du offiziell das Ende des Internets erreicht. Glückwunsch!',
                'Diese Seite existiert in einer Parallelwelt, in der alle Links funktionieren.',
                'Die gesuchte Seite wurde von Thanos weggeschnippt.',
                'Diese URL ist wie ein QR-Code zu einem Rätsel, das niemand lösen kann.',
                'Oops! Diese Seite ist wie ein perfekter Reim in einem Rosenrausch-Song - sie existiert noch nicht.'
            ],
            // 403 - Zugriff verweigert
            '403': [
                'Zugriff verweigert! Diese Seite hat einen VIP-Bereich und dein Name steht nicht auf der Liste.',
                'Diese Seite ist so exklusiv, dass selbst wir keinen Zugang haben.',
                'Du kommst hier nicht rein! Diese Seite hat bessere Security als ein Club am Samstagabend.',
                'Diese Seite hat dich gesehen und sich entschieden: Nö.',
                'Wir würden dich ja reinlassen, aber die Seite hat "Bitte nicht stören" an ihrer Tür hängen.'
            ],
            // 500 - Server-Fehler
            '500': [
                'Unser Server hatte gerade einen kleinen Nervenzusammenbruch. Wir bringen ihm jetzt einen Beruhigungstee.',
                'Der Server ist gerade in eine existenzielle Krise geraten. Bitte hab etwas Geduld.',
                'Fehler 500: Der Server versuchte zu denken, aber es tat weh.',
                'Unser Server ist gerade in Therapie. Er kommt bald wieder, versprochen!',
                'Der Server war kurz davor, einen Witz zu erzählen, aber dann hat er sich verschluckt.'
            ],
            // 418 - I'm a teapot (Spaß-Fehlercode)
            '418': [
                'Ich bin eine Teekanne. Ehrlich gesagt kann ich keine Webseiten ausgeben, nur Tee.',
                'Wenn du Kaffee wolltest, bist du hier falsch. Ich mache nur Tee.',
                'TEEKANNE-MODUS AKTIVIERT. Bitte füge heißes Wasser hinzu und warte 3-5 Minuten.',
                'Diese Seite identifiziert sich als Teekanne und weigert sich, deiner Bitte nachzukommen.',
                'Kurz und knapp: Tee > Kaffee > Webseiten'
            ],
            // Allgemeine Fehler für alle anderen Codes
            'default': [
                'Etwas ist schiefgelaufen, aber unsere Techniker sind bereits informiert. Vielleicht.',
                'Computer sagen manchmal Nein. Dieser hier schreit es gerade.',
                'Das Internet hatte einen Schluckauf. Bitte versuche es später noch einmal.',
                'Diese Fehlerseite wurde mit Liebe gemacht, nur für dich!',
                'Wenn Fehler Zitronen wären, hätten wir gerade Limonade für alle.'
            ]
        };

        // Lustige Textelement finden
        const funnyTextElement = document.querySelector('.funny-text');
        if (funnyTextElement) {
            // Sprüche für den aktuellen Fehlercode oder Standard-Sprüche verwenden
            const quotes = errorQuotes[errorCode] || errorQuotes['default'];

            // Zufälligen Spruch auswählen und direkt einfügen
            funnyTextElement.innerHTML = quotes[Math.floor(Math.random() * quotes.length)];

            // Easter Egg: Geheimer Mausklick auf den Fehlercode
            const errorCodeEl = document.querySelector('.error-code');
            if (errorCodeEl) {
                let clickCount = 0;

                errorCodeEl.addEventListener('click', function() {
                    clickCount++;

                    if (clickCount >= 5) {
                        // Nach 5 Klicks: Speziellen Spruch anzeigen
                        funnyTextElement.innerHTML = 'Du hast das geheime Easter Egg gefunden! Aber leider hilft dir das auch nicht weiter. Probier doch mal den Konami-Code!';
                        funnyTextElement.style.color = '#ff69b4';
                        errorCodeEl.style.transform = 'rotate(180deg)';
                        clickCount = 0;
                    }
                });
            }

            // Konami-Code Easter Egg
            let konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
            let konamiIndex = 0;

            document.addEventListener('keydown', function(e) {
                if (e.key === konamiCode[konamiIndex]) {
                    konamiIndex++;
                    if (konamiIndex === konamiCode.length) {
                        // Konami-Code aktiviert - spezielle Nachricht anzeigen
                        funnyTextElement.innerHTML = 'Du hast den Konami-Code gefunden! Leider können wir dir trotzdem nicht helfen, diese Seite zu finden.';
                        funnyTextElement.style.color = '#ff69b4';
                        document.body.style.background = 'linear-gradient(135deg, #ff3366 0%, #ff6b6b 100%) fixed';
                        setTimeout(() => {
                            document.body.style.background = 'linear-gradient(135deg, #2D1B69 0%, #1A1033 100%) fixed';
                        }, 3000);
                        konamiIndex = 0;
                    }
                } else {
                    konamiIndex = 0;
                }
            });
        }
    }

    // 404-Seite: Lustige Sprüche
    if (window.location.pathname.includes('404.html') || document.title.includes('404')) {
        const funnyTextElement = document.querySelector('.funny-text');

        if (funnyTextElement) {
            // Konami-Code Easter Egg
            let konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
            let konamiIndex = 0;

            document.addEventListener('keydown', function(e) {
                if (e.key === konamiCode[konamiIndex]) {
                    konamiIndex++;
                    if (konamiIndex === konamiCode.length) {
                        // Konami-Code aktiviert - spezielle Nachricht anzeigen
                        funnyTextElement.innerHTML = 'Du hast den Konami-Code gefunden! Leider können wir dir trotzdem nicht helfen, diese Seite zu finden.';
                        funnyTextElement.style.color = '#ff69b4';
                        konamiIndex = 0;
                    }
                } else {
                    konamiIndex = 0;
                }
            });

            // Zufällig einen lustigen Spruch auswählen
            const funnyPhrases = [
                'Diese Seite scheint im digitalen Nirvana verschwunden zu sein.<br>Vielleicht hast du dich vertippt oder die Seite ist umgezogen?<br>Sogar Chuck Norris findet diese Seite nicht...',
                'Diese Seite ist wie ein perfekter Reim - sie existiert, aber nicht zu dieser Zeit.',
                'Hast du versucht, die Seite aus- und wieder einzuschalten? Nein? Wir auch nicht.',
                'Die gute Nachricht: Du hast gerade eine 404-Seite gefunden! Die schlechte: Es ist nicht die Seite, die du gesucht hast.',
                'Wenn diese Seite ein Minecraft-Block wäre, wäre sie unsichtbar.',
                'Diese Seite ist wie ein Ninja - sie war nie wirklich hier.',
                'Houston, wir haben ein Problem. Die Seite ist ins schwarze Loch gefallen.',
                'Die von dir gesuchte Seite macht gerade Pause. Vermutlich am Strand mit einem kühlen Getränk.',
                'Willkommen im Club der verlorenen Seiten! Wir haben Kekse.',
                'Diese Seite hat Soziale Distanz sehr ernst genommen und ist komplett verschwunden.',
                'Error 404: Witz nicht gefunden. Genau wie diese Seite.',
                'Diese Seite wurde von Endermen entführt. Wir arbeiten an ihrer Rettung.',
                'Wenn du diese Seite siehst, hast du offiziell das Ende des Internets erreicht. Glückwunsch!',
                'Diese Seite existiert in einer Parallelwelt, in der alle Links funktionieren.',
                'Die gesuchte Seite wurde von Thanos weggeschnippt.',
                'Diese URL ist wie ein QR-Code zu einem Rätsel, das niemand lösen kann.',
                'Oops! Diese Seite ist wie ein perfekter Reim in einem Rosenrausch-Song - sie existiert noch nicht.'
            ];

            // Nur ersetzen, wenn es der Standard-Chuck-Norris-Text ist
            if (funnyTextElement.textContent.includes('Chuck Norris')) {
                const randomIndex = Math.floor(Math.random() * funnyPhrases.length);
                funnyTextElement.innerHTML = funnyPhrases[randomIndex];
            }
        }
    }
});
