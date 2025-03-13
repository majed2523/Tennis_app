from dataclasses import dataclass
@dataclass
class CoachAvailability:
    def __init__(self, id, coach_id, day, start_time, end_time):
        self.id = id
        self.coach_id = coach_id
        self.day = day
        self.start_time = start_time
        self.end_time = end_time

    def save(self, db_connection):
        cursor = db_connection.cursor()
        cursor.execute(
            "INSERT INTO coach_availability (coach_id, day, start_time, end_time) VALUES (?, ?, ?, ?)",
            (self.coach_id, self.day, self.start_time, self.end_time),
        )
        db_connection.commit()

    @staticmethod
    def get_availability(conn, coach_id):
        cursor = conn.cursor()
        cursor.execute("SELECT day, start_time, end_time FROM coach_availability WHERE coach_id = ?", (coach_id,))
        return cursor.fetchall()
