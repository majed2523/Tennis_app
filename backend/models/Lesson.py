from dataclasses import dataclass

@dataclass
class Lesson:
    def __init__(self, id, player_id, coach_id, lesson_date, start_time, end_time):
        self.id = id
        self.player_id = player_id
        self.coach_id = coach_id
        self.lesson_date = lesson_date
        self.start_time = start_time
        self.end_time = end_time

    def save(self, db_connection):
        cursor = db_connection.cursor()
        cursor.execute(
            "INSERT INTO private_lessons (player_id, coach_id, lesson_date, start_time, end_time) VALUES (?, ?, ?, ?, ?)",
            (self.player_id, self.coach_id, self.lesson_date, self.start_time, self.end_time),
        )
        db_connection.commit()

    @staticmethod
    def is_booked(conn, coach_id, lesson_date, start_time):
        cursor = conn.cursor()
        cursor.execute(
            "SELECT 1 FROM private_lessons WHERE coach_id = ? AND lesson_date = ? AND start_time = ?",
            (coach_id, lesson_date, start_time),
        )
        return cursor.fetchone() is not None

    @staticmethod
    def get_player_lessons(conn, user_id):
        cursor = conn.cursor()
        cursor.execute("SELECT lesson_date, start_time, end_time, coach_id FROM private_lessons WHERE player_id = ?", (user_id,))
        lessons = cursor.fetchall()
        return [{"lesson_date": lesson[0], "start_time": lesson[1], "end_time": lesson[2], "coach_id": lesson[3]} for lesson in lessons]

    @staticmethod
    def get_coach_lessons(conn, coach_id):
        cursor = conn.cursor()
        cursor.execute("SELECT lesson_date, start_time, end_time, player_id FROM private_lessons WHERE coach_id = ?", (coach_id,))
        lessons = cursor.fetchall()
        return [{"lesson_date": lesson[0], "start_time": lesson[1], "end_time": lesson[2], "player_id": lesson[3]} for lesson in lessons]
