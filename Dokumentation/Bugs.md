# Bugs

Nächste freie ID: BUG-028

## BUG-017: Browser blockiert die Anfragen ans Backend (CORS und Port 8000)
* **Schweregrad:** Kritisch
* **Aufwand:** 2 von 5
* **Typ:** Bug
* **Status:** Bestätigt
* **Gefunden am:** 2026-11-20
* **Zuletzt geprüft:** 2026-11-21
* **Betroffen:**
  * `backend/connection/routes.py`, Zeile 14, `app = FastAPI()`
  * `frontend/login.js`, Zeilen 43 bis 47 und 61 bis 65, `fetch("http://localhost:8000/...")` in den beiden Event-Listenern
  * `README.md`, Zeilen 18 und 21, Abschnitt „Projekt starten“ (Frontend mit `python3 -m http.server 8000`)
* **Was ist das Problem:** Weder `joinRoom` noch `createRoom` kommt vom Browser aus beim Backend an. Es wird kein Raum erstellt und niemand tritt einem Raum bei. Seit die Listener mit `await` auf die Antwort warten, passiert beim Klick gar nichts mehr (siehe BUG-018).
* **Wieso tritt es auf:**
  1. Das Frontend läuft auf einem anderen Origin als das Backend. Weil `fetch` den Header `Content-Type: application/json` schickt, macht der Browser zuerst eine Preflight-Anfrage (`OPTIONS`). Die FastAPI-App hat keine `CORSMiddleware`, antwortet deshalb mit `405 Method Not Allowed` und ohne `Access-Control-Allow-Origin`. Der Browser bricht die eigentliche `POST`-Anfrage ab.
  2. Laut README läuft das Frontend selbst auf `localhost:8000`, und `uvicorn` nimmt standardmässig auch Port 8000. Beide können nicht gleichzeitig auf diesem Port laufen. Läuft dort der `http.server`, landet der `POST` bei ihm und bekommt `501 Unsupported method`.
* **Wann tritt es auf:** Bei jedem Klick auf „Beitreten“ oder „Erstelle einen neuen Room“, sobald Frontend und Backend getrennt gestartet werden. Geprüft am 20.11.: `OPTIONS /joinRoom` mit `Origin: http://localhost:5500` → `405`, und `POST /createRoom` liefert keinen `Access-Control-*`-Header. Am 21.11. bestätigt, dass im Backend weiterhin keine `CORSMiddleware` eingebunden ist.
* **Wie schwierig zu fixen:** Wenig Code, aber man muss zuerst verstehen, wie der Browser Anfragen an einen anderen Origin prüft (Preflight mit `OPTIONS`). Dazu hängen drei Stellen zusammen, die zusammenpassen müssen: Backend, die URL im Frontend und die Startanleitung im README.


## BUG-025: Rückseite des Handstapels zeigt ein kaputtes Bild (`images/back/null.PNG`)
* **Schweregrad:** Mittel
* **Aufwand:** 1 von 5
* **Typ:** Bug
* **Status:** Bestätigt
* **Gefunden am:** 2026-11-21
* **Zuletzt geprüft:** 2026-11-21
* **Betroffen:**
  * `frontend/create-stack.js`, Zeile 252, Funktion `createDOMStack()` (`sessionStorage.getItem("playerColor")`)
  * `frontend/create-stack.js`, Zeilen 289, 333, 349 und 358 bis 359, Funktion `createDOMStack()` (Verwendung von `playerColor`)
  * `frontend/main.js`, Zeilen 12 bis 13 (Farbe kommt jetzt aus der URL)
  * `frontend/login.js`, Zeilen 38 bis 73 (`sessionStorage.setItem(...)` wurde entfernt)
* **Was ist das Problem:** Auf der Spielseite wird für den verdeckten Handstapel kein Bild angezeigt, sondern nur der Alt-Text „back of the null card“. Bei Blau wird die Rückseite ausserdem nicht mehr gedreht. Die IDs im DOM heissen `tenStackDivnull` und `handCardsDivnull` statt z. B. `tenStackDivblue`.
* **Wieso tritt es auf:** `login.js` speichert die Farbe nicht mehr in `sessionStorage`, sondern hängt sie als `?color=...` an die URL. `main.js` liest sie richtig aus der URL und gibt sie an `createStartStack(owner)` weiter. `createDOMStack()` bekommt die Farbe aber nicht als Parameter und liest weiterhin `sessionStorage.getItem("playerColor")`. Dort steht nichts mehr, also ist `playerColor` gleich `null`.
* **Wann tritt es auf:** In einem neuen Tab einen Raum erstellen oder beitreten (oder direkt `game.html?color=blue&roomId=123456` öffnen). Liegt im Tab noch ein alter `playerColor` von früher in `sessionStorage`, erscheint stattdessen die Rückseite dieser alten, eventuell falschen Farbe.
* **Wie schwierig zu fixen:** Eine Funktion, die Ursache ist klar: Die Farbe kommt an einer Stelle aus einer Quelle, die nicht mehr beschrieben wird. Man muss nur nachverfolgen, wie die Farbe von `main.js` nach `create-stack.js` gelangt.


