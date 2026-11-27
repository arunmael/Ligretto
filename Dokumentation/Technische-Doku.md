# Technische Dokumentation – Ligretto

> **Hinweis:** Diese Dokumentation wurde von einer KI geschrieben und von Arun geprüft. Der Code stammt grösstenteils von Arun. Wer was gemacht hat, steht im Arbeitsprotokoll [Dokumentation.md](Dokumentation.md).

Diese Datei beschreibt den **aktuellen Aufbau** des Projekts: welche Dateien es gibt, was die Funktionen machen und wie sie zusammenspielen. Sie wird nur angepasst, wenn sich am Aufbau etwas ändert (siehe Abschnitt 12). Einzelne Änderungen und Bugfixes stehen im Änderungsprotokoll von `Dokumentation.md` und in der Git-Historie.

Stand: 27.11.2026

---

## 1. Überblick

Ligretto ist ein Kartenspiel für mehrere Spieler, das im Browser laufen soll. Jeder Spieler hat ein eigenes Deck mit 40 Karten und legt so schnell wie möglich Karten in aufsteigender Reihenfolge (1 bis 10, gleiche Farbe) auf gemeinsame Stapel in der Tischmitte.

**Aktueller Stand:**
- **Frontend:** `create-stack.js` holt Startstapel vom Backend und enthält den Aufbau für bis zu vier Spieler. Die Anbindung in `main.js` ist noch unvollständig. Der fehlende `CARDS`-Export verhindert das Laden der Spielseite (BUG-029); danach blockiert die alte Aufrufschnittstelle den Aufbau (BUG-025).
- **Startseite:** Nach erfolgreichem Beitreten oder Erstellen blendet `login.js` das Formular aus und zeigt einen Wartescreen mit „Starte das Spiel“ und „Geh zurück in die Lobby“. Beim Erstellen fehlen dem Start-Button RoomID und Farbe (BUG-032).
- **Backend:** Python-Module für Kartenliste, Kartenverteilung, Spielregeln und Punktezählung. Die FastAPI-Routen verwalten Räume und Startstapel im Arbeitsspeicher und lassen sich starten.

| Bereich | Technik |
|---|---|
| Frontend | HTML, CSS, JavaScript (ES-Module, ohne Framework) |
| Backend | Python 3.14, FastAPI (Server), Pydantic (Anfrage-Modelle), uvicorn (startet den Server) |
| Tests | pytest (geplant, im venv installiert) |

---

## 2. Projekt starten

Die folgenden Befehle beschreiben die lokale Konfiguration. Backend und Startseite laufen; die Spielseite ist durch BUG-029 und BUG-025 blockiert.

**Frontend:** Weil die JavaScript-Dateien als ES-Module geladen werden, braucht es einen lokalen Webserver. Ein Doppelklick auf `index.html` funktioniert nicht.

```bash
cd frontend # wechselt vom Projektordner zu den Dateien der Website
python3 -m http.server 5500 # verwendet den in der README beschriebenen Frontend-Port
```

Danach im Browser `http://localhost:5500` öffnen (wegen der CORS-Freigabe für alle Origins funktioniert auch `127.0.0.1:5500`). Das Backend läuft in einem zweiten Terminal. Vollständige Startbefehle mit Aruns Projektpfad stehen oben in der [README](../README.md).

**Python-Umgebung (venv):**

```bash
python3 -m venv .venv          # nur einmal, falls .venv fehlt
source .venv/bin/activate      # bei jeder neuen Terminal-Sitzung
python -m pip install -r requirements.txt # installiert die Projektabhängigkeiten in die aktive Umgebung
python -m pip install uvicorn # ergänzt den bisher nicht in requirements.txt enthaltenen Server (BUG-023)
```

**Backend-Server**, im Projektordner (nicht in `backend/`) mit aktivem venv, damit die Imports mit `backend.` funktionieren:

```bash
python -m uvicorn backend.connection.routes:app --port 8000 # startet die API auf dem von login.js verwendeten Port
```

Frontend und Backend verwenden getrennte Ports: 5500 und 8000. Beide Terminals bleiben offen; Ctrl+C stoppt den jeweiligen Server.

**Tests** (sobald vorhanden), im Projektordner mit aktivem venv:

```bash
python3 -m pytest
```

---

## 3. Projektstruktur

