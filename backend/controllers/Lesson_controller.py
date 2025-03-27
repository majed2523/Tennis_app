from models.Lesson import Lesson
from models.Users import User
from database import get_db_connection
from flask import jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

class LessonController:
    @staticmethod
    @jwt_required()
    def book_lesson(coach_id, lesson_date, start_time, end_time):
        db = get_db_connection()
        user_id = get_jwt_identity()
        player = User.find_by_id(db, user_id)
        if not player or player.role != "player":
            db.close()
            return jsonify({"error": "Unauthorized. Only players can book lessons."}), 403
        if Lesson.is_booked(db, coach_id, lesson_date, start_time):
            db.close()
            return jsonify({"error": "This time slot is already booked."}), 400
        lesson = Lesson(
            id=None,
            player_id=user_id,
            coach_id=coach_id,
            lesson_date=lesson_date,
            start_time=start_time,
            end_time=end_time
        )
        lesson.save(db)
        db.close()
        return jsonify({"message": "Lesson booked successfully."}), 201

    @staticmethod
    def get_player_lessons(player_id):
        db = get_db_connection()
        lessons = Lesson.get_player_lessons(db, player_id)
        db.close()
        return jsonify(lessons), 200

    @staticmethod
    def get_coach_lessons(coach_id):
        db = get_db_connection()
        lessons = Lesson.get_coach_lessons(db, coach_id)
        db.close()
        return jsonify(lessons), 200
