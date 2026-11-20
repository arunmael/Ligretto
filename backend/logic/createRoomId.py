"""Erzeugt RoomIDs für neue Räume."""
import secrets
import string

def createRoomID():
    """Gibt eine zufällige, 6-stellige RoomID aus Ziffern als String zurück (z. B. "042917").

    Prüft nicht, ob die ID schon vergeben ist; das macht create_room() in routes.py.
    secrets statt random, damit IDs nicht vorhersagbar sind.
    """
    #todo die Funktion anpassen, wahrscheinlich DB nötig damit es nie zwei Räume mit den selben Pins gibt
    code = "".join(secrets.choice(string.digits) for _ in range(6))
    return code