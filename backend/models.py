from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    upi_id: Optional[str] = None

class UserLogin(BaseModel):
    email: str
    password: str

class TransactionCreate(BaseModel):
    receiver_upi: str
    amount: float
    device_id: Optional[str] = None

class TransactionResponse(BaseModel):
    id: int
    receiver_upi: str
    amount: float
    risk_score: int
    status: str
    fraud_reason: Optional[str] = None
    transaction_time: datetime

class NotificationCreate(BaseModel):
    title: str
    message: str
    type: str