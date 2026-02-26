import { useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { logger } from '@/lib/logger';

type Profile = {
  id: string;
  wallet_address?: string;
  email?: string;
  username: string;
  avatar_url?: string;
  is_premium?: boolean;
  premium_until?: string;
  is_verified?: boolean;
  verification_type?: 'creator' | 'admin' | 'partner' | 'premium';
  verified_at?: string;
};

interface UseAuthReturn {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signOut: () => Promise<void>;
}

// Демо-режим (без реального бэкенда)
const DEMO_MODE = true;

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (DEMO_MODE) {
      // Проверяем, есть ли демо-сессия
      const demoUser = localStorage.getItem('demo_user');
      if (demoUser) {
        try {
          const parsed = JSON.parse(demoUser);
          
          // SECURITY FIX: Validate parsed data structure
          if (!parsed.user || !parsed.profile) {
            logger.warn('Invalid demo user data structure, clearing');
            localStorage.removeItem('demo_user');
            setIsLoading(false);
            return;
          }
          
          setUser(parsed.user);
          setProfile(parsed.profile);
        } catch (error) {
          logger.error('Failed to parse demo user', error, {
            demoUserLength: demoUser?.length,
          });
          localStorage.removeItem('demo_user');
        }
      }
      setIsLoading(false);
      return;
    }

    // SECURITY FIX: Add proper error handling for getSession
    supabase.auth.getSession()
      .then(({ data: { session }, error }) => {
        if (error) {
          logger.error('Failed to get session', error);
          setIsLoading(false);
          return;
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      })
      .catch((error: Error) => {
        logger.error('Session retrieval failed', error);
        setIsLoading(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    if (DEMO_MODE) {
      // Демо-вход
      const demoUser: User = {
        id: 'demo-user-id',
        email,
        aud: 'authenticated',
      } as User;

      const demoProfile: Profile = {
        id: 'demo-user-id',
        email,
        username: email.split('@')[0] || 'DemoUser',
        is_premium: false,
        is_verified: false,
      };

      setUser(demoUser);
      setProfile(demoProfile);
      localStorage.setItem('demo_user', JSON.stringify({
        user: demoUser,
        profile: demoProfile,
      }));
      logger.info('Demo user signed in', { email });
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      logger.error('Sign in failed', error, { email });
      throw error;
    }
    
    logger.info('User signed in successfully', { 
      userId: data.user?.id,
      email 
    });
  };

  const signUp = async (email: string, password: string, username: string) => {
    if (DEMO_MODE) {
      // Демо-регистрация
      const demoUser = {
        id: 'demo-user-id',
        email,
        aud: 'authenticated',
      } as User;
      
      const demoProfile = {
        id: 'demo-user-id',
        email,
        username,
        is_premium: false,
        is_verified: false,
      };
      
      setUser(demoUser);
      setProfile(demoProfile);
      localStorage.setItem('demo_user', JSON.stringify({
        user: demoUser,
        profile: demoProfile,
      }));
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    });
    if (error) throw error;
  };

  const signOut = async () => {
    if (DEMO_MODE) {
      localStorage.removeItem('demo_user');
      setUser(null);
      setProfile(null);
      setSession(null);
      return;
    }

    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return {
    user,
    profile,
    session,
    isLoading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
  };
}
