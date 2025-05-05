from sqlalchemy import Column, DateTime, String, Time, func
from database import Base

class User(Base):
    __tablename__ = "users"
    user_id = Column(String, primary_key=True, index=True)
    name = Column(String)
    email = Column(String)
    phone = Column(String(10))
    created_at = Column(DateTime, server_default=func.now())  # Changed to DateTime with default
