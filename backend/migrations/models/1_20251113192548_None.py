from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        CREATE TABLE IF NOT EXISTS "conversation" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "title" VARCHAR(255),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS "message" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "role" VARCHAR(64),
    "content" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "conversation_id" INT NOT NULL REFERENCES "conversation" ("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "aerich" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "version" VARCHAR(255) NOT NULL,
    "app" VARCHAR(100) NOT NULL,
    "content" JSONB NOT NULL
);"""


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        """


MODELS_STATE = (
    "eJztmG1P2zAQgP9KlU8gMQRdKWjfQimjg7YTZBsCochN3NQisYvtABXqf5/txEmat7UTsH"
    "biW3ov8d1j++7SFyMgLvTZbofgR0gZ4Ihg40vjxcAggOKhVL/TMMB0mmqlgIORrxycvOWI"
    "cQocLnRj4DMoRC5kDkXTeC0c+r4UEkcYIuylohCjhxDanHiQTyAVits7IUbYhc+Q6Z/Te3"
    "uMoO8uhI1cubaS23w2VbIe5qfKUK42sh3ihwFOjaczPiE4sUaYS6kHMaSAQ/l6TkMZvowu"
    "zlZnFEWamkQhZnxcOAahzzPpLslA4JT8RDRMJejJVT4191uHraPP7daRMFGRJJLDeZRemn"
    "vkqAgMLGOu9ICDyEJhTLlxxMXrCug6E0DL2SUOOXwi6Dw+DSvDL6aT4NMmKb/0zLwSwAA8"
    "2z7EHp9IagcHNbh+mpedM/NyS1hty2SIOMfRIR/Eqmakk0xThg6FMmMb8CLIE6HhKIDlMB"
    "c9c0Td2HVXPyzBt3A+3wGwyMEdYn8Wb28NX6vX715ZZv+7zCRg7MFXiEyrKzVNJZ3lpFvt"
    "3FYkL2n86llnDfmzcTMcdBVBwrhH1YqpnXVjyJhAyImNyZMN3Mw91VINZi4rzPg+c1ekYA"
    "Sc+ydAXXtBkymakDHgQVbc/+PY8/T8EvpJjcztdFxz+9Fb1nOb5/rsaqnebsmHNEkVsaIq"
    "aAZ5CcAibzdeW66UI1LSoDKwqntTkDH6aEsb1JYoWa0rafuNbErt1hI9qd2qbElSletIBH"
    "OIS9qRBZ8rDl/GZUMg1jWa7rW10GM0rK2+eb290GcuhoOv2jwDt3MxPP5o8/9vm8/dluQL"
    "xl6pYpd4/rl8r8l+vkIFL8xK5UyLQE8JhcjD53CmuPZEZAA7ZRW84nN0/XhWzUdCTMFTMh"
    "qUHRnxIJKEPOpx5lXHPOka8+q58y0nLhNS5EzKBq5YUztvgdTmY9xas8taN27JE1l6Uasn"
    "rozLX80L/6Lkvf1fAfJqrAAxNt9MgPt7e0sAFFaVAJVuycn129VwsOrk+gOLBG9d5PCdho"
    "8Yv1tPrDUUZdb1g2x+Zs2NR/IFx2Wt+j3by/w3URg2/Q=="
)
