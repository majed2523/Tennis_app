from models.Reservation import ReservationC
from models.Client import ClientC
from models.Court import CourtC
from database import get_db_connection  
from datetime import datetime, timedelta

class ReservationController:
    @staticmethod
    def create_reservation(phone_number, court_id, reservation_time):
        """Creates a reservation after checking for conflicts."""
        conn = get_db_connection()

        # Convert string to datetime object
        try:
            start_time = datetime.fromisoformat(reservation_time)
            end_time = start_time + timedelta(hours=1)  # Assuming a 1-hour slot
        except ValueError:
            return {"error": "Invalid date format"}, 400

        # Check if the client exists
        client = ClientC.find_by_phone(conn, phone_number)
        if not client:
            return {"error": "Client does not exist"}, 404

        # Check if the court exists
        court = CourtC.get_by_id(conn, court_id)
        if not court:
            return {"error": "Court does not exist"}, 404

        # Check for conflicting reservations
        existing_reservations = ReservationC.find_conflicting(conn, court_id, start_time, end_time)
        if existing_reservations:
            return {"error": "This court is already reserved during this time"}, 409

        # Create the reservation
        new_reservation = ReservationC(phone_number, court_id, reservation_time)
        new_reservation.save(conn)
        print(f"User {phone_number} reserved court {court_id} at {reservation_time}")
        return {"message": "Reservation created successfully", "reservation_id": new_reservation.id}, 201

    @staticmethod
    def get_all_reservations():
        """Retrieves all reservations."""
        conn = get_db_connection()
        reservations = ReservationC.get_all(conn)
        return [res.__dict__ for res in reservations]

    @staticmethod
    def get_reservations_for_client(phone_number):
        """Retrieves reservations for a specific client."""
        conn = get_db_connection()
        reservations = ReservationC.get_for_client(conn, phone_number)
        return [res.__dict__ for res in reservations]

    @staticmethod
    def get_reservations_for_court(court_id):
        """Retrieves reservations for a specific court."""
        conn = get_db_connection()
        reservations = ReservationC.get_for_court(conn, court_id)
        return [res.__dict__ for res in reservations]

    @staticmethod
    def delete_reservation(reservation_id):
        """Deletes a reservation."""
        conn = get_db_connection()
        reservation = ReservationC.get_by_id(conn, reservation_id)
        if not reservation:
            return {"error": "Reservation not found"}, 404
        reservation.delete(conn)
        return {"message": "Reservation deleted successfully"}, 200

    @staticmethod
    def update_reservation(reservation_id, client_phone, court_id, reservation_time):
        conn = get_db_connection()
        
        # Retrieve the existing reservation
        reservation = ReservationC.get_by_id(conn, reservation_id)
        if not reservation:
            conn.close()
            return {"error": "Reservation not found"}, 404

        # Validate the new reservation time
        try:
            start_time = datetime.fromisoformat(reservation_time)
            end_time = start_time + timedelta(hours=1)
        except ValueError:
            conn.close()
            return {"error": "Invalid date format"}, 400

        # Check if the client exists
        client = ClientC.find_by_phone(conn, client_phone)
        if not client:
            conn.close()
            return {"error": "Client does not exist"}, 404

        # Check if the court exists
        court = CourtC.get_by_id(conn, court_id)
        if not court:
            conn.close()
            return {"error": "Court does not exist"}, 404

        # Check for conflicting reservations (excluding current reservation)
        conflicts = ReservationC.find_conflicting(conn, court_id, start_time, end_time)
        conflicts = [conflict for conflict in conflicts if conflict.id != reservation_id]
        if conflicts:
            conn.close()
            return {"error": "This court is already reserved during this time"}, 409

        # Update and save the reservation
        reservation.client_phone = client_phone
        reservation.court_id = court_id
        reservation.reservation_time = reservation_time
        reservation.save(conn)
        conn.close()
        return {"message": "Reservation updated successfully", "reservation_id": reservation_id}, 200
