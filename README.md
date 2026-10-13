# Ligretto

Online-Multiplayer-Version des Kartenspiels Ligretto im Browser.

## Stand

Das Projekt ist in einer frühen Phase:

- **Frontend:** Startseite, auf der man einem Room beitreten oder einen neuen Room erstellen kann. Spielseite und Regelseite sind noch leer.
- **Backend:** noch nicht begonnen.

## Projekt starten

Weil die JavaScript-Dateien als ES-Module geladen werden, muss das Frontend über einen lokalen Webserver laufen (nicht per Doppelklick auf `index.html`). Zum Beispiel:

```bash
cd frontend
python3 -m http.server 8000
```

Danach im Browser `http://localhost:8000` öffnen.

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
