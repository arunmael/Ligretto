# Bugs

Nächste freie ID: BUG-015

## BUG-014: rules.py erwartet Karten-IDs mit Präfix „image“, das Backend kennt dieses Format nicht
* **Schweregrad:** Klein
* **Typ:** Edge Case
* **Status:** Verdacht
* **Gefunden am:** 2026-11-17
* **Zuletzt geprüft:** 2026-11-17
* **Betroffen:**
  * `backend/logic/rules.py`, Zeilen 1 bis 3, Funktion `getId()`
  * `backend/logic/rules.py`, Zeilen 22 bis 40, Funktion `isAllowed()`
* **Was ist das Problem:** `getId()` schneidet mit `card[5:]` immer die ersten 5 Zeichen ab. Das passt nur zu den DOM-IDs aus dem Frontend (`"imageblue-blue-1"`). Mit einer ID, wie sie in `cards.py` steht (`"blue-blue-1"`), wird die Karte nicht gefunden: Wert 0, Farbe `""`, und jeder Zug wird abgelehnt, sogar eine 1 auf ein leeres Feld. Mit einem Karten-Dictionary, wie es `shuffle.py` zurückgibt, stürzt die Funktion mit `KeyError` ab.
* **Wieso tritt es auf:** `rules.py` ist eine Übersetzung von `frontend/rules.js`, wo die Karte ein `<img>` mit der ID `"image<kartenId>"` ist. Im Backend gibt es dieses Präfix nicht: `cards.py` und `shuffle.py` arbeiten mit IDs ohne Präfix bzw. mit ganzen Dictionaries. Ausserdem gibt es keine Rückmeldung, wenn eine Karte nicht gefunden wird, deshalb fällt der Fehler nicht auf.
* **Wann tritt es auf:** `isAllowed(None, "blue-blue-1", CARDS)` gibt `False` zurück (getestet), obwohl eine 1 auf ein leeres Feld erlaubt ist. `isAllowed(None, CARDS[0], CARDS)` wirft `KeyError` (getestet). Zurzeit ruft niemand `rules.py` auf, deshalb ist das noch nicht auslösbar.
* **Wieso nur Verdacht:** Wenn das Frontend später dem Backend genau die DOM-ID (mit „image“) schickt, ist der Code richtig. Mit `"imageblue-blue-1"` funktionieren alle Regeln korrekt (getestet: 1 auf leer, 1→2 gleiche Farbe, falsche Farbe, Sprung 1→3). Ob es ein Bug ist, hängt davon ab, welches Format die Verbindung Frontend–Backend am Ende benutzt.
