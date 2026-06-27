import psycopg2
from psycopg2.extras import RealDictCursor

DB_CONFIG = {
    "host": "db.dnclgwpfrergsdinlmmy.supabase.co",
    "database": "postgres",
    "user": "postgres",
    "password": "priyam0708200",
    "port": "5432"
}

def get_db():
    conn = psycopg2.connect(**DB_CONFIG)
    return conn