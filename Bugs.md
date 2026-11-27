# Bugs

Nächste freie ID: BUG-034

Stand: 27.11.2026. Von der KI geprüft und mit Aruns Zustimmung dokumentiert.
Die Einträge sind nach Schweregrad und innerhalb dessen nach Auswirkung und Erreichbarkeit sortiert. BUG-017 bleibt auf Aruns Wunsch als Hosting-Hinweis bestehen.

Die Backend-Routen lassen sich seit dem 27.11.2026 wieder importieren. BUG-020, BUG-024 und BUG-026 wurden durch direkte Aufrufe der Routenfunktionen erneut reproduziert, die CORS-Freigabe über eine ASGI-Preflight-Anfrage geprüft. BUG-022 und BUG-027 bleiben Verdachtsfälle.

## BUG-029: Fehlender CARDS-Export verhindert das Laden der Spielseite

- **Schweregrad:** Kritisch
- **Aufwand:** 3 von 5
- **Typ:** Bug
- **Status:** Bestätigt
- **Gefunden am:** 2026-11-26
- **Zuletzt geprüft:** 2026-11-27
- **Betroffen:**
  - `frontend/rules.js`, Zeile 5, Import von `CARDS`
  - `frontend/main.js`, Zeile 8, Import des Regelmoduls
  - `frontend/create-stack.js`, Zeilen 1 bis 194, Modul ohne den bisherigen `CARDS`-Export
- **Was ist das Problem:** `main.js` wird nicht ausgeführt. Spielaufbau und Klickaktionen starten nicht.
- **Wieso tritt es auf:** Die lokale Kartenliste wurde aus `create-stack.js` entfernt. `rules.js` importiert sie weiterhin als benannten Export, weshalb schon das Verknüpfen der Module scheitert.
- **Wann tritt es auf:** Bei jedem Laden von `game.html`. Mit Node am 27.11. erneut reproduziert: Das angeforderte Modul bietet keinen Export namens `CARDS`.
- **Wie schwierig zu fixen:** Regelprüfung und Bereitstellung der Kartendaten betreffen mehrere Module und die Umstellung auf Backend-Daten.

## BUG-025: Spielstart verwendet die entfernte Funktion und die alte Stapel-Schnittstelle

- **Schweregrad:** Kritisch
- **Aufwand:** 3 von 5
- **Typ:** Bug
- **Status:** Bestätigt
- **Gefunden am:** 2026-11-21
- **Zuletzt geprüft:** 2026-11-27
- **Betroffen:**
  - `frontend/main.js`, Zeilen 38 bis 44, 71 bis 73 und 118 bis 120, Spielaufbau und Klick-Handler
  - `frontend/create-stack.js`, Zeilen 43 bis 170, Funktion `createDOMStack(owner, roomId)`
- **Was ist das Problem:** Die Spielseite kann ihre Stapel weiterhin nicht aufbauen. Die Anbindung in `main.js` ist falsch.
- **Wieso tritt es auf:** `main.js` ruft die entfernte Funktion `createStartStack()` auf. Danach übergibt es drei Kartenarrays an `createDOMStack()`, das jetzt `owner` und `roomId` erwartet. Die Klick-Handler greifen weiter auf `playerStartStacks` zu, aber `createDOMStack()` gibt keine Stapel zurück.
- **Wann tritt es auf:** Nach Behebung des vorgelagerten Modulfehlers BUG-029 würde der Spielstart in Zeile 38 mit einem TypeError abbrechen. Der direkte Modulimport bestätigt am 27.11.: `createStartStack` ist `undefined`.
- **Wie schwierig zu fixen:** Mehrere Aufrufstellen und die asynchrone Datenübergabe zwischen Aufbau und Klick-Handlern sind betroffen.

## BUG-017: API-Adresse und CORS vor dem Hosting anpassen, CORS gibt zurzeit jeden Origin frei

