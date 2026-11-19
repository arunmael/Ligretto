# AGENTS.md – Regeln für KI-Agenten

Diese Regeln gelten für jeden KI-Agenten, der an diesem Projekt arbeitet.

## 1. Nichts ändern ohne zu fragen

- Keine Datei erstellen, ändern, verschieben oder löschen, ohne vorher bei Arun nachzufragen und ein OK zu bekommen.
- Vorschläge zuerst im Chat zeigen, erst nach dem OK umsetzen.
- Bei Unklarheiten immer nachfragen statt raten.

## 2. Jede neue oder geänderte Codezeile wird kommentiert

- Hinter jeder neuen oder angepassten Codezeile steht ein Kommentar, **wieso** es sie braucht und **warum** sie richtig ist.
- Beispiel:
  ```js
  const roomId = roomIdInputField.value.trim(); // trim() entfernt Leerzeichen, sonst findet das Backend den Raum nicht
  ```

## 3. Falscher Code wird nicht gelöscht, sondern auskommentiert

- Falscher Code bleibt stehen, wird auskommentiert und bekommt eine Erklärung, **wieso** er falsch ist.
- Beispiel:
  ```js
  // FALSCH: roomId wird nie an joinRoom() übergeben, deshalb weiss die Funktion nicht, welchem Raum beigetreten wird
  // login.joinRoom();
  login.joinRoom(roomId); // übergibt die eingegebene RoomID an joinRoom()
  ```

## 4. Dokumentation

- Jede Änderung wird in `Dokumentation/Dokumentation.md` eingetragen, auch im Änderungsprotokoll.
- Klar kennzeichnen, was von der KI (**[KI]**) und was von Arun (**[Arun]**) stammt.
- Zuoberst in der Dokumentation steht, dass sie von einer KI geschrieben und von Arun geprüft wurde.
- Deutsch mit Umlauten (ä, ö, ü) schreiben.

## 5. Code Fragen
- Code fragen werden so beantwortet als wärst du Stack Overflow
- Bei der Antwort wird so wenig von meinem Code wie möglich verändert, denn wenn ich frage was falsch ist und ich nur eine Zeile ändern müsste du mir aber eine komplet neue Funktion mit dem selben Ergebnis gibst bringt mir das nichts!


## 6. Bestehenden Code kommentieren (nur auf Aufforderung)

Gilt nur, wenn ich dich ausdrücklich bitte, Code zu kommentieren. Das ist etwas anderes als Regel 2:
* **Regel 2** gilt für Code, den du neu schreibst oder änderst. Dort wird jede Zeile kommentiert.
* **Regel 6** gilt für Code, der schon da ist und nur verständlicher werden soll.

### Grundregeln
* Am Code selbst wird **nichts** geändert: keine Logik, keine Namen, keine Formatierung, keine Reihenfolge, keine Leerzeilen. Es kommen nur Kommentare dazu.
* Es wird kommentiert wie in einer Firma, **nicht jede Zeile**:
  * Am Anfang jeder Datei steht ein kurzer Kommentar, was die Datei enthält.
  * Vor jeder Klasse und jeder Funktion steht ein kurzer Kommentar, der erklärt, was sie macht. Bei Funktionen, wenn es nicht offensichtlich ist, auch was rein- und was rausgeht.
  * In Python wird dafür ein Docstring (`"""…"""`) verwendet: bei Dateien zuoberst in der Datei, bei Klassen und Funktionen direkt unter `class` bzw. `def`. In JavaScript ein `//`-Kommentar über der Funktion bzw. Klasse.
  * In der Funktion nur dort ein Kommentar, wo etwas nicht selbsterklärend ist (z. B. eine Spielregel, ein Sonderfall).
  * Kein Kommentar, der nur wiederholt, was im Code sowieso steht.
* Kurz und knapp, damit ich die Funktion in einem halben Jahr schnell wieder verstehe.
* Wenn du etwas nicht verstehst, fragst du nach statt zu raten.

### Beispiel JavaScript
```js
// Prüft, ob eine Karte auf einen Stapel in der Mitte gelegt werden darf.
// Gibt true zurück, wenn Farbe und Zahl passen.
function canPlaceCard(card, pile) {
  if (pile.length === 0) return card.value === 1; // ein leerer Stapel darf nur mit einer 1 beginnen
  const top = pile[pile.length - 1];
  return top.color === card.color && top.value === card.value - 1;
}
```

### Beispiel Python
```python
"""Spielregeln: prüft, ob ein Spielzug erlaubt ist."""


def can_place_card(card, pile):
    """Prüft, ob eine Karte auf einen Stapel in der Mitte gelegt werden darf.

    Gibt True zurück, wenn Farbe und Zahl passen.
    """
    if not pile:
        return card.value == 1  # ein leerer Stapel darf nur mit einer 1 beginnen
    top = pile[-1]
    return top.color == card.color and top.value == card.value - 1
```

