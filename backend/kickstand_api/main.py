from datetime import date
from fastapi import FastAPI, Depends, HTTPException, Query
from sqlalchemy import func
from sqlalchemy.orm import Session
import models
import schema
import database
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from typing import List, Optional
import os
from dotenv import load_dotenv

load_dotenv()

models.Base.metadata.create_all(bind=database.engine)
app = FastAPI()

mongo_uri = os.getenv("MONGO_URI")
client = AsyncIOMotorClient(mongo_uri)
db = client["kickstand"]
users_collection = db["users"]
vehicles_collection = db["bike_data"]

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/users/", response_model=schema.UserOut)
def create_user(user: schema.UserCreate, db: Session = Depends(get_db)):
    user_data = user.model_dump()
    db_user = models.User(**user_data)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.get("/users/{user_id}", response_model=schema.UserOut)
def read_user(user_id: str, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.user_id == user_id).first()
    if db_user is None:
        return None
    return db_user

@app.get("/vehicles/{user_id}", response_model=List[schema.VehicleOut])
async def get_vehicle_by_user_id(user_id: str, db: Session = Depends(get_db)):
    vehicles = db.query(models.Vehicle).filter(models.Vehicle.user_id == user_id).all()
    if not vehicles:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return vehicles


@app.post("/vehicles/", response_model=schema.VehicleCreate)
def create_vehicle(vehicle: schema.VehicleCreate, db: Session = Depends(get_db)):
    vehicle_data = vehicle.model_dump()
    db_vehicle = models.Vehicle(**vehicle_data)
    db.add(db_vehicle)
    db.commit()
    db.refresh(db_vehicle)
    return db_vehicle


@app.get("/vehicles_details/{user_id}")
async def get_vehicle_details(user_id: str, db: Session = Depends(get_db)):
    vehicle = db.query(models.Vehicle).filter(models.Vehicle.user_id == user_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    name = vehicle.model_name.strip()
    details = await vehicles_collection.find_one({"model_name": name})
    
    if not details:
        raise HTTPException(status_code=404, detail="Vehicle details not found")

    # Convert ObjectId to string and ensure all values are serializable
    details["_id"] = str(details["_id"])
    return details

@app.post("/expenses/", response_model=schema.ExpenseCreate)
def create_expense(expense: schema.ExpenseCreate, db: Session = Depends(get_db)):
    expense_data = expense.model_dump()
    db_expense = models.Expense(**expense_data)
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense

@app.get("/expenses/{user_id}", response_model=List[schema.ExpenseCreate])
def get_expenses_by_user_id(
    user_id: str, 
    vehicle_id: Optional[str] = Query(None, description="Filter by vehicle ID"),
    start_date: Optional[date] = Query(None, description="Filter by start date"),
    end_date: Optional[date] = Query(None, description="Filter by end date"),
    category: Optional[str] = Query(None, description="Filter by category"),
    db: Session = Depends(get_db)):
    expenses = db.query(models.Expense).filter(models.Expense.user_id == user_id)
    if vehicle_id:
        expenses = expenses.filter(models.Expense.vehicle_id == vehicle_id)
    if start_date:
        expenses = expenses.filter(models.Expense.date >= start_date)
    if end_date:
        expenses = expenses.filter(models.Expense.date <= end_date)
    if category:
        expenses = expenses.filter(models.Expense.category == category)

    expenses = expenses.all()
    if not expenses:
        raise HTTPException(status_code=404, detail="No expenses found")
    return expenses

@app.post("/rides/", response_model=schema.Ride)
def create_ride(ride: schema.Ride, db: Session = Depends(get_db)):
    ride_data = ride.model_dump()
    db_ride = models.Ride(**ride_data)
    db.add(db_ride)
    db.commit()
    db.refresh(db_ride)
    return db_ride  

@app.get("/rides/", response_model=List[schema.RideWithInviteCount])
def get_rides(created_by: Optional[str] = Query(None), db: Session = Depends(get_db)):
    # Build the base query with LEFT JOIN and COUNT
    query = db.query(
        models.Ride.ride_id,
        models.Ride.created_by,
        models.Ride.title,
        models.Ride.description,
        models.Ride.start_location,
        models.Ride.end_location,
        models.Ride.start_time,
        models.Ride.end_time,
        models.Ride.current_riders,
        models.Ride.created_at,
        models.Ride.image_url,
        # Add any other fields from your Ride model here
        func.count(models.RideJoinRequest.request_id).label('invite_count')
    ).outerjoin(
        models.RideJoinRequest, 
        models.Ride.ride_id == models.RideJoinRequest.ride_id
    ).group_by(
        models.Ride.ride_id,
        models.Ride.created_by,
        models.Ride.title,
        models.Ride.description,
        models.Ride.start_location,
        models.Ride.end_location,
        models.Ride.start_time,
        models.Ride.end_time,
        models.Ride.current_riders,
        models.Ride.created_at,
        models.Ride.image_url
        # Include all the same fields in GROUP BY
    )
    
    # Apply filter if created_by is provided
    if created_by:
        query = query.filter(models.Ride.created_by == created_by)
    
    # Order by start_time descending
    query = query.order_by(models.Ride.start_time.desc())
    
    # Execute the query
    rides = query.all()
    
    if not rides:
        raise HTTPException(status_code=404, detail="No rides found")
    
    return rides

@app.get("/rides/ridejoinrequests/{ride_id}", response_model=List[schema.RideJoinRequests])
def get_ride_join_requests(ride_id: int, db: Session = Depends(get_db)):
   
    requests = db.query(models.RideJoinRequest).filter(models.RideJoinRequest.ride_id == ride_id).all()
    if not requests:
        raise HTTPException(status_code=404, detail="No join requests found for this ride")
    return requests


@app.post("/rides/ridejoinrequests/", response_model=schema.RideJoinRequests)
def create_ride_join_request(request: schema.RideJoinRequests, db: Session = Depends(get_db)):
    request_data = request.model_dump()
    db_request = models.RideJoinRequest(**request_data)
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    return db_request



# need to join the riderequests output table with the users table to get the user details so that i can the username also
