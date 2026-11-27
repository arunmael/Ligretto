/**
 * login.js – Startseite (index.html).
 * Liest RoomID und Kartenfarbe aus dem Formular, schickt sie ans Backend (/joinRoom bzw. /createRoom)
 * und zeigt bei Erfolg den Warteraum an. Mit "Starte das Spiel" geht es zur Spielseite, dabei werden
 * RoomID und Farbe als URL-Parameter (game.html?roomId=...&color=...) übergeben.
 */

//todo ein warte Screen einblenden mit einem Button (der Button nur sichtbar für die Person die den Raum erstellt hat) mit dem Button sagt man beginnt das Spiel. Das ist wichtig damit die Karten richtigen dargestellt werden in create-stack.js

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

// Blendet das Login-Formular aus und den Warteraum ein.
// Wird aufgerufen, sobald das Backend den Beitritt oder die Raumerstellung bestätigt hat.
export function openLobbyScreen() {
    let allFormItems = document.querySelectorAll("#loginForm > *")
    let allWaitingScreenItems = document.querySelectorAll("#loadingScreen > *")
    allFormItems.forEach(item => {
        item.hidden = true;
    });

    allWaitingScreenItems.forEach(item => {
        item.hidden = false
    })
}

// Gegenstück zu openLobbyScreen(): blendet den Warteraum aus und das Login-Formular wieder ein,
// damit der Spieler einem anderen Raum beitreten oder einen neuen erstellen kann.
export function joinOtherLobby() {
    let allFormItems = document.querySelectorAll("#loginForm > *")
    let allWaitingScreenItems = document.querySelectorAll("#loadingScreen > *")
    allFormItems.forEach(item => {
        item.hidden = false;
    });

    allWaitingScreenItems.forEach(item => {
        item.hidden = true
    })
}


/** Startet das Spiel: öffnet die Spielseite für den Raum. */
// Wird vom Button "Starte das Spiel" im Warteraum aufgerufen. Der Raum existiert zu diesem Zeitpunkt schon im Backend.
// roomId ist die RoomID des erstellten oder beigetretenen Raums, color die gewählte Kartenfarbe; beide landen in der URL.
// encodeURIComponent verhindert, dass Sonderzeichen wie & oder ? die URL kaputt machen.
export function startGame(roomId, color) {
    window.location.href = `game.html?roomId=${encodeURIComponent(roomId)}&color=${encodeURIComponent(color)}`;
};


// Verknüpft das geladene Formular mit Beitreten und Raumerstellung und die Buttons im Warteraum mit ihren Aktionen.
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector("#loginForm");
    const createRoomButton = document.querySelector("#createRoomButton");
    const startGameButton = document.querySelector("#startGame")
    const returnToStartScreen = document.querySelector("#joinOtherLobbey")
    let allWaitingScreenItems = document.querySelectorAll("#loadingScreen > *")
    // Ausserhalb der Listener, weil der "Starte das Spiel"-Button sie später braucht.
    // Gesetzt werden sie beim Beitreten bzw. beim Erstellen eines Raums.
    let data
    let color
    let roomId

    // Beim Laden ist nur das Login-Formular sichtbar, der Warteraum ist noch versteckt.
    allWaitingScreenItems.forEach(item => {
        item.hidden = true
    })

    // "Beitreten": Beitritt beim Backend melden und nur bei Erfolg den Warteraum anzeigen.
    // async, damit mit await auf die Antwort des Backends gewartet werden kann.
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault(); // verhindert, dass das Formular die Seite neu lädt
        color = getSubmitValues().color;
        roomId = getSubmitValues().roomId;
        // Meldet den Beitritt beim Backend (routes.py, join_room) und wartet auf die Antwort
        const response = await fetch("http://localhost:8000/joinRoom", {
            method: "Post",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({color, roomId})
        });
        // response.ok ist nur bei Status 200–299 true; 400, 404 und 409 landen im else
        if (response.ok) {
            data = await response.json(); // Antwort des Backends: {"roomId": ..., "color": ...}
            console.log(data)
            openLobbyScreen()
        } else {
            console.log(response)
            //todo den Error auf der Website anzeigen lassen
        }
    });



    // "Erstelle einen neuen Room": Raum im Backend anlegen, die neue RoomID merken und den Warteraum anzeigen.
    // Es wird nur die Farbe geschickt, weil das Backend die RoomID selbst erzeugt.
    createRoomButton.addEventListener("click", async () => {
        color = getSubmitValues().color;
        // Lässt das Backend einen Raum anlegen (routes.py, create_room); das Backend erzeugt die RoomID selbst
        const response = await fetch("http://localhost:8000/createRoom", {
            method: "Post",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({color}),
        });

        // Nur bei Erfolg den Warteraum anzeigen; bei einem Fehler passiert zurzeit nichts (siehe BUG-018)
        if (response.ok) {
            data = await response.json(); // enthält die neue RoomID, die der Spieler weitergeben muss
            roomId = data["roomId"] // beim Erstellen kommt die RoomID vom Backend, nicht aus dem Eingabefeld
            console.log(data)
            openLobbyScreen()
        }
    
        
    });


    // "Starte das Spiel": öffnet die Spielseite mit dem gemerkten Raum und der gewählten Farbe.
    startGameButton.addEventListener("click", () => {
        startGame(roomId, color)
    });

    // "Geh zurück in die Lobby": zurück zum Login-Formular.
    returnToStartScreen.addEventListener("click", () => {
        joinOtherLobby()
    });



});
