# Firebase API Key Konfiguration

## Für lokale Entwicklung:

1. Bearbeite die Datei `js/env-config.js`
2. Ersetze `'DEIN_ECHTER_API_KEY_HIER'` mit deinem echten Firebase API-Key

## Für Production/Deployment:

### Option 1: GitHub Actions mit Secrets
```yaml
# In .github/workflows/deploy.yml
- name: Replace API Key
  run: |
    sed -i "s/DEIN_ECHTER_API_KEY_HIER/${{ secrets.FIREBASE_API_KEY }}/g" js/env-config.js
```

### Option 2: Build-Zeit-Ersetzung
```javascript
// In js/env-config.js wird zur Build-Zeit ersetzt
window.FIREBASE_API_KEY = '{{FIREBASE_API_KEY}}'; // Wird durch echten Key ersetzt
```

### Option 3: Separate Config-Datei
Erstelle eine `config.js` die nicht in Git committed wird:
```javascript
// config.js (nicht in Git)
window.FIREBASE_API_KEY = 'dein_echter_api_key_hier';
```

## HTML Integration:
```html
<!-- Lade env-config.js VOR firebase-config.js -->
<script src="js/env-config.js"></script>
<script type="module" src="js/firebase-config.js"></script>
```

## Sicherheitshinweise:
- Der API-Key wird im Frontend sichtbar sein
- Firebase API-Keys sind für öffentliche Nutzung gedacht
- Sicherheit wird durch Firebase Security Rules gewährleistet
- Niemals Server-API-Keys im Frontend verwenden