```
Ligretto/
├── README.md                  Kurzbeschreibung für Besucher
├── AGENTS.md                  Regeln für KI-Agenten
├── Bugs.md                    aktuelle Bugliste mit fortlaufenden IDs
├── .gitignore                 venv, Caches, .DS_Store usw. werden nicht gepusht
├── .venv/                     virtuelle Python-Umgebung (lokal, nicht im Repo)
├── Dokumentation/
│   ├── Dokumentation.md       Arbeitsprotokoll und Änderungsprotokoll
│   ├── Technische-Doku.md     diese Datei
│   └── Bugs.md                Verweis auf die Bugliste im Projekt-Root
├── backend/
│   ├── memory.py              alle 160 Karten, erlaubte Farben und offene Räume (im Arbeitsspeicher)
│   ├── connection/
│   │   ├── model.py           Pydantic-Modelle für den JSON-Body der Anfragen
│   │   └── routes.py          FastAPI-App mit /joinRoom, /createRoom und /createCards
│   ├── logic/
│   │   ├── createRoomId.py    zufällige 6-stellige RoomID
│   │   ├── shuffle.py         Karten eines Spielers mischen und verteilen
│   │   ├── rules.py           Spielregeln
│   │   └── winner.py          Punkte zählen und Gewinner bestimmen
│   └── test/
│       └── connection.py      für Tests der Routen (noch leer)
└── frontend/
    ├── index.html             Startseite (Room beitreten / erstellen)
    ├── login.js               Logik der Startseite
    ├── login.css              Styles der Startseite
    ├── game.html              Spielseite
    ├── main.js                Einstiegspunkt der Spielseite, Klick-Handler
    ├── create-stack.js        Backend-Stapel abrufen und im DOM aufbauen
    ├── notes.js               nicht eingebundene Sammlung von Codefragmenten
    ├── move-cards.js          Karten verschieben, Stapel-Arrays pflegen
    ├── rules.js               Spielregeln
    ├── styles.css             gemeinsames Layout (Header, Footer, 3×3-Raster)
    ├── game.css               Layout der Spielerbereiche
    ├── rules.html             Regelseite (noch leer)
    └── images/                Kartenbilder, je Farbe ein Ordner, Rückseiten in back/
```

---

## 4. Ablauf

1. **Startseite:** `login.js` schickt RoomID und Farbe an `/joinRoom` beziehungsweise nur die Farbe an `/createRoom`. Bei Erfolg ruft es `openLobbyScreen()` auf: Die Formularelemente werden ausgeblendet, der Wartescreen `#loadingScreen` eingeblendet. Bei Fehlern fehlt eine sichtbare Meldung.
2. **Wartescreen:** „Starte das Spiel“ (`#startGame`) ruft `startGame(roomId, color)` auf und leitet mit `game.html?roomId=...&color=...` weiter. Der Button ist für alle Spieler sichtbar und startet nur das Spiel im eigenen Browser; andere Spieler werden nicht benachrichtigt. „Geh zurück in die Lobby“ (`#joinOtherLobbey`) ruft `joinOtherLobby()` auf und zeigt wieder das Formular; im Backend bleibt der Spieler im Raum eingetragen (BUG-033).
3. **Spielseite:** `game.html` lädt `main.js`, das `rules.js` importiert. Dessen fehlender `CARDS`-Import stoppt das Laden bereits vor der Registrierung von `DOMContentLoaded` (BUG-029).
4. **Noch nicht angepasster Einstieg:** Der vorhandene Listener liest `color` und `roomId`, prüft die Farbe und ruft danach die entfernte Funktion `createStartStack()` auf. Auch sein anschliessender Aufruf von `createDOMStack()` verwendet die alte Signatur. Dieser Code erreicht deshalb noch keinen funktionierenden Spielaufbau (BUG-025).
5. **Implementierter separater Aufbau:** Bei direktem Aufruf von `createDOMStack(owner, roomId)` wird über `fetchStacks(roomId)` die Route `/createCards` angefragt. Die Antwort enthält `stacks` und `playerColors`. Der eigene Spieler wird unten angezeigt, die übrigen Spieler in ihrer Antwortreihenfolge oben, rechts und links. `createDOMStack()` gibt keine Stapel an die Klick-Handler zurück.
6. **Spielfeld und Interaktion:** `createPlayArea()` erzeugt separat 16 Ablagefelder. Die vorhandenen Klick-Handler arbeiten noch mit `playerStartStacks`; ihre vorgesehene Wirkung ist in Abschnitt 7 beschrieben. Eine Synchronisation von Spielzügen zwischen Spielern existiert nicht.

