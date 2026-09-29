-- ========================================================
-- ICATAT - SUPABASE DATABASE SCHEMA
-- Jalankan skrip ini di SQL Editor dashboard Supabase Anda:
-- https://supabase.com/dashboard/project/_/sql
-- ========================================================

-- 1. Buat Tabel Transaksi
CREATE TABLE IF NOT EXISTS public.transactions (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  category TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  note TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Aktifkan Row Level Security (RLS) pada tabel transactions
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- 3. Kebijakan Keamanan (Row Level Security Policies)
-- Memastikan setiap pengguna HANYA bisa mengakses dan memanipulasi transaksinya sendiri

DROP POLICY IF EXISTS "User dapat melihat transaksi miliknya" ON public.transactions;
CREATE POLICY "User dapat melihat transaksi miliknya"
  ON public.transactions FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "User dapat menambah transaksi miliknya" ON public.transactions;
CREATE POLICY "User dapat menambah transaksi miliknya"
  ON public.transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "User dapat mengubah transaksi miliknya" ON public.transactions;
CREATE POLICY "User dapat mengubah transaksi miliknya"
  ON public.transactions FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "User dapat menghapus transaksi miliknya" ON public.transactions;
CREATE POLICY "User dapat menghapus transaksi miliknya"
  ON public.transactions FOR DELETE
  USING (auth.uid() = user_id);

-- 4. Indeks Performa
CREATE INDEX IF NOT EXISTS idx_transactions_user_date 
  ON public.transactions(user_id, date DESC);

-- ========================================================
-- 5. Tabel Profil Pengguna (Opsional & Otomatis)
-- ========================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "User dapat melihat profil sendiri" ON public.profiles;
CREATE POLICY "User dapat melihat profil sendiri"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "User dapat mengubah profil sendiri" ON public.profiles;
CREATE POLICY "User dapat mengubah profil sendiri"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Trigger untuk membuat baris profile otomatis setiap ada user baru mendaftar di auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
