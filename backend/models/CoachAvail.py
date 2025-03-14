from dataclasses import dataclass

@dataclass
class CoachAvailability:
    id: int
    coach_id: int
    day: str
    start_time: str
    end_time: str

    @classmethod
    def from_row(cls, row):
        if row is None:
            return None
        return cls(
            id=row[0],
            coach_id=row[1],
            day=row[2],
            start_time=row[3],
            end_time=row[4]
        )

    def to_dict(self):
        return {
            "id": self.id,
            "coach_id": self.coach_id,
            "day": self.day,
            "start_time": self.start_time,
            "end_time": self.end_time
        }

    def save(self, db):
        cursor = db.cursor()
        cursor.execute(
            "INSERT INTO coach_availability (coach_id, day, start_time, end_time) VALUES (?, ?, ?, ?)",
            (self.coach_id, self.day, self.start_time, self.end_time)
        )
        db.commit()

    @staticmethod
    def get_availability(db, coach_id):
        cursor = db.cursor()
        cursor.execute(
            "SELECT id, coach_id, day, start_time, end_time FROM coach_availability WHERE coach_id = ?",
            (coach_id,)
        )
        rows = cursor.fetchall()
        return [CoachAvailability.from_row(row).to_dict() for row in rows]

    def update(self, db):
        cursor = db.cursor()
        cursor.execute(
            "UPDATE coach_availability SET day = ?, start_time = ?, end_time = ? WHERE id = ?",
            (self.day, self.start_time, self.end_time, self.id)
        )
        db.commit()
