from flask import Flask
from flask_cors import CORS
from database import init_db
from routes import routes_app

# Initialize Flask app
app = Flask(__name__)

# Enable CORS
CORS(app, supports_credentials=True) # CORS are the rules you define to make your 2 servers connect(backend and frontend)

# Register the Blueprint
app.register_blueprint(routes_app)

# Initialize the database
init_db()

# Run the app
if __name__ == '__main__':
    app.run(debug=True)