- **Schweregrad:** Kritisch (bei unveränderter Veröffentlichung; lokal funktionsfähig)
- **Aufwand:** 2 von 5
- **Typ:** Bug / Security
- **Status:** Für die lokale Entwicklung funktionsfähig; Anpassung vor dem Hosting offen
- **Gefunden am:** 2026-11-20
- **Zuletzt geprüft:** 2026-11-27
- **Betroffen:**
  - `backend/connection/routes.py`, Zeilen 16 bis 23, Konfiguration der `CORSMiddleware` (`allow_origins=["*"]`)
  - `frontend/login.js`, Zeilen 79 und 102, `fetch("http://localhost:8000/...")` in den beiden Event-Listenern
  - `frontend/create-stack.js`, Zeile 10, `fetch("http://localhost:8000/createCards")` in `fetchStacks()`
- **Lokal:** Frontend unter `http://localhost:5500`, Backend auf Port 8000. Seit dem 27.11.2026 gibt die CORS-Middleware jeden Origin frei (`*`), damit funktioniert jetzt auch `127.0.0.1:5500`.
- **Was ist das Problem:**
  1. Bei einer unveränderten Veröffentlichung würden die API-Anfragen weiterhin an den Computer des jeweiligen Besuchers gehen.
  2. Mit `allow_origins=["*"]` darf jede beliebige Website im Browser eines Besuchers Anfragen an das Backend schicken und die Antworten lesen, z. B. Räume anlegen oder mit einer bekannten RoomID `/createCards` auslösen (siehe BUG-026). Der Kommentar in Zeile 17 vermerkt zwar die nötige Anpassung, die Freigabe ist aber breiter als für die lokale Entwicklung nötig.
     Der Eintrag bleibt auf ausdrücklichen Wunsch von Arun als Erinnerung für das Hosting bestehen.
- **Wieso tritt es auf:**
  1. `localhost` bezeichnet im Browser den Computer des Besuchers, nicht den Server, auf dem die Website gehostet wird.
  2. Der Wert `*` erlaubt jedem Origin den Zugriff. Am 27.11. per ASGI-Preflight geprüft: `http://localhost:5500`, `http://127.0.0.1:5500` und `https://fremde-seite.example` erhalten alle `200` mit `access-control-allow-origin: *`.
- **Wann tritt es auf:** Wenn die Website mit den aktuellen Einstellungen veröffentlicht wird, oder lokal, wenn bei laufendem Backend im selben Browser eine fremde Seite geöffnet ist, die Anfragen an `localhost:8000` schickt. Da das Backend noch keine Anmeldung hat, ist der zusätzliche Schaden derzeit gering.
- **Wie schwierig zu fixen:** Wenige Stellen in Frontend und Backend, deren Einstellungen von der noch festzulegenden Hosting-Konfiguration abhängen. Aufwand 2 von 5, weil Adressen, Weiterleitung und Browser-Origin zusammenpassen müssen.

## BUG-018: Fehler beim Beitreten oder Erstellen sieht der Spieler nicht

- **Schweregrad:** Mittel
- **Aufwand:** 3 von 5
- **Typ:** Bug / Edge Case
- **Status:** Bestätigt
- **Gefunden am:** 2026-11-20
- **Zuletzt geprüft:** 2026-11-27
- **Betroffen:**
  - `frontend/login.js`, Zeilen 74 bis 93, Submit-Listener von `loginForm` (nur `console.log(response)` im `else`)
  - `frontend/login.js`, Zeilen 99 bis 116, Klick-Listener von `createRoomButton` (kein `else`)
- **Was ist das Problem:** Das Frontend wartet mit `await` auf die Antwort und öffnet nur bei Erfolg den Wartescreen. Bei einem Fehler passiert für den Spieler aber einfach nichts: Er sieht nicht, ob der Raum nicht existiert (404), die Farbe schon vergeben ist (409) oder die Eingabe ungültig ist (400). Beim Erstellen wird ein Fehler nicht einmal in der Konsole ausgegeben.
- **Wieso tritt es auf:**
  1. Im `else`-Zweig von „Beitreten“ steht nur `console.log(response)` und ein `todo`. Bei „Erstellen“ fehlt der `else`-Zweig ganz.
  2. Ist das Backend nicht erreichbar, wirft `fetch` eine Exception, statt eine Antwort zu liefern. Es gibt kein `try`/`catch`, deshalb bricht der Listener mit „Uncaught (in promise) TypeError: Failed to fetch“ ab.
