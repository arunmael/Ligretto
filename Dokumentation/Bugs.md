# Bugs

Nächste freie ID: BUG-028

Die Datei ist in zwei Teile geteilt:

* **Teil 1: Vor neuem Code beheben.** Diese Bugs sitzen in Code, auf dem der nächste Code aufbaut, oder verlangen eine Entscheidung, die den neuen Code prägt.
* **Teil 2: Später oder zurzeit nicht relevant.** Diese Bugs lösen sich mit späteren Funktionen von selbst (Wartescreen, Spielstart, Hosting) oder betreffen zurzeit nichts Sichtbares.

Innerhalb der Teile gilt weiterhin: Der Bug, der zuerst gefixt werden sollte, steht zuoberst.

---

# Teil 1: Vor neuem Code beheben

## BUG-025: Spielseite: `playerColor` ist in `createDOMStack()` nicht definiert, die Farbe kommt nicht an

- **Schweregrad:** Mittel
- **Aufwand:** 2 von 5
- **Typ:** Bug
- **Status:** Bestätigt
- **Gefunden am:** 2026-11-21
- **Zuletzt geprüft:** 2026-11-24
- **Betroffen:**
  - `frontend/create-stack.js`, Zeile 213, Funktion `createDOMStack(openCards, tenStack, owner, playerColors)` (kein Parameter und keine Variable `playerColor`)
  - `frontend/create-stack.js`, Zeilen 252, 296, 312, 321 und 322 (Verwendung von `playerColor`)
  - `frontend/main.js`, Zeilen 41 bis 43 (Aufruf von `createDOMStack` mit nur drei Argumenten: `openCards`, `tenStack`, `handCards`)
- **Was ist das Problem:** Die Spielseite kann ihre Stapel nicht aufbauen. `createDOMStack()` benutzt an fünf Stellen `playerColor` (IDs `tenStackDiv…`, `handCardsDiv…`, Bild `images/back/….PNG`, Drehung bei Blau), aber diese Variable gibt es nicht mehr. Der frühere Zustand (`null` aus `sessionStorage`) ist damit nicht mehr der aktuelle: Jetzt entsteht eine `ReferenceError`, sobald die Funktion den Zehnerstapel erreicht.
- **Wieso tritt es auf:**
  1. `login.js` schreibt die Farbe nicht mehr in `sessionStorage`, sondern hängt sie als `?color=...` an die URL. `main.js` liest sie in Zeile 15 als `owner`.
  2. `createDOMStack()` hat zwar einen Parameter `owner`, benutzt aber im Code weiter den nicht mehr vorhandenen Namen `playerColor`.
  3. Der Aufruf in `main.js` passt ausserdem nicht zur Signatur: Die Funktion erwartet `(openCards, tenStack, owner, playerColors)`, bekommt aber `(openCards, tenStack, handCards)`. Die Handkarten und die Farbe kommen so nicht dort an, wo sie gebraucht werden.
- **Wann tritt es auf:** Beim Öffnen von `game.html?color=blue&roomId=123456`, sobald `createDOMStack()` bis Zeile 252 läuft (vorher bricht schon `createStartStack()` ab, siehe Hinweis unten).
- **Hinweis:** `createStartStack()` (`create-stack.js`, Zeilen 190 bis 203) ist zurzeit eine Baustelle: `color` und `roomId` sind dort nicht definiert, `response` statt `cards` wird gelesen, und `main.js` Zeile 37 wartet nicht mit `await` auf das Ergebnis. Das gehört zum laufenden Umbau auf das Backend. Wenn dort die Farbe sauber durchgereicht wird, muss BUG-025 im selben Schritt gelöst werden.
- **Wie schwierig zu fixen:** Eine Funktion und ihr Aufruf, die Ursache ist klar. Man muss nachverfolgen, wie Farbe und Stapel von `main.js` nach `create-stack.js` gelangen, und das passt direkt zum aktuellen Umbau von `createStartStack()`.

## BUG-020: Eingabeprüfung in `join_room()` gibt falsche Meldung, RoomID wird nicht getrimmt

- **Schweregrad:** Mittel
- **Aufwand:** 1 von 5
- **Typ:** Bug / Edge Case
- **Status:** Bestätigt
- **Gefunden am:** 2026-11-20
- **Zuletzt geprüft:** 2026-11-24
- **Betroffen:**
  - `backend/connection/routes.py`, Zeilen 30 bis 36, Funktion `join_room()`
