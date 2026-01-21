from pydantic import BaseModel

class UserOut(BaseModel):
    id: str
    email: str
    send_language: str
    receive_language: str