- **Wann tritt es auf:** Beitreten mit einer RoomID, die es nicht gibt, z. B. `999999`: Backend antwortet `404`, auf der Seite ändert sich nichts. Oder: Backend nicht starten und auf „Erstelle einen neuen Room“ klicken: keine Reaktion.
- **Wie schwierig zu fixen:** Betrifft beide Listener in `login.js`. Man muss mit asynchronem Code (Promises, Exceptions bei `fetch`) umgehen und entscheiden, was der Spieler bei jedem Fehlerfall (400, 404, 409, keine Verbindung) sieht. Dafür gibt es auf der Startseite bisher keine Stelle für Meldungen.

## BUG-020: Eingabeprüfung in `join_room()` gibt falsche Meldung, RoomID wird nicht getrimmt

- **Schweregrad:** Mittel
- **Aufwand:** 1 von 5
- **Typ:** Bug / Edge Case
- **Status:** Bestätigt
- **Gefunden am:** 2026-11-20
- **Zuletzt geprüft:** 2026-11-27
- **Betroffen:**
  - `backend/connection/routes.py`, Zeilen 32 bis 38, Funktion `join_room()`
  - `frontend/login.js`, Zeile 18, Funktion `getSubmitValues()` (kein `trim()`)
- **Was ist das Problem:**
  1. Bei leerer RoomID kommt „Bitte eine Farbe auswählen.“ statt „Bitte eine RoomID eingeben“.
  2. Eine RoomID mit Leerzeichen davor oder dahinter (z. B. beim Kopieren) wird nicht gefunden (404), obwohl der Raum existiert.
- **Wieso tritt es auf:**
  1. Die erste Bedingung in Zeile 32 prüft mit `or` beide Felder zusammen. Ist `roomId` leer, greift schon sie. Der `elif`-Zweig in Zeilen 35/36 kann deshalb nie erreicht werden.
  2. `strip()` wird nur in der Prüfung benutzt. Gesucht wird in Zeile 38 mit dem ungetrimmten `data.roomId`. Das Frontend trimmt auch nicht.
- **Wann tritt es auf:** Leere RoomID → `400 „Bitte eine Farbe auswählen.“`; `" 915681 "` → `404`, obwohl Raum `915681` existiert. Am 27.11. per direktem Aufruf von `join_room()` reproduziert.
- **Wie schwierig zu fixen:** Nur eine Funktion, wenige Zeilen, und die Ursache ist klar. Leicht mit einzelnen Anfragen zu prüfen.

## BUG-019: Die RoomID wird weder im Wartescreen noch auf der Spielseite angezeigt

- **Schweregrad:** Mittel
- **Aufwand:** 2 von 5
- **Typ:** Bug
- **Status:** Bestätigt
- **Gefunden am:** 2026-11-20
- **Zuletzt geprüft:** 2026-11-27
- **Betroffen:**
  - `frontend/login.js`, Zeilen 110 bis 112, Create-Listener (`data.roomId` wird nur mit `console.log(data)` ausgegeben)
  - `frontend/index.html`, Zeilen 35 bis 39, `#loadingScreen` (keine Stelle für die RoomID)
  - `frontend/main.js`, Zeile 16, `const roomId = params.get("roomId")` (wird gelesen, aber nirgends verwendet)
  - `frontend/game.html`, Zeilen 19 bis 64 (keine Stelle, die die RoomID anzeigt)
- **Was ist das Problem:** Wer einen Raum erstellt, sieht dessen RoomID nirgends auf der Seite. Seit dem neuen Wartescreen bleibt der Ersteller vor dem Spielstart auf `index.html`, dort steht die RoomID auch nicht in der Adresszeile, sondern nur in der Browser-Konsole. Gerade im Wartescreen müsste er sie aber an die Mitspieler weitergeben, damit diese beitreten können.
- **Wieso tritt es auf:** Die vom Backend erzeugte `data.roomId` wird in `login.js` nur in der Konsole ausgegeben. `#loadingScreen` und `game.html` haben kein Element dafür, und `main.js` verwendet die gelesene RoomID nicht.
- **Wann tritt es auf:** Farbe wählen, „Erstelle einen neuen Room“ klicken. Der Wartescreen zeigt keine RoomID.
- **Wie schwierig zu fixen:** Die RoomID ist im Frontend schon vorhanden. Es fehlt eine Stelle auf der Seite, an der sie angezeigt wird; HTML und JavaScript müssen zusammen angepasst werden.

