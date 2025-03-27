import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_PATH = os.getenv("DATABASE_URL", "sqlite:///tennis_club.db")
