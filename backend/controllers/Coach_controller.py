from flask import jsonify, request
from models.CoachAvail import CoachAvailability
from models.Users import User
from database import get_db_connection
from flask_jwt_extended import jwt_required, get_jwt_identity

class CoachAvailabilityController:
    @staticmethod
    @jwt_required()
    def add_availability(coach_id, day, start_time, end_time):
        """Coach can add their availability."""
        conn = get_db_connection()
        user_id = get_jwt_identity()
        user = User.find_by_id(conn, user_id)

        if not user or user.role != "coach":
            conn.close()
            return jsonify({"error": "Unauthorized. Only coaches can add availability."}), 403

        availability = CoachAvailability(id=None, coach_id=coach_id, day=day, start_time=start_time, end_time=end_time)
        availability.save(conn)
        conn.close()

        return jsonify({"message": "Availability added successfully."}), 201


    @staticmethod
    def get_availability(coach_id):
        """Get coach availability by coach_id."""
        conn = get_db_connection()
        availability = CoachAvailability.get_availability(conn, coach_id)
        conn.close()
        return jsonify(availability), 200
