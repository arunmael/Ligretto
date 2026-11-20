# Bugs

Nächste freie ID: BUG-024

## BUG-017: Browser blockiert die Anfragen ans Backend (CORS und Port 8000)
* **Schweregrad:** Kritisch
* **Typ:** Bug
* **Status:** Bestätigt
* **Gefunden am:** 2026-11-20
* **Zuletzt geprüft:** 2026-11-20
* **Betroffen:**
  * `backend/connection/routes.py`, Zeile 12, `app = FastAPI()`
  * `frontend/login.js`, Zeilen 45 bis 49 und 60 bis 64, `fetch("http://localhost:8000/...")` in den beiden Event-Listenern
  * `README.md`, Abschnitt „Projekt starten“ (Frontend mit `python3 -m http.server 8000`)
* **Was ist das Problem:** Weder `joinRoom` noch `createRoom` kommt vom Browser aus beim Backend an. Es wird kein Raum erstellt und niemand tritt einem Raum bei.
* **Wieso tritt es auf:**
  1. Das Frontend läuft auf einem anderen Origin als das Backend. Weil `fetch` den Header `Content-Type: application/json` schickt, macht der Browser zuerst eine Preflight-Anfrage (`OPTIONS`). Die FastAPI-App hat keine `CORSMiddleware`, antwortet deshalb mit `405 Method Not Allowed` und ohne `Access-Control-Allow-Origin`. Der Browser bricht die eigentliche `POST`-Anfrage ab.
  2. Laut README läuft das Frontend selbst auf `localhost:8000`, und `uvicorn` nimmt standardmässig auch Port 8000. Beide können nicht gleichzeitig auf diesem Port laufen. Läuft dort der `http.server`, landet der `POST` bei ihm und bekommt `501 Unsupported method`.
* **Wann tritt es auf:** Bei jedem Klick auf „Beitreten“ oder „Erstelle einen neuen Room“, sobald Frontend und Backend getrennt gestartet werden. Geprüft: `OPTIONS /joinRoom` mit `Origin: http://localhost:5500` → `405`, und `POST /createRoom` liefert keinen `Access-Control-*`-Header.

## BUG-018: Frontend wartet nicht auf die Antwort und ignoriert Fehler
* **Schweregrad:** Kritisch
* **Typ:** Bug
* **Status:** Bestätigt
* **Gefunden am:** 2026-11-20
* **Zuletzt geprüft:** 2026-11-20
* **Betroffen:**
  * `frontend/login.js`, Zeilen 45 bis 50, Submit-Listener von `loginForm` (`fetch` + `joinRoom()`)
  * `frontend/login.js`, Zeilen 60 bis 65, Klick-Listener von `createRoomButton` (`fetch` + `createRoom()`)
* **Was ist das Problem:** Der Spieler landet immer auf `game.html`, auch wenn der Raum nicht existiert (404), die Farbe schon vergeben ist (409) oder die Eingabe ungültig ist (400). Er bekommt keine Fehlermeldung.
* **Wieso tritt es auf:** `fetch()` gibt ein Promise zurück, auf das weder mit `await` noch mit `.then()` gewartet wird. Direkt danach setzt `joinRoom()` bzw. `createRoom()` `window.location.href`. Die Antwort wird nie gelesen, und der Seitenwechsel kann die noch laufende Anfrage sogar abbrechen, sodass sie das Backend gar nicht erreicht.
* **Wann tritt es auf:** Beitreten mit einer RoomID, die es nicht gibt, z. B. `999999`: Das Backend antwortet `404 „Der Raum wurde nicht gefunden“`, der Spieler wird trotzdem weitergeleitet.

## BUG-019: Beim Raum erstellen geht die vom Backend erzeugte RoomID verloren
* **Schweregrad:** Kritisch
* **Typ:** Bug
* **Status:** Bestätigt
* **Gefunden am:** 2026-11-20
* **Zuletzt geprüft:** 2026-11-20
* **Betroffen:**
  * `frontend/login.js`, Zeilen 54 bis 65, Klick-Listener von `createRoomButton`
  * `backend/connection/routes.py`, Zeilen 52 bis 61, Funktion `create_room()`
* **Was ist das Problem:** Wer einen Raum erstellt, erfährt dessen RoomID nicht. Er kann sie also auch nicht an Mitspieler weitergeben, die dann nicht beitreten können.
* **Wieso tritt es auf:** `create_room()` erzeugt mit `createRoomID()` eine neue 6-stellige ID und gibt sie als `{"roomId": ...}` zurück. Das Frontend speichert aber vorher schon den Inhalt des Eingabefelds (`getSubmitValues().roomId`, meist leer) in `sessionStorage` und liest die Antwort nie aus (siehe BUG-018). Die mitgeschickte `roomId` wird vom Modell `roomRequestBase` ignoriert.
* **Wann tritt es auf:** Feld „RoomID“ leer lassen, Farbe wählen, „Erstelle einen neuen Room“ klicken. Backend antwortet z. B. `{"roomId": "790397", "color": "blue"}`, in `sessionStorage` steht `roomId = ""`.

## BUG-020: Eingabeprüfung in `join_room()` gibt falsche Meldung, RoomID wird nicht getrimmt
* **Schweregrad:** Mittel
* **Typ:** Bug / Edge Case
* **Status:** Bestätigt
* **Gefunden am:** 2026-11-20
* **Zuletzt geprüft:** 2026-11-20
* **Betroffen:**
  * `backend/connection/routes.py`, Zeilen 24 bis 30, Funktion `join_room()`
