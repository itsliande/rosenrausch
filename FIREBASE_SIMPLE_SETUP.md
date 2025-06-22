# Einfaches Firebase Setup für Rosenrausch

## Was wurde vereinfacht:

1. **Direkte Konfiguration**: API-Key wird direkt in `firebase-config.js` ersetzt
2. **GitHub Actions**: Ersetzt automatisch `API_KEY_RAUSHI` mit dem echten API-Key
3. **Keine komplexe Umgebungsvariablen**: Einfacher Platzhalter-Ersatz

## Setup-Schritte:

### 1. Firebase Projekt erstellen
1. Gehe zu [Firebase Console](https://console.firebase.google.com/)
2. Erstelle neues Projekt: "rosenrausch"
3. Aktiviere Authentication (Email/Password)
4. Aktiviere Firestore Database
5. Hole die Web-App-Konfiguration

### 2. GitHub Secret konfigurieren
Das Secret `API_KEY_RAUSHI` muss den echten Firebase API-Key enthalten.

### 3. Lokale Entwicklung
Für lokale Tests ersetze in `js/firebase-config.js`:
```javascript
apiKey: "API_KEY_RAUSHI", // ← Ersetze mit echtem API-Key
```

### 4. Production
GitHub Actions ersetzt automatisch `API_KEY_RAUSHI` mit dem echten Wert.

## Wie es funktioniert:

1. **Build-Zeit**: GitHub Actions führt `sed` aus:
   ```bash
   sed -i 's/API_KEY_RAUSHI/echter_api_key_hier/g' dist/js/firebase-config.js
   ```

2. **Runtime**: Firebase wird mit echtem API-Key initialisiert

3. **Sicherheit**: Echter API-Key ist nur in GitHub Secrets und deployed Files

## Test:
Nach dem Deployment sollte die Browser-Konsole zeigen:
```
✅ Firebase apiKey ist konfiguriert
✅ Firebase App erfolgreich initialisiert
```

Statt:
```
❌ FEHLER: Firebase apiKey ist nicht konfiguriert!
```