- **Was ist das Problem:**
  1. Bei leerer RoomID kommt „Bitte eine Farbe auswählen.“ statt „Bitte eine RoomID eingeben“.
  2. Eine RoomID mit Leerzeichen davor oder dahinter (z. B. beim Kopieren) wird nicht gefunden (404), obwohl der Raum existiert.
- **Wieso tritt es auf:**
  1. Die erste Bedingung in Zeile 30 prüft mit `or` beide Felder zusammen. Ist `roomId` leer, greift schon sie. Der `elif`-Zweig in Zeilen 33/34 kann deshalb nie erreicht werden.
  2. `strip()` wird nur in der Prüfung benutzt. Gesucht wird in Zeile 36 mit dem ungetrimmten `data.roomId`. Das Frontend trimmt auch nicht (`getSubmitValues()`, `login.js` Zeile 18).
- **Wann tritt es auf:** Leere RoomID → `400 „Bitte eine Farbe auswählen.“`; `" 123456 "` → `404`, obwohl Raum `123456` existiert. (Am 21.11. geprüft, Code seitdem nur in der Zeilennummer verschoben.)
- **Wie schwierig zu fixen:** Nur eine Funktion, wenige Zeilen, und die Ursache ist klar. Leicht mit einzelnen Anfragen zu prüfen.

## BUG-027: Stapel im Raum haben zwei verschiedene Formate und einen doppelten Zehnerstapel

- **Schweregrad:** Klein
- **Aufwand:** 3 von 5
- **Typ:** Bug
- **Status:** Verdacht
- **Gefunden am:** 2026-11-21
- **Zuletzt geprüft:** 2026-11-24
- **Betroffen:**
  - `backend/connection/routes.py`, Zeilen 86 bis 92, Funktion `create_cards()`
  - `backend/connection/routes.py`, Zeilen 40 und 66, `join_room()` und `create_room()` (`"tenStack": {farbe: 10}`)
  - `backend/memory.py`, Zeilen 177 bis 209, `rooms` (Beispielräume mit Karten-IDs)
- **Was ist das Problem:** Ein Raum kann auf drei Arten aufgebaut sein: Die Beispielräume speichern in `stacks` nur Karten-IDs (`"blue-green-7"`), `create_cards()` speichert ganze Karten-Dictionaries (`{"id": ..., "owner": ..., "src": ...}`), und `create_room()`/`join_room()` führen zusätzlich `room["tenStack"][farbe]` als Zähler. Code, der später mit den Stapeln arbeitet, muss mit beiden Formaten umgehen können. Der Zähler und die Liste `stacks[farbe]["tenStack"]` können auseinanderlaufen.
- **Wieso tritt es auf:** `shuffle.getDivideStack()` gibt ganze Karten zurück, die unverändert gespeichert werden. Die Beispielräume in `memory.py` wurden mit IDs geschrieben. Der Zähler `tenStack` stammt aus der Zeit vor `stacks`.
- **Wann tritt es auf:** **Dafür:** `/createCards` auf Raum `123456` überschreibt die ID-Listen mit Dictionaries, beide Formate sind im selben Speicher möglich; Raum aus `/createRoom` hat nach `/createCards` sowohl `tenStack: {"blue": 10}` als auch `stacks.blue.tenStack` mit 10 Karten. **Dagegen:** Noch liest kein Code die Stapel aus dem Backend (das Frontend ist gerade erst dabei, `/createCards` anzubinden), es gibt also noch kein sichtbares Fehlverhalten. Vielleicht ist ein Format nur vorläufig gedacht.
- **Warum vor neuem Code:** Sobald das Frontend die Stapel vom Backend liest und Züge im Backend geprüft werden, baut alles auf diesem Format auf. Die Entscheidung ist jetzt billig, später muss sie überall nachgezogen werden.
- **Wie schwierig zu fixen:** Man muss zuerst entscheiden, wie ein Raum im Speicher aussehen soll (IDs oder ganze Karten, Zähler oder Liste). Danach müssen `memory.py`, `create_room()`, `join_room()` und `create_cards()` dazu passen. Löst BUG-024 mit.

---

# Teil 2: Später oder zurzeit nicht relevant

## BUG-017: Lokal behoben – API-Adresse und CORS vor dem Hosting anpassen

