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

**[KI]** Diese Dokumentation beschreibt den Stand vom 13.11.2026 (Backend: `backend/cards.py` und `backend/logic/shuffle.py`).

---

## 2. Projektstruktur

```
Ligretto/
├── README.md              [Arun] Initial commit, [KI] am 13.10.2026 ausgebaut
├── .gitignore             [Arun] Initial commit, [KI] am 17.11.2026 um Python/macOS ergänzt
├── .venv/                 [KI] virtuelle Python-Umgebung (wird nicht gepusht)
├── AGENTS.md              [KI] Regeln für KI-Agenten
├── Dokumentation/
│   ├── Dokumentation.md   [KI] diese Datei (Arbeits- und Änderungsprotokoll)
│   ├── Technische-Doku.md [KI] aktueller Aufbau: Dateien, Funktionen, Ablauf
│   └── Bugs.md            [KI] offene Bugs (Regel 7)
├── backend/               [Arun] Backend-Ordner
│   ├── cards.py           [Arun] Datei angelegt, [KI] Kartenliste eingefügt
│   ├── connection/        [Arun] angelegt, noch leer (wird von Git noch nicht erfasst)
│   └── logic/
│       ├── rules.py       [Arun] Spielregeln (Farbe, Wert +1, leeres Feld nur 1) in Python
│       └── shuffle.py     [Arun] Spielerkarten mischen und auf drei Stapel verteilen, [KI] Docstrings
└── frontend/
    ├── index.html         [Arun] Startseite / Login
    ├── login.css          [Arun] Styles für die Startseite
    ├── styles.css         [Arun] gemeinsames Layout (Header, Footer, Spielfeld-Grid)
    ├── main.js            [Arun] Event-Handling der Spielseite
    ├── login.js           [Arun] Event-Handling und Funktionen der Startseite
    ├── game.html          [Arun] Spielseite mit Spielfeld
    ├── game.css           [Arun] Grid für die Spieler-Decks
    ├── create-stack.js    [Arun] Logik, [KI] Karten-Array: Karten verteilen
    ├── move-cards.js      [Arun] Karten auswählen und auf das Spielfeld legen
    ├── rules.js           [Arun] Spielregeln (Grundgerüst)
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
  - `alt` (Alternativtext der Karte, z. B. „Blau 1“ oder „Grün 10“; **[Arun]** wollte pro Karte einen `alt`-Wert, **[KI]** hat die Formulierung „Farbe Wert“ gewählt),
  - `src` (Bild der Vorderseite) und `back` (Bild der Rückseite).

**Logik – [Arun], Syntax-Hilfe von [KI]**

- `getDeck(owner)` liefert alle 40 Karten eines Besitzers (mit `filter`).
- `createStartStack()` zieht zufällig 14 Karten aus dem gelben Deck:
  - Ein zufälliger Index wird mit `Math.floor(Math.random() * länge)` bestimmt.
  - Ist die Karte schon gezogen (`includes` in `openCards` oder `tenStack`), wird mit einer `while`-Schleife neu gezogen, damit keine Karte doppelt vorkommt.
  - Die ersten 4 Karten kommen in `openCards` (offene Reihe), die restlichen 10 in `tenStack` (Zehnerstapel).
- **[KI]** Syntax-Hilfe: Zugriff mit `array[index]`, `includes` statt `in` (der `in`-Operator prüft bei Arrays nur die Indizes, nicht die Inhalte).

**DOM-Stapel `createDOMStack()` – [Arun], dokumentiert von [KI] (Commit `b2cfc83`, 14.10.2026)**

Verglichen wurde der letzte Commit (`b2cfc83`) mit dem vorletzten (`858186b`).

- **[Arun]** `createDOMStack(openCards, tenStack, handCards)` baut die Karten des eigenen Spielers im Element `#playerDeckBottom` auf. Die Farbe des Spielers kommt aus `sessionStorage` (`playerColor`) und wird mit `console.log` ausgegeben.
- **[Arun]** Offene Karten: Die Schleife liest jetzt aus `openCards[i]` statt aus `CARDS[i]`. Vorher war es `openCards.id` (ein Array hat kein `id`) und `CARDS[i]`, also immer die gleichen Karten aus dem Gesamtarray. Pro Karte entstehen ein `div` (Klasse `openCardsElement`) und ein `img` (Klasse `openCardImage`) mit `src` und `alt` der Karte, Breite `80px`, Höhe `auto`. Das `div` wird direkt mit `appendChild` angehängt. Das spätere Suchen per `querySelector` ist weggefallen.
- **[Arun]** Zehnerstapel: Neu wird die oberste Karte `tenStack[0]` als `div` (Klasse `tenStackElement`) mit `img` (Klasse `tenStackImage`) dargestellt.
- **[Arun]** Handkarten: Neu wird ein `div` (Klasse `handCardsElement`, ID `handCardsDiv<Farbe>`) mit der Rückseite `images/back/<Farbe>.PNG` (Klasse `handCardsImage`) angezeigt.
- **[Arun]** Ein Semikolon nach `createStartStack` ergänzt (`};`) und die Schleifen mit `;` abgeschlossen.
- **[Arun]** `game.css`: Die Grids `#playerDeckTop`/`#playerDeckBottom` und `#playerDeckLeft`/`#playerDeckRight` haben jetzt 6 statt 5 Spalten bzw. Zeilen (4 offene Karten + Zehnerstapel + Handkarten = 6 Elemente).

**[KI]** Beim Durchsehen aufgefallen (am Code wurde nichts geändert, das entscheidest du, Arun):

1. Die Schleife `for (let i = 1; i < 4; i++)` beginnt bei 1 und endet bei 3. Es werden also nur 3 statt 4 offene Karten gezeichnet, `openCards[0]` fehlt.
2. Die ID des Zehnerstapel-`div` beginnt mit `openCard…` (`openCard${tenStack[0].id}`). Vermutlich war `tenStack…` gemeint.
3. Der `alt`-Text der Handkarten lautet `back of the blue card ${playerColor}`. Das steht auch bei nicht-blauen Spielern „blue“. Vermutlich war nur `back of the ${playerColor} card` gemeint.
4. Dieser Dokumentationsabschnitt beschreibt `createStartStack` noch so wie früher (nur gelbes Deck). Im Code nimmt die Funktion jetzt `owner` entgegen und liefert zusätzlich `handCards` (die restlichen 26 Karten, gemischt). Das stammt aus früheren Commits und ist hier noch nicht nachgeführt.


---

### 3.11 Einheitliche Grösse der Handkarten-Rückseiten – [KI], 16.10.2026

- Auf Wunsch von **[Arun]** reserviert der Handkarten-Container in `createDOMStack()` jetzt 80 × 120 px und zentriert das Bild mit Flexbox.
- **[KI]** Die blaue Rückseite erhält vor der Drehung um 90° nach rechts eine Grösse von 120 × 80 px. Die übrigen Rückseiten erhalten direkt 80 × 120 px. `flexShrink = "0"` verhindert, dass Flexbox das blaue Bild verkleinert.
- **[KI]** Die bisherige alleinige Drehung und die ungeeigneten Grössenattribute bleiben mit Erklärungen auskommentiert erhalten. Jede neue Codezeile ist kommentiert.
- **[KI]** Dieser neue Eintrag wartet noch auf die Prüfung durch Arun.
- **[Arun]** Nachträgliche Anpassung (siehe 3.13): Der Container misst jetzt 60 × 90 px, die blaue Rückseite 90 × 60 px (vor der Drehung), die übrigen 60 × 90 px. Die oben genannten 80 × 120 px gelten nicht mehr.

### 3.12 Versetzter Zehnerstapel – [KI], 17.10.2026

- Auf Wunsch von **[Arun]** zeigt `createDOMStack()` alle Karten aus `tenStack` mit je 2 px Versatz nach rechts und unten. Die Vorderseiten und die bestehenden schwarzen, abgerundeten Rahmen bleiben sichtbar.
- **[KI]** Der Container ist relativ positioniert, die Karten absolut. Seine Masse berücksichtigen Kartenanzahl und Rahmen. `tenStack[0]` liegt durch `zIndex` oben; nur dieses Bild empfängt Zeigereingaben. Die Container-ID lautet jetzt `tenStackDiv<Farbe>` und funktioniert auch bei leerem Stapel.
- **[KI]** Die bisherige Einzelkartendarstellung bleibt auskommentiert erhalten. Klickaktionen und das Aktualisieren nach einem Spielzug sind noch nicht implementiert; beim späteren Entfernen einer Karte muss auch die Darstellung aktualisiert werden.
- **[KI]** Dieser neue Eintrag wartet noch auf die Prüfung durch Arun.
- **[Arun]** Nachträgliche Anpassung (siehe 3.13): Die Stapelbilder sind 60 × 90 px gross, der Versatz pro Karte beträgt `i * 2.5` px statt 2 px. Die Container-Masse (`84 + …` / `124 + …`, Versatz `* 2`) wurden dabei **nicht** mitgeändert und passen deshalb nicht mehr genau (siehe Abschnitt 4).

### 3.13 Weitere Änderungen von Arun – [Arun], dokumentiert von [KI], 17.10.2026

Verglichen wurde der Arbeitsstand (noch nicht committet) mit dem letzten Commit `b2cfc83`.

- **[Arun]** `index.html`: Die Optionen der Farbauswahl hatten doppelte Werte (`Gelb` = `blue`, `Pink` = `green`). Jetzt haben sie die richtigen Werte `yellow` und `pink`, sonst hätte die Auswahl „Gelb“ bzw. „Pink“ das falsche Deck geliefert.
- **[Arun]** `create-stack.js`, offene Karten: Breite von `80px` auf `60px`, dazu ein schwarzer Rahmen (`2px solid black`) mit abgerundeten Ecken (`10px`).
- **[Arun]** `create-stack.js`, Handkarten: Container 60 × 90 px, per Flexbox zentriert. Die blaue Rückseite (Querformat) wird 90 × 60 px gross und um 90° gedreht, die anderen 60 × 90 px. Schwarzer, abgerundeter Rahmen wie bei den anderen Karten. Die Attribute `width`/`height` am Bild wurden entfernt.
- **[Arun]** `create-stack.js`: Neue Funktion `createPlayeArea()` erzeugt in `#playArea` ein 4 × 4-Raster mit 16 leeren Feldern (`playAreaField0` … `playAreaField15`, je 60 × 90 px, grauer, abgerundeter Rahmen) für die gemeinsamen Ablagestapel. Ein Kommentar im Code vermerkt, dass die Zahl 4 später durch die Spieleranzahl ersetzt werden soll.
- **[Arun]** `main.js`: Ruft `createStack.createPlayeArea()` vor `createDOMStack(...)` auf.
- **[Arun]** `game.css`: Die Bereiche werden per `grid-area` im 3 × 3-Raster platziert (`#playerDeckTop` 1/2, `#playerDeckLeft` 2/1, `#playArea` 2/2, `#playerDeckRight` 2/3, `#playerDeckBottom` 3/2). Dazu kommen Regeln für `body` (Grid mit `auto minmax(0, 1fr) auto`, Höhe `100dvh`) und `main` (`minmax`-Zeilen `1fr 4fr 1fr`, `gap: 8px`).
- **[KI]** Neue Auffälligkeiten dazu stehen in Abschnitt 4 (Punkte 8 bis 12).