## BUG-033: „Geh zurück in die Lobby“ meldet den Spieler im Backend nicht ab

- **Schweregrad:** Mittel
- **Aufwand:** 4 von 5
- **Typ:** Bug / Edge Case
- **Status:** Bestätigt
- **Gefunden am:** 2026-11-27
- **Zuletzt geprüft:** 2026-11-27
- **Betroffen:**
  - `frontend/login.js`, Zeilen 35 bis 45, Funktion `joinOtherLobby()`
  - `frontend/login.js`, Zeilen 123 bis 125, Klick-Listener von `returnToStartScreen`
  - `backend/connection/routes.py`, Zeilen 39 bis 47, Funktion `join_room()` (409 bei bereits vergebener Farbe)
- **Was ist das Problem:** Nach „Geh zurück in die Lobby“ sieht der Spieler wieder das Formular, ist im Backend aber weiterhin mit seiner Farbe im Raum eingetragen. Tritt er demselben Raum mit derselben Farbe erneut bei, bekommt er `409 „Diese Farbe ist bereits gewählt.“` (und sieht wegen BUG-018 nicht einmal eine Meldung). Die Farbe bleibt für alle anderen blockiert, und ein erstellter Raum bleibt mit dem Spieler bestehen. Wird später `/createCards` aufgerufen, bekommt der verlassene Spieler trotzdem Stapel.
- **Wieso tritt es auf:** `joinOtherLobby()` blendet nur die Elemente um. Es gibt keine Anfrage ans Backend und keine Route, die eine Farbe wieder aus `playerColors` entfernt.
- **Wann tritt es auf:** Raum `915681` mit Blau erstellen, mit Pink beitreten, „Geh zurück in die Lobby“, erneut mit Pink beitreten → `409`; `playerColors` bleibt `["blue", "pink"]`. Am 27.11. per direktem Aufruf von `join_room()` reproduziert.
- **Wie schwierig zu fixen:** Frontend und Backend sind betroffen, und es fehlt ein Konzept, wie ein Spieler einen Raum verlässt (inkl. was mit leeren Räumen und schon verteilten Stapeln passiert, siehe BUG-021 und BUG-026).

## BUG-024: Beitreten zu den Beispielräumen stürzt ab und blockiert die Farbe

- **Schweregrad:** Mittel
- **Aufwand:** 2 von 5
- **Typ:** Bug
- **Status:** Bestätigt
- **Gefunden am:** 2026-11-21
- **Zuletzt geprüft:** 2026-11-27
- **Betroffen:**
  - `backend/connection/routes.py`, Zeilen 41 bis 42, Funktion `join_room()`
  - `backend/memory.py`, Zeilen 177 bis 210, `rooms` (Beispielräume `123456` und `654321`)
  - `backend/connection/routes.py`, Zeile 68, Funktion `create_room()` (legt `tenStack` an, die Beispielräume nicht)
- **Was ist das Problem:** Wer einem der beiden Beispielräume beitritt, bekommt `500 Internal Server Error`. Die Farbe wird trotzdem im Raum eingetragen. Ein zweiter Versuch mit derselben Farbe gibt deshalb `409 „Diese Farbe ist bereits gewählt.“`, obwohl der erste Beitritt fehlgeschlagen ist.
- **Wieso tritt es auf:** Die Beispielräume in `memory.py` haben `stacks`, aber keinen Schlüssel `tenStack`. `join_room()` hängt in Zeile 41 zuerst die Farbe an `playerColors` an und greift erst danach in Zeile 42 auf `memory.rooms[data.roomId]["tenStack"]` zu. Dort entsteht ein `KeyError`. Der Raum bleibt in einem halb geänderten Zustand.
- **Wann tritt es auf:** `join_room(color="yellow", roomId="123456")` → `KeyError: 'tenStack'`, danach ist `playerColors` gleich `["blue", "pink", "yellow"]`. Am 27.11. erneut reproduziert. Räume, die mit `/createRoom` erstellt wurden, sind nicht betroffen.
- **Wie schwierig zu fixen:** Wenige Stellen, aber man muss zuerst entscheiden, wie ein Raum im Speicher aufgebaut ist (siehe BUG-027). Ausserdem spielt die Reihenfolge der Änderungen in `join_room()` eine Rolle, damit ein Fehler den Raum nicht halb verändert zurücklässt.

