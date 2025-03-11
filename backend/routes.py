from flask import Blueprint, request, jsonify
from datetime import datetime
from controllers.Admin_contoller import AdminController
from controllers.Client_controller import ClientController
from controllers.Reservation_controller import ReservationController
from controllers.Court_controller import CourtController
import jwt
# Create a Blueprint for routes
routes_app = Blueprint('routes_app', __name__)

SECRET_KEY = "your_secret_key"

@routes_app.route('/')
def home():
    return jsonify({"message": "Welcome to the Tennis Club Reservation System!"}), 200

# --------------------
# Court Routes
# --------------------

@routes_app.route('/courts', methods=['POST'])
def create_court():
    data = request.get_json()  
    result = CourtController.add_court(data['court_name'], data['court_type'])
    if "court" in result:
        return jsonify({"message": "Court created", "court_id": result["court"].id}), 201
    return jsonify(result), 400


@routes_app.route('/courts/<int:court_id>', methods=['GET'])
def get_court(court_id):
    court = CourtController.get_court(court_id)
    if court:
        return jsonify(court.__dict__), 200
    return jsonify({"error": "Court not found"}), 404

@routes_app.route('/courts', methods=['GET'])
def get_all_courts():
    courts = CourtController.get_all_courts()
    return jsonify([court.__dict__ for court in courts]), 200

@routes_app.route('/courts/<int:court_id>', methods=['DELETE'])
def delete_court(court_id):
    if CourtController.delete_court(court_id):
        return jsonify({"message": "Court deleted"}), 200
    return jsonify({"error": "Court not found"}), 404

# ---------------------
# Authentication Decorator
# ---------------------
def authenticate(f):
    def wrapper(*args, **kwargs):
        token = request.headers.get("Authorization")
        if not token:
            return jsonify({"error": "Missing token"}), 401
        try:
            payload = jwt.decode(token.split(" ")[1], SECRET_KEY, algorithms=["HS256"])
            return f(payload["phone_number"], *args, **kwargs)
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401
    return wrapper

# --------------------
# Reservation Routes
# --------------------

@routes_app.route("/reservations", methods=["POST"])
@authenticate
def create_reservation(user_phone):
    """Handles new reservation requests for authenticated users."""
    try:
        data = request.get_json()
        if not data or "court_id" not in data or "reservation_time" not in data:
            return jsonify({"error": "Missing required fields"}), 400

        response = ReservationController.create_reservation(
            user_phone, data["court_id"], data["reservation_time"]
        )
        return jsonify(response[0]), response[1]

    except Exception as e:
        print(f"❌ Error in /reservations: {str(e)}")
        return jsonify({"error": "Internal Server Error"}), 500


@routes_app.route("/reservations", methods=["GET"])
def get_reservations():
    try:
        reservations = ReservationController.get_all_reservations()
        return jsonify(reservations), 200
    except Exception as e:
        print(f"❌ Error in /reservations: {str(e)}")
        return jsonify({"error": "Internal Server Error"}), 500


@routes_app.route('/reservations/<int:reservation_id>', methods=['PUT'])
def update_reservation(reservation_id):
    data = request.get_json()
    reservation_time = data.get('reservation_time')
    
    response, status_code = ReservationController.update_reservation(
        reservation_id, 
        data.get('client_phone'), 
        data.get('court_id'), 
        reservation_time
    )
    
    return jsonify(response), status_code

@routes_app.route("/reservations/client/<phone_number>", methods=["GET"])
def get_client_reservations(phone_number):
    try:
        reservations = ReservationController.get_reservations_for_client(phone_number)
        return jsonify(reservations), 200
    except Exception as e:
        print(f"❌ Error in /reservations/client: {str(e)}")
        return jsonify({"error": "Internal Server Error"}), 500

@routes_app.route("/reservations/court/<int:court_id>", methods=["GET"])
def get_court_reservations(court_id):
    try:
        reservations = ReservationController.get_reservations_for_court(court_id)
        return jsonify(reservations), 200
    except Exception as e:
        print(f"❌ Error in /reservations/court: {str(e)}")
        return jsonify({"error": "Internal Server Error"}), 500

