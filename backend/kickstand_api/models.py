from sqlalchemy import Column, Date, DateTime, Float, ForeignKey, Integer, String, Text, Time, UniqueConstraint, func
from database import Base
from datetime import date

class User(Base):
    __tablename__ = "users"
    user_id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    phone = Column(String(10))
    created_at = Column(DateTime, server_default=func.now())  # Changed to DateTime with default

class Vehicle(Base):
    __tablename__ = "vehicles"
    vehicle_id = Column(String, primary_key=True, index=True)
    model_name = Column(String, nullable=False)
    user_id = Column(String, ForeignKey("users.user_id"), nullable=False)

class Expense(Base):
    __tablename__ = "expenses"
    expense_id = Column(Integer, primary_key=True, index=True)
    vehicle_id = Column(String, ForeignKey("vehicles.vehicle_id"), nullable=False)
    user_id = Column(String,ForeignKey("users.user_id"), index=True, nullable=False)
    amount = Column(Float, nullable=False)
    category = Column(String, nullable=False)
    date = Column(Date, server_default=func.current_date(),nullable=False) 

class Ride(Base):
    __tablename__ = "rides"
    ride_id = Column(Integer, primary_key=True, index=True)
    created_by = Column(String, nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    start_location = Column(String, nullable=False)
    end_location = Column(String, nullable=False)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=True)
    current_riders = Column(Integer, default=1)
    created_at = Column(DateTime, server_default=func.now())
    image_url = Column(String, nullable=True)

class RideParticipant(Base):
    __tablename__ = "rideparticipants"
    id = Column(Integer, primary_key=True, index=True)
    ride_id = Column(Integer, ForeignKey("rides.ride_id"), nullable=False)
    user_id = Column(String, ForeignKey("users.user_id"), nullable=False)
    joined_at = Column(DateTime, server_default=func.now())

    __table_args__ = (
        UniqueConstraint("ride_id", "user_id", name="uq_ride_user"),
    )

class RideJoinRequest(Base):
    __tablename__ = "ridejoinrequests"
    request_id = Column(Integer, primary_key=True, index=True)
    ride_id = Column(Integer, ForeignKey("rides.ride_id"), nullable=False)
    user_id = Column(String, ForeignKey("users.user_id"), nullable=False)
    status = Column(String, nullable=False, default="pending")  # 'pending', 'approved', 'rejected'
    requested_at = Column(DateTime, server_default=func.now())
    
    __table_args__ = (
        UniqueConstraint("ride_id", "user_id", name="uq_ride_user_request"),
    )