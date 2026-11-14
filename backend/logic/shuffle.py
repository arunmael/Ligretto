from random import shuffle


def getPlayerCards(CARDS, playerColor):
    """Gibt alle Karten zurück, deren Besitzer der Spielerfarbe entspricht."""
    playerCards = []
    counter = 0
    for i in CARDS:
        if playerColor == CARDS[counter]["owner"]:
            playerCards.append(i)
        counter += 1

    if len(playerCards) == 0:
        return False

    return playerCards


def shuffleDeck (CARDS, playerColor):
    """Gibt die Karten des Spielers als neue, gemischte Liste zurück."""
    playerCards = getPlayerCards(CARDS, playerColor)

    if playerCards == False:
        return False

    else:
        shuffle(playerCards)
        return playerCards


def getDivideStack(CARDS, playerColor):
    """Verteilt die gemischten Spielerkarten auf drei Stapel.

    Rückgabe: Zehnerstapel (10), offene Karten (3), Handkarten (27).
    """
    shuffledCards = shuffleDeck(CARDS, playerColor)

    if shuffledCards == False:
        raise ValueError("Player color unknown")
        return
    
    else:
        tenStack = []
        openCards = []
        handCards = []

        counter = 0

        for i in shuffledCards:
            if counter < 10:
                tenStack.append(i)
            elif counter >= 10 and counter < 13:
                openCards.append(i)
            elif counter >= 13:
                handCards.append(i)
            counter += 1

        return tenStack, openCards, handCards
