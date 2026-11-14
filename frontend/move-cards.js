/**
 * move-cards.js – Karten aus den Spielerstapeln aufs Spielfeld verschieben
 * und den Auswahl-Rahmen verwalten.
 */

/** Alle Karten, die schon auf dem Spielfeld liegen (auch überdeckte). */
export let laidCards = [];

function getOldLocation (card, tenStack, openCards, handCards) { // Bestimmt den Herkunftsstapel; nur "tenStack" ist ein String, sonst wird das Array zurückgegeben.
    if (tenStack.some(entry => `image${entry.id}` === card.id)) {
        return "tenStack"
    } else if (openCards.some(entry => `image${entry.id}` === card.id)) {
        return openCards
    } else if (handCards.some(entry => `image${entry.id}` === card.id)) {
        return handCards
    }
}


/**
 * Sucht die Karte in openCards, tenStack und handCards und entfernt sie dort.
 * Zehnerstapel-Karte auf offenen Platz → openCards, sonst → laidCards.
 * @param {HTMLImageElement} card  Kartenbild mit ID "image<kartenId>"; newLocation = Ziel-Element
 */
export function deleteFromStack(card, openCards, tenStack, handCards, newLocation) { // newLocation wird gebraucht, um Nachfüllen (offener Platz) vom Ablegen aufs Spielfeld zu unterscheiden.
    for (const stack of [openCards, tenStack, handCards]) {
        const index = stack.findIndex(entry => `image${entry.id}` === card.id);

        if (index !== -1) {
            if (getOldLocation(card, tenStack, openCards, handCards) === "tenStack"
            && newLocation.classList.contains("openCardsElement")) {
                const [removedCard] = stack.splice(index, 1);
                openCards.push(removedCard); // Nachgefüllte Karte gehört jetzt zu den offenen Karten, nicht aufs Spielfeld.
                return;
            } else {
                const [removedCard] = stack.splice(index, 1);
                laidCards.push(removedCard); // Alle anderen Züge landen auf dem Spielfeld und damit in laidCards.
            return;
        }
             // Beendet die Suche, sobald die Karte aus ihrem bisherigen Stapel entfernt wurde.
        }
    }
}


/**
 * Verschiebt ein Kartenbild in newLocation und aktualisiert die Daten-Arrays.
 * Kommt die Karte vom Zehnerstapel, wird die nächste Karte darunter klickbar gemacht.
 * @param {HTMLImageElement} card         zu verschiebende Karte
 * @param {HTMLElement}      newLocation  Ziel-Element (Spielfeld oder offene Karte)
 */
export function moveCardsToPlayArea (card, newLocation, openCards, tenStack, handCards) { // Stellt auf Aruns Wunsch die ursprüngliche Funktion ohne updateStacks wieder her.
    const clickedCard = card;
    if (!clickedCard || !newLocation) return;
    const previousStack = clickedCard.parentElement;
    clickedCard.style.position = "static";
    newLocation.appendChild(clickedCard);
    deleteFromStack(card, openCards, tenStack, handCards, newLocation); // Reicht das Ziel weiter, damit deleteFromStack() openCards oder laidCards wählen kann.
    if (clickedCard.classList.contains("tenStackImage")) {
        const nextCard = previousStack.querySelector(".tenStackImage");
        if (nextCard) {
            nextCard.style.pointerEvents = "auto";
        }
    }
    console.log(laidCards)

}

/**
 * Setzt den Rahmen der zuvor ausgewählten Karte auf schwarz zurück.
 * @param {HTMLImageElement|null} lastCard  null, wenn noch keine Karte ausgewählt war
 */
export function clickCardStyle (lastCard) {
    if (lastCard === null) {
        return
    } else {lastCard.style.border = "2px solid black";};
}



