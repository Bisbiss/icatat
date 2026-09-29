import React from 'react';
import { ArrowRight, Zap, ShieldCheck, BarChart2, CheckCircle, Wallet, Sparkles } from 'lucide-react';
import { formatRupiah } from '../utils/formatters';

export default function LandingPage({ onGoToAuth, onQuickDemo, summary }) {
  return (
    <div className="landing-wrapper">
      {/* Top Navbar */}
      <header className="landing-header">
        <div className="landing-header-inner">
          <div className="brand-wrapper">
            <img src="/logo.png" alt="Icatat Logo" className="brand-logo-img" />
            <div>
              <span className="brand-title">Icatat</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              type="button"
              className="btn-secondary"
              style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
              onClick={() => onGoToAuth('login')}
            >
              Masuk
            </button>
            <button
              type="button"
              className="btn-primary-add"
              style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
              onClick={onQuickDemo}
            >
              <span>Buka Demo</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="hero-content">
          <div className="hero-pill-badge">
            <Sparkles size={14} color="var(--primary)" />
            <span>Pencatatan Keuangan Cepat & Simpel</span>
          </div>

          <h1 className="hero-heading">
            Kelola Keuangan Anda <br />
            <span className="highlight-text">Lebih Nyata & Tanpa Ribet</span>
          </h1>

          <p className="hero-subtitle">
            Catat pemasukan dan pengeluaran dalam hitungan detik. Dilengkapi infografik
            keuangan cerdas, navigasi bottom bar yang nyaman di ponsel, dan 100% data tersimpan di perangkat Anda.
          </p>

          <div className="hero-cta-group">
            <button
              type="button"
              className="btn-hero-primary"
              onClick={() => onGoToAuth('register')}
            >
              Mulai Gratis Sekarang
              <ArrowRight size={18} />
            </button>
            <button
              type="button"
              className="btn-hero-secondary"
              onClick={onQuickDemo}
            >
              Eksplorasi Dashboard
            </button>
          </div>

          {/* Quick trust metrics */}
          <div className="hero-checks-row">
            <div className="check-item">
              <CheckCircle size={15} color="var(--primary)" />
              <span>Tanpa Iklan</span>
            </div>
            <div className="check-item">
              <CheckCircle size={15} color="var(--primary)" />
              <span>Offline & Cepat</span>
            </div>
            <div className="check-item">
              <CheckCircle size={15} color="var(--primary)" />
              <span>Mobile-First Bottom Bar</span>
            </div>
          </div>
        </div>

        {/* Hero Interactive Preview Card */}
        <div className="hero-preview-box">
          <div className="preview-card-inner">
            <div className="preview-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <img src="/logo.png" alt="Icatat" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
                <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>Live Dashboard Preview</span>
              </div>
              <span className="live-dot-badge">Aktif</span>
            </div>

            <div className="preview-stat-main">
              <div style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.8)' }}>Saldo Dompet Utama</div>
              <div style={{ fontSize: '1.75rem', fontWeight: '800', margin: '4px 0' }}>
                {formatRupiah(summary.balance)}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.85)' }}>
                Arus kas positif bulan ini
              </div>
            </div>

            <div className="preview-mini-grid">
              <div className="mini-box income">
                <span className="mini-title">Pemasukan</span>
                <span className="mini-amt">{formatRupiah(summary.income)}</span>
              </div>
              <div className="mini-box expense">
                <span className="mini-title">Pengeluaran</span>
                <span className="mini-amt">{formatRupiah(summary.expense)}</span>
              </div>
            </div>

            <div className="preview-action-row">
              <button
                type="button"
                className="btn-preview-demo"
                onClick={onQuickDemo}
              >
                Coba Langsung di Dashboard &rarr;
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="landing-features">
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrap">
              <Zap size={22} color="var(--primary)" />
            </div>
            <h3>Input Kilat 3 Detik</h3>
            <p>
              Dengan shortcut nominal (+10rb, +50rb, +100rb) dan pemilih kategori berkode warna,
              mencatat tidak pernah sesederhana ini.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrap">
              <BarChart2 size={22} color="var(--primary)" />
            </div>
            <h3>Infografik & Laporan</h3>
            <p>
              Pahami ke mana perginya uang Anda lewat diagram distribusi pengeluaran, sumber
              pemasukan, dan perhitungan persentase tabungan.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrap">
              <ShieldCheck size={22} color="var(--primary)" />
            </div>
            <h3>Aman & Sepenuhnya Privat</h3>
            <p>
              Data keuangan Anda disimpan secara lokal di perangkat Anda. Anda dapat mengekspor
              laporan ke Excel/CSV kapan saja.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div>&copy; {new Date().getFullYear()} <strong>Icatat</strong>. Dibuat simpel, cepat, dan responsif.</div>
      </footer>
    </div>
  );
}