---

## 5. Datenmodell

### 5.1 Karte

Jede Karte ist ein Objekt (JavaScript) bzw. ein Dictionary (Python) mit denselben Feldern:

| Feld | Beispiel | Bedeutung |
|---|---|---|
| `id` | `"yellow-green-5"` | eindeutig, Format `besitzer-farbe-wert` |
| `owner` | `"yellow"` | wem die Karte gehört (Farbe der Rückseite) |
| `color` | `"green"` | Farbe der Vorderseite, für die Regeln wichtig |
| `value` | `5` | Wert 1 bis 10 |
| `alt` | `"Grün 5"` | Alternativtext des Bildes |
| `src` | `"images/green/five.PNG"` | Bild der Vorderseite |
| `back` | `"images/back/yellow.PNG"` | Bild der Rückseite |

Es gibt 4 Besitzer × 4 Farben × 10 Werte = **160 Karten**. Die vollständige Liste steht als `CARDS` in `backend/memory.py`. Das Frontend erhält Kartenobjekte über `/createCards`; `frontend/create-stack.js` exportiert keine lokale Kartenliste mehr. `frontend/rules.js` erwartet diesen Export noch (BUG-029).

### 5.2 IDs im DOM

| Element | ID / Klasse | Beispiel |
|---|---|---|
| Startseite: Formular | ID `loginForm`, Felder `roomIdInput` und `chosenColor`, Buttons `submitRoomId` und `createRoomButton` | |
| Startseite: Wartescreen | ID `loadingScreen`, Buttons `startGame` und `joinOtherLobbey` | Kinder werden über das Attribut `hidden` ein- und ausgeblendet |
| Kartenbild | ID `image` + Karten-ID | `imageyellow-green-5` |
| offener Kartenplatz | ID `openCard` + Karten-ID, Klasse `openCardsElement` | `openCardyellow-green-5` |
| Bild einer offenen Karte | Klasse `openCardImage` | |
| Zehnerstapel-Container | ID `tenStackDiv` + Farbe, Klasse `tenStackElement` | `tenStackDivyellow` |
| Karte im Zehnerstapel | Klasse `tenStackImage` | |
| Handkarten-Container | ID `handCardsDiv` + Farbe, Klasse `handCardsElement` | |
| Handkarten-Rückseite | ID `handCardsBackgroundImage`, Klasse `handCardsImage` | bei mehreren Spielern derzeit doppelt vergeben (BUG-031) |
| Spielerbereiche | Suffix `Bottom`, `Top`, `Right` oder `Left` | `openCardsTop`, `tenStackRight`, `handCardsLeftClosed` |
| Spielfeld-Feld | ID `playAreaField0` bis `playAreaField15`, Klasse `playAreaField` | |

Das Präfix `image` ist wichtig: Die Regel-Funktionen im Frontend (`getNumber`, `getColor`) schneiden die ersten 5 Zeichen ab, um die Karten-ID zu erhalten. Das Backend arbeitet dagegen mit Karten-IDs **ohne** Präfix (siehe 9.3).

### 5.3 Stapel-Arrays im Frontend

| Array | Ort | Inhalt |
|---|---|---|
| `openCards` | `stacks[color]` in `createDOMStack()` | offene Karten des Spielers |
| `tenStack` | `stacks[color]` in `createDOMStack()` | Zehnerstapel, `tenStack[0]` liegt oben |
| `handCards` | `stacks[color]` in `createDOMStack()` | verdeckte Handkarten |
| `laidCards` | exportiert aus `move-cards.js` | alle Karten auf dem Spielfeld, auch überdeckte |

Die Getter liefern die jeweiligen Arrays unverändert zurück. Sie werden nicht kopiert. `createDOMStack()` verwendet sie lokal; `main.js` erwartet noch das nicht mehr erzeugte `playerStartStacks` (BUG-025).

