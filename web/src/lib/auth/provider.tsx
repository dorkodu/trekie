import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import z from 'zod';
import { authClient } from "./client";
import type { Session, User } from './types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  login: (identifier: string, password: string) => Promise<boolean>; // identifier can be email or username
  logout: () => Promise<void>;
  signup: (params: { email: string; password: string; name: string; username?: string }) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
  checkUsernameAvailability: (username: string) => Promise<boolean>;
  completeOnboarding: () => Promise<boolean>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      setLoading(true);
      const sessionData = await authClient.getSession();
      if (sessionData.data?.user) {
        setUser(sessionData.data.user as User);
      }
      if (sessionData.data?.session) {
        setSession(sessionData.data.session as Session);
      }
    } catch (err: any) {
      console.error('Session check failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const login = async (identifier: string, password: string): Promise<boolean> => {
    // rudimentary email detection

    const isEmail = z.email().safeParse(identifier).success;
    if (isEmail) return loginWithEmail(identifier, password);
    return loginWithUsername(identifier, password);
  };

  const loginWithUsername = async (username: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const result = await authClient.signIn.username({ username, password });

      if (result?.error) {
        setError(result.error.message || "Login failed.");
        return false;
      } else if (
        result.data &&
        'user' in result.data &&
        result.data.user
      ) {
        setUser(result.data.user as User);
        // Get session after successful login
        await checkSession();
        return true;
      } else {
        setError("Login failed.");
        return false;
      }
    } catch (err: any) {
      setError(err?.message || "Login failed.");
      return false;
    } finally {
      setLoading(false);
    }
  }

  const loginWithEmail = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const result = await authClient.signIn.email({ email, password });

      if (result?.error) {
        setError(result.error.message || "Login failed.");
        return false;
      } else if (
        result.data &&
        'user' in result.data &&
        result.data.user
      ) {
        setUser(result.data.user as User);
        // Get session after successful login
        await checkSession();
        return true;
      } else {
        setError("Login failed.");
        return false;
      }
    } catch (err: any) {
      setError(err?.message || "Login failed.");
      return false;
    } finally {
      setLoading(false);
    }
  };



  const signup = async ({ email, password, name, username }: { email: string; password: string; name: string; username?: string }): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      // Use email signup with username plugin - BetterAuth will handle setting username
      const result = await authClient.signUp.email({
        email,
        password,
        name,
        username, // username plugin handles this field
        callbackURL: "/onboarding"
      });

      if (result?.error) {
        setError(result.error.message || "Signup failed.");
        return false;
      } else if (result.data && 'user' in result.data && result.data.user) {
        setUser(result.data.user as User);
        // Get session after successful signup
        await checkSession();
        return true;
      } else {
        setError("Signup failed.");
        return false;
      }
    } catch (err: any) {
      setError(err?.message || "Signup failed.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Social login postponed for now

  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      await authClient.signOut();
      setUser(null);
      setSession(null);
    } catch (err: any) {
      console.error('Logout failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Better-auth might have a forgetPassword method
      // For now, we'll simulate the API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // You would typically call something like:
      // const result = await authClient.forgetPassword({ email });
      // if (result?.error) {
      //   setError(result.error.message || "Failed to send reset email.");
      //   return false;
      // }

      return true;
    } catch (err: any) {
      setError(err?.message || "Failed to send reset email.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const checkUsernameAvailability = async (username: string): Promise<boolean> => {
    try {
      // For now, we'll simulate a realistic username availability check
      // In production, this would make a real API call to your backend
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay

      // Block common/reserved usernames
      const blockedUsernames = [
        'admin', 'root', 'api', 'www', 'mail', 'ftp', 'test', 'support', 'help',
        'user', 'guest', 'demo', 'example', 'sample', 'anonymous', 'null', 'undefined',
        'about', 'privacy', 'terms', 'login', 'signup', 'register', 'dashboard',
        'profile', 'settings', 'account', 'home', 'contact', 'blog', 'news'
      ];

      // Check if username is in blocked list (case insensitive)
      if (blockedUsernames.includes(username.toLowerCase())) {
        return false;
      }

      // For demo purposes, also block usernames that are too short or contain certain patterns
      if (username.length < 3) {
        return false;
      }

      // Simulate some usernames being taken (for demo)
      const commonTakenUsernames = ['john', 'jane', 'user123', 'test123', 'demo'];
      if (commonTakenUsernames.includes(username.toLowerCase())) {
        return false;
      }

      // Otherwise, username is available
      return true;
    } catch (err: any) {
      console.warn('Username availability check failed:', err);
      // On error, assume username might be taken for safety
      return false;
    }
  };

  const completeOnboarding = async (): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Call API to mark onboarding as completed
      // const result = await authClient.updateUser({ onboardingCompleted: true });

      // For now, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update local user state
      if (user) {
        setUser({ ...user, onboardingCompleted: true } as User);
      }

      return true;
    } catch (err: any) {
      setError(err?.message || "Failed to complete onboarding.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    error,
    login,
    logout,
    signup,
    forgotPassword,
    checkUsernameAvailability,
    completeOnboarding,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