## 7. Bug Check bei Doku und Commit Messages

### Wann
Diesen Ablauf **jedes Mal** komplett durchführen, bevor du etwas anderes machst, wenn ich dich bitte:
* zu dokumentieren, oder
* eine Commit Message zu schreiben.

Kein Schritt darf übersprungen werden, auch nicht bei kleinen Änderungen.

### Grundregeln
1. **Du veränderst keinen Code.** Auch nicht kurz zum Testen und danach wieder zurück. Kein `git stash`, kein `git checkout`, kein `git reset`, kein Formatter, kein Autofix.
2. Die einzige Datei, die du in diesem Ablauf ändern darfst, ist `Bugs.md` im Root des Projekts. Existiert sie nicht, legst du sie an.
3. Du darfst Tests und den Build laufen lassen, um Bugs zu bestätigen oder zu prüfen, ob ein alter Bug gefixt ist. Danach muss der Projektzustand exakt gleich sein wie vorher: Vergleiche `git status` vor und nach dem Ablauf. Einziger erlaubter Unterschied ist `Bugs.md`.
4. Du fixt keine Bugs. Du findest, erklärst und dokumentierst sie nur.
5. Erfinde keine Bugs. Wenn du dir nicht sicher bist, markiere den Eintrag als **Verdacht** und schreib, was dafür und dagegen spricht.
6. Alles auf Deutsch.

### Ablauf

**Schritt 1: Änderungen sammeln**
Geprüft wird alles, was noch nicht committet ist:
* `git diff` (unstaged)
* `git diff --staged` (staged)
* neue, ungetrackte Dateien: `git ls-files --others --exclude-standard`

`Bugs.md` selbst gehört nicht dazu. Lies bei Bedarf den umliegenden Code, damit du die Änderungen im Kontext verstehst.

**Schritt 2: Neue Änderungen prüfen**
Prüfe die Änderungen auf:
* **Bugs:** falsche Logik, falsche Bedingungen, Off by one, falsche Rückgabewerte, nicht behandelte Fehler, Race Conditions, Speicher oder Ressourcen Leaks, kaputte Aufrufe von anderem Code.
* **Edge Cases:** leere Eingaben, `null` / `nil` / `undefined`, sehr grosse oder negative Werte, Sonderzeichen, gleichzeitige Zugriffe, Netzwerk oder Dateifehler, erster und letzter Durchlauf.
* **Security Lücken:** Injection (SQL, Command, HTML/XSS), fehlende Eingabevalidierung, unsichere Authentifizierung oder Autorisierung, Secrets oder Keys im Code, unsichere Dateipfade (Path Traversal), unsichere Abhängigkeiten, sensible Daten in Logs.

**Schritt 3: Alte Einträge in `Bugs.md` prüfen**
Prüfe **jeden** offenen Eintrag gegen den aktuellen Code (nicht nur gegen den Diff):
* **Gefixt:** Eintrag komplett aus `Bugs.md` löschen.
* **Noch offen:** Eintrag aktualisieren. Zeilennummern, Funktions oder Klassennamen, Beschreibung und Schweregrad an den aktuellen Stand anpassen. Zeilen verschieben sich, also immer neu nachschauen.
* **Nicht eindeutig:** Eintrag drin lassen und im Chat sagen, warum du es nicht sicher beurteilen kannst.

**Schritt 4: Neue Bugs in `Bugs.md` eintragen**
Jeder neu gefundene Bug kommt als eigener Eintrag rein und bleibt drin, bis er gefixt ist.

**Schritt 5: Bericht im Chat**
Siehe Format unten.

**Schritt 6: Commit Message (nur wenn ich danach gefragt habe)**
Erst nach dem Bericht. Die Message beschreibt die eigentlichen Änderungen. Am Ende ein kurzer Hinweis auf offene Bugs, z.B.:

```
Offene Bugs: BUG-004 (kritisch), BUG-007 (mittel), siehe Bugs.md
```

Wenn es keine offenen Bugs gibt, entfällt der Hinweis.

### Schweregrad
* **Kritisch:** Security Lücke, Datenverlust, Absturz oder Hauptfunktion kaputt.
* **Mittel:** Falsches Verhalten in bestimmten Fällen, Edge Case mit spürbaren Folgen.
* **Klein:** Seltener Edge Case, kleine Unschönheit mit wenig Auswirkung.

Security Lücken sind mindestens **Mittel**, im Zweifel **Kritisch**.