- **Schweregrad:** Kritisch (bei unveränderter Veröffentlichung; lokal behoben)
- **Aufwand:** 2 von 5
- **Typ:** Bug
- **Status:** Für die lokale Entwicklung behoben; Anpassung vor dem Hosting offen
- **Gefunden am:** 2026-11-20
- **Zuletzt geprüft:** 2026-11-24
- **Betroffen:**
  - `backend/connection/routes.py`, Zeilen 16 bis 21, Konfiguration der `CORSMiddleware`
  - `frontend/login.js`, Zeilen 51 und 71, `fetch("http://localhost:8000/...")` in den beiden Event-Listenern
  - `frontend/create-stack.js`, Zeile 191, `fetch("http://localhost:8000/createCards")` in `createStartStack()`
- **Lokal behoben:** Frontend unter `http://localhost:5500`, Backend auf Port 8000. Die CORS-Middleware gibt diesen Frontend-Origin frei. Die Startbefehle stehen oben in der README. Genau `localhost:5500` verwenden; `127.0.0.1:5500` ist nicht freigegeben.
- **Was ist das Problem:** Die derzeitigen Adressen passen zur lokalen Entwicklung. Bei einer unveränderten Veröffentlichung würden die API-Anfragen weiterhin an den Computer des jeweiligen Besuchers gehen. Die CORS-Freigabe enthält ausserdem noch keine öffentliche Website-Adresse. Der Eintrag bleibt auf ausdrücklichen Wunsch von Arun als Erinnerung für das Hosting bestehen.
- **Wieso tritt es auf:**
  1. `localhost` bezeichnet im Browser den Computer des Besuchers, nicht den Server, auf dem die Website gehostet wird.
  2. Bei unterschiedlichen Origins von Website und API braucht der Browser eine passende CORS-Freigabe. Derzeit ist nur `http://localhost:5500` eingetragen.
- **Wann tritt es auf:** Wenn die Website mit den aktuellen lokalen API-Adressen veröffentlicht wird. Bei der beschriebenen lokalen Entwicklung tritt der ursprüngliche CORS- und Portkonflikt nicht auf.
- **Warum erst später:** Hängt von der Hosting-Konfiguration ab, die noch nicht feststeht. Bei jeder neuen `fetch`-Stelle kommt eine weitere hartkodierte Adresse dazu; eine zentrale Konstante würde das späte Anpassen erleichtern.
- **Vor dem Hosting anpassen:** Die API-Adressen im Frontend auf die Bereitstellung abstimmen. Bei Website und API unter demselben Origin können relative Pfade wie `/api/joinRoom` verwendet werden, wenn der Server diese ans Backend weiterleitet; dafür ist kein CORS nötig. Bei unterschiedlichen Origins die öffentliche HTTPS-API-Adresse verwenden und den tatsächlichen Website-Origin im Backend freigeben.
- **Wie schwierig zu fixen:** Wenige Stellen in Frontend und Backend, deren Einstellungen von der noch festzulegenden Hosting-Konfiguration abhängen. Aufwand 2 von 5, weil Adressen, Weiterleitung und Browser-Origin zusammenpassen müssen.

## BUG-018: Fehler beim Beitreten oder Erstellen sieht der Spieler nicht

- **Schweregrad:** Mittel
- **Aufwand:** 3 von 5
- **Typ:** Bug / Edge Case
- **Status:** Bestätigt
- **Gefunden am:** 2026-11-20
- **Zuletzt geprüft:** 2026-11-24
- **Betroffen:**
  - `frontend/login.js`, Zeilen 46 bis 64, Submit-Listener von `loginForm` (nur `console.log(response)` im `else`)
  - `frontend/login.js`, Zeilen 68 bis 84, Klick-Listener von `createRoomButton` (kein `else`)
- **Was ist das Problem:** Das Frontend wartet mit `await` auf die Antwort und leitet nur bei Erfolg weiter. Bei einem Fehler passiert für den Spieler aber einfach nichts: Er sieht nicht, ob der Raum nicht existiert (404), die Farbe schon vergeben ist (409) oder die Eingabe ungültig ist (400). Beim Erstellen wird ein Fehler nicht einmal in der Konsole ausgegeben.
- **Wieso tritt es auf:**
  1. Im `else`-Zweig von „Beitreten“ steht nur `console.log(response)` und ein `todo`. Bei „Erstellen“ fehlt der `else`-Zweig ganz.
  2. Ist das Backend nicht erreichbar oder blockiert der Browser die Anfrage (BUG-017), wirft `fetch` eine Exception, statt eine Antwort zu liefern. Es gibt kein `try`/`catch`, deshalb bricht der Listener mit „Uncaught (in promise) TypeError: Failed to fetch“ ab.
