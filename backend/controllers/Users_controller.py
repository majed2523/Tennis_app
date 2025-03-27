from models.Users import User
from database import get_db_connection
from flask import jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

class UserController:
    @staticmethod
    @jwt_required()
    def register_user(first_name, last_name, password, role):
        db = get_db_connection()
        admin_id = get_jwt_identity()
        admin_user = User.find_by_id(db, admin_id)
        if not admin_user or admin_user.role != "admin":
            db.close()
            return jsonify({"error": "Unauthorized. Only admin can register users."}), 403
        if role not in {"coach", "player"}:
            db.close()
            return jsonify({"error": "Invalid role. Must be 'coach' or 'player'."}), 400
        if User.find_by_name(db, first_name, last_name):
            db.close()
            return jsonify({"error": "User already exists."}), 400
        user = User(
            id=None,
            first_name=first_name,
            last_name=last_name,
            password=password,
            role=role
        )
        user.save(db)
        db.close()
        return jsonify({"message": f"User {first_name} {last_name} added successfully as a {role}."}), 201

    @staticmethod
    def login_user(user_id, password):
        db = get_db_connection()
        user = User.find_by_id(db, user_id)
        db.close()
        if not user or not user.verify_password(password):
            return jsonify({"error": "Invalid user ID or password"}), 401
        token = user.generate_token()
        return jsonify({"message": "Login successful", "token": token, "role": user.role}), 200

    @staticmethod
    @jwt_required()
    def get_client_details():
        user_id = get_jwt_identity()
        db = get_db_connection()
        user = User.find_by_id(db, user_id)
        db.close()
        if user:
            return jsonify(user.to_dict()), 200
        return jsonify({"error": "User not found"}), 404

    @staticmethod
    def get_all_players():
        db = get_db_connection()
        players = User.get_all_players(db)
        db.close()
        return jsonify(players), 200

    @staticmethod
    def get_all_coaches():
        db = get_db_connection()
        coaches = User.get_all_coaches(db)
        db.close()
        return jsonify(coaches), 200
    
    @staticmethod
    @jwt_required()
    def update_user(user_id, new_id, new_password):
        db = get_db_connection()
        admin_id = get_jwt_identity()
        admin_user = User.find_by_id(db, admin_id)

        if not admin_user or admin_user.role != "admin":
            db.close()
            return jsonify({"error": "Unauthorized. Only admin can update users."}), 403

        user = User.find_by_id(db, user_id)
        if not user:
            db.close()
            return jsonify({"error": "User not found"}), 404
        
        success = User.update(db, user_id, new_id=new_id, new_password=new_password)
        db.close()
        if success:
            return jsonify({"message": f"User {user_id} updated successfully."}), 200
        else:
            return jsonify({"error": "Failed to update user."}), 500

    @staticmethod
    @jwt_required()
    def delete_user(user_id):
        db = get_db_connection()
        admin_id = get_jwt_identity()
        admin_user = User.find_by_id(db, admin_id)

        if not admin_user or admin_user.role != "admin":
            db.close()
            return jsonify({"error": "Unauthorized. Only admin can delete users."}), 403

        success = User.delete(db, user_id)
        db.close()

        if success:
            return jsonify({"message": f"User {user_id} deleted successfully."}), 200
        else:
            return jsonify({"error": "Failed to delete user."}), 500
