def getId(card):
    id = card[5:]
    return id

def getNumber(card, CARDS):
    id = getId(card)
    number = 0
    for i in CARDS:
        if i["id"] == id:
            number = i["value"]
    return number


def getColor(card, CARDS):
    id = getId(card)
    color = ""
    for i in CARDS:
        if i["id"] == id:
            color = i["color"]
    return color

def isAllowed(targetCard, currentCard, CARDS):
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
    

