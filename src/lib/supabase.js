import { createClient } from '@supabase/supabase-js';

// Use the project's public "anon" key here — never the service_role key, which bypasses all security rules.
export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mipigglfdxjoormlfxnw.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseAnonKey) {
  console.error('VITE_SUPABASE_ANON_KEY is not set. Add it to .env before building.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey || 'missing-anon-key', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
