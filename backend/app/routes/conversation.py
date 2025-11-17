from typing import List

from fastapi import HTTPException, status, APIRouter
from tortoise.exceptions import DoesNotExist

import app.crud.conversation as crud
from app.database.models import Conversation
from app.schemas.conversation import ConversationSchema, ConversationCreate, ConversationMessageSchema

router = APIRouter()


@router.post("/conversation", response_model=ConversationSchema)
async def create(conversation: ConversationCreate) -> Conversation:
    try:
        conv = await crud.create_conversation(conversation)
    except DoesNotExist:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            detail="Conversation could not be created",
        )
    return conv


@router.get("/conversations", response_model=List[ConversationSchema])
async def get_conversations() -> List[Conversation]:
    try:
        conv = await crud.get_conversations()
    except DoesNotExist:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            detail="Conversations could not be fetched",
        )
    return conv


@router.get("/conversations/{conv_id}", response_model=ConversationMessageSchema)
async def get_conversation(conv_id: int) -> Conversation:
    conv = await crud.get_conversation(conv_id)
    if not conv:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Conversation not found")
    return conv
