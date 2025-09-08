import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  email: string;
  university: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, university }: RequestBody = await req.json();

    if (!email || !email.endsWith('.edu')) {
      return new Response(
        JSON.stringify({ error: 'Valid .edu email required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Use secure database function to create verification
    const { data, error: dbError } = await supabase.rpc('create_email_verification', {
      p_email: email,
      p_verification_code: verificationCode,
      p_expires_at: expiresAt.toISOString()
    });

    if (dbError) {
      console.error('Database error:', dbError);
      return new Response(
        JSON.stringify({ error: 'Failed to store verification code' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // In a real implementation, you would send an actual email here
    // For now, we'll just log it (in production, integrate with an email service like SendGrid, AWS SES, etc.)
    console.log(`Verification code for ${email}: ${verificationCode}`);
    
    // Email content
    const emailSubject = "Peach Lease - Verify Your University Email";
    const emailBody = `
Hello!

Welcome to Peach Lease! To complete your registration and verify that you're a student at ${university}, please use this verification code:

${verificationCode}

This code will expire in 15 minutes.

If you didn't request this verification, please ignore this email.

Thanks,
The Peach Lease Team 🍑
    `;

    // TODO: Replace with actual email service integration
    // For development, we'll simulate email sending
    console.log(`Would send email to ${email}:
Subject: ${emailSubject}
Body: ${emailBody}`);

    return new Response(
      JSON.stringify({ 
        message: 'Verification code sent successfully',
        // In development, include the code for testing
        ...(Deno.env.get('ENVIRONMENT') === 'development' && { code: verificationCode })
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in send-verification-email:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});