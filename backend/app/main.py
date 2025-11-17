from app.database.config import TORTOISE_ORM
from app.database.register import register_tortoise
from app.routes import conversation, message
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from tortoise import Tortoise

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
    allow_headers=["Content-Type", "Authorization"],
    expose_headers=["X-Total-Count"],
    max_age=3600,
)

# --- enable schemas to read relationship between models
Tortoise.init_models(["app.database.models"], "models")

# --- register Tortoise ORM with FastAPI app
register_tortoise(app, config=TORTOISE_ORM, generate_schemas=False)

app.include_router(conversation.router, tags=["Conversation"], prefix="/api/v1")
app.include_router(message.router, tags=["Message"], prefix="/api/v1")
