from models.CoachAvail import CoachAvailability
from models.Users import User
from database import get_db_connection
import sqlite3
from flask import jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

class CoachAvailabilityController:
    @staticmethod
    @jwt_required()
    def add_availability(coach_id, day, start_time, end_time):
        db = get_db_connection()
        logged_in_id = get_jwt_identity()
        user = User.find_by_id(db, logged_in_id)
        if not user or user.role != "coach":
            db.close()
            return jsonify({"error": "Unauthorized. Only coaches can add availability."}), 403
        # Use the provided coach_id or ensure that logged in coach matches
        availability = CoachAvailability(id=None, coach_id=coach_id, day=day, start_time=start_time, end_time=end_time)
        try:
            availability.save(db)
        except sqlite3.IntegrityError as e:
            db.close()
            return jsonify({"error": "Failed to add availability: " + str(e)}), 400
        db.close()
        return jsonify({"message": "Availability added successfully."}), 201

    @staticmethod
    def get_availability(coach_id):
        db = get_db_connection()
        avail = CoachAvailability.get_availability(db, coach_id)
        db.close()
        return jsonify(avail), 200

    @staticmethod
    @jwt_required()
    def update_availability(availability_id, day, start_time, end_time):
        db = get_db_connection()
        logged_in_id = get_jwt_identity()
        user = User.find_by_id(db, logged_in_id)
        if not user or user.role != "coach":
            db.close()
            return jsonify({"error": "Unauthorized. Only coaches can update availability."}), 403
        # Fetch existing record
        cursor = db.cursor()
        cursor.execute("SELECT id, coach_id, day, start_time, end_time FROM coach_availability WHERE id = ?", (availability_id,))
        row = cursor.fetchone()
        if not row:
            db.close()
            return jsonify({"error": "Availability record not found."}), 404
        availability = CoachAvailability.from_row(row)
        if availability.coach_id != logged_in_id:
            db.close()
            return jsonify({"error": "Unauthorized to update this availability."}), 403
        availability.day = day
        availability.start_time = start_time
        availability.end_time = end_time
        availability.update(db)
        db.close()
        return jsonify({"message": "Availability updated successfully."}), 200
