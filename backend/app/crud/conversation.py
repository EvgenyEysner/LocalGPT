from app.database.models import Conversation
from app.schemas.conversation import ConversationSchema


async def get_conversations():
    return await ConversationSchema.from_queryset(Conversation.all())


async def get_conversation(conv_id):
    return await ConversationSchema.from_queryset_single(Conversation.get(id=conv_id))


async def create_conversation(conversation):
    conversation_dict = conversation.dict(exclude_unset=True)
    conversation_obj = await Conversation.create(**conversation_dict)
    return await ConversationSchema.from_tortoise_orm(conversation_obj)
