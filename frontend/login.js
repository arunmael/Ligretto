 export function getSubmitValues () {
        const roomIdInputField = document.querySelector("#roomIdInput");
        const chosenColor = document.querySelector("#chosenColor");
        const roomId = roomIdInputField.value;
        const color = chosenColor.value;
        return { color, roomId }
    }


export function createRoom () {
        window.location.href = "game.html";
    };

export function joinRoom () {
        window.location.href = "game.html";
    };


document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector("#loginForm");
    const createRoomButton = document.querySelector("#createRoomButton");


    
    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const color = getSubmitValues().color;
        const roomId = getSubmitValues().roomId;
        sessionStorage.setItem("playerColor", color);
        sessionStorage.setItem("roomId", roomId);
        joinRoom();
    });


    createRoomButton.addEventListener("click", () => {
        createRoom();
    });
});