Die vorhandene Verschiebelogik arbeitet wie folgt: Wenn eine Karte gelegt wird, verschwindet sie aus ihrem Stapel-Array und kommt in `laidCards`. Die Ausnahme ist das Nachfüllen: Eine Karte vom Zehnerstapel auf einem leeren offenen Platz kommt in `openCards`.

---

## 6. Frontend-Module

### 6.1 `login.js` (Startseite)

| Funktion | Beschreibung |
|---|---|
| `getSubmitValues()` | liest RoomID und Farbe aus dem Formular, gibt `{ color, roomId }` zurück |
| `openLobbyScreen()` | blendet alle Kinder von `#loginForm` aus und alle Kinder von `#loadingScreen` ein |
| `joinOtherLobby()` | Gegenstück: blendet das Formular wieder ein und den Wartescreen aus; keine Anfrage ans Backend |
| `startGame(roomId, color)` | leitet zu `game.html?roomId=...&color=...` weiter (Werte mit `encodeURIComponent`) |

Der `DOMContentLoaded`-Listener blendet zuerst den Wartescreen aus und hält `data`, `color` und `roomId` als gemeinsame Variablen für alle Listener. Die beiden Formular-Listener sind `async` und schicken per `POST` JSON ans Backend: „Beitreten“ schickt `{ color, roomId }` an `http://localhost:8000/joinRoom` und setzt dabei die gemeinsamen `color` und `roomId`, „Erstelle einen neuen Room“ schickt nur `{ color }` an `http://localhost:8000/createRoom` und verwendet eine eigene lokale `color`. Ist `response.ok`, wird die Antwort in `data` gespeichert, mit `console.log` ausgegeben und `openLobbyScreen()` aufgerufen. Bei einem Fehler gibt „Beitreten“ die Antwort nur mit `console.log` aus, „Erstellen“ macht nichts. Der Klick auf `#startGame` ruft `startGame(roomId, color)` mit den gemeinsamen Variablen auf, die nach dem Erstellen nicht gesetzt sind (BUG-032). Der Klick auf `#joinOtherLobbey` ruft `joinOtherLobby()` auf. `login.js` verwendet kein `sessionStorage`.

`login.css` enthält eine Regel `[hidden] { display: none !important; }`, damit ausgeblendete Elemente nicht durch andere `display`-Regeln (z. B. `form * { display: block }`) wieder sichtbar werden. `#loadingScreen` liegt im Raster von `main` in Spalte 2, Zeile 2.

### 6.2 `create-stack.js` (Backend-Daten und Aufbau)

| Funktion | Beschreibung |
|---|---|
| `fetchStacks(roomId)` | asynchroner POST an `http://localhost:8000/createCards` mit `{ roomId }`; liefert bei erfolgreicher HTTP-Antwort die JSON-Daten `{ stacks, playerColors }`, sonst `false`. Netzwerk- und JSON-Fehler werden nicht abgefangen |
| `getTenStack(stack)` | liefert `stack.tenStack` als ursprüngliches Array |
| `getOpenCards(stack)` | liefert `stack.openCards` als ursprüngliches Array |
| `getHandCards(stack)` | liefert `stack.handCards` als ursprüngliches Array |
| `createDOMStack(owner, roomId)` | holt die Stapel und zeigt alle Spieler an: `owner` unten, Gegner oben, rechts und links. Gibt ein Promise ohne Ergebniswert zurück; bei `false` aus `fetchStacks()` nur Konsolenmeldung und Abbruch |
| `createPlayArea()` | erzeugt in `#playArea` ein 4 × 4-Raster mit 16 leeren Feldern (`playAreaField`) |

`owner` ist die eigene Spielerfarbe und muss für einen vollständigen Aufbau in `playerColors` enthalten sein. Die Stapel sind nach Spielerfarbe indiziert. Zehnerstapel-Karten liegen mit 2,5 px Versatz übereinander, nur `tenStack[0]` ist klickbar. Der Handstapel zeigt eine Rückseite in der jeweiligen Spielerfarbe; die blaue Rückseite wird gedreht. Das Handkartenarray wird gelesen, aber noch nicht zum Aufdecken verwendet.

Jeder Abruf verteilt im Backend sämtliche Raumstapel neu (BUG-026). `CARDS`, `getDeck()` und `createStartStack()` sind nicht mehr Bestandteil des Moduls. `main.js` und `rules.js` sind daran noch nicht vollständig angepasst.

