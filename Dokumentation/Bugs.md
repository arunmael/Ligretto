# Bugs

Nächste freie ID: BUG-012

## BUG-011: Mit ausgewählter Zehnerstapel-Karte lässt sich keine offene Karte mehr auswählen
* **Schweregrad:** Klein
* **Typ:** Bug
* **Status:** Bestätigt
* **Gefunden am:** 2026-11-14
* **Zuletzt geprüft:** 2026-11-14
* **Betroffen:**
  * `frontend/main.js`, Zeilen 51 bis 53, Klick-Handler von `openCardsBottom`
* **Was ist das Problem:** Ist die oberste Zehnerstapel-Karte ausgewählt (grüner Rahmen) und klickt man auf eine belegte offene Karte, passiert nichts: Die offene Karte wird nicht ausgewählt, die Zehnerstapel-Karte bleibt grün. Der Spieler bekommt keine Rückmeldung.
* **Wieso tritt es auf:** Sobald `isTenStackCard` `true` ist, läuft der Klick immer in den ersten Zweig (Zeile 51). Dort beendet Zeile 53 die Funktion mit `return`, wenn der Platz schon ein `img` enthält. Der `else`-Zweig mit der Auswahl (Zeilen 67 bis 71) wird dadurch nie erreicht.
* **Wann tritt es auf:** Zehnerstapel-Karte anklicken, danach auf eine offene Karte klicken. Umgehen lässt es sich nur, indem man die Zehnerstapel-Karte zuerst ins Spielfeld klickt.

## BUG-002: Unbekannte Spielerfarbe ergibt stillschweigend leere Stapel
* **Schweregrad:** Klein
* **Typ:** Edge Case
* **Status:** Bestätigt
* **Gefunden am:** 2026-11-13
* **Zuletzt geprüft:** 2026-11-14
* **Betroffen:**
  * `backend/logic/shuffle.py`, Zeilen 3 bis 11, Funktion `getPlayerCards()`
  * `backend/logic/shuffle.py`, Zeilen 22 bis 44, Funktion `getDivideStack()`
* **Was ist das Problem:** Bei einer Farbe, die es nicht gibt, liefert `getDivideStack()` drei leere Listen und keinen Fehler. Der Spieler hätte dann keine Karten, und niemand merkt, warum.
* **Wieso tritt es auf:** `getPlayerCards()` vergleicht `playerColor` exakt mit `"owner"`. Passt keine Karte, bleibt `playerCards` leer. `shuffle()` und die Schleife in `getDivideStack()` laufen dann ohne Fehler über eine leere Liste.
* **Wann tritt es auf:** `getDivideStack(CARDS, "red")`, `"Blue"` (Grossbuchstabe), `None` oder `""` ergeben jeweils `[], [], []` (getestet). Relevant wird das, sobald die Farbe vom Frontend kommt (z. B. aus `sessionStorage`, wo sie `null` sein oder vom Nutzer verändert werden kann). Im Frontend fängt `main.js` denselben Fall inzwischen ab (siehe BUG-003).

## BUG-003: `createStartStack()` hängt bei unbekannter Farbe in einer Endlosschleife (zurzeit von `main.js` abgefangen)
* **Schweregrad:** Klein
* **Typ:** Edge Case
* **Status:** Bestätigt
* **Gefunden am:** 2026-11-13
* **Zuletzt geprüft:** 2026-11-14
* **Betroffen:**
  * `frontend/create-stack.js`, Zeilen 197 bis 217, Funktion `createStartStack()`
* **Was ist das Problem:** Die Funktion selbst kehrt bei einer Farbe ohne Karten (`null`, `"red"`, `""`) nie zurück und friert den Tab ein. Im Spiel passiert das nicht mehr, weil `main.js` (Zeilen 11 bis 16) die Farbe vor dem Aufruf prüft und sonst zur Startseite zurückleitet. Ruft später eine andere Stelle die Funktion ohne diese Prüfung auf, tritt der Fehler wieder auf.
* **Wieso tritt es auf:**
  1. `getDeck()` findet keine Karte und gibt `[]` zurück, `cards.length` ist `0`.
  2. `index` ist immer `0`, `card = cards[0]` immer `undefined`.
  3. Im ersten Durchlauf wird `undefined` in `openCards` gelegt.
  4. Ab dem zweiten Durchlauf ist `openCards.includes(undefined)` immer `true`, die `while`-Schleife in Zeile 207 endet nie.
* **Wann tritt es auf:** `createStartStack(null)` direkt aufrufen (in Node getestet, nach 5 Sekunden abgebrochen). Über `game.html` nicht mehr auslösbar.

## BUG-005: Klick auf das Spielfeld ohne ausgewählte Karte wirft einen Fehler
* **Schweregrad:** Klein
* **Typ:** Edge Case
* **Status:** Bestätigt
* **Gefunden am:** 2026-11-13
* **Zuletzt geprüft:** 2026-11-14
* **Betroffen:**
  * `frontend/main.js`, Zeile 96, `activeField.style.border = "2px solid black";` im Klick-Handler von `playArea`
