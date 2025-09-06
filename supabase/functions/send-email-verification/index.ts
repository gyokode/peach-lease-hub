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

    // Store verification code in database
    const { data, error: dbError } = await supabase
      .from('email_verifications')
      .insert({
        email,
        verification_code: verificationCode,
        expires_at: expiresAt.toISOString(),
        verified: false
      })
      .select();

    if (dbError) {
      console.error('Database error:', dbError);
      return new Response(
        JSON.stringify({ error: 'Failed to store verification code', details: dbError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Verification code stored successfully:', data);

    // In development, return the code for testing
    const isDevelopment = Deno.env.get('ENVIRONMENT') === 'development';
    
    // Log the verification code for development/testing
    console.log(`=== VERIFICATION CODE FOR ${email} ===`);
    console.log(`Code: ${verificationCode}`);
    console.log(`Expires at: ${expiresAt.toISOString()}`);
    console.log(`University: ${university}`);
    console.log('=======================================');
    
    return new Response(
      JSON.stringify({ 
        message: 'Verification code sent successfully',
        // Include code in development for testing
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