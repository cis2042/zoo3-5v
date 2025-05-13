/*
  # Initial schema for ZOO3 rewards platform

  1. New Tables
    - `profiles` - Stores extended user information and token balances
    - `tasks` - Available tasks that users can complete
    - `task_completions` - Record of completed tasks by users
    - `transactions` - Record of all token transactions
    - `referrals` - Tracks user referrals
    - `login_streaks` - Tracks users' login streaks
    - `achievements` - Tracks user achievements and progress
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  reward_amount NUMERIC NOT NULL,
  reward_token TEXT NOT NULL,
  task_type TEXT NOT NULL,
  redirect_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Task completions table
CREATE TABLE IF NOT EXISTS task_completions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  task_id uuid NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, task_id)
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  token TEXT NOT NULL,
  transaction_type TEXT NOT NULL,
  reference_id TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- User profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  total_tasks_completed INTEGER DEFAULT 0,
  total_kaia NUMERIC DEFAULT 0,
  total_zoo NUMERIC DEFAULT 0,
  total_wbtc NUMERIC DEFAULT 0,
  login_streak INTEGER DEFAULT 0,
  last_login_date TIMESTAMPTZ,
  referral_code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Referrals table
CREATE TABLE IF NOT EXISTS referrals (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referee_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  reward_claimed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Login streaks table
CREATE TABLE IF NOT EXISTS login_streaks (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  streak_days INTEGER DEFAULT 0,
  current_day INTEGER DEFAULT 0,
  last_claimed_at TIMESTAMPTZ,
  days_completed TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_type TEXT NOT NULL,
  achievement_level INTEGER DEFAULT 0,
  unlocked_at TIMESTAMPTZ DEFAULT now(),
  current_progress INTEGER DEFAULT 0,
  next_target INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, achievement_type)
);

-- Enable Row Level Security
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Tasks: Anyone can read
CREATE POLICY "Anyone can read tasks" 
ON tasks FOR SELECT 
USING (true);

-- Task completions: Users can read their own records
CREATE POLICY "Users can read own task completions" 
ON task_completions FOR SELECT 
USING (auth.uid() = user_id);

-- Task completions: Users can insert their own records
CREATE POLICY "Users can insert own task completions" 
ON task_completions FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Transactions: Users can read their own records
CREATE POLICY "Users can read own transactions" 
ON transactions FOR SELECT 
USING (auth.uid() = user_id);

-- User profiles: Users can read their own profile
CREATE POLICY "Users can read own profile" 
ON user_profiles FOR SELECT 
USING (auth.uid() = user_id);

-- User profiles: Users can update their own profile
CREATE POLICY "Users can update own profile" 
ON user_profiles FOR UPDATE 
USING (auth.uid() = user_id);

-- Allow users to read referral codes
CREATE POLICY "Users can read all profiles for referral code"
ON user_profiles FOR SELECT
USING (true);

-- Referrals: Users can read their own referrals
CREATE POLICY "Users can read own referrals as referrer" 
ON referrals FOR SELECT 
USING (auth.uid() = referrer_id);

-- Referrals: Users can read referrals where they are the referee
CREATE POLICY "Users can read own referrals as referee" 
ON referrals FOR SELECT 
USING (auth.uid() = referee_id);

-- Login streaks: Users can read their own login streak
CREATE POLICY "Users can read own login streaks" 
ON login_streaks FOR SELECT 
USING (auth.uid() = user_id);

-- Login streaks: Users can update their own login streak
CREATE POLICY "Users can update own login streaks" 
ON login_streaks FOR UPDATE 
USING (auth.uid() = user_id);

-- Achievements: Users can read their own achievements
CREATE POLICY "Users can read own achievements" 
ON achievements FOR SELECT 
USING (auth.uid() = user_id);

-- Insert sample tasks
INSERT INTO tasks (title, description, reward_amount, reward_token, task_type, redirect_url)
VALUES 
('加入 Discord 社區', '加入 ZOO3 官方 Discord 社區並完成身份驗證', 5, 'ZOO', 'discord', 'https://discord.gg/zoo3'),
('社交媒體分享', '在您的社交媒體帳戶上分享 ZOO3', 5, 'ZOO', 'social_share', NULL),
('完成加密貨幣測驗', '參加並通過我們的加密貨幣基礎知識測驗', 0.0001, 'WBTC', 'quiz', NULL),
('連接 LINE 錢包', '將您的 LINE 錢包連接到 ZOO3 平台', 3, 'ZOO', 'connect_wallet', NULL),
('訪問每個頁面', '訪問 ZOO3 平台的所有頁面', 1, 'KAIA', 'visit_pages', NULL);

-- Add functions
-- Function to add a new user profile when a user signs up
CREATE OR REPLACE FUNCTION public.create_user_profile()
RETURNS TRIGGER AS $$
DECLARE
  random_code TEXT;
BEGIN
  -- Generate a random referral code
  random_code := substr(md5(random()::text), 1, 6);
  
  -- Create user profile
  INSERT INTO public.user_profiles (user_id, display_name, referral_code)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'display_name', random_code);

  -- Initialize login streak
  INSERT INTO public.login_streaks (user_id, streak_days, current_day)
  VALUES (NEW.id, 0, 0);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.create_user_profile();

-- Function to handle daily rewards
CREATE OR REPLACE FUNCTION public.claim_daily_reward(user_id UUID)
RETURNS JSON AS $$
DECLARE
  streak RECORD;
  today TIMESTAMPTZ := now();
  yesterday TIMESTAMPTZ := now() - INTERVAL '1 day';
  reward_amount NUMERIC := 0;
  day_number INTEGER;
  already_claimed BOOLEAN := false;
  result JSON;
BEGIN
  -- Get the user's streak record
  SELECT * INTO streak FROM login_streaks WHERE login_streaks.user_id = claim_daily_reward.user_id;
  
  -- If no streak exists, create one
  IF streak IS NULL THEN
    INSERT INTO login_streaks (user_id, streak_days, current_day, last_claimed_at, days_completed)
    VALUES (claim_daily_reward.user_id, 1, 0, today, ARRAY['0'])
    RETURNING * INTO streak;
    
    reward_amount := 1; -- Default reward for first day
  ELSE
    -- Check if already claimed today
    IF streak.last_claimed_at IS NOT NULL AND 
       DATE(streak.last_claimed_at AT TIME ZONE 'UTC') = DATE(today AT TIME ZONE 'UTC') THEN
      already_claimed := true;
      
      -- Return result indicating already claimed
      result := json_build_object(
        'success', false,
        'message', 'Already claimed today',
        'streak_days', streak.streak_days,
        'current_day', streak.current_day,
        'days_completed', streak.days_completed,
        'reward_amount', 0
      );
      
      RETURN result;
    END IF;
    
    -- Check if continuing streak (claimed yesterday) or starting new streak
    IF streak.last_claimed_at IS NULL OR 
       DATE(streak.last_claimed_at AT TIME ZONE 'UTC') < DATE(yesterday AT TIME ZONE 'UTC') THEN
      -- More than a day has passed, reset streak
      UPDATE login_streaks 
      SET streak_days = 1, 
          current_day = 0,
          days_completed = ARRAY['0']
      WHERE user_id = claim_daily_reward.user_id
      RETURNING * INTO streak;
      
      reward_amount := 1; -- Default reward for first day
    ELSE
      -- Continue streak
      day_number := streak.current_day + 1;
      
      -- Calculate reward based on day number (in a 7-day cycle)
      CASE
        WHEN day_number = 0 OR day_number = 1 THEN reward_amount := 1;
        WHEN day_number = 2 THEN reward_amount := 1;
        WHEN day_number = 3 THEN reward_amount := 2;
        WHEN day_number = 4 THEN reward_amount := 2;
        WHEN day_number = 5 THEN reward_amount := 3;
        WHEN day_number = 6 THEN reward_amount := 3;
        WHEN day_number = 7 THEN reward_amount := 10;
        ELSE reward_amount := 1;
      END CASE;
      
      -- Update streak
      UPDATE login_streaks 
      SET streak_days = streak.streak_days + 1,
          current_day = CASE WHEN day_number >= 7 THEN 0 ELSE day_number END,
          last_claimed_at = today,
          days_completed = array_append(streak.days_completed, day_number::text)
      WHERE user_id = claim_daily_reward.user_id
      RETURNING * INTO streak;
    END IF;
  END IF;
  
  -- Add transaction record
  IF NOT already_claimed THEN
    INSERT INTO transactions (user_id, amount, token, transaction_type, description)
    VALUES (claim_daily_reward.user_id, reward_amount, 'KAIA', 'daily_reward', '每日簽到獎勵');
    
    -- Update user balance
    UPDATE user_profiles
    SET total_kaia = total_kaia + reward_amount,
        last_login_date = today,
        login_streak = streak.streak_days
    WHERE user_id = claim_daily_reward.user_id;
  END IF;
  
  -- Return result
  result := json_build_object(
    'success', NOT already_claimed,
    'message', CASE WHEN already_claimed THEN 'Already claimed today' ELSE 'Reward claimed successfully' END,
    'streak_days', streak.streak_days,
    'current_day', streak.current_day,
    'days_completed', streak.days_completed,
    'reward_amount', reward_amount,
    'reward_token', 'KAIA'
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to complete a task
CREATE OR REPLACE FUNCTION public.complete_task(user_id UUID, task_id UUID)
RETURNS JSON AS $$
DECLARE
  task RECORD;
  already_completed BOOLEAN := false;
  result JSON;
BEGIN
  -- Check if task exists
  SELECT * INTO task FROM tasks WHERE id = task_id;
  
  IF task IS NULL THEN
    result := json_build_object(
      'success', false,
      'message', 'Task not found'
    );
    
    RETURN result;
  END IF;
  
  -- Check if already completed
  SELECT EXISTS (
    SELECT 1 FROM task_completions 
    WHERE user_id = complete_task.user_id AND task_id = complete_task.task_id
  ) INTO already_completed;
  
  IF already_completed THEN
    result := json_build_object(
      'success', false,
      'message', 'Task already completed',
      'reward_amount', 0,
      'reward_token', task.reward_token
    );
    
    RETURN result;
  END IF;
  
  -- Create completion record
  INSERT INTO task_completions (user_id, task_id)
  VALUES (complete_task.user_id, complete_task.task_id);
  
  -- Add transaction
  INSERT INTO transactions (
    user_id, 
    amount, 
    token, 
    transaction_type, 
    reference_id,
    description
  )
  VALUES (
    complete_task.user_id, 
    task.reward_amount, 
    task.reward_token, 
    'task_completion',
    task.id::text,
    task.title
  );
  
  -- Update user profile
  UPDATE user_profiles 
  SET 
    total_tasks_completed = total_tasks_completed + 1,
    total_kaia = CASE WHEN task.reward_token = 'KAIA' THEN total_kaia + task.reward_amount ELSE total_kaia END,
    total_zoo = CASE WHEN task.reward_token = 'ZOO' THEN total_zoo + task.reward_amount ELSE total_zoo END,
    total_wbtc = CASE WHEN task.reward_token = 'WBTC' THEN total_wbtc + task.reward_amount ELSE total_wbtc END
  WHERE user_id = complete_task.user_id;
  
  -- Return result
  result := json_build_object(
    'success', true,
    'message', 'Task completed successfully',
    'reward_amount', task.reward_amount,
    'reward_token', task.reward_token
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to process a referral
CREATE OR REPLACE FUNCTION public.process_referral(referrer_code TEXT, referee_id UUID)
RETURNS JSON AS $$
DECLARE
  referrer_id UUID;
  already_referred BOOLEAN := false;
  result JSON;
  reward_amount NUMERIC := 10; -- Default reward amount
BEGIN
  -- Get the referrer's user ID from the referral code
  SELECT user_id INTO referrer_id 
  FROM user_profiles 
  WHERE referral_code = referrer_code;
  
  -- Check if referrer exists
  IF referrer_id IS NULL THEN
    result := json_build_object(
      'success', false,
      'message', 'Invalid referral code'
    );
    
    RETURN result;
  END IF;
  
  -- Check if self-referral
  IF referrer_id = referee_id THEN
    result := json_build_object(
      'success', false,
      'message', 'Cannot refer yourself'
    );
    
    RETURN result;
  END IF;
  
  -- Check if already referred
  SELECT EXISTS (
    SELECT 1 FROM referrals 
    WHERE referee_id = process_referral.referee_id
  ) INTO already_referred;
  
  IF already_referred THEN
    result := json_build_object(
      'success', false,
      'message', 'User already referred'
    );
    
    RETURN result;
  END IF;
  
  -- Create referral record
  INSERT INTO referrals (referrer_id, referee_id, reward_claimed)
  VALUES (referrer_id, referee_id, true);
  
  -- Add transactions for both referrer and referee
  -- For referrer
  INSERT INTO transactions (
    user_id, 
    amount, 
    token, 
    transaction_type, 
    reference_id,
    description
  )
  VALUES (
    referrer_id, 
    reward_amount, 
    'ZOO', 
    'referral_reward',
    referee_id::text,
    '推薦獎勵'
  );
  
  -- For referee
  INSERT INTO transactions (
    user_id, 
    amount, 
    token, 
    transaction_type,
    reference_id,
    description
  )
  VALUES (
    referee_id, 
    reward_amount, 
    'ZOO', 
    'referral_bonus',
    referrer_id::text,
    '推薦獎金'
  );
  
  -- Update balances for both users
  -- For referrer
  UPDATE user_profiles 
  SET total_zoo = total_zoo + reward_amount
  WHERE user_id = referrer_id;
  
  -- For referee
  UPDATE user_profiles 
  SET total_zoo = total_zoo + reward_amount
  WHERE user_id = referee_id;
  
  -- Return result
  result := json_build_object(
    'success', true,
    'message', 'Referral processed successfully',
    'reward_amount', reward_amount,
    'reward_token', 'ZOO'
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;