## BUG-018: Fehler beim Beitreten oder Erstellen sieht der Spieler nicht
* **Schweregrad:** Mittel
* **Aufwand:** 3 von 5
* **Typ:** Bug / Edge Case
* **Status:** Bestätigt
* **Gefunden am:** 2026-11-20
* **Zuletzt geprüft:** 2026-11-21
* **Betroffen:**
  * `frontend/login.js`, Zeilen 38 bis 55, Submit-Listener von `loginForm` (nur `console.log(response)` im `else`)
  * `frontend/login.js`, Zeilen 58 bis 73, Klick-Listener von `createRoomButton` (kein `else`)
* **Was ist das Problem:** Seit dem 21.11. wartet das Frontend mit `await` auf die Antwort und leitet nur bei Erfolg weiter. Das ursprüngliche Problem (Weiterleitung auch bei Fehlern) ist damit behoben. Bei einem Fehler passiert für den Spieler aber einfach nichts: Er sieht nicht, ob der Raum nicht existiert (404), die Farbe schon vergeben ist (409) oder die Eingabe ungültig ist (400). Beim Erstellen wird ein Fehler nicht einmal in der Konsole ausgegeben.
* **Wieso tritt es auf:**
  1. Im `else`-Zweig von „Beitreten“ steht nur `console.log(response)` und ein `todo`. Bei „Erstellen“ fehlt der `else`-Zweig ganz.
  2. Ist das Backend nicht erreichbar oder blockiert der Browser die Anfrage (BUG-017), wirft `fetch` eine Exception, statt eine Antwort zu liefern. Es gibt kein `try`/`catch`, deshalb bricht der Listener mit „Uncaught (in promise) TypeError: Failed to fetch“ ab.
* **Wann tritt es auf:** Beitreten mit einer RoomID, die es nicht gibt, z. B. `999999`: Backend antwortet `404`, auf der Seite ändert sich nichts. Oder: Backend nicht starten und auf „Erstelle einen neuen Room“ klicken: keine Reaktion.
* **Wie schwierig zu fixen:** Betrifft beide Listener in `login.js`. Man muss mit asynchronem Code (Promises, Exceptions bei `fetch`) umgehen und entscheiden, was der Spieler bei jedem Fehlerfall (400, 404, 409, keine Verbindung) sieht. Dafür gibt es auf der Startseite bisher keine Stelle für Meldungen.


## BUG-024: Beitreten zu den Beispielräumen stürzt ab und blockiert die Farbe
* **Schweregrad:** Mittel
* **Aufwand:** 2 von 5
* **Typ:** Bug
* **Status:** Bestätigt
* **Gefunden am:** 2026-11-21
* **Zuletzt geprüft:** 2026-11-21
* **Betroffen:**
  * `backend/connection/routes.py`, Zeilen 33 bis 34, Funktion `join_room()`
  * `backend/memory.py`, Zeilen 177 bis 210, `rooms` (Beispielräume `123456` und `654321`)
  * `backend/connection/routes.py`, Zeile 60, Funktion `create_room()` (legt `tenStack` an, die Beispielräume nicht)
* **Was ist das Problem:** Wer einem der beiden Beispielräume beitritt, bekommt `500 Internal Server Error`. Die Farbe wird trotzdem im Raum eingetragen. Ein zweiter Versuch mit derselben Farbe gibt deshalb `409 „Diese Farbe ist bereits gewählt.“`, obwohl der erste Beitritt fehlgeschlagen ist.
* **Wieso tritt es auf:** Die Beispielräume in `memory.py` haben jetzt `stacks`, aber keinen Schlüssel `tenStack` mehr. `join_room()` hängt in Zeile 33 zuerst die Farbe an `playerColors` an und greift erst danach in Zeile 34 auf `memory.rooms[roomId]["tenStack"]` zu. Dort entsteht ein `KeyError`. Der Raum bleibt in einem halb geänderten Zustand.
* **Wann tritt es auf:** Geprüft: `join_room(color="yellow", roomId="123456")` → `KeyError: 'tenStack'`, danach ist `playerColors` gleich `["blue", "pink", "yellow"]`. Räume, die mit `/createRoom` erstellt wurden, sind nicht betroffen.
* **Wie schwierig zu fixen:** Wenige Stellen, aber man muss zuerst entscheiden, wie ein Raum im Speicher aufgebaut ist (siehe BUG-027). Ausserdem spielt die Reihenfolge der Änderungen in `join_room()` eine Rolle, damit ein Fehler den Raum nicht halb verändert zurücklässt.


