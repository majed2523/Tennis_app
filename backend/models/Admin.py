from dataclasses import dataclass
import sqlite3
from database import DB_PATH  # Ensure you import the correct DB path

@dataclass
class Admin:
    admin_id: int
    username: str
    password: str  # This should be hashed in a real application

    @staticmethod
    def create_admin(username: str, password: str):
        """Adds a new admin to the database."""
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        try:
            cursor.execute("INSERT INTO admins (username, password) VALUES (?, ?)", (username, password))
            conn.commit()
            print(f"Admin {username} created successfully.")
        except sqlite3.IntegrityError:
            print("Error: Username already exists.")
        
        conn.close()

    # @staticmethod
    # def authenticate_admin(username: str, password: str):
    #     """Authenticates an admin user."""
    #     conn = sqlite3.connect(DB_PATH)
    #     cursor = conn.cursor()
    #     cursor.execute("SELECT * FROM admins WHERE username = ? AND password = ?", (username, password))
    #     admin_data = cursor.fetchone()
    #     conn.close()

    #     if admin_data:
    #         return Admin(admin_id=admin_data[0], username=admin_data[1], password=admin_data[2])
    #     return None

    # @staticmethod
    # def view_reservations():
    #     """Fetch all reservations from the database."""
    #     conn = sqlite3.connect(DB_PATH)
    #     cursor = conn.cursor()
    #     cursor.execute("SELECT * FROM reservations")
    #     reservations = cursor.fetchall()
    #     conn.close()
    #     return reservations

    # @staticmethod
    # def update_reservation_status(reservation_id: int, status: str):
    #     """Updates the status of a reservation."""
    #     conn = sqlite3.connect(DB_PATH)
    #     cursor = conn.cursor()
    #     cursor.execute("UPDATE reservations SET status = ? WHERE id = ?", (status, reservation_id))
    #     conn.commit()
    #     conn.close()
    #     print(f"Reservation {reservation_id} marked as {status}.")
