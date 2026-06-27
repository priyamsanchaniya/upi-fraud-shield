from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, transactions, notifications

app = FastAPI(title="UPI Fraud Shield API", version="2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(transactions.router, prefix="/transactions", tags=["Transactions"])
app.include_router(notifications.router, prefix="/notifications", tags=["Notifications"])

@app.get("/")
def root():
    return {"message": "UPI Fraud Shield API is running!"}