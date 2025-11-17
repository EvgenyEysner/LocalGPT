import os

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.database.models import Conversation, Message
from services import ollama
from services.websocket import ConnectionManager

manager = ConnectionManager()
router = APIRouter()


async def generate_title_from_message(message: str) -> str:
    """
    Generiert einen kurzen Titel aus der ersten Nachricht.
    Nimmt die ersten 50 Zeichen und fügt "..." hinzu wenn nötig.
    """
    title = message.strip()[:50]
    if len(message.strip()) > 50:
        title += "..."
    return title


async def generate_smart_title(message: str, model: str) -> str:
    """
    Nutzt Ollama, um einen intelligenten, prägnanten Titel zu generieren.
    Falls das fehlschlägt, fällt es auf die einfache Methode zurück.
    """
    try:
        prompt = (
            f"Erstelle einen sehr kurzen, prägnanten Titel (maximal 6 Wörter) "
            f"für folgende Frage oder Aussage: '{message}'. "
            f"Antworte NUR mit dem Titel, keine Anführungszeichen, keine Erklärung."
        )
        title = await ollama.query_ollama(model=model, prompt=prompt)
        # Bereinige und begrenze den Titel
        title = title.strip().strip('"').strip("'")[:60]
        return title if title else generate_title_from_message(message)
    except Exception as e:
        print(f"Smart title generation failed: {e}, falling back to simple method")
        return await generate_title_from_message(message)


@router.websocket("/ws/{conv_id}")
async def websocket_endpoint(websocket: WebSocket, conv_id: int):
    await manager.connect(websocket)

    try:
        # Load conversation
        conv = await Conversation.filter(id=conv_id).first()
        if not conv:
            await manager.send_message("Conversation not found", websocket)
            await websocket.close()
            return

        # Flag um zu tracken, ob Titel bereits gesetzt wurde
        title_updated = False

        # Prüfe, ob bereits Messages existieren
        existing_messages = await Message.filter(conversation_id=conv_id).count()
        if existing_messages > 0:
            title_updated = True

        # Stream chat loop
        while True:
            data = await websocket.receive_text()

            # Speichere User-Nachricht
            user_msg = await Message.create(
                role="user",
                content=data,
                conversation_id=conv_id
            )

            # Titel automatisch aus erster Nachricht generieren
            if not title_updated:
                title_updated = True
                try:
                    # Option 1: Einfache Methode (schnell)
                    new_title = await generate_title_from_message(data)

                    # Option 2: Smart Methode mit AI (langsamer, aber besser)
                    # new_title = await generate_smart_title(
                    #     data,
                    #     os.getenv("OLLAMA_MODEL", "mistral")
                    # )

                    conv.title = new_title
                    await conv.save()
                except Exception as e:
                    print(f"Failed to update conversation title: {e}")

            try:
                # Query Ollama
                answer = await ollama.query_ollama(
                    model=os.getenv("OLLAMA_MODEL", "mistral"),
                    prompt=data
                )
            except Exception as exc:
                answer = f"[Ollama Error]: {exc}"

            # Speichere Assistant-Nachricht
            assistant_msg = await Message.create(
                role="assistant",
                content=answer,
                conversation_id=conv_id
            )

            # Sende Antwort zurück an Client
            await manager.send_message(answer, websocket)

    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        print(f"WebSocket error: {e}")
        manager.disconnect(websocket)