* **Was ist das Problem:** Klickt man auf ein Spielfeld-Feld oder eine liegende Karte, ohne vorher eine Karte ausgewählt zu haben, erscheint in der Konsole `TypeError: Cannot read properties of null (reading 'style')`. Sichtbar passiert nichts, das Spiel läuft danach weiter.
* **Wieso tritt es auf:** `activeField` ist `null`, solange keine Karte ausgewählt ist, und wird nach jedem Zug wieder auf `null` gesetzt (Zeile 115). Zeile 96 greift trotzdem auf `activeField.style` zu. Es fehlt eine Prüfung wie bei `openCardsBottom` (`activeField?.`). Im Code steht dazu bereits ein `FIXME` (Zeile 91).
* **Wann tritt es auf:** Seite laden und direkt auf ein leeres Feld im Spielfeld klicken, oder nach einem gelegten Zug ein zweites Mal ins Spielfeld klicken.

## BUG-006: Karte bleibt ausgewählt, obwohl der Rahmen nicht mehr grün ist
* **Schweregrad:** Klein
* **Typ:** Bug
* **Status:** Bestätigt
* **Gefunden am:** 2026-11-13
* **Zuletzt geprüft:** 2026-11-14
* **Betroffen:**
  * `frontend/main.js`, Zeilen 96 und 111, Klick-Handler von `playArea`
* **Was ist das Problem:** Legt man eine Karte, die keine 1 ist, auf ein leeres Feld, wird ihr Rahmen schwarz, als wäre die Auswahl aufgehoben. Sie ist aber weiterhin ausgewählt. Ein späterer Klick auf eine passende Karte im Spielfeld legt sie ab, obwohl der Spieler glaubt, nichts ausgewählt zu haben.
* **Wieso tritt es auf:** Zeile 96 setzt den Rahmen schwarz, bevor geprüft wird, ob der Zug erlaubt ist. Zeile 111 beendet die Funktion dann mit `return`, und `activeField = null` in Zeile 115 wird nie erreicht. Beim nicht erlaubten Zug auf eine Karte (Zeilen 107 und 108) wird `activeField` dagegen zurückgesetzt, die beiden Fälle verhalten sich also unterschiedlich.
* **Wann tritt es auf:** Eine offene Karte mit Wert 5 auswählen, auf ein leeres Spielfeld-Feld klicken (Rahmen wird schwarz), dann auf eine liegende 4 derselben Farbe klicken: Die 5 wird gelegt.

## BUG-007: `isAllowed()` stürzt ab, wenn keine Zielkarte übergeben wird und die Karte keine 1 ist
* **Schweregrad:** Klein
* **Typ:** Edge Case
* **Status:** Bestätigt
* **Gefunden am:** 2026-11-13
* **Zuletzt geprüft:** 2026-11-14
* **Betroffen:**
  * `frontend/rules.js`, Zeilen 47 bis 55, Funktion `isAllowed()`
  * `frontend/rules.js`, Zeile 29, `card.id.slice(5)` in `getColor()`
* **Was ist das Problem:** Laut JSDoc darf `targetCard` `null` sein. Mit `null` und einer Karte, die keine 1 ist, wirft die Funktion aber `TypeError: Cannot read properties of null (reading 'id')`, statt `false` zurückzugeben.
* **Wieso tritt es auf:** Die erste Bedingung (Zeile 48) ist bei einer Nicht-1 `false`. Danach ruft Zeile 50 `getColor(targetCard)` mit `null` auf, und `getColor()` greift auf `null.id` zu.
* **Wann tritt es auf:** `isAllowed(null, karteMitWert5)`. Aktuell ruft `main.js` die Funktion nie mit `null` auf (leere Felder werden in Zeile 111 separat geprüft), deshalb fällt der Fehler im Spiel noch nicht auf.

## BUG-008: Grösse des Zehnerstapel-Containers passt nicht zu den Karten
* **Schweregrad:** Klein
* **Typ:** Bug
* **Status:** Bestätigt
* **Gefunden am:** 2026-11-13
* **Zuletzt geprüft:** 2026-11-14
* **Betroffen:**
  * `frontend/create-stack.js`, Zeilen 296 bis 299 (Containergrösse) und Zeilen 304, 309 und 310 (Versatz und Bildgrösse) in `createDOMStack()`
* **Was ist das Problem:** Der Container des Zehnerstapels ist breiter und höher als der Stapel selbst. Das schafft unnötigen Leerraum im Spielerbereich.
* **Wieso tritt es auf:** Der Container rechnet mit 80 × 120 px grossen Bildern und 2 px Versatz pro Karte (`84 + 9 * 2` = 102 px Breite). Die Bilder sind aber 60 × 90 px gross und um `i * 2.5` px versetzt, brauchen also nur etwa `64 + 9 * 2.5` = 86,5 px Breite und 116,5 px Höhe statt 142 px. Die Kommentare in den Zeilen 298 und 299 weisen inzwischen darauf hin.
* **Wann tritt es auf:** Immer beim Aufbau des Zehnerstapels.

## BUG-009: Label „Gib die RoomID ein“ gehört zu keinem Eingabefeld
* **Schweregrad:** Klein
* **Typ:** Bug
* **Status:** Bestätigt
* **Gefunden am:** 2026-11-13
* **Zuletzt geprüft:** 2026-11-14
* **Betroffen:**
  * `frontend/index.html`, Zeilen 20 und 21
* **Was ist das Problem:** Ein Klick auf den Text „Gib die RoomID ein“ setzt den Cursor nicht ins Eingabefeld, und Screenreader lesen das Feld ohne Beschriftung vor.
* **Wieso tritt es auf:** Das Label verweist mit `for="roomId"` auf eine ID, die es nicht gibt. Das Eingabefeld hat die ID `roomIdInput`. (`name="roomId"` zählt für `for` nicht.)
* **Wann tritt es auf:** Auf der Startseite auf den Label-Text klicken.
