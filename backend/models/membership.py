from sqlalchemy import Column, String
from core.database import Base

class RoomMember(Base):
    __tablename__ = "room_members"

    user_id = Column(String, primary_key=True)
    room_id = Column(String, primary_key=True)
