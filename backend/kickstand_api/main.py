from datetime import date, datetime
from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy import func, or_
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
import jwt
from fastapi.responses import JSONResponse

load_dotenv()
security = HTTPBearer()
JWT_SECRET = os.getenv("JWT_SECRET")
models.Base.metadata.create_all(bind=database.engine)
app = FastAPI()
mongo_uri = os.getenv("MONGO_URI")
client = AsyncIOMotorClient(mongo_uri)
db = client["kickstand"]
forums_collection = db["forumPosts"]
comments_collection = db["forumsComments"]
vehicles_collection = db["bike_data"]

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        print(payload)
        return payload  # You can access sub/email/etc.
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
@app.get("/health"):
async def health():
    return
JSONResponse(content={"status": "ok"})


@app.post("/users/", response_model=schema.UserOut)
def create_user(user: schema.UserCreate, db: Session = Depends(get_db), token_data: dict = Depends(verify_token)):
    user_data = user.model_dump()
    db_user = models.User(**user_data)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.get("/users/", response_model=schema.UserOut)
def read_user( db: Session = Depends(get_db), token_data: dict = Depends(verify_token)):
    user_id = token_data["sub"]
    db_user = db.query(models.User).filter(models.User.user_id == user_id).first()
    if db_user is None:
        return None
    return db_user

@app.get("/vehicles", response_model=List[schema.VehicleOut])
def get_vehicle_by_user_id(db: Session = Depends(get_db), token_data: dict = Depends(verify_token)):
    user_id = token_data["sub"]
    vehicles = db.query(models.Vehicle).filter(models.Vehicle.user_id == user_id).all()
    if not vehicles:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return vehicles


@app.post("/vehicles/", response_model=schema.VehicleCreate)
def create_vehicle(vehicle: schema.VehicleCreate, db: Session = Depends(get_db), token_data: dict = Depends(verify_token)):
    vehicle_data = vehicle.model_dump()
    db_vehicle = models.Vehicle(**vehicle_data)
    db.add(db_vehicle)
    db.commit()
    db.refresh(db_vehicle)
    return db_vehicle


@app.get("/vehicles_details")
async def get_vehicle_details( db: Session = Depends(get_db), token_data: dict = Depends(verify_token)):
    user_id = token_data["sub"]
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
def create_expense(expense: schema.ExpenseCreate, db: Session = Depends(get_db), token_data: dict = Depends(verify_token)):
    expense_data = expense.model_dump()
    db_expense = models.Expense(**expense_data)
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense

@app.get("/expenses/", response_model=List[schema.ExpenseCreate])
def get_expenses_by_user_id(
    vehicle_id: Optional[str] = Query(None, description="Filter by vehicle ID"),
    start_date: Optional[date] = Query(None, description="Filter by start date"),
    end_date: Optional[date] = Query(None, description="Filter by end date"),
    category: Optional[str] = Query(None, description="Filter by category"),
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_token)):
    user_id = token_data["sub"]
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
        return []
    return expenses

def postRider(user_id: str, ride_id: str, db: Session = Depends(get_db), token_data: dict = Depends(verify_token)):
    host_participant = models.RideParticipant(
        user_id = user_id,
        ride_id = ride_id
    )
    db.add(host_participant)
    db.commit()
    db.refresh(host_participant)

@app.post("/rides/", response_model=schema.Ride)
def create_ride(ride: schema.Ride, db: Session = Depends(get_db), token_data: dict = Depends(verify_token)):
    ride_data = ride.model_dump()
    db_ride = models.Ride(**ride_data)
    db.add(db_ride)
    db.commit()
    ride_id = db_ride.ride_id
    user_id = db_ride.created_by
    postRider(user_id=user_id, ride_id=ride_id, db=db)
    db.refresh(db_ride)
    return db_ride  
       
