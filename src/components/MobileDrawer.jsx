import React, { useEffect } from 'react';
import {
  X,
  LayoutDashboard,
  ListFilter,
  BarChart3,
  Download,
  RotateCcw,
  Sun,
  Moon,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react';
import { formatRupiah } from '../utils/formatters';

export default function MobileDrawer({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  summary,
  txCount,
  onExportCSV,
  onResetData,
  theme,
  toggleTheme,
}) {
  // Close drawer on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    onClose();
  };

  return (
    <>
      {/* Backdrop Overlay */}
      <div
        className={`drawer-backdrop ${isOpen ? 'open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <aside
        className={`mobile-drawer ${isOpen ? 'open' : ''}`}
        aria-label="Menu Navigasi Mobile"
        role="dialog"
        aria-modal="true"
      >
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="brand-wrapper">
            <img src="/logo.png" alt="Icatat Logo" className="brand-logo-img" />
            <div>
              <span className="brand-title">Icatat</span>
            </div>
          </div>
          <button
            type="button"
            className="drawer-close-btn"
            onClick={onClose}
            aria-label="Tutup Menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="drawer-body">
          {/* Mini Stats Card */}
          <div>
            <div className="drawer-section-title">Ringkasan Saldo</div>
            <div className="drawer-stat-mini">
              <div className="stat-row">
                <span style={{ color: 'var(--text-muted)' }}>Saldo Saat Ini</span>
                <strong style={{ color: summary.balance >= 0 ? 'var(--income)' : 'var(--expense)' }}>
                  {formatRupiah(summary.balance)}
                </strong>
              </div>
              <div className="stat-row">
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--income)' }}>
                  <ArrowUpRight size={14} /> Pemasukan
                </span>
                <span>{formatRupiah(summary.income)}</span>
              </div>
              <div className="stat-row">
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--expense)' }}>
                  <ArrowDownLeft size={14} /> Pengeluaran
                </span>
                <span>{formatRupiah(summary.expense)}</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <div className="drawer-section-title">Menu Utama</div>
            <nav className="drawer-nav-list">
              <button
                type="button"
                className={`drawer-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => handleNavClick('dashboard')}
              >
                <div className="left-part">
                  <LayoutDashboard size={18} />
                  <span>Ringkasan</span>
                </div>
              </button>

              <button
                type="button"
                className={`drawer-nav-item ${activeTab === 'transactions' ? 'active' : ''}`}
                onClick={() => handleNavClick('transactions')}
              >
                <div className="left-part">
                  <ListFilter size={18} />
                  <span>Daftar Transaksi</span>
                </div>
                <span className="drawer-count-badge">{txCount}</span>
              </button>

              <button
                type="button"
                className={`drawer-nav-item ${activeTab === 'analysis' ? 'active' : ''}`}
                onClick={() => handleNavClick('analysis')}
              >
                <div className="left-part">
                  <BarChart3 size={18} />
                  <span>Analisis Kategori</span>
                </div>
              </button>
            </nav>
          </div>

          {/* Actions & Utilities */}
          <div>
            <div className="drawer-section-title">Utilitas & Data</div>
            <nav className="drawer-nav-list">
              <button
                type="button"
                className="drawer-nav-item"
                onClick={() => {
                  onExportCSV();
                  onClose();
                }}
              >
                <div className="left-part">
                  <Download size={18} />
                  <span>Ekspor ke CSV</span>
                </div>
              </button>

              <button
                type="button"
                className="drawer-nav-item"
                style={{ color: 'var(--expense)' }}
                onClick={() => {
                  onResetData();
                  onClose();
                }}
              >
                <div className="left-part">
                  <RotateCcw size={18} />
                  <span>Reset Data Contoh</span>
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="drawer-footer">
          <button
            type="button"
            className="drawer-nav-item"
            style={{ justifyContent: 'space-between', background: 'var(--bg-subtle)' }}
            onClick={toggleTheme}
          >
            <div className="left-part">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              <span>{theme === 'dark' ? 'Mode Terang' : 'Mode Gelap'}</span>
            </div>
          </button>
          <div style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Icatat v1.0 • Cepat & Simpel
          </div>
        </div>
      </aside>
    </>
  );
}
