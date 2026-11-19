"""Liest Kartenwerte und Farben aus der Kartenliste und prüft erlaubte Spielzüge."""
def getId(card):
    """Entfernt das fünfstellige Präfix „image“ aus einer Kartenbild-ID."""
    id = card
    return id

def getNumber(card, CARDS):
    """Liefert den Wert zur Kartenbild-ID aus CARDS, bei fehlendem Treffer 0."""
    id = getId(card)
    number = 0
    for i in CARDS:
        if i["id"] == id:
            number = i["value"]
    return number


def getColor(card, CARDS):
    """Liefert die Vorderseitenfarbe zur Kartenbild-ID, bei fehlendem Treffer einen leeren String."""
    id = getId(card)
    color = ""
    for i in CARDS:
        if i["id"] == id:
            color = i["color"]
    return color

def isAllowed(targetCard, currentCard, CARDS):
    """Prüft Kartenbild-IDs: auf None nur eine 1, sonst gleiche Farbe und Wert +1; gibt bool zurück."""
    currentNumber = getNumber(currentCard, CARDS)
    currentColor = getColor(currentCard, CARDS)

    if targetCard is None:
        if targetCard is None and currentNumber != 1:
            return False

        elif targetCard is None and currentNumber == 1:
            return True
    else:
        targetNumber = getNumber(targetCard, CARDS)
        targetColor = getColor(targetCard, CARDS)
        nextNumber = targetNumber + 1
    
        if targetColor == currentColor and currentNumber == nextNumber:
            return True
        else:
            return False
    

