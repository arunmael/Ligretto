import CARDS from "./create-stack.js";


export function isAllowed(lastCard, currentCard) {
    if (!(newLocation instanceof HTMLImageElement)) {
        return true;
    } else if (lastCard.color !== currentCard.color && (Number(lastCard.value) + 1 === Number(currentCard.value))) {
        return false;
    } else {
        return true;
    }
}