# Bugs

Nächste freie ID: BUG-010

## BUG-003: Spielseite hängt sich ohne gültige Spielerfarbe in einer Endlosschleife auf
* **Schweregrad:** Kritisch
* **Typ:** Bug / Edge Case
* **Status:** Bestätigt
* **Gefunden am:** 2026-11-13
* **Zuletzt geprüft:** 2026-11-13
* **Betroffen:**
  * `frontend/create-stack.js`, Zeilen 197 bis 217, Funktion `createStartStack()`
  * `frontend/main.js`, Zeilen 27 bis 28, Aufruf `createStack.createStartStack(owner)`
* **Was ist das Problem:** Ist in `sessionStorage` keine gültige Farbe gespeichert, friert der Browser-Tab von `game.html` komplett ein. Die Seite reagiert nicht mehr und muss geschlossen werden.
* **Wieso tritt es auf:**
  1. `main.js` liest `owner` aus `sessionStorage`. Fehlt der Eintrag, ist `owner` `null`.
  2. `getDeck(null)` findet keine Karte und gibt `[]` zurück, `cards.length` ist also `0`.
  3. In der `for`-Schleife wird `index` immer `0` und `card = cards[0]` immer `undefined`.
  4. Im ersten Durchlauf wird `undefined` in `openCards` gelegt.
  5. Ab dem zweiten Durchlauf ist `openCards.includes(undefined)` immer `true`. Die `while`-Schleife in Zeile 207 zieht immer wieder `undefined` und endet nie.
* **Wann tritt es auf:** `game.html` direkt öffnen (Lesezeichen, URL eintippen, Seite in einem neuen Fenster ohne vorheriges Login) oder den Wert `playerColor` in `sessionStorage` verändern, z. B. auf `"red"`. Getestet mit Node: `createStartStack("blue")` liefert 3 / 10 / 27 Karten, `createStartStack(null)` kehrt nicht zurück und wurde nach 5 Sekunden abgebrochen.

## BUG-001: Relativer Import in `shuffle.py` funktioniert nur bei Start aus dem Projektordner
* **Schweregrad:** Mittel
* **Typ:** Bug
* **Status:** Verdacht
* **Gefunden am:** 2026-11-13
* **Zuletzt geprüft:** 2026-11-13
* **Betroffen:**
  * `backend/logic/shuffle.py`, Zeile 2, `from .. cards import CARDS`
* **Was ist das Problem:** `shuffle.py` lässt sich nur laden, wenn Python aus dem Projektordner `Ligretto/` startet und die Datei als Teil des Pakets `backend.logic` importiert wird. In allen anderen Fällen bricht das Laden ab, und die Kartenverteilung steht nicht zur Verfügung.
* **Wieso tritt es auf:** `..` bedeutet „ein Paket über `logic`“, also `backend`. Python kennt dieses Elternpaket nur, wenn `backend` selbst als Paket geladen wurde. Wird die Datei direkt gestartet, gibt es gar kein Paket. Läuft Python im Ordner `backend/`, ist `logic` das oberste Paket, und `..` zeigt darüber hinaus.
* **Wann tritt es auf:**
  * `python3 backend/logic/shuffle.py` → `ImportError: attempted relative import with no known parent package`
  * im Ordner `backend/`: `python3 -c "import logic.shuffle"` → `ImportError: attempted relative import beyond top-level package`
  * Funktioniert: aus `Ligretto/` mit `from backend.logic.shuffle import getDivideStack`
* **Dafür / dagegen:** Dafür spricht, dass ein späterer Server in `backend/` (z. B. in `connection/`) sehr wahrscheinlich aus dem Ordner `backend/` gestartet wird und dann genau in diesen Fehler läuft. Dagegen spricht, dass es noch keinen Startpunkt gibt. Wird der Server immer aus `Ligretto/` gestartet, tritt der Fehler nie auf.

## BUG-004: Zehnerstapel-Karte verschwindet, wenn sie auf eine offene Karte gelegt wird
* **Schweregrad:** Mittel
* **Typ:** Bug
* **Status:** Bestätigt
* **Gefunden am:** 2026-11-13
* **Zuletzt geprüft:** 2026-11-13
* **Betroffen:**
  * `frontend/main.js`, Zeilen 43 bis 65, Klick-Handler von `openCardsBottom`
  * `frontend/move-cards.js`, Zeile 41, `newLocation.appendChild(clickedCard)` in `moveCardsToPlayArea()`
