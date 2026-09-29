import React, { useState } from 'react';
import { ArrowLeft, Lock, Mail, User, Sparkles, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export default function AuthPage({ initialMode = 'login', onAuthSuccess, onBackToLanding }) {
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const translateAuthError = (message = '') => {
    const lower = message.toLowerCase();
    if (lower.includes('invalid login credentials')) {
      return 'Email atau password yang kamu masukkan salah. Coba periksa kembali.';
    }
    if (lower.includes('user already registered') || lower.includes('already exists')) {
      return 'Email ini sudah terdaftar. Silakan pindah ke tab Masuk.';
    }
    if (lower.includes('password should be at least')) {
      return 'Password terlalu pendek. Minimal harus 6 karakter.';
    }
    if (lower.includes('rate limit')) {
      return 'Terlalu banyak percobaan dalam waktu singkat. Harap tunggu 1-2 menit.';
    }
    if (lower.includes('email not confirmed')) {
      return 'Email kamu belum dikonfirmasi. Silakan periksa inbox email atau matikan "Confirm email" di dashboard Supabase jika ingin langsung masuk.';
    }
    return message || 'Terjadi kesalahan autentikasi. Silakan coba lagi.';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!email.trim() || !password) {
      setError('Silakan isi email dan password kamu.');
      return;
    }

    if (mode === 'register' && !name.trim()) {
      setError('Silakan masukkan nama lengkap kamu.');
      return;
    }

    // Jika Supabase belum dikonfigurasi, gunakan fallback lokal
    if (!isSupabaseConfigured) {
      const userData = {
        name: mode === 'register' ? name.trim() : email.split('@')[0] || 'Pengguna',
        email: email.trim(),
        isLoggedIn: true,
        isDemo: false,
        loggedAt: new Date().toISOString(),
      };
      onAuthSuccess(userData);
      return;
    }

    setIsLoading(true);

    try {
      if (mode === 'login') {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        });

        if (signInError) {
          setError(translateAuthError(signInError.message));
          setIsLoading(false);
          return;
        }

        if (data?.user) {
          const userData = {
            id: data.user.id,
            name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'Pengguna',
            email: data.user.email,
            isLoggedIn: true,
            isDemo: false,
            loggedAt: new Date().toISOString(),
          };
          onAuthSuccess(userData);
        }
      } else {
        // Mode Register
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password: password,
          options: {
            data: {
              name: name.trim(),
            },
          },
        });

        if (signUpError) {
          setError(translateAuthError(signUpError.message));
          setIsLoading(false);
          return;
        }

        // Cek apakah langsung dapat session atau butuh konfirmasi email
        if (data?.session && data?.user) {
          const userData = {
            id: data.user.id,
            name: name.trim() || data.user.email?.split('@')[0] || 'Pengguna',
            email: data.user.email,
            isLoggedIn: true,
            isDemo: false,
            loggedAt: new Date().toISOString(),
          };
          onAuthSuccess(userData);
        } else if (data?.user) {
          setSuccessMsg(
            'Akun berhasil dibuat! Silakan cek inbox/spam email kamu untuk konfirmasi, atau jika konfirmasi email dinonaktifkan di Supabase, silakan klik tab Masuk.'
          );
          setMode('login');
        }
      }
    } catch (err) {
      console.error('Auth Exception:', err);
      setError('Terjadi kendala jaringan saat menghubungi server Supabase.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    const demoUser = {
      id: 'demo-user-id',
      name: 'Budi Pratama',
      email: 'budi@icatat.id',
      isLoggedIn: true,
      isDemo: true,
      loggedAt: new Date().toISOString(),
    };
    onAuthSuccess(demoUser);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        {/* Top Back Button */}
        <button
          type="button"
          className="auth-back-btn"
          onClick={onBackToLanding}
          aria-label="Kembali ke Beranda"
        >
          <ArrowLeft size={16} />
          <span>Kembali ke Beranda</span>
        </button>

        {/* Brand */}
        <div className="auth-brand-center">
          <img src="/logo.png" alt="Icatat Logo" style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
          <h2 className="brand-title" style={{ fontSize: '1.5rem', marginTop: '0.4rem' }}>Icatat</h2>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
            {mode === 'login' ? 'Masuk ke akun keuangan Supabase kamu' : 'Daftar akun baru & terhubung ke cloud Supabase'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="type-toggle-container" style={{ margin: '1.25rem 0' }}>
          <button
            type="button"
            className={`type-toggle-btn ${mode === 'login' ? 'active income' : ''}`}
            onClick={() => {
              setMode('login');
              setError('');
              setSuccessMsg('');
            }}
          >
            Masuk
          </button>
          <button
            type="button"
            className={`type-toggle-btn ${mode === 'register' ? 'active income' : ''}`}
            onClick={() => {
              setMode('register');
              setError('');
              setSuccessMsg('');
            }}
          >
            Daftar
          </button>
        </div>

        {/* Success Message Banner */}
        {successMsg && (
          <div className="auth-success-box">
            <CheckCircle2 size={16} className="flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Error Message Banner */}
        {error && (
          <div className="auth-error-box">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem' }}>
          {mode === 'register' && (
            <div className="form-group">
              <label className="form-label">Nama Lengkap</label>
              <div className="auth-input-box">
                <User size={16} className="auth-input-icon" />
                <input
                  type="text"
                  placeholder="Misal: Budi Pratama"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Alamat Email</label>
            <div className="auth-input-box">
              <Mail size={16} className="auth-input-icon" />
              <input
                type="email"
                placeholder="nama@email.com"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="auth-input-box">
              <Lock size={16} className="auth-input-icon" />
              <input
                type="password"
                placeholder="Minimal 6 karakter"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-submit"
            style={{ width: '100%', padding: '0.85rem', marginTop: '0.4rem' }}
            disabled={isLoading}
          >
            {isLoading ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                <Loader2 size={16} className="spin-animate" />
                <span>Memproses...</span>
              </span>
            ) : mode === 'login' ? (
              'Masuk ke Icatat'
            ) : (
              'Daftar Akun Baru'
            )}
          </button>
        </form>

        {/* Quick Demo Access Divider */}
        <div className="auth-divider">
          <span>atau</span>
        </div>

        <button
          type="button"
          className="btn-quick-demo-login"
          onClick={handleDemoLogin}
          disabled={isLoading}
        >
          <Sparkles size={16} color="var(--primary)" />
          <span>Masuk Cepat Akun Demo (1-Klik)</span>
        </button>
      </div>
    </div>
  );
}
