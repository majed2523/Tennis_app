from models.Court import CourtC
from database import get_db_connection

class CourtController:
    @staticmethod
    def add_court(court_name: str, court_type: str):
        """Adds a new court if the name is unique."""
        conn = get_db_connection()

        # Prevent duplicate court names
        existing_court = CourtC.find_by_name(conn, court_name)
        if existing_court:
            conn.close()
            return {"error": "A court with this name already exists."}

        # Create the court
        court = CourtC(court_name=court_name, court_type=court_type)
        court.save(conn)
        conn.close()
        return {"message": "Court added successfully", "court": court}

    @staticmethod
    def get_court(court_id: int):
        """Fetches a court if it exists."""
        conn = get_db_connection()
        court = CourtC.get_by_id(conn, court_id)
        conn.close()

        if not court:
            return {"error": "Court not found"}
        return {"court": court}

    @staticmethod
    def delete_court(court_id: int):
        """Removes a court only if there are no reservations for it."""
        conn = get_db_connection()
        court = CourtC.get_by_id(conn, court_id)

        if not court:
            conn.close()
            return {"error": "Court not found"}

        # TODO: Ensure no reservations exist before deleting
        court.delete(conn)
        conn.close()
        return {"message": "Court deleted successfully"}


    @staticmethod
    def get_all_courts():
        conn = get_db_connection()  # Get the database connection
        try:
            courts = CourtC.get_all(conn)  # Pass the connection to the model method
            return courts
        finally:
            conn.close()  # Close the connection after use
