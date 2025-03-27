-- schema.sql for PostgreSQL
-- Adjust as needed for your naming / constraints

-- USERS table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    password TEXT,
    role VARCHAR(50)
);

-- COACH AVAILABILITY
CREATE TABLE IF NOT EXISTS coach_availability (
    id SERIAL PRIMARY KEY,
    coach_id INT NOT NULL,
    day VARCHAR(20) NOT NULL,
    start_time VARCHAR(20) NOT NULL,
    end_time VARCHAR(20) NOT NULL,
    CONSTRAINT fk_coach_avail
      FOREIGN KEY(coach_id)
      REFERENCES users(id)
      ON DELETE CASCADE
);

-- PRIVATE LESSONS
CREATE TABLE IF NOT EXISTS private_lessons (
    id SERIAL PRIMARY KEY,
    player_id INT NOT NULL,
    coach_id INT NOT NULL,
    lesson_date DATE NOT NULL,
    start_time VARCHAR(20) NOT NULL,
    end_time VARCHAR(20) NOT NULL,
    CONSTRAINT fk_player
      FOREIGN KEY(player_id)
      REFERENCES users(id)
      ON DELETE CASCADE,
    CONSTRAINT fk_coach
      FOREIGN KEY(coach_id)
      REFERENCES users(id)
      ON DELETE CASCADE
);

-- TEAMS
CREATE TABLE IF NOT EXISTS teams (
    id SERIAL PRIMARY KEY,
    team_name VARCHAR(255),
    coach_id INT,
    CONSTRAINT fk_teams_coach
      FOREIGN KEY(coach_id)
      REFERENCES users(id)
      ON DELETE SET NULL
);

-- TEAM MEMBERS (links players to teams)
CREATE TABLE IF NOT EXISTS team_members (
    id SERIAL PRIMARY KEY,
    team_id INT NOT NULL,
    player_id INT NOT NULL,
    CONSTRAINT fk_team
      FOREIGN KEY(team_id)
      REFERENCES teams(id)
      ON DELETE CASCADE,
    CONSTRAINT fk_player_team
      FOREIGN KEY(player_id)
      REFERENCES users(id)
      ON DELETE CASCADE
);