### 3.14 Karten auswählen und auf das Spielfeld legen – [Arun], dokumentiert von [KI], 21.10.2026

Verglichen wurde der Arbeitsstand (noch nicht committet) mit dem letzten Commit `04b96cd`.

**`game.html`**
- **[Arun]** Jeder der vier Spielerbereiche (`playerDeckTop`, `Left`, `Right`, `Bottom`) enthält jetzt vier Unter-Container:
  - `openCards<Seite>` (Klasse `openCards`) für die offenen Karten,
  - `tenStack<Seite>` (Klasse `tenStack`) für den Zehnerstapel,
  - `handCards<Seite>Closed` (Klasse `handCardsClosed`) für den verdeckten Handstapel,
  - `handCards<Seite>Open` (Klasse `handCardsOpen`) für die aufgedeckten Handkarten.
- **[Arun]** Neues `<script src="move-cards.js">` eingebunden (mit Tippfehler im Typ, siehe Abschnitt 4, Punkt 13).

**`create-stack.js`**
- **[Arun]** `createDOMStack()` hängt die Karten nicht mehr alle an `#playerDeckBottom`, sondern in die neuen Container:
  - offene Karten in `#openCardsBottom`,
  - Zehnerstapel in `#tenStackBottom`,
  - Handkarten-Rückseite in `#handCardsBottomClosed`.

**`game.css`**
- **[Arun]** Neue Regel `.openCards`: Grid mit 3 gleich breiten Spalten und `gap: 2px`.

**`move-cards.js` (neue Datei)**
- **[Arun]** `laidCards`: Liste aller Karten, die schon auf dem Spielfeld liegen.
- **[Arun]** `deleteFromStack(card, openCards, tenStack, handCards)`: Sucht die Karte per `id` in den drei Stapel-Arrays, entfernt sie mit `splice` und legt sie in `laidCards`.
- **[Arun]** `moveCardsToPlayArea(card, newLocation, openCards, tenStack, handCards)`:
  - bricht ab, wenn Karte oder Zielfeld fehlt,
  - setzt die Karte auf `position: static` und hängt sie ans Zielfeld,
  - entfernt sie aus den Daten-Arrays,
  - war es eine Zehnerstapel-Karte, wird die nächste Karte im alten Container wieder klickbar (`pointerEvents = "auto"`).
- **[Arun]** `clickCardStyle(lastCard)`: Setzt den Rahmen der zuvor gewählten Karte zurück auf `2px solid black`.

**`main.js`**
- **[Arun]** Importiert `move-cards.js` und holt `#openCardsBottom`, `#tenStackBottom`, `#handCardsBottomClosed` und `#playArea`. `activeField` merkt sich die gewählte Karte, `lastCard` die zuvor gewählte.
- **[Arun]** Klick auf offene Karten oder Zehnerstapel: Nur `img`-Elemente zählen. Der Rahmen der alten Auswahl wird zurückgesetzt, die neue Karte bekommt einen grünen Rahmen (`5px solid green`) und wird zur aktiven Karte.
- **[Arun]** Klick auf `#playArea`: Nur Felder der Klasse `playAreaField` zählen. Der Rahmen der aktiven Karte wird zurückgesetzt, `moveCardsToPlayArea(...)` legt die Karte ab, danach ist keine Karte mehr aktiv.
- **[Arun]** Nach dem Aufruf von `createDOMStack(...)` ein Semikolon ergänzt.

**`rules.js`**
- **[Arun]** Bisher leer, enthält jetzt nur `import CARDS from "./create-stack.js";` als Vorbereitung für die Spielregeln (siehe Abschnitt 4, Punkt 14).

### 3.15 Zehnerstapel auf offene Karten, `isAllowed` – [Arun], dokumentiert von [KI], 26.10.2026

Verglichen wurde der Arbeitsstand (noch nicht committet) mit dem letzten Commit `8b7794a`.

**`create-stack.js`**
- **[Arun]** `CARDS` wird jetzt mit `export const` exportiert, damit andere Dateien (z. B. `rules.js`) darauf zugreifen können.

**`move-cards.js`**
- **[Arun]** `laidCards` wird exportiert (`export let`), damit `main.js` den Inhalt ausgeben kann.
- **[Arun]** Die Suche in `deleteFromStack()` vergleicht jetzt `` `image${entry.id}` === card.id ``. Die Bild-Elemente tragen die Karten-ID mit dem Präfix `image`, der alte Vergleich `entry.id === card.id` hat deshalb nie getroffen.
- **[Arun]** Ein `//todo`-Kommentar hält fest: Eine Karte, die vom Zehnerstapel zu den offenen Karten wandert, darf nicht in `laidCards` landen, sondern muss in `openCards` bleiben.

**`main.js`**
- **[Arun]** Klick auf die offenen Karten, während eine Zehnerstapel-Karte aktiv ist: Die Karte wird in `openCards`, `tenStack` und `handCards` gesucht, per `splice` entfernt, an `openCards` angehängt und dann mit `moveCardsToPlayArea(...)` ins Ziel-Element verschoben.
- **[Arun]** Zwei `console.log`-Aufrufe (`openCards`, `moveCards.laidCards`) zum Prüfen des Zustands.

**`rules.js`**
- **[Arun]** Neue Funktion `isAllowed(lastCard, currentCard)` als Anfang der Regelprüfung (noch nicht aufgerufen, siehe Abschnitt 4, Punkte 21 bis 24).

### 3.16 Code kommentiert – [KI], 08.11.2026

- Auf Wunsch von **[Arun]** hat die KI den ganzen Code kommentiert (gemäss `AGENTS.md`, Regel 6): `main.js`, `rules.js`, `move-cards.js`, `login.js`, `create-stack.js`, `game.html`, `index.html`, `styles.css`, `login.css`, `game.css`.
- **[KI]** Es wurden nur Kommentare ergänzt, am Code selbst wurde nichts geändert. Geprüft wurde das per Vergleich des Codes ohne Kommentare mit dem vorherigen Stand. Ausnahme: Beim Neuschreiben von `main.js`, `rules.js`, `move-cards.js` und `login.js` sind Leerzeichen am Zeilenende weggefallen.
- **[KI]** Erster Versuch: fast jede Zeile kommentiert. **[Arun]** wollte das nicht, sondern Kommentare wie in einem produktiven Projekt. Deshalb neu:
  - JS: ein Kopfkommentar pro Datei, ein JSDoc-Block (`/** … */`) über jeder Funktion bzw. jedem Event-Handler (was sie macht, Parameter, Rückgabe) und Inline-Kommentare nur bei nicht selbsterklärenden Zeilen (z. B. `slice(5)`, `position = "static"`).
  - HTML/CSS: kurze Abschnittskommentare über den Blöcken bzw. Regeln.
  - Bekannte Fehler sind im Code mit `FIXME` markiert (`localStorage` statt `sessionStorage`, `activeField === null`, Schleife ab 1 bei den offenen Karten, keine Farbe bei „Room erstellen“, Karte landet in `laidCards` statt `openCards`). In `game.css` steht bei der doppelten `#playArea`-Regel ein Hinweis.
- **[KI]** Dieser neue Eintrag wartet noch auf die Prüfung durch Arun.

### 3.17 Zehnerstapel-Karte in offenen Karten behalten – [KI], 08.11.2026

- **[Arun]** Hat den Einbau des zuvor vorgeschlagenen Parameters freigegeben.
- **[KI]** `moveCardsToPlayArea()` erhält `updateStacks = true`. Nur bei aktivierter Option wird `deleteFromStack()` aufgerufen; bestehende Aufrufe fürs Spielfeld behalten ihr Verhalten.
- **[KI]** Beim Verschieben vom Zehnerstapel zu den offenen Karten übergibt `main.js` jetzt `false`, weil dort die Arrays bereits aktualisiert wurden. Die Karte bleibt in `openCards` und wird nicht zusätzlich nach `laidCards` verschoben. Das Freischalten der nächsten Zehnerstapel-Karte bleibt erhalten.
- **[KI]** Bisherige Codezeilen bleiben auskommentiert erhalten. Diese Ergänzung wartet noch auf die Prüfung durch Arun.

### 3.17 Spielregeln eingebaut und Fehler behoben – [Arun], dokumentiert von [KI], 08.11.2026

Verglichen wurde der Arbeitsstand (noch nicht committet) mit dem letzten Commit `774ec17`.

**`rules.js`**
- **[Arun]** Import korrigiert: `import { CARDS } from ...` (benannter statt Default-Import).
- **[Arun]** Neue Funktionen `getNumber(card)` und `getColor(card)`: Sie schneiden das Präfix `image` von der Bild-ID ab und schlagen Wert bzw. Farbe der Karte in `CARDS` nach.
- **[Arun]** `isAllowed(targetCard, currentCard)` neu geschrieben: Erlaubt ist ein Zug, wenn die Farbe gleich ist und der Wert genau um 1 höher. Ohne Zielkarte (`null`) ist nur eine 1 erlaubt.

**`main.js`**
- **[Arun]** Importiert `rules.js`.
- **[Arun]** Klick auf eine liegende Karte im Spielfeld: Die Karte wird nur gelegt, wenn `rules.isAllowed(...)` `true` liefert, sonst erscheint `not Allowed` in der Konsole.
- **[Arun]** Klick auf ein leeres Feld: Nur eine Karte mit Wert 1 darf gelegt werden.
- **[Arun]** `#joinOtherRoom` löscht `playerColor` und `roomId` jetzt aus `sessionStorage` statt aus `localStorage`.
- **[Arun]** Zehnerstapel-Karte auf offene Karte: `moveCardsToPlayArea(..., false)` wird aufgerufen, damit die Karte in `openCards` bleibt.

**`move-cards.js`**
- **[Arun]** `moveCardsToPlayArea` hat einen neuen Parameter `updateStacks = true`. Bei `false` wird `deleteFromStack()` übersprungen, die Karte landet also nicht in `laidCards`. Damit ist das `//todo` gelöst.

**`login.js`**
- **[Arun]** „Erstelle einen neuen Room“ speichert jetzt auch `playerColor` und `roomId` in `sessionStorage`.

**`AGENTS.md`**
- **[Arun]** Neue Regel 5 „Code Fragen“: wie auf Stack Overflow antworten und möglichst wenig vom Code ändern.
- **[Arun]** Neue Regel 6 „Code kommentieren“: Kommentieren nur auf Aufforderung, Code dabei nicht verändern, kurz und verständlich.