## BUG-026: `/createCards` mischt beliebig oft neu, später beigetretene Spieler haben keine Stapel

- **Schweregrad:** Mittel
- **Aufwand:** 4 von 5
- **Typ:** Bug / Edge Case / Security
- **Status:** Bestätigt
- **Gefunden am:** 2026-11-21
- **Zuletzt geprüft:** 2026-11-27
- **Betroffen:**
  - `backend/connection/routes.py`, Zeilen 75 bis 102, Funktion `create_cards()`
  - `backend/connection/routes.py`, Zeilen 38 bis 43, Funktion `join_room()`
- **Was ist das Problem:**
  1. Jeder Aufruf von `/createCards` mischt die Stapel **aller** Spieler im Raum neu und überschreibt die alten. Mitten im Spiel würde damit der ganze Spielstand zurückgesetzt. Jeder, der die RoomID kennt, kann das auslösen.
  2. Wer nach `/createCards` noch mit `/joinRoom` beitritt, steht in `playerColors`, hat aber keinen Eintrag in `stacks`.
- **Wieso tritt es auf:** `create_cards()` prüft nur, ob der Raum existiert, nicht ob die Karten schon verteilt wurden. `join_room()` prüft nicht, ob das Spiel schon begonnen hat.
- **Wann tritt es auf:** Raum mit Blau erstellen, Pink beitreten, `/createCards`, dann Grün beitreten → Beitritt erfolgreich, `stacks` enthält nur `blue` und `pink`. Am 27.11. erneut reproduziert. Der Aufruf liegt in `frontend/create-stack.js`, Zeilen 9 bis 20, Funktion `fetchStacks()`. Der neue Wartescreen startet das Spiel pro Spieler einzeln; sobald die Spielseite läuft (BUG-029, BUG-025), würde jeder Spieler beim Aufbau `/createCards` aufrufen und damit die Stapel aller anderen neu mischen.
- **Wie schwierig zu fixen:** Es fehlt ein Konzept, wann ein Spiel startet und wer es starten darf (z. B. Zustand „wartet auf Spieler“ und „läuft“). Das betrifft beide Routen und das Frontend (Wartescreen, Start-Button nur für den Ersteller).

## BUG-021: Räume werden nie gelöscht, `create_room()` kann endlos laufen

- **Schweregrad:** Mittel
- **Aufwand:** 4 von 5
- **Typ:** Security / Edge Case
- **Status:** Bestätigt
- **Gefunden am:** 2026-11-20
- **Zuletzt geprüft:** 2026-11-27
- **Betroffen:**
  - `backend/connection/routes.py`, Zeilen 60 bis 68, Funktion `create_room()`
  - `backend/memory.py`, Zeile 177, `rooms`
- **Was ist das Problem:** Jeder Aufruf von `/createRoom` legt einen Raum in `memory.rooms` an, der nie wieder entfernt wird. Wer den Endpunkt oft aufruft, lässt den Speicher des Servers wachsen (Denial of Service). Sind alle 1 000 000 IDs vergeben, findet die `while`-Schleife keine freie ID mehr und läuft endlos; schon vorher wird sie immer langsamer. Mit `/createCards` wächst jeder Raum zusätzlich um 40 Karten pro Spieler. Durch die CORS-Freigabe für alle Origins (BUG-017) kann das auch eine fremde Website im Browser eines Besuchers auslösen.
- **Wieso tritt es auf:** Es gibt kein Limit, keine Begrenzung pro Client und kein Aufräumen leerer oder beendeter Räume. Die Schleife hat keine Abbruchbedingung ausser „freie ID gefunden“.
- **Wann tritt es auf:** Zurzeit nur, wenn jemand den Server gezielt mit Anfragen flutet. Läuft das Backend nur lokal, ist es kaum erreichbar; sobald es öffentlich erreichbar ist, schon.
- **Wie schwierig zu fixen:** Es fehlt bisher ein Konzept, wann ein Raum endet (Spiel vorbei, alle Spieler weg, Zeit abgelaufen). Das muss zuerst entschieden werden und betrifft später auch das Spiel selbst. Missbrauch durch viele Anfragen ist ausserdem schwer zu testen.

