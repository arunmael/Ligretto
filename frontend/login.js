/**
 * login.js – Startseite (index.html).
 * Liest RoomID und Kartenfarbe aus dem Formular, speichert sie in sessionStorage
 * und leitet zur Spielseite weiter. Noch ohne Backend.
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
// Öffnet bisher nur die Spielseite; legt noch keinen Raum im Backend an.
export function createRoom() {
    window.location.href = "game.html";
};

/** Tritt einem bestehenden Raum bei. Bisher nur Weiterleitung zur Spielseite. */
// Öffnet bisher nur die Spielseite; prüft noch keinen Raum im Backend.
export function joinRoom() {
    window.location.href = "game.html";
};

// Verknüpft das geladene Formular mit Beitreten und Raumerstellung.
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector("#loginForm");
    const createRoomButton = document.querySelector("#createRoomButton");

    // "Beitreten": Farbe und RoomID für game.html speichern, dann weiterleiten
    loginForm.addEventListener("submit", (event) => {
        event.preventDefault(); // verhindert, dass das Formular die Seite neu lädt
        const color = getSubmitValues().color;
        const roomId = getSubmitValues().roomId;
        sessionStorage.setItem("playerColor", color);
        sessionStorage.setItem("roomId", roomId);
        joinRoom();
    });

    // "Erstelle einen neuen Room": Farbe und RoomID für game.html speichern, dann weiterleiten
    createRoomButton.addEventListener("click", () => {
        const color = getSubmitValues().color;
        const roomId = getSubmitValues().roomId;
        sessionStorage.setItem("playerColor", color);
        sessionStorage.setItem("roomId", roomId);
        createRoom();
    });
});
