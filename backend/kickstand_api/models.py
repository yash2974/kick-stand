from sqlalchemy import Column, Date, DateTime, Float, Integer, String, Time, func
from database import Base
from datetime import date

class User(Base):
    __tablename__ = "users"
    user_id = Column(String, primary_key=True, index=True)
    name = Column(String)
    email = Column(String)
    phone = Column(String(10))
    created_at = Column(DateTime, server_default=func.now())  # Changed to DateTime with default

class Vehicle(Base):
    __tablename__ = "vehicles"
    vehicle_id = Column(String, primary_key=True, index=True)
    model_name = Column(String, foreign_key="users.user_id")
    user_id = Column(String)

class Expense(Base):
    __tablename__ = "expenses"
    expense_id = Column(Integer, primary_key=True, index=True)
    vehicle_id = Column(String, Foreign_key="vehicles.vehicle_id")
    user_id = Column(String, index=True)
    amount = Column(Float)
    category = Column(String)
    date = Column(Date, server_default=func.current_date()) 


