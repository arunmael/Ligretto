// openCard Code Snippet to implement in createDOMStack
const newDiv = document.createElement("div");
const newImage = document.createElement("img");

newDiv.id = `openCard${openCards[i].id}`;
newDiv.classList.add("openCardsElement");

newImage.id = `image${openCards[i].id}`;
newImage.classList.add("openCardImage");

newImage.setAttribute("src", openCards[i].src);
newImage.setAttribute("alt", openCards[i].alt);
newImage.setAttribute("width", "60px");
newImage.setAttribute("height", "auto");

newDiv.appendChild(newImage);
openCardsBottom.appendChild(newDiv);
newImage.style.border = "2px solid black";
newImage.style.borderRadius = "10px";
newDiv.style.border = "2px solid black";
newDiv.style.borderRadius = "10px";
newDiv.style.width = "60px";
newDiv.style.height = "90px";



// tenStack Code Snippet to implement in createDOMStack
let newDiv = document.createElement("div");
let newImage;

newDiv.id = `tenStackDiv${playerColor}`;
newDiv.classList.add("tenStackElement");

const stackOffset = Math.max(0, tenStack.length - 1) * 2.5;
newDiv.style.position = "relative";
newDiv.style.width = `${64 + stackOffset}px`;
newDiv.style.height = `${94 + stackOffset}px`;
newDiv.style.isolation = "isolate";

for (let i = 0; i < tenStack.length; i++) {
    const image = document.createElement("img");
    const offset = i * 2.5;
    image.id = `image${tenStack[i].id}`;
    image.classList.add("tenStackImage");
    image.src = tenStack[i].src;
    image.alt = tenStack[i].alt;
    image.style.width = "60px";
    image.style.height = "90px";
    image.style.position = "absolute";
    image.style.left = `${offset}px`;
    image.style.top = `${offset}px`;
    image.style.zIndex = `${tenStack.length - i}`;
    image.style.pointerEvents = i === 0 ? "auto" : "none";
    image.style.border = "2px solid black";
    image.style.borderRadius = "10px";
    newDiv.appendChild(image);
}
tenStackBottom.appendChild(newDiv);


// handCards Code Snippet to implement in createDOMStack
newDiv = document.createElement("div");
newImage = document.createElement("img");

newDiv.id = `handCardsDiv${playerColor}`;
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

if (playerColor === "blue") {
    newImage.style.width = "90px";
    newImage.style.height = "60px";
    newImage.style.transform = "rotate(90deg)";
} else {
    newImage.style.width = "60px";
    newImage.style.height = "90px";
}

newImage.setAttribute("src", `images/back/${playerColor}.PNG`);
newImage.setAttribute("alt", `back of the ${playerColor} card`);

newDiv.appendChild(newImage);
handCardsBottomClosed.appendChild(newDiv);



//fetch data
const data = await fetch("http://localhost:8000/createCards", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({roomId: roomId})
    })

    const result = await data.json();
    
    const playerColors = result.playerColors
    const stacks = result.stacks;


//html Tags
const openCardsBase = document.querySelector("#openCards");
    const tenStackBase = document.querySelector("#tenStack");
    const handCardsBottomBase = document.querySelector("#handCardsBottom")
    const postion = ["bottom", "top", "right", "left"]


