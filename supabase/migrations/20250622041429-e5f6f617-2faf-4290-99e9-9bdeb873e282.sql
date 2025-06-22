
-- Create users table for authentication and profile data
CREATE TABLE IF NOT EXISTS public.users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create waste_uploads table for image uploads and analysis
CREATE TABLE IF NOT EXISTS public.waste_uploads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  image_path TEXT NOT NULL,
  gemini_analysis JSONB,
  waste_type TEXT,
  classification TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create orders table for waste pickup orders
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  waste_upload_id UUID REFERENCES public.waste_uploads(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending',
  pickup_address TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  special_instructions TEXT,
  estimated_weight DECIMAL(5, 2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chatbot_conversations table for chat history
CREATE TABLE IF NOT EXISTS public.chatbot_conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  message_type TEXT DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waste_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chatbot_conversations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users table
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (true);

-- Create RLS policies for waste_uploads table
CREATE POLICY "Users can view own uploads" ON public.waste_uploads FOR SELECT USING (true);
CREATE POLICY "Users can insert own uploads" ON public.waste_uploads FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own uploads" ON public.waste_uploads FOR UPDATE USING (true);

-- Create RLS policies for orders table
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Users can insert own orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own orders" ON public.orders FOR UPDATE USING (true);

-- Create RLS policies for chatbot_conversations table
CREATE POLICY "Users can view own conversations" ON public.chatbot_conversations FOR SELECT USING (true);
CREATE POLICY "Users can insert own conversations" ON public.chatbot_conversations FOR INSERT WITH CHECK (true);

-- Create storage bucket for waste images
INSERT INTO storage.buckets (id, name, public) VALUES ('waste-images', 'waste-images', true);

-- Create storage policy for waste images
CREATE POLICY "Public can upload waste images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'waste-images');
CREATE POLICY "Public can view waste images" ON storage.objects FOR SELECT USING (bucket_id = 'waste-images');
CREATE POLICY "Users can delete own waste images" ON storage.objects FOR DELETE USING (bucket_id = 'waste-images');
