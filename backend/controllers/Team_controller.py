from models.Team import Team
from models.Users import User
from database import get_db_connection
import sqlite3
from flask import jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

class TeamController:
    @staticmethod
    @jwt_required()
    def create_team(team_name, coach_id):
        db = get_db_connection()
        admin_id = get_jwt_identity()
        admin_user = User.find_by_id(db, admin_id)
        if not admin_user or admin_user.role != "admin":
            db.close()
            return jsonify({"error": "Unauthorized. Only admin can create teams."}), 403
        team = Team(id=None, team_name=team_name, coach_id=coach_id)
        try:
            team.save(db)
        except sqlite3.IntegrityError as e:
            db.close()
            return jsonify({"error": "Team creation failed: " + str(e)}), 400
        db.close()
        return jsonify({"message": f"Team '{team_name}' created successfully."}), 201

    @staticmethod
    @jwt_required()
    def get_all_teams():
        db = get_db_connection()
        teams = Team.get_all_teams(db)
        db.close()
        return jsonify(teams), 200

    @staticmethod
    @jwt_required()
    def get_team(team_id):
        db = get_db_connection()
        team = Team.get_team(db, team_id)
        db.close()
        if team:
            return jsonify(team), 200
        else:
            return jsonify({"error": "Team not found"}), 404

    @staticmethod
    @jwt_required()
    def assign_player_to_team(team_id, player_id):
        db = get_db_connection()
        admin_id = get_jwt_identity()
        admin_user = User.find_by_id(db, admin_id)
        if not admin_user or admin_user.role != "admin":
            db.close()
            return jsonify({"error": "Unauthorized. Only admin can assign players."}), 403
        try:
            Team.assign_player(db, team_id, player_id)
        except sqlite3.IntegrityError:
            db.close()
            return jsonify({"error": "Player already assigned to this team."}), 400
        db.close()
        return jsonify({"message": "Player successfully assigned to team."}), 200

    @staticmethod
    @jwt_required()
    def get_team_players(team_id):
        db = get_db_connection()
        players = Team.get_team_players(db, team_id)
        db.close()
        return jsonify(players), 200

    @staticmethod
    @jwt_required()
    def remove_player_from_team(team_id, player_id):
        db = get_db_connection()
        admin_id = get_jwt_identity()
        admin_user = User.find_by_id(db, admin_id)
        if not admin_user or admin_user.role != "admin":
            db.close()
            return jsonify({"error": "Unauthorized. Only admin can remove players."}), 403
        Team.remove_player(db, team_id, player_id)
        db.close()
        return jsonify({"message": "Player successfully removed from team."}), 200
