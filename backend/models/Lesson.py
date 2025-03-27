from dataclasses import dataclass

@dataclass
class Lesson:
    id: int
    player_id: int
    coach_id: int
    lesson_date: str
    start_time: str
    end_time: str

    @classmethod
    def from_row(cls, row):
        if row is None:
            return None
        return cls(
            id=row["id"],
            player_id=row["player_id"],
            coach_id=row["coach_id"],
            lesson_date=row["lesson_date"],
            start_time=row["start_time"],
            end_time=row["end_time"]
        )

    def to_dict(self):
        return {
            "id": self.id,
            "player_id": self.player_id,
            "coach_id": self.coach_id,
            "lesson_date": self.lesson_date,
            "start_time": self.start_time,
            "end_time": self.end_time
        }

    def save(self, db):
        cursor = db.cursor()
        cursor.execute(
            "INSERT INTO private_lessons (player_id, coach_id, lesson_date, start_time, end_time) VALUES (%s, %s, %s, %s, %s)",
            (self.player_id, self.coach_id, self.lesson_date, self.start_time, self.end_time)
        )
        db.commit()

    @staticmethod
    def is_booked(db, coach_id, lesson_date, start_time):
        cursor = db.cursor()
        cursor.execute(
            "SELECT 1 FROM private_lessons WHERE coach_id = %s AND lesson_date = %s AND start_time = %s",
            (coach_id, lesson_date, start_time)
        )
        return cursor.fetchone() is not None

    @staticmethod
    def get_player_lessons(db, player_id):
        cursor = db.cursor()
        cursor.execute(
            "SELECT id, player_id, coach_id, lesson_date, start_time, end_time FROM private_lessons WHERE player_id = %s",
            (player_id,)
        )
        rows = cursor.fetchall()
        return [Lesson.from_row(row).to_dict() for row in rows]

    @staticmethod
    def get_coach_lessons(db, coach_id):
        cursor = db.cursor()
        cursor.execute(
            "SELECT id, player_id, coach_id, lesson_date, start_time, end_time FROM private_lessons WHERE coach_id = %s",
            (coach_id,)
        )
        rows = cursor.fetchall()
        return [Lesson.from_row(row).to_dict() for row in rows]
