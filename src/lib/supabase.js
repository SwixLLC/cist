import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mipigglfdxjoormlfxnw.supabase.co';
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pcGlnZ2xmZHhqb29ybWxmeG53Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MTA1MDUwNiwiZXhwIjoyMTA2NjI2NTA2fQ.3IDvnYaCdsUKSjPNl6Bew_pMDgM59z1XpOqybcwH4Hs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

/**
 * Creates an admin user directly with email_confirm: true using the admin API
 */
export async function createAdminUser(email, password) {
  try {
    const res = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
      method: 'POST',
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        email_confirm: true,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || data.error_description || 'Failed to create user');
    }
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
}
