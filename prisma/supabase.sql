-- Supabase trigger to automatically create Profile records when users sign up
-- This should be run in the Supabase SQL Editor

-- Step 1: Drop existing triggers and functions to avoid conflicts
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.handle_user_update();

-- Step 2: Add missing columns to profiles table (if they don't exist)
-- This is safe to run even if columns already exist
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT UNIQUE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS provider TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS locale TEXT DEFAULT 'en';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS "githubUsername" TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS "twitterUsername" TEXT;

-- Step 3: Create function to handle new user creation with error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  username_candidate TEXT;
BEGIN
  -- Generate username candidate
  username_candidate := COALESCE(
    new.raw_user_meta_data->>'user_name',
    new.raw_user_meta_data->>'login',
    new.raw_user_meta_data->>'preferred_username',
    split_part(new.email, '@', 1)
  );
  
  -- Ensure username is unique by appending numbers if needed
  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE username = username_candidate) LOOP
    username_candidate := username_candidate || '_' || floor(random() * 1000)::text;
  END LOOP;

  -- Insert into the profiles table
  INSERT INTO public.profiles (
    id, 
    email,
    name, 
    avatar,
    username,
    provider,
    locale,
    bio,
    company,
    location,
    website,
    "githubUsername",
    "twitterUsername",
    "createdAt",
    "updatedAt"
  )
  VALUES (
    new.id::text,
    new.email,
    COALESCE(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      new.raw_user_meta_data->>'user_name'
    ),
    COALESCE(
      new.raw_user_meta_data->>'avatar_url',
      new.raw_user_meta_data->>'picture'
    ),
    username_candidate,
    new.raw_app_meta_data->>'provider',
    COALESCE(new.raw_user_meta_data->>'locale', 'en'),
    new.raw_user_meta_data->>'bio',
    new.raw_user_meta_data->>'company',
    new.raw_user_meta_data->>'location',
    new.raw_user_meta_data->>'blog',
    new.raw_user_meta_data->>'login',
    new.raw_user_meta_data->>'twitter_username',
    NOW(),
    NOW()
  );
  
  RETURN new;
EXCEPTION
  WHEN unique_violation THEN
    -- If there's a unique constraint violation, log it but don't fail the auth
    RAISE LOG 'Profile creation failed for user %: %', new.id, SQLERRM;
    RETURN new;
  WHEN OTHERS THEN
    -- Log any other errors but don't fail the auth
    RAISE LOG 'Unexpected error creating profile for user %: %', new.id, SQLERRM;
    RETURN new;
END;
$$;

-- Step 4: Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 5: Create function to handle user updates with error handling
CREATE OR REPLACE FUNCTION public.handle_user_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  -- Update the profiles table with all fields
  UPDATE public.profiles
  SET 
    email = new.email,
    name = COALESCE(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      new.raw_user_meta_data->>'user_name'
    ),
    avatar = COALESCE(
      new.raw_user_meta_data->>'avatar_url',
      new.raw_user_meta_data->>'picture'
    ),
    username = COALESCE(
      new.raw_user_meta_data->>'user_name',
      new.raw_user_meta_data->>'login',
      new.raw_user_meta_data->>'preferred_username',
      profiles.username -- Keep existing username if no new one provided
    ),
    provider = COALESCE(new.raw_app_meta_data->>'provider', profiles.provider),
    locale = COALESCE(new.raw_user_meta_data->>'locale', profiles.locale),
    bio = COALESCE(new.raw_user_meta_data->>'bio', profiles.bio),
    company = COALESCE(new.raw_user_meta_data->>'company', profiles.company),
    location = COALESCE(new.raw_user_meta_data->>'location', profiles.location),
    website = COALESCE(new.raw_user_meta_data->>'blog', profiles.website),
    "githubUsername" = COALESCE(new.raw_user_meta_data->>'login', profiles."githubUsername"),
    "twitterUsername" = COALESCE(new.raw_user_meta_data->>'twitter_username', profiles."twitterUsername"),
    "updatedAt" = NOW()
  WHERE id = new.id::text;
  RETURN new;
EXCEPTION
  WHEN OTHERS THEN
    -- Log any errors but don't fail the auth update
    RAISE LOG 'Error updating profile for user %: %', new.id, SQLERRM;
    RETURN new;
END;
$$;

-- Step 6: Create trigger for user updates
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_update();

-- Step 7: Backfill existing users without profiles
-- This creates profiles for any existing auth users that don't have one yet
INSERT INTO public.profiles (
  id, 
  email,
  name,
  avatar,
  username,
  provider,
  locale,
  "createdAt",
  "updatedAt"
)
SELECT 
  u.id::text,
  u.email,
  COALESCE(
    u.raw_user_meta_data->>'full_name',
    u.raw_user_meta_data->>'name',
    u.raw_user_meta_data->>'user_name'
  ),
  COALESCE(
    u.raw_user_meta_data->>'avatar_url',
    u.raw_user_meta_data->>'picture'
  ),
  COALESCE(
    u.raw_user_meta_data->>'user_name',
    u.raw_user_meta_data->>'login',
    u.raw_user_meta_data->>'preferred_username',
    split_part(u.email, '@', 1)
  ) || '_' || substr(u.id::text, 1, 4), -- Append part of ID to ensure uniqueness
  u.raw_app_meta_data->>'provider',
  COALESCE(u.raw_user_meta_data->>'locale', 'en'),
  NOW(),
  NOW()
FROM auth.users u
LEFT JOIN public.profiles p ON u.id::text = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- Step 8: Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres, service_role;