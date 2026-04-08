# 🖖 Starfleet Command
 
A Voyager-themed fleet and mission management web app — built as a self-directed learning project to practice vanilla JavaScript, the Fetch API, and HTTP CRUD operations.
 
---
 
## About
 
Starfleet Command lets you manage a fleet of starships and assign them to missions across the galaxy. Ships can be dispatched, tracked in real time, and automatically return to available status once their mission timer expires.
 
The project uses **JSON Server** as a mock REST API and **vanilla JavaScript** for all frontend logic — no frameworks, no jQuery.
 
---
 
## Tech Stack
 
| Tool | Purpose |
|---|---|
| HTML + CSS | Structure and styling |
| Bootstrap 5 | UI components and layout |
| Bootstrap Icons | Icon set |
| Vanilla JavaScript | All frontend logic |
| Fetch API | HTTP requests (GET, POST, PATCH, DELETE) |
| JSON Server | Mock REST API (port 3001) |
| VS Code Live Server | Local development server |
 
---
 
## Setup
 
### Prerequisites
 
- [Node.js](https://nodejs.org/) installed
- [VS Code](https://code.visualstudio.com/) with the [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
- JSON Server installed globally:
 
```bash
npm install -g json-server
```
 
### Running the project
 
1. Clone or download the repository.
 
2. Start the JSON Server mock API:
 
```bash
json-server --watch db.json --port 3001
```
 
3. Open `index.html` with VS Code Live Server (right-click → *Open with Live Server*).
 
> **Important:** Add `db.json` to Live Server's ignore list in your VS Code settings to prevent unwanted page reloads when JSON Server writes to the file:
> ```json
> "liveServer.settings.ignoreFiles": ["**/db.json"]
> ```
 
---
 
## Features
 
### Ships
- View all ships in a card grid with status indicator (available / on mission)
- Open a details modal with full ship specs (class, captain, weapons, crew size, completed missions)
 
### Missions
- View all missions in a sortable table
- Create new missions via a dedicated form page
- Delete newly created missions before confirming them
- Dispatch an available ship to a pending mission
- Ships and missions are automatically updated via PATCH requests on dispatch
 
### Mission Timer
- Each dispatched mission stores a `dispatchedAt` timestamp (Unix ms via `Date.now()`)
- A polling interval (`setInterval`, every 10 seconds) checks all in-progress missions
- When elapsed time exceeds `durationMinutes`, the mission is automatically marked as `completed` and the ship returns to `available`
- A Bootstrap Toast notification appears when a mission completes
 
### Filters
- Filter missions by name (search), difficulty, and status
- Filters combine and apply in real time
- Filter state is preserved after dispatching a ship (no full page reload)
- Reset button clears all filters
 
---
 
## Data Model
 
### Ship
 
```json
{
  "id": "1",
  "name": "USS Voyager",
  "registry": "NCC-74656",
  "class": "Intrepid",
  "captain": "Kathryn Janeway",
  "status": "available",
  "sector": "Delta Quadrant",
  "crewSize": 141,
  "image": "voyager.jpg",
  "missionId": null,
  "completedMissions": 2,
  "description": "...",
  "weapons": {
    "phaserArrays": 13,
    "photonTorpedos": 38,
    "quantumTorpedos": 0
  }
}
```
 
**`status`** is either `"available"` or `"mission"`.
 
### Mission
 
```json
{
  "id": "10",
  "name": "Hirogen Hunting Grounds",
  "description": "...",
  "sector": "Delta Quadrant",
  "difficulty": "hard",
  "status": "pending",
  "shipId": null,
  "durationMinutes": 10,
  "dispatchedAt": null
}
```
 
**`status`** is one of `"pending"`, `"in progress"`, or `"completed"`.  
**`dispatchedAt`** is set to `Date.now()` on dispatch and used by the timer system.
 
---
 
## Key Concepts Practiced
 
- **Fetch API** — GET, POST, PATCH, DELETE with `async/await`
- **Promise.all** — parallel PATCH requests on dispatch
- **Timestamp-based timers** — `dispatchedAt` + polling instead of browser timers (which don't survive navigation)
- **DOM manipulation** — dynamic rendering of cards, table rows, modals, toasts
- **Event delegation** — attaching listeners to dynamically rendered buttons
- **Filter logic** — chaining `.filter()` on a local `result` variable without mutating global state
- **Bootstrap 5** — modals, toasts, accordion, pills, badges, responsive grid