## BUG-019: Die RoomID wird auf der Spielseite nicht angezeigt
* **Schweregrad:** Mittel
* **Aufwand:** 2 von 5
* **Typ:** Bug
* **Status:** Bestätigt
* **Gefunden am:** 2026-11-20
* **Zuletzt geprüft:** 2026-11-21
* **Betroffen:**
  * `frontend/main.js`, Zeile 14, `const roomId = params.get("roomId")` (wird gelesen, aber nirgends verwendet)
  * `frontend/login.js`, Zeilen 22 bis 24, Funktion `createRoom()`
* **Was ist das Problem:** Wer einen Raum erstellt, sieht dessen RoomID nur in der Adresszeile des Browsers. Auf der Spielseite steht sie nirgends. Mitspieler können nur beitreten, wenn der Ersteller die ID selbst aus der URL abliest.
* **Wieso tritt es auf:** Der frühere Teil des Bugs ist behoben: `createRoom()` bekommt jetzt `data.roomId` aus der Antwort und hängt sie an die URL. `main.js` liest sie in Zeile 14 auch aus, macht aber nichts damit. In `game.html` gibt es keine Stelle, die die RoomID anzeigt.
* **Wann tritt es auf:** Feld „RoomID“ leer lassen, Farbe wählen, „Erstelle einen neuen Room“ klicken (sobald BUG-017 behoben ist). Die Spielseite zeigt keine RoomID.
* **Wie schwierig zu fixen:** Die RoomID ist im Frontend schon vorhanden. Es fehlt nur eine Stelle auf der Seite, an der sie angezeigt wird. Dafür müssen `game.html` und `main.js` zusammen angepasst werden.


## BUG-020: Eingabeprüfung in `join_room()` gibt falsche Meldung, RoomID wird nicht getrimmt
* **Schweregrad:** Mittel
* **Aufwand:** 1 von 5
* **Typ:** Bug / Edge Case
* **Status:** Bestätigt
* **Gefunden am:** 2026-11-20
* **Zuletzt geprüft:** 2026-11-21
* **Betroffen:**
  * `backend/connection/routes.py`, Zeilen 24 bis 30, Funktion `join_room()`
* **Was ist das Problem:**
  1. Bei leerer RoomID kommt „Bitte eine Farbe auswählen.“ statt „Bitte eine RoomID eingeben“.
  2. Eine RoomID mit Leerzeichen davor oder dahinter (z. B. beim Kopieren) wird nicht gefunden (404), obwohl der Raum existiert.
* **Wieso tritt es auf:**
  1. Die erste Bedingung in Zeile 24 prüft mit `or` beide Felder zusammen. Ist `roomId` leer, greift schon sie. Der `elif`-Zweig in Zeile 27/28 kann deshalb nie erreicht werden.
  2. `strip()` wird nur in der Prüfung benutzt. Gesucht wird in Zeile 30 mit dem ungetrimmten `data.roomId`. Das Frontend trimmt auch nicht (`getSubmitValues()`).
* **Wann tritt es auf:** Geprüft am 21.11.: `{"color": "green", "roomId": ""}` → `400 „Bitte eine Farbe auswählen.“`; `{"color": "green", "roomId": " 123456 "}` → `404`, obwohl Raum `123456` existiert.
* **Wie schwierig zu fixen:** Nur eine Funktion, wenige Zeilen, und die Ursache ist klar. Leicht mit einzelnen Anfragen zu prüfen.


## BUG-021: Räume werden nie gelöscht, `create_room()` kann endlos laufen
* **Schweregrad:** Mittel
* **Aufwand:** 4 von 5
* **Typ:** Security / Edge Case
* **Status:** Bestätigt
* **Gefunden am:** 2026-11-20
* **Zuletzt geprüft:** 2026-11-21
* **Betroffen:**
  * `backend/connection/routes.py`, Zeilen 52 bis 54 und 60, Funktion `create_room()`
  * `backend/memory.py`, Zeile 177, `rooms`
