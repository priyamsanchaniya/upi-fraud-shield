from fastapi import APIRouter, HTTPException
from passlib.context import CryptContext
from database import get_db
from models import UserCreate, UserLogin

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.post("/register")
def register(user: UserCreate):
    conn = get_db()
    cur = conn.cursor()
    try:
        hashed = pwd_context.hash(user.password)
        cur.execute(
            "INSERT INTO users (name, email, password_hash, upi_id) VALUES (%s, %s, %s, %s) RETURNING id, name, email",
            (user.name, user.email, hashed, user.upi_id)
        )
        new_user = cur.fetchone()
        conn.commit()
        return {"message": "User registered successfully", "user": new_user}
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        cur.close()
        conn.close()

@router.post("/login")
def login(user: UserLogin):
    conn = get_db()
    cur = conn.cursor()
    try:
        cur.execute("SELECT * FROM users WHERE email = %s", (user.email,))
        db_user = cur.fetchone()
        if not db_user:
            raise HTTPException(status_code=404, detail="User not found")
        if not pwd_context.verify(user.password, db_user[3]):
            raise HTTPException(status_code=400, detail="Wrong password")
        return {
            "message": "Login successful",
            "user_id": db_user[0],
            "name": db_user[1],
            "email": db_user[2]
        }
    finally:
        cur.close()
        conn.close()

@router.get("/user/{user_id}")
def get_user(user_id: int):
    conn = get_db()
    cur = conn.cursor()
    try:
        cur.execute("SELECT id, name, email, upi_id, created_at FROM users WHERE id = %s", (user_id,))
        user = cur.fetchone()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return {
            "id": user[0],
            "name": user[1],
            "email": user[2],
            "upi_id": user[3],
            "created_at": user[4]
        }
    finally:
        cur.close()
        conn.close()