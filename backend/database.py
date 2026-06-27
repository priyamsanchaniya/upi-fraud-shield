import psycopg2

DB_CONFIG = {
    "host": "aws-1-ap-northeast-2.pooler.supabase.com",
    "database": "postgres",
    "user": "postgres.dnclgwpfrergsdinlmmy",
    "password": "priyam0708200",
    "port": "5432"
}

def get_db():
    conn = psycopg2.connect(**DB_CONFIG)
    return conn