# Sichere Firebase API-Key Konfiguration

## ⚠️ Sicherheitshinweis
Der Firebase API-Key wird NIEMALS im Quellcode gespeichert und ist durch mehrere Sicherheitsebenen geschützt.

## Produktionsumgebung (GitHub Pages)

### Automatischer Schutz
- Der echte API-Key ist nur in GitHub Secrets (`API_KEY_RAUSHI`) gespeichert
- GitHub Actions ersetzt zur Build-Zeit den Platzhalter mit dem echten Wert
- Im Repository bleibt nur der Platzhalter `API_KEY_RAUSHI` sichtbar

### Verifikation
Nach dem Deployment zeigt die Browser-Konsole:
```
✅ Firebase API-Key erfolgreich und sicher geladen
✅ Firebase App erfolgreich initialisiert
```

## Lokale Entwicklung

### Option 1: Lokale Konfigurationsdatei (Empfohlen)
```bash
# 1. Template kopieren
cp js/firebase-config.local.template.js js/firebase-config.local.js

# 2. Echten API-Key eintragen (diese Datei wird von Git ignoriert)
# Öffne js/firebase-config.local.js und ersetze 'DEIN_ECHTER_API_KEY_HIER'
```

Dann in deinem HTML:
```html
<!-- Lokale Konfiguration zuerst laden -->
<script src="js/firebase-config.local.js"></script>
<!-- Dann Firebase-Konfiguration -->
<script type="module" src="js/firebase-config.js"></script>
```

### Option 2: Browser-Konsole
```javascript
// Temporär im Browser setzen
window.FIREBASE_API_KEY = 'dein_echter_api_key_hier';
```

### Option 3: HTML Meta-Tag
```html
<meta name="firebase-api-key" content="dein_echter_api_key_hier">
```

## Sicherheitsfeatures

### Mehrschichtige Validierung
1. **Format-Prüfung**: API-Key muss mit `AIza` beginnen
2. **Platzhalter-Erkennung**: Erkennt wenn GitHub Actions nicht funktioniert hat
3. **Sichere Anzeige**: API-Key wird in der Konsole versteckt angezeigt

### Fallback-Mechanismen
1. GitHub Actions Build-Zeit-Ersetzung
2. Window-Objekt (`window.FIREBASE_API_KEY`)
3. HTML Meta-Tag
4. Umgebungsvariable (`process.env.FIREBASE_API_KEY`)

### Automatische Git-Ignores
Folgende Dateien werden automatisch von Git ausgeschlossen:
- `js/firebase-config.local.js`
- `firebase-api-key.js`
- `.env*` Dateien

## Fehlerbehebung

### "API-Key ist nicht konfiguriert"
1. **Produktion**: Prüfe GitHub Secret `API_KEY_RAUSHI`
2. **Lokal**: Erstelle `js/firebase-config.local.js` mit echtem Key

### "API-Key wurde nicht ersetzt"
1. Prüfe GitHub Actions Workflow-Logs
2. Stelle sicher, dass Secret `API_KEY_RAUSHI` gesetzt ist
3. Trigger neuen Build durch Push/PR

### Debugging-Befehle
```bash
# GitHub Actions Logs prüfen
# Repository → Actions → Letzter Workflow → "Replace API Keys" Step

# Lokale Konfiguration testen
console.log('API-Key gesetzt:', !!window.FIREBASE_API_KEY);
```

## Firebase API-Key Sicherheit

### Warum Firebase API-Keys "öffentlich" sein können
- Firebase API-Keys sind für Frontend-Nutzung konzipiert
- Echte Sicherheit erfolgt durch Firebase Security Rules
- API-Key allein gewährt keinen Datenzugriff

### Zusätzliche Sicherheitsmaßnahmen
1. **Firestore Rules**: Beschränke Datenzugriff auf authentifizierte Admins
2. **Authentication Rules**: Nur autorisierte E-Mails
3. **Domain-Beschränkungen**: In Firebase Console konfigurierbar

## Best Practices

### Für Entwickler
- Verwende immer `firebase-config.local.js` für lokale Entwicklung
- Committe niemals echte API-Keys
- Prüfe regelmäßig `.gitignore` Einstellungen

### Für Deployment
- Verwende GitHub Secrets für alle sensiblen Daten
- Überwache GitHub Actions Workflow-Logs
- Teste nach jedem Deployment die API-Key-Funktion