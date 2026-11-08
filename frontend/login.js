/**
 * login.js – Startseite (index.html).
 * Liest RoomID und Kartenfarbe aus dem Formular, speichert sie in sessionStorage
 * und leitet zur Spielseite weiter. Noch ohne Backend.
 */

/**
 * Liest die aktuellen Formularwerte aus.
 * @returns {{color: string, roomId: string}}
 */
 export function getSubmitValues () {
        const roomIdInputField = document.querySelector("#roomIdInput");
        const chosenColor = document.querySelector("#chosenColor");
        const roomId = roomIdInputField.value;
        const color = chosenColor.value;
        return { color, roomId }
    }


/** Erstellt einen neuen Raum. Bisher nur Weiterleitung zur Spielseite. */
export function createRoom () {
        window.location.href = "game.html";
    };

/** Tritt einem bestehenden Raum bei. Bisher nur Weiterleitung zur Spielseite. */
export function joinRoom () {
        window.location.href = "game.html";
    };


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


    // FIXME: Hier wird keine Farbe gespeichert, auf game.html ist playerColor dann null.
    createRoomButton.addEventListener("click", () => {
        const color = getSubmitValues().color;
        const roomId = getSubmitValues().roomId;
        sessionStorage.setItem("playerColor", color);
        sessionStorage.setItem("roomId", roomId);
        createRoom();
    });
});