**[KI]** Dadurch veraltete Kommentare (am Code wurde nichts geändert, das entscheidest du, Arun):
- `login.js`: Das `FIXME` über `createRoomButton` stimmt nicht mehr, die Farbe wird jetzt gespeichert.
- `move-cards.js`: Das `//todo` ist gelöst und kann weg. Im JSDoc von `moveCardsToPlayArea` fehlt der neue Parameter `updateStacks`.

### 3.18 Python-Kartenliste `backend/cards.py` – [KI], 13.11.2026

- **[Arun]** Hat die Datei angelegt und das Einfügen der Karten sowie die Dokumentation beauftragt.
- **[KI]** (Codex) hat alle 160 Karten aus `frontend/create-stack.js` in `backend/cards.py` als `CARDS` eingefügt: eine Python-Liste mit einem Dictionary pro Karte. Alle sieben Eigenschaften und die Reihenfolge bleiben erhalten.
- **[KI]** Jede neue Codezeile ist kommentiert. Die Frontend-Liste bleibt bestehen, da sie dort weiterhin verwendet wird; eine Anbindung an das Backend ist noch nicht Teil dieser Änderung.
- **[KI]** Die Python-Syntax und die vollständige Übereinstimmung mit den 160 Frontend-Karten wurden geprüft. Diese Ergänzung wartet noch auf die Prüfung durch Arun.

### 3.19 Kommentare in `backend/logic/shuffle.py` – [KI], 13.11.2026

- **[Arun]** Hat kurze Kommentare im Code beauftragt.
- **[KI]** (Codex) hat die Auswahl der Spielerkarten, das Mischen und die Aufteilung auf die drei Stapel kommentiert. Der ausführbare Code blieb unverändert; dies wurde durch einen Vergleich der Python-Syntaxbäume geprüft.
- **[KI]** Der noch vorhandene Fehler `openCards.append[i]` ist im Code als Kommentar erklärt, aber nicht korrigiert: Der Methodenaufruf benötigt `openCards.append(i)`.
- **[KI]** Diese Ergänzung wartet noch auf die Prüfung durch Arun.

### 3.20 Docstrings in `backend/logic/shuffle.py` – [KI], 13.11.2026

- **[Arun]** Wünscht weniger Kommentare und stattdessen Docstrings.
- **[KI]** (Codex) hat die zuvor ergänzten Kommentare durch kurze Docstrings der drei Funktionen ersetzt. Die Beschreibung von `getDivideStack()` enthält die Stapelgrössen, die Rückgabereihenfolge und den Hinweis auf den weiterhin vorhandenen Fehler `openCards.append[i]`.
- **[KI]** Die Funktionslogik blieb unverändert; geprüft durch Vergleich der Syntaxbäume ohne Docstrings. Diese Ergänzung wartet noch auf die Prüfung durch Arun.

### 3.21 Backend-Grundgerüst und Kartenverteilung in Python – [Arun], dokumentiert von [KI], 13.11.2026

- **[Arun]** Ordnerstruktur im Backend angelegt: `backend/logic/` für die Spiellogik, `backend/connection/` für die spätere Verbindung zum Frontend (noch leer) und `backend/logic/rules.py` (noch leer).
- **[Arun]** `backend/logic/shuffle.py` geschrieben, die Python-Version der Kartenverteilung aus `create-stack.js`:
  - `getPlayerCards(CARDS, playerColor)` gibt alle Karten zurück, deren `owner` der Spielerfarbe entspricht (40 Karten pro Farbe).
  - `shuffleDeck(CARDS, playerColor)` mischt diese Karten mit `random.shuffle`.
  - `getDivideStack(CARDS, playerColor)` verteilt die gemischten Karten auf Zehnerstapel (10), offene Karten (3) und Handkarten (27) und gibt sie in dieser Reihenfolge zurück.
- **[Arun]** Den Fehler `openCards.append[i]` aus 3.19/3.20 behoben (jetzt `openCards.append(i)`) und den Hinweis darauf aus dem Docstring entfernt.
- **[Arun]** Imports ergänzt: `from random import *` für `shuffle()` und `from .. cards import CARDS` für die Kartenliste.
- **[KI]** Geprüft: Ruft man `getDivideStack(CARDS, "blue")` aus dem Projektordner auf, kommen 10, 3 und 27 Karten zurück, alle mit `owner` `"blue"`. Der direkte Aufruf `python3 backend/logic/shuffle.py` bricht dagegen ab (siehe Punkt 33).
- **[KI]** Ein venv wird noch nicht gebraucht, weil nur die Standardbibliothek (`random`) verwendet wird. Sobald ein Paket mit `pip` installiert wird (z. B. für `connection/`), sollte eines angelegt und `.venv/` in die `.gitignore` aufgenommen werden.

### 3.22 Kommentare an die Regeln angepasst – [KI], 13.11.2026

- **[Arun]** Hat beauftragt, alle Kommentare im Projekt auf die Regeln in `AGENTS.md` zu prüfen und nicht passende zu ändern.
- **[KI]** Geändert wurden nur Kommentare, kein Code (per Diff geprüft). Die Zeilenzahl jeder Datei ist gleich geblieben, damit die Zeilenangaben in `Bugs.md` weiterhin stimmen.
  - `login.js`, Zeile 48: Das veraltete `FIXME` („keine Farbe gespeichert“) stimmte nicht mehr und wurde durch eine Beschreibung des Handlers ersetzt, passend zum „Beitreten“-Handler.
  - `move-cards.js`: Das erledigte `//todo` (siehe 3.17) entfernt. Im JSDoc von `moveCardsToPlayArea` fehlte der Parameter `updateStacks`, er ist jetzt ergänzt.
  - `create-stack.js`, JSDoc von `createStartStack`: „4 offene Karten“ und „26 Handkarten“ auf die tatsächlichen 3 und 27 korrigiert.
  - `create-stack.js`, Zeilen 298 und 299: Hinweis ergänzt, dass die Bilder nur 60 × 90 px gross sind (BUG-008).
  - `create-stack.js`, Zeile 304: Der Kommentar nannte 2 px Versatz, der Code verwendet 2,5 px.
  - `create-stack.js`: Den Hinweis „Zahl 4 durch Anzahl Spieler ersetzen“ als `TODO:` markiert und über den JSDoc-Block verschoben. Zwischen JSDoc und Funktion hat er die Zuordnung des JSDoc zur Funktion unterbrochen.
  - `game.html`, Zeile 6: `rules.js` in der Aufzählung der Imports von `main.js` ergänzt.
- **[KI]** Geprüft und in Ordnung: `main.js`, `rules.js`, `index.html`, alle CSS-Dateien, `shuffle.py` und `cards.py`. Das `FIXME` in `main.js` (Zeile 93) bleibt, weil der Fehler noch besteht (BUG-005). Die auskommentierten Blöcke in `create-stack.js` (Zeilen 276 bis 294) erfüllen Regel 3 bereits.

### 3.23 Endlosschleife ohne Farbe abgefangen, Import in `shuffle.py` entfernt – [Arun], dokumentiert von [KI], 13.11.2026

- **[Arun]** `main.js`: Die Spielerfarbe wird jetzt ganz am Anfang des `DOMContentLoaded`-Handlers gelesen (Zeilen 11 bis 16). Ist sie keine der vier gültigen Farben, erscheint die Meldung „Etwas ist Schief gelaufen“, der Browser leitet zu `index.html` zurück, und `return` bricht den restlichen Aufbau der Spielseite ab. Die alte Zeile `const owner = …` vor `createStartStack()` ist entfernt.
- **[KI]** Damit friert `game.html` nicht mehr ein, wenn die Seite ohne Login geöffnet wird. Die Funktion `createStartStack()` selbst hat die Endlosschleife weiterhin; sie ist nur durch die Prüfung in `main.js` geschützt (BUG-003, auf „Klein“ herabgestuft).
- **[Arun]** `shuffle.py`: Den Import `from .. cards import CARDS` entfernt. `CARDS` kommt ohnehin als Parameter in alle drei Funktionen. Der Aufrufer (später z. B. `backend/server.py`) importiert die Liste und übergibt sie.
- **[KI]** Geprüft: `python3 backend/logic/shuffle.py` sowie `import logic.shuffle` aus `backend/` laufen jetzt ohne Fehler. BUG-001 ist behoben und aus `Bugs.md` entfernt. Die Startdatei des Servers sollte direkt in `backend/` liegen, damit `from cards import CARDS` und `from logic.shuffle import …` gefunden werden.
- **[KI]** In `Bugs.md` alle Zeilenangaben für `main.js` und `shuffle.py` nachgeführt, da sich die Zeilen verschoben haben.

### 3.24 Ergänzung `updateStacks` gezielt zurückgenommen – [KI], 14.11.2026

- **[Arun]** Hat die gezielte Rücknahme der Ergänzung gewünscht, ohne die gesamte Datei auf einen älteren Stand zurückzusetzen.
- **[KI]** In `move-cards.js` den Parameter `updateStacks`, seinen JSDoc-Eintrag und die zugehörige Bedingung entfernt. `deleteFromStack()` wird wieder unbedingt aufgerufen. In `main.js` das zugehörige Argument `false` entfernt. Andere Funktionen und die übrigen Kommentare bleiben erhalten.
- **[KI]** Damit besteht das frühere Problem aus Punkt 21 erneut: Beim Nachfüllen verschiebt `main.js` die Karte zunächst nach `openCards`, danach verschiebt `deleteFromStack()` sie nach `laidCards`. Dies ist eine gezielte Rücknahme, keine Behebung von BUG-004. Die historischen Einträge zum Einbau bleiben erhalten. Diese Ergänzung wartet noch auf die Prüfung durch Arun.

### 3.25 Ursprüngliche Stapelverwaltung wiederhergestellt – [KI], 14.11.2026

- **[Arun]** Hat die Rückkehr zum Verschieben mit unbedingtem Einfügen in `laidCards` gewünscht.
- **[KI]** `getOldLocation()` und die neue Zielprüfung in `deleteFromStack()` zurückgenommen. Die Funktion nimmt wieder vier Argumente entgegen und fügt die entfernte Karte immer in `laidCards` ein. Der fehlende fünfte Parameter verursachte zuvor beim Verschieben einer Zehnerstapel-Karte einen Fehler beim Zugriff auf `newLocation.classList`, bevor die nächste Karte freigeschaltet werden konnte.
- **[KI]** `main.js` und `moveCardsToPlayArea()` bleiben bei dieser Änderung unverändert. BUG-004 und die bekannte falsche Zuordnung nach `laidCards` beim Nachfüllen bleiben bestehen. Diese Ergänzung wartet noch auf die Prüfung durch Arun.

### 3.26 Ablegeablauf aus Commit `774ec17` wiederhergestellt – [KI], 14.11.2026

