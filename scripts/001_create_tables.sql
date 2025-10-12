-- Create profiles table for user data
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  experience_level TEXT CHECK (experience_level IN ('beginner', 'intermediate', 'advanced')),
  interests TEXT[] DEFAULT '{}',
  total_xp INTEGER DEFAULT 0,
  current_level INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create badges table
CREATE TABLE IF NOT EXISTS public.badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    name TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    xp_requirement INTEGER NOT NULL,
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW()
);

-- Create user_badges junction table
CREATE TABLE IF NOT EXISTS public.user_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    user_id UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
    badge_id UUID NOT NULL REFERENCES public.badges (id) ON DELETE CASCADE,
    earned_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW(),
        UNIQUE (user_id, badge_id)
);

-- Create quiz_questions table
CREATE TABLE IF NOT EXISTS public.quiz_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    question TEXT NOT NULL,
    correct_answer TEXT NOT NULL,
    difficulty TEXT CHECK (
        difficulty IN (
            'beginner',
            'intermediate',
            'advanced'
        )
    ),
    category TEXT NOT NULL,
    xp_reward INTEGER DEFAULT 10,
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW()
);

-- Create quiz_attempts table
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    user_id UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES public.quiz_questions (id) ON DELETE CASCADE,
    user_answer TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    xp_earned INTEGER DEFAULT 0,
    ai_feedback TEXT,
    attempted_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR
SELECT USING (auth.uid () = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles FOR
INSERT
WITH
    CHECK (auth.uid () = id);

CREATE POLICY "Users can update their own profile" ON public.profiles FOR
UPDATE USING (auth.uid () = id);

-- RLS Policies for badges (public read)
CREATE POLICY "Anyone can view badges" ON public.badges FOR
SELECT USING (true);

-- RLS Policies for user_badges
CREATE POLICY "Users can view their own badges" ON public.user_badges FOR
SELECT USING (auth.uid () = user_id);

CREATE POLICY "Users can insert their own badges" ON public.user_badges FOR
INSERT
WITH
    CHECK (auth.uid () = user_id);

-- RLS Policies for quiz_questions (public read)
CREATE POLICY "Anyone can view quiz questions" ON public.quiz_questions FOR
SELECT USING (true);

-- RLS Policies for quiz_attempts
CREATE POLICY "Users can view their own attempts" ON public.quiz_attempts FOR
SELECT USING (auth.uid () = user_id);

CREATE POLICY "Users can insert their own attempts" ON public.quiz_attempts FOR
INSERT
WITH
    CHECK (auth.uid () = user_id);

-- Create function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, experience_level, interests)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'display_name', 'Farmer'),
    COALESCE(new.raw_user_meta_data->>'experience_level', 'beginner'),
    COALESCE(
      ARRAY(SELECT jsonb_array_elements_text(new.raw_user_meta_data->'interests')),
      '{}'::TEXT[]
    )
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN new;
END;
$$;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for profiles updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();