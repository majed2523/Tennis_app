"""
Court model for the Tennis Reservation App.
This module contains the Court class that represents the courts table in the database.
"""

from dataclasses import dataclass
from typing import Optional, List
from database import get_db_connection  # Import the function from the appropriate module

@dataclass
class CourtC:
    """
    Represents a tennis court in the club.
    
    Attributes:
        id: The unique identifier for the court (auto-incremented by DB)
        court_name: The unique name/number of the court
        court_type: The type of court (e.g., clay, hard, grass)
    """
    id: Optional[int] = None
    court_name: str = ""
    court_type: str = ""
    
    @classmethod
    def from_db_row(cls, row):
        """Creates a Court object from a database row."""
        return cls(
            id=row[0],
            court_name=row[1],
            court_type=row[2]
        )
    
    def save(self, db_connection):
        """Saves the court to the database."""
        cursor = db_connection.cursor()
        
        if self.id is None:
            # Insert new court
            cursor.execute(
                "INSERT INTO courts (court_name, court_type) VALUES (?, ?)",
                (self.court_name, self.court_type)
            )
            self.id = cursor.lastrowid
        else:
            # Update existing court
            cursor.execute(
                "UPDATE courts SET court_name = ?, court_type = ? WHERE id = ?",
                (self.court_name, self.court_type, self.id)
            )
        
        db_connection.commit()
        return self
    
    @classmethod
    def get_by_id(cls, db_connection, court_id):
        """Retrieves a court by its ID."""
        cursor = db_connection.cursor()
        cursor.execute("SELECT * FROM courts WHERE id = ?", (court_id,))
        row = cursor.fetchone()
        
        if row:
            return cls.from_db_row(row)
        return None
    
    @classmethod
    def get_all(cls, db_connection):
        """Retrieves all courts from the database."""
        cursor = db_connection.cursor()
        cursor.execute("SELECT * FROM courts ORDER BY court_name")
        
        return [cls.from_db_row(row) for row in cursor.fetchall()]
    
    @classmethod
    def find_by_name(cls, db_connection, court_name):
        """Finds a court by its name."""
        cursor = db_connection.cursor()
        cursor.execute("SELECT * FROM courts WHERE court_name = ?", (court_name,))
        row = cursor.fetchone()
        
        if row:
            return cls.from_db_row(row)
        return None
    
    def delete(self, db_connection):
        """Deletes the court from the database."""
        if self.id is None:
            return False
        
        cursor = db_connection.cursor()
        cursor.execute("DELETE FROM courts WHERE id = ?", (self.id,))
        db_connection.commit()
        
        rows_affected = cursor.rowcount
        self.id = None
        return rows_affected > 0