- **[Arun]** Hat verlangt, den früheren Stand des visuellen Verschiebens in der Git-Historie zu suchen und wiederherzustellen.
- **[KI]** Der Vergleich zeigt: `774ec17` (26.10.2026) enthält das Verschieben ohne Regelprüfung und die bekannte Zuordnung nach `laidCards`. `24a8744` ergänzte später in `main.js` sowohl `updateStacks` als auch die Prüfungen für Farbe und Zahl. Die bisherigen Rücknahmen hatten diese Regelprüfungen stehen lassen.
- **[KI]** Die Regelprüfungen beim Ablegen in `main.js` und den dadurch ungenutzten Import von `rules.js` zurückgenommen. Alle drei Karten-Klickhandler sowie der ausführbare Inhalt von `move-cards.js` entsprechen nun `774ec17`; dies wurde durch einen Vergleich ohne Kommentare und Leerzeichen geprüft. Die spätere Prüfung der Spielerfarbe und die Verwendung von `sessionStorage` beim Verlassen bleiben erhalten.
- **[KI]** Dieser historische Stand ist nicht vollständig fehlerfrei: Insbesondere das Ablegen auf eine belegte offene Karte (BUG-004) und die falsche Zuordnung nach `laidCards` beim Nachfüllen bleiben bestehen. Diese Ergänzung wartet noch auf die Prüfung durch Arun.

### 3.27 Regelprüfungen wiederhergestellt und unsichtbares Kartenbild korrigiert – [KI], 14.11.2026

- **[Arun]** Hat klargestellt, dass die Erweiterungen aus `rules.js` erhalten bleiben müssen und eine Zehnerstapel-Karte beim Ablegen auf eine offene Karte sichtbar bleiben soll.
- **[KI]** Die in 3.26 irrtümlich entfernten Regelprüfungen samt Import wiederhergestellt: Auf freie Spielfelder darf nur eine 1, auf liegende Spielfeldkarten nur dieselbe Farbe mit Wert +1.
- **[KI]** Im Klickhandler der offenen Karten wird mit `closest(".openCardsElement")` der Zielcontainer bestimmt. Bild- und Randklick treffen dadurch denselben Platz. Ungültige Ziele und das Ablegen auf sich selbst werden abgefangen. Das bisherige Kartenbild wird entfernt und die neue Karte in das umgebende `div` verschoben. Der fehlerhafte Aufruf mit einem möglichen `img` als Ziel bleibt mit Erklärung auskommentiert erhalten.
- **[KI]** Die Listenverwaltung wurde nicht geändert; die bekannte Zuordnung nach `laidCards` und die verbleibenden Daten der ersetzten offenen Karte sind damit nicht behoben. Die frühere Behauptung, die Rücknahme der Regelprüfungen entspreche dem gewünschten Verhalten, war falsch.
- **[KI]** Syntaxprüfung und acht Fälle mit den tatsächlichen Klickhandlern, `rules.js`, Kartendaten und einer DOM-Nachbildung bestanden: Bildklick, Randklick, leerer offener Platz, 1 und Nicht-1 auf freies Spielfeld sowie passende Zahl, falsche Zahl und falsche Farbe auf eine Spielfeldkarte. Keine visuelle Browserprüfung durchgeführt. Diese Ergänzung wartet noch auf die Prüfung durch Arun.

### 3.28 Direkter Funktionsaufruf beim Nachfüllen – [KI], 14.11.2026

- **[Arun]** Hat den direkten Aufruf der Verschiebefunktion im Klickhandler der offenen Karten in `main.js` beauftragt.
- **[KI]** Die inzwischen leere Suchschleife mit Erklärung auskommentiert. Der Handler entfernt wieder das bisherige Bild am Zielplatz und ruft `moveCardsToPlayArea()` direkt auf; die Listenänderung übernimmt ausschliesslich die dort aufgerufene Funktion `deleteFromStack()`.
- **[KI]** `move-cards.js` bleibt unverändert. Dort sind beim Aufruf von `getOldLocation()` weiterhin `openCards` und `tenStack` vertauscht; die richtige Listenzuordnung ist deshalb noch nicht gewährleistet. Das Datenobjekt einer ersetzten offenen Karte wird ebenfalls weiterhin nicht entfernt. Diese Ergänzung wartet noch auf die Prüfung durch Arun.

### 3.29 Nachfüllen nur auf leere offene Plätze, Zielprüfung in `deleteFromStack()` – [Arun], 14.11.2026

- **[Arun]** `main.js`, Klickhandler der offenen Karten (Zeile 53): Eine Zehnerstapel-Karte darf nur noch auf einen **leeren** offenen Platz gelegt werden. Ist im Platz schon ein Bild, bricht der Handler mit `return` ab. Damit kann eine Karte nicht mehr in einem belegten Platz verschwinden (BUG-004 behoben).
- **[Arun]** `move-cards.js`: Neue Hilfsfunktion `getOldLocation()` bestimmt, aus welchem Stapel eine Karte stammt. `deleteFromStack()` bekommt wieder `newLocation` als fünften Parameter: Kommt die Karte vom Zehnerstapel und ist das Ziel ein offener Platz (`openCardsElement`), soll sie in `openCards` statt in `laidCards` eingefügt werden. `moveCardsToPlayArea()` reicht `newLocation` weiter.
- **[KI]** Bug-Check nach Regel 7: Die Zuordnung nach `openCards` greift noch nicht, weil `getOldLocation()` mit vertauschten Argumenten (`openCards` und `tenStack`) aufgerufen wird. Die nachgefüllte Karte landet weiterhin in `laidCards` (neu als BUG-010, in Node bestätigt). Zudem lässt sich mit ausgewählter Zehnerstapel-Karte keine offene Karte mehr auswählen (BUG-011). BUG-004 aus `Bugs.md` entfernt, Zeilenangaben von BUG-005, BUG-006 und BUG-007 nachgeführt.
- **[KI]** Hinweis: Durch Zeile 53 ist Zeile 60 (`targetSlot.querySelector("img")?.remove()`) wirkungslos, da der Platz an dieser Stelle immer leer ist. Die Kommentare in `move-cards.js` (Zeilen 25, 37, 58 und die JSDoc von `deleteFromStack()`) beschreiben noch den Stand „immer nach `laidCards`“ und passen nicht mehr zum Code. Die Angaben in 3.27 und 3.28 zum Ersetzen des bisherigen Kartenbilds sind durch diese Änderung überholt.

### 3.30 BUG-010 behoben und Kommentare nachgeführt – [Arun]/[KI], 14.11.2026

- **[Arun]** `move-cards.js`, Zeile 30: Die Argumente beim Aufruf von `getOldLocation()` in die Reihenfolge der Signatur gebracht (`tenStack, openCards`). Eine Zehnerstapel-Karte, die auf einen leeren offenen Platz gelegt wird, landet jetzt in `openCards` statt in `laidCards` (BUG-010 behoben).
- **[KI]** In Node geprüft: Zehnerstapel → offener Platz ergibt `openCards`, Zehnerstapel → Spielfeld und offene Karte → Spielfeld ergeben `laidCards`. BUG-010 aus `Bugs.md` entfernt. Die Aussage in 3.29, dass die Zuordnung nach `openCards` noch nicht greift, ist damit überholt.
- **[KI]** Auf Wunsch von Arun veraltete Kommentare korrigiert, nur Kommentare, Zeilenzahl gleich:
  - `move-cards.js`: Kommentar zu `getOldLocation()` ergänzt; JSDoc und Zeilenkommentare von `deleteFromStack()` beschreiben jetzt die Unterscheidung `openCards`/`laidCards` statt „immer nach `laidCards`“; Kommentar beim Aufruf in `moveCardsToPlayArea()` angepasst.
  - `main.js`: JSDoc des Klickhandlers der offenen Karten (nur leere Plätze), Kommentar zur Leer-Prüfung in Zeile 53 ergänzt, Kommentar in Zeile 60 weist jetzt darauf hin, dass die Zeile wirkungslos ist.

### 3.31 Quellcode formatiert – [KI], 14.11.2026

- **[Arun]** Hat einheitliche Einrückungen und übersichtliche Leerzeilen in allen Quelldateien gewünscht, ausdrücklich ohne Änderungen am Codeverhalten.
- **[KI]** JavaScript, HTML, CSS und Python geprüft; Einrückungen, Abstände, Leerzeilen und Zeilenumbrüche dort vereinheitlicht, wo nötig. Bereits passend formatierte und leere Dateien bleiben unverändert. Anweisungen, Werte und Kommentare wurden inhaltlich nicht verändert; insbesondere bleibt Aruns noch leerer `if`-Block in `main.js` unverändert leer.
- **[KI]** Gegen den Arbeitsstand unmittelbar vor der Formatierung geprüft: JavaScript- und Python-Syntaxbäume unverändert, HTML-Struktur und Textinhalte unverändert, in allen Quelldateien ausschliesslich Whitespace-Änderungen. Vorhandene Änderungen von Arun wurden erhalten. Diese Ergänzung wartet noch auf die Prüfung durch Arun.

### 3.32 Offene Karte trotz Zehnerstapel-Auswahl wählbar, Farbprüfung in `getDeck()` und `shuffle.py` – [Arun], 14.11.2026

- **[Arun]** `main.js`, Klickhandler der offenen Karten (Zeilen 53 bis 60): Ist eine Zehnerstapel-Karte ausgewählt und wird eine **belegte** offene Karte angeklickt, wird jetzt diese offene Karte ausgewählt (grüner Rahmen, alter Rahmen über `clickCardStyle()` zurückgesetzt). Bisher passierte nichts (BUG-011 behoben).
- **[Arun]** `create-stack.js`: `getDeck()` prüft die Spielerfarbe. Bei einer ungültigen Farbe erscheint eine Meldung, die Seite wechselt zu `index.html` und die Funktion gibt `false` zurück. `createStartStack()` bricht dann mit `false` ab, statt in eine Endlosschleife zu laufen (BUG-003 behoben).
- **[Arun]** `backend/logic/shuffle.py`: Erster Versuch, eine unbekannte Spielerfarbe abzufangen. `getPlayerCards()` soll bei leerer Kartenliste `False` liefern, `shuffleDeck()` reicht `False` weiter, `getDivideStack()` gibt dann `"Player color unknown"` zurück.
- **[KI]** Bug-Check nach Regel 7: Die Prüfung in `getPlayerCards()` (Zeile 6) greift auf `playerCards` zu, bevor die Variable existiert, und die Klammer von `len()` sitzt falsch. Dadurch stürzt die Funktion bei **jeder** Farbe ab (neu als BUG-012, Kritisch, in Python bestätigt). BUG-002 bleibt offen und wurde ergänzt (`[] == False` greift nicht, Text statt drei Listen als Rückgabe). BUG-003 und BUG-011 aus `Bugs.md` entfernt, Zeilenangaben von BUG-005 bis BUG-008 nachgeführt.
- **[KI]** Hinweise: Der Kommentar „Nachfüllen nur auf leere Plätze …“ steht in `main.js` jetzt hinter dem `if`-Block in Zeile 60 statt bei der Prüfung. `main.js` prüft den Rückgabewert `false` von `createStartStack()` nicht. Das ist zurzeit egal, weil `main.js` die Farbe schon vorher prüft, die Prüfung ist dadurch aber doppelt (`main.js` Zeilen 11 bis 16 und `getDeck()`).
- **[KI]** Die Formatierung aus 3.31 enthält nur Leerzeichen- und Leerzeilen-Änderungen. Das wurde mit `git diff -w` geprüft.

