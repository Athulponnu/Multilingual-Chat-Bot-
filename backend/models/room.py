from sqlalchemy import Column, String
from core.database import Base
import uuid


class Room(Base):
    __tablename__ = "rooms"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    creator_id = Column(String)

