from fastapi import FastAPI
from tortoise import Tortoise

from app.database.config import TORTOISE_ORM
from app.database.register import register_tortoise
from app.routes import conversation, message

app = FastAPI()

# --- enable schemas to read relationship between models
Tortoise.init_models(["app.database.models"], "models")

# --- register Tortoise ORM with FastAPI app
register_tortoise(app, config=TORTOISE_ORM, generate_schemas=False)

app.include_router(conversation.router, tags=["Conversation"], prefix="/api/v1")
app.include_router(message.router, tags=["Message"], prefix="/api/v1")
