import psycopg2

DB_CONFIG = {
    "host": "aws-0-ap-southeast-1.pooler.supabase.com",
    "database": "postgres",
    "user": "postgres.dnclgwpfrergsdinlmmy",
    "password": "તારો Supabase password",
    "port": "5432"
}

def get_db():
    conn = psycopg2.connect(**DB_CONFIG)
    return conn