from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.Users import User
from models.Team import Team
from database import get_db_connection
import sqlite3

class TeamController:
    @staticmethod
    @jwt_required()
    def create_team(team_name, coach_id):
        """Admin can create a new team with a coach."""
        conn = get_db_connection()
        admin_id = get_jwt_identity()
        admin_user = User.find_by_id(conn, admin_id)

        if not admin_user or admin_user.role != "admin":
            conn.close()
            return jsonify({"error": "Unauthorized. Only admin can create teams."}), 403

        # Save the team using the model method
        team = Team(id=None, team_name=team_name, coach_id=coach_id)
        team.save(conn)
        conn.close()

        return jsonify({"message": f"Team '{team_name}' created successfully."}), 201

    @staticmethod
    @jwt_required()
    def get_all_teams():
        """Get all teams."""
        conn = get_db_connection()
        teams = Team.get_all_teams(conn)
        conn.close()
        return jsonify(teams), 200

    @staticmethod
    @jwt_required()
    def get_team(team_id):
        """Get a team by its ID."""
        conn = get_db_connection()
        team = Team.get_team(conn, team_id)
        conn.close()

        if team:
            return jsonify(team), 200
        else:
            return jsonify({"error": "Team not found"}), 404
    
    
    @staticmethod
    @jwt_required()
    def assign_player_to_team(team_id, player_id):
        """Assign a player to a specific team. Admin only."""
        conn = get_db_connection()
        admin_id = get_jwt_identity()
        admin_user = User.find_by_id(conn, admin_id)
        if not admin_user or admin_user.role != "admin":
            conn.close()
            return jsonify({"error": "Unauthorized. Only admin can assign players."}), 403
        try:
            Team.add_member(conn, team_id, player_id)
        except sqlite3.IntegrityError:
            conn.close()
            return jsonify({"error": "Player already assigned to this team."}), 400
        conn.close()
        return jsonify({"message": "Player successfully assigned to team."}), 200

    @staticmethod
    @jwt_required()
    def get_team_players(team_id):
        """Get all players assigned to a specific team."""
        conn = get_db_connection()
        players = Team.get_team_players(conn, team_id)
        conn.close()
        return jsonify(players), 200

    @staticmethod
    @jwt_required()
    def remove_player_from_team(team_id, player_id):
        """Remove a player from a specific team. Admin only."""
        conn = get_db_connection()
        admin_id = get_jwt_identity()
        admin_user = User.find_by_id(conn, admin_id)
        if not admin_user or admin_user.role != "admin":
            conn.close()
            return jsonify({"error": "Unauthorized. Only admin can remove players."}), 403
        Team.remove_member(conn, team_id, player_id)
        conn.close()
        return jsonify({"message": "Player successfully removed from team."}), 200