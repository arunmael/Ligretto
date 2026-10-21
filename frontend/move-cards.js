let laidCards = [];

export function deleteFromStack(card, openCards, tenStack, handCards) {
    for (const stack of [openCards, tenStack, handCards]) {
        const index = stack.findIndex(entry => entry.id === card.id); 
        if (index !== -1) { 
            const [removedCard] = stack.splice(index, 1);
            laidCards.push(removedCard);
            return;
        }
    }
}



export function moveCardsToPlayArea (card, newLocation, openCards, tenStack, handCards) {
    const clickedCard = card;
    if (!clickedCard || !newLocation) return;
    const previousStack = clickedCard.parentElement;
    clickedCard.style.position = "static";
    const nextCard = previousStack
    newLocation.appendChild(clickedCard);
    deleteFromStack(card, openCards, tenStack, handCards);
    if (clickedCard.classList.contains("tenStackImage")) {
        const nextCard = previousStack.querySelector(".tenStackImage");
        nextCard.style.pointerEvents = "auto"; 
    }

}

export function clickCardStyle (lastCard) {
    if (lastCard === null) {
        return
    } else {lastCard.style.border = "2px solid black";};
}