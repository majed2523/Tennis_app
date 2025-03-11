from dataclasses import dataclass
import sqlite3
from config import  DATABASE_PATH  

@dataclass
class Admin:
    admin_id: int
    username: str
    password: str  # This should be hashed
    role: str  # Identifies admin type

    @staticmethod
    def create_admin(username: str, password: str, role: str):
        """Adds a new admin to the database."""
        conn = sqlite3.connect(DATABASE_PATH)
        cursor = conn.cursor()

        try:
            cursor.execute("INSERT INTO admins (username, password, role) VALUES (?, ?, ?)", (username, password, role))
            conn.commit()
            print(f"Admin {username} created successfully.")
        except sqlite3.IntegrityError:
            print("Error: Username already exists.")
        
        conn.close()

    @staticmethod
    def authenticate_admin(username: str, password: str):
        """Authenticates an admin user and returns their role."""
        conn = sqlite3.connect(DATABASE_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM admins WHERE username = ? AND password = ?", (username, password))
        admin_data = cursor.fetchone()
        conn.close()

        if admin_data:
            return Admin(admin_id=admin_data[0], username=admin_data[1], password=admin_data[2], role=admin_data[3])
        return None
