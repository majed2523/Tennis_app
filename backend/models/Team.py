from dataclasses import dataclass

@dataclass
class Team:
    id: int
    team_name: str
    coach_id: int
    coach_name: str = None

    @classmethod
    def from_row(cls, row):
        if row is None:
            return None
        # row has keys: id, team_name, coach_id, first_name, last_name
        return cls(
            id=row["id"],
            team_name=row["team_name"],
            coach_id=row["coach_id"],
            coach_name=(f"{row['first_name']} {row['last_name']}"
                        if row['first_name'] and row['last_name']
                        else "Unassigned")
        )

    def to_dict(self):
        return {
            "id": self.id,
            "team_name": self.team_name,
            "coach_id": self.coach_id,
            "coach_name": self.coach_name
        }

    def save(self, db):
        cursor = db.cursor()
        cursor.execute(
            "INSERT INTO teams (team_name, coach_id) VALUES (%s, %s)",
            (self.team_name, self.coach_id)
        )
        db.commit()

    @staticmethod
    def get_all_teams(db):
        cursor = db.cursor()
        cursor.execute("""
        SELECT t.id, t.team_name, t.coach_id, u.first_name, u.last_name
        FROM teams t
        LEFT JOIN users u ON t.coach_id = u.id
        """)
        rows = cursor.fetchall()
        return [Team.from_row(row).to_dict() for row in rows]

    @staticmethod
    def get_team(db, team_id):
        cursor = db.cursor()
        cursor.execute("""
        SELECT t.id, t.team_name, t.coach_id, 
               u.first_name, u.last_name
        FROM teams t
        LEFT JOIN users u ON t.coach_id = u.id
        WHERE t.id = %s
        """, (team_id,))
        row = cursor.fetchone()
        
        if row is None:
            return None
        
        team = Team.from_row(row).to_dict()
        print("🔹 get_team() Output:", team)  # Debugging output
        return team

    @staticmethod
    def assign_player(db, team_id, player_id):
        cursor = db.cursor()
        cursor.execute(
            "INSERT INTO team_members (team_id, player_id) VALUES (%s, %s)",
            (team_id, player_id)
        )
        db.commit()

    @staticmethod
    def remove_player(db, team_id, player_id):
        cursor = db.cursor()
        cursor.execute(
            "DELETE FROM team_members WHERE team_id = %s AND player_id = %s",
            (team_id, player_id)
        )
        db.commit()

    @staticmethod
    def get_team_players(db, team_id):
        cursor = db.cursor()
        cursor.execute("""
            SELECT u.id, u.first_name, u.last_name, u.role
            FROM users u
            JOIN team_members tm ON u.id = tm.player_id
            WHERE tm.team_id = %s
        """, (team_id,))
        rows = cursor.fetchall()
        return {
            "players": [
                {
                    "id": row["id"],
                    "first_name": row["first_name"],
                    "last_name": row["last_name"],
                    "role": row["role"]
                }
                for row in rows
            ],
            "count": len(rows)
        }

    @staticmethod
    def delete_team(db, team_id):
        cursor = db.cursor()
        cursor.execute("DELETE FROM teams WHERE id = %s", (team_id,))
        db.commit()
        return cursor.rowcount > 0  # True if a row was deleted
