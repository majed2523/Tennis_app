-- Create Clients Table (phone_number is now the primary key)
CREATE TABLE clients (
    phone_number TEXT PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    password TEXT NOT NULL  -- ✅ Added missing password column
);

-- Create Courts Table
CREATE TABLE courts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    court_name TEXT NOT NULL UNIQUE,
    court_type TEXT NOT NULL
);

-- Ensure the reservations table has proper constraints
CREATE TABLE IF NOT EXISTS reservations (
    reservation_id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER NOT NULL,
    court_id INTEGER NOT NULL,
    reservation_time DATETIME NOT NULL,
    booked_by_admin INTEGER,  -- This allows an admin to book on behalf of someone
    FOREIGN KEY (client_id) REFERENCES clients(client_id),
    FOREIGN KEY (court_id) REFERENCES courts(court_id),
    FOREIGN KEY (booked_by_admin) REFERENCES admins(admin_id) ON DELETE SET NULL
);


-- Create Admins Table
-- Ensure the admins table exists
CREATE TABLE IF NOT EXISTS admins (
    admin_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT CHECK(role IN ('schedule_manager', 'booking_manager')) NOT NULL
);
