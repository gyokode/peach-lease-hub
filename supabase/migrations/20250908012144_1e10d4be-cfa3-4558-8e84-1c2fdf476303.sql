-- Drop existing policies to recreate with better security
DROP POLICY IF EXISTS "Service role can insert email verifications" ON public.email_verifications;
DROP POLICY IF EXISTS "Service role can select email verifications" ON public.email_verifications;
DROP POLICY IF EXISTS "Service role can update email verifications" ON public.email_verifications;
DROP POLICY IF EXISTS "Block user access to email verifications" ON public.email_verifications;

-- Create more secure service role policies with specific conditions
-- Allow service role to insert only fresh verification codes
CREATE POLICY "Service role can insert email verifications"
ON public.email_verifications
FOR INSERT
TO service_role
WITH CHECK (
  expires_at > now() AND 
  expires_at <= now() + interval '1 hour' AND
  length(verification_code) = 6 AND
  verification_code ~ '^[0-9]{6}$'
);

-- Allow service role to select only non-expired, unverified codes for validation
CREATE POLICY "Service role can select active email verifications"
ON public.email_verifications
FOR SELECT
TO service_role
USING (
  expires_at > now() AND 
  verified = false
);

-- Allow service role to update only to mark as verified (no other changes)
CREATE POLICY "Service role can mark email verifications as verified"
ON public.email_verifications
FOR UPDATE
TO service_role
USING (
  expires_at > now() AND 
  verified = false
)
WITH CHECK (
  verified = true AND
  expires_at = OLD.expires_at AND
  email = OLD.email AND
  verification_code = OLD.verification_code
);

-- Allow service role to delete expired or verified codes for cleanup
CREATE POLICY "Service role can cleanup email verifications"
ON public.email_verifications
FOR DELETE
TO service_role
USING (
  expires_at <= now() OR 
  (verified = true AND created_at <= now() - interval '24 hours')
);

-- Block all user access (authenticated and anon roles)
CREATE POLICY "Block user access to email verifications"
ON public.email_verifications
FOR ALL
TO anon, authenticated
USING (false);

-- Create function to automatically cleanup expired verification codes
CREATE OR REPLACE FUNCTION public.cleanup_expired_verifications()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  -- Delete expired or old verified codes
  DELETE FROM public.email_verifications 
  WHERE 
    expires_at <= now() OR 
    (verified = true AND created_at <= now() - interval '24 hours');
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  -- Log cleanup activity
  RAISE LOG 'Cleaned up % expired email verification codes', deleted_count;
  
  RETURN deleted_count;
END;
$$;

-- Create a trigger to automatically cleanup on insert (rate limited)
CREATE OR REPLACE FUNCTION public.trigger_cleanup_verifications()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only cleanup occasionally (roughly 1 in 10 inserts) to avoid performance impact
  IF random() < 0.1 THEN
    PERFORM public.cleanup_expired_verifications();
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for automatic cleanup
DROP TRIGGER IF EXISTS auto_cleanup_verifications ON public.email_verifications;
CREATE TRIGGER auto_cleanup_verifications
  AFTER INSERT ON public.email_verifications
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_cleanup_verifications();

-- Add constraint to ensure verification codes are always 6 digits
ALTER TABLE public.email_verifications 
ADD CONSTRAINT verification_code_format 
CHECK (verification_code ~ '^[0-9]{6}$');

-- Add constraint to ensure reasonable expiration times (max 1 hour)
ALTER TABLE public.email_verifications 
ADD CONSTRAINT reasonable_expiration 
CHECK (expires_at > created_at AND expires_at <= created_at + interval '1 hour');