-- Fix 1: Add unique constraint on email to prevent duplicate submissions
ALTER TABLE public.webinar_leads 
ADD CONSTRAINT webinar_leads_email_unique UNIQUE (email);

-- Fix 2: Create trigger to auto-promote first user to admin role
-- This solves the chicken-and-egg problem of creating the first admin

-- Function to auto-assign admin role to first user
CREATE OR REPLACE FUNCTION public.handle_first_admin()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_count INT;
BEGIN
  -- Check if any admin users exist
  SELECT COUNT(*) INTO admin_count
  FROM public.user_roles
  WHERE role = 'admin';
  
  -- If no admins exist, make this user an admin
  IF admin_count = 0 THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin');
    
    -- Log this action for audit purposes
    RAISE NOTICE 'First admin user created: %', NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger on auth.users to auto-promote first user
DROP TRIGGER IF EXISTS on_first_admin_created ON auth.users;
CREATE TRIGGER on_first_admin_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_first_admin();

-- Fix 3: Add timestamp tracking for basic rate limiting
ALTER TABLE public.webinar_leads 
ADD COLUMN IF NOT EXISTS ip_address TEXT,
ADD COLUMN IF NOT EXISTS submission_count INTEGER DEFAULT 1;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_webinar_leads_email ON public.webinar_leads(email);
CREATE INDEX IF NOT EXISTS idx_webinar_leads_created_at ON public.webinar_leads(created_at);