
-- 1) Remove the always-true INSERT policy on webinar_leads; inserts happen via the
-- submit-lead edge function using the service role (which bypasses RLS).
DROP POLICY IF EXISTS "Allow public to insert leads" ON public.webinar_leads;

-- Revoke direct INSERT privilege from anon/authenticated so the Data API cannot insert.
REVOKE INSERT ON public.webinar_leads FROM anon;
REVOKE INSERT ON public.webinar_leads FROM authenticated;

-- 2) Lock down SECURITY DEFINER functions so they aren't callable from the Data API.
-- `has_role` is invoked internally by RLS policies; PostgREST callers don't need EXECUTE.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;

-- `handle_first_admin` is only intended to run as a trigger; nobody should call it directly.
REVOKE EXECUTE ON FUNCTION public.handle_first_admin() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_first_admin() FROM anon;
REVOKE EXECUTE ON FUNCTION public.handle_first_admin() FROM authenticated;