## BUG-023: `requirements.txt` reicht nicht zum Starten des Backends

- **Schweregrad:** Klein
- **Aufwand:** 1 von 5
- **Typ:** Bug
- **Status:** Bestätigt
- **Gefunden am:** 2026-11-20
- **Zuletzt geprüft:** 2026-11-27
- **Betroffen:**
  - `requirements.txt`, Zeile 6, `fastapi`
- **Was ist das Problem:** Auf einem frisch eingerichteten Rechner lässt sich das Backend nach `pip install -r requirements.txt` nicht starten, weil `uvicorn` fehlt. Ausserdem ist `fastapi` ohne Version eingetragen, was dem Hinweis „Feste Versionen (==)“ oben in der Datei widerspricht; zwei Rechner können so verschiedene Versionen bekommen.
- **Wieso tritt es auf:** Das Paket `fastapi` bringt keinen Server mit (erst `fastapi[standard]` oder ein separates `uvicorn`). In `requirements.txt` ist weder `uvicorn` noch die Server-Extra-Abhängigkeit `fastapi[standard]` aufgeführt. Die README nennt deshalb einen separaten Installationsbefehl für Uvicorn.
- **Wann tritt es auf:** Neues venv anlegen, `pip install -r requirements.txt`, dann `uvicorn backend.connection.routes:app` → `command not found: uvicorn`. Auf dem eigenen Rechner tritt es nicht auf, weil das venv schon alles hat.
- **Wie schwierig zu fixen:** Nur eine Datei, und es ist klar, was fehlt. Man muss nur die passenden Versionen aus dem venv übernehmen.

## BUG-031: Handkartenbilder erhalten dieselbe DOM-ID

- **Schweregrad:** Klein
- **Aufwand:** 1 von 5
- **Typ:** Bug
- **Status:** Bestätigt
- **Gefunden am:** 2026-11-26
- **Zuletzt geprüft:** 2026-11-27
- **Betroffen:**
  - `frontend/create-stack.js`, Zeilen 55 und 139, Spielerschleife in `createDOMStack()`
- **Was ist das Problem:** Bei mehreren Spielern ist `handCardsBackgroundImage` nicht eindeutig. Ein Zugriff über diese ID kann die Bilder nicht getrennt zuordnen. Aktuell verwendet kein Spielcode diese ID zur Auswahl.
- **Wieso tritt es auf:** Die Schleife erstellt für jeden Spieler ein Bild mit demselben festen ID-Wert.
- **Wann tritt es auf:** Beim Aufbau mit mindestens zwei Spielern. Ein Test mit simulierten Backend-Daten und DOM ergab zwei Bilder mit derselben ID; der normale Spielstart ist noch blockiert.
- **Wie schwierig zu fixen:** Eine ID-Zuweisung; derzeit existieren keine davon abhängigen Zugriffe.

## BUG-030: Notizdatei enthält doppelte Variablendeklarationen

- **Schweregrad:** Klein
- **Aufwand:** 1 von 5
- **Typ:** Bug
- **Status:** Bestätigt
- **Gefunden am:** 2026-11-26
- **Zuletzt geprüft:** 2026-11-27
- **Betroffen:**
  - `frontend/notes.js`, Zeilen 2 bis 3 und 28 bis 29, Deklarationen von `newDiv` und `newImage`
- **Was ist das Problem:** Die Datei kann nicht als Ganzes ausgeführt werden. Aktuell ist sie nicht eingebunden und hat keine Auswirkung auf das Spiel.
- **Wieso tritt es auf:** Mehrere zusammenkopierte Codefragmente deklarieren dieselben Namen im selben Gültigkeitsbereich mit `const` beziehungsweise `let`.
- **Wann tritt es auf:** Bei einer Syntaxprüfung oder sobald die gesamte Datei eingebunden wird. Node meldet schon bei `newDiv` einen SyntaxError (am 27.11. erneut geprüft).
- **Wie schwierig zu fixen:** Die Konflikte liegen innerhalb einer einzelnen Sammlung von Codefragmenten.

## BUG-027: Stapel im Raum haben zwei verschiedene Formate und einen doppelten Zehnerstapel