### 3.33 `shuffle.py` korrigiert, `Bugs.md` nach Dringlichkeit sortiert – [Arun]/[KI], 14.11.2026

- **[Arun]** `backend/logic/shuffle.py`: Die Prüfung in `getPlayerCards()` steht jetzt nach der Schleife (`len(playerCards) == 0`), `getDivideStack()` löst bei unbekannter Farbe `ValueError("Player color unknown")` aus statt einen Text zurückzugeben, Import auf `from random import shuffle` reduziert, Tippfehler `shuffledCards` korrigiert. Bewusst beibehalten: `counter`-Variablen, ausführliche `elif`-Bedingungen, `return` nach `raise` (Zeile 40).
- **[KI]** Geprüft: `"blue"` ergibt 10/3/27 Karten, `"red"` und `None` lösen `ValueError` aus. BUG-012 und BUG-002 aus `Bugs.md` entfernt.
- **[Arun]** Hat gewünscht, dass `Bugs.md` immer nach Dringlichkeit sortiert ist. **[KI]** Regel in `AGENTS.md` (Abschnitt „Format von `Bugs.md`“) ergänzt und die offenen Bugs neu sortiert: BUG-006 (Fehlverhalten im Spiel), BUG-005 (Konsolenfehler), BUG-009 (Bedienbarkeit Startseite), BUG-008 (Layout), BUG-007 (zurzeit nicht auslösbar).
- **[KI]** Bug-Check nach Regel 7 vor dem Commit: keine neuen Bugs. `getDivideStack()` mit allen vier Spielerfarben (je 10/3/27 Karten) sowie mit `"red"`, `None` und `""` (`ValueError`) geprüft. Die offenen Einträge BUG-005 bis BUG-009 bestehen unverändert an denselben Zeilen, die Sortierung nach Dringlichkeit bleibt gültig.

### 3.34 BUG-005, BUG-006, BUG-007, BUG-008, BUG-009 und BUG-013 behoben – [Arun]/[KI], 17.11.2026

- **[Arun]** `main.js`, Klickhandler von `playArea`: `activeField.style.border = "2px solid black"` steht nicht mehr am Anfang des Handlers, sondern zusammen mit `activeField = null` nur noch in den beiden Zweigen, in denen die Karte wirklich gelegt wird (Zeilen 119/120 auf eine Karte, Zeilen 127/128 auf ein leeres Feld). Bei einem verbotenen Zug bleibt die Karte ausgewählt **und** grün umrandet. Vorher wurde der Rahmen schwarz, die Karte blieb aber ausgewählt (BUG-006 behoben).
- **[Arun]** `main.js`, Zeilen 106 bis 108: Ist keine Karte ausgewählt (`activeField === null`), endet der Handler sofort. `rules.getNumber()` und `rules.isAllowed()` werden nicht mehr mit `null` aufgerufen (BUG-005 behoben). Der `FIXME`-Kommentar dazu wurde entfernt.
- **[KI]** `create-stack.js`, `createDOMStack()`, Zeilen 300 bis 303: Der Container des Zehnerstapels rechnet jetzt mit der echten Bildgrösse 60 × 90 px plus 4 px Rahmen (`64` bzw. `94`) und mit 2,5 px Versatz pro Karte. Bei zehn Karten ist er 86,5 × 116,5 px gross statt 102 × 142 px (BUG-008 behoben). Diese Änderung stammt laut Änderungsprotokoll von einer KI-Sitzung. Der ursprüngliche Abschnitt 3.35 dazu wurde beim Nachführen von 3.34 versehentlich überschrieben und ist hier zusammengefasst.
- **[Arun]** `index.html`, Zeile 20: Das Label zeigt mit `for="roomIdInput"` jetzt auf die richtige ID des Eingabefelds. Ein Klick auf den Text setzt den Cursor ins Feld (BUG-009 behoben).
- **[KI]** Bug-Check nach Regel 7: BUG-005, BUG-006, BUG-008 und BUG-009 aus `Bugs.md` entfernt. **Neu BUG-013 (Kritisch):** Beim Entfernen der `FIXME`-Zeile in `main.js` wurde auch das schliessende `*/` des Kommentars ab Zeile 98 gelöscht. `main.js` hat dadurch einen Syntaxfehler und wird gar nicht geladen, die Spielseite bleibt leer (mit `node --check` bestätigt). Die Fixes von BUG-005 und BUG-006 wirken erst, wenn BUG-013 behoben ist. BUG-007 bleibt offen (Arun behebt ihn als Nächstes), Zeilenangabe nachgeführt.
- **[Arun]** `main.js`, Zeile 102: Das schliessende `*/` des JSDoc-Kommentars wieder eingefügt. `main.js` lädt wieder (BUG-013 behoben, mit `node --check` geprüft).
- **[Arun]** `rules.js`, `isAllowed()`, Zeilen 47 bis 49: Ist `targetCard` `null` und die Karte keine 1, gibt die Funktion jetzt `false` zurück, statt `getColor(null)` aufzurufen und abzustürzen (BUG-007 behoben). Mit einer echten Zielkarte verhält sie sich wie vorher.
- **[KI]** Bug-Check nach Regel 7 vor dem Commit: keine neuen Bugs. Alle Änderungen in `main.js`, `rules.js`, `create-stack.js` und `index.html` geprüft, alle JS-Dateien mit `node --check` ohne Fehler. BUG-013 und BUG-007 aus `Bugs.md` entfernt, es gibt keine offenen Bugs mehr. Punkt 31 in Kapitel 4 ist damit ebenfalls erledigt.
- **[KI]** Hinweise: Der Rückgabetext `"Select a card ..."` in Zeile 107 wird nirgends angezeigt, weil der Browser den Rückgabewert eines Event-Listeners ignoriert. In `create-stack.js` sind die Kommentare der Zeilen 300, 302 und 303 entfernt worden, und die neuen bzw. geänderten Zeilen in `main.js`, `rules.js` und `create-stack.js` haben noch keine Kommentare.

### 3.35 Spielregeln im Backend: `backend/logic/rules.py` – [Arun], dokumentiert von [KI], 17.11.2026

- **[Arun]** Die bisher leere Datei `backend/logic/rules.py` enthält jetzt die Spielregeln aus `frontend/rules.js` in Python:
  - `getId(card)`: entfernt das Präfix `image` (5 Zeichen) und gibt die Karten-ID zurück.
  - `getNumber(card, CARDS)` und `getColor(card, CARDS)`: suchen die Karte in `CARDS` und geben Wert bzw. Farbe zurück. Bei einer unbekannten Karte kommt `0` bzw. `""` zurück.
  - `isAllowed(targetCard, currentCard, CARDS)`: Ohne Zielkarte (`None`) ist nur eine 1 erlaubt. Sonst muss die Farbe gleich und der Wert genau um 1 höher sein. Das Verhalten von BUG-007 ist hier von Anfang an berücksichtigt: Bei `None` wird `getColor()` nie mit `None` aufgerufen.
  - Anders als in `rules.js` wird `CARDS` als Parameter übergeben statt importiert.
- **[KI]** Bug-Check nach Regel 7 vor dem Commit: keine neuen Bugs. Mit der echten Kartenliste aus `backend/cards.py` geprüft: `None` + 1 → `True`, `None` + 2 → `False`, 1 → 2 gleiche Farbe → `True`, andere Farbe → `False`, 2 → 1 → `False`, unbekannte Karten → `False`.
- **[KI]** Hinweise: `rules.py` wird noch von keiner Datei verwendet. Die Funktionen erwarten Karten-IDs **mit** Präfix `image` (wie die DOM-IDs im Frontend). Eine ID ohne Präfix wie `"blue-blue-1"` wird falsch gekürzt und ergibt still `False`. Mit `currentCard = None` entsteht ein `TypeError`, wie im Frontend. Darauf muss geachtet werden, sobald das Backend Züge vom Frontend entgegennimmt. Die Variable `id` überdeckt die eingebaute Python-Funktion `id()`, das ist aber kein Fehler.

### 3.36 Virtuelle Python-Umgebung und `.gitignore` erweitert – [KI], 17.11.2026

- **[Arun]** Hat ein venv für das Projekt und eine `.gitignore` gewünscht, die alles ignoriert, was nicht ins Repo gehört.
- **[KI]** Virtuelle Umgebung `.venv/` im Projektordner mit `python3 -m venv .venv` erstellt (Python 3.14.8). Aktivieren mit `source .venv/bin/activate`, danach z. B. `pip install pytest`. Installiert ist bisher nur `pytest` (siehe unten).
- **[KI]** `.gitignore` oben um eigene Abschnitte ergänzt, die ursprüngliche Node-Vorlage steht unverändert darunter. Neu ignoriert: `.venv/`, `venv/`, `env/`, `__pycache__/`, `*.py[cod]`, `.pytest_cache/`, `.coverage`, `htmlcov/`, `.DS_Store`, `._*`, `.vscode/`, `.idea/`, `*.swp` und `.claude/settings.local.json`. `.env` war schon durch die Node-Vorlage abgedeckt. Mit `git check-ignore` geprüft.
- **[KI]** Die fünf `.DS_Store`-Dateien (`.DS_Store`, `backend/`, `frontend/`, `frontend/images/`, `frontend/images/back/`) waren schon im Repo und wären trotz `.gitignore` weiter verfolgt worden. Auf Wunsch von Arun mit `git rm --cached` aus dem Repo entfernt. Die Dateien auf dem Mac bleiben erhalten, sie werden nur nicht mehr gepusht.
- **[KI]** Auf Wunsch von Arun `pytest` 9.2.0 ins venv installiert (für die geplanten Tests von `rules.py`).

### 3.37 Technische Dokumentation und Regel 8 in `AGENTS.md` – [KI], 17.11.2026

- **[Arun]** Hat eine technische Doku gewünscht, getrennt vom Arbeitsprotokoll, die nur bei Änderungen am Aufbau nachgeführt wird.
- **[KI]** Neue Datei `Dokumentation/Technische-Doku.md` mit dem aktuellen Stand: Überblick, Starten, Projektstruktur, Ablauf (mit Diagramm), Datenmodell und DOM-IDs, alle Frontend- und Backend-Funktionen, Interaktion beim Auswählen und Legen, Spielregeln, Layout, bekannte Einschränkungen, Pflege der Datei. Geschrieben aus dem aktuellen Code, nicht aus dem Protokoll.
- **[KI]** `AGENTS.md` um Regel 8 „Technische Dokumentation“ ergänzt: Beim Dokumentieren wird nach dem Bug Check geprüft, ob sich der Aufbau geändert hat (Dateien, Funktionen, Parameter, Ablauf, Datenmodell, Regeln). Nur dann wird die technische Doku angepasst, ohne Zeilennummern und ohne [KI]/[Arun] pro Abschnitt.

### 3.38 Bestehenden Code nach Regel 6 kommentiert – [KI], 19.11.2026

