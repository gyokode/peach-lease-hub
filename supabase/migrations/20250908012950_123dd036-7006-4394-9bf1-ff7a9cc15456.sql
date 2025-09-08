-- Create a more secure approach by removing direct service role access
-- and implementing function-based access control

-- Drop all existing policies on email_verifications
DROP POLICY IF EXISTS "Service role can insert email verifications" ON public.email_verifications;
DROP POLICY IF EXISTS "Service role can select active email verifications" ON public.email_verifications;
DROP POLICY IF EXISTS "Service role can mark email verifications as verified" ON public.email_verifications;
DROP POLICY IF EXISTS "Service role can cleanup email verifications" ON public.email_verifications;
DROP POLICY IF EXISTS "Block user access to email verifications" ON public.email_verifications;

-- Create a single, highly restrictive policy that blocks ALL direct access
CREATE POLICY "Block all direct access to email verifications"
ON public.email_verifications
FOR ALL
USING (false)
WITH CHECK (false);

-- Create secure functions that encapsulate all email verification operations
-- These functions will run with SECURITY DEFINER to bypass RLS

-- Function to create verification code (called by edge function)
CREATE OR REPLACE FUNCTION public.create_email_verification(
  p_email TEXT,
  p_verification_code TEXT,
  p_expires_at TIMESTAMPTZ
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id UUID;
BEGIN
  -- Validate inputs
  IF p_email IS NULL OR p_verification_code IS NULL OR p_expires_at IS NULL THEN
    RAISE EXCEPTION 'Missing required parameters';
  END IF;
  
  IF NOT p_email ~ '^[^@]+@[^@]+\.[a-zA-Z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;
  
  IF LENGTH(p_verification_code) != 6 OR p_verification_code !~ '^[0-9]{6}$' THEN
    RAISE EXCEPTION 'Invalid verification code format';
  END IF;
  
  IF p_expires_at <= now() OR p_expires_at > now() + interval '1 hour' THEN
    RAISE EXCEPTION 'Invalid expiration time';
  END IF;
  
  -- Insert the verification record
  INSERT INTO public.email_verifications (email, verification_code, expires_at)
  VALUES (p_email, p_verification_code, p_expires_at)
  RETURNING id INTO new_id;
  
  -- Auto-cleanup occasionally
  IF random() < 0.1 THEN
    PERFORM public.cleanup_expired_verifications();
  END IF;
  
  RETURN new_id;
END;
$$;

-- Function to verify code (called by edge function)
CREATE OR REPLACE FUNCTION public.verify_email_code(
  p_email TEXT,
  p_verification_code TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  verification_record RECORD;
BEGIN
  -- Validate inputs
  IF p_email IS NULL OR p_verification_code IS NULL THEN
    RAISE EXCEPTION 'Missing required parameters';
  END IF;
  
  -- Find and verify the code
  SELECT * INTO verification_record
  FROM public.email_verifications
  WHERE email = p_email
    AND verification_code = p_verification_code
    AND expires_at > now()
    AND verified = false
  ORDER BY created_at DESC
  LIMIT 1;
  
  -- If no valid record found
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  -- Mark as verified
  UPDATE public.email_verifications
  SET verified = true
  WHERE id = verification_record.id;
  
  RETURN true;
END;
$$;

-- Enhanced cleanup function with better logging
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
  
  -- Log cleanup activity (only if there were deletions)
  IF deleted_count > 0 THEN
    RAISE LOG 'Cleaned up % expired email verification codes', deleted_count;
  END IF;
  
  RETURN deleted_count;
END;
$$;

-- Grant execute permissions only to service_role for these functions
REVOKE ALL ON FUNCTION public.create_email_verification(TEXT, TEXT, TIMESTAMPTZ) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.verify_email_code(TEXT, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.cleanup_expired_verifications() FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.create_email_verification(TEXT, TEXT, TIMESTAMPTZ) TO service_role;
GRANT EXECUTE ON FUNCTION public.verify_email_code(TEXT, TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION public.cleanup_expired_verifications() TO service_role;

-- Remove the auto-cleanup trigger as we'll handle it in the create function
DROP TRIGGER IF EXISTS auto_cleanup_verifications ON public.email_verifications;