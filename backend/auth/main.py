from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google.oauth2 import id_token
from google.auth.transport import requests
from datetime import datetime, timedelta
import jwt
import os
from dotenv import load_dotenv
from jwt import exceptions as jwt_exceptions

# Load environment variables
load_dotenv()

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
JWT_SECRET = os.getenv("JWT_SECRET")

app = FastAPI()


class TokenRequest(BaseModel):
    idToken: str
class RefreshTokenRequest(BaseModel):
    refresh_token: str

@app.head("/health")
async def health_check_head():
    return

@app.post("/api/auth/google")
async def verify_google_and_issue_jwt(request: TokenRequest):
    try:
        idinfo = id_token.verify_oauth2_token(
            request.idToken,
            requests.Request(),
            GOOGLE_CLIENT_ID
        )

        email = idinfo['email']
        name = idinfo['name']
        sub = idinfo['sub']

        print("Current server time:", datetime.now())
        print("Unix time:", int(datetime.now().timestamp()))
        print("Expiry time:", int((datetime.now() + timedelta(hours=1)).timestamp()))

        payload = {
            "sub": sub,
            "email": email,
            "name": name,
            "exp": datetime.utcnow() + timedelta(days=30)
        }
        payload_access = {
            "sub": sub,
            "email": email,
            "name": name,
            "exp": datetime.utcnow() + timedelta(minutes=2)
        }

        refresh_token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")
        access_token = jwt.encode(payload_access, JWT_SECRET, algorithm="HS256")

        return {
            "refresh_token": refresh_token,
            "access_token": access_token,
            "user": {
                "email": email,
                "name": name,
                "google_id": sub
            }
        }

    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid Google ID token")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.post("/api/auth/google/refresh_token")
async def refresh_token(request: RefreshTokenRequest):
    refresh_token = request.refresh_token
    try:
        print("gewg")
        payload = jwt.decode(refresh_token, JWT_SECRET, algorithms="HS256")
        user_id = payload.get("sub")
        email = payload.get("email")
        name = payload.get("name")
        print(user_id, email, name)
        if not user_id:
            raise HTTPException(status_code=400, detail="Invalid refresh token no user_id")
        new_access_token = jwt.encode({
            "sub": user_id,
            "email": email,
            "name": name,
            "exp": datetime.utcnow() + timedelta(hours=1)
        }, JWT_SECRET, algorithm="HS256")

        return {"access_token": new_access_token}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Refresh token expired")
    except jwt_exceptions.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")



