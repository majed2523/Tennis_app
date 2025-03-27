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
        # row is a dictionary now, so use dict keys
        return cls(
            id=row["id"],
            coach_id=row["coach_id"],
            day=row["day"],
            start_time=row["start_time"],
            end_time=row["end_time"]
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
            "INSERT INTO coach_availability (coach_id, day, start_time, end_time) VALUES (%s, %s, %s, %s)",
            (self.coach_id, self.day, self.start_time, self.end_time)
        )
        db.commit()

    @staticmethod
    def get_availability(db, coach_id):
        cursor = db.cursor()
        cursor.execute(
            "SELECT id, coach_id, day, start_time, end_time FROM coach_availability WHERE coach_id = %s",
            (coach_id,)
        )
        rows = cursor.fetchall()
        return [CoachAvailability.from_row(row).to_dict() for row in rows]

    def update(self, db):
        cursor = db.cursor()
        cursor.execute(
            "UPDATE coach_availability SET day = %s, start_time = %s, end_time = %s WHERE id = %s",
            (self.day, self.start_time, self.end_time, self.id)
        )
        db.commit()
