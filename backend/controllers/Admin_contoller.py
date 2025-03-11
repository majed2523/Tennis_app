from flask import jsonify, request
from models.Admin import Admin
from controllers.Reservation_controller import ReservationController
import jwt
from datetime import datetime, timedelta

SECRET_KEY = "your_secret_key"

class AdminController:
    @staticmethod
    def admin_login():
        """Handles admin authentication and token issuance."""
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")

        admin = Admin.authenticate_admin(username, password)
        if admin:
            payload = {
                "admin_id": admin.admin_id,
                "username": admin.username,
                "role": admin.role,
                "exp": datetime.utcnow() + timedelta(hours=24)
            }
            token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
            return jsonify({"token": token, "role": admin.role}), 200
        return jsonify({"error": "Invalid credentials"}), 401

    @staticmethod
    def manage_court_bookings(admin_role):
        """Admin 2 can create court bookings."""
        if admin_role == "booking_manager":
            data = request.get_json()
            return ReservationController.create_reservation(
                data["client_phone"], data["court_id"], data["reservation_time"]
            )
        return jsonify({"error": "Unauthorized"}), 403

    @staticmethod
    def fetch_bookings(admin_role):
        """Fetch all bookings (Admin 2 only)."""
        if admin_role == "booking_manager":
            return jsonify(ReservationController.get_all_reservations()), 200
        return jsonify({"error": "Unauthorized"}), 403
