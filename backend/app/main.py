from fastapi import FastAPI
from tortoise import Tortoise

app = FastAPI()

# enable schemas to read relationship between models
Tortoise.init_models(["app.database.models"], "models")


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello {name}"}
