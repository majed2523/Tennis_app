"""
Reservation model for the Tennis Reservation App.
This module contains the Reservation class that represents the reservations table in the database.
"""

from datetime import datetime
from dataclasses import dataclass
from typing import Optional, List
from database import get_db_connection  # Import the function from the appropriate module

# Import related models
# These imports would need to be adjusted based on your final project structure
from models.Client import ClientC
from models.Court import CourtC


@dataclass
class ReservationC:
    """
    Represents a court reservation made by a client.
    
    Attributes:
        id: The unique identifier for the reservation (auto-incremented by DB)
        client_id: The ID of the client making the reservation
        court_id: The ID of the court being reserved
        reservation_time: The date and time of the reservation
        client: Optional reference to the full Client object
        court: Optional reference to the full Court object
    """
    client_phone: str  # ✅ Required field must be first
    court_id: int  # ✅ Required field
    reservation_time: str  # ✅ Required field

    id: int = None  # ✅ Optional field (must be last)

    
    @classmethod
    def from_db_row(cls, row):
        """Creates a Reservation object from a database row."""
        return cls(
            id=row[0],
            client_phone=row[1],
            court_id=row[2],
            reservation_time=datetime.fromisoformat(row[3]) if isinstance(row[3], str) else row[3]
        )
    
    def save(self, db_connection):
        """Saves the reservation to the database."""
        cursor = db_connection.cursor()
        
        if self.id is None:
            # Insert new reservation
            cursor.execute(
                "INSERT INTO reservations (client_phone, court_id, reservation_time) VALUES (?, ?, ?)",
                (self.client_phone, self.court_id, self.reservation_time)
            )
            self.id = cursor.lastrowid
        else:
            # Update existing reservation
            cursor.execute(
                "UPDATE reservations SET client_phone = ?, court_id = ?, reservation_time = ? WHERE id = ?",
                (self.client_phone, self.court_id, self.reservation_time, self.id)
            )
        
        db_connection.commit()
        return self
    
    @classmethod
    def get_by_id(cls, db_connection, reservation_id):
        """Retrieves a reservation by its ID."""
        cursor = db_connection.cursor()
        cursor.execute("SELECT * FROM reservations WHERE id = ?", (reservation_id,))
        row = cursor.fetchone()
        
        if row:
            return cls.from_db_row(row)
        return None
    
    @classmethod
    def get_all(cls, db_connection):
        """Retrieves all reservations from the database."""
        cursor = db_connection.cursor()
        cursor.execute("SELECT * FROM reservations ORDER BY reservation_time DESC")
        
        return [cls.from_db_row(row) for row in cursor.fetchall()]
    
    @classmethod
    def get_for_client(cls, db_connection, client_phone):
        """Retrieves all reservations for a specific client."""
        cursor = db_connection.cursor()
        cursor.execute(
            "SELECT * FROM reservations WHERE client_phone = ? ORDER BY reservation_time DESC",
            (client_phone,)
        )
        
        return [cls.from_db_row(row) for row in cursor.fetchall()]
    
    @classmethod
    def get_for_court(cls, db_connection, court_id):
        """Retrieves all reservations for a specific court."""
        cursor = db_connection.cursor()
        cursor.execute(
            "SELECT * FROM reservations WHERE court_id = ? ORDER BY reservation_time",
            (court_id,)
        )
        
        return [cls.from_db_row(row) for row in cursor.fetchall()]
    
    @classmethod
    def find_conflicting(cls, db_connection, court_id, start_time, end_time):
        """
        Finds any reservations that would conflict with the proposed time slot.
        This assumes reservation_time is the start time and a standard duration.
        """
        cursor = db_connection.cursor()
        cursor.execute(
            """
            SELECT * FROM reservations 
            WHERE court_id = ? AND 
            (reservation_time BETWEEN ? AND ? OR 
             datetime(reservation_time, '+1 hour') BETWEEN ? AND ?)
            """,
            (court_id, start_time, end_time, start_time, end_time)
        )
        
        return [cls.from_db_row(row) for row in cursor.fetchall()]
    
    def load_related(self, db_connection):
        """Loads the related Client and Court objects."""
        if self.client_phone and not self.client:
            self.client = ClientC.get_by_id(db_connection, self.client_phone) 
        
        if self.court_id and not self.court:
            self.court = CourtC.get_by_id(db_connection, self.court_id)
        
        return self
    
    def delete(self, db_connection):
        """Deletes the reservation from the database."""
        if self.id is None:
            return False
        
        cursor = db_connection.cursor()
        cursor.execute("DELETE FROM reservations WHERE id = ?", (self.id,))
        db_connection.commit()
        
        rows_affected = cursor.rowcount
        self.id = None
        return rows_affected > 0