/**
 * login.js – Startseite (index.html).
 * Liest RoomID und Kartenfarbe aus dem Formular, schickt sie ans Backend (/joinRoom bzw. /createRoom)
 * und leitet bei Erfolg zur Spielseite weiter. RoomID und Farbe werden als URL-Parameter
 * (game.html?roomId=...&color=...) an die Spielseite übergeben.
 */

/**
 * Liest die aktuellen Formularwerte aus.
 * @returns {{color: string, roomId: string}}
 */
// Liest Farbe und RoomID aus dem Formular und gibt beide als Objekt zurück.
export function getSubmitValues() {
    const roomIdInputField = document.querySelector("#roomIdInput");
    const chosenColor = document.querySelector("#chosenColor");
    const roomId = roomIdInputField.value;
    const color = chosenColor.value;
    return { color, roomId }
}

/** Erstellt einen neuen Raum. Bisher nur Weiterleitung zur Spielseite. */
// Öffnet die Spielseite für den neu erstellten Raum. Der Raum selbst wurde vorher vom Backend angelegt.
// roomId ist die vom Backend erzeugte ID, color die gewählte Kartenfarbe; beide landen in der URL.
// encodeURIComponent verhindert, dass Sonderzeichen wie & oder ? die URL kaputt machen.
export function createRoom(roomId, color) {
    window.location.href = `game.html?roomId=${encodeURIComponent(roomId)}&color=${encodeURIComponent(color)}`;
};

/** Tritt einem bestehenden Raum bei. Bisher nur Weiterleitung zur Spielseite. */
// Öffnet die Spielseite des Raums, nachdem das Backend den Beitritt angenommen hat.
// roomId und color werden wie bei createRoom() als URL-Parameter übergeben.
export function joinRoom(roomId, color) {
    window.location.href = `game.html?roomId=${encodeURIComponent(roomId)}&color=${encodeURIComponent(color)}`;
};

// Verknüpft das geladene Formular mit Beitreten und Raumerstellung.
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector("#loginForm");
    const createRoomButton = document.querySelector("#createRoomButton");

    // "Beitreten": Beitritt beim Backend melden und nur bei Erfolg zur Spielseite weiterleiten.
    // async, damit mit await auf die Antwort des Backends gewartet werden kann.
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault(); // verhindert, dass das Formular die Seite neu lädt
        const color = getSubmitValues().color;
        const roomId = getSubmitValues().roomId;
        // Meldet den Beitritt beim Backend (routes.py, join_room) und wartet auf die Antwort
        const response = await fetch("http://localhost:8000/joinRoom", {
            method: "Post",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({color, roomId})
        });
        // response.ok ist nur bei Status 200–299 true; 400, 404 und 409 landen im else
        if (response.ok) {
            const data = await response.json(); // Antwort des Backends: {"roomId": ..., "color": ...}
            joinRoom(data.roomId, color);
        } else {
            console.log(response)
            //todo den Error auf der Website anzeigen lassen
        }
    });

    // "Erstelle einen neuen Room": Raum im Backend anlegen und mit der neuen RoomID zur Spielseite weiterleiten.
    // Es wird nur die Farbe geschickt, weil das Backend die RoomID selbst erzeugt.
    createRoomButton.addEventListener("click", async () => {
        const color = getSubmitValues().color;
        // Lässt das Backend einen Raum anlegen (routes.py, create_room); das Backend erzeugt die RoomID selbst
        const response = await fetch("http://localhost:8000/createRoom", {
            method: "Post",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({color}),
        });

        // Nur bei Erfolg weiterleiten; bei einem Fehler passiert zurzeit nichts (siehe BUG-018)
        if (response.ok) {
            const data = await response.json(); // enthält die neue RoomID, die der Spieler weitergeben muss
            createRoom(data.roomId, color);
        }
    
        
    });
});
