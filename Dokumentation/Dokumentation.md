# Dokumentation – Ligretto

> **Hinweis:** Diese Dokumentation wurde von einer KI (Claude) geschrieben und von Arun geprüft.

## Legende: Wer hat was gemacht?

| Markierung | Bedeutung |
|---|---|
| **[Arun]** | Von Arun selbst geschrieben bzw. erstellt |
| **[KI]** | Von der KI geschrieben bzw. erstellt |

Jeder Abschnitt und jeder Eintrag ist mit einer dieser Markierungen versehen.

---

## 1. Projektübersicht

**[Arun]** Ligretto ist ein Online-Multiplayer-Kartenspiel im Browser. Spielerinnen und Spieler können einen Raum (Room) erstellen oder über eine RoomID einem bestehenden Raum beitreten.

**[KI]** Diese Dokumentation beschreibt den Stand vom 13.10.2026.

---

## 2. Projektstruktur

```
Ligretto/
├── README.md              [Arun] Initial commit, [KI] am 13.10.2026 ausgebaut
├── .gitignore             [Arun] Initial commit
├── AGENTS.md              [KI] Regeln für KI-Agenten
├── Dokumentation/
│   └── Dokumentation.md   [KI] diese Datei
├── backend/               [Arun] Ordner angelegt, noch leer
└── frontend/
    ├── index.html         [Arun] Startseite / Login
    ├── login.css          [Arun] Styles für die Startseite
    ├── styles.css         [Arun] angelegt, noch leer
    ├── main.js            [Arun] Event-Handling der Startseite
    ├── login.js           [Arun] Funktionen zum Beitreten / Erstellen
    ├── game.html          [Arun] angelegt, noch leer
    ├── rules.html         [Arun] angelegt, noch leer
    └── images/            [Arun] Kartenbilder
        ├── blue/          one.PNG … ten.PNG
        ├── green/         one.PNG … ten.PNG
        ├── pink/          one.PNG … ten.PNG
        ├── yellow/        one.PNG … ten.PNG
        └── back/          blue.PNG, green.PNG, pink.PNG, yellow.PNG
```

---

## 3. Bisherige Arbeit

### 3.1 Git-Repository – [Arun]

- Repository erstellt mit `README.md` und `.gitignore` (Commit `824301b`, „Initial commit“, 13.10.2026).
- Ordner `backend/` und `frontend/` angelegt.

### 3.2 Startseite `index.html` – [Arun]

- Sprache auf Schweizerdeutsch gesetzt (`lang="de-ch"`), Titel „Join Ligretto“.
- Bindet `main.js` und `login.js` als ES-Module ein sowie `login.css` und `styles.css`.
- Aufbau mit `header`, `main` und `footer`:
  - **Header:** Überschrift „Willkommen bei Ligretto“.
  - **Main:** Formular `#loginForm` mit
    - Eingabefeld `#roomIdInput` für die RoomID (Platzhalter „zb. 1A34“),
    - Button `#submitRoomId` „Beitreten“ (Submit),
    - Button `#createRoomButton` „Erstelle einen neuen Room“.
  - **Footer:** „Gemacht von Arun©“ und ein Link zu `rules.html`.

### 3.3 Styles `login.css` – [Arun]

- `body` als Grid mit drei Zeilen (`auto 1fr auto`), damit der Footer unten bleibt.
- `header`, `main` und `footer` je als 3-spaltiges Grid; das Formular sitzt in der mittleren Spalte, die Navigation im Footer in der rechten.
- Formularelemente untereinander (`display: block`), mit Abstand und grösserer Schrift.
- Buttons abgerundet (`border-radius: 50px`), der „Beitreten“-Button blau mit weisser Schrift.

### 3.4 Logik `main.js` – [Arun]

- Importiert `login.js` als Modul.
- Nach `DOMContentLoaded`:
  - Beim Absenden des Formulars wird das Neuladen verhindert (`preventDefault`), die eingegebene RoomID in `roomId` gespeichert und `login.joinRoom()` aufgerufen.
  - Beim Klick auf „Erstelle einen neuen Room“ wird `login.createRoom()` aufgerufen.

### 3.5 Logik `login.js` – [Arun]

- `createRoom()` und `joinRoom()` leiten beide aktuell auf `game.html` weiter.
- Noch keine Verbindung zu einem Backend.

### 3.6 Kartenbilder `images/` – [Arun]

- Vier Farben (blau, grün, pink, gelb) mit je den Karten 1 bis 10.
- Ein Rückseitenbild pro Farbe im Ordner `back/`.

### 3.7 Platzhalter – [Arun]

- `styles.css`, `game.html` und `rules.html` sind angelegt, aber noch leer.
- `backend/` ist angelegt, aber noch leer.

---

## 4. Beobachtungen zum aktuellen Stand – [KI]

Diese Punkte hat die KI beim Durchsehen bemerkt. Es wurde **nichts** am Code geändert, gemäss `AGENTS.md`.

1. In `main.js` wird `roomId` gesetzt, aber nirgends weiterverwendet. `joinRoom()` bekommt die RoomID nicht übergeben.
2. `login.js` wird in `index.html` als eigenes Script eingebunden und zusätzlich in `main.js` importiert. Das zweite `<script>`-Tag wäre nicht nötig.
3. In `main.js` fehlen nach zwei Zeilen die Semikolons (`createRoomButton`, `roomId`). Das funktioniert, ist aber uneinheitlich.
4. `.DS_Store`-Dateien (macOS) liegen im Projekt und sind noch nicht committet. Sie gehören in die `.gitignore`.
5. Die Bilddateien enden auf `.PNG` (Grossbuchstaben). Auf Servern, die Gross- und Kleinschreibung unterscheiden, muss der Pfad im Code genau so geschrieben werden.

---

## 5. Änderungsprotokoll

| Datum | Wer | Was |
|---|---|---|
| 13.10.2026 | [Arun] | Initial commit: `README.md`, `.gitignore` |
| 13.10.2026 | [Arun] | Frontend: Startseite, Styles, JS-Logik, Kartenbilder, Platzhalter |
| 13.10.2026 | [KI] | `Dokumentation/Dokumentation.md`, `AGENTS.md` erstellt, `README.md` ausgebaut |