- **Wann tritt es auf:** Beitreten mit einer RoomID, die es nicht gibt, z. B. `999999`: Backend antwortet `404`, auf der Seite ändert sich nichts. Oder: Backend nicht starten und auf „Erstelle einen neuen Room“ klicken: keine Reaktion.
- **Warum erst später:** Die Spiellogik hängt nicht davon ab. Es braucht eine Stelle für Meldungen auf der Startseite, die am besten zusammen mit dem geplanten Wartescreen (`todo` am Anfang von `login.js`) entworfen wird.
- **Wie schwierig zu fixen:** Betrifft beide Listener in `login.js`. Man muss mit asynchronem Code (Promises, Exceptions bei `fetch`) umgehen und entscheiden, was der Spieler bei jedem Fehlerfall (400, 404, 409, keine Verbindung) sieht. Dafür gibt es auf der Startseite bisher keine Stelle für Meldungen.

## BUG-024: Beitreten zu den Beispielräumen stürzt ab und blockiert die Farbe

- **Schweregrad:** Mittel
- **Aufwand:** 2 von 5
- **Typ:** Bug
- **Status:** Bestätigt
- **Gefunden am:** 2026-11-21
- **Zuletzt geprüft:** 2026-11-24
- **Betroffen:**
  - `backend/connection/routes.py`, Zeilen 39 bis 40, Funktion `join_room()`
  - `backend/memory.py`, Zeilen 177 bis 209, `rooms` (Beispielräume `123456` und `654321`)
  - `backend/connection/routes.py`, Zeile 66, Funktion `create_room()` (legt `tenStack` an, die Beispielräume nicht)
- **Was ist das Problem:** Wer einem der beiden Beispielräume beitritt, bekommt `500 Internal Server Error`. Die Farbe wird trotzdem im Raum eingetragen. Ein zweiter Versuch mit derselben Farbe gibt deshalb `409 „Diese Farbe ist bereits gewählt.“`, obwohl der erste Beitritt fehlgeschlagen ist.
- **Wieso tritt es auf:** Die Beispielräume in `memory.py` haben `stacks`, aber keinen Schlüssel `tenStack`. `join_room()` hängt in Zeile 39 zuerst die Farbe an `playerColors` an und greift erst danach in Zeile 40 auf `memory.rooms[data.roomId]["tenStack"]` zu. Dort entsteht ein `KeyError`. Der Raum bleibt in einem halb geänderten Zustand.
- **Wann tritt es auf:** `join_room(color="yellow", roomId="123456")` → `KeyError: 'tenStack'`, danach ist `playerColors` gleich `["blue", "pink", "yellow"]`. Räume, die mit `/createRoom` erstellt wurden, sind nicht betroffen.
- **Warum erst später:** Betrifft nur die zwei fest eingetragenen Testräume, nicht echte Spiele. Löst sich mit der Entscheidung zu BUG-027 (wenn der `tenStack`-Zähler wegfällt oder die Beispielräume angepasst werden).
- **Wie schwierig zu fixen:** Wenige Stellen, aber man muss zuerst entscheiden, wie ein Raum im Speicher aufgebaut ist (siehe BUG-027). Ausserdem spielt die Reihenfolge der Änderungen in `join_room()` eine Rolle, damit ein Fehler den Raum nicht halb verändert zurücklässt.

## BUG-019: Die RoomID wird auf der Spielseite nicht angezeigt

- **Schweregrad:** Mittel
- **Aufwand:** 2 von 5
- **Typ:** Bug
- **Status:** Bestätigt
- **Gefunden am:** 2026-11-20
- **Zuletzt geprüft:** 2026-11-24
- **Betroffen:**
  - `frontend/main.js`, Zeile 16, `const roomId = params.get("roomId")` (wird gelesen, aber nirgends verwendet)
  - `frontend/game.html` (keine Stelle, die die RoomID anzeigt)