* **Was ist das Problem:** Jeder Aufruf von `/createRoom` legt einen Raum in `memory.rooms` an, der nie wieder entfernt wird. Wer den Endpunkt oft aufruft, lässt den Speicher des Servers wachsen (Denial of Service). Sind alle 1 000 000 IDs vergeben, findet die `while`-Schleife keine freie ID mehr und läuft endlos; schon vorher wird sie immer langsamer. Mit `/createCards` wächst jeder Raum zusätzlich um 40 Karten pro Spieler.
* **Wieso tritt es auf:** Es gibt kein Limit, keine Begrenzung pro Client und kein Aufräumen leerer oder beendeter Räume. Die Schleife hat keine Abbruchbedingung ausser „freie ID gefunden“.
* **Wann tritt es auf:** Zurzeit nur, wenn jemand den Server gezielt mit Anfragen flutet. Läuft das Backend nur lokal, ist es kaum erreichbar; sobald es öffentlich erreichbar ist, schon.
* **Wie schwierig zu fixen:** Es fehlt bisher ein Konzept, wann ein Raum endet (Spiel vorbei, alle Spieler weg, Zeit abgelaufen). Das muss zuerst entschieden werden und betrifft später auch das Spiel selbst. Missbrauch durch viele Anfragen ist ausserdem schwer zu testen.


## BUG-026: `/createCards` mischt beliebig oft neu, später beigetretene Spieler haben keine Stapel
* **Schweregrad:** Klein
* **Aufwand:** 4 von 5
* **Typ:** Bug / Edge Case
* **Status:** Bestätigt
* **Gefunden am:** 2026-11-21
* **Zuletzt geprüft:** 2026-11-21
* **Betroffen:**
  * `backend/connection/routes.py`, Zeilen 66 bis 92, Funktion `create_cards()`
  * `backend/connection/routes.py`, Zeilen 30 bis 35, Funktion `join_room()`
* **Was ist das Problem:**
  1. Jeder Aufruf von `/createCards` mischt die Stapel **aller** Spieler im Raum neu und überschreibt die alten. Mitten im Spiel würde damit der ganze Spielstand zurückgesetzt. Jeder, der die RoomID kennt, kann das auslösen.
  2. Wer nach `/createCards` noch mit `/joinRoom` beitritt, steht in `playerColors`, hat aber keinen Eintrag in `stacks`.
* **Wieso tritt es auf:** `create_cards()` prüft nur, ob der Raum existiert, nicht ob die Karten schon verteilt wurden. `join_room()` prüft nicht, ob das Spiel schon begonnen hat.
* **Wann tritt es auf:** Geprüft: Raum mit Blau erstellen, `/createCards`, dann Pink beitreten → `stacks` enthält nur `blue`. Zweiter Aufruf von `/createCards` → die oberste Karte im Zehnerstapel von Blau war vorher `blue-pink-10`, danach `blue-pink-8`. Das Frontend ruft `/createCards` zurzeit noch nicht auf, auslösbar ist es also nur durch direkte Anfragen ans Backend.
* **Wie schwierig zu fixen:** Es fehlt ein Konzept, wann ein Spiel startet und wer es starten darf (z. B. Zustand „wartet auf Spieler“ und „läuft“). Das betrifft beide Routen und später auch das Frontend (Warten auf Mitspieler).


## BUG-023: `requirements.txt` reicht nicht zum Starten des Backends
* **Schweregrad:** Klein
* **Aufwand:** 1 von 5
* **Typ:** Bug
* **Status:** Bestätigt
* **Gefunden am:** 2026-11-20
* **Zuletzt geprüft:** 2026-11-21
* **Betroffen:**
  * `requirements.txt`, Zeile 6, `fastapi`
* **Was ist das Problem:** Auf einem frisch eingerichteten Rechner lässt sich das Backend nach `pip install -r requirements.txt` nicht starten, weil `uvicorn` fehlt. Ausserdem ist `fastapi` ohne Version eingetragen, was dem Hinweis „Feste Versionen (==)“ oben in der Datei widerspricht; zwei Rechner können so verschiedene Versionen bekommen.
* **Wieso tritt es auf:** Das Paket `fastapi` bringt keinen Server mit (erst `fastapi[standard]` oder ein separates `uvicorn`). Im lokalen `.venv` ist `uvicorn 0.54.0` installiert, steht aber nicht in `requirements.txt`. Pydantic und Starlette sind ebenfalls nicht fixiert. Für Tests der Routen mit `fastapi.testclient` fehlt zudem `httpx2`.
* **Wann tritt es auf:** Neues venv anlegen, `pip install -r requirements.txt`, dann `uvicorn backend.connection.routes:app` → `command not found: uvicorn`.
* **Wie schwierig zu fixen:** Nur eine Datei, und es ist klar, was fehlt. Man muss nur die passenden Versionen aus dem venv übernehmen.


