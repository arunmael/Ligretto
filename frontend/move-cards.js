/**
 * move-cards.js – Karten aus den Spielerstapeln aufs Spielfeld verschieben
 * und den Auswahl-Rahmen verwalten.
 */

/** Alle Karten, die schon auf dem Spielfeld liegen (auch überdeckte). */
export let laidCards = [];

//todo wenn die Karte von tenStack nach openCards verschoben wird, darf sie nicht laidCards angefügt werden sondern muss den openCards angefügt werden.

/**
 * Sucht die Karte in openCards, tenStack und handCards, entfernt sie dort
 * und fügt sie laidCards hinzu.
 * @param {HTMLImageElement} card  Kartenbild mit ID "image<kartenId>"
 */
export function deleteFromStack(card, openCards, tenStack, handCards) {
    for (const stack of [openCards, tenStack, handCards]) {
        const index = stack.findIndex(entry => `image${entry.id}` === card.id);

        if (index !== -1) {
            const [removedCard] = stack.splice(index, 1);
            laidCards.push(removedCard);
            return;
        }
    }
}



/**
 * Verschiebt ein Kartenbild in newLocation und aktualisiert die Daten-Arrays.
 * Kommt die Karte vom Zehnerstapel, wird die nächste Karte darunter klickbar gemacht.
 * @param {HTMLImageElement} card         zu verschiebende Karte
 * @param {HTMLElement}      newLocation  Ziel-Element (Spielfeld oder offene Karte)
 */
export function moveCardsToPlayArea (card, newLocation, openCards, tenStack, handCards, updateStacks = true) { // Aktualisiert standardmässig die Arrays; false behält bereits umgeordnete Kartendaten bei.
    const clickedCard = card;
    if (!clickedCard || !newLocation) return;
    const previousStack = clickedCard.parentElement;
    clickedCard.style.position = "static";
    newLocation.appendChild(clickedCard);
    if (updateStacks) {
        deleteFromStack(card, openCards, tenStack, handCards);
    }
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



