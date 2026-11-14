/**
 * main.js – Einstiegspunkt der Spielseite (game.html).
 * Verteilt die Karten des Spielers, baut Stapel und Spielfeld im DOM auf
 * und verarbeitet die Klicks: Karte auswählen → Ziel anklicken → Karte wird gelegt.
 */
import * as createStack from "./create-stack.js";
import * as moveCards from "./move-cards.js";
import * as rules from "./rules.js"; // Stellt die vorhandenen Prüfungen für Farbe und Kartenwert wieder bereit.

document.addEventListener("DOMContentLoaded", () => {
    const owner = sessionStorage.getItem("playerColor");
    if (!["blue", "green", "pink", "yellow"].includes(owner)) {
        alert("Etwas ist Schief gelaufen")
        window.location.href = "index.html";
        return
    };
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
    const playerStartStacks = createStack.createStartStack(owner);

    createStack.createPlayArea();

    createStack.createDOMStack(playerStartStacks.openCards,
        playerStartStacks.tenStack,
        playerStartStacks.handCards);

    /**
     * Klick auf die offenen Karten.
     * - Ist eine Zehnerstapel-Karte ausgewählt, wird sie auf einen leeren offenen Platz gelegt
     *   und im Daten-Array vom Zehnerstapel zu openCards verschoben; belegte Plätze werden ignoriert.
     * - Sonst wird die angeklickte offene Karte ausgewählt (grüner Rahmen).
     */
    openCardsBottom.addEventListener("click", (event) => {
        const clickedCard = event.target;
        const isTenStackCard = activeField?.classList.contains("tenStackImage")

        if (isTenStackCard === true && !(clickedCard.className === openCardsBottom.className)) {
            const targetSlot = clickedCard.closest(".openCardsElement"); // Findet bei Klick auf Bild oder Rand denselben offenen Kartenplatz.
            const targetImage = targetSlot?.querySelector("img");
            if (targetImage) {
                moveCards.clickCardStyle(lastCard);
                activeField = targetImage;
                activeField.style.border = "5px solid green";
                lastCard = activeField;
                return;
            }; // Nachfüllen nur auf leere Plätze, damit keine offene Karte überdeckt wird.
            if (!targetSlot || targetSlot.contains(activeField)) return; // Verhindert ungültige Ziele und das Ablegen einer Karte auf sich selbst.

            activeField.style.border = "2px solid black";
            const card = activeField;
            const openCards = playerStartStacks.openCards;
            const tenStack = playerStartStacks.tenStack;
            const handCards = playerStartStacks.handCards;

            targetSlot.querySelector("img")?.remove(); // Hat seit der Prüfung oben keine Wirkung mehr, da der Platz hier immer leer ist.
            moveCards.moveCardsToPlayArea(card, targetSlot, openCards, tenStack, handCards); // Verschiebt das Bild ins Ziel-div und überlässt die Listenänderung deleteFromStack().

            activeField = null;
            console.log(openCards)
            console.log(moveCards.laidCards)
        } else if (!(clickedCard instanceof HTMLImageElement)) {
            return
        } else {
            moveCards.clickCardStyle(lastCard);
            clickedCard.style.border = "5px solid green";
            activeField = clickedCard;
            lastCard = clickedCard;
        };
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
     * - Auf Karten nur gleiche Farbe und Wert +1; auf leere Felder nur eine 1.
     * - Eine liegende Zielkarte wird aus dem DOM entfernt, bleibt aber in laidCards.
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
            if (rules.isAllowed(newLocation, card) === true) { // Stellt die Prüfung von Farbe und aufsteigendem Wert vor dem Verschieben wieder her.
                newLocation.remove(); // Entfernt die Zielkarte erst, nachdem der Zug erlaubt wurde.
                console.log("removed"); // Behält die bestehende Ausgabe bei einem erlaubten Zug bei.
                moveCards.moveCardsToPlayArea(card, parent, openCards, tenStack, handCards); // Legt die erlaubte Karte in den gemeinsamen Spielfeld-Container.
            } else { // Lässt bei einem verbotenen Zug beide Karten an ihrem bisherigen Platz.
                console.log("not Allowed"); // Meldet wie zuvor, dass rules.js den Zug ablehnt.
            } // Beendet die wiederhergestellte Regelprüfung.
        } else {
            if (rules.getNumber(card) !== 1) return; // Stellt die bestehende Regel wieder her: Ein leerer Stapel beginnt mit einer 1.
            moveCards.moveCardsToPlayArea(card, newLocation, openCards, tenStack, handCards);
        }

        activeField = null;
    });
});
