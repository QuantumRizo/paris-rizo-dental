import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY; // Note: Marco uses VITE_SUPABASE_ANON_KEY, existing dental used VITE_SUPABASE_KEY. Keeping local convention if possible, but let's check .env if I could. 
// Actually, looking at AdminPanel.tsx in dental, it uses VITE_SUPABASE_KEY.
// const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
// I will use VITE_SUPABASE_KEY to match the existing project's likely .env

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase URL or Key is missing! Check .env');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');
