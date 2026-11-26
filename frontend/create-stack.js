/**
 * create-stack.js – Holt die Startstapel aller Spieler vom Backend und baut
 * Spielerstapel und Spielfeld im DOM auf.
 */

// Holt über /createCards die Startstapel aller Spieler im Raum.
// Gibt {stacks: {farbe: {openCards, tenStack, handCards}}, playerColors: [...]} zurück, bei einem Fehler false.
// Achtung: Jeder Aufruf mischt im Backend neu.
export async function fetchStacks(roomId) {
    let cards = await fetch("http://localhost:8000/createCards", {
            method: "Post",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({roomId})
        });
    if (cards.ok) {
        const data = await cards.json();
        return data;
    } else {
        return false
    }
};


// Die drei Getter lesen aus dem Stapel eines Spielers (stacks[farbe]) den jeweiligen Teilstapel als Array von Karten.
export function getTenStack(stack) {
    const tenStack = stack["tenStack"]
    return tenStack
}

export function getOpenCards(stack) {
    const openCards = stack["openCards"]
    return openCards
}

export function getHandCards(stack) {
    const handCards = stack["handCards"]
    return handCards
}

// Holt die Startstapel vom Backend und zeigt sie für alle Spieler an:
// offene Karten, Zehnerstapel (versetzt übereinander, nur die oberste klickbar) und den verdeckten Handstapel.
// owner = eigene Farbe (kommt immer nach unten), roomId = Raum, dessen Karten geholt werden.
export async function createDOMStack(owner, roomId) {
    const fetchedData = await fetchStacks(roomId); 
    let postions = ["Top", "Right", "Left"]
    if (!fetchedData) {
        console.log("Something went wrong while fetching data from Backend for the Start Stacks")
        return;

    } else {
        const playerColors = fetchedData["playerColors"];
        const stacks = fetchedData["stacks"]
        const playerAmount = playerColors.length;
        postions.splice(playerAmount-1) // der Owner sitzt unten, die Gegner brauchen nur playerAmount - 1 Plätze
        for (const color of playerColors) {
            const stack = stacks[color];
            const openCards = getOpenCards(stack)
            const tenStack = getTenStack(stack)
            const handCards = getHandCards(stack)
            
            let postion;
            if (color === owner) {
                postion = "Bottom"
                
            } else {
                postion = postions.shift(); // jeder Gegner bekommt den nächsten freien Platz (Top, Right, Left)
            };

            //openCards erstellen
            for (const card of openCards) {
                const newDiv = document.createElement("div");
                const newImage = document.createElement("img");

                newDiv.id = `openCard${card.id}`;
                newDiv.classList.add("openCardsElement");

                newImage.id = `image${card.id}`;
                newImage.classList.add("openCardImage");

                newImage.setAttribute("src", card.src);
                newImage.setAttribute("alt", card.alt);
                newImage.setAttribute("width", "60px");
                newImage.setAttribute("height", "auto");

                newDiv.appendChild(newImage);
                document.querySelector(`#openCards${postion}`).appendChild(newDiv);
                newImage.style.border = "2px solid black";
                newImage.style.borderRadius = "10px";
                newDiv.style.border = "2px solid black";
                newDiv.style.borderRadius = "10px";
                newDiv.style.width = "60px";
                newDiv.style.height = "90px";

                }

                //tenStack erstellen
                
                let newDiv = document.createElement("div");

                newDiv.id = `tenStackDiv${color}`;
                newDiv.classList.add("tenStackElement");

                const stackOffset = Math.max(0, tenStack.length - 1) * 2.5;
                newDiv.style.position = "relative"; // Bezugspunkt für die absolut positionierten Karten im Stapel
                newDiv.style.width = `${64 + stackOffset}px`;
                newDiv.style.height = `${94 + stackOffset}px`;
                newDiv.style.isolation = "isolate"; // zIndex der Karten gilt nur innerhalb dieses Stapels
                let counter = 0
                for (const card of tenStack) {
                    const image = document.createElement("img");
                    const offset = counter * 2.5;
                    image.id = `image${card.id}`;
                    image.classList.add("tenStackImage");
                    image.src = card.src;
                    image.alt = card.alt;
                    image.style.width = "60px";
                    image.style.height = "90px";
                    image.style.position = "absolute";
                    image.style.left = `${offset}px`;
                    image.style.top = `${offset}px`;
                    image.style.zIndex = `${tenStack.length - counter}`; // tenStack[0] liegt zuoberst
                    image.style.pointerEvents = counter === 0 ? "auto" : "none"; // nur die oberste Karte ist klickbar
                    image.style.border = "2px solid black";
                    image.style.borderRadius = "10px";
                    newDiv.appendChild(image);
                    counter ++
                }
                document.querySelector(`#tenStack${postion}`).appendChild(newDiv);


                //handCards erstellen

                newDiv = document.createElement("div");
                let newImage = document.createElement("img");

                newDiv.id = `handCardsDiv${color}`;
                newDiv.classList.add("handCardsElement");

                newImage.id = `handCardsBackgroundImage`;
                newImage.classList.add("handCardsImage");

                newDiv.style.width = "60px";
                newDiv.style.height = "90px";
                newDiv.style.display = "flex";
                newDiv.style.alignItems = "center";
                newDiv.style.justifyContent = "center";
                newImage.style.flexShrink = "0";
                newImage.style.border = "2px solid black";
                newImage.style.borderRadius = "10px";

                if (color === "blue") { // die blaue Rückseite ist im Querformat und wird deshalb gedreht
                    newImage.style.width = "90px";
                    newImage.style.height = "60px";
                    newImage.style.transform = "rotate(90deg)";
                } else {
                    newImage.style.width = "60px";
                    newImage.style.height = "90px";
                }

                newImage.setAttribute("src", `images/back/${color}.PNG`);
                newImage.setAttribute("alt", `back of the ${color} card`);

                newDiv.appendChild(newImage);
                document.querySelector(`#handCards${postion}Closed`).appendChild(newDiv);
        }

    }
    

}

// TODO: überall die Zahl 4 durch eine Anzahl Spieler Variable ersetzen
/**
 * Erzeugt im Spielfeld (#playArea) ein 4 × 4-Raster aus 16 leeren Ablagefeldern
 * mit der Klasse "playAreaField" (daran erkennt main.js ein gültiges Ziel).
 */
// Erzeugt die 16 gemeinsamen Ablagefelder für Karten.
export function createPlayArea() {
    const playArea = document.querySelector("#playArea");
    playArea.style.display = "grid";
    playArea.style.gridTemplateRows = "repeat(4, 1fr)";
    playArea.style.gridTemplateColumns = "repeat(4, 1fr)";
    playArea.style.gap = "2px";
    for (let i = 0; i < 16; i++) {
        let newDiv = document.createElement("div");
        newDiv.style.border = "1px solid grey";
        newDiv.style.borderRadius = "10px";
        newDiv.id = `playAreaField${i}`;
        newDiv.classList.add("playAreaField")
        newDiv.style.width = "60px";
        newDiv.style.height = "90px";
        playArea.appendChild(newDiv);
    }
}