### 6.3 `move-cards.js` (Karten verschieben)

| Funktion | Beschreibung |
|---|---|
| `laidCards` | Array aller gelegten Karten (exportiert) |
| `getOldLocation(card, tenStack, openCards, handCards)` | intern: gibt `"tenStack"` zurück, wenn die Karte vom Zehnerstapel kommt, sonst das passende Array |
| `deleteFromStack(card, openCards, tenStack, handCards, newLocation)` | entfernt die Karte aus ihrem Stapel-Array. Zehnerstapel → offener Platz: in `openCards`, sonst in `laidCards` |
| `moveCardsToPlayArea(card, newLocation, openCards, tenStack, handCards)` | hängt das Kartenbild ins Ziel-Element und ruft `deleteFromStack()` auf. Kam die Karte vom Zehnerstapel, wird die nächste Karte darunter klickbar |
| `clickCardStyle(lastCard)` | setzt den Rahmen der zuvor ausgewählten Karte auf schwarz zurück |

### 6.4 `rules.js` (Spielregeln)

Das Modul erwartet weiterhin `CARDS` aus `create-stack.js`. Dieser Import scheitert aktuell (BUG-029); die folgenden Funktionen beschreiben den vorhandenen, dadurch nicht ausführbaren Regelcode.

| Funktion | Beschreibung |
|---|---|
| `getNumber(card)` | Wert der Karte (1 bis 10), `undefined` bei unbekannter Karte |
| `getColor(card)` | Farbe der Karte, `undefined` bei unbekannter Karte |
| `isAllowed(targetCard, currentCard)` | `true`, wenn `currentCard` auf `targetCard` gelegt werden darf (siehe Abschnitt 8). `targetCard` darf `null` sein (leeres Feld) |

### 6.5 `main.js` (Einstiegspunkt)

Enthält einen Listener für `DOMContentLoaded`, der `color` und `roomId` aus den URL-Parametern liest und die Spielerfarbe prüft. Seine Registrierung und der anschliessende Spielaufbau sind durch BUG-029 beziehungsweise BUG-025 blockiert (siehe Abschnitt 4). Der Button „Anderem Raum beitreten“ (`#joinOtherRoom`) führt zurück zu `index.html`. Der Spielzustand liegt in zwei Variablen:

| Variable | Bedeutung |
|---|---|
| `activeField` | aktuell ausgewählte Karte (`img`), `null` = keine Auswahl |
| `lastCard` | vorherige Auswahl, damit ihr grüner Rahmen zurückgesetzt werden kann |

Die Klick-Handler sind in Abschnitt 7 beschrieben.

### 6.6 `notes.js` (Codefragmente)

Nicht eingebundene Notizen mit Fragmenten für offene Karten, Zehnerstapel, Handstapel, Datenabruf und DOM-Zugriffe. Die Datei ist kein ausführbares Modul: Sie enthält doppelte Deklarationen und setzt externe Variablen voraus (BUG-030).

---

## 7. Interaktion: Karte auswählen und legen

Die folgende Tabelle beschreibt die vorhandenen Klick-Handler. Wegen der Startfehler werden sie derzeit nicht registriert. Ein Zug besteht im vorgesehenen Ablauf aus zwei Klicks: **Karte auswählen** (grüner Rahmen) und **Ziel anklicken**.

| Klick auf | Bedingung | Ergebnis |
|---|---|---|
| oberste Karte im Zehnerstapel | – | Karte wird ausgewählt |
| offene Karte | keine Zehnerstapel-Karte ausgewählt | offene Karte wird ausgewählt |
| belegter offener Platz | Zehnerstapel-Karte ausgewählt | stattdessen wird diese offene Karte ausgewählt |
| leerer offener Platz | Zehnerstapel-Karte ausgewählt | **Nachfüllen:** Karte wandert auf den Platz und in `openCards` |
| Spielfeld (Feld oder Karte) | keine Karte ausgewählt | nichts passiert |
| leeres Spielfeld-Feld | ausgewählte Karte ist eine 1 | Karte wird gelegt, Auswahl aufgehoben |
| leeres Spielfeld-Feld | ausgewählte Karte ist keine 1 | nichts passiert, Auswahl bleibt |
| Karte im Spielfeld | `isAllowed()` ist `true` | alte Karte wird aus dem DOM entfernt (bleibt in `laidCards`), neue Karte liegt im Feld, Auswahl aufgehoben |
| Karte im Spielfeld | `isAllowed()` ist `false` | nichts passiert, Auswahl bleibt |

