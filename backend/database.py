# database.py

import os
import sqlite3  # for local dev fallback
import psycopg2  # NEW OR CHANGED
import psycopg2.extras  # NEW OR CHANGED
from config import DATABASE_PATH

# Path to the schema file
SCHEMA_PATH = os.path.join(os.path.dirname(__file__), "..", "database", "schema.sql")


def get_db_connection():
    """
    Returns a database connection.
    If DATABASE_PATH starts with 'postgres' we use psycopg2, otherwise we fall back to SQLite.
    """
    # NEW OR CHANGED
    if DATABASE_PATH.startswith("postgres://") or DATABASE_PATH.startswith("postgresql://"):
        try:
            # Render often requires sslmode='require' to connect
            conn = psycopg2.connect(
                DATABASE_PATH,
                sslmode='require',
                cursor_factory=psycopg2.extras.RealDictCursor
            )
            return conn
        except Exception as e:
            print(f"❌ Error connecting to PostgreSQL: {e}")
            return None
    else:
        # Fallback to SQLite for local dev
        DB_FILE_PATH = DATABASE_PATH.replace("sqlite:///", "")
        try:
            conn = sqlite3.connect(DB_FILE_PATH, check_same_thread=False)
            conn.row_factory = sqlite3.Row
            return conn
        except sqlite3.OperationalError as e:
            print(f"❌ Error connecting to SQLite: {e}")
            return None


def database_exists_sqlite(conn):
    """
    Checks if the 'clients' table exists in SQLite.
    (Only used for local dev with SQLite)
    """
    try:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='clients';"
        )
        return cursor.fetchone() is not None  # True if table exists
    except sqlite3.OperationalError:
        return False


def init_db():
    """
    Initializes the database.
    - If Postgres, just run schema.sql (or skip if you do migrations).
    - If SQLite, run your existing logic to apply schema only if tables are missing.
    """
    conn = get_db_connection()
    if conn is None:
        print("❌ Could not initialize the database.")
        return

    # Detect Postgres vs SQLite
    if DATABASE_PATH.startswith("postgres://") or DATABASE_PATH.startswith("postgresql://"):
        print("🔹 Detected PostgreSQL. Applying schema (if needed).")
        try:
            with open(SCHEMA_PATH, "r", encoding="utf-8") as f:
                schema_sql = f.read()
            # In psycopg2, it’s best to do all DDL inside a transaction
            with conn:
                with conn.cursor() as cur:
                    cur.execute(schema_sql)  # or split by ; if you want
            print("✅ Postgres database initialized (schema applied).")
        except Exception as e:
            print(f"❌ Error initializing Postgres DB: {e}")
        finally:
            conn.close()
    else:
        print("🔹 Using SQLite. Checking if schema needs to be applied.")
        if database_exists_sqlite(conn):
            print("✅ Database already initialized. Skipping schema setup.")
        else:
            try:
                print(f"🔹 Applying schema from: {SCHEMA_PATH}")
                with open(SCHEMA_PATH, "r", encoding="utf-8") as f:
                    conn.executescript(f.read())
                conn.commit()
                print("✅ Database initialized successfully on SQLite!")
            except Exception as e:
                print(f"❌ Error initializing SQLite DB: {e}")
            finally:
                conn.close()
