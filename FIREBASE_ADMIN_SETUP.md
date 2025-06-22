# Firebase Admin Panel Setup Guide
*Basiert auf dem bewährten Pattern von [itsliande/aboutme](https://github.com/itsliande/aboutme)*

## Was wurde implementiert?

✅ **Modulares Firebase Admin System** mit:
- **Sichere Firebase Authentication** (`admin-auth.js`)
- **Real-time Firestore Database** (`admin-dashboard.js`) 
- **CRUD-Operationen** für alle Inhalte
- **JSON-Export-Funktion** für statische Website
- **Firestore Security Rules** für Produktionsumgebung

## Architektur

```
js/
├── firebase-config.js          # Firebase-Konfiguration
├── firebase-config.local.js    # Lokale API-Keys (gitignored)
├── admin-auth.js              # Authentication Module
├── admin-dashboard.js         # Dashboard/CRUD Module
└── admin-security.js          # Sicherheitsmaßnahmen

admin.html                     # Haupt-Admin-Interface
firestore.rules               # Firestore Security Rules
```

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
3. Erstelle Admin-Benutzer:
   - E-Mail: `contact@rosenrausch.xyz`
   - Passwort: (sicher wählen)

**Firestore Database:**
1. Gehe zu Firestore Database
2. "Datenbank erstellen" → "Testmodus" (später Security Rules aktivieren)
3. Region wählen (z.B. europe-west3)

### 3. Web-App konfigurieren

1. Projektübersicht → Web-App hinzufügen (</> Icon)
2. App-Name: "Rosenrausch Admin"
3. **WICHTIG**: Kopiere die Firebase-Konfiguration!

### 4. API-Key konfigurieren

**Option A: Lokale Entwicklung**
```bash
# 1. Template kopieren
cp js/firebase-config.local.template.js js/firebase-config.local.js

# 2. API-Key eintragen
# Bearbeite js/firebase-config.local.js:
# window.FIREBASE_API_KEY = 'AIzaSyDSj2Xi-deinEchterKey...';
```

**Option B: Produktion (GitHub Actions)**
- GitHub Repository → Settings → Secrets → Actions
- Neues Secret: `API_KEY_RAUSHI` = dein echter Firebase API-Key

### 5. Security Rules aktivieren (Empfohlen)

```bash
# Firestore Rules aus firestore.rules verwenden
firebase deploy --only firestore:rules
```

Oder manuell in Firebase Console:
1. Firestore Database → Rules
2. Kopiere Inhalt aus `firestore.rules`
3. Veröffentlichen

### 6. Test

1. Öffne `https://rosenrausch.xyz/admin.html`
2. Melde dich mit Admin-E-Mail an
3. Verwalte Inhalte über das Panel

## Features

### 🔐 Sichere Authentifizierung
- Firebase Authentication mit E-Mail/Passwort
- Admin-E-Mail-Whitelist 
- Automatisches Session-Management
- Optional: Firestore Admin-Collection Check

### 📊 Modulares Dashboard
- **admin-auth.js**: Zentrale Authentifizierung
- **admin-dashboard.js**: UI-Logik und CRUD-Operationen
- Getrennte Verantwortlichkeiten
- Erweiterbar für neue Collections

### 🗄️ Vollständige Datenverwaltung
- **Team**: Mitglieder, Rollen, Kategorien, Biografien
- **News**: Artikel, Datum, Aktivitätsstatus  
- **Events**: Termine, Orte, Beschreibungen
- **Quotes**: Zitate, Datum, Kontext

### 💾 Real-time Database
- Alle Änderungen sofort in Firestore gespeichert
- Automatische Synchronisation
- Firestore Security Rules für Produktionsschutz

### 📤 JSON-Export
- Ein-Klick-Export aller Collections
- Separate JSON-Dateien pro Collection
- Kompatibel mit statischer Website

## Debugging

### API-Key wird nicht gefunden?

**Lokale Entwicklung:**
```javascript
// Browser-Konsole sollte zeigen:
'🔧 Lokaler API-Key geladen'

// Bei Problemen:
'⚠️ WARNUNG: Template API-Key erkannt!'
// → js/firebase-config.local.js bearbeiten
```

**Produktion:**
```bash
# GitHub Actions Logs prüfen:
'✅ API_KEY_RAUSHI wurde erfolgreich ersetzt'

# Bei Fehlern:
'❌ FEHLER: API_KEY_RAUSHI wurde nicht ersetzt!'
# → GitHub Secret prüfen
```

### Authentication Probleme?

```javascript
// Browser-Konsole Debug-Ausgaben:
'🔐 Admin Auth System wird initialisiert...'
'👤 Benutzer eingeloggt: contact@rosenrausch.xyz'
'✅ Admin-Berechtigung bestätigt'

// Bei Admin-Check Fehlern:
'❌ E-Mail nicht in Admin-Whitelist'
// → adminEmails Array in admin-auth.js prüfen
```

### Firestore Verbindung?

```javascript
// Erfolgreiche Verbindung:
'🔥 Firebase initialisiert für: rosenrausch'
'📊 Lade team Daten...'

// Bei Verbindungsfehlern:
'❌ Fehler beim Laden der team Daten'
// → Firebase Konfiguration und Rules prüfen
```

## Sicherheit

### Firestore Security Rules
Die `firestore.rules` Datei implementiert:
- Nur authentifizierte Admin-E-Mails haben Zugriff
- Separate Regeln pro Collection
- Server-seitige Validierung

### Produktionseinstellungen
1. ✅ Firestore Security Rules aktivieren
2. ✅ Firebase API-Key auf deine Domain beschränken
3. ✅ 2FA für Firebase-Account aktivieren
4. ✅ Regelmäßige Firestore-Backups

### Development vs. Production
```javascript
// Development: DEV_MODE = true in admin-security.js
// → Alle Sicherheitschecks deaktiviert

// Production: DEV_MODE = false
// → DevTools-Blocking, Console-Clearing aktiviert
```

## Erweiterungen

### Neue Collection hinzufügen:

1. **admin-dashboard.js** erweitern:
```javascript
this.collections = {
    // ...existing collections...
    newCollection: 'new-collection-name'
};
```

2. **Load/Render Funktionen** hinzufügen:
```javascript
async loadNewCollectionData() { /* ... */ }
renderNewCollectionData() { /* ... */ }
```

3. **Form-Generierung** implementieren:
```javascript
getNewCollectionForm(data) { /* ... */ }
```

4. **HTML** in admin.html erweitern:
```html
<div id="newcollection-tab" class="tab-pane">
    <!-- UI für neue Collection -->
</div>
```

### Admin-E-Mails hinzufügen:
```javascript
// admin-auth.js
this.adminEmails = [
    'contact@rosenrausch.xyz',
    'admin@rosenrausch.xyz',
    'neue-admin@domain.com'  // ← Hier hinzufügen
];
```

## Support

Bei Problemen:
1. **Browser-Konsole** für detaillierte Debug-Ausgaben prüfen
2. **Firebase Console** → Authentication/Firestore für Server-Status
3. **GitHub Actions Logs** für Deployment-Probleme
4. **Network-Tab** für API-Request-Fehler

Das neue modulare System ist deutlich wartbarer und basiert auf bewährten Patterns!