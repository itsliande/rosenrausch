# Firebase Admin Panel Setup Anleitung

## 1. Firebase Projekt erstellen

1. Gehe zu [Firebase Console](https://console.firebase.google.com/)
2. Klicke auf "Projekt hinzufügen"
3. Benenne das Projekt "rosenrausch-admin"
4. Folge den Einrichtungsschritten

## 2. Firebase Services aktivieren

### Authentication
1. Gehe zu "Authentication" → "Get started"
2. Wähle "Sign-in method"
3. Aktiviere "E-Mail/Passwort"
4. Erstelle Admin-Benutzer:
   - E-Mail: contact@rosenrausch.xyz
   - Passwort: [Sicheres Passwort wählen]

### Firestore Database
1. Gehe zu "Firestore Database" → "Datenbank erstellen"
2. Wähle "Produktionsmodus starten"
3. Wähle eine Region (z.B. europe-west3)

### Storage (Optional für Bilder)
1. Gehe zu "Storage" → "Erste Schritte"
2. Wähle Produktionsmodus

## 3. Firebase Konfiguration

1. Gehe zu Projekteinstellungen (Zahnrad-Symbol)
2. Scrolle zu "Ihre Apps" → "Web-App hinzufügen"
3. App-Name: "Rosenrausch Admin Panel"
4. Kopiere die Konfiguration

## 4. Konfiguration einfügen

Ersetze in `js/firebase-config.js` die Platzhalter-Werte:

```javascript
const firebaseConfig = {
  apiKey: "DEINE_API_KEY",
  authDomain: "rosenrausch-admin.firebaseapp.com",
  projectId: "rosenrausch-admin",
  storageBucket: "rosenrausch-admin.appspot.com",
  messagingSenderId: "DEINE_SENDER_ID",
  appId: "DEINE_APP_ID"
};
```

## 5. Firestore Sicherheitsregeln

Füge diese Regeln in Firestore hinzu:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Nur authentifizierte Admin-Nutzer können lesen/schreiben
    match /{document=**} {
      allow read, write: if request.auth != null 
        && request.auth.token.email in [
          'contact@rosenrausch.xyz',
          'admin@rosenrausch.xyz'
        ];
    }
  }
}
```

## 6. Storage Sicherheitsregeln (falls verwendet)

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null
        && request.auth.token.email in [
          'contact@rosenrausch.xyz',
          'admin@rosenrausch.xyz'
        ];
    }
  }
}
```

## 7. Erste Datenstruktur erstellen

### Team Members Collection: `team-members`
```json
{
  "name": "Rosenrausch",
  "role": "Artist",
  "category": "🌹Artist🌹",
  "categoryActive": true,
  "bio": "Der Künstler um den es sich hier dreht.",
  "image": "profile.jpg",
  "social": [
    {
      "platform": "fa-solid fa-globe",
      "url": "https://rosenrausch.xyz/"
    }
  ]
}
```

### News Collection: `news-items`
```json
{
  "id": 1,
  "date": "1. Juni 2025",
  "title": "Test News",
  "content": "Das ist eine Test-Nachricht.",
  "active": true
}
```

### Events Collection: `events`
```json
{
  "id": "test-event",
  "title": "Test Event",
  "date": "2025-06-07",
  "time": "20:00",
  "location": "Test Location",
  "description": "Test Beschreibung",
  "category": "Test"
}
```

### Quotes Collection: `quotes`
```json
{
  "id": 1,
  "text": "Test Zitat!",
  "date": "09. Juni 2025",
  "context": "Test",
  "active": true
}
```

## 8. Zugang zum Admin Panel

1. Öffne `https://rosenrausch.xyz/admin.html`
2. Melde dich mit der Admin-E-Mail an
3. Verwalte alle Inhalte über das Panel

## 9. Automatische JSON-Generierung

Das Admin Panel kann die Daten als JSON-Dateien exportieren, die dann in die statischen `data/` Ordner kopiert werden können, um die Website zu aktualisieren.

## 10. Sicherheitshinweise

- Verwende starke Passwörter
- Beschränke Admin-Zugang nur auf vertrauenswürdige E-Mails
- Überprüfe regelmäßig die Firebase-Sicherheitsregeln
- Aktiviere 2FA für Firebase-Konten

## 11. Deployment

Das Admin Panel funktioniert mit der bestehenden GitHub Pages Website. Einfach die neuen Dateien committen und pushen.

## Kosten

Firebase bietet einen großzügigen kostenlosen Tarif:
- Firestore: 50.000 Lese-, 20.000 Schreib-, 20.000 Löschvorgänge pro Tag
- Authentication: Unbegrenzt
- Storage: 5GB kostenfrei

Für ein kleines Admin Panel mehr als ausreichend.