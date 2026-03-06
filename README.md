# 🖖 Starfleet Command – Lern-Projekt

Dieses Projekt ist ein einfaches Frontend-Übungsprojekt um die Grundlagen von HTML, CSS und JavaScript anhand einer Star Trek themed Flottenmanagement-App zu lernen.

## Ziel des Projekts

Der Fokus liegt auf dem Erlernen von:
- **HTML & CSS** – Seitenstruktur, Layouts, Formulare
- **Vanilla JavaScript** – DOM Manipulation, Event Listener
- **Fetch API** – HTTP Requests (GET, POST, PATCH, DELETE)
- **REST Grundlagen** – wie Frontend und Backend über HTTP kommunizieren
- **URL Parameter** – Daten zwischen Seiten weitergeben mit `?id=1`
- **Verknüpfte Daten** – zwei Collections die aufeinander referenzieren (Ships ↔ Missions)

## Projektstruktur
```
starfleet-command/
├── db.json         ← Mock-Datenbank (JSON Server)
├── index.html      ← Flottenübersicht aller Schiffe
├── missions.html   ← Missionsübersicht mit Status
├── dispatch.html   ← Schiff einer Mission zuweisen
├── style.css       ← Styling
└── app.js          ← JavaScript / Fetch Logik
```

## Voraussetzungen

- [Node.js](https://nodejs.org) installiert
- JSON Server installiert:
```bash
npm install -g json-server
```

## Mock-Server starten

Im Projektordner folgenden Befehl ausführen:
```bash
json-server --watch db.json --port 3001
```

Die API ist dann erreichbar unter `http://localhost:3001`

| Endpoint | Beschreibung |
|----------|-------------|
| GET /ships | Alle Schiffe laden |
| GET /ships/1 | Ein Schiff laden |
| PATCH /ships/1 | Schiff teilweise updaten |
| GET /missions | Alle Missionen laden |
| GET /missions/1 | Eine Mission laden |
| PATCH /missions/1 | Mission teilweise updaten |

## Frontend starten

Empfohlen: **Live Server** Extension in VS Code installieren und `index.html` damit öffnen. Alternativ einfach die `index.html` direkt im Browser öffnen.

## Geplante Features

- [x] Flottenübersicht (GET)
- [x] Missionsübersicht (GET)
- [ ] Schiff einer Mission zuweisen (PATCH)
- [ ] Schiffsstatus automatisch aktualisieren
- [ ] Bonus: Timer – Mission abschließen nach X Minuten (setInterval)

## Technologien

- HTML5 / CSS3
- Vanilla JavaScript (ES6+)
- [JSON Server](https://github.com/typicode/json-server) als Mock-REST-API
