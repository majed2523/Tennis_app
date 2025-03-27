from flask import Flask
from flask_cors import CORS
from database import init_db
from routes import routes_app
from flask_jwt_extended import JWTManager
import os
# Initialize Flask app
app = Flask(__name__)

# Configure your JWT settings
app.config['JWT_SECRET_KEY'] = "d2df9688ef44d41a0ba41c801a5ce2d74ff487a8429f9b5b89bc3b9f165bd5fee03e98795aa2a7d940bac45bdd67510798a8a2bd9d38a5853c3b6697b3629ef1"  # Secret key for signing JWTs
app.config['JWT_TOKEN_LOCATION'] = ['headers']  # Where to look for JWTs (e.g., headers)
app.config['JWT_HEADER_NAME'] = 'Authorization'
app.config['JWT_IDENTITY_CLAIM'] = 'id'                      # Tell JWT to use "id" instead of "sub"
# Header key for the JWT

jwt = JWTManager(app)

# Optionally, you can set additional options such as token expiration
# app.config['JWT_ACCESS_TOKEN_EXPIRES'] = 3600  # in seconds

# Enable CORS
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True) # CORS are the rules you define to make your 2 servers connect(backend and frontend)

# Register the Blueprint
app.register_blueprint(routes_app)

# Initialize the database
init_db()

# Run the app
if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(
        debug=True,
        host="0.0.0.0",  # crucial: listen on all interfaces
        port=port       # crucial: use the PORT variable
    )