const CARDS = [
  // blue deck
  { id: "blue-blue-1", owner: "blue", color: "blue", value: 1, src: "images/blue/one.PNG", back: "images/back/blue.PNG" },
  { id: "blue-blue-2", owner: "blue", color: "blue", value: 2, src: "images/blue/two.PNG", back: "images/back/blue.PNG" },
  { id: "blue-blue-3", owner: "blue", color: "blue", value: 3, src: "images/blue/three.PNG", back: "images/back/blue.PNG" },
  { id: "blue-blue-4", owner: "blue", color: "blue", value: 4, src: "images/blue/four.PNG", back: "images/back/blue.PNG" },
  { id: "blue-blue-5", owner: "blue", color: "blue", value: 5, src: "images/blue/five.PNG", back: "images/back/blue.PNG" },
  { id: "blue-blue-6", owner: "blue", color: "blue", value: 6, src: "images/blue/six.PNG", back: "images/back/blue.PNG" },
  { id: "blue-blue-7", owner: "blue", color: "blue", value: 7, src: "images/blue/seven.PNG", back: "images/back/blue.PNG" },
  { id: "blue-blue-8", owner: "blue", color: "blue", value: 8, src: "images/blue/eight.PNG", back: "images/back/blue.PNG" },
  { id: "blue-blue-9", owner: "blue", color: "blue", value: 9, src: "images/blue/nine.PNG", back: "images/back/blue.PNG" },
  { id: "blue-blue-10", owner: "blue", color: "blue", value: 10, src: "images/blue/ten.PNG", back: "images/back/blue.PNG" },
  { id: "blue-green-1", owner: "blue", color: "green", value: 1, src: "images/green/one.PNG", back: "images/back/blue.PNG" },
  { id: "blue-green-2", owner: "blue", color: "green", value: 2, src: "images/green/two.PNG", back: "images/back/blue.PNG" },
  { id: "blue-green-3", owner: "blue", color: "green", value: 3, src: "images/green/three.PNG", back: "images/back/blue.PNG" },
  { id: "blue-green-4", owner: "blue", color: "green", value: 4, src: "images/green/four.PNG", back: "images/back/blue.PNG" },
  { id: "blue-green-5", owner: "blue", color: "green", value: 5, src: "images/green/five.PNG", back: "images/back/blue.PNG" },
  { id: "blue-green-6", owner: "blue", color: "green", value: 6, src: "images/green/six.PNG", back: "images/back/blue.PNG" },
  { id: "blue-green-7", owner: "blue", color: "green", value: 7, src: "images/green/seven.PNG", back: "images/back/blue.PNG" },
  { id: "blue-green-8", owner: "blue", color: "green", value: 8, src: "images/green/eight.PNG", back: "images/back/blue.PNG" },
  { id: "blue-green-9", owner: "blue", color: "green", value: 9, src: "images/green/nine.PNG", back: "images/back/blue.PNG" },
  { id: "blue-green-10", owner: "blue", color: "green", value: 10, src: "images/green/ten.PNG", back: "images/back/blue.PNG" },
  { id: "blue-pink-1", owner: "blue", color: "pink", value: 1, src: "images/pink/one.PNG", back: "images/back/blue.PNG" },
  { id: "blue-pink-2", owner: "blue", color: "pink", value: 2, src: "images/pink/two.PNG", back: "images/back/blue.PNG" },
  { id: "blue-pink-3", owner: "blue", color: "pink", value: 3, src: "images/pink/three.PNG", back: "images/back/blue.PNG" },
  { id: "blue-pink-4", owner: "blue", color: "pink", value: 4, src: "images/pink/four.PNG", back: "images/back/blue.PNG" },
  { id: "blue-pink-5", owner: "blue", color: "pink", value: 5, src: "images/pink/five.PNG", back: "images/back/blue.PNG" },
  { id: "blue-pink-6", owner: "blue", color: "pink", value: 6, src: "images/pink/six.PNG", back: "images/back/blue.PNG" },
  { id: "blue-pink-7", owner: "blue", color: "pink", value: 7, src: "images/pink/seven.PNG", back: "images/back/blue.PNG" },
  { id: "blue-pink-8", owner: "blue", color: "pink", value: 8, src: "images/pink/eight.PNG", back: "images/back/blue.PNG" },
  { id: "blue-pink-9", owner: "blue", color: "pink", value: 9, src: "images/pink/nine.PNG", back: "images/back/blue.PNG" },
  { id: "blue-pink-10", owner: "blue", color: "pink", value: 10, src: "images/pink/ten.PNG", back: "images/back/blue.PNG" },
  { id: "blue-yellow-1", owner: "blue", color: "yellow", value: 1, src: "images/yellow/one.PNG", back: "images/back/blue.PNG" },
  { id: "blue-yellow-2", owner: "blue", color: "yellow", value: 2, src: "images/yellow/two.PNG", back: "images/back/blue.PNG" },
  { id: "blue-yellow-3", owner: "blue", color: "yellow", value: 3, src: "images/yellow/three.PNG", back: "images/back/blue.PNG" },
  { id: "blue-yellow-4", owner: "blue", color: "yellow", value: 4, src: "images/yellow/four.PNG", back: "images/back/blue.PNG" },
  { id: "blue-yellow-5", owner: "blue", color: "yellow", value: 5, src: "images/yellow/five.PNG", back: "images/back/blue.PNG" },
  { id: "blue-yellow-6", owner: "blue", color: "yellow", value: 6, src: "images/yellow/six.PNG", back: "images/back/blue.PNG" },
  { id: "blue-yellow-7", owner: "blue", color: "yellow", value: 7, src: "images/yellow/seven.PNG", back: "images/back/blue.PNG" },
  { id: "blue-yellow-8", owner: "blue", color: "yellow", value: 8, src: "images/yellow/eight.PNG", back: "images/back/blue.PNG" },
  { id: "blue-yellow-9", owner: "blue", color: "yellow", value: 9, src: "images/yellow/nine.PNG", back: "images/back/blue.PNG" },
  { id: "blue-yellow-10", owner: "blue", color: "yellow", value: 10, src: "images/yellow/ten.PNG", back: "images/back/blue.PNG" },

  // green deck
  { id: "green-blue-1", owner: "green", color: "blue", value: 1, src: "images/blue/one.PNG", back: "images/back/green.PNG" },
  { id: "green-blue-2", owner: "green", color: "blue", value: 2, src: "images/blue/two.PNG", back: "images/back/green.PNG" },
  { id: "green-blue-3", owner: "green", color: "blue", value: 3, src: "images/blue/three.PNG", back: "images/back/green.PNG" },
  { id: "green-blue-4", owner: "green", color: "blue", value: 4, src: "images/blue/four.PNG", back: "images/back/green.PNG" },
  { id: "green-blue-5", owner: "green", color: "blue", value: 5, src: "images/blue/five.PNG", back: "images/back/green.PNG" },
  { id: "green-blue-6", owner: "green", color: "blue", value: 6, src: "images/blue/six.PNG", back: "images/back/green.PNG" },
  { id: "green-blue-7", owner: "green", color: "blue", value: 7, src: "images/blue/seven.PNG", back: "images/back/green.PNG" },
  { id: "green-blue-8", owner: "green", color: "blue", value: 8, src: "images/blue/eight.PNG", back: "images/back/green.PNG" },
  { id: "green-blue-9", owner: "green", color: "blue", value: 9, src: "images/blue/nine.PNG", back: "images/back/green.PNG" },
  { id: "green-blue-10", owner: "green", color: "blue", value: 10, src: "images/blue/ten.PNG", back: "images/back/green.PNG" },
  { id: "green-green-1", owner: "green", color: "green", value: 1, src: "images/green/one.PNG", back: "images/back/green.PNG" },
  { id: "green-green-2", owner: "green", color: "green", value: 2, src: "images/green/two.PNG", back: "images/back/green.PNG" },
  { id: "green-green-3", owner: "green", color: "green", value: 3, src: "images/green/three.PNG", back: "images/back/green.PNG" },
  { id: "green-green-4", owner: "green", color: "green", value: 4, src: "images/green/four.PNG", back: "images/back/green.PNG" },
  { id: "green-green-5", owner: "green", color: "green", value: 5, src: "images/green/five.PNG", back: "images/back/green.PNG" },
  { id: "green-green-6", owner: "green", color: "green", value: 6, src: "images/green/six.PNG", back: "images/back/green.PNG" },
  { id: "green-green-7", owner: "green", color: "green", value: 7, src: "images/green/seven.PNG", back: "images/back/green.PNG" },
  { id: "green-green-8", owner: "green", color: "green", value: 8, src: "images/green/eight.PNG", back: "images/back/green.PNG" },
  { id: "green-green-9", owner: "green", color: "green", value: 9, src: "images/green/nine.PNG", back: "images/back/green.PNG" },
  { id: "green-green-10", owner: "green", color: "green", value: 10, src: "images/green/ten.PNG", back: "images/back/green.PNG" },
  { id: "green-pink-1", owner: "green", color: "pink", value: 1, src: "images/pink/one.PNG", back: "images/back/green.PNG" },
  { id: "green-pink-2", owner: "green", color: "pink", value: 2, src: "images/pink/two.PNG", back: "images/back/green.PNG" },
  { id: "green-pink-3", owner: "green", color: "pink", value: 3, src: "images/pink/three.PNG", back: "images/back/green.PNG" },
  { id: "green-pink-4", owner: "green", color: "pink", value: 4, src: "images/pink/four.PNG", back: "images/back/green.PNG" },
  { id: "green-pink-5", owner: "green", color: "pink", value: 5, src: "images/pink/five.PNG", back: "images/back/green.PNG" },
  { id: "green-pink-6", owner: "green", color: "pink", value: 6, src: "images/pink/six.PNG", back: "images/back/green.PNG" },
  { id: "green-pink-7", owner: "green", color: "pink", value: 7, src: "images/pink/seven.PNG", back: "images/back/green.PNG" },
  { id: "green-pink-8", owner: "green", color: "pink", value: 8, src: "images/pink/eight.PNG", back: "images/back/green.PNG" },
  { id: "green-pink-9", owner: "green", color: "pink", value: 9, src: "images/pink/nine.PNG", back: "images/back/green.PNG" },
  { id: "green-pink-10", owner: "green", color: "pink", value: 10, src: "images/pink/ten.PNG", back: "images/back/green.PNG" },
  { id: "green-yellow-1", owner: "green", color: "yellow", value: 1, src: "images/yellow/one.PNG", back: "images/back/green.PNG" },
  { id: "green-yellow-2", owner: "green", color: "yellow", value: 2, src: "images/yellow/two.PNG", back: "images/back/green.PNG" },
  { id: "green-yellow-3", owner: "green", color: "yellow", value: 3, src: "images/yellow/three.PNG", back: "images/back/green.PNG" },
  { id: "green-yellow-4", owner: "green", color: "yellow", value: 4, src: "images/yellow/four.PNG", back: "images/back/green.PNG" },
  { id: "green-yellow-5", owner: "green", color: "yellow", value: 5, src: "images/yellow/five.PNG", back: "images/back/green.PNG" },
  { id: "green-yellow-6", owner: "green", color: "yellow", value: 6, src: "images/yellow/six.PNG", back: "images/back/green.PNG" },
  { id: "green-yellow-7", owner: "green", color: "yellow", value: 7, src: "images/yellow/seven.PNG", back: "images/back/green.PNG" },
  { id: "green-yellow-8", owner: "green", color: "yellow", value: 8, src: "images/yellow/eight.PNG", back: "images/back/green.PNG" },
  { id: "green-yellow-9", owner: "green", color: "yellow", value: 9, src: "images/yellow/nine.PNG", back: "images/back/green.PNG" },
  { id: "green-yellow-10", owner: "green", color: "yellow", value: 10, src: "images/yellow/ten.PNG", back: "images/back/green.PNG" },

  // pink deck
  { id: "pink-blue-1", owner: "pink", color: "blue", value: 1, src: "images/blue/one.PNG", back: "images/back/pink.PNG" },
  { id: "pink-blue-2", owner: "pink", color: "blue", value: 2, src: "images/blue/two.PNG", back: "images/back/pink.PNG" },
  { id: "pink-blue-3", owner: "pink", color: "blue", value: 3, src: "images/blue/three.PNG", back: "images/back/pink.PNG" },
  { id: "pink-blue-4", owner: "pink", color: "blue", value: 4, src: "images/blue/four.PNG", back: "images/back/pink.PNG" },
  { id: "pink-blue-5", owner: "pink", color: "blue", value: 5, src: "images/blue/five.PNG", back: "images/back/pink.PNG" },
  { id: "pink-blue-6", owner: "pink", color: "blue", value: 6, src: "images/blue/six.PNG", back: "images/back/pink.PNG" },
  { id: "pink-blue-7", owner: "pink", color: "blue", value: 7, src: "images/blue/seven.PNG", back: "images/back/pink.PNG" },
  { id: "pink-blue-8", owner: "pink", color: "blue", value: 8, src: "images/blue/eight.PNG", back: "images/back/pink.PNG" },
  { id: "pink-blue-9", owner: "pink", color: "blue", value: 9, src: "images/blue/nine.PNG", back: "images/back/pink.PNG" },
  { id: "pink-blue-10", owner: "pink", color: "blue", value: 10, src: "images/blue/ten.PNG", back: "images/back/pink.PNG" },
  { id: "pink-green-1", owner: "pink", color: "green", value: 1, src: "images/green/one.PNG", back: "images/back/pink.PNG" },
  { id: "pink-green-2", owner: "pink", color: "green", value: 2, src: "images/green/two.PNG", back: "images/back/pink.PNG" },
  { id: "pink-green-3", owner: "pink", color: "green", value: 3, src: "images/green/three.PNG", back: "images/back/pink.PNG" },
  { id: "pink-green-4", owner: "pink", color: "green", value: 4, src: "images/green/four.PNG", back: "images/back/pink.PNG" },
  { id: "pink-green-5", owner: "pink", color: "green", value: 5, src: "images/green/five.PNG", back: "images/back/pink.PNG" },
  { id: "pink-green-6", owner: "pink", color: "green", value: 6, src: "images/green/six.PNG", back: "images/back/pink.PNG" },
  { id: "pink-green-7", owner: "pink", color: "green", value: 7, src: "images/green/seven.PNG", back: "images/back/pink.PNG" },
  { id: "pink-green-8", owner: "pink", color: "green", value: 8, src: "images/green/eight.PNG", back: "images/back/pink.PNG" },
  { id: "pink-green-9", owner: "pink", color: "green", value: 9, src: "images/green/nine.PNG", back: "images/back/pink.PNG" },
  { id: "pink-green-10", owner: "pink", color: "green", value: 10, src: "images/green/ten.PNG", back: "images/back/pink.PNG" },
  { id: "pink-pink-1", owner: "pink", color: "pink", value: 1, src: "images/pink/one.PNG", back: "images/back/pink.PNG" },
  { id: "pink-pink-2", owner: "pink", color: "pink", value: 2, src: "images/pink/two.PNG", back: "images/back/pink.PNG" },
  { id: "pink-pink-3", owner: "pink", color: "pink", value: 3, src: "images/pink/three.PNG", back: "images/back/pink.PNG" },
  { id: "pink-pink-4", owner: "pink", color: "pink", value: 4, src: "images/pink/four.PNG", back: "images/back/pink.PNG" },
  { id: "pink-pink-5", owner: "pink", color: "pink", value: 5, src: "images/pink/five.PNG", back: "images/back/pink.PNG" },
  { id: "pink-pink-6", owner: "pink", color: "pink", value: 6, src: "images/pink/six.PNG", back: "images/back/pink.PNG" },
  { id: "pink-pink-7", owner: "pink", color: "pink", value: 7, src: "images/pink/seven.PNG", back: "images/back/pink.PNG" },
  { id: "pink-pink-8", owner: "pink", color: "pink", value: 8, src: "images/pink/eight.PNG", back: "images/back/pink.PNG" },
  { id: "pink-pink-9", owner: "pink", color: "pink", value: 9, src: "images/pink/nine.PNG", back: "images/back/pink.PNG" },
  { id: "pink-pink-10", owner: "pink", color: "pink", value: 10, src: "images/pink/ten.PNG", back: "images/back/pink.PNG" },
  { id: "pink-yellow-1", owner: "pink", color: "yellow", value: 1, src: "images/yellow/one.PNG", back: "images/back/pink.PNG" },
  { id: "pink-yellow-2", owner: "pink", color: "yellow", value: 2, src: "images/yellow/two.PNG", back: "images/back/pink.PNG" },
  { id: "pink-yellow-3", owner: "pink", color: "yellow", value: 3, src: "images/yellow/three.PNG", back: "images/back/pink.PNG" },
  { id: "pink-yellow-4", owner: "pink", color: "yellow", value: 4, src: "images/yellow/four.PNG", back: "images/back/pink.PNG" },
  { id: "pink-yellow-5", owner: "pink", color: "yellow", value: 5, src: "images/yellow/five.PNG", back: "images/back/pink.PNG" },
  { id: "pink-yellow-6", owner: "pink", color: "yellow", value: 6, src: "images/yellow/six.PNG", back: "images/back/pink.PNG" },
  { id: "pink-yellow-7", owner: "pink", color: "yellow", value: 7, src: "images/yellow/seven.PNG", back: "images/back/pink.PNG" },
  { id: "pink-yellow-8", owner: "pink", color: "yellow", value: 8, src: "images/yellow/eight.PNG", back: "images/back/pink.PNG" },
  { id: "pink-yellow-9", owner: "pink", color: "yellow", value: 9, src: "images/yellow/nine.PNG", back: "images/back/pink.PNG" },
  { id: "pink-yellow-10", owner: "pink", color: "yellow", value: 10, src: "images/yellow/ten.PNG", back: "images/back/pink.PNG" },

  // yellow deck
  { id: "yellow-blue-1", owner: "yellow", color: "blue", value: 1, src: "images/blue/one.PNG", back: "images/back/yellow.PNG" },
  { id: "yellow-blue-2", owner: "yellow", color: "blue", value: 2, src: "images/blue/two.PNG", back: "images/back/yellow.PNG" },
  { id: "yellow-blue-3", owner: "yellow", color: "blue", value: 3, src: "images/blue/three.PNG", back: "images/back/yellow.PNG" },
  { id: "yellow-blue-4", owner: "yellow", color: "blue", value: 4, src: "images/blue/four.PNG", back: "images/back/yellow.PNG" },
  { id: "yellow-blue-5", owner: "yellow", color: "blue", value: 5, src: "images/blue/five.PNG", back: "images/back/yellow.PNG" },
  { id: "yellow-blue-6", owner: "yellow", color: "blue", value: 6, src: "images/blue/six.PNG", back: "images/back/yellow.PNG" },
  { id: "yellow-blue-7", owner: "yellow", color: "blue", value: 7, src: "images/blue/seven.PNG", back: "images/back/yellow.PNG" },
  { id: "yellow-blue-8", owner: "yellow", color: "blue", value: 8, src: "images/blue/eight.PNG", back: "images/back/yellow.PNG" },
  { id: "yellow-blue-9", owner: "yellow", color: "blue", value: 9, src: "images/blue/nine.PNG", back: "images/back/yellow.PNG" },
  { id: "yellow-blue-10", owner: "yellow", color: "blue", value: 10, src: "images/blue/ten.PNG", back: "images/back/yellow.PNG" },
  { id: "yellow-green-1", owner: "yellow", color: "green", value: 1, src: "images/green/one.PNG", back: "images/back/yellow.PNG" },
  { id: "yellow-green-2", owner: "yellow", color: "green", value: 2, src: "images/green/two.PNG", back: "images/back/yellow.PNG" },
  { id: "yellow-green-3", owner: "yellow", color: "green", value: 3, src: "images/green/three.PNG", back: "images/back/yellow.PNG" },
  { id: "yellow-green-4", owner: "yellow", color: "green", value: 4, src: "images/green/four.PNG", back: "images/back/yellow.PNG" },
  { id: "yellow-green-5", owner: "yellow", color: "green", value: 5, src: "images/green/five.PNG", back: "images/back/yellow.PNG" },
  { id: "yellow-green-6", owner: "yellow", color: "green", value: 6, src: "images/green/six.PNG", back: "images/back/yellow.PNG" },
  { id: "yellow-green-7", owner: "yellow", color: "green", value: 7, src: "images/green/seven.PNG", back: "images/back/yellow.PNG" },
  { id: "yellow-green-8", owner: "yellow", color: "green", value: 8, src: "images/green/eight.PNG", back: "images/back/yellow.PNG" },
  { id: "yellow-green-9", owner: "yellow", color: "green", value: 9, src: "images/green/nine.PNG", back: "images/back/yellow.PNG" },
  { id: "yellow-green-10", owner: "yellow", color: "green", value: 10, src: "images/green/ten.PNG", back: "images/back/yellow.PNG" },
  { id: "yellow-pink-1", owner: "yellow", color: "pink", value: 1, src: "images/pink/one.PNG", back: "images/back/yellow.PNG" },
  { id: "yellow-pink-2", owner: "yellow", color: "pink", value: 2, src: "images/pink/two.PNG", back: "images/back/yellow.PNG" },
  { id: "yellow-pink-3", owner: "yellow", color: "pink", value: 3, src: "images/pink/three.PNG", back: "images/back/yellow.PNG" },
  { id: "yellow-pink-4", owner: "yellow", color: "pink", value: 4, src: "images/pink/four.PNG", back: "images/back/yellow.PNG" },
  { id: "yellow-pink-5", owner: "yellow", color: "pink", value: 5, src: "images/pink/five.PNG", back: "images/back/yellow.PNG" },
  { id: "yellow-pink-6", owner: "yellow", color: "pink", value: 6, src: "images/pink/six.PNG", back: "images/back/yellow.PNG" },
  { id: "yellow-pink-7", owner: "yellow", color: "pink", value: 7, src: "images/pink/seven.PNG", back: "images/back/yellow.PNG" },
  { id: "yellow-pink-8", owner: "yellow", color: "pink", value: 8, src: "images/pink/eight.PNG", back: "images/back/yellow.PNG" },
  { id: "yellow-pink-9", owner: "yellow", color: "pink", value: 9, src: "images/pink/nine.PNG", back: "images/back/yellow.PNG" },
  { id: "yellow-pink-10", owner: "yellow", color: "pink", value: 10, src: "images/pink/ten.PNG", back: "images/back/yellow.PNG" },
  { id: "yellow-yellow-1", owner: "yellow", color: "yellow", value: 1, src: "images/yellow/one.PNG", back: "images/back/yellow.PNG" },
  { id: "yellow-yellow-2", owner: "yellow", color: "yellow", value: 2, src: "images/yellow/two.PNG", back: "images/back/yellow.PNG" },
  { id: "yellow-yellow-3", owner: "yellow", color: "yellow", value: 3, src: "images/yellow/three.PNG", back: "images/back/yellow.PNG" },
  { id: "yellow-yellow-4", owner: "yellow", color: "yellow", value: 4, src: "images/yellow/four.PNG", back: "images/back/yellow.PNG" },
  { id: "yellow-yellow-5", owner: "yellow", color: "yellow", value: 5, src: "images/yellow/five.PNG", back: "images/back/yellow.PNG" },
  { id: "yellow-yellow-6", owner: "yellow", color: "yellow", value: 6, src: "images/yellow/six.PNG", back: "images/back/yellow.PNG" },
  { id: "yellow-yellow-7", owner: "yellow", color: "yellow", value: 7, src: "images/yellow/seven.PNG", back: "images/back/yellow.PNG" },
  { id: "yellow-yellow-8", owner: "yellow", color: "yellow", value: 8, src: "images/yellow/eight.PNG", back: "images/back/yellow.PNG" },
  { id: "yellow-yellow-9", owner: "yellow", color: "yellow", value: 9, src: "images/yellow/nine.PNG", back: "images/back/yellow.PNG" },
  { id: "yellow-yellow-10", owner: "yellow", color: "yellow", value: 10, src: "images/yellow/ten.PNG", back: "images/back/yellow.PNG" },
];

export function getDeck(owner) {
  return CARDS.filter(card => card.owner === owner);
}



export function createStartStack (owner) {
    let cards = getDeck(owner);
     

//todo die Karten er DOM in an die richtigen Stellen im game einfuegen und den nachfolgenden code nicht nur fuer gelb sondern fuer alle farben machen.
//das einfuegen per DOM als eigene Funktion bauen.

    let openCards = [];
    let tenStack = [];
    for (let i = 0; i < 14; i++) {
        let index = Math.floor(Math.random() * yellowCards.length);
        let card = cards[index];

        while (openCards.includes(card) || tenStack.includes(card)) {
            index = Math.floor(Math.random() * yellowCards.length);
            card = cards[index];
        };

        if (i >= 4) {
            tenStack.push(card)
        } else {
            openCards.push(card)
        }
    }

    let handCards = cards.filter(card => !openCards.includes(card) && !tenStack.includes(card));

    for (let i = handCards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [handCards[i], handCards[j]] = [handCards[j], handCards[i]];
    }

    return { openCards, tenStack, handCards };

 }


