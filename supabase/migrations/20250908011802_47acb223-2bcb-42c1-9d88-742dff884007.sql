-- Drop the overly restrictive policy that blocks all access
DROP POLICY IF EXISTS "Only service role can manage email verifications" ON public.email_verifications;

-- Create proper service role policies for email verifications
-- Allow service role to insert new verification codes
CREATE POLICY "Service role can insert email verifications"
ON public.email_verifications
FOR INSERT
TO service_role
WITH CHECK (true);

-- Allow service role to select verification codes for validation
CREATE POLICY "Service role can select email verifications"
ON public.email_verifications
FOR SELECT
TO service_role
USING (true);

-- Allow service role to update verification status
CREATE POLICY "Service role can update email verifications"
ON public.email_verifications
FOR UPDATE
TO service_role
USING (true);

-- Explicitly block all regular user access (authenticated and anon roles)
CREATE POLICY "Block user access to email verifications"
ON public.email_verifications
FOR ALL
TO anon, authenticated
USING (false);