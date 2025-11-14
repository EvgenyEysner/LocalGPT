import os

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.database.models import Conversation, Message
from services import ollama
from services.websocket import ConnectionManager

manager = ConnectionManager()
router = APIRouter()

router = APIRouter()


@router.websocket("/ws/{conv_id}")
async def websocket_endpoint(websocket: WebSocket, conv_id: int):
    await manager.connect(websocket)

    try:
        # Load conversation (mit await!)
        conv = await Conversation.filter(id=conv_id).first()
        if not conv:
            await manager.send_message("Conversation not found", websocket)
            await websocket.close()
            return

        # Stream chat loop
        while True:
            data = await websocket.receive_text()

            # Speichere User-Nachricht
            user_msg = await Message.create(
                role="user",
                content=data,
                conversation_id=conv_id
            )

            try:
                # Query Ollama
                answer = await ollama.query_ollama(
                    model=os.getenv("OLLAMA_MODEL", "gpt-oss"),
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
