import bcrypt
import jwt
import datetime
from dataclasses import dataclass
from database import get_db_connection

SECRET_KEY = "your_secret_key"  # Update this in production


@dataclass
class User:
    id: int
    first_name: str
    last_name: str
    password: str
    role: str  # 'player', 'coach', or 'admin'

    @classmethod
    def from_db_row(cls, row):
        """Creates a User object from a database row."""
        if row is None:
            return None
        print(f"📌 Debug: Retrieved row from DB → {row}")  # Debugging log
        return cls(
            id=row[0],  
            first_name=row[1],
            last_name=row[2],
            password=row[3],
            role=row[4]  # Role field included
        )
    def to_dict(self):
        return {
        "id": self.id,
        "firstName": self.first_name,
        "lastName": self.last_name,
        "role": self.role
    }

    def hash_password(self):
        """Hashes the password before storing."""
        if not self.password.startswith("$2b$"):
            self.password = bcrypt.hashpw(self.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    def verify_password(self, password):
        """Verifies the provided password against the stored hashed password."""
        return bcrypt.checkpw(password.encode('utf-8'), self.password.encode('utf-8'))        

    def save(self, db_connection):
        """Saves or updates the user in the database."""
        if not self.password.startswith("$2b$"):  # Ensure password is hashed
            self.password = bcrypt.hashpw(self.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        cursor = db_connection.cursor()
        cursor.execute("SELECT id FROM users WHERE first_name = ? AND last_name = ?", (self.first_name, self.last_name))
        existing = cursor.fetchone()

        if existing:
            print(f"❌ User {self.first_name} {self.last_name} already exists. Skipping insert.")
            return False  # Prevent duplicate entries

        print(f"📌 Inserting user: first_name={self.first_name}, last_name={self.last_name}, password={self.password}, role={self.role}")

        cursor.execute(
            "INSERT INTO users (first_name, last_name, password, role) VALUES (?, ?, ?, ?)",
            (self.first_name, self.last_name, self.password, self.role)
        )

        db_connection.commit()
        print(f"✅ User {self.first_name} {self.last_name} saved successfully.")
        return True

    @classmethod
    def find_by_id(cls, db_connection, user_id):
        """Finds a user by their ID."""
        cursor = db_connection.cursor()
        print(f"🔹 Checking if user ID exists: '{user_id}'")

        cursor.execute("SELECT id, first_name, last_name, password, role FROM users WHERE id = ?", (user_id,))
        row = cursor.fetchone()

        if row:
            print(f"✅ User with ID {user_id} found.")
            return cls(*row)
        else:
            print(f"❌ No user found with ID: '{user_id}'")
            return None

    def generate_token(self):
        """Generates a JWT token for the user."""
        payload = {
            "id": self.id,
            "role": self.role,  # Include role in token
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }
        return jwt.encode(payload, SECRET_KEY, algorithm="HS256")

    def delete(self, db_connection):
        """Deletes the user from the database."""
        cursor = db_connection.cursor()
        cursor.execute("DELETE FROM users WHERE id = ?", (self.id,))
        db_connection.commit()
        return cursor.rowcount > 0  # Returns True if a row was deleted
    
    
    @classmethod
    def find_by_name(cls, db_connection, first_name, last_name):
        """Find a user by first name and last name."""
        cursor = db_connection.cursor()
        cursor.execute(
            "SELECT id, first_name, last_name, password, role FROM users WHERE first_name = ? AND last_name = ?",
            (first_name, last_name)
        )
        row = cursor.fetchone()
        if row:
            return cls(*row)
        return None
    
    
    
    @classmethod
    def get_all_players(cls, db_connection):
        """Retrieve all players from the database as a list of dicts."""
        cursor = db_connection.cursor()
        cursor.execute("SELECT id, first_name, last_name, password, role FROM users WHERE role = 'player'")
        rows = cursor.fetchall()
    # Create User objects and convert them to dicts
        players = [cls(*row).to_dict() for row in rows]
        return players

    @classmethod
    def get_all_coaches(cls, db_connection):
        """Retrieve all coaches from the database as a list of dicts."""
        cursor = db_connection.cursor()
        cursor.execute("SELECT id, first_name, last_name, password, role FROM users WHERE role = 'coach'")
        rows = cursor.fetchall()
        coaches = [cls(*row).to_dict() for row in rows]
        return coaches

