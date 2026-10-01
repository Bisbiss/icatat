-- ========================================================
-- ICATAT - MIGRASI 002: DASHBOARD ADMIN
-- Jalankan skrip ini di SQL Editor dashboard Supabase Anda
-- (setelah schema.sql sudah dijalankan).
-- ========================================================

-- 1. Tambah kolom role di tabel profiles ('user' | 'admin')
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user'
  CHECK (role IN ('user', 'admin'));

-- 2. Fungsi pengecekan admin.
--    SECURITY DEFINER = dijalankan sebagai pemilik fungsi sehingga
--    lolos RLS tanpa menyebabkan rekursi policy.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$;

-- 3. Admin boleh MEMBACA semua profil pengguna (read-only)
DROP POLICY IF EXISTS "Admin dapat melihat semua profil" ON public.profiles;
CREATE POLICY "Admin dapat melihat semua profil"
  ON public.profiles FOR SELECT
  USING (public.is_admin());

-- 4. Admin boleh MEMBACA semua transaksi (read-only, untuk statistik)
--    Admin TIDAK diberi hak insert/update/delete atas data milik user lain.
DROP POLICY IF EXISTS "Admin dapat melihat semua transaksi" ON public.transactions;
CREATE POLICY "Admin dapat melihat semua transaksi"
  ON public.transactions FOR SELECT
  USING (public.is_admin());

-- ========================================================
-- 5. CARA MENJADIKAN USER SEBAGAI ADMIN
--    Ganti 'email@kamu.com' dengan email akun admin, lalu jalankan:
--
--    UPDATE public.profiles
--    SET role = 'admin'
--    WHERE email = 'email@kamu.com';
--
--    Untuk mencabut kembali:
--    UPDATE public.profiles
--    SET role = 'user'
--    WHERE email = 'email@kamu.com';
-- ========================================================
