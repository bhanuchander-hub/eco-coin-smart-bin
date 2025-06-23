
-- Drop existing policies and triggers to avoid conflicts
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Allow user creation via trigger" ON public.users;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Ensure users table has all necessary columns
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS profile_image_url TEXT;

-- Enable RLS on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create comprehensive RLS policies for users table
CREATE POLICY "Users can view their own profile" 
  ON public.users 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.users 
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.users 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Create function to handle new user registration with error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Insert into users table with proper error handling
  INSERT INTO public.users (
    id, 
    email, 
    username, 
    full_name, 
    phone, 
    address,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'phone', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'address', ''),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    username = COALESCE(EXCLUDED.username, users.username),
    full_name = COALESCE(EXCLUDED.full_name, users.full_name),
    phone = COALESCE(EXCLUDED.phone, users.phone),
    address = COALESCE(EXCLUDED.address, users.address),
    updated_at = NOW();
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't block user creation
    RAISE WARNING 'Error creating user profile: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Create trigger to automatically create user profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Ensure waste_uploads table has proper RLS policies
ALTER TABLE public.waste_uploads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own uploads" ON public.waste_uploads;
DROP POLICY IF EXISTS "Users can insert own uploads" ON public.waste_uploads;
DROP POLICY IF EXISTS "Users can update own uploads" ON public.waste_uploads;

CREATE POLICY "Users can view their own uploads" 
  ON public.waste_uploads 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own uploads" 
  ON public.waste_uploads 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own uploads" 
  ON public.waste_uploads 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Ensure orders table has proper RLS policies
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can insert own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can update own orders" ON public.orders;

CREATE POLICY "Users can view their own orders" 
  ON public.orders 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own orders" 
  ON public.orders 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders" 
  ON public.orders 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Ensure chatbot_conversations table has proper RLS policies
ALTER TABLE public.chatbot_conversations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own conversations" ON public.chatbot_conversations;
DROP POLICY IF EXISTS "Users can insert own conversations" ON public.chatbot_conversations;

CREATE POLICY "Users can view their own conversations" 
  ON public.chatbot_conversations 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own conversations" 
  ON public.chatbot_conversations 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Ensure storage bucket exists for profile images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('waste-images', 'waste-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for waste-images bucket
DROP POLICY IF EXISTS "Public can upload waste images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view waste images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own waste images" ON storage.objects;

CREATE POLICY "Public can upload waste images" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (bucket_id = 'waste-images');

CREATE POLICY "Public can view waste images" 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'waste-images');

CREATE POLICY "Users can delete own waste images" 
  ON storage.objects 
  FOR DELETE 
  USING (bucket_id = 'waste-images');
