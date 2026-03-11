-- =============================================================================
-- 001_initial_schema.sql
-- Initial schema for memorize-bible app
-- =============================================================================

-- =============================================================================
-- TABLES
-- =============================================================================

-- 1. profiles
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  nickname text,
  daily_goal int DEFAULT 1,
  notification_enabled boolean DEFAULT true,
  notification_time time DEFAULT '09:00',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. memorize_verses
CREATE TABLE memorize_verses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  book text NOT NULL,
  chapter int NOT NULL,
  verse_start int NOT NULL,
  verse_end int,
  text text NOT NULL,
  reference text NOT NULL,
  status text DEFAULT 'learning' CHECK (status IN ('learning', 'mastered')),
  ease_factor float DEFAULT 2.5,
  interval_days int DEFAULT 1,
  next_review_at timestamptz DEFAULT now(),
  review_count int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- 3. review_logs
CREATE TABLE review_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  verse_id uuid NOT NULL REFERENCES memorize_verses ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  quality int NOT NULL CHECK (quality BETWEEN 1 AND 5),
  mode text CHECK (mode IN ('read', 'initial', 'blank', 'typing')),
  practiced_at timestamptz DEFAULT now()
);

-- 4. user_streaks
CREATE TABLE user_streaks (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  current_streak int DEFAULT 0,
  longest_streak int DEFAULT 0,
  last_practiced_date date,
  updated_at timestamptz DEFAULT now()
);

-- =============================================================================
-- INDEXES
-- =============================================================================

CREATE INDEX idx_memorize_verses_user_next_review
  ON memorize_verses (user_id, next_review_at);

CREATE INDEX idx_review_logs_user_practiced_at
  ON review_logs (user_id, practiced_at);

-- =============================================================================
-- TRIGGERS: updated_at
-- =============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER user_streaks_updated_at
  BEFORE UPDATE ON user_streaks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- TRIGGERS: auto-create profile and streak on signup
-- =============================================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id)
  VALUES (NEW.id)
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO user_streaks (id)
  VALUES (NEW.id)
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE memorize_verses ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;

-- profiles policies
CREATE POLICY "profiles: select own"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles: insert own"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles: update own"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles: delete own"
  ON profiles FOR DELETE
  USING (auth.uid() = id);

-- memorize_verses policies
CREATE POLICY "memorize_verses: select own"
  ON memorize_verses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "memorize_verses: insert own"
  ON memorize_verses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "memorize_verses: update own"
  ON memorize_verses FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "memorize_verses: delete own"
  ON memorize_verses FOR DELETE
  USING (auth.uid() = user_id);

-- review_logs policies
CREATE POLICY "review_logs: select own"
  ON review_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "review_logs: insert own"
  ON review_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "review_logs: delete own"
  ON review_logs FOR DELETE
  USING (auth.uid() = user_id);

-- user_streaks policies
CREATE POLICY "user_streaks: select own"
  ON user_streaks FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "user_streaks: insert own"
  ON user_streaks FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "user_streaks: update own"
  ON user_streaks FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "user_streaks: delete own"
  ON user_streaks FOR DELETE
  USING (auth.uid() = id);
