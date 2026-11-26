# Ligretto

## Lokal starten – Befehle für Arun

**[KI]** Zwei Terminals öffnen und die folgenden Befehle ausführen. Die Python-Umgebung `.venv` mit Uvicorn ist auf deinem Computer bereits vorhanden.

In jedem neuen macOS-Terminal zuerst `setopt interactivecomments` eingeben. Damit akzeptiert zsh die erklärenden Kommentare hinter den folgenden Befehlen beim Kopieren.

**Terminal 1 – Backend:**

```bash
cd "$HOME/cresta/Programmieren/Eigene Projekte/Ligretto" # wechselt ins Projekt, damit Python die Backend-Module findet
source .venv/bin/activate # aktiviert die Projektumgebung mit dem installierten Uvicorn
python -m uvicorn backend.connection.routes:app --port 8000 # startet die API auf dem Port, den login.js anspricht
```

**Terminal 2 – Frontend:**

```bash
cd "$HOME/cresta/Programmieren/Eigene Projekte/Ligretto/frontend" # liefert nur die Dateien der Website aus
python3 -m http.server 5500 # nutzt einen eigenen Port, der in der CORS-Freigabe des Backends steht
```

**Danach im Browser öffnen: [http://localhost:5500](http://localhost:5500).** Genau `localhost` verwenden: `127.0.0.1:5500` ist derzeit nicht in der CORS-Freigabe enthalten.

Beide Terminals offen lassen. Mit **Ctrl+C** im jeweiligen Terminal stoppst du den Server. Bei jedem Neustart die Befehle erneut ausführen. Port **5500** liefert die Website, Port **8000** verarbeitet deren Anfragen. Damit ist BUG-017 für diese lokale Konfiguration behoben; andere bekannte Spielfehler bleiben bestehen.

**Nur bei einer neuen Python-Umgebung:** Im Projektordner einmalig ausführen, danach wie oben starten. Auf Aruns bestehendem Computer ist das nicht nötig.

```bash
python3 -m venv .venv # erstellt eine eigene Python-Umgebung, falls noch keine vorhanden ist
source .venv/bin/activate # installiert die Pakete anschliessend in die Projektumgebung
python -m pip install -r requirements.txt # installiert die aufgeführten Projektabhängigkeiten
python -m pip install uvicorn # ergänzt den Server, der bisher in requirements.txt fehlt (BUG-023)
```

Online-Multiplayer-Version des Kartenspiels Ligretto im Browser.

## Stand

Das Projekt ist in einer frühen Phase:

- **Frontend:** Startseite, auf der man einem Room beitreten oder einen neuen Room erstellen kann. Spielseite und Regelseite sind noch leer.
- **Backend:** noch nicht begonnen.

## Projekt starten

Weil die JavaScript-Dateien als ES-Module geladen werden, muss das Frontend über einen lokalen Webserver laufen (nicht per Doppelklick auf `index.html`).

Die vollständigen Befehle für Backend und Frontend stehen oben unter „Lokal starten“. Das Frontend verwendet Port **5500**, das Backend Port **8000**.

## Struktur

| Ordner / Datei | Inhalt |
|---|---|
| `frontend/` | Website (HTML, CSS, JavaScript, Kartenbilder) |
| `backend/` | Server (noch leer) |
| `Dokumentation/` | Ausführliche Projektdokumentation |
| `AGENTS.md` | Regeln für KI-Agenten |

## Dokumentation

Die ausführliche Dokumentation liegt in [Dokumentation/Dokumentation.md](Dokumentation/Dokumentation.md).

## Autor

Arun