Im DOM liegt pro Spielfeld-Feld immer nur die oberste Karte. Die überdeckten Karten stehen nur noch in `laidCards`.

---

## 8. Spielregeln

Umgesetzt in `frontend/rules.js` und gleich in `backend/logic/rules.py`:

1. Auf ein **leeres Feld** darf nur eine **1** gelegt werden.
2. Auf eine **Karte** darf nur eine Karte mit **gleicher Farbe** und einem **genau um 1 höheren Wert** gelegt werden (z. B. Grün 4 auf Grün 3).

Punktezählung (nur im Backend, `backend/logic/winner.py`): Jede gelegte Karte gibt ihrem Besitzer 1 Punkt, jede Karte, die noch im Zehnerstapel liegt, 2 Punkte Abzug. Gewonnen hat die Farbe mit den meisten Punkten, bei Gleichstand mehrere.

Noch nicht umgesetzt: Handkarten aufdecken und spielen, Spielende („Ligretto!“ bei leerem Zehnerstapel).

---

## 9. Backend-Module

Die Module in `logic/` sind reine Funktionen ohne Server. Sie bekommen die Kartenliste als Parameter `CARDS` und importieren sie nicht selbst. Dadurch lassen sie sich mit einer eigenen, kleinen Kartenliste testen.

### 9.1 `backend/memory.py`

Zentraler Speicher des Backends, nur im Arbeitsspeicher. Beim Neustart des Servers sind alle Räume weg.

| Variable | Typ | Inhalt |
|---|---|---|
| `CARDS` | Liste | alle 160 Karten; Kartenobjekte werden über die API ans Frontend übergeben (Abschnitt 5.1) |
| `acceptedColors` | Liste | erlaubte Spielerfarben: `"pink"`, `"yellow"`, `"green"`, `"blue"` (gleich wie die `<option>`-Werte in `index.html`) |
| `rooms` | Dictionary | RoomID (String) → Daten eines Raums. Enthält zum Testen die zwei Beispielräume `123456` (Blau, Pink) und `654321` (Blau, Grün) |

Die Raumdaten verwenden folgende Schlüssel; `tenStack` und `stacks` sind abhängig von Herkunft und Verteilungszustand nicht in jedem Raum vorhanden:

| Schlüssel | Typ | Inhalt |
|---|---|---|
| `playerColors` | Liste | Farben der Spieler in diesem Raum, jede Farbe nur einmal |
| `laidCards` | Liste | alle in der Mitte gelegten Karten (Karten-Dictionaries) |
| `tenStack` | Dictionary | Farbe → Anzahl Karten im Ligretto-Stapel, startet bei `10`, z. B. `{"blue": 8, "pink": 10}`. Wird von `create_room()` und `join_room()` angelegt, die Beispielräume haben ihn nicht |
| `stacks` | Dictionary | Farbe → `{ "tenStack": [...], "openCards": [...], "handCards": [...] }`. Wird von `create_cards()` angelegt, die Beispielräume haben ihn von Anfang an |

In den Beispielräumen stehen in `stacks` Karten-IDs (z. B. `"blue-green-7"`, die letzte ID ist die oberste Karte). `create_cards()` speichert dagegen ganze Karten-Dictionaries aus `CARDS`.

`countCards()` erwartet `playerColors`, `laidCards` und den Zähler `tenStack` (Abschnitt 9.4). Bei den Beispielräumen fehlt dieser Zähler. Änderungen der Kartenarrays im Browser aktualisieren die Backend-Zähler noch nicht.

### 9.2 `backend/logic/shuffle.py`

| Funktion | Beschreibung |
|---|---|
| `getPlayerCards(CARDS, playerColor)` | alle Karten mit `owner == playerColor`, `False` bei unbekannter Farbe |
| `shuffleDeck(CARDS, playerColor)` | die Karten des Spielers, gemischt. `False` bei unbekannter Farbe |
| `getDivideStack(CARDS, playerColor)` | gibt das Tupel `(tenStack, openCards, handCards)` mit 10/3/27 Karten zurück. Bei unbekannter Farbe: `ValueError("Player color unknown")` |

