from pydantic import BaseModel
from tortoise.contrib.pydantic import pydantic_model_creator

from app.database.models import Message

MessageSchema = pydantic_model_creator(
    Message, name="Message", exclude_readonly=True
)


class MessageCreate(BaseModel):
    conversation_id: int
    role: str
    content: str
