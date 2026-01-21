import os

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://chat_user:chat_pass@localhost:5432/multilingual_chat"
)

SECRET_KEY = "dev-secret"
ALGORITHM = "HS256"
