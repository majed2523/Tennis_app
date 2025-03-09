import sqlite3
import os
from config import DATABASE_PATH

SCHEMA_PATH = os.path.join(os.path.dirname(__file__), "../database/schema.sql")

def get_db_connection():
    """Connects to the SQLite database."""
    try:
        conn = sqlite3.connect(DATABASE_PATH, check_same_thread=False)
        conn.row_factory = sqlite3.Row  # Allow dictionary-style row access
        return conn
    except sqlite3.OperationalError as e:
        print(f"❌ Error connecting to database: {e}")
        return None

def database_exists(conn):
    """Checks if the clients table already exists."""
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='clients';")
        return cursor.fetchone() is not None  # ✅ Returns True if the table exists
    except sqlite3.OperationalError:
        return False

def init_db():
    """Initializes the database only if tables are missing."""
    conn = get_db_connection()
    if conn is None:
        print("❌ Could not initialize the database.")
        return

    if database_exists(conn):  # ✅ Check before applying schema.sql
        print("✅ Database already initialized. Skipping schema setup.")
    else:
        try:
            print(f"🔹 Applying schema from: {SCHEMA_PATH}")
            with open(SCHEMA_PATH, "r", encoding="utf-8") as f:
                conn.executescript(f.read())
            conn.commit()
            print("✅ Database initialized successfully!")
        except Exception as e:
            print(f"❌ Error initializing database: {e}")
        finally:
            conn.close()