`getDivideStack()` liefert ein Tupel in der Reihenfolge `(tenStack, openCards, handCards)`. `create_cards()` ordnet dessen Teile den gleichnamigen Schlüsseln in `stacks[color]` zu; das Frontend liest sie über diese Schlüssel.

### 9.3 `backend/logic/rules.py`

| Funktion | Beschreibung |
|---|---|
| `getId(card)` | gibt die Karten-ID unverändert zurück |
| `getNumber(card, CARDS)` | Wert der Karte, `0` bei unbekannter Karte |
| `getColor(card, CARDS)` | Farbe der Karte, `""` bei unbekannter Karte |
| `isAllowed(targetCard, currentCard, CARDS)` | gleiche Regeln wie im Frontend, `targetCard` darf `None` sein |

Die Funktionen erwarten Karten-IDs **ohne** Präfix `image`, also wie in `memory.py` (z. B. `"blue-blue-1"`). Schickt das Frontend später seine DOM-IDs, muss das Präfix vorher entfernt werden.

### 9.4 `backend/logic/winner.py`

| Funktion | Beschreibung |
|---|---|
| `countCards(laidCards, playerColors, tenStack)` | zählt pro Farbe aus `playerColors` die Karten in `laidCards` mit diesem Besitzer (`owner`) und zieht pro Karte im Zehnerstapel 2 ab. Gibt ein Dictionary „Farbe → Punkte“ zurück, dazu den Schlüssel `"winner"` mit der Liste der Farben mit den meisten Punkten |

`tenStack` muss für jede Farbe aus `playerColors` einen Eintrag haben, auch mit `0`. Fehlt einer, kommt `ValueError("Ten stack missing for <Farbe>")`. Ist `playerColors` leer, kommt `ValueError("No player colors")`. Zusätzliche Farben in `tenStack` werden ignoriert.

### 9.5 `backend/logic/createRoomId.py`

| Funktion | Beschreibung |
|---|---|
| `createRoomID()` | gibt eine zufällige RoomID aus 6 Ziffern als String zurück (mit `secrets`). Prüft nicht, ob sie schon vergeben ist |

### 9.6 `backend/connection/` (Server)

Start: `uvicorn backend.connection.routes:app` im Projektordner (Abschnitt 2).

**`model.py`** – Pydantic-Modelle für den JSON-Body. Fehlt ein Feld oder hat es den falschen Typ, antwortet FastAPI automatisch mit `422`.

| Klasse | Felder |
|---|---|
| `roomRequestBase` | `color: str` |
| `joinRoomRequest` | erbt von `roomRequestBase`, dazu `roomId: str` |
| `createCards` | `roomId: str` |

**`routes.py`** – FastAPI-App `app`:

`CORSMiddleware` erlaubt mit `allow_origins=["*"]` jedem Origin die Methoden GET und POST sowie den Header `Content-Type`. Sie beantwortet auch die OPTIONS-Preflight-Anfragen des Browsers. Diese Konfiguration ist für die lokale Entwicklung gedacht; bei einer Veröffentlichung müssen API-Adresse und CORS-Freigabe zur Bereitstellung passen (BUG-017).

| Route | Funktion | Body | Erfolg | Fehler |
|---|---|---|---|---|
| `POST /joinRoom` | `join_room(data)` | `joinRoomRequest` | `200` `{ roomId, color }`, Farbe wird in `playerColors` eingetragen, `tenStack[color] = 10` | `400` leere Eingabe oder Farbe nicht in `acceptedColors`, `404` Raum nicht gefunden, `409` Farbe im Raum schon vergeben |
| `POST /createRoom` | `create_room(data)` | `roomRequestBase` | `200` `{ roomId, color }` mit neuer RoomID, Raum wird in `rooms` angelegt | `400` leere Farbe oder Farbe nicht in `acceptedColors` |
| `POST /createCards` | `create_cards(data)` | `createCards` | `200` `{ stacks, playerColors }`: Farben in Raumreihenfolge und für jede Farbe in `playerColors` die mit `getDivideStack()` gemischten Stapel `tenStack` (10), `openCards` (3) und `handCards` (27), gespeichert unter `rooms[roomId]["stacks"]` | `404` Raum nicht gefunden |

