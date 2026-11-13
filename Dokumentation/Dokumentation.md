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
├── .gitignore             [Arun] Initial commit
├── AGENTS.md              [KI] Regeln für KI-Agenten
├── Dokumentation/
│   └── Dokumentation.md   [KI] diese Datei
├── backend/               [Arun] Backend-Ordner
│   ├── cards.py           [Arun] Datei angelegt, [KI] Kartenliste eingefügt
│   ├── connection/        [Arun] angelegt, noch leer (wird von Git noch nicht erfasst)
│   └── logic/
│       ├── rules.py       [Arun] angelegt, noch leer
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
11. Zehnerstapel: Die Container-Masse rechnen mit Bildgrösse 80 × 120 px und 2 px Versatz, die Bilder sind aber 60 × 90 px mit `i * 2.5` px Versatz. Der Container ist dadurch zu gross bzw. der Versatz wird nicht korrekt eingerechnet.
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

Erledigt seit der letzten Version: `openCards.append[i]` in `shuffle.py` (siehe 3.21).

Erledigt in früheren Versionen: Punkte 14, 22, 23, 24 (Import und Logik in `rules.js`), 20 (Regelprüfung beim Ablegen), 21 (Karte bleibt in `openCards`), 27 (Farbe bei „Room erstellen“), 28 (`sessionStorage` beim Zurückgehen). Früher schon: `login.js` wird nicht mehr doppelt eingebunden.

---

## 5. Änderungsprotokoll

| Datum | Wer | Was |
|---|---|---|
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
