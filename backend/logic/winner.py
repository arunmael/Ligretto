"""Zählt gelegte Karten für die übergebenen Farben."""
def countCards(laidCards, playerColors, tenStack):
    """Gibt je Farbe aus playerColors die Anzahl passender Karten aus laidCards zurück.

    Gezählt wird der Besitzer (owner).
    Farben ohne Treffer bleiben bei 0; andere Farben werden ignoriert.
    """
    if len(playerColors) == 0:
        raise ValueError("No player colors")

    for color in playerColors:
        if color not in tenStack:
            raise ValueError("Ten stack missing for " + color)
    cardCounter = 0

    cards = {}
    tenStackDuplicated = {}

    for i in playerColors:
        cards[i] = 0

    for owner, i in tenStack.items():
            tenStackDuplicated[owner] = 2 * i
    

    for owner in cards:
        for i in laidCards:
            if i["owner"] == owner:
                cardCounter += 1

        cardCounter -= tenStackDuplicated[owner]
        cards[owner] = cardCounter
        cardCounter = 0
    
    highest = max(cards.values())
    cards["winner"] = [owner for owner, count in cards.items() if count == highest] 
    

    return cards