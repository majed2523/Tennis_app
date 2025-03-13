from flask import jsonify, request
from models.Lesson import Lesson
from models.Users import User
from database import get_db_connection
from flask_jwt_extended import jwt_required, get_jwt_identity

class LessonController:
    @staticmethod
    @jwt_required()
    def book_lesson(coach_id, lesson_date, start_time, end_time):
        """Players can book a private lesson with a coach."""
        conn = get_db_connection()
        user_id = get_jwt_identity()
        player = User.find_by_id(conn, user_id)

        if not player or player.role != "player":
            conn.close()
            return jsonify({"error": "Unauthorized. Only players can book lessons."}), 403

        coach = User.find_by_id(conn, coach_id)
        if not coach or coach.role != "coach":
            conn.close()
            return jsonify({"error": "Invalid coach ID."}), 404

        # Check if the lesson is already booked
        if Lesson.is_booked(conn, coach_id, lesson_date, start_time):
            conn.close()
            return jsonify({"error": "This time slot is already booked."}), 400

        lesson = Lesson(id=None, player_id=user_id, coach_id=coach_id, lesson_date=lesson_date, start_time=start_time, end_time=end_time)
        lesson.save(conn)
        conn.close()

        return jsonify({"message": "Lesson booked successfully."}), 201

    @staticmethod
    def get_player_lessons(user_id):
        """Get all lessons booked by a specific player."""
        conn = get_db_connection()
        lessons = Lesson.get_player_lessons(conn, user_id)
        conn.close()
        return jsonify(lessons), 200

    @staticmethod
    def get_coach_lessons(coach_id):
        """Get all lessons given by a specific coach."""
        conn = get_db_connection()
        lessons = Lesson.get_coach_lessons(conn, coach_id)
        conn.close()
        return jsonify(lessons), 200
