"""Anfrage-Modelle für die Routen in routes.py; Pydantic prüft damit den JSON-Body vom Frontend."""
from pydantic import BaseModel


class roomRequestBase(BaseModel):
    """Body von /createRoom: nur die gewählte Kartenfarbe.

    Weitere Felder (z. B. eine mitgeschickte roomId) ignoriert Pydantic.
    """
    color: str

class joinRoomRequest(roomRequestBase):
    """Body von /joinRoom: Farbe (geerbt) und die RoomID des Raums, dem man beitreten will."""
    roomId: str

class createCards(BaseModel):
    """Body von /createCards: die RoomID des Raums, in dem die Karten verteilt werden."""
    roomId: str
