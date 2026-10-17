import * as createStack from "./create-stack.js";

document.addEventListener("DOMContentLoaded", () => {
    const joinOtherRoom = document.querySelector("#joinOtherRoom");
    joinOtherRoom.addEventListener("click", () => {
        localStorage.removeItem("playerColor");
        localStorage.removeItem("roomId");
        window.location.href = "index.html";
    });

    const owner = sessionStorage.getItem("playerColor");

    const playerStartStacks = createStack.createStartStack(owner);

    createStack.createPlayArea();

    createStack.createDOMStack(playerStartStacks.openCards,
    playerStartStacks.tenStack,
    playerStartStacks.handCards)




});