# Firebase Admin Panel Setup Anleitung

## Problem: Invalid API Key Error

Der Fehler "auth/api-key-not-valid" bedeutet, dass Firebase noch nicht korrekt konfiguriert ist.

## Schritt-für-Schritt Firebase Setup

### 1. Firebase Projekt erstellen

1. Gehe zu [Firebase Console](https://console.firebase.google.com/)
2. Klicke auf "Projekt hinzufügen"
3. Projektname: "rosenrausch" (oder einen anderen Namen)
4. Google Analytics kannst du deaktivieren

### 2. Web-App konfigurieren

1. In der Firebase Console: Projektübersicht → Web-App hinzufügen (</> Symbol)
2. App-Name: "Rosenrausch Admin Panel"
3. Hosting nicht aktivieren
4. **WICHTIG**: Kopiere die echten Konfigurationswerte!

Die Konfiguration sieht etwa so aus:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC1234567890abcdefg1234567890abcdefg",
  authDomain: "dein-projekt-name.firebaseapp.com",
  projectId: "dein-projekt-name",
  storageBucket: "dein-projekt-name.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890abcdef"
};
```

### 3. Konfiguration einfügen

Ersetze in `/workspaces/rosenrausch/js/firebase-config.js` die Platzhalter:

```javascript
const firebaseConfig = {
  apiKey: "DEINE_ECHTE_API_KEY_HIER",          // ← Von Firebase Console
  authDomain: "dein-projekt-id.firebaseapp.com", // ← Von Firebase Console
  projectId: "dein-projekt-id",                   // ← Von Firebase Console
  storageBucket: "dein-projekt-id.appspot.com",  // ← Von Firebase Console
  messagingSenderId: "deine-sender-id",           // ← Von Firebase Console
  appId: "deine-app-id"                          // ← Von Firebase Console
};
```

### 4. Authentication aktivieren

1. Firebase Console → "Authentication" → "Get started"
2. "Sign-in method" → "E-Mail/Passwort" aktivieren
3. Speichern

### 5. Firestore Database aktivieren

1. "Firestore Database" → "Datenbank erstellen"
2. "Testmodus starten" wählen (später auf Produktionsmodus ändern)
3. Region wählen (z.B. europe-west3)

### 6. Admin-Benutzer erstellen

1. Firebase Console → "Authentication" → "Users" → "Add user"
2. E-Mail: contact@rosenrausch.xyz (oder deine gewünschte Admin-E-Mail)
3. Passwort setzen

**Wichtig**: Die E-Mail muss mit der in `js/admin-auth.js` in der `adminEmails` Liste übereinstimmen!

### 7. Test der Konfiguration

Nach der Konfiguration:
1. Lade die admin.html Seite neu
2. Öffne Browser-Entwicklertools (F12) → Console-Tab
3. Du solltest sehen: "✅ Firebase apiKey ist konfiguriert"
4. Versuche den Login

## Debugging-Tipps

### Häufige Fehler:

- **"auth/api-key-not-valid"** → Schritt 2-3 wiederholen, echte Werte eintragen
- **"Firebase ist nicht konfiguriert"** → firebase-config.js prüfen
- **"auth/user-not-found"** → Admin-Benutzer in Schritt 6 erstellen
- **"Kein Admin-Zugriff"** → E-Mail in adminEmails Liste hinzufügen

### Console-Meldungen prüfen:

Korrekte Konfiguration zeigt:
```
🔧 Firebase-Konfiguration wird geladen...
✅ Firebase apiKey ist konfiguriert
✅ Firebase projectId: dein-projekt-name
✅ Firebase App erfolgreich initialisiert
```

Fehlerhafte Konfiguration zeigt:
```
❌ FEHLER: Firebase apiKey ist nicht konfiguriert!
💡 Bitte echte Firebase-Konfigurationswerte eintragen.
```

## Sicherheitsregeln (später)

Nach dem ersten erfolgreichen Login kannst du die Firestore-Sicherheitsregeln einrichten:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null 
        && request.auth.token.email in [
          'contact@rosenrausch.xyz'
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

# Schnelle Firebase Setup Anleitung

## 1. Firebase Projekt erstellen

1. Gehe zu [Firebase Console](https://console.firebase.google.com/)
2. Klicke auf "Projekt hinzufügen"
3. Projektname: "rosenrausch-admin" (oder einen anderen Namen)
4. Google Analytics kannst du deaktivieren

## 2. Authentication aktivieren

1. In der Firebase Console: "Authentication" → "Get started"
2. "Sign-in method" → "E-Mail/Passwort" aktivieren
3. Speichern

## 3. Firestore Database aktivieren

1. "Firestore Database" → "Datenbank erstellen"
2. "Testmodus starten" wählen (später auf Produktionsmodus ändern)
3. Region wählen (z.B. europe-west3)

## 4. Web-App konfigurieren

1. In Projektübersicht: Web-App hinzufügen (</> Symbol)
2. App-Name: "Rosenrausch Admin"
3. Hosting nicht aktivieren
4. **WICHTIG**: Kopiere die Konfigurationswerte

Ersetze in `/workspaces/rosenrausch/js/firebase-config.js`:

```javascript
const firebaseConfig = {
  apiKey: "deine-echte-api-key",
  authDomain: "dein-projekt-id.firebaseapp.com",
  projectId: "dein-projekt-id",
  storageBucket: "dein-projekt-id.appspot.com",
  messagingSenderId: "deine-sender-id",
  appId: "deine-app-id"
};
```

## 5. Admin-Benutzer erstellen

1. In Firebase Console: "Authentication" → "Users" → "Add user"
2. E-Mail: contact@rosenrausch.xyz (oder deine gewünschte Admin-E-Mail)
3. Passwort setzen

**Wichtig**: Die E-Mail muss mit der in `js/admin-auth.js` in der `adminEmails` Liste übereinstimmen!

## 6. Test

Nach der Konfiguration sollte der Login funktionieren. Prüfe die Browser-Konsole für Fehlermeldungen.

## Debugging-Tipps

- Öffne Browser-Entwicklertools (F12)
- Gehe zum Console-Tab
- Versuche den Login - dort siehst du detaillierte Fehlermeldungen
- Häufige Fehler:
  - "Firebase ist nicht konfiguriert" → Schritt 4 wiederholen
  - "auth/user-not-found" → Admin-Benutzer in Schritt 5 erstellen
  - "Kein Admin-Zugriff" → E-Mail in adminEmails Liste hinzufügen