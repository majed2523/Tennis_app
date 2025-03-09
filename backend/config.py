import os

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))  # Go one level up
DATABASE_PATH = os.path.join(BASE_DIR, "database", "tennis_club.db")  # Correct path

print(f"🔹 Database Path: {DATABASE_PATH}")  # Debugging step



# Secret key for Flask (replace with a real secret key in production)
SECRET_KEY = 'your-secret-key-here'