- **[KI]** Datei-Docstrings in allen vier Python-Dateien sowie fehlende Funktions-Docstrings in `rules.py` und `winner.py` ergänzt. Sonderfälle bei unbekannten Spielerfarben und die Zählung nach Vorderseitenfarbe erklärt.
- **[KI]** Kurze `//`-Kommentare vor JavaScript-Funktionen und bislang nicht entsprechend beschriebenen Ereignisbehandlungen ergänzt. Vorhandene Kommentare beibehalten, da Regel 6 ausschliesslich Ergänzungen erlaubt.
- **[KI]** Dateiübersichten in den drei HTML-Dateien ergänzt; `rules.html` bleibt ein Platzhalter ohne sichtbaren Inhalt. Die Formular-Rasterregel in `login.css` erklärt.
- **[KI]** Per Vergleich geprüft: Alle bisherigen Codezeilen, Leerzeilen und ihre Reihenfolge bleiben unverändert; hinzugekommen sind nur Kommentare und Docstrings. Python-Syntaxbäume ohne Docstrings stimmen vor und nach der Bearbeitung überein. `git diff --check` ohne Befund. Keine Änderung am Aufbau, daher keine Anpassung der technischen Dokumentation.

### 3.39 Punktezählung, Karten-IDs ohne Präfix und Regel 6 in `AGENTS.md` – [Arun]/[KI], 19.11.2026

- **[Arun]** Neue Datei `backend/logic/winner.py` mit `countCards(laidCards, playerColors, tenStack)`:
  - Zählt pro Spielerfarbe die gelegten Karten in `laidCards`. Gezählt wird nach Besitzer (`owner`), nicht nach Vorderseitenfarbe.
  - Zieht pro Karte, die noch im Zehnerstapel liegt, 2 Punkte ab. `tenStack` ist ein Dictionary „Farbe → Anzahl Karten im Zehnerstapel“.
  - Gibt ein Dictionary mit den Punkten pro Farbe zurück, dazu den Schlüssel `"winner"` mit einer Liste der Farben mit den meisten Punkten (bei Gleichstand mehrere).
- **[Arun]** `backend/cards.py`: Neue Variablen `laidCards` (Liste), `playerColors` (Liste) und `tenStack` (Dictionary) als Daten für die Punktezählung.
- **[Arun]** `backend/logic/rules.py`: `getId()` schneidet das Präfix `image` nicht mehr ab und gibt die Karten-ID unverändert zurück. Das Backend arbeitet damit mit IDs wie in `cards.py` (`"blue-blue-1"`). Damit ist BUG-014 erledigt.
- **[KI]** `AGENTS.md` Regel 6 neu gefasst: Kommentieren von bestehendem Code nur auf Aufforderung und klar getrennt von Regel 2. Kein Kommentar pro Zeile, sondern wie in einer Firma: kurzer Kommentar am Dateianfang, vor jeder Klasse und vor jeder Funktion, in Python als Docstring. Am Code wird nichts geändert. Mit Beispielen in JavaScript und Python.
- **[KI]** Bug-Check nach Regel 7: BUG-014 ist gefixt und aus `Bugs.md` entfernt. Neu: BUG-015 (`KeyError` in `countCards()`, wenn eine Farbe in `tenStack` fehlt) und BUG-016 (`ValueError` ohne Spielerfarben). Mit der echten Kartenliste geprüft: `isAllowed(None, "blue-blue-1")` → `True`, Blau 1 → Blau 2 → `True`, andere Farbe → `False`. `countCards()` mit 5 blauen und 3 pinken Karten und `{"blue": 1, "pink": 0}` → 3 : 3, beide Gewinner.
- **[KI]** Hinweis: Der Docstring von `getId()` sagt noch, dass das Präfix `image` entfernt wird, und der Docstring von `countCards()` erwähnt den Abzug für den Zehnerstapel und den Schlüssel `"winner"` nicht. Beides beschreibt nicht mehr den aktuellen Code.
- **[KI]** Technische Doku nachgeführt (Projektstruktur, Karten-IDs, Spielregeln, Backend-Module).

### 3.40 Eingaben von `countCards()` prüfen, BUG-015 und BUG-016 behoben – [Arun]/[KI], 19.11.2026

- **[Arun]** `backend/logic/winner.py`: `countCards()` prüft vor dem Zählen zwei Dinge:
  - Ist `playerColors` leer, kommt `ValueError("No player colors")`. Behebt BUG-016.
  - Fehlt eine Farbe aus `playerColors` in `tenStack`, kommt `ValueError("Ten stack missing for <Farbe>")`. Behebt BUG-015. Zusätzliche Farben in `tenStack` stören nicht, weil nur die Farben aus `playerColors` gelesen werden.
- **[KI]** Erklärt: `raise` beendet die Funktion sofort, ein `return` danach braucht es nicht. Das `return` nach `raise` in `getDivideStack()` (`shuffle.py`) wird deshalb nie erreicht. Es ist harmlos, aber überflüssig.
- **[KI]** Bug-Check nach Regel 7: BUG-015 und BUG-016 sind gefixt und aus `Bugs.md` entfernt, keine neuen Bugs. Geprüft: `{}` → `ValueError` „Ten stack missing for blue“, `{"blue": 2}` → „… for pink“, `countCards([], [], {})` → „No player colors“, eine zusätzliche Farbe in `tenStack` wird ignoriert. Die normale Zählung ist unverändert (3 : 3, beide Gewinner bzw. 5 : 1, Blau gewinnt).

### 3.41 FastAPI als Abhängigkeit – [KI], 20.11.2026

- Auf Wunsch von Arun `fastapi` in `requirements.txt` ergänzt. Pydantic wird als Abhängigkeit von FastAPI mitinstalliert und dient zur Prüfung der Anfrage-Modelle.
- FastAPI ist vorerst ohne feste Versionsnummer eingetragen; die bisherigen Versionsbindungen bleiben bestehen. Die Pakete wurden bei dieser Änderung nicht installiert.

### 3.42 Erste Server-Routen mit FastAPI, Räume in `memory.py` – [Arun]/[KI], 20.11.2026

- **[Arun]** `backend/cards.py` in `backend/memory.py` umbenannt. `CARDS` bleibt gleich. Die einzelnen Variablen `laidCards`, `playerColors` und `tenStack` sind ersetzt durch das Dictionary `rooms` (RoomID → `playerColors`, `laidCards`, `tenStack` pro Raum). Neu ist die Liste `acceptedColors` mit den vier erlaubten Farben.
- **[Arun]** `backend/connection/model.py`: Pydantic-Modelle `roomRequestBase` (`color`) und `joinRoomRequest` (`color`, `roomId`) für den JSON-Body.
- **[Arun]** `backend/connection/routes.py`: FastAPI-App mit `POST /joinRoom` (`join_room()`) und `POST /createRoom` (`create_room()`). Beitreten prüft Eingabe, Raum und Farbe und antwortet mit 400, 404 oder 409; Erstellen erzeugt eine neue RoomID und legt den Raum mit 10 Karten im Ligretto-Stapel an.
- **[Arun]** `backend/logic/createRoomId.py`: `createRoomID()` erzeugt eine 6-stellige RoomID mit `secrets`.
- **[Arun]** `frontend/login.js`: Beide Buttons schicken Farbe und RoomID per `fetch` an `http://localhost:8000/joinRoom` bzw. `/createRoom`.
- **[Arun]** `backend/test/connection.py` angelegt (noch leer).
- **[KI]** Neuen Code nach Regel 6 kommentiert: Datei-Docstrings, Docstrings für die Modelle, Routen und `createRoomID()`, Kommentare zu `acceptedColors`, `rooms` und den beiden `fetch`-Aufrufen. Der veraltete Datei-Docstring von `memory.py` und der Dateikommentar von `login.js` („Noch ohne Backend“) wurden an den neuen Stand angepasst. Am Code selbst wurde nichts geändert.
- **[KI]** Bug-Check nach Regel 7: sechs neue Bugs (BUG-017 bis BUG-021, BUG-023) und ein Verdacht (BUG-022) in `Bugs.md`. Die wichtigsten: Der Browser blockiert die Anfragen, weil CORS fehlt und Frontend und Backend beide Port 8000 wollen (BUG-017); das Frontend wartet nicht auf die Antwort (BUG-018); die beim Erstellen erzeugte RoomID kommt nie im Frontend an (BUG-019). Geprüft mit einem lokal gestarteten Server auf Port 8765.
- **[KI]** Technische Doku nachgeführt (Überblick, Projekt starten, Projektstruktur, Ablauf, `login.js`, Backend-Module, Einschränkungen).

## 4. Beobachtungen zum aktuellen Stand – [KI]

Diese Punkte hat die KI beim Durchsehen bemerkt. Es wurde **nichts** am Code geändert, gemäss `AGENTS.md`.

1. In `login.js` wird `roomId` gesetzt, aber nirgends weiterverwendet. `joinRoom()` bekommt die RoomID nicht übergeben.
2. `game.html` bindet nur `styles.css` ein, nicht `game.css`. Die Regeln in `game.css` greifen deshalb noch nicht.
3. In `game.css` ist `grid-template-columns: 4;` bzw. `grid-template-rows: 4;` kein gültiger Wert. Gemeint ist vermutlich `repeat(4, 1fr)`.
4. `createStartStack()` gibt `openCards` und `tenStack` noch nicht zurück und verteilt nur das gelbe Deck. `blueCards`, `greenCards` und `pinkCards` werden noch nicht verwendet.
5. `create-stack.js` wird noch von keiner Seite eingebunden bzw. importiert.
6. `.DS_Store`-Dateien (macOS) liegen im Projekt. Sie gehören in die `.gitignore`.
7. Die Bilddateien enden auf `.PNG` (Grossbuchstaben). Auf Servern, die Gross- und Kleinschreibung unterscheiden, muss der Pfad im Code genau so geschrieben werden (in `CARDS` ist das so umgesetzt).
8. `create-stack.js`, `createPlayeArea()`: `newDiv.classList.add = "playAreaField"` überschreibt die Methode `add` mit einem String, statt die Klasse zu setzen. Richtig wäre `newDiv.classList.add("playAreaField")`. Ausserdem ist der Funktionsname vermutlich ein Tippfehler (`createPlayArea`).
9. `game.css`, am Ende der `main`-Regel steht ein verirrtes `^` nach `gap: 8px;`. Das kann die Regel ungültig machen.
10. `game.css`: Die `main`-Regel setzt `grid-template-rows`, aber kein `display: grid`. Ob das aus `styles.css` kommt, ist ungeprüft; sonst wirkt sie nicht. Zudem sind `#playArea { grid-area: 2 / 2; }` und die Regeln für `body` doppelt bzw. überschneiden sich mit `styles.css`.
11. **Behoben am 17.11.2026 [KI]:** Die Container-Masse des Zehnerstapels berücksichtigen jetzt 60 × 90 px Bildgrösse, 4 px Rahmen und 2,5 px Versatz je Karte (siehe 3.34).
12. Die Stapelkarten haben `width: 60px` / `height: 90px` zuzüglich 2 px Rahmen. Je nach `box-sizing` sind sie 4 px grösser als angegeben.

