from flask import Blueprint, request, jsonify, current_app
from flask_cors import cross_origin
from controllers.Users_controller import UserController
from controllers.Team_controller import TeamController
from controllers.Lesson_controller import LessonController
from controllers.Coach_controller import CoachAvailabilityController
from flask_jwt_extended import jwt_required
import jwt

routes_app = Blueprint('routes_app', __name__)

# ---------------------------------
# User Endpoints
# ---------------------------------

@routes_app.route('/register', methods=['POST'])
def register_user():
    """
    Admin can register a new user (only 'coach' or 'player').
    Expects JSON body: { "first_name": "", "last_name": "", "password": "", "role": "player" }
    """
    data = request.get_json()
    first_name = data.get("first_name")
    last_name = data.get("last_name")
    password = data.get("password")
    role = data.get("role")
    if not first_name or not last_name or not password or not role:
        return jsonify({"error": "Missing required fields"}), 400

    # Only admin can register users.
    token = request.headers.get("Authorization")
    if not token:
        return jsonify({"error": "Missing token"}), 401

    try:
        payload = jwt.decode(
            token.split(" ")[1],
            current_app.config['JWT_SECRET_KEY'],  # from main.py
            algorithms=["HS256"]
        )
        if payload.get("role") != "admin":
            return jsonify({"error": "Unauthorized. Only admin can register users."}), 403
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid token"}), 401

    return UserController.register_user(first_name, last_name, password, role)


@routes_app.route('/login', methods=['POST'])
def login_user():
    """
    Login endpoint for all users.
    Expects JSON body: { "user_id": <id>, "password": "<password>" }
    """
    data = request.get_json()
    user_id = data.get("user_id")
    password = data.get("password")
    if not user_id or not password:
        return jsonify({"error": "Missing required fields"}), 400
    return UserController.login_user(user_id, password)


@routes_app.route('/user', methods=['GET'])
@jwt_required()
def get_client():
    """
    Returns the details for the currently logged-in user.
    """
    return UserController.get_client_details()


@routes_app.route('/players', methods=['GET'])
def get_all_players():
    """
    Returns a list of all players.
    """
    return UserController.get_all_players()


@routes_app.route('/coaches', methods=['GET'])
def get_all_coaches():
    """
    Returns a list of all coaches.
    """
    return UserController.get_all_coaches()


@routes_app.route('/user/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    """
    Admin can update user ID or password.
    Expects JSON body: { "new_id": <id>, "new_password": "<password>" }
    """
    data = request.get_json()
    new_id = data.get("new_id")
    new_password = data.get("new_password")
    return UserController.update_user(user_id, new_id, new_password)


@routes_app.route('/user/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    """
    Admin can delete a user.
    """
    return UserController.delete_user(user_id)


# ---------------------------------
# Team Endpoints
# ---------------------------------

@routes_app.route('/teams', methods=['POST'])
@jwt_required()
def create_team():
    """
    Admin can create a team.
    Expects JSON body: { "team_name": "", "coach_id": <coach_id> }
    """
    data = request.get_json()
    team_name = data.get("team_name")
    coach_id = data.get("coach_id")
    if not team_name or not coach_id:
        return jsonify({"error": "Team name and coach ID are required."}), 400
    return TeamController.create_team(team_name, coach_id)


@routes_app.route('/teams/<int:team_id>', methods=['GET'])
def get_team(team_id):
    """
    Get details of a specific team.
    """
    return TeamController.get_team(team_id)


@routes_app.route('/teams', methods=['GET'])
def get_all_teams():
    """
    Get a list of all teams.
    """
    return TeamController.get_all_teams()


@routes_app.route('/teams/<int:team_id>/players', methods=['POST'])
@jwt_required()
def assign_player_to_team(team_id):
    """
    Admin can assign a player to a team.
    Expects JSON body: { "player_id": <player_id> }
    """
    data = request.get_json()
    player_id = data.get("player_id")
    if not player_id:
        return jsonify({"error": "Player ID is required."}), 400
    return TeamController.assign_player_to_team(team_id, player_id)


@routes_app.route('/teams/<int:team_id>/players', methods=['GET'])
@jwt_required()
def get_team_players(team_id):
    """
    Get all players assigned to a specific team.
    """
    return TeamController.get_team_players(team_id)


@routes_app.route('/teams/<int:team_id>/players/<int:player_id>', methods=['DELETE'])
@jwt_required()
def remove_player_from_team(team_id, player_id):
    """
    Admin can remove a player from a team.
    """
    return TeamController.remove_player_from_team(team_id, player_id)


@routes_app.route('/teams/<int:team_id>', methods=['DELETE'])
@jwt_required()
def delete_team(team_id):
    """
    Admin can delete a team.
    """
    return TeamController.delete_team(team_id)


# ---------------------------------
# Coach Availability Endpoints
# ---------------------------------

@routes_app.route('/coach/availability', methods=['POST'])
@jwt_required()
def add_availability():
    """
    Coach can add availability.
    Expects JSON body: { "coach_id": <coach_id>, "day": "<day>", "start_time": "<HH:MM>", "end_time": "<HH:MM>" }
    """
    data = request.get_json()
    coach_id = data.get("coach_id")
    day = data.get("day")
    start_time = data.get("start_time")
    end_time = data.get("end_time")
    if not coach_id or not day or not start_time or not end_time:
        return jsonify({"error": "Missing required fields"}), 400
    return CoachAvailabilityController.add_availability(coach_id, day, start_time, end_time)


@routes_app.route('/coach/availability/<int:coach_id>', methods=['GET'])
def get_availability(coach_id):
    """
    Get the availability for a given coach.
    """
    return CoachAvailabilityController.get_availability(coach_id)


# ---------------------------------
# Lesson Endpoints
# ---------------------------------

@routes_app.route('/lessons', methods=['POST'])
@jwt_required()
def book_lesson():
    """
    Players can book a private lesson.
    Expects JSON body: { "coach_id": <coach_id>, "lesson_date": "<YYYY-MM-DD>", "start_time": "<HH:MM>", "end_time": "<HH:MM>" }
    """
    data = request.get_json()
    coach_id = data.get("coach_id")
    lesson_date = data.get("lesson_date")
    start_time = data.get("start_time")
    end_time = data.get("end_time")
    if not coach_id or not lesson_date or not start_time or not end_time:
        return jsonify({"error": "Missing required fields"}), 400
    return LessonController.book_lesson(coach_id, lesson_date, start_time, end_time)


@routes_app.route('/lessons/player/<int:player_id>', methods=['GET'])
@jwt_required()
def get_player_lessons(player_id):
    """
    Get all lessons booked by a player.
    """
    return LessonController.get_player_lessons(player_id)


@routes_app.route('/lessons/coach/<int:coach_id>', methods=['GET'])
@jwt_required()
def get_coach_lessons(coach_id):
    """
    Get all lessons for a coach.
    """
    return LessonController.get_coach_lessons(coach_id)