* **Was ist das Problem:** Wählt man die oberste Zehnerstapel-Karte und klickt dann mitten auf eine offene Karte, verschwindet die Zehnerstapel-Karte vom Bildschirm. In den Daten steht sie aber in `openCards`. Die alte offene Karte bleibt ebenfalls in `openCards`, das Array wird also mit jedem Zug grösser.
* **Wieso tritt es auf:**
  1. Ein Klick auf die Kartenmitte trifft das `img` der offenen Karte, nicht das umgebende `div`. Also ist `clickedCard` das `img`.
  2. Die Prüfung in Zeile 46 schliesst nur den Container `#openCardsBottom` aus, nicht das `img`.
  3. `moveCardsToPlayArea()` hängt die Karte mit `appendChild` in dieses `img`. Ein `img` zeigt keine Kind-Elemente an, die Karte ist zwar im DOM, aber unsichtbar.
  4. In Zeile 57 wird die Karte in `openCards` gepusht, die überdeckte offene Karte wird aber nicht entfernt.
* **Wann tritt es auf:** Zehnerstapel-Karte anklicken (grüner Rahmen), dann auf das Bild einer offenen Karte klicken. Trifft man nur den Rand des `div`, wird die Karte daneben angezeigt statt darüber, und `openCards` wächst trotzdem.

## BUG-002: Unbekannte Spielerfarbe ergibt stillschweigend leere Stapel
* **Schweregrad:** Klein
* **Typ:** Edge Case
* **Status:** Bestätigt
* **Gefunden am:** 2026-11-13
* **Zuletzt geprüft:** 2026-11-13
* **Betroffen:**
  * `backend/logic/shuffle.py`, Zeilen 4 bis 12, Funktion `getPlayerCards()`
  * `backend/logic/shuffle.py`, Zeilen 23 bis 45, Funktion `getDivideStack()`
* **Was ist das Problem:** Bei einer Farbe, die es nicht gibt, liefert `getDivideStack()` drei leere Listen und keinen Fehler. Der Spieler hätte dann keine Karten, und niemand merkt, warum.
* **Wieso tritt es auf:** `getPlayerCards()` vergleicht `playerColor` exakt mit `"owner"`. Passt keine Karte, bleibt `playerCards` leer. `shuffle()` und die Schleife in `getDivideStack()` laufen dann ohne Fehler über eine leere Liste.
* **Wann tritt es auf:** `getDivideStack(CARDS, "red")`, `"Blue"` (Grossbuchstabe), `None` oder `""` ergeben jeweils `[], [], []` (getestet). Relevant wird das, sobald die Farbe vom Frontend kommt (z. B. aus `sessionStorage`, wo sie `null` sein oder vom Nutzer verändert werden kann). Im Frontend führt derselbe Fall zu BUG-003.

## BUG-005: Klick auf das Spielfeld ohne ausgewählte Karte wirft einen Fehler
* **Schweregrad:** Klein
* **Typ:** Edge Case
* **Status:** Bestätigt
* **Gefunden am:** 2026-11-13
* **Zuletzt geprüft:** 2026-11-13
* **Betroffen:**
  * `frontend/main.js`, Zeile 98, `activeField.style.border = "2px solid black";` im Klick-Handler von `playArea`
* **Was ist das Problem:** Klickt man auf ein Spielfeld-Feld oder eine liegende Karte, ohne vorher eine Karte ausgewählt zu haben, erscheint in der Konsole `TypeError: Cannot read properties of null (reading 'style')`. Sichtbar passiert nichts, das Spiel läuft danach weiter.
* **Wieso tritt es auf:** `activeField` ist `null`, solange keine Karte ausgewählt ist, und wird nach jedem Zug wieder auf `null` gesetzt (Zeile 118). Zeile 98 greift trotzdem auf `activeField.style` zu. Es fehlt eine Prüfung wie bei `openCardsBottom` (`activeField?.`). Im Code steht dazu bereits ein `FIXME` (Zeile 93).
* **Wann tritt es auf:** Seite laden und direkt auf ein leeres Feld im Spielfeld klicken, oder nach einem gelegten Zug ein zweites Mal ins Spielfeld klicken.

## BUG-006: Karte bleibt ausgewählt, obwohl der Rahmen nicht mehr grün ist
* **Schweregrad:** Klein
* **Typ:** Bug
* **Status:** Bestätigt
* **Gefunden am:** 2026-11-13
* **Zuletzt geprüft:** 2026-11-13
* **Betroffen:**
  * `frontend/main.js`, Zeilen 98 und 114, Klick-Handler von `playArea`
