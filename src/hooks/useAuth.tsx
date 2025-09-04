import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  user_id: string;
  email: string;
  university: string;
  display_name: string | null;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Create a mock profile from user metadata for now
          // TODO: Fetch real profile once types are updated
          const mockProfile: Profile = {
            id: session.user.id,
            user_id: session.user.id,
            email: session.user.email || '',
            university: session.user.user_metadata?.university || 'Unknown',
            display_name: session.user.user_metadata?.display_name || session.user.email?.split('@')[0] || null,
            created_at: session.user.created_at || '',
            updated_at: session.user.updated_at || ''
          };
          setProfile(mockProfile);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Create a mock profile from user metadata for now
        const mockProfile: Profile = {
          id: session.user.id,
          user_id: session.user.id,
          email: session.user.email || '',
          university: session.user.user_metadata?.university || 'Unknown',
          display_name: session.user.user_metadata?.display_name || session.user.email?.split('@')[0] || null,
          created_at: session.user.created_at || '',
          updated_at: session.user.updated_at || ''
        };
        setProfile(mockProfile);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}