- **Was ist das Problem:** Wer einen Raum erstellt, sieht dessen RoomID nur in der Adresszeile des Browsers. Auf der Spielseite steht sie nirgends. Mitspieler können nur beitreten, wenn der Ersteller die ID selbst aus der URL abliest.
- **Wieso tritt es auf:** `createRoom()` hängt die vom Backend erzeugte `data.roomId` an die URL. `main.js` liest sie in Zeile 16 aus, macht aber nichts damit. In `game.html` gibt es keine Stelle, die die RoomID anzeigt.
- **Wann tritt es auf:** Feld „RoomID“ leer lassen, Farbe wählen, „Erstelle einen neuen Room“ klicken. Die Spielseite zeigt keine RoomID.
- **Warum erst später:** Reine Anzeige. Passt zum geplanten Wartescreen, auf dem die Mitspieler ohnehin auf den Start warten und die RoomID gebraucht wird.
- **Wie schwierig zu fixen:** Die RoomID ist im Frontend schon vorhanden. Es fehlt nur eine Stelle auf der Seite, an der sie angezeigt wird. Dafür müssen `game.html` und `main.js` zusammen angepasst werden.

## BUG-021: Räume werden nie gelöscht, `create_room()` kann endlos laufen

- **Schweregrad:** Mittel
- **Aufwand:** 4 von 5
- **Typ:** Security / Edge Case
- **Status:** Bestätigt
- **Gefunden am:** 2026-11-20
- **Zuletzt geprüft:** 2026-11-24
- **Betroffen:**
  - `backend/connection/routes.py`, Zeilen 58 bis 60 und 66, Funktion `create_room()`
  - `backend/memory.py`, Zeile 177, `rooms`
- **Was ist das Problem:** Jeder Aufruf von `/createRoom` legt einen Raum in `memory.rooms` an, der nie wieder entfernt wird. Wer den Endpunkt oft aufruft, lässt den Speicher des Servers wachsen (Denial of Service). Sind alle 1 000 000 IDs vergeben, findet die `while`-Schleife keine freie ID mehr und läuft endlos; schon vorher wird sie immer langsamer. Mit `/createCards` wächst jeder Raum zusätzlich um 40 Karten pro Spieler.
- **Wieso tritt es auf:** Es gibt kein Limit, keine Begrenzung pro Client und kein Aufräumen leerer oder beendeter Räume. Die Schleife hat keine Abbruchbedingung ausser „freie ID gefunden“.
- **Wann tritt es auf:** Zurzeit nur, wenn jemand den Server gezielt mit Anfragen flutet. Läuft das Backend nur lokal, ist es kaum erreichbar; sobald es öffentlich erreichbar ist, schon.
- **Warum erst später:** Wird erst mit dem Hosting relevant und braucht das Konzept „wann endet ein Raum“, das erst mit dem Spielablauf entsteht.
- **Wie schwierig zu fixen:** Es fehlt bisher ein Konzept, wann ein Raum endet (Spiel vorbei, alle Spieler weg, Zeit abgelaufen). Das muss zuerst entschieden werden und betrifft später auch das Spiel selbst. Missbrauch durch viele Anfragen ist ausserdem schwer zu testen.

## BUG-026: `/createCards` mischt beliebig oft neu, später beigetretene Spieler haben keine Stapel

- **Schweregrad:** Klein
- **Aufwand:** 4 von 5
- **Typ:** Bug / Edge Case
- **Status:** Bestätigt
- **Gefunden am:** 2026-11-21
- **Zuletzt geprüft:** 2026-11-24
- **Betroffen:**
  - `backend/connection/routes.py`, Zeilen 73 bis 99, Funktion `create_cards()`
  - `backend/connection/routes.py`, Zeilen 36 bis 41, Funktion `join_room()`
- **Was ist das Problem:**
  1. Jeder Aufruf von `/createCards` mischt die Stapel **aller** Spieler im Raum neu und überschreibt die alten. Mitten im Spiel würde damit der ganze Spielstand zurückgesetzt. Jeder, der die RoomID kennt, kann das auslösen.
  2. Wer nach `/createCards` noch mit `/joinRoom` beitritt, steht in `playerColors`, hat aber keinen Eintrag in `stacks`.
- **Wieso tritt es auf:** `create_cards()` prüft nur, ob der Raum existiert, nicht ob die Karten schon verteilt wurden. `join_room()` prüft nicht, ob das Spiel schon begonnen hat.
- **Wann tritt es auf:** Raum mit Blau erstellen, `/createCards`, dann Pink beitreten → `stacks` enthält nur `blue`. Zweiter Aufruf von `/createCards` → die Stapel werden neu gemischt. Das Frontend ruft `/createCards` bereits auf (`create-stack.js`, `createStartStack()`, noch unfertig); jeder Spieler, der die Spielseite öffnet, würde so die Stapel aller anderen neu mischen.
- **Warum erst später:** Das Konzept „Spiel wartet auf Spieler / Spiel läuft“ entsteht mit dem geplanten Wartescreen und Start-Button (`todo` am Anfang von `login.js`). Dort wird dieser Bug automatisch mitgelöst. Bis dahin ist der Mehrspielerbetrieb ohnehin nicht fertig.
- **Wie schwierig zu fixen:** Es fehlt ein Konzept, wann ein Spiel startet und wer es starten darf (z. B. Zustand „wartet auf Spieler“ und „läuft“). Das betrifft beide Routen und später auch das Frontend (Warten auf Mitspieler).

