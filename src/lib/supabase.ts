import { createClient } from '@supabase/supabase-js';
import { logger } from './logger';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// ─────────────────────────────────────────────────────────────────────────────
// SECURITY FIX: Validate environment variables
// ─────────────────────────────────────────────────────────────────────────────
if (!supabaseUrl || !supabaseAnonKey) {
  logger.error(
    'Missing Supabase environment variables',
    undefined,
    {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseAnonKey,
      environment: import.meta.env.MODE,
    }
  );
  
  // В production выбрасываем ошибку
  if (import.meta.env.PROD) {
    throw new Error(
      'CRITICAL: Missing Supabase configuration. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY'
    );
  }
  
  // В development используем демо-режим с предупреждением
  logger.warn('Running in demo mode with limited functionality');
}

export const supabase = createClient(
  supabaseUrl || 'https://demo.supabase.co',
  supabaseAnonKey || 'demo-key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
    global: {
      headers: {
        'X-Client-Info': 'freedom-hub-web',
      },
    },
  }
);

export async function signUpWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching profile:', error);
    return null;
  }
  return data;
}
