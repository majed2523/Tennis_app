import bcrypt
import jwt
import datetime
from dataclasses import dataclass
from database import get_db_connection
from flask import current_app  # for accessing the JWT secret from main.py

@dataclass
class User:
    id: int
    first_name: str
    last_name: str
    password: str
    role: str  # 'player', 'coach', or 'admin'

    @classmethod
    def from_row(cls, row):
        if row is None:
            return None
        return cls(
            id=row[0],
            first_name=row[1],
            last_name=row[2],
            password=row[3],
            role=row[4]
        )

    def to_dict(self):
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "role": self.role
        }

    def hash_password(self):
        # only hash if it's not already hashed
        if not self.password.startswith("$2b$"):
            self.password = bcrypt.hashpw(
                self.password.encode('utf-8'),
                bcrypt.gensalt()
            ).decode('utf-8')

    def verify_password(self, password):
        return bcrypt.checkpw(password.encode('utf-8'), self.password.encode('utf-8'))

    def save(self, db):
        self.hash_password()
        cursor = db.cursor()
        # Check for duplicate user
        cursor.execute(
            "SELECT id FROM users WHERE first_name = %s AND last_name = %s",
            (self.first_name, self.last_name)
        )
        if cursor.fetchone():
            return False  # Already exists
        cursor.execute(
            "INSERT INTO users (first_name, last_name, password, role) VALUES (%s, %s, %s, %s)",
            (self.first_name, self.last_name, self.password, self.role)
        )
        db.commit()
        return True

    def delete(db, user_id):
        cursor = db.cursor()
        cursor.execute("DELETE FROM users WHERE id = %s", (user_id,))
        db.commit()
        return cursor.rowcount > 0
    
    def update(db, user_id, new_id=None, new_password=None):
        cursor = db.cursor()
        if new_id:
            cursor.execute("UPDATE users SET id = %s WHERE id = %s", (new_id, user_id))
        if new_password:
            hashed_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            cursor.execute(
                "UPDATE users SET password = %s WHERE id = %s",
                (hashed_password, new_id if new_id else user_id)
            )
        db.commit()
        return True

    def generate_token(self):
        payload = {
            "id": self.id,
            "role": self.role,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }
        secret = current_app.config['JWT_SECRET_KEY']  # from main.py
        return jwt.encode(payload, secret, algorithm="HS256")

    @classmethod
    def find_by_id(cls, db, user_id):
        cursor = db.cursor()
        cursor.execute(
            "SELECT id, first_name, last_name, password, role FROM users WHERE id = %s",
            (user_id,)
        )
        row = cursor.fetchone()
        return cls.from_row(row)

    @classmethod
    def find_by_name(cls, db, first_name, last_name):
        cursor = db.cursor()
        cursor.execute(
            "SELECT id, first_name, last_name, password, role FROM users WHERE first_name = %s AND last_name = %s",
            (first_name, last_name)
        )
        row = cursor.fetchone()
        return cls.from_row(row)

    @classmethod
    def get_all_players(cls, db):
        cursor = db.cursor()
        cursor.execute("SELECT id, first_name, last_name, password, role FROM users WHERE role = 'player'")
        rows = cursor.fetchall()
        return [cls.from_row(row).to_dict() for row in rows]

    @classmethod
    def get_all_coaches(cls, db):
        cursor = db.cursor()
        cursor.execute("SELECT id, first_name, last_name, password, role FROM users WHERE role = 'coach'")
        rows = cursor.fetchall()
        return [cls.from_row(row).to_dict() for row in rows]
