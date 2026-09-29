import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Mengecek apakah kredensial Supabase sudah diisi di .env
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.trim() !== '' &&
  supabaseAnonKey.trim() !== '' &&
  !supabaseUrl.includes('your-project-id')
);

if (!isSupabaseConfigured) {
  console.warn(
    '[Supabase] Kredensial Supabase belum diisi di file .env. Pastikan kamu telah mengisi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY.'
  );
}

// Inisialisasi Supabase Client dengan fallback aman agar aplikasi tidak crash sebelum .env diisi
export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl : 'https://placeholder.supabase.co',
  isSupabaseConfigured ? supabaseAnonKey : 'placeholder-key'
);
