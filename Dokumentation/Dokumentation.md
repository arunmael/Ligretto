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
    ├── styles.css         [Arun] gemeinsames Layout (Header, Footer, Spielfeld-Grid)
    ├── main.js            [Arun] Event-Handling der Spielseite
    ├── login.js           [Arun] Event-Handling und Funktionen der Startseite
    ├── game.html          [Arun] Spielseite mit Spielfeld
    ├── game.css           [Arun] Grid für die Spieler-Decks
    ├── create-stack.js    [Arun] Logik, [KI] Karten-Array: Karten verteilen
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

- `rules.html` ist angelegt, aber noch leer.
- `backend/` ist angelegt, aber noch leer.

### 3.8 Umbau Startseite: `login.js` und `main.js` – [Arun]

- Die ganze Logik der Startseite (Formular absenden, „Room erstellen“) ist von `main.js` nach `login.js` umgezogen. `login.js` hängt die Event-Listener jetzt selbst nach `DOMContentLoaded` an; `createRoom()` und `joinRoom()` sind keine Exporte mehr, sondern lokale Funktionen.
- `index.html` bindet nur noch `login.js` ein (das `<script>` für `main.js` wurde entfernt).
- `main.js` gehört jetzt zur Spielseite: Der Button `#joinOtherRoom` führt zurück auf `index.html`.

### 3.9 Spielseite `game.html`, `styles.css`, `game.css` – [Arun]

- `game.html` mit Header (Überschrift „Los gehts“, Button „Trette einem anderen Room bei“), Footer wie auf der Startseite und einem Spielfeld in `main`:
  - vier Spieler-Bereiche `#playerDeckTop`, `#playerDeckLeft`, `#playerDeckRight`, `#playerDeckBottom` (Klasse `playerDeck`),
  - in der Mitte `#playArea` für die gemeinsamen Ablagestapel.
- `styles.css`: Header und Footer als 3-spaltiges Grid (aus `login.css` hierher verschoben). `main` als 3×3-Grid (`1fr 4fr 1fr`), damit die Spieler rund um das Spielfeld sitzen.
- `game.css`: Grid-Regeln für die Spieler-Decks (oben/unten nebeneinander, links/rechts untereinander).

### 3.10 Karten und Startstapel `create-stack.js`

**Kartendaten**

- **[Arun]** Idee: Jede Karte wird als Objekt mit eindeutiger ID, Bildpfad und Wert gespeichert.
- **[KI]** Hinweis, dass bei Ligretto jede Karte (z. B. „grüne 5“) in jedem der vier Decks vorkommt und der Besitzer deshalb Teil der ID sein muss. **[Arun]** hat entschieden, das so umzusetzen.
- **[KI]** Das Array `CARDS` mit allen 160 Karten (4 Besitzer × 4 Farben × 10 Werte) per Skript erzeugt. Jede Karte hat:
  - `id` im Format `besitzer-farbe-wert`, z. B. `yellow-green-5`,
  - `owner` (Rückseitenfarbe, also wem die Karte gehört),
  - `color` und `value` (für die Spielregeln),
  - `src` (Bild der Vorderseite) und `back` (Bild der Rückseite).

**Logik – [Arun], Syntax-Hilfe von [KI]**

- `getDeck(owner)` liefert alle 40 Karten eines Besitzers (mit `filter`).
- `createStartStack()` zieht zufällig 14 Karten aus dem gelben Deck:
  - Ein zufälliger Index wird mit `Math.floor(Math.random() * länge)` bestimmt.
  - Ist die Karte schon gezogen (`includes` in `openCards` oder `tenStack`), wird mit einer `while`-Schleife neu gezogen, damit keine Karte doppelt vorkommt.
  - Die ersten 4 Karten kommen in `openCards` (offene Reihe), die restlichen 10 in `tenStack` (Zehnerstapel).
- **[KI]** Syntax-Hilfe: Zugriff mit `array[index]`, `includes` statt `in` (der `in`-Operator prüft bei Arrays nur die Indizes, nicht die Inhalte).


---

## 4. Beobachtungen zum aktuellen Stand – [KI]

Diese Punkte hat die KI beim Durchsehen bemerkt. Es wurde **nichts** am Code geändert, gemäss `AGENTS.md`.

1. In `login.js` wird `roomId` gesetzt, aber nirgends weiterverwendet. `joinRoom()` bekommt die RoomID nicht übergeben.
2. `game.html` bindet nur `styles.css` ein, nicht `game.css`. Die Regeln in `game.css` greifen deshalb noch nicht.
3. In `game.css` ist `grid-template-columns: 4;` bzw. `grid-template-rows: 4;` kein gültiger Wert. Gemeint ist vermutlich `repeat(4, 1fr)`.
4. `createStartStack()` gibt `openCards` und `tenStack` noch nicht zurück und verteilt nur das gelbe Deck. `blueCards`, `greenCards` und `pinkCards` werden noch nicht verwendet.
5. `create-stack.js` wird noch von keiner Seite eingebunden bzw. importiert.
6. `.DS_Store`-Dateien (macOS) liegen im Projekt. Sie gehören in die `.gitignore`.
7. Die Bilddateien enden auf `.PNG` (Grossbuchstaben). Auf Servern, die Gross- und Kleinschreibung unterscheiden, muss der Pfad im Code genau so geschrieben werden (in `CARDS` ist das so umgesetzt).

Erledigt seit der letzten Version: `login.js` wird nicht mehr doppelt eingebunden.

---

## 5. Änderungsprotokoll

| Datum | Wer | Was |
|---|---|---|
| 13.10.2026 | [Arun] | Initial commit: `README.md`, `.gitignore` |
| 13.10.2026 | [Arun] | Frontend: Startseite, Styles, JS-Logik, Kartenbilder, Platzhalter |
| 13.10.2026 | [KI] | `Dokumentation/Dokumentation.md`, `AGENTS.md` erstellt, `README.md` ausgebaut |
| 13.10.2026 | [Arun] | Startseiten-Logik nach `login.js` verschoben, `main.js` für die Spielseite |
| 13.10.2026 | [Arun] | Spielseite: `game.html`, `styles.css`, `game.css` |
| 13.10.2026 | [Arun] | `create-stack.js`: `getDeck()` und `createStartStack()` (Logik) |
| 13.10.2026 | [KI] | `create-stack.js`: Array `CARDS` mit 160 Karten erzeugt, Syntax-Hilfe; Dokumentation nachgeführt |
