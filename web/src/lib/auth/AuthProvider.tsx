import { usernameClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

export const authClient = createAuthClient({
  baseURL: "http://localhost:8000/auth/",
  apiPath: "/", // Prevents /api from being appended
  plugins: [
    usernameClient()
  ],
  fetchOptions: {
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    }
  }
});

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  emailVerified: boolean;
}

interface Session {
  id: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
  ipAddress?: string;
  userAgent?: string;
  userId: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  login: (credentials: { username?: string; email?: string; password: string }) => Promise<boolean>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  socialLogin: (provider: 'github') => Promise<boolean>;
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

  const login = async ({ username, email, password }: { username?: string; email?: string; password: string }): Promise<boolean> => {
    if (email && password) {
      return emailLogin(email, password);
    } else if (username && password) {
      return usernameLogin(username, password);
    } else {
      setError("Email and password are required for login.");
      return false;
    }
  };

  const usernameLogin = async (username: string, password: string): Promise<boolean> => {
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

  const emailLogin = async (email: string, password: string): Promise<boolean> => {
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



  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const result = await authClient.signUp.email({
        email,
        password,
        name,
        callbackURL: "/dashboard"
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

  const socialLogin = async (provider: 'github'): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const result = await authClient.signIn.social({ provider });

      if (result?.error) {
        setError(result.error.message || `${provider} login failed.`);
        return false;
      } else if ('user' in result.data && result.data.user) {
        setUser(result.data.user as User);
        // Get session after successful social login
        await checkSession();
        return true;
      } else {
        setError(`${provider} login failed.`);
        return false;
      }
    } catch (err: any) {
      setError(err?.message || `${provider} login failed.`);
      return false;
    } finally {
      setLoading(false);
    }
  };

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
    socialLogin,
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
