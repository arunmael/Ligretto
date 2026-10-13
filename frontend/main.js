import * as login from './login.js';


document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector("#loginForm");
    const roomIdInputField = document.querySelector("#roomIdInput");
    const createRoomButton = document.querySelector("#createRoomButton")
    let roomId = ""
    
    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();
        roomId = roomIdInputField.value;
        login.joinRoom();

    });


    createRoomButton.addEventListener("click", () => {
        login.createRoom();
    })




});