from pydantic import BaseModel
from tortoise.contrib.pydantic import pydantic_model_creator

from app.database.models import Conversation

ConversationSchema = pydantic_model_creator(
    Conversation, name="Conversation", exclude_readonly=True
)


class ConversationCreate(BaseModel):
    title: str | None = None