@routes_app.route("/reservations/<int:reservation_id>", methods=["DELETE"])
def delete_reservation(reservation_id):
    try:
        response = ReservationController.delete_reservation(reservation_id)
        return jsonify(response[0]), response[1]
    except Exception as e:
        print(f"❌ Error in /reservations/delete: {str(e)}")
        return jsonify({"error": "Internal Server Error"}), 500

# --------------------
# Client Routes
# --------------------
@routes_app.route('/register', methods=['POST'])
def register_client():
    data = request.get_json()
    if "first_name" not in data or "last_name" not in data or "phone_number" not in data or "password" not in data:
        return jsonify({"error": "Missing required fields"}), 400

    response = ClientController.register_client(data['first_name'], data['last_name'], data['phone_number'], data['password'])
    return response

@routes_app.route('/login', methods=['POST'])
def login_client():
    try:
        print("🔹 Flask received /login request")
        data = request.get_json()
        print(f"🔹 Received /login request: {data}")
        if not data or "phone_number" not in data or "password" not in data:
            print("❌ Missing phone number or password.")
            return jsonify({"error": "Missing phone number or password"}), 400
        response, status_code = ClientController.login_client(data["phone_number"], data["password"])
        print(f"🔹 Login Response: {response}, Status Code: {status_code}")
        return jsonify(response), status_code
    except Exception as e:
        print(f"❌ Unexpected error in /login: {e}")
        return jsonify({"error": "Internal Server Error"}), 500

@routes_app.route('/client/<phone_number>', methods=['DELETE'])
def delete_user(phone_number):
    response = ClientController.remove_client(phone_number)
    return jsonify(response), (200 if "message" in response else 404)

@routes_app.route('/client/<phone_number>', methods=['PUT'])
def update_client(phone_number):
    data = request.get_json()
    if "first_name" not in data or "last_name" not in data:
        return jsonify({"error": "Missing first or last name"}), 400
    response = ClientController.update_client(phone_number, data['first_name'], data['last_name'])
    return jsonify(response), (200 if "message" in response else 404)

@routes_app.route('/client', methods=['GET'])
def get_client_details():
    token = request.headers.get("Authorization")
    if not token:
        return jsonify({"error": "Missing token"}), 401
    try:
        payload = jwt.decode(token.split(" ")[1], SECRET_KEY, algorithms=["HS256"])
        phone_number = payload["phone_number"]
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid token"}), 401
    client = ClientController.find_by_phone(phone_number)
    if not client:
        return jsonify({"error": "User not found"}), 404
    return jsonify({
        "phone_number": client.phone_number,
        "first_name": client.first_name,
        "last_name": client.last_name
    }), 200

# ---------------------
# Admin Authentication Decorator
# ---------------------

import functools

def authenticate_admin(f):
    """Ensures only authorized admins can access certain routes."""
    @functools.wraps(f)  # Fix: This preserves the function name
    def wrapper(*args, **kwargs):
        token = request.headers.get("Authorization")
        if not token:
            return jsonify({"error": "Missing token"}), 401
        try:
            payload = jwt.decode(token.split(" ")[1], SECRET_KEY, algorithms=["HS256"])
            admin_role = payload["role"]
            if admin_role not in ["schedule_manager", "booking_manager"]:
                return jsonify({"error": "Unauthorized role"}), 403
            return f(admin_role, *args, **kwargs)
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401
    return wrapper

# --------------------
# Admin Routes
# --------------------

@routes_app.route("/admin/login", methods=["POST"])
def admin_login_route():  # Renamed function to avoid conflicts
    """Handles admin login."""
    return AdminController.admin_login()

@routes_app.route("/admin/booking", methods=["POST"])
@authenticate_admin
def admin_manage_booking(admin_role):  # Renamed function
    """Admin 2 manages court bookings."""
    return AdminController.manage_court_bookings(admin_role)

@routes_app.route("/admin/bookings", methods=["GET"])
@authenticate_admin
def admin_fetch_bookings(admin_role):  # Renamed function
    """Admin 2 fetches all bookings."""
    return AdminController.fetch_bookings(admin_role)
