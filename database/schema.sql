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

-- Create Reservations Table (Fix: Use `client_phone` instead of `client_id`)
CREATE TABLE reservations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_phone TEXT NOT NULL,  -- ✅ Changed from `client_id`
    court_id INTEGER NOT NULL,
    reservation_time DATETIME NOT NULL,
    FOREIGN KEY (client_phone) REFERENCES clients(phone_number) ON DELETE CASCADE,
    FOREIGN KEY (court_id) REFERENCES courts(id) ON DELETE CASCADE
);

-- Create Admins Table
CREATE TABLE admins (
    admin_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);