## BUG-027: Stapel im Raum haben zwei verschiedene Formate und einen doppelten Zehnerstapel
* **Schweregrad:** Klein
* **Aufwand:** 3 von 5
* **Typ:** Bug
* **Status:** Verdacht
* **Gefunden am:** 2026-11-21
* **Zuletzt geprüft:** 2026-11-21
* **Betroffen:**
  * `backend/connection/routes.py`, Zeilen 79 bis 87, Funktion `create_cards()`
  * `backend/connection/routes.py`, Zeilen 34 und 60, `join_room()` und `create_room()` (`"tenStack": {farbe: 10}`)
  * `backend/memory.py`, Zeilen 181 bis 209, `rooms` (Beispielräume mit Karten-IDs)
* **Was ist das Problem:** Ein Raum kann auf drei Arten aufgebaut sein: Die Beispielräume speichern in `stacks` nur Karten-IDs (`"blue-green-7"`), `create_cards()` speichert ganze Karten-Dictionaries (`{"id": ..., "owner": ..., "src": ...}`), und `create_room()`/`join_room()` führen zusätzlich `room["tenStack"][farbe]` als Zähler. Code, der später mit den Stapeln arbeitet, muss mit beiden Formaten umgehen können. Der Zähler und die Liste `stacks[farbe]["tenStack"]` können auseinanderlaufen.
* **Wieso tritt es auf:** `shuffle.getDivideStack()` gibt ganze Karten zurück, die unverändert gespeichert werden. Die Beispielräume in `memory.py` wurden mit IDs geschrieben. Der Zähler `tenStack` stammt aus der Zeit vor `stacks`.
* **Wann tritt es auf:** **Dafür:** `/createCards` auf Raum `123456` überschreibt die ID-Listen mit Dictionaries, beide Formate sind im selben Speicher möglich; Raum aus `/createRoom` hat nach `/createCards` sowohl `tenStack: {"blue": 10}` als auch `stacks.blue.tenStack` mit 10 Karten. **Dagegen:** Noch liest kein Code die Stapel aus dem Backend, es gibt also noch kein sichtbares Fehlverhalten. Vielleicht ist ein Format nur vorläufig gedacht.
* **Wie schwierig zu fixen:** Man muss zuerst entscheiden, wie ein Raum im Speicher aussehen soll (IDs oder ganze Karten, Zähler oder Liste). Danach müssen `memory.py`, `create_room()`, `join_room()` und `create_cards()` dazu passen. Hängt mit BUG-024 zusammen.


## BUG-022: Gleichzeitige Anfragen können dieselbe Farbe doppelt vergeben
* **Schweregrad:** Klein
* **Aufwand:** 3 von 5
* **Typ:** Edge Case
* **Status:** Verdacht
* **Gefunden am:** 2026-11-20
* **Zuletzt geprüft:** 2026-11-21
* **Betroffen:**
  * `backend/connection/routes.py`, Zeilen 31 bis 33, Funktion `join_room()`
  * `backend/connection/routes.py`, Zeilen 52 bis 60, Funktion `create_room()`
* **Was ist das Problem:** Zwei Spieler, die fast gleichzeitig mit derselben Farbe demselben Raum beitreten, könnten beide angenommen werden. `playerColors` enthält die Farbe dann doppelt. Ähnlich könnten zwei gleichzeitige `create_room()` dieselbe ID bekommen.
* **Wieso tritt es auf:** Die Routen sind normale `def`-Funktionen; FastAPI führt sie parallel in einem Threadpool aus. Prüfen (`not in playerColors`) und Eintragen (`append`) sind zwei getrennte Schritte ohne Lock.
* **Wann tritt es auf:** Nur bei echt gleichzeitigen Anfragen. **Dafür:** Check-then-act ohne Lock ist ein klassisches Race-Muster. **Dagegen:** Durch den GIL und den sehr kurzen Abschnitt ist das Zeitfenster winzig, praktisch kaum auslösbar; nicht reproduziert.
* **Wie schwierig zu fixen:** Wenige Stellen, aber Nebenläufigkeit ist schwer zu verstehen und noch schwerer zu testen, weil der Fehler kaum reproduzierbar ist. Ob ein Fix wirkt, sieht man nicht einfach durch Ausprobieren.
