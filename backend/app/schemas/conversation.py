from app.database.models import Conversation
from pydantic import BaseModel
from tortoise.contrib.pydantic import pydantic_model_creator

ConversationSchema = pydantic_model_creator(
    Conversation, name="Conversation",
)


class ConversationCreate(BaseModel):
    title: str | None = None
