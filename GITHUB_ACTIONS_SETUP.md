# GitHub Actions Deployment Setup

Dieses Repository verwendet GitHub Actions, um automatisch den Firebase API-Key aus den GitHub Secrets zu laden und die Website zu deployen.

## Setup

### 1. GitHub Secret hinzufügen

Das GitHub Secret `API_KEY_RAUSHI` ist bereits in den Repository-Secrets konfiguriert (wie im Screenshot zu sehen).

### 2. Automatisches Deployment

Bei jedem Push auf den `main` Branch wird automatisch:

1. Der Placeholder `DEIN_ECHTER_API_KEY_HIER` in `js/env-config.js` durch den echten API-Key ersetzt
2. Der Placeholder `API_KEY_RAUSHI` in `js/firebase-config.js` durch den echten API-Key ersetzt
3. Die Website auf GitHub Pages deployed

### 3. Workflow-Datei

Die Datei `.github/workflows/deploy.yml` führt folgende Schritte aus:

```yaml
- name: Replace API Key in env-config.js
  run: |
    sed -i "s/DEIN_ECHTER_API_KEY_HIER/${{ secrets.API_KEY_RAUSHI }}/g" js/env-config.js

- name: Replace API Key in firebase-config.js
  run: |
    sed -i "s/API_KEY_RAUSHI/${{ secrets.API_KEY_RAUSHI }}/g" js/firebase-config.js
```

### 4. Lokale Entwicklung

Für lokale Entwicklung:
1. Ersetze in `js/env-config.js` den Wert `'DEIN_ECHTER_API_KEY_HIER'` durch deinen echten Firebase API-Key
2. Diese Änderung sollte NICHT committed werden (verwende `git stash` oder `.gitignore`)

### 5. Überprüfung

Nach dem Deployment kannst du in der Browser-Konsole auf der Live-Website überprüfen:
- ✅ Erfolgreich: "Firebase apiKey ist konfiguriert"
- ❌ Fehler: "Firebase apiKey ist nicht konfiguriert"

### 6. Debugging

Wenn der API-Key immer noch nicht geladen wird:

1. Überprüfe die GitHub Actions Logs:
   - Gehe zu "Actions" Tab im GitHub Repository
   - Klicke auf den letzten Workflow-Run
   - Überprüfe die Logs der "Replace API Key" Steps

2. Überprüfe das GitHub Secret:
   - Repository Settings → Secrets and variables → Actions
   - Stelle sicher, dass `API_KEY_RAUSHI` den korrekten Wert hat

3. Trigger einen neuen Deployment:
   - Mache einen kleinen Commit und pushe auf `main`
   - Oder gehe zu Actions → "Deploy to GitHub Pages" → "Run workflow"

## Sicherheit

- Der API-Key wird nur zur Build-Zeit in die Dateien eingefügt
- Im Git-Repository bleiben die Placeholder-Werte
- Der echte API-Key ist nur in den GitHub Secrets gespeichert