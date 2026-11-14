# Bugs

Nächste freie ID: BUG-013

## BUG-006: Karte bleibt ausgewählt, obwohl der Rahmen nicht mehr grün ist
* **Schweregrad:** Klein
* **Typ:** Bug
* **Status:** Bestätigt
* **Gefunden am:** 2026-11-13
* **Zuletzt geprüft:** 2026-11-14
* **Betroffen:**
  * `frontend/main.js`, Zeilen 107 und 122, Klick-Handler von `playArea`
* **Was ist das Problem:** Legt man eine Karte, die keine 1 ist, auf ein leeres Feld, wird ihr Rahmen schwarz, als wäre die Auswahl aufgehoben. Sie ist aber weiterhin ausgewählt. Ein späterer Klick auf eine passende Karte im Spielfeld legt sie ab, obwohl der Spieler glaubt, nichts ausgewählt zu haben.
* **Wieso tritt es auf:** Zeile 107 setzt den Rahmen schwarz, bevor geprüft wird, ob der Zug erlaubt ist. Zeile 122 beendet die Funktion dann mit `return`, und `activeField = null` in Zeile 126 wird nie erreicht. Beim nicht erlaubten Zug auf eine Karte (Zeilen 118 und 119) wird `activeField` dagegen zurückgesetzt, die beiden Fälle verhalten sich also unterschiedlich.
* **Wann tritt es auf:** Eine offene Karte mit Wert 5 auswählen, auf ein leeres Spielfeld-Feld klicken (Rahmen wird schwarz), dann auf eine liegende 4 derselben Farbe klicken: Die 5 wird gelegt.

## BUG-005: Klick auf das Spielfeld ohne ausgewählte Karte wirft einen Fehler
* **Schweregrad:** Klein
* **Typ:** Edge Case
* **Status:** Bestätigt
* **Gefunden am:** 2026-11-13
* **Zuletzt geprüft:** 2026-11-14
* **Betroffen:**
  * `frontend/main.js`, Zeile 107, `activeField.style.border = "2px solid black";` im Klick-Handler von `playArea`
* **Was ist das Problem:** Klickt man auf ein Spielfeld-Feld oder eine liegende Karte, ohne vorher eine Karte ausgewählt zu haben, erscheint in der Konsole `TypeError: Cannot read properties of null (reading 'style')`. Sichtbar passiert nichts, das Spiel läuft danach weiter.
* **Wieso tritt es auf:** `activeField` ist `null`, solange keine Karte ausgewählt ist, und wird nach jedem Zug wieder auf `null` gesetzt (Zeile 126). Zeile 107 greift trotzdem auf `activeField.style` zu. Es fehlt eine Prüfung wie bei `openCardsBottom` (`activeField?.`). Im Code steht dazu bereits ein `FIXME` (Zeile 102).
* **Wann tritt es auf:** Seite laden und direkt auf ein leeres Feld im Spielfeld klicken, oder nach einem gelegten Zug ein zweites Mal ins Spielfeld klicken.

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

## BUG-008: Grösse des Zehnerstapel-Containers passt nicht zu den Karten
* **Schweregrad:** Klein
* **Typ:** Bug
* **Status:** Bestätigt
* **Gefunden am:** 2026-11-13
* **Zuletzt geprüft:** 2026-11-14
* **Betroffen:**
  * `frontend/create-stack.js`, Zeilen 302 und 303 (Containergrösse) und Zeilen 308, 313 und 314 (Versatz und Bildgrösse) in `createDOMStack()`
* **Was ist das Problem:** Der Container des Zehnerstapels ist breiter und höher als der Stapel selbst. Das schafft unnötigen Leerraum im Spielerbereich.
* **Wieso tritt es auf:** Der Container rechnet mit 80 × 120 px grossen Bildern und 2 px Versatz pro Karte (`84 + 9 * 2` = 102 px Breite). Die Bilder sind aber 60 × 90 px gross und um `i * 2.5` px versetzt, brauchen also nur etwa `64 + 9 * 2.5` = 86,5 px Breite und 116,5 px Höhe statt 142 px. Die Kommentare in den Zeilen 302 und 303 weisen inzwischen darauf hin.
* **Wann tritt es auf:** Immer beim Aufbau des Zehnerstapels.

## BUG-007: `isAllowed()` stürzt ab, wenn keine Zielkarte übergeben wird und die Karte keine 1 ist
* **Schweregrad:** Klein
* **Typ:** Edge Case
* **Status:** Bestätigt
* **Gefunden am:** 2026-11-13
* **Zuletzt geprüft:** 2026-11-14
* **Betroffen:**
  * `frontend/rules.js`, Zeilen 46 bis 55, Funktion `isAllowed()`
  * `frontend/rules.js`, Zeile 29, `card.id.slice(5)` in `getColor()`
* **Was ist das Problem:** Laut JSDoc darf `targetCard` `null` sein. Mit `null` und einer Karte, die keine 1 ist, wirft die Funktion aber `TypeError: Cannot read properties of null (reading 'id')`, statt `false` zurückzugeben.
* **Wieso tritt es auf:** Die erste Bedingung (Zeile 47) ist bei einer Nicht-1 `false`. Danach ruft Zeile 49 `getColor(targetCard)` mit `null` auf, und `getColor()` greift auf `null.id` zu.
* **Wann tritt es auf:** `isAllowed(null, karteMitWert5)`. Aktuell ruft `main.js` die Funktion nie mit `null` auf (leere Felder werden in Zeile 122 separat geprüft), deshalb fällt der Fehler im Spiel noch nicht auf.
