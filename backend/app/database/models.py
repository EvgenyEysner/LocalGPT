# from enum import IntEnum

from tortoise import fields, models


# from tortoise.validators import MaxValueValidator, MinValueValidator


class Conversation(models.Model):
    id = fields.IntField(primary_key=True, db_index=True)
    title = fields.CharField(null=True, max_length=255)
    created_at = fields.DatetimeField(auto_now_add=True)


class Message(models.Model):
    id = fields.IntField(primary_key=True, db_index=True)
    role = fields.CharField(null=True, max_length=64)  # "user" | "assistant"
    content = fields.TextField(null=True)
    created_at = fields.DatetimeField(auto_now_add=True)
    conversation = fields.ForeignKeyField(
        "models.Conversation", related_name="messages"
    )
