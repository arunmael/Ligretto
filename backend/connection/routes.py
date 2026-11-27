"""FastAPI-App mit den Routen zum Erstellen von und Beitreten zu Räumen.

Start aus dem Projekt-Root, damit die Imports mit "backend." funktionieren:
uvicorn backend.connection.routes:app
"""
from backend.connection.model import roomRequestBase
from backend.connection.model import joinRoomRequest
from backend.connection.model import createCards
from backend.logic.createRoomId import createRoomID
from backend.logic import shuffle
from backend import memory
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
# CORS: Der Browser blockiert sonst Anfragen vom Frontend (Port 5500) an das Backend (Port 8000).
# Vor dem Hosting muss allow_origins auf die echte Adresse angepasst werden.
app.add_middleware(
    CORSMiddleware, 
    allow_origins=["*"],
    allow_methods=["GET", "POST"], 
    allow_headers=["Content-Type"],
)

@app.post("/joinRoom")
def join_room(data: joinRoomRequest):
    """Fügt die Farbe einem bestehenden Raum hinzu und gibt RoomID und Farbe zurück.

    Fehler: 400 bei leerer Eingabe oder unbekannter Farbe,
    409 wenn die Farbe im Raum schon vergeben ist, 404 wenn der Raum nicht existiert.
    """
    if not data.color.strip() or not data.roomId.strip():
            raise HTTPException(status_code=400, detail="Bitte eine Farbe auswählen.")
    
    elif not data.roomId.strip():
                raise HTTPException(status_code=400, detail="Bitte eine RoomID eingeben")

    elif data.roomId in memory.rooms:
        if data.color not in memory.rooms[data.roomId]["playerColors"]:
            if data.color in memory.acceptedColors:
                memory.rooms[data.roomId]["playerColors"].append(data.color)
                memory.rooms[data.roomId]["tenStack"][data.color] = 10  # jeder Spieler startet mit 10 Karten im Ligretto-Stapel
                return {"roomId": data.roomId, "color": data.color} 
            else:
                raise HTTPException(status_code=400, detail="Diese Farbe ist nicht erlaubt.")
        else:
            raise HTTPException(status_code=409, detail="Diese Farbe ist bereits gewählt.")
            #todo So bauen das einem im Frontend nur die Farben angezeigt werden die man auch wählen kann

    else:
        raise HTTPException(status_code=404, detail="Der Raum wurde nicht gefunden")

@app.post("/createRoom")
def create_room(data: roomRequestBase):
    """Legt einen neuen Raum mit der gewählten Farbe als erstem Spieler an.

    Gibt die vom Backend erzeugte RoomID und die Farbe zurück.
    Fehler: 400 bei leerer oder unbekannter Farbe.
    """
    roomId = createRoomID()
    while roomId in memory.rooms:  # neu würfeln, bis die ID noch von keinem Raum belegt ist
        roomId = createRoomID()

    if not data.color.strip():
        raise HTTPException(status_code=400, detail="Bitte eine Farbe auswählen.")
    
    if data.color in memory.acceptedColors:
        memory.rooms[roomId] = {"playerColors": [data.color], "laidCards": [], "tenStack": {data.color: 10}}
        return {"roomId": roomId, "color": data.color}
    else:
        raise HTTPException(status_code=400, detail="Diese Farbe ist nicht erlaubt.")


#todo frontend dazu programmieren  
@app.post("/createCards")
def create_cards(data: createCards):
    """Mischt für jeden Spieler im Raum seine 40 Karten und verteilt sie auf die drei Startstapel.

    Speichert die Stapel unter memory.rooms[roomId]["stacks"] und gibt sie zurück:
    {"stacks": {farbe: {"tenStack": [...], "openCards": [...], "handCards": [...]}}, "playerColors": [...]}.
    playerColors gibt die Reihenfolge der Spieler an, damit das Frontend die Plätze verteilen kann.
    Die Karten sind ganze Karten-Dictionaries aus memory.CARDS, nicht nur IDs.
    Fehler: 404, wenn der Raum nicht existiert.
    """
    if data.roomId in memory.rooms:
        colors = memory.rooms[data.roomId]["playerColors"]
        stacks = {}
        # Jeder Spieler bekommt nur Karten mit seiner Farbe als Besitzer (owner), siehe shuffle.getPlayerCards()
        for color in colors:
            tenStack, openCards, handCards = shuffle.getDivideStack(memory.CARDS, color);
            stacks[color] = {
                "tenStack": tenStack,
                "openCards": openCards,
                "handCards": handCards
            }

        memory.rooms[data.roomId]["stacks"] = stacks  # überschreibt bereits verteilte Stapel, ein erneuter Aufruf mischt also neu


        return {"stacks": stacks, "playerColors": colors}
    else:
        raise HTTPException(status_code=404, detail="Der Raum konnte nicht gefunden werden")


    
