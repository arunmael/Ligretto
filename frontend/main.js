/**
 * main.js – Einstiegspunkt der Spielseite (game.html).
 * Verteilt die Karten des Spielers, baut Stapel und Spielfeld im DOM auf
 * und verarbeitet die Klicks: Karte auswählen → Ziel anklicken → Karte wird gelegt.
 */
import * as createStack from "./create-stack.js";
import * as moveCards from "./move-cards.js";
import * as rules from "./rules.js";

document.addEventListener("DOMContentLoaded", () => {
    const openCardsBottom = document.querySelector("#openCardsBottom");
    const tenStackBottom = document.querySelector("#tenStackBottom");
    const handCardsBottomClosed = document.querySelector("#handCardsBottomClosed")
    const playArea = document.querySelector("#playArea")
    let activeField = null; // aktuell ausgewählte Karte (img), null = keine Auswahl
    let lastCard = null; // vorherige Auswahl, damit ihr Rahmen zurückgesetzt werden kann
    const joinOtherRoom = document.querySelector("#joinOtherRoom");

    // Zurück zur Startseite, gespeicherte Spielerdaten verwerfen.
    joinOtherRoom.addEventListener("click", () => {
        sessionStorage.removeItem("playerColor");
        sessionStorage.removeItem("roomId");
        window.location.href = "index.html";
    });

    // Spielstart: Karten verteilen und anzeigen
    const owner = sessionStorage.getItem("playerColor");
    const playerStartStacks = createStack.createStartStack(owner);

    createStack.createPlayArea();

    createStack.createDOMStack(playerStartStacks.openCards,
    playerStartStacks.tenStack,
    playerStartStacks.handCards);


    /**
     * Klick auf die offenen Karten.
     * - Ist eine Zehnerstapel-Karte ausgewählt, wird sie auf die angeklickte offene Karte gelegt
     *   und im Daten-Array vom Zehnerstapel zu openCards verschoben.
     * - Sonst wird die angeklickte offene Karte ausgewählt (grüner Rahmen).
     */
    openCardsBottom.addEventListener("click", (event) => {
        const clickedCard = event.target;
        const isTenStackCard = activeField?.classList.contains("tenStackImage")
        if (isTenStackCard === true && !(clickedCard.className === openCardsBottom.className)) {
            activeField.style.border = "2px solid black";
            const card = activeField;
            const openCards = playerStartStacks.openCards;
            const tenStack = playerStartStacks.tenStack;
            const handCards = playerStartStacks.handCards;
           for (const stack of [openCards, tenStack, handCards]) {
                const index = stack.findIndex(entry => `image${entry.id}` === card.id); // img-IDs = "image" + Karten-ID

                if (index !== -1) {
                    const [removedCard] = stack.splice(index, 1);
                    openCards.push(removedCard);
                    moveCards.moveCardsToPlayArea(card, clickedCard, openCards, tenStack, handCards, false); // Verschiebt das Kartenbild und behält die Karte in openCards.
                    break;

                }
            }
            activeField = null;
            console.log(openCards)
            console.log(moveCards.laidCards)
        } else if (!(clickedCard instanceof HTMLImageElement)) {
            return
        } else {
        moveCards.clickCardStyle(lastCard);
        clickedCard.style.border = "5px solid green";
        activeField = clickedCard;
        lastCard = clickedCard;};
    });

    /**
     * Klick auf den Zehnerstapel: wählt die oberste Karte aus.
     * Nur sie ist klickbar (pointerEvents wird in create-stack.js gesetzt).
     */
    tenStackBottom.addEventListener("click", (event) => {
        const clickedCard = event.target;
        if (!(clickedCard instanceof HTMLImageElement)) return;
        moveCards.clickCardStyle(lastCard);
        clickedCard.style.border = "5px solid green";
        activeField = clickedCard;
        lastCard = clickedCard;
    });

    /**
     * Klick auf das Spielfeld: legt die ausgewählte Karte ab.
     * - Ziel ist eine liegende Karte: nur erlaubt, wenn rules.isAllowed() zustimmt
     *   (gleiche Farbe, Wert +1). Die alte Karte wird aus dem DOM entfernt, bleibt aber in laidCards.
     * - Ziel ist ein leeres Feld: nur eine 1 darf einen neuen Stapel beginnen.
     * FIXME: Ist keine Karte ausgewählt (activeField === null), wirft activeField.style einen Fehler.
     */
    playArea.addEventListener("click", (event) => {
        const newLocation = event.target;
        if (newLocation.className !== "playAreaField" && !(newLocation instanceof HTMLImageElement)) return;
        activeField.style.border = "2px solid black";
        const card = activeField;
        const openCards = playerStartStacks.openCards;
        const tenStack = playerStartStacks.tenStack;
        const handCards = playerStartStacks.handCards;
        if (newLocation instanceof HTMLImageElement) {
            const parent = newLocation.parentElement;
            if (rules.isAllowed(newLocation, card) === true) {
                newLocation.remove();
                console.log("removed");
                moveCards.moveCardsToPlayArea(card, parent, openCards, tenStack, handCards);
            } else {
                console.log("not Allowed")
            }

        } else {
            if (rules.getNumber(card) !== 1) return;
            moveCards.moveCardsToPlayArea(card, newLocation, openCards, tenStack, handCards);
        }

        activeField = null;
    });




});
