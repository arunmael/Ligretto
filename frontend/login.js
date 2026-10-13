document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector("#loginForm");
    const roomIdInputField = document.querySelector("#roomIdInput");
    const createRoomButton = document.querySelector("#createRoomButton");
    let roomId = ""

    function createRoom () {
        window.location.href = "game.html";
    };


    function joinRoom () {
        window.location.href = "game.html";
    };

    
    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();
        roomId = roomIdInputField.value;
        joinRoom();

    });


    createRoomButton.addEventListener("click", () => {
        createRoom();
    });




});