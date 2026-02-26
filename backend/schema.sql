CREATE TABLE IF NOT EXISTS users (
  id              SERIAL PRIMARY KEY,
  username        VARCHAR(30) UNIQUE NOT NULL,
  email           VARCHAR(255) UNIQUE NOT NULL,
  password_hash   TEXT NOT NULL,
  is_verified     BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id              SERIAL PRIMARY KEY,
  user_id         INTEGER REFERENCES users(id) ON DELETE CASCADE,
  token_hash      TEXT NOT NULL,          -- bcrypt hash of the raw token
  otp_hash        TEXT,                   -- bcrypt hash of 6-digit OTP (if OTP flow)
  method          VARCHAR(10) NOT NULL,   -- 'link' or 'otp'
  expires_at      TIMESTAMPTZ NOT NULL,   -- 15 minutes from creation
  used            BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_prt_user_id ON password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

CREATE TABLE IF NOT EXISTS habits (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name        VARCHAR(100) NOT NULL,
  color       VARCHAR(7) NOT NULL DEFAULT '#4f46e5',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS habit_completions (
  id             SERIAL PRIMARY KEY,
  habit_id       INTEGER REFERENCES habits(id) ON DELETE CASCADE,
  completed_date DATE NOT NULL,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(habit_id, completed_date)
);

CREATE INDEX IF NOT EXISTS idx_hc_habit_date ON habit_completions(habit_id, completed_date);

CREATE TABLE IF NOT EXISTS workouts (
  id               SERIAL PRIMARY KEY,
  user_id          INTEGER REFERENCES users(id) ON DELETE CASCADE,
  workout_type     VARCHAR(50) NOT NULL,
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
  workout_date     DATE NOT NULL,
  notes            TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_workouts_user_date ON workouts(user_id, workout_date);

CREATE TABLE IF NOT EXISTS income (
  id             SERIAL PRIMARY KEY,
  user_id        INTEGER REFERENCES users(id) ON DELETE CASCADE,
  entry_date     DATE NOT NULL,
  source         VARCHAR(100) NOT NULL,
  category       VARCHAR(50) NOT NULL,
  amount         NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  notes          TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS expenses (
  id             SERIAL PRIMARY KEY,
  user_id        INTEGER REFERENCES users(id) ON DELETE CASCADE,
  entry_date     DATE NOT NULL,
  description    VARCHAR(200) NOT NULL,
  category       VARCHAR(50) NOT NULL,
  amount         NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  payment_method VARCHAR(50) NOT NULL,
  notes          TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_income_user_date ON income(user_id, entry_date);
CREATE INDEX IF NOT EXISTS idx_expenses_user_date ON expenses(user_id, entry_date);