* **Was ist das Problem:**
  1. Bei leerer RoomID kommt „Bitte eine Farbe auswählen.“ statt „Bitte eine RoomID eingeben“.
  2. Eine RoomID mit Leerzeichen davor oder dahinter (z. B. beim Kopieren) wird nicht gefunden (404), obwohl der Raum existiert.
* **Wieso tritt es auf:**
  1. Die erste Bedingung prüft mit `or` beide Felder zusammen. Ist `roomId` leer, greift schon sie. Der `elif`-Zweig in Zeile 27/28 kann deshalb nie erreicht werden.
  2. `strip()` wird nur in der Prüfung benutzt. Gesucht wird in Zeile 30 mit dem ungetrimmten `data.roomId`. Das Frontend trimmt auch nicht (`getSubmitValues()`).
* **Wann tritt es auf:** Geprüft: `{"color": "pink", "roomId": "  "}` → `400 „Bitte eine Farbe auswählen.“`; `{"color": "pink", "roomId": " 790397"}` → `404`, obwohl Raum `790397` existiert.

## BUG-021: Räume werden nie gelöscht, `create_room()` kann endlos laufen
* **Schweregrad:** Mittel
* **Typ:** Security / Edge Case
* **Status:** Bestätigt
* **Gefunden am:** 2026-11-20
* **Zuletzt geprüft:** 2026-11-20
* **Betroffen:**
  * `backend/connection/routes.py`, Zeilen 52 bis 54 und 60, Funktion `create_room()`
  * `backend/memory.py`, Zeile 177, `rooms`
* **Was ist das Problem:** Jeder Aufruf von `/createRoom` legt einen Raum in `memory.rooms` an, der nie wieder entfernt wird. Wer den Endpunkt oft aufruft, lässt den Speicher des Servers wachsen (Denial of Service). Sind alle 1 000 000 IDs vergeben, findet die `while`-Schleife keine freie ID mehr und läuft endlos; schon vorher wird sie immer langsamer.
* **Wieso tritt es auf:** Es gibt kein Limit, keine Begrenzung pro Client und kein Aufräumen leerer oder beendeter Räume. Die Schleife hat keine Abbruchbedingung ausser „freie ID gefunden“.
* **Wann tritt es auf:** Zurzeit nur, wenn jemand den Server gezielt mit Anfragen flutet. Läuft das Backend nur lokal, ist es kaum erreichbar; sobald es öffentlich erreichbar ist, schon.

## BUG-023: `requirements.txt` reicht nicht zum Starten des Backends
* **Schweregrad:** Klein
* **Typ:** Bug
* **Status:** Bestätigt
* **Gefunden am:** 2026-11-20
* **Zuletzt geprüft:** 2026-11-20
* **Betroffen:**
  * `requirements.txt`, Zeile 6, `fastapi`
* **Was ist das Problem:** Auf einem frisch eingerichteten Rechner lässt sich das Backend nach `pip install -r requirements.txt` nicht starten, weil `uvicorn` fehlt. Ausserdem ist `fastapi` ohne Version eingetragen, was dem Hinweis „Feste Versionen (==)“ oben in der Datei widerspricht; zwei Rechner können so verschiedene Versionen bekommen.
* **Wieso tritt es auf:** Das Paket `fastapi` bringt keinen Server mit (erst `fastapi[standard]` oder ein separates `uvicorn`). Im lokalen `.venv` ist `uvicorn 0.54.0` installiert, steht aber nicht in `requirements.txt`. Pydantic und Starlette sind ebenfalls nicht fixiert.
* **Wann tritt es auf:** Neues venv anlegen, `pip install -r requirements.txt`, dann `uvicorn backend.connection.routes:app` → `command not found: uvicorn`.

## BUG-022: Gleichzeitige Anfragen können dieselbe Farbe doppelt vergeben
* **Schweregrad:** Klein
* **Typ:** Edge Case
* **Status:** Verdacht
* **Gefunden am:** 2026-11-20
* **Zuletzt geprüft:** 2026-11-20
* **Betroffen:**
  * `backend/connection/routes.py`, Zeilen 31 bis 34, Funktion `join_room()`
  * `backend/connection/routes.py`, Zeilen 52 bis 60, Funktion `create_room()`
* **Was ist das Problem:** Zwei Spieler, die fast gleichzeitig mit derselben Farbe demselben Raum beitreten, könnten beide angenommen werden. `playerColors` enthält die Farbe dann doppelt. Ähnlich könnten zwei gleichzeitige `create_room()` dieselbe ID bekommen.
* **Wieso tritt es auf:** Die Routen sind normale `def`-Funktionen; FastAPI führt sie parallel in einem Threadpool aus. Prüfen (`not in playerColors`) und Eintragen (`append`) sind zwei getrennte Schritte ohne Lock.
* **Wann tritt es auf:** Nur bei echt gleichzeitigen Anfragen. **Dafür:** Check-then-act ohne Lock ist ein klassisches Race-Muster. **Dagegen:** Durch den GIL und den sehr kurzen Abschnitt ist das Zeitfenster winzig, praktisch kaum auslösbar; nicht reproduziert.