### Format von `Bugs.md`
IDs fortlaufend vergeben (`BUG-001`, `BUG-002`, ...). Eine ID wird nie wiederverwendet, auch wenn der Bug gelöscht wurde. Damit du die nächste freie ID kennst, steht oben im File ein Zähler. Einträge nach Dringlichkeit sortieren: Der Bug, der zuerst gefixt werden sollte, steht zuoberst. Zuerst nach Schweregrad (Kritisch vor Mittel vor Klein), innerhalb desselben Schweregrads nach Auswirkung (sichtbares Fehlverhalten im Spiel vor Fehlern ohne sichtbare Folgen, aktuell auslösbare Bugs vor solchen, die zurzeit nicht erreichbar sind). Diese Sortierung wird **jedes Mal automatisch** neu geprüft und angepasst, wenn `Bugs.md` verändert wird, auch ausserhalb des Bug-Check-Ablaufs.

```markdown
# Bugs

Nächste freie ID: BUG-008

## BUG-004: Kurzer, klarer Titel
* **Schweregrad:** Kritisch
* **Typ:** Bug / Edge Case / Security
* **Status:** Bestätigt / Verdacht
* **Gefunden am:** 2026-11-13
* **Zuletzt geprüft:** 2026-11-13
* **Betroffen:**
  * `src/api/user.ts`, Zeilen 42 bis 58, Funktion `updateUser()`
  * `src/db/query.ts`, Zeile 17, Funktion `runQuery()`
* **Was ist das Problem:** Was genau falsch läuft und was der Nutzer davon merkt.
* **Wieso tritt es auf:** Die technische Ursache, Schritt für Schritt.
* **Wann tritt es auf:** Konkretes Beispiel oder Eingabe, die den Bug auslöst.
```

Wenn `Bugs.md` keine offenen Bugs mehr hat, bleibt das File mit Titel und Zähler bestehen und darunter steht `Keine offenen Bugs.`

### Format des Chat Berichts
Immer in dieser Reihenfolge:

1. **Neu gefunden:** Jeder Bug ausführlich mit allen Feldern wie in `Bugs.md`: was das Problem ist, wieso es auftritt, wann es auftritt und **ganz genau welche Zeilen in welchem File** betroffen sind.
2. **Gelöst und aus `Bugs.md` entfernt:** ID, Titel und ein Satz, woran du erkennst, dass es gefixt ist.
3. **Weiterhin offen:** ID, Titel, Schweregrad und aktuelle Zeilen. Ausführlich nur, wenn sich am Bug etwas verändert hat.
4. **Nicht eindeutig:** Falls vorhanden, mit Begründung.
5. **Ausgeführte Befehle:** Welche Tests oder Builds du laufen gelassen hast und bestätigen, dass `git status` danach gleich ist wie vorher (bis auf `Bugs.md`).

Wenn nichts gefunden wurde, sag das klar, statt etwas zu erfinden.
## 8. Technische Dokumentation

### Was
`Dokumentation/Technische-Doku.md` beschreibt den **aktuellen Aufbau** des Projekts: Dateien, Funktionen, Datenmodell, Ablauf und Spielregeln. Sie ist kein Protokoll. Was wann von wem geändert wurde, steht weiterhin in `Dokumentation/Dokumentation.md` (Regel 4).

### Wann anpassen
Jedes Mal, wenn ich dich bitte zu dokumentieren, prüfst du **nach** dem Bug Check (Regel 7), ob sich durch die Änderungen am Aufbau etwas geändert hat. Nur dann passt du die technische Doku an:
* eine Datei oder ein Ordner kommt dazu, wird umbenannt oder gelöscht
* eine Funktion kommt dazu, wird umbenannt oder gelöscht
* Parameter oder Rückgabewerte einer Funktion ändern sich
* der Ablauf ändert sich (z. B. wenn Frontend und Backend verbunden werden)
* Datenmodell, IDs im DOM oder Spielregeln ändern sich

Bugfixes und kleine Änderungen ohne Auswirkung auf den Aufbau ändern die technische Doku **nicht**.

### Wie
* Beschreibe immer den aktuellen Stand und überschreibe veraltete Angaben. Es gibt keine Einträge wie „neu am …“, dafür ist das Änderungsprotokoll da.
* Keine Zeilennummern, denn sie veralten bei jeder Änderung. Verweise auf Dateien und Funktionsnamen.
* Keine Kennzeichnung mit [KI] und [Arun] pro Abschnitt. Der Hinweis zuoberst reicht.
* Datum „Stand“ oben in der Datei aktualisieren.
* Lies die Datei direkt vor dem Bearbeiten neu ein, damit keine Änderungen von anderen überschrieben werden.
* Im Chat kurz sagen, ob und welche Abschnitte angepasst wurden. Wenn nichts angepasst werden musste, auch das sagen.
* Deutsch mit Umlauten (ä, ö, ü) schreiben.
