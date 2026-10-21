import * as createStack from "./create-stack.js";
import * as moveCards from "./move-cards.js";

document.addEventListener("DOMContentLoaded", () => {
    const openCardsBottom = document.querySelector("#openCardsBottom");
    const tenStackBottom = document.querySelector("#tenStackBottom");
    const handCardsBottomClosed = document.querySelector("#handCardsBottomClosed")
    const playArea = document.querySelector("#playArea")
    let activeField = null;
    let lastCard = null;
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
    playerStartStacks.handCards);


    openCardsBottom.addEventListener("click", (event) => {
        const clickedCard = event.target;
        if (!(clickedCard instanceof HTMLImageElement)) return;
        moveCards.clickCardStyle(lastCard);
        clickedCard.style.border = "5px solid green";
        activeField = clickedCard;
        lastCard = clickedCard;
    });

    tenStackBottom.addEventListener("click", (event) => {
        const clickedCard = event.target;
        if (!(clickedCard instanceof HTMLImageElement)) return;
        moveCards.clickCardStyle(lastCard);
        clickedCard.style.border = "5px solid green";
        activeField = clickedCard;
        lastCard = clickedCard;
    });

    playArea.addEventListener("click", (event) => {
        const newLocation = event.target;
        if (newLocation.className !== "playAreaField") return;
        activeField.style.border = "2px solid black";
        const card = activeField;
        const openCards = playerStartStacks.openCards;
        const tenStack = playerStartStacks.tenStack;
        const handCards = playerStartStacks.handCards;
        console.log(newLocation)
    
        moveCards.moveCardsToPlayArea(card, newLocation, openCards, tenStack, handCards);
        activeField = null;
    });




});
