from random import *

def getPlayerCards(CARDS, playerColor):
    """Gibt alle Karten zurück, deren Besitzer der Spielerfarbe entspricht."""
    playerCards = []
    counter = 0
    for i in CARDS:
        if playerColor == CARDS[counter]["owner"]:
            playerCards.append(i)
        counter += 1
    return playerCards



def shuffleDeck (CARDS, playerColor):
    """Gibt die Karten des Spielers als neue, gemischte Liste zurück."""
    playerCards = getPlayerCards(CARDS, playerColor)
    shuffle(playerCards)
    return playerCards


def getDivideStack(CARDS, playerColor):
    """Verteilt die gemischten Spielerkarten auf drei Stapel.

    Rückgabe: Zehnerstapel (10), offene Karten (3), Handkarten (27).
    """
    shuffeldCards = shuffleDeck(CARDS, playerColor)

    tenStack = []
    openCards = []
    handCards = []
    
    counter = 0

    for i in shuffeldCards:
        if counter < 10:
            tenStack.append(i)
        elif counter >= 10 and counter < 13:
            openCards.append(i)
        elif counter >= 13:
            handCards.append(i)
        counter += 1

    return tenStack, openCards, handCards