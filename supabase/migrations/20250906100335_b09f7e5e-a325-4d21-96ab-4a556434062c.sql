-- Create messages table for user-to-user messaging
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  from_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  to_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  housing_ad_id UUID REFERENCES public.housing_ads(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create conversations table for grouping messages
CREATE TABLE public.conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  participant_one_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  participant_two_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  housing_ad_id UUID REFERENCES public.housing_ads(id) ON DELETE SET NULL,
  last_message_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(participant_one_id, participant_two_id, housing_ad_id)
);

-- Create email_verifications table for .edu verification
CREATE TABLE public.email_verifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  verification_code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create images table for housing ad images
CREATE TABLE public.housing_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  housing_ad_id UUID NOT NULL REFERENCES public.housing_ads(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  image_path TEXT NOT NULL,
  caption TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create storage bucket for housing images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('housing-images', 'housing-images', true);

-- Enable RLS on all tables
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.housing_images ENABLE ROW LEVEL SECURITY;

-- Messages policies
CREATE POLICY "Users can view their own messages" 
ON public.messages FOR SELECT 
USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

CREATE POLICY "Users can send messages" 
ON public.messages FOR INSERT 
WITH CHECK (auth.uid() = from_user_id);

CREATE POLICY "Users can update their own messages" 
ON public.messages FOR UPDATE 
USING (auth.uid() = from_user_id);

-- Conversations policies
CREATE POLICY "Users can view their conversations" 
ON public.conversations FOR SELECT 
USING (auth.uid() = participant_one_id OR auth.uid() = participant_two_id);

CREATE POLICY "Users can create conversations" 
ON public.conversations FOR INSERT 
WITH CHECK (auth.uid() = participant_one_id OR auth.uid() = participant_two_id);

CREATE POLICY "Users can update their conversations" 
ON public.conversations FOR UPDATE 
USING (auth.uid() = participant_one_id OR auth.uid() = participant_two_id);

-- Email verifications policies (admin only for security)
CREATE POLICY "Only service role can manage email verifications" 
ON public.email_verifications FOR ALL 
USING (false);

-- Housing images policies
CREATE POLICY "Anyone can view housing images" 
ON public.housing_images FOR SELECT 
USING (true);

CREATE POLICY "Users can manage images for their own ads" 
ON public.housing_images FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.housing_ads 
    WHERE id = housing_ad_id AND user_id = auth.uid()
  )
);

-- Storage policies for housing images
CREATE POLICY "Anyone can view housing images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'housing-images');

CREATE POLICY "Authenticated users can upload housing images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'housing-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can manage their own housing images" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'housing-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete their own housing images" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'housing-images' AND auth.uid() IS NOT NULL);

-- Triggers for updated_at columns
CREATE TRIGGER update_messages_updated_at
  BEFORE UPDATE ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();