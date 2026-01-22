from pydantic import BaseModel


class TranslateRequest(BaseModel):
    message_id: str
    target_language: str


class TranslateResponse(BaseModel):
    message_id: str
    target_language: str
    translated_text: str
