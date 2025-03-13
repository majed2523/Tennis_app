-- Step 2: Create a unified 'users' table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('player', 'coach', 'admin'))
);

-- Step 3: Create a 'teams' table where each team has a name and a coach
CREATE TABLE IF NOT EXISTS teams (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  team_name TEXT NOT NULL UNIQUE,
  coach_id INTEGER NOT NULL,
  FOREIGN KEY (coach_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Step 4: Create a 'team_members' table to assign players to teams
CREATE TABLE IF NOT EXISTS team_members (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
  player_id INTEGER NOT NULL,
  team_id INTEGER NOT NULL,
  FOREIGN KEY (player_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE
);

-- ✅ Table for coach availability (when they can give lessons)
CREATE TABLE IF NOT EXISTS coach_availability (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    coach_id INTEGER NOT NULL,
    day TEXT CHECK (day IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    FOREIGN KEY (coach_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE (coach_id, day, start_time, end_time)  -- Prevents duplicate entries for the same day & time
);


-- ✅ Table for private lessons bookings
CREATE TABLE IF NOT EXISTS private_lessons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_id INTEGER NOT NULL,
    coach_id INTEGER NOT NULL,
    lesson_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    FOREIGN KEY (player_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (coach_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE (coach_id, lesson_date, start_time)  -- Prevents double-booking a coach
);

