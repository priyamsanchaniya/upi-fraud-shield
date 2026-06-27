import psycopg2
from psycopg2.extras import RealDictCursor

DB_CONFIG = {
    "host": "localhost",
    "database": "upi_fraud_shield",
    "user": "postgres",
    "password": "priyam2008",
    "port": "5432"
}

def get_db():
    conn = psycopg2.connect(**DB_CONFIG)
    return conn