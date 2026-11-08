/**
 * rules.js – Spielregeln von Ligretto.
 * Schlägt Wert und Farbe einer Karte in CARDS nach und prüft, ob ein Zug erlaubt ist.
 */
import { CARDS } from "./create-stack.js";

/**
 * Liefert den Wert (1–10) einer Karte.
 * @param {HTMLImageElement} card  Kartenbild mit ID "image<kartenId>"
 * @returns {number|undefined}     undefined, falls die Karte nicht in CARDS steht
 */
export function getNumber(card){
    const cardId = card.id.slice(5); // Präfix "image" (5 Zeichen) entfernen
    let number;
    CARDS.forEach((current) => {
        if (current.id === cardId) {
            number = current.value;
        }
    })
    return number;
};

/**
 * Liefert die Farbe einer Karte ("blue", "green", "pink", "yellow").
 * @param {HTMLImageElement} card  Kartenbild mit ID "image<kartenId>"
 * @returns {string|undefined}
 */
export function getColor(card){
    const cardId = card.id.slice(5); // Präfix "image" entfernen
    let color;
    CARDS.forEach((current) => {
        if (current.id === cardId) {
            color = current.color;
        }
    })
    return color
};


/**
 * Prüft, ob currentCard auf targetCard gelegt werden darf.
 * Regel: gleiche Farbe und Wert genau um 1 höher. Ohne Zielkarte (null) ist nur eine 1 erlaubt.
 * @param {HTMLImageElement|null} targetCard   Karte, die schon auf dem Spielfeld liegt
 * @param {HTMLImageElement}      currentCard  Karte, die gelegt werden soll
 * @returns {boolean}
 */
export function isAllowed(targetCard, currentCard) {
    if (targetCard === null && getNumber(currentCard) === 1) {
        return true;
    } else if (getColor(targetCard) === getColor(currentCard)
        && (Number(getNumber(targetCard)) + 1 === Number(getNumber(currentCard)))) {
        return true;
    } else {
        return false;
    }
}