# main.py

import os
from flask import Flask
from flask_cors import CORS
from database import init_db
from routes import routes_app
from flask_jwt_extended import JWTManager

app = Flask(__name__)

# Configure your JWT settings
app.config['JWT_SECRET_KEY'] = "d2df9688ef44d41a0ba41..."
app.config['JWT_TOKEN_LOCATION'] = ['headers']
app.config['JWT_HEADER_NAME'] = 'Authorization'
app.config['JWT_IDENTITY_CLAIM'] = 'id'

jwt = JWTManager(app)

# Enable CORS globally for all routes
CORS(
    app,
    resources={r"/*": {"origins": "*"}},
    allow_headers=["Content-Type", "Authorization"],
    expose_headers=["Content-Type", "Authorization"],
    supports_credentials=True
)

# Register the Blueprint
app.register_blueprint(routes_app)

# Initialize the database
init_db()

# Run the app
if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(
        debug=True,
        host="0.0.0.0",
        port=port
    )