## BUG-023: `requirements.txt` reicht nicht zum Starten des Backends

- **Schweregrad:** Klein
- **Aufwand:** 1 von 5
- **Typ:** Bug
- **Status:** Bestätigt
- **Gefunden am:** 2026-11-20
- **Zuletzt geprüft:** 2026-11-24
- **Betroffen:**
  - `requirements.txt`, Zeile 6, `fastapi`
- **Was ist das Problem:** Auf einem frisch eingerichteten Rechner lässt sich das Backend nach `pip install -r requirements.txt` nicht starten, weil `uvicorn` fehlt. Ausserdem ist `fastapi` ohne Version eingetragen, was dem Hinweis „Feste Versionen (==)“ oben in der Datei widerspricht; zwei Rechner können so verschiedene Versionen bekommen.
- **Wieso tritt es auf:** Das Paket `fastapi` bringt keinen Server mit (erst `fastapi[standard]` oder ein separates `uvicorn`). Im lokalen `.venv` sind `uvicorn 0.54.0`, `fastapi 0.165.0`, `starlette 1.10.0` und `pydantic 2.14.4` installiert, stehen aber nicht fixiert in `requirements.txt`. Für Tests der Routen mit `fastapi.testclient` fehlt zudem `httpx` im venv.
- **Wann tritt es auf:** Neues venv anlegen, `pip install -r requirements.txt`, dann `uvicorn backend.connection.routes:app` → `command not found: uvicorn`. Auf dem eigenen Rechner tritt es nicht auf, weil das venv schon alles hat (die README beschreibt den Zusatzbefehl `pip install uvicorn`).
- **Warum erst später:** Betrifft nur frische Installationen, z. B. auf einem anderen Rechner oder beim Hosting.
- **Wie schwierig zu fixen:** Nur eine Datei, und es ist klar, was fehlt. Man muss nur die passenden Versionen aus dem venv übernehmen.

## BUG-022: Gleichzeitige Anfragen können dieselbe Farbe doppelt vergeben

- **Schweregrad:** Klein
- **Aufwand:** 3 von 5
- **Typ:** Edge Case
- **Status:** Verdacht
- **Gefunden am:** 2026-11-20
- **Zuletzt geprüft:** 2026-11-24
- **Betroffen:**
  - `backend/connection/routes.py`, Zeilen 37 bis 40, Funktion `join_room()`
  - `backend/connection/routes.py`, Zeilen 58 bis 66, Funktion `create_room()`
- **Was ist das Problem:** Zwei Spieler, die fast gleichzeitig mit derselben Farbe demselben Raum beitreten, könnten beide angenommen werden. `playerColors` enthält die Farbe dann doppelt. Ähnlich könnten zwei gleichzeitige `create_room()` dieselbe ID bekommen.
- **Wieso tritt es auf:** Die Routen sind normale `def`-Funktionen; FastAPI führt sie parallel in einem Threadpool aus. Prüfen (`not in playerColors`) und Eintragen (`append`) sind zwei getrennte Schritte ohne Lock.
- **Wann tritt es auf:** Nur bei echt gleichzeitigen Anfragen. **Dafür:** Check-then-act ohne Lock ist ein klassisches Race-Muster. **Dagegen:** Durch den GIL und den sehr kurzen Abschnitt ist das Zeitfenster winzig, praktisch kaum auslösbar; nicht reproduziert.
- **Warum erst später:** Praktisch nicht auslösbar bei wenigen Spielern; relevant erst bei vielen gleichzeitigen Nutzern nach dem Hosting.
- **Wie schwierig zu fixen:** Wenige Stellen, aber Nebenläufigkeit ist schwer zu verstehen und noch schwerer zu testen, weil der Fehler kaum reproduzierbar ist. Ob ein Fix wirkt, sieht man nicht einfach durch Ausprobieren.
