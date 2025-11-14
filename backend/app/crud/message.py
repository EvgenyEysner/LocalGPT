from app.database.models import Message
from app.schemas.message import MessageSchema


async def get_message(conv_id):
    return await MessageSchema.from_queryset_single(Message.get(id=conv_id))


async def create_message(message):
    message_dict = message.dict(exclude_unset=True)
    message_obj = await Message.create(**message_dict)
    return await MessageSchema.from_tortoise_orm(message_obj)
