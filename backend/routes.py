from flask import Blueprint, request, jsonify
from controllers.Users_controller import UserController
from controllers.Team_controller import TeamController
from controllers.Lesson_controller import LessonController
from controllers.Coach_controller import CoachAvailabilityController
import jwt
from flask_jwt_extended import jwt_required

routes_app = Blueprint('routes_app', __name__)
SECRET_KEY = "your_secret_key"

# User routes
@routes_app.route('/register', methods=['POST'])
def register_user():
    data = request.get_json()
    first_name = data.get("first_name")
    last_name = data.get("last_name")
    password = data.get("password")
    role = data.get("role")
    if not first_name or not last_name or not password or not role:
        return jsonify({"error": "Missing required fields"}), 400
    token = request.headers.get("Authorization")
    if not token:
        return jsonify({"error": "Missing token"}), 401
    try:
        payload = jwt.decode(token.split(" ")[1], SECRET_KEY, algorithms=["HS256"])
        if payload.get("role") != "admin":
            return jsonify({"error": "Unauthorized. Only admin can register users."}), 403
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid token"}), 401
    return UserController.register_user(first_name, last_name, password, role)

@routes_app.route('/user', methods=['GET'])
@jwt_required()
def get_client():
    return UserController.get_client_details()

@routes_app.route('/login', methods=['POST'])
def login_user():
    data = request.get_json()
    user_id = data.get("user_id")
    password = data.get("password")
    if not user_id or not password:
        return jsonify({"error": "Missing required fields"}), 400
    return UserController.login_user(user_id, password)

@routes_app.route('/players', methods=['GET'])
def get_all_players():
    return UserController.get_all_players()

@routes_app.route('/coaches', methods=['GET'])
def get_all_coaches():
    return UserController.get_all_coaches()

# Team routes
@routes_app.route('/teams', methods=['POST'])
def create_team():
    data = request.get_json()
    team_name = data.get('team_name')
    coach_id = data.get('coach_id')
    if not team_name or not coach_id:
        return jsonify({"error": "Team name and coach ID are required."}), 400
    return TeamController.create_team(team_name, coach_id)

@routes_app.route('/teams/<int:team_id>', methods=['GET'])
def get_team(team_id):
    team = TeamController.get_team(team_id)
    if team:
        return jsonify(team), 200
    return jsonify({"error": "Team not found"}), 404

@routes_app.route('/teams', methods=['GET'])
def get_all_teams():
    return TeamController.get_all_teams()

@routes_app.route('/teams/<int:team_id>/players', methods=['POST'])
def assign_player_to_team(team_id):
    data = request.get_json()
    player_id = data.get("player_id")
    if not player_id:
        return jsonify({"error": "Player ID is required."}), 400
    return TeamController.assign_player_to_team(team_id, player_id)

@routes_app.route('/teams/<int:team_id>/players', methods=['GET'])
def get_team_players(team_id):
    return TeamController.get_team_players(team_id)

@routes_app.route('/teams/<int:team_id>/players/<int:player_id>', methods=['DELETE'])
def remove_player_from_team(team_id, player_id):
    return TeamController.remove_player_from_team(team_id, player_id)

# Coach Availability routes
@routes_app.route('/coach/availability', methods=['POST'])
def add_availability():
    data = request.get_json()
    coach_id = data.get("coach_id")
    day = data.get("day")
    start_time = data.get("start_time")
    end_time = data.get("end_time")
    if not coach_id or not day or not start_time or not end_time:
        return jsonify({"error": "Missing required fields"}), 400
    response = CoachAvailabilityController.add_availability(coach_id, day, start_time, end_time)
    return jsonify(response), 201

@routes_app.route('/coach/availability/<int:coach_id>', methods=['GET'])
def get_coach_availability(coach_id):
    availability = CoachAvailabilityController.get_availability(coach_id)
    return jsonify(availability), 200

# Private Lessons routes remain unchanged…
@routes_app.route('/lessons', methods=['POST'])
def book_lesson():
    data = request.get_json()
    coach_id = data.get("coach_id")
    lesson_date = data.get("lesson_date")
    start_time = data.get("start_time")
    end_time = data.get("end_time")
    if not coach_id or not lesson_date or not start_time or not end_time:
        return jsonify({"error": "Missing required fields"}), 400
    return jsonify(LessonController.book_lesson(coach_id, lesson_date, start_time, end_time)[0]), 201

@routes_app.route('/lessons/player/<int:user_id>', methods=['GET'])
def get_player_lessons(user_id):
    return LessonController.get_player_lessons(user_id)

@routes_app.route('/lessons/coach/<int:coach_id>', methods=['GET'])
def get_coach_lessons(coach_id):
    return LessonController.get_coach_lessons(coach_id)
