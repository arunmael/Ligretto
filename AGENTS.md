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
