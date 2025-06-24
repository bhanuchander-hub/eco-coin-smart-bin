
-- Drop the existing users table and related policies/triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;
DROP TABLE IF EXISTS public.users CASCADE;

-- Create register table for storing registration details
CREATE TABLE public.register (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  username TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  address TEXT,
  registration_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  registration_ip INET,
  user_agent TEXT,
  UNIQUE(auth_user_id),
  UNIQUE(email),
  UNIQUE(username)
);

-- Create login table for storing login events
CREATE TABLE public.login (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  login_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  login_ip INET,
  user_agent TEXT,
  session_id TEXT,
  login_method TEXT DEFAULT 'email_password'
);

-- Create profile table for storing user profile information
CREATE TABLE public.profile (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  full_name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  profile_image_url TEXT,
  bio TEXT,
  date_of_birth DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(auth_user_id),
  UNIQUE(username),
  UNIQUE(email)
);

-- Enable RLS on all new tables
ALTER TABLE public.register ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.login ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for register table
CREATE POLICY "Users can view their own registration" 
  ON public.register 
  FOR SELECT 
  USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can insert their own registration" 
  ON public.register 
  FOR INSERT 
  WITH CHECK (auth.uid() = auth_user_id);

-- Create RLS policies for login table
CREATE POLICY "Users can view their own login history" 
  ON public.login 
  FOR SELECT 
  USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can insert their own login records" 
  ON public.login 
  FOR INSERT 
  WITH CHECK (auth.uid() = auth_user_id);

-- Create RLS policies for profile table
CREATE POLICY "Users can view their own profile" 
  ON public.profile 
  FOR SELECT 
  USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profile 
  FOR INSERT 
  WITH CHECK (auth.uid() = auth_user_id);

CREATE POLICY "Users can update their own profile" 
  ON public.profile 
  FOR UPDATE 
  USING (auth.uid() = auth_user_id);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user_registration()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Insert into register table
  INSERT INTO public.register (
    auth_user_id,
    email,
    username,
    full_name,
    phone,
    address,
    registration_date
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'phone', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'address', ''),
    NOW()
  );

  -- Insert into profile table
  INSERT INTO public.profile (
    auth_user_id,
    username,
    full_name,
    email,
    phone,
    address,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'phone', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'address', ''),
    NOW(),
    NOW()
  );

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Error creating user registration/profile: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created_new
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_registration();

-- Update other tables to reference the new structure
ALTER TABLE public.waste_uploads 
DROP CONSTRAINT IF EXISTS waste_uploads_user_id_fkey,
ADD CONSTRAINT waste_uploads_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.orders 
DROP CONSTRAINT IF EXISTS orders_user_id_fkey,
ADD CONSTRAINT orders_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.chatbot_conversations 
DROP CONSTRAINT IF EXISTS chatbot_conversations_user_id_fkey,
ADD CONSTRAINT chatbot_conversations_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