13. `game.html`: `type="mdoule"` ist ein Tippfehler. Der Browser lädt das Script deshalb nicht als Modul. Das ist hier harmlos, weil `main.js` die Datei ohnehin importiert. Das Tag kann auch ganz weg.
14. `rules.js`: `import CARDS from ...` ist ein Default-Import. `create-stack.js` hat keinen `export default`, das gibt einen Fehler, sobald `rules.js` geladen wird. Gemeint ist vermutlich `import { CARDS } from ...` (falls `CARDS` exportiert wird).
15. `main.js`, Klick auf `#playArea`: Ist keine Karte gewählt (`activeField === null`), liefert `activeField.style` einen Fehler. Es fehlt eine Prüfung wie `if (!activeField) return;`.
16. `moveCardsToPlayArea`: `const nextCard = previousStack` ist unbenutzt. Danach wird `nextCard` im `if`-Block neu deklariert. Zudem ist `nextCard` `null`, wenn die letzte Zehnerstapel-Karte gelegt wird, und `nextCard.style` löst dann einen Fehler aus.
17. `.tenStackImage` und die Stapel-Container haben noch keine Regeln dafür, dass nur die oberste Karte klickbar ist. Nach `position: static` verliert die Karte ihr absolutes Layout. Ob sie im Spielfeld richtig sitzt, ist ungeprüft.
18. Die Klick-Handler gibt es nur für den unteren Spieler (`...Bottom`). Die Handkarten (`handCardsBottomClosed`) sind noch nicht klickbar.
19. In `main.js` steht ein `console.log(newLocation)` zum Debuggen, das später entfernt werden sollte.
20. Es wird noch nicht geprüft, ob der Zug nach den Ligretto-Regeln erlaubt ist (gleiche Farbe, Wert +1). Jede Karte lässt sich auf jedes Feld legen, auch auf belegte.
21. `main.js` (neuer Block): Die Karte wird zuerst mit `splice` aus dem Array genommen und in `openCards` gepusht. Danach ruft `moveCardsToPlayArea` über `deleteFromStack` sie erneut aus `openCards` heraus und legt sie in `laidCards`. Das `//todo` in `move-cards.js` ist damit noch **nicht** gelöst: Die Karte ist am Ende in `laidCards` und nicht in `openCards`.
22. `rules.js`, `isAllowed`: `newLocation` ist nirgends definiert (kein Parameter). Beim Aufruf gibt es einen `ReferenceError`. Gemeint ist vermutlich `lastCard`.
23. `rules.js`, `isAllowed`: Die Bedingung `color !== color && value + 1` liefert `false`. Nach den Ligretto-Regeln wäre ein Zug aber **erlaubt**, wenn die Farbe **gleich** ist und der Wert um 1 **grösser** (also `true`). Die Rückgabewerte wirken vertauscht bzw. die Farbprüfung invertiert.
24. `rules.js`: `import CARDS from ...` ist weiterhin ein Default-Import, `CARDS` ist jetzt aber ein benannter Export. Richtig wäre `import { CARDS } from ...` (siehe auch Punkt 14). `CARDS` wird in `rules.js` ausserdem nicht verwendet.
25. `main.js`: Die `for`-Schleife ist mit 11 statt 12 Leerzeichen eingerückt und es fehlen Semikolons nach den `console.log`-Aufrufen. Das ist nur Stil, aber uneinheitlich.
26. `main.js`: Die `console.log`-Aufrufe sind Debug-Ausgaben und sollten vor dem Abschluss entfernt werden (wie Punkt 19).

27. `login.js`: Bei „Erstelle einen neuen Room“ wird `playerColor` nicht gespeichert, auf `game.html` ist die Farbe dann `null`.
28. `main.js`: `#joinOtherRoom` löscht Einträge aus `localStorage`, gespeichert wurden sie aber in `sessionStorage`.
29. `main.js`: `console.log("Not allowed")` stand nach dem `return` und wurde gerade dann ausgegeben, wenn der Zug erlaubt war. **[Arun]** hat die Zeile inzwischen entfernt (erledigt).

30. `main.js`: Eine Zehnerstapel-Karte wird mit `appendChild` in die angeklickte offene Karte gehängt. Ist das ein `img`, wird ein Kind-Element darin nicht angezeigt. Nur ein Klick auf den Rand des `div` funktioniert (ungeprüft). Ausserdem bleibt die überdeckte offene Karte in `openCards`, das Array wird also jedes Mal grösser.
31. `rules.js`, `isAllowed`: Ist `targetCard` `null` und die Karte keine 1, ruft der `else if`-Zweig `getColor(null)` auf und erzeugt einen Fehler. `main.js` übergibt aktuell nie `null`, deshalb fällt das noch nicht auf.
32. `main.js`: Wird auf ein leeres Feld eine Karte gelegt, die keine 1 ist, endet die Funktion mit `return`, bevor `activeField = null` gesetzt wird. Der Rahmen ist dann schwarz, die Karte aber noch ausgewählt.

33. `shuffle.py`: `from .. cards import CARDS` ist ein relativer Import. Er funktioniert nur, wenn die Datei als Teil des Pakets geladen wird (z. B. `python3 -m backend.logic.shuffle` aus dem Projektordner). Bei `python3 backend/logic/shuffle.py` kommt `ImportError: attempted relative import with no known parent package`.
34. `shuffle.py`: `from random import *` holt alle Namen aus `random` in die Datei. Gebraucht wird nur `shuffle`, `from random import shuffle` wäre eindeutiger.
35. `shuffle.py`: Die Funktionsparameter heissen ebenfalls `CARDS` und überdecken die importierte Liste. Das ist kein Fehler, aber der Import wird dadurch innerhalb der Funktionen nie benutzt.
36. `shuffle.py`, `getPlayerCards`: Der `counter` ist unnötig. `i` ist bereits die Karte, `i["owner"]` reicht statt `CARDS[counter]["owner"]`. Auch in `getDivideStack` ist `counter >= 10 and` doppelt, weil der erste Zweig das schon ausschliesst. Der Tippfehler `shuffeldCards` ist nur kosmetisch.
37. `.gitignore`: Python-Einträge wie `__pycache__/` und `.venv/` fehlen, die Datei ist die Node-Vorlage. Ausserdem ist `.DS_Store` wieder geändert (siehe Punkt 6).

Erledigt seit der letzten Version: Punkte 6 und 37 (`.gitignore` für `.DS_Store` und Python, siehe 3.36), Punkte 15 (Klick ohne Auswahl), 31 (`isAllowed()` mit `null`) und 32 (Auswahl bei verbotenem Zug), siehe 3.34; `openCards.append[i]` in `shuffle.py` (siehe 3.21), Punkte 33 und 35 (Import in `shuffle.py` entfernt, siehe 3.23).

Offene Bugs werden seit dem 13.11.2026 zusätzlich in `Dokumentation/Bugs.md` geführt (Regel 7).

Erledigt in früheren Versionen: Punkte 14, 22, 23, 24 (Import und Logik in `rules.js`), 20 (Regelprüfung beim Ablegen), 21 (Karte bleibt in `openCards`), 27 (Farbe bei „Room erstellen“), 28 (`sessionStorage` beim Zurückgehen). Früher schon: `login.js` wird nicht mehr doppelt eingebunden.

---

## 5. Änderungsprotokoll