- **Schweregrad:** Klein
- **Aufwand:** 3 von 5
- **Typ:** Bug
- **Status:** Verdacht
- **Gefunden am:** 2026-11-21
- **Zuletzt geprüft:** 2026-11-27
- **Betroffen:**
  - `backend/connection/routes.py`, Zeilen 90 bis 97, Funktion `create_cards()`
  - `backend/connection/routes.py`, Zeilen 42 und 68, `join_room()` und `create_room()` (`"tenStack": {farbe: 10}`)
  - `backend/memory.py`, Zeilen 177 bis 210, `rooms` (Beispielräume mit Karten-IDs)
- **Was ist das Problem:** Ein Raum kann auf drei Arten aufgebaut sein: Die Beispielräume speichern in `stacks` nur Karten-IDs (`"blue-green-7"`), `create_cards()` speichert ganze Karten-Dictionaries (`{"id": ..., "owner": ..., "src": ...}`), und `create_room()`/`join_room()` führen zusätzlich `room["tenStack"][farbe]` als Zähler. Code, der später mit den Stapeln arbeitet, muss mit beiden Formaten umgehen können. Der Zähler und die Liste `stacks[farbe]["tenStack"]` können auseinanderlaufen.
- **Wieso tritt es auf:** `shuffle.getDivideStack()` gibt ganze Karten zurück, die unverändert gespeichert werden. Die Beispielräume in `memory.py` wurden mit IDs geschrieben. Der Zähler `tenStack` stammt aus der Zeit vor `stacks`.
- **Wann tritt es auf:** **Dafür:** `/createCards` auf Raum `123456` überschreibt die ID-Listen mit Dictionaries, beide Formate sind im selben Speicher möglich; Raum aus `/createRoom` hat nach `/createCards` sowohl `tenStack: {"blue": 10}` als auch `stacks.blue.tenStack` mit 10 Karten. **Dagegen:** `fetchStacks()` liest die Antwort von `/createCards`, die vorher alle Stapel durch Kartenobjekte ersetzt. Damit ist kein Fehler des Renderers durch die alten ID-Listen bestätigt. Der normale Spielstart ist ausserdem blockiert (BUG-025, BUG-029).
- **Wie schwierig zu fixen:** Mehrere Dateien und drei Routen verwenden die Raumdaten. Die Bewertung des Aufwands hängt vom noch nicht einheitlichen Datenmodell und dem Verhältnis zwischen Zähler und Kartenliste ab.

## BUG-022: Gleichzeitige Anfragen können dieselbe Farbe doppelt vergeben

- **Schweregrad:** Klein
- **Aufwand:** 3 von 5
- **Typ:** Edge Case
- **Status:** Verdacht
- **Gefunden am:** 2026-11-20
- **Zuletzt geprüft:** 2026-11-27
- **Betroffen:**
  - `backend/connection/routes.py`, Zeilen 39 bis 42, Funktion `join_room()`
  - `backend/connection/routes.py`, Zeilen 60 bis 68, Funktion `create_room()`
- **Was ist das Problem:** Zwei Spieler, die fast gleichzeitig mit derselben Farbe demselben Raum beitreten, könnten beide angenommen werden. `playerColors` enthält die Farbe dann doppelt. Ähnlich könnten zwei gleichzeitige `create_room()` dieselbe ID bekommen.
- **Wieso tritt es auf:** Die Routen sind normale `def`-Funktionen; FastAPI führt sie parallel in einem Threadpool aus. Prüfen (`not in playerColors`) und Eintragen (`append`) sind zwei getrennte Schritte ohne Lock.
- **Wann tritt es auf:** Nur bei echt gleichzeitigen Anfragen. **Dafür:** Check-then-act ohne Lock ist ein klassisches Race-Muster. **Dagegen:** Der Abschnitt ist kurz und gleichzeitiges Fehlverhalten wurde nicht reproduziert. Die konkrete Thread-Zeitplanung ist nicht geprüft; der GIL allein garantiert hier keine atomare Operation.
- **Wie schwierig zu fixen:** Wenige Stellen, aber Nebenläufigkeit ist schwer zu verstehen und noch schwerer zu testen, weil der Fehler kaum reproduzierbar ist. Ob ein Fix wirkt, sieht man nicht einfach durch Ausprobieren.
