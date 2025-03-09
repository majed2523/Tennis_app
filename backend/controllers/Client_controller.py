from models.Client import ClientC
from database import get_db_connection
import bcrypt
from flask import jsonify

class ClientController:

    @staticmethod
    def register_client(first_name: str, last_name: str, phone_number: str, password: str):
        """Registers a new client if the phone number is unique."""
        conn = get_db_connection()

    # ✅ Check if the phone number already exists
        if ClientC.find_by_phone(conn, phone_number.strip()):
            conn.close()
            print(f"❌ Registration failed: Phone number {phone_number} already exists.")
            response = jsonify({"error": "A client with this phone number already exists."})  # ✅ Ensure correct response format
            response.status_code = 400  # ✅ Explicitly set HTTP status
            return response

    # ✅ Hash the password before storing
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    # ✅ Insert new client
        client = ClientC(phone_number.strip(),first_name, last_name, hashed_password)
        print(f"📌 Registering client: {client.first_name}, {client.last_name}, {client.phone_number}, {client.password}")
        client.save(conn)
        conn.close()
        print(f"✅ Registration successful for phone number {phone_number}.")

        response = jsonify({"message": "Client registered successfully"})
        response.status_code = 201  # ✅ Explicitly set HTTP 201 status
        return response

    @staticmethod
    def login_client(phone_number, password):
        conn = get_db_connection()
    
        print(f"🔹 Checking login for: {phone_number}")

        client = ClientC.find_by_phone(conn, phone_number)

        if not client:
            print("❌ Client not found. Returning 401.")
            return {"error": "Invalid phone number or password"}, 401

        # Ensure the password check is correct
        if not client.verify_password(password):
            print("❌ Incorrect password. Returning 401.")
            return {"error": "Invalid phone number or password"}, 401

        # Generate a token and return successful response
        token = client.generate_token()
        print(f"✅ Login successful for {phone_number}. Token generated.")
        return {"message": "Login successful", "token": token}, 200


    
    
    @staticmethod
    def remove_client(phone_number: str):
        """Deletes a client by phone number."""
        conn = get_db_connection()
        client = ClientC.find_by_phone(conn, phone_number)

        if not client:
            conn.close()
            return {"error": "Client not found"}

        client.delete(conn)
        conn.close()
        return {"message": "Client removed successfully"}

    @staticmethod
    def update_client(phone_number: str, new_first_name: str, new_last_name: str):
        """Update a client's details."""
        conn = get_db_connection()
        client = ClientC.find_by_phone(conn, phone_number)

        if not client:
            conn.close()
            return {"error": "Client not found"}

        client.first_name = new_first_name
        client.last_name = new_last_name
        client.save(conn)
        conn.close()
        return {"message": "Client updated successfully"}

     
    @staticmethod
    def find_by_phone(phone_number):
        """Finds a client by their phone number using the controller."""
        conn = get_db_connection()  # ✅ Get DB connection
        return ClientC.find_by_phone(conn, phone_number)  # ✅ Use `find_by_phone()` from `Client.py`