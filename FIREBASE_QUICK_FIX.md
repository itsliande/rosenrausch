# Firebase API-Key Problem lösen

## Problem 🚨
Der GitHub Secret `API_KEY_RAUSHI` wird nicht korrekt in der `firebase-config.js` ersetzt.

## Sofortige Lösung für lokale Entwicklung 🔧

### Schritt 1: Firebase-Projekt erstellen
1. Gehe zu [Firebase Console](https://console.firebase.google.com/)
2. Erstelle ein neues Projekt: "rosenrausch"
3. Aktiviere Authentication (E-Mail/Passwort)
4. Aktiviere Firestore Database

### Schritt 2: Web-App hinzufügen
1. Projektübersicht → Web-App hinzufügen (</> Icon)
2. App-Name: "Rosenrausch Admin"
3. **Kopiere den API-Key aus der Firebase-Config!**

### Schritt 3: Lokalen API-Key setzen
**Bearbeite die Datei:** `js/firebase-config.local.js`

```javascript
// Lokale Firebase-Konfiguration für Entwicklung
// Für Produktion wird die API_KEY_RAUSHI durch GitHub Actions ersetzt

// ⚠️ WICHTIG: Für lokale Entwicklung uncommente die nächste Zeile und setze deinen echten API-Key ein:
window.FIREBASE_API_KEY = 'AIzaSyDEIN_ECHTER_API_KEY_HIER'; // ✅ Ersetze mit deinem echten Key

console.log('🔧 Lokale Firebase-Konfiguration geladen (firebase-config.local.js)');
```

### Schritt 4: Admin-Benutzer erstellen
1. Firebase Console → Authentication → Users → "Add user"
2. E-Mail: `contact@rosenrausch.xyz`
3. Passwort setzen (mind. 6 Zeichen)

### Schritt 5: Testen
1. Öffne: `admin-login.html` für separates Login
2. Oder: `admin.html` für vollständiges Panel
3. Melde dich mit der Admin-E-Mail an

## GitHub Actions Problem lösen 🔄

### GitHub Secret überprüfen
1. GitHub Repository → Settings → Secrets and variables → Actions
2. Überprüfe ob `API_KEY_RAUSHI` existiert
3. Wert sollte mit `AIza` beginnen

### Workflow-Logs prüfen
1. GitHub Repository → Actions
2. Letzten Deployment-Lauf öffnen
3. Schaue nach "Replace API Keys" Schritt
4. Sollte zeigen: "✅ API_KEY_RAUSHI wurde erfolgreich ersetzt"

## Struktur des neuen Systems 📁

```
admin-login.html          → Separate Login-Seite
admin.html               → Vollständiges Admin Panel
js/
├── firebase-config.js           → Haupt-Firebase-Config
├── firebase-config.local.js     → Lokale Entwicklung
├── admin-auth.js               → Authentifizierung
├── admin-dashboard.js          → Dashboard-Logik
└── admin-login.js              → Login-Script
firestore.rules          → Sicherheitsregeln
```

## Test-Befehle 🧪

**Browser-Konsole Test:**
```javascript
// Prüfe ob Firebase geladen ist
console.log('Firebase:', typeof firebase !== 'undefined' ? '✅' : '❌');

// Prüfe API-Key
console.log('API-Key gesetzt:', window.FIREBASE_API_KEY ? '✅' : '❌');
```

**Fehlerdiagnose:**
- `❌ Firebase API-Key fehlt` → Lokalen API-Key in `firebase-config.local.js` setzen
- `❌ Kein Admin-Zugriff` → E-Mail in Firebase Authentication hinzufügen
- `HTTP/2 404` für `firebase-config.local.js` → Normal in Produktion, nur lokal benötigt

Das neue System basiert auf dem bewährten Beispiel von itsliande und sollte stabil funktionieren! 🚀