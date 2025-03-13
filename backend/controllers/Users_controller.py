from models.Users import User
from database import get_db_connection
import bcrypt
from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity

class UserController:
    @staticmethod
    @jwt_required()
    def register_user(first_name, last_name, password, role):
        conn = get_db_connection()
        admin_id = get_jwt_identity()
        admin_user = User.find_by_id(conn, admin_id)
        if not admin_user or admin_user.role != "admin":
            conn.close()
            return jsonify({"error": "Unauthorized. Only the admin can register new users."}), 403
        if role not in {"coach", "player"}:
            conn.close()
            return jsonify({"error": "Invalid role. Must be 'coach' or 'player'."}), 400
        if User.find_by_name(conn, first_name, last_name):
            conn.close()
            return jsonify({"error": "User already exists."}), 400
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        user = User(id=None, first_name=first_name, last_name=last_name, password=hashed_password, role=role)
        user.save(conn)
        conn.close()
        return jsonify({"message": f"User {first_name} {last_name} added successfully as a {role}."}), 201

    @staticmethod
    def login_user(user_id, password):
        conn = get_db_connection()
        user = User.find_by_id(conn, user_id)
        conn.close()
        if not user or not user.verify_password(password):
            return jsonify({"error": "Invalid user ID or password"}), 401
        token = user.generate_token()
        return jsonify({"message": "Login successful", "token": token, "role": user.role}), 200

    @staticmethod
    @jwt_required()
    def remove_user(user_id):
        conn = get_db_connection()
        admin_id = get_jwt_identity()
        admin_user = User.find_by_id(conn, admin_id)
        if not admin_user or admin_user.role != "admin":
            conn.close()
            return jsonify({"error": "Unauthorized. Only the admin can remove users."}), 403
        user = User.find_by_id(conn, user_id)
        if not user:
            conn.close()
            return jsonify({"error": "User not found"}), 404
        user.delete(conn)
        conn.close()
        return jsonify({"message": f"User {user.first_name} {user.last_name} removed successfully."}), 200

    @staticmethod
    def get_client_details():
        user_id = get_jwt_identity()
        conn = get_db_connection()
        user = User.find_by_id(conn, user_id)
        conn.close()
        if user:
            return jsonify(user.to_dict()), 200
        return jsonify({"error": "User not found"}), 404

    @staticmethod
    def get_all_players():
        conn = get_db_connection()
        players = User.get_all_players(conn)
        conn.close()
        return jsonify(players), 200

    @staticmethod
    def get_all_coaches():
        conn = get_db_connection()
        coaches = User.get_all_coaches(conn)
        conn.close()
        return jsonify(coaches), 200