`create_room()` erzeugt die RoomID selbst mit `createRoomID()` und würfelt neu, solange sie schon in `rooms` vorkommt. Eine mitgeschickte `roomId` wird ignoriert.

`create_cards()` überschreibt bei jedem Aufruf die Stapel aller Spieler im Raum. `fetchStacks()` enthält den Frontend-Aufruf; der normale Einstieg in `main.js` erreicht ihn noch nicht. Die Rückgabe `playerColors` bestimmt die Reihenfolge der Spielerplätze.

**`backend/test/connection.py`** – für Tests der Routen vorgesehen, noch leer.

---

## 10. Layout

- `styles.css` teilt `main` in ein **3 × 3-Raster**. Die Mitte ist breit und enthält das Spielfeld, die vier Ränder sind für die Spieler (oben, links, rechts, unten).
- `game.css` ordnet die Spielerbereiche im Raster an. Oben und unten liegen die Elemente nebeneinander, links und rechts untereinander.
- Jeder Spielerbereich (`playerDeck…`) hat vier Container: offene Karten, Zehnerstapel, verdeckte Handkarten, aufgedeckte Handkarten.
- `createDOMStack(owner, roomId)` befüllt unten den eigenen Spieler und verteilt die übrigen Farben auf oben, rechts und links. Dieser Aufbau ist im normalen Seitenstart noch nicht erreichbar.
- Kartenbilder sind 60 × 90 px gross und haben einen Rahmen von 2 px.

---

## 11. Bekannte Einschränkungen

- Wer einen Raum erstellt, kann das Spiel über den Wartescreen nicht starten, weil RoomID und Farbe fehlen (BUG-032). „Geh zurück in die Lobby“ meldet den Spieler im Backend nicht ab (BUG-033). Der Start-Button ist für alle sichtbar und startet nur den eigenen Browser.
- Das Frontend-Regelmodul importiert die entfernte lokale Kartenliste (BUG-029). Der Einstieg verwendet ausserdem noch die entfernte Funktion `createStartStack()` und die alte Signatur von `createDOMStack()` (BUG-025).
- Spielzüge und Spielstände werden nicht zwischen Browsern synchronisiert. Es gibt noch kein durchgängiges Multiplayer-Spiel.
- `/createCards` mischt bei jedem Aufruf alle Raumstapel neu; ein kontrollierter, gemeinsamer Spielstart fehlt (BUG-026).
- Fehler beim Beitreten und Erstellen werden dem Spieler nicht angezeigt. Beim Stapelabruf gibt es ebenfalls nur eine Konsolenmeldung für HTTP-Fehler; Netzwerkfehler werden nicht abgefangen.
- Die RoomID wird weder im Wartescreen noch auf der Spielseite angezeigt, beim Erstellen nur in der Konsole (BUG-019).
- Räume liegen nur im Arbeitsspeicher und werden nie gelöscht. Beispielräume und erzeugte Räume verwenden unterschiedliche Stapelformate (BUG-021, BUG-027).
- Handkarten lassen sich noch nicht aufdecken oder spielen; `handCards…Open` wird nicht verwendet. Die Rückseitenbilder erhalten derzeit dieselbe ID (BUG-031).
- `rules.html` ist leer. `notes.js` ist eine nicht eingebundene, nicht ausführbare Sammlung von Codefragmenten (BUG-030).
- Die Regeln sind sowohl in JavaScript als auch in Python implementiert. Die vollständige Kartenliste liegt nur im Backend.
- `game.html` lädt `create-stack.js` und `move-cards.js` zusätzlich direkt als Module.

Offene Bugs stehen in [Bugs.md](../Bugs.md).

---

## 12. Pflege dieser Datei

Diese Datei wird **nur** angepasst, wenn sich der Aufbau ändert:
- eine Datei oder ein Ordner kommt dazu, wird umbenannt oder gelöscht
- eine Funktion kommt dazu, wird umbenannt oder gelöscht
- Parameter oder Rückgabewerte einer Funktion ändern sich
- der Ablauf ändert sich (z. B. wenn Frontend und Backend verbunden werden)
- Datenmodell, IDs oder Spielregeln ändern sich

Bugfixes ohne Auswirkung auf den Aufbau ändern diese Datei nicht. Die Regel dazu steht in `AGENTS.md`, Abschnitt 8.