* **Was ist das Problem:** Legt man eine Karte, die keine 1 ist, auf ein leeres Feld, wird ihr Rahmen schwarz, als wäre die Auswahl aufgehoben. Sie ist aber weiterhin ausgewählt. Ein späterer Klick auf eine passende Karte im Spielfeld legt sie ab, obwohl der Spieler glaubt, nichts ausgewählt zu haben.
* **Wieso tritt es auf:** Zeile 98 setzt den Rahmen schwarz, bevor geprüft wird, ob der Zug erlaubt ist. Zeile 114 beendet die Funktion dann mit `return`, und `activeField = null` in Zeile 118 wird nie erreicht. Beim nicht erlaubten Zug auf eine Karte (Zeile 110) wird `activeField` dagegen zurückgesetzt, die beiden Fälle verhalten sich also unterschiedlich.
* **Wann tritt es auf:** Eine offene Karte mit Wert 5 auswählen, auf ein leeres Spielfeld-Feld klicken (Rahmen wird schwarz), dann auf eine liegende 4 derselben Farbe klicken: Die 5 wird gelegt.

## BUG-007: `isAllowed()` stürzt ab, wenn keine Zielkarte übergeben wird und die Karte keine 1 ist
* **Schweregrad:** Klein
* **Typ:** Edge Case
* **Status:** Bestätigt
* **Gefunden am:** 2026-11-13
* **Zuletzt geprüft:** 2026-11-13
* **Betroffen:**
  * `frontend/rules.js`, Zeilen 47 bis 55, Funktion `isAllowed()`
  * `frontend/rules.js`, Zeile 29, `card.id.slice(5)` in `getColor()`
* **Was ist das Problem:** Laut JSDoc darf `targetCard` `null` sein. Mit `null` und einer Karte, die keine 1 ist, wirft die Funktion aber `TypeError: Cannot read properties of null (reading 'id')`, statt `false` zurückzugeben.
* **Wieso tritt es auf:** Die erste Bedingung (Zeile 48) ist bei einer Nicht-1 `false`. Danach ruft Zeile 50 `getColor(targetCard)` mit `null` auf, und `getColor()` greift auf `null.id` zu.
* **Wann tritt es auf:** `isAllowed(null, karteMitWert5)`. Aktuell ruft `main.js` die Funktion nie mit `null` auf (leere Felder werden in Zeile 114 separat geprüft), deshalb fällt der Fehler im Spiel noch nicht auf.

## BUG-008: Grösse des Zehnerstapel-Containers passt nicht zu den Karten
* **Schweregrad:** Klein
* **Typ:** Bug
* **Status:** Bestätigt
* **Gefunden am:** 2026-11-13
* **Zuletzt geprüft:** 2026-11-13
* **Betroffen:**
  * `frontend/create-stack.js`, Zeilen 296 bis 299 (Containergrösse) und Zeilen 304, 309 und 310 (Versatz und Bildgrösse) in `createDOMStack()`
* **Was ist das Problem:** Der Container des Zehnerstapels ist breiter und höher als der Stapel selbst. Das schafft unnötigen Leerraum im Spielerbereich.
* **Wieso tritt es auf:** Der Container rechnet mit 80 × 120 px grossen Bildern und 2 px Versatz pro Karte (`84 + 9 * 2` = 102 px Breite). Die Bilder sind aber 60 × 90 px gross und um `i * 2.5` px versetzt, brauchen also nur etwa `64 + 9 * 2.5` = 86,5 px Breite und 116,5 px Höhe statt 142 px. Der Kommentar in Zeile 304 nennt 2 px, der Code verwendet 2,5 px.
* **Wann tritt es auf:** Immer beim Aufbau des Zehnerstapels.

## BUG-009: Label „Gib die RoomID ein“ gehört zu keinem Eingabefeld
* **Schweregrad:** Klein
* **Typ:** Bug
* **Status:** Bestätigt
* **Gefunden am:** 2026-11-13
* **Zuletzt geprüft:** 2026-11-13
* **Betroffen:**
  * `frontend/index.html`, Zeilen 20 und 21
* **Was ist das Problem:** Ein Klick auf den Text „Gib die RoomID ein“ setzt den Cursor nicht ins Eingabefeld, und Screenreader lesen das Feld ohne Beschriftung vor.
* **Wieso tritt es auf:** Das Label verweist mit `for="roomId"` auf eine ID, die es nicht gibt. Das Eingabefeld hat die ID `roomIdInput`. (`name="roomId"` zählt für `for` nicht.)
* **Wann tritt es auf:** Auf der Startseite auf den Label-Text klicken.
