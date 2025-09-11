import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.0";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  email: string;
  university: string;
}

serve(async (req) => {
  console.log('Function called with method:', req.method);
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestBody = await req.text();
    console.log('Raw request body:', requestBody);
    
    const { email, university }: RequestBody = JSON.parse(requestBody);
    console.log('Parsed request:', { email, university });

    if (!email || !email.endsWith('.edu')) {
      console.log('Invalid email:', email);
      return new Response(
        JSON.stringify({ error: 'Valid .edu email required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    
    console.log('Generated verification code:', verificationCode);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    console.log('Supabase URL exists:', !!supabaseUrl);
    console.log('Service key exists:', !!supabaseServiceKey);
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase environment variables');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Store verification code using secure RPC
    const { data, error: dbError } = await supabase
      .rpc('create_email_verification', {
        p_email: email,
        p_verification_code: verificationCode,
        p_expires_at: expiresAt.toISOString(),
      });

    if (dbError) {
      console.error('Database error:', dbError);
      return new Response(
        JSON.stringify({ error: 'Failed to store verification code', details: dbError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Verification code stored successfully:', data);

    const isDevelopment = Deno.env.get('ENVIRONMENT') === 'development';

    // Attempt to send email via Resend if API key is configured
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (resendApiKey) {
      try {
        const resend = new Resend(resendApiKey);
        const emailResponse = await resend.emails.send({
          from: 'Peach Lease <onboarding@resend.dev>',
          to: [email],
          subject: 'Your Peach Lease verification code',
          reply_to: 'peachleaser@gmail.com',
          html: `<div style="font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Ubuntu;line-height:1.6">
            <h2>Verify your email</h2>
            <p>Your verification code is:</p>
            <div style="font-size:28px;font-weight:700;letter-spacing:4px">${verificationCode}</div>
            <p>This code expires at ${expiresAt.toLocaleString()}.</p>
            <p>If you didn't request this, you can ignore this email.</p>
          </div>`,
          text: `Your Peach Lease verification code is ${verificationCode}. It expires at ${expiresAt.toISOString()}.`,
        });
        console.log('Email sent via Resend:', emailResponse);
      } catch (sendError) {
        console.error('Failed to send verification email:', sendError);
        // Don't fail the request if email sending fails; return code in development
      }
    } else {
      console.warn('RESEND_API_KEY not set. Skipping email send.');
    }

    // Log details for development/testing
    console.log(`=== VERIFICATION CODE FOR ${email} ===`);
    console.log(`Code: ${verificationCode}`);
    console.log(`Expires at: ${expiresAt.toISOString()}`);
    console.log(`University: ${university}`);
    console.log('=======================================');
    
    return new Response(
      JSON.stringify({ 
        message: 'Verification code processed',
        ...(isDevelopment && { code: verificationCode })
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in send-email-verification:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});