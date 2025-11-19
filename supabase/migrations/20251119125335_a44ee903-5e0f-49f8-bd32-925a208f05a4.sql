-- Create table for webinar leads
CREATE TABLE public.webinar_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  country TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.webinar_leads ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert leads (public form)
CREATE POLICY "Allow public to insert leads"
ON public.webinar_leads
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Create policy to allow authenticated users to view all leads (for admin dashboard)
CREATE POLICY "Allow authenticated users to view leads"
ON public.webinar_leads
FOR SELECT
TO authenticated
USING (true);

-- Create index on email for faster lookups
CREATE INDEX idx_webinar_leads_email ON public.webinar_leads(email);

-- Create index on created_at for sorting
CREATE INDEX idx_webinar_leads_created_at ON public.webinar_leads(created_at DESC);