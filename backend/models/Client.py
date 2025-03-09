import bcrypt
import jwt
import datetime
from dataclasses import dataclass
from database import get_db_connection

SECRET_KEY = "your_secret_key"  # Change this in production!

@dataclass
class ClientC:
    phone_number: str
    first_name: str
    last_name: str
    password: str

    @classmethod
    def from_db_row(cls, row):
        """Creates a Client object from a database row."""
        if row is None:
            return None
        print(f"📌 Debug: Retrieved row from DB → {row}")  # Debugging line
        return cls(
            phone_number=row[0],  # ✅ Ensure correct order
            first_name=row[1],
            last_name=row[2],
            password=row[3]
        )

    def hash_password(self):
        """Hashes the password before storing."""
        if not self.password.startswith("$2b$"):
            self.password = bcrypt.hashpw(self.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    def verify_password(self, password):
        """Verifies the provided password against the stored hashed password."""
        return bcrypt.checkpw(password.encode('utf-8'), self.password.encode('utf-8'))        

    def save(self, db_connection):
        """Saves or updates the client in the database."""
        self.phone_number = self.phone_number.strip()  # ✅ Ensure clean phone numbers

        if not self.password.startswith("$2b$"):  # ✅ Ensure password is hashed
            self.password = bcrypt.hashpw(self.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        cursor = db_connection.cursor()
        cursor.execute("SELECT * FROM clients WHERE phone_number = ?", (self.phone_number,))
        existing = cursor.fetchone()

        if existing:
            print(f"❌ Client with phone number {self.phone_number} already exists. Skipping insert.")
            return False  # ✅ Prevent duplicate entries

    # ✅ Debugging Step: Print the values before inserting
        print(f"📌 Inserting client: phone_number={self.phone_number}, first_name={self.first_name}, last_name={self.last_name}, password={self.password}")

        cursor.execute(
        "INSERT INTO clients (phone_number, first_name, last_name, password) VALUES (?, ?, ?, ?)",(self.phone_number, self.first_name, self.last_name, self.password))

        db_connection.commit()
        print(f"✅ Client {self.phone_number} saved successfully.")
        return True


    @classmethod
    def find_by_phone(cls, db_connection, phone_number):
        """Finds a client by their phone number."""
        cursor = db_connection.cursor()
    
        print(f"🔹 Checking if phone number exists: '{phone_number}'")

        cursor.execute("SELECT phone_number, first_name, last_name, password FROM clients WHERE phone_number = ?", (phone_number,))
        row = cursor.fetchone()

        if row:
            print(f"✅ Client with phone number {phone_number} exists.")
            return cls(*row)  # ✅ Return a ClientC object instead of True
        else:
            print(f"❌ No client found with phone number: '{phone_number}'")
            return None  # ✅ Return None instead of False


    def generate_token(self):
        """Generates a JWT token for the client."""
        payload = {
            "phone_number": self.phone_number,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }
        return jwt.encode(payload, SECRET_KEY, algorithm="HS256")

    
       
    def delete(self, db_connection):
        """Deletes the client from the database."""
        cursor = db_connection.cursor()
        cursor.execute("DELETE FROM clients WHERE phone_number = ?", (self.phone_number,))
        db_connection.commit()
        return cursor.rowcount > 0  # Returns True if a row was deleted
