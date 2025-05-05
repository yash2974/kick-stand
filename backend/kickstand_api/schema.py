from typing import Union
from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime

class UserCreate(BaseModel):
    user_id: str
    name: str
    email: EmailStr
    phone: str

class UserOut(BaseModel):
    user_id: str
    name: str
    email: EmailStr
    phone: str
    created_at: datetime  # Default to current date and time

    model_config = ConfigDict(
        from_attributes=True
    )