| Datum | Wer | Was |
|---|---|---|
| 20.11.2026 | [KI] | Neuen Code nach Regel 6 kommentiert, Bug-Check mit BUG-017 bis BUG-023, technische Doku nachgeführt (siehe 3.42). |
| 20.11.2026 | [Arun] | FastAPI-Routen `/joinRoom` und `/createRoom`, Modelle, `createRoomID()`, `cards.py` → `memory.py` mit `rooms` und `acceptedColors`, `fetch` in `login.js` (siehe 3.42). |
| 20.11.2026 | [KI] | FastAPI in `requirements.txt` ergänzt; Pydantic wird mitinstalliert (siehe 3.41). |
| 19.11.2026 | [Arun] | `countCards()` prüft leere `playerColors` und fehlende Farben in `tenStack`, BUG-015 und BUG-016 behoben (siehe 3.40). |
| 19.11.2026 | [Arun] | `backend/logic/winner.py` mit `countCards()` für Punkte und Gewinner, neue Variablen in `cards.py`, `getId()` in `rules.py` arbeitet ohne Präfix `image` (siehe 3.39). |
| 19.11.2026 | [KI] | `AGENTS.md` Regel 6 „Bestehenden Code kommentieren“ neu gefasst, Bug-Check mit BUG-015 und BUG-016, technische Doku nachgeführt (siehe 3.39). |
| 19.11.2026 | [KI] | Bestehenden Code nach Regel 6 um Dateiübersichten, Python-Docstrings und JavaScript-Funktionskommentare ergänzt; Code und Formatierung unverändert (siehe 3.38). |
| 17.11.2026 | [KI] | Auf Wunsch von Arun: `Dokumentation/Technische-Doku.md` erstellt, Regel 8 „Technische Dokumentation“ in `AGENTS.md` ergänzt (siehe 3.37). |
| 17.11.2026 | [KI] | Auf Wunsch von Arun: venv `.venv/` erstellt, `.gitignore` um Python, venv, macOS, Editoren und lokale Claude-Einstellungen ergänzt, getrackte `.DS_Store`-Dateien aus dem Repo entfernt, `pytest` ins venv installiert (siehe 3.36). |
| 17.11.2026 | [Arun] | `backend/logic/rules.py`: `getId()`, `getNumber()`, `getColor()` und `isAllowed()` als Python-Version der Spielregeln (siehe 3.35). |
| 17.11.2026 | [KI] | Bug-Check nach Regel 7 vor dem Commit: keine neuen Bugs, `rules.py` mit echter Kartenliste getestet, Projektstruktur nachgeführt (siehe 3.35). |
| 17.11.2026 | [Arun] | `main.js`: schliessendes `*/` wieder eingefügt (BUG-013 behoben); `rules.js`: `isAllowed()` gibt bei `null` und Nicht-1 `false` zurück (BUG-007 behoben) (siehe 3.34). |
| 17.11.2026 | [KI] | Bug-Check nach Regel 7 vor dem Commit: keine neuen Bugs, BUG-007 und BUG-013 aus `Bugs.md` entfernt, keine offenen Bugs mehr (siehe 3.34). |
| 17.11.2026 | [KI] | Containergrösse des Zehnerstapels an Bildgrösse und Versatz angepasst (BUG-008 behoben; siehe 3.34). |
| 17.11.2026 | [Arun] | `main.js`: Auswahl nur nach erfolgreichem Zug zurücksetzen (BUG-006), Abbruch ohne ausgewählte Karte (BUG-005); `index.html`: Label-`for` korrigiert (BUG-009) (siehe 3.34). |
| 17.11.2026 | [KI] | Bug-Check nach Regel 7: BUG-005, BUG-006, BUG-008, BUG-009 aus `Bugs.md` entfernt, BUG-013 (Kritisch, Syntaxfehler in `main.js`) neu, BUG-007 nachgeführt; dabei versehentlich überschriebenen Abschnitt 3.35 (BUG-008) in 3.34 zusammengefasst (siehe 3.34). |
| 14.11.2026 | [Arun] | `shuffle.py`: Farbprüfung nach der Schleife, `ValueError` statt Text, Import und Tippfehler korrigiert (BUG-012, BUG-002 behoben; siehe 3.33). |
| 14.11.2026 | [KI] | `Bugs.md` bereinigt und nach Dringlichkeit sortiert; Sortierregel in `AGENTS.md` ergänzt (siehe 3.33). |
| 14.11.2026 | [Arun] | `main.js`: belegte offene Karte trotz Zehnerstapel-Auswahl wählbar (BUG-011 behoben); `create-stack.js`: Farbprüfung in `getDeck()` (BUG-003 behoben); `shuffle.py`: Prüfung auf unbekannte Farbe begonnen (siehe 3.32). |
| 14.11.2026 | [KI] | Bug-Check nach Regel 7: BUG-003 und BUG-011 entfernt, BUG-012 (Kritisch) neu, BUG-002 ergänzt, Zeilenangaben nachgeführt (siehe 3.32). |
| 14.11.2026 | [KI] | Quellcode ausschliesslich formatiert: Einrückungen, Leerzeichen und Zeilenumbrüche vereinheitlicht; Syntax- und Inhaltsvergleiche gegen den vorherigen Arbeitsstand bestanden (siehe 3.31). |
| 14.11.2026 | [Arun] | `move-cards.js`: Argumentreihenfolge beim Aufruf von `getOldLocation()` korrigiert, BUG-010 behoben (siehe 3.30). |
| 14.11.2026 | [KI] | Veraltete Kommentare in `main.js` und `move-cards.js` korrigiert; Bug-Check: BUG-010 aus `Bugs.md` entfernt (siehe 3.30). |
| 14.11.2026 | [Arun] | `main.js`: Zehnerstapel-Karte nur noch auf leere offene Plätze legen; `move-cards.js`: `getOldLocation()` und Zielprüfung in `deleteFromStack()` ergänzt (siehe 3.29). |
| 14.11.2026 | [KI] | Bug-Check nach Regel 7: BUG-004 als behoben entfernt, BUG-010 und BUG-011 neu eingetragen, Zeilenangaben in `Bugs.md` nachgeführt (siehe 3.29). |
| 14.11.2026 | [KI] | Leere Suchschleife in main.js auskommentiert; beim Nachfüllen moveCardsToPlayArea() direkt aufrufen und das bisherige Zielbild entfernen (siehe 3.28). |
| 14.11.2026 | [KI] | Irrtümliche Rücknahme der Regeln korrigiert; offene Karten über ihren div-Container als Ziel ersetzen, damit das neue Bild sichtbar bleibt. Listenverwaltung unverändert; siehe 3.27. |
| 14.11.2026 | [KI] | Karten-Klickhandler auf den Ablauf aus 774ec17 zurückgeführt: wieder ohne Farb- und Zahlenprüfung ablegen; Historienvergleich als 3.26 dokumentiert. |
| 14.11.2026 | [KI] | Auf Wunsch von Arun die neue Herkunfts- und Zielprüfung in move-cards.js zurückgenommen; deleteFromStack() legt Karten wieder immer in laidCards ab (siehe 3.25). |
| 14.11.2026 | [KI] | Auf Wunsch von Arun ausschliesslich die Ergänzung `updateStacks` samt Bedingung, Parameter-Kommentar und Argument `false` zurückgenommen; ursprünglicher unbedingter Aufruf von `deleteFromStack()` wiederhergestellt. Das frühere Problem aus Punkt 21 besteht dadurch erneut (siehe 3.24). |
| 13.11.2026 | [Arun] | `main.js`: Farbe am Anfang prüfen, sonst Meldung, zurück zu `index.html` und Abbruch; `shuffle.py`: Import `from .. cards import CARDS` entfernt (noch nicht committet) |
| 13.11.2026 | [KI] | Bug-Check nach Regel 7: BUG-001 als behoben entfernt, BUG-003 auf „Klein“ herabgestuft, Zeilenangaben in `Bugs.md` nachgeführt; Änderungen von Arun als 3.23 dokumentiert |
| 13.11.2026 | [KI] | Auf Wunsch von Arun alle Kommentare geprüft, veraltete und falsche Kommentare in `login.js`, `move-cards.js`, `create-stack.js` und `game.html` korrigiert (nur Kommentare, Zeilenzahl gleich); als 3.22 dokumentiert |
| 13.11.2026 | [Arun] | Backend-Ordner `logic/` und `connection/` angelegt, `rules.py` (leer) und `shuffle.py` (Spielerkarten filtern, mischen, auf 10/3/27 verteilen) geschrieben, Fehler `openCards.append[i]` behoben (noch nicht committet) |
| 13.11.2026 | [KI] | Änderungen von Arun als 3.21 dokumentiert, Projektstruktur ergänzt, Auffälligkeiten 33 bis 37 notiert (am Code nichts geändert) |
| 13.11.2026 | [KI] | Codex: Auf Wunsch von Arun Kommentare in `backend/logic/shuffle.py` durch kurze Funktions-Docstrings ersetzt; Logik unverändert, als 3.20 dokumentiert. |
| 13.11.2026 | [KI] | Codex: `backend/logic/shuffle.py` auf Wunsch von Arun knapp kommentiert, ausführbaren Code unverändert gelassen und bestehenden Fehler bei `openCards.append[i]` erklärt; als 3.19 dokumentiert. |
| 13.11.2026 | [KI] | Codex: Auf Wunsch von Arun alle 160 Karten als kommentierte Python-Liste aus Dictionaries in `backend/cards.py` eingefügt; Eigenschaften und Reihenfolge geprüft; als 3.18 dokumentiert. |
| 08.11.2026 | [Arun] | `rules.js`: `getNumber`, `getColor`, `isAllowed` neu; `main.js`: Regelprüfung beim Ablegen, `sessionStorage` beim Zurückgehen, Karte bleibt in `openCards`; `move-cards.js`: Parameter `updateStacks`; `login.js`: Farbe auch bei „Room erstellen“ speichern; `AGENTS.md`: Regeln 5 und 6 (noch nicht committet) |
| 08.11.2026 | [KI] | Änderungen von Arun als 3.17 dokumentiert, erledigte Punkte vermerkt, Auffälligkeiten 30 bis 32 notiert (am Code nichts geändert) |
| 08.11.2026 | [KI] | Mit Freigabe von Arun: Parameter `updateStacks` und Aufruf mit `false` eingebaut, damit Zehnerstapel-Karten beim Verschieben zu offenen Karten in `openCards` bleiben; als 3.17 dokumentiert. Punkt 21 ist damit behoben. |
| 08.11.2026 | [KI] | Auf Wunsch von Arun: ganzer Code (JS, HTML, CSS) kommentiert, danach auf Wunsch von Arun auf Funktions-Kommentare (JSDoc) reduziert; Code nicht verändert; als 3.16 dokumentiert |
| 26.10.2026 | [Arun] | `create-stack.js`: `CARDS` exportiert; `move-cards.js`: `laidCards` exportiert, ID-Vergleich mit Präfix `image`, `//todo`; `main.js`: Zehnerstapel-Karte auf offene Karten verschieben; `rules.js`: `isAllowed` begonnen (noch nicht committet) |
| 26.10.2026 | [KI] | Änderungen von Arun als 3.15 dokumentiert, Auffälligkeiten 21 bis 26 notiert (am Code nichts geändert) |
| 21.10.2026 | [Arun] | `game.html`: vier Unter-Container je Spielerbereich; `create-stack.js`: Karten in die neuen Container; neue Datei `move-cards.js` (Karte ablegen, aus Stapel entfernen, Auswahl-Rahmen); `main.js`: Klick-Handler für Auswahl und Ablegen; `game.css`: `.openCards`-Grid; `rules.js`: Import (noch nicht committet) |
| 21.10.2026 | [KI] | Änderungen von Arun als 3.14 dokumentiert, Auffälligkeiten 13 bis 20 notiert (am Code nichts geändert) |
| 17.10.2026 | [Arun] | `index.html`: Farbwerte korrigiert; `create-stack.js`: Kartengrösse 60 × 90 px mit Rahmen, neue Funktion `createPlayeArea()`; `main.js`: Aufruf; `game.css`: `grid-area`, `body`, `main` (noch nicht committet) |
| 17.10.2026 | [KI] | Änderungen von Arun als 3.13 dokumentiert, Abweichungen in 3.11/3.12 vermerkt, Auffälligkeiten 8 bis 12 notiert (am Code nichts geändert) |
| 17.10.2026 | [KI] | Auf Wunsch von Arun: Alle Zehnerstapel-Karten mit 2 px Versatz darstellen, oberste Karte über zIndex festlegen, Zeigereingaben auf diese beschränken und Änderung dokumentieren. |
| 16.10.2026 | [KI] | Auf Wunsch von Arun: Handkarten-Rückseiten auf sichtbar 80 × 120 px vereinheitlicht, blaue Rückseite passend dimensioniert und im Container zentriert; bisherigen Code auskommentiert und Änderung dokumentiert. |
| 13.10.2026 | [Arun] | Initial commit: `README.md`, `.gitignore` |
| 13.10.2026 | [Arun] | Frontend: Startseite, Styles, JS-Logik, Kartenbilder, Platzhalter |
| 13.10.2026 | [KI] | `Dokumentation/Dokumentation.md`, `AGENTS.md` erstellt, `README.md` ausgebaut |
| 13.10.2026 | [Arun] | Startseiten-Logik nach `login.js` verschoben, `main.js` für die Spielseite |
| 13.10.2026 | [Arun] | Spielseite: `game.html`, `styles.css`, `game.css` |
| 13.10.2026 | [Arun] | `create-stack.js`: `getDeck()` und `createStartStack()` (Logik) |
| 13.10.2026 | [KI] | `create-stack.js`: Array `CARDS` mit 160 Karten erzeugt, Syntax-Hilfe; Dokumentation nachgeführt |
| 14.10.2026 | [KI] | `create-stack.js`: Feld `alt` bei allen 160 Karten in `CARDS` ergänzt (auf Wunsch von [Arun], ohne Code-Kommentare); Dokumentation nachgeführt |
| 14.10.2026 | [Arun] | `create-stack.js`: `createDOMStack()` zeigt offene Karten, Zehnerstapel und Handkarten an; `game.css`: 6 statt 5 Spalten/Zeilen (Commit `b2cfc83`) |
| 14.10.2026 | [KI] | Änderungen von Commit `b2cfc83` gegenüber `858186b` dokumentiert, Auffälligkeiten notiert |
