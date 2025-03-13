from dataclasses import dataclass

@dataclass
class Team:
    def __init__(self, id, team_name, coach_id):
        self.id = id
        self.team_name = team_name
        self.coach_id = coach_id

    def save(self, db_connection):
        cursor = db_connection.cursor()
        cursor.execute(
            "INSERT INTO teams (team_name, coach_id) VALUES (?, ?)",
            (self.team_name, self.coach_id),
        )
        db_connection.commit()

    @staticmethod
    def get_all_teams(conn):
        cursor = conn.cursor()
        cursor.execute("SELECT id, team_name, coach_id FROM teams")
        teams = cursor.fetchall()
        return [{"id": team[0], "team_name": team[1], "coach_id": team[2]} for team in teams]

    @staticmethod
    def get_team(conn, team_id):
        cursor = conn.cursor()
        cursor.execute("SELECT id, team_name, coach_id FROM teams WHERE id = ?", (team_id,))
        team = cursor.fetchone()
        if team:
            return {"id": team[0], "team_name": team[1], "coach_id": team[2]}
        return None
    
    
    @staticmethod
    def add_member(conn, team_id, player_id):
        cursor = conn.cursor()
        cursor.execute("INSERT INTO team_members (player_id, team_id) VALUES (?, ?)", (player_id, team_id))
        conn.commit()

    @staticmethod
    def remove_member(conn, team_id, player_id):
        cursor = conn.cursor()
        cursor.execute("DELETE FROM team_members WHERE team_id = ? AND player_id = ?", (team_id, player_id))
        conn.commit()

    @staticmethod
    def get_team_players(conn, team_id):
        cursor = conn.cursor()
        cursor.execute("""
            SELECT u.id, u.first_name, u.last_name, u.role
            FROM team_members tm
            JOIN users u ON tm.player_id = u.id
            WHERE tm.team_id = ?
        """, (team_id,))
        rows = cursor.fetchall()
        return [{"id": row[0], "firstName": row[1], "lastName": row[2], "role": row[3]} for row in rows]
