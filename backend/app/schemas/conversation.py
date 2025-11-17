from datetime import datetime
from typing import List

from pydantic import BaseModel
from tortoise.contrib.pydantic import pydantic_model_creator

from app.database.models import Conversation

ConversationSchema = pydantic_model_creator(
    Conversation, name="Conversation",
)


class MessageSchema(BaseModel):
    id: int
    role: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True


class ConversationMessageSchema(BaseModel):
    id: int
    title: str | None
    created_at: datetime
    messages: List[MessageSchema] = []  # Wichtig!

    class Config:
        from_attributes = True


class ConversationCreate(BaseModel):
    title: str | None = None
