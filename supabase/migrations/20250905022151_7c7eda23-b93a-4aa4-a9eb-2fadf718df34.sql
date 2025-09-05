-- Create housing_ads table for real ads
CREATE TABLE public.housing_ads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  bedrooms INTEGER NOT NULL,
  bathrooms INTEGER NOT NULL,
  dates_available TEXT NOT NULL,
  amenities TEXT[],
  complex_name TEXT,
  university TEXT NOT NULL,
  is_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.housing_ads ENABLE ROW LEVEL SECURITY;

-- Create policies for housing_ads
CREATE POLICY "Anyone can view housing ads" 
ON public.housing_ads 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own ads" 
ON public.housing_ads 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ads" 
ON public.housing_ads 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ads" 
ON public.housing_ads 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE TRIGGER update_housing_ads_updated_at
BEFORE UPDATE ON public.housing_ads
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();