import React, { useState } from 'react';
import { ArrowLeft, Lock, Mail, User, Sparkles, CheckCircle2 } from 'lucide-react';

export default function AuthPage({ initialMode = 'login', onAuthSuccess, onBackToLanding }) {
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Silakan isi email dan password.');
      return;
    }

    if (mode === 'register' && !name.trim()) {
      setError('Silakan masukkan nama lengkap Anda.');
      return;
    }

    const userData = {
      name: mode === 'register' ? name.trim() : email.split('@')[0] || 'Pengguna',
      email: email.trim(),
      isLoggedIn: true,
      loggedAt: new Date().toISOString(),
    };

    onAuthSuccess(userData);
  };

  const handleDemoLogin = () => {
    const demoUser = {
      name: 'Budi Pratama',
      email: 'budi@icatat.id',
      isLoggedIn: true,
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
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            {mode === 'login' ? 'Masuk ke dashboard keuangan Anda' : 'Buat akun baru gratis & instan'}
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
            }}
          >
            Daftar
          </button>
        </div>

        {error && (
          <div className="auth-error-box">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
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
                  required
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email</label>
            <div className="auth-input-box">
              <Mail size={16} className="auth-input-icon" />
              <input
                type="email"
                placeholder="nama@email.com"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                placeholder="••••••••"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-submit"
            style={{ width: '100%', padding: '0.8rem', marginTop: '0.5rem' }}
          >
            {mode === 'login' ? 'Masuk ke Icatat' : 'Daftar Akun Baru'}
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
        >
          <Sparkles size={16} color="var(--primary)" />
          <span>Masuk Cepat Akun Demo (1-Klik)</span>
        </button>
      </div>
    </div>
  );
}
