# Firebase Admin Panel Setup Guide

## Was wurde implementiert?

✅ **Komplett neues Firebase Admin Panel** mit:
- Sichere Firebase Authentication
- Real-time Firestore Database
- CRUD-Operationen für alle Inhalte
- JSON-Export für statische Website

## Schnelle Einrichtung

### 1. Firebase Projekt erstellen

1. Gehe zu [Firebase Console](https://console.firebase.google.com/)
2. Klicke "Neues Projekt erstellen"
3. Projektname: `rosenrausch` (oder beliebig)
4. Google Analytics optional

### 2. Dienste aktivieren

**Authentication:**
1. Gehe zu Authentication → Sign-in method
2. Aktiviere "E-Mail/Passwort" 
3. Speichern

**Firestore Database:**
1. Gehe zu Firestore Database
2. "Datenbank erstellen" → "Testmodus"
3. Region wählen (z.B. europe-west3)

### 3. Web-App konfigurieren

1. Projektübersicht → Web-App hinzufügen (</> Icon)
2. App-Name: "Rosenrausch Admin"
3. **WICHTIG**: Kopiere die Firebase-Konfiguration!

Deine Firebase-Config sollte etwa so aussehen:
```javascript
{
  apiKey: "AIzaSyC-BEISPIEL-1234567890abcdef",
  authDomain: "dein-projekt.firebaseapp.com", 
  projectId: "dein-projekt",
  storageBucket: "dein-projekt.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef..."
}
```

### 4. API-Key konfigurieren

**Für lokale Entwicklung:**
```bash
# 1. Template-Datei kopieren
cp js/firebase-config.local.template.js js/firebase-config.local.js

# 2. Echten API-Key eintragen
# Bearbeite js/firebase-config.local.js und ersetze den Platzhalter
```

**Für Production (GitHub Actions):**
- GitHub Repository → Settings → Secrets → Actions
- Neues Secret: `API_KEY_RAUSHI` = dein echter Firebase API-Key

### 5. Admin-Benutzer erstellen

1. Firebase Console → Authentication → Users → "Add user"
2. E-Mail: `contact@rosenrausch.xyz` (oder deine gewünschte Admin-E-Mail)
3. Passwort setzen (mind. 6 Zeichen)

**Wichtig**: Die E-Mail muss in der `adminEmails` Liste in `firebase-admin.js` stehen!

### 6. Erste Collections erstellen

**Optional**: Erstelle Beispieldaten in Firestore:

**Collection: `team-members`**
```json
{
  "name": "Rosenrausch",
  "role": "Artist", 
  "category": "🌹Artist🌹",
  "bio": "Der Künstler um den es sich hier dreht.",
  "image": "profile.jpg",
  "categoryActive": true,
  "social": []
}
```

**Collection: `news-items`**
```json
{
  "title": "Willkommen!",
  "date": "1. Januar 2025",
  "content": "Das neue Admin Panel ist online!",
  "active": true
}
```

### 7. Test

1. Öffne `https://rosenrausch.xyz/admin.html`
2. Melde dich mit der Admin-E-Mail an
3. Verwalte Inhalte über das Panel

## Features

### 🔐 Sichere Authentifizierung
- Firebase Authentication
- Nur autorisierte Admin-E-Mails
- Automatisches Session-Management

### 📊 Vollständige Datenverwaltung
- **Team**: Mitglieder, Rollen, Kategorien, Biografien
- **News**: Artikel, Datum, Aktivitätsstatus  
- **Events**: Termine, Orte, Beschreibungen
- **Quotes**: Zitate, Datum, Kontext

### 💾 Real-time Database
- Alle Änderungen sofort in Firestore gespeichert
- Kein Datenverlust
- Automatische Synchronisation

### 📤 JSON-Export
- Exportiere alle Daten als JSON-Dateien
- Kompatibel mit statischer Website
- Ein-Klick-Download für alle Collections

## Debugging

### Firebase nicht konfiguriert?
Browser-Konsole sollte zeigen:
```
✅ Firebase apiKey ist konfiguriert
✅ Firebase App erfolgreich initialisiert
```

Bei Fehlern:
```
❌ FEHLER: Firebase apiKey ist nicht konfiguriert!
```

### Login funktioniert nicht?
1. Prüfe ob Benutzer in Firebase Authentication existiert
2. Prüfe ob E-Mail in `adminEmails` Array steht
3. Prüfe Browser-Konsole für detaillierte Fehlermeldungen

### GitHub Actions API-Key nicht ersetzt?
1. Prüfe GitHub Secret `API_KEY_RAUSHI`
2. Schaue in Actions-Logs nach Fehlern
3. Trigger neuen Build durch Push

## Sicherheit

### Firestore Security Rules (optional)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null 
        && request.auth.token.email in [
          'contact@rosenrausch.xyz'
          // weitere Admin-E-Mails hier
        ];
    }
  }
}
```

### Produktionseinstellungen
1. Aktiviere Firebase Security Rules  
2. Beschränke API-Key auf deine Domain
3. Aktiviere 2FA für Firebase-Account
4. Regelmäßige Backups von Firestore

## Kosten

Firebase bietet großzügige kostenlose Limits:
- **Firestore**: 50.000 Reads, 20.000 Writes pro Tag
- **Authentication**: Unbegrenzt kostenlos
- **Hosting**: 10GB Transfer, 1GB Storage

Für ein kleines Admin Panel mehr als ausreichend!

## Support

Bei Problemen:
1. Browser-Entwicklertools → Console-Tab prüfen
2. Firebase Console → Authentication/Firestore für Debugging
3. GitHub Actions Logs für Deployment-Probleme

Die neue Firebase-Implementierung ist deutlich robuster und sicherer als das vorherige System!