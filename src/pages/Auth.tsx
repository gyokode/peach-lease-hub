import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle, Mail, Shield, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationStep, setVerificationStep] = useState(false);
  const [university, setUniversity] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          navigate('/');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const validateEduEmail = (email: string) => {
    return email.endsWith('.edu');
  };

  const getUniversityFromEmail = (email: string) => {
    const domain = email.split('@')[1];
    if (domain === 'uga.edu') return 'University of Georgia';
    if (domain === 'gatech.edu') return 'Georgia Tech';
    return domain.replace('.edu', '').toUpperCase();
  };

  const handleSendVerification = async () => {
    if (!email || !validateEduEmail(email)) {
      setError('Please enter a valid .edu email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.functions.invoke('send-email-verification', {
        body: { 
          email,
          university: getUniversityFromEmail(email)
        }
      });

      if (error) throw error;
      
      // In development, show the code for testing
      if (data?.code) {
        console.log('Development verification code:', data.code);
      }

      setVerificationStep(true);
      setUniversity(getUniversityFromEmail(email));
      toast({
        title: "Verification code sent",
        description: "Check your email for the verification code.",
      });
    } catch (error: any) {
      setError(error.message || 'Failed to send verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword || !verificationCode) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Verify the code first
      const { error: verifyError } = await supabase.functions.invoke('verify-email-code', {
        body: { 
          email,
          code: verificationCode
        }
      });

      if (verifyError) throw verifyError;

      // Sign up the user
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            university,
            display_name: displayName || email.split('@')[0]
          }
        }
      });

      if (signUpError) throw signUpError;

      toast({
        title: "Account created successfully!",
        description: "Welcome to Peach Lease!",
      });

      navigate('/');
    } catch (error: any) {
      setError(error.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Welcome back!",
        description: "You've successfully signed in.",
      });

      navigate('/');
    } catch (error: any) {
      setError(error.message || 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 bg-gradient-subtle">
      <div className="container mx-auto px-4 max-w-md">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-4xl mb-4 block">🍑</span>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Join Peach Lease
          </h1>
          <p className="text-muted-foreground">
            Verified student housing platform
          </p>
        </div>

        <Card className="shadow-premium border-0">
          <CardHeader>
            <CardTitle className="text-center">Student Verification Required</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className="mb-6 bg-gradient-subtle border-0">
              <Shield className="h-4 w-4" />
              <AlertDescription>
                All users must verify their university email address (.edu) to ensure a trusted student community.
              </AlertDescription>
            </Alert>

            {error && (
              <Alert className="mb-6 bg-red-50 border-red-200 text-red-800">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Tabs defaultValue="signup" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
                <TabsTrigger value="signin">Sign In</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signup" className="space-y-4">
                {!verificationStep ? (
                  <>
                    <div>
                      <Label htmlFor="email">University Email (.edu)</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="yourname@uga.edu"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Must be a valid .edu email address
                      </p>
                    </div>
                    
                    <Button 
                      onClick={handleSendVerification}
                      disabled={isLoading || !email || !validateEduEmail(email)}
                      className="w-full"
                      variant="hero"
                    >
                      {isLoading ? 'Sending...' : 'Send Verification Code'}
                      <Mail className="h-4 w-4 ml-2" />
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="text-center mb-4">
                      <Badge variant="secondary" className="mb-2">
                        {university}
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        Verification code sent to {email}
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="code">Verification Code</Label>
                      <Input
                        id="code"
                        placeholder="Enter 6-digit code"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        maxLength={6}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="displayName">Display Name (Optional)</Label>
                      <Input
                        id="displayName"
                        placeholder="How you want to appear to others"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Choose a secure password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        onClick={() => setVerificationStep(false)}
                        className="flex-1"
                      >
                        Back
                      </Button>
                      <Button 
                        onClick={handleSignUp}
                        disabled={isLoading}
                        className="flex-1"
                        variant="hero"
                      >
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                      </Button>
                    </div>
                  </>
                )}
              </TabsContent>
              
              <TabsContent value="signin" className="space-y-4">
                <div>
                  <Label htmlFor="signin-email">University Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="yourname@uga.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="signin-password">Password</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <Button 
                  onClick={handleSignIn}
                  disabled={isLoading}
                  className="w-full"
                  variant="hero"
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>
              </TabsContent>
            </Tabs>

            <p className="text-xs text-muted-foreground text-center mt-6">
              By creating an account, you agree to our Community Guidelines and Terms of Service.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;