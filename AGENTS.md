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


## 6. Code komentieren
- Wenn ich dich dazu auffordere den code im code zu kommentieren ist das erlaubt
- Du darfst mich fragen wenn du etwas nicht verstehst
- Du darfst den Code NICHT verändern
- Du sollst kurz verständlich und knapp kommentieren, so dass wenn ich in einem halbe Jahr die Funktion anschaue ich mittels Kommentare die Funktion selbst schnell verstehe

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
IDs fortlaufend vergeben (`BUG-001`, `BUG-002`, ...). Eine ID wird nie wiederverwendet, auch wenn der Bug gelöscht wurde. Damit du die nächste freie ID kennst, steht oben im File ein Zähler. Einträge nach Schweregrad sortieren, Kritisch zuoberst.

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