@app.get("/rides/", response_model=List[schema.RideWithInviteCount])
def get_rides(query: Optional[str] = Query(""), created_by: Optional[str] = Query(None), db: Session = Depends(get_db), token_data: dict = Depends(verify_token)):
    base_query = db.query(
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
    
    base_query = base_query.filter(models.Ride.end_time > datetime.utcnow())
    
    # Apply filter if created_by is provided
    if created_by:
        base_query = base_query.filter(models.Ride.created_by == created_by)
    
    # Order by start_time descending
    base_query = base_query.order_by(models.Ride.start_time.desc())

    
    
    
    if query.strip():
        base_query = base_query.filter(
            or_(
                models.Ride.start_location.ilike(f"%{query}%"),
                models.Ride.end_location.ilike(f"%{query}%"),
                models.Ride.title.ilike(f"%{query}%"),
            )
        )
    rides = base_query.all()
    if not rides:
        return []
    return rides
    

@app.get("/rides/ridejoinrequests/accepted/{ride_id}", response_model=List[schema.RideJoinRequestsWithUser])
def get_ride_join_requests(ride_id: int, db: Session = Depends(get_db), token_data: dict = Depends(verify_token)):
   
    requests = (
        db.query(models.RideJoinRequest, models.User.name, models.User.phone)
        .join(models.User, models.RideJoinRequest.user_id == models.User.user_id)
        .filter(models.RideJoinRequest.ride_id == ride_id,
                models.RideJoinRequest.status == "accepted"
                )
        .all()

    )
    if not requests:
        raise HTTPException(status_code=404, detail="No join requests found for this ride")
    result = [
        {
            "request_id": req.request_id,
            "ride_id": req.ride_id,
            "user_id": req.user_id,
            "status": req.status,
            "requested_at": req.requested_at,
            "username": name,
            "phone": phone
        }
        for req, name, phone in requests
    ]
    return result

@app.get("/rides/ridejoinrequests/pending/{ride_id}", response_model=List[schema.RideJoinRequestsWithUser])
def get_ride_join_requests(ride_id: int, db: Session = Depends(get_db), token_data: dict = Depends(verify_token)):
   
    requests = (
        db.query(models.RideJoinRequest, models.User.name)
        .join(models.User, models.RideJoinRequest.user_id == models.User.user_id)
        .filter(models.RideJoinRequest.ride_id == ride_id,
                models.RideJoinRequest.status == "pending"
                )
        .all()

    )
    if not requests:
        raise HTTPException(status_code=404, detail="No join requests found for this ride")
    result = [
        {
            "request_id": req.request_id,
            "ride_id": req.ride_id,
            "user_id": req.user_id,
            "status": req.status,
            "requested_at": req.requested_at,
            "username": name
        }
        for req, name in requests
    ]
    return result

@app.post("/rides/ridejoinrequests/", response_model=schema.RideJoinRequests)
def create_ride_join_request(request: schema.RideJoinRequests, db: Session = Depends(get_db), token_data: dict = Depends(verify_token)):
    request_data = request.model_dump()
    db_request = models.RideJoinRequest(**request_data)
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    return db_request

@app.post("/rides/rideparticipants/accept", response_model=schema.RideParticipants)
def create_ride_participant(participant: schema.RideParticipants, db: Session = Depends(get_db), token_data: dict = Depends(verify_token)):
    participant_data = participant.model_dump()
    db_participant = models.RideParticipant(**participant_data)
    db.add(db_participant)

    db.query(models.RideJoinRequest).filter(
        models.RideJoinRequest.ride_id == participant.ride_id,
        models.RideJoinRequest.user_id == participant.user_id
    ).update({models.RideJoinRequest.status: "accepted"})

    db.query(models.Ride).filter(
        models.Ride.ride_id == participant.ride_id
    ).update({
        models.Ride.current_riders: models.Ride.current_riders+1
    })
    db.commit()
    db.refresh(db_participant)
    return db_participant

@app.post("/rides/rideparticipants/reject", response_model=schema.RideJoinRequests)
def reject_ride_join_request(request: schema.RideJoinRequests, db: Session = Depends(get_db), token_data: dict = Depends(verify_token)):
    request_data = request.model_dump()
    db_request = models.RideJoinRequest(**request_data)

    db.query(models.RideJoinRequest).filter(
        models.RideJoinRequest.ride_id == db_request.ride_id,
        models.RideJoinRequest.user_id == db_request.user_id
    ).delete()

    participant = db.query(models.RideParticipant).filter(
        models.RideParticipant.ride_id == db_request.ride_id,
        models.RideParticipant.user_id == db_request.user_id
    ).first()

    if participant:
        db.delete(participant)
        ride = db.query(models.Ride).filter(
            models.Ride.ride_id == db_request.ride_id
        ).first()
        if ride:
            ride.current_riders = max(0, ride.current_riders - 1)
    
    db.commit()
    return db_request

@app.get("/rides/rideparticipants/{user_id}")
def get_rides_of_user_joined(db: Session = Depends(get_db), token_data: dict = Depends(verify_token)):
    user_id = token_data["sub"]
    db_rides = db.query(models.RideParticipant).filter(
        user_id == models.RideParticipant.user_id
    ).all()
    return db_rides

@app.post("/rides/deleteride/{ride_id}")
def delete_rides(ride_id: int, db: Session = Depends(get_db), token_data: dict = Depends(verify_token)):
    db.query(models.RideParticipant).filter(
        models.RideParticipant.ride_id == ride_id
    ).delete()
    db.query(models.RideJoinRequest).filter(
        models.RideJoinRequest.ride_id == ride_id
    ).delete()
    db.query(models.Ride).filter(
        models.Ride.ride_id == ride_id
    ).delete()

    db.commit()
    return {"message": f"Ride {ride_id} and its participants deleted."}

@app.post("/create-forum/")
async def create_forum_post(forum: schema.CreateForum):
    forum_dict = forum.model_dump()
    result = await forums_collection.insert_one(forum_dict)
    return {
        "message": "Forum post created",
        "post_id": str(result.inserted_id)
    }

@app.get("/forums")
async def forums():
    forums = []
    forums_posts = forums_collection.find()
    async for forum in forums_posts:
        forum["_id"] = str(forum["_id"])
        forums.append(forum)
    return forums

@app.get("/forums/{post_id}")
async def get_forums(post_id: str):
    forum = await forums_collection.find_one({"_id": ObjectId(post_id)})
    if forum:
        forum["_id"] = str(forum["_id"])
        return forum
    return {"error"}

@app.post("/comment/{post_id}")
async def post_comment(post_id: str, comment: schema.PostComment):
    comment_dict = comment.model_dump()
    result = await comments_collection.insert_one(comment_dict)
    return{
        "message": "Comment posted",
        "comment_id": str(result.inserted_id)
    }

@app.get("/comment/{post_id}")
async def get_comments(post_id: str):
    comments = []
    cursor = comments_collection.find({"post_id": post_id})
    async for comment in cursor:
        comment["_id"] = str(comment["_id"])
        comments.append(comment)
    return comments
    

@app.post("/update/{query}/{post_id}")
async def vote_post(query: str, post_id: str):
    if query not in ["upvote", "downvote"]: 
        raise HTTPException(status_code=400, detail="Invalid vote type")
    result = await forums_collection.update_one(
        {"_id": ObjectId(post_id)},
        {"$inc": {query: 1}}
    )
    if result.modified_count == 1:
        return {"message": "succesfully"}
    else:
        return {"error": "unsuccesful"}
    
@app.post("/remove-post/{post_id}")
async def delete_post(post_id: str):
    result = await forums_collection.delete_one({"_id": ObjectId(post_id)})
    if result.deleted_count == 1:
        result_comment = await comments_collection.delete_many({"post_id": post_id})
        return {"message": "Deleted", 
                "comments_deleted": result_comment.deleted_count}
    return {"error": "Not found"}






    
