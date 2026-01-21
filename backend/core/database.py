# from sqlalchemy import create_engine
# from sqlalchemy.orm import sessionmaker, declarative_base
# from core.config import DATABASE_URL

# engine = create_engine(DATABASE_URL, pool_pre_ping=True)

# SessionLocal = sessionmaker(
#     autocommit=False,
#     autoflush=False,
#     bind=engine
# )

# Base = declarative_base()


from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = "postgresql://postgres:pass123@localhost:5432/multilingual_chat"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

Base = declarative_base()
