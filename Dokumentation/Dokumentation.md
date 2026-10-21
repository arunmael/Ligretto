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

**[KI]** Diese Dokumentation beschreibt den Stand vom 21.10.2026.

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

Erledigt seit der letzten Version: `login.js` wird nicht mehr doppelt eingebunden.

---

## 5. Änderungsprotokoll

| Datum | Wer | Was |
|---|---|---|
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
