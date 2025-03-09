from backend.models.Admin import Admin

class AdminController:
    @staticmethod
    def admin_login():
        """Handles admin login process."""
        username = input("Enter admin username: ")
        password = input("Enter admin password: ")

        admin = Admin.authenticate_admin(username, password)
        if admin:
            print(f"Welcome, {admin.username}! You have admin privileges.")
            return admin
        else:
            print("Invalid credentials.")
            return None

    @staticmethod
    def manage_reservations():
        """Allows admin to approve/reject reservations."""
        reservations = Admin.view_reservations()
        if not reservations:
            print("No reservations found.")
            return
        
        print("\nPending Reservations:")
        for res in reservations:
            print(f"ID: {res[0]}, Client: {res[1]}, Court: {res[2]}, Status: {res[3]}")

        action = input("\nApprove (A) / Reject (R) a reservation? (Enter ID or 'exit' to quit): ")
        if action.lower() == "exit":
            return
        
        res_id = int(action)
        decision = input("Approve (A) or Reject (R)? ").strip().lower()

        if decision == "a":
            Admin.update_reservation_status(res_id, "approved")
        elif decision == "r":
            Admin.update_reservation_status(res_id, "rejected")
        else:
            print("Invalid input.")
