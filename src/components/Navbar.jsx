import React from 'react';
import { Menu, Plus, Sun, Moon, Wallet, BarChart3, ListFilter, LayoutDashboard } from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  onOpenDrawer,
  onOpenAddModal,
  theme,
  toggleTheme,
}) {
  return (
    <header className="navbar-header">
      <div className="navbar-inner">
        {/* Brand / Logo */}
        <div className="brand-wrapper" onClick={() => setActiveTab('dashboard')}>
          <img src="/logo.png" alt="Icatat Logo" className="brand-logo-img" />
          <div>
            <span className="brand-title">Icatat</span>
            <span className="brand-tagline">Keuangan Cepat</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="desktop-nav" aria-label="Navigasi Utama">
          <button
            type="button"
            className={`nav-item-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard size={16} />
            Ringkasan
          </button>
          <button
            type="button"
            className={`nav-item-btn ${activeTab === 'transactions' ? 'active' : ''}`}
            onClick={() => setActiveTab('transactions')}
          >
            <ListFilter size={16} />
            Transaksi
          </button>
          <button
            type="button"
            className={`nav-item-btn ${activeTab === 'analysis' ? 'active' : ''}`}
            onClick={() => setActiveTab('analysis')}
          >
            <BarChart3 size={16} />
            Analisis
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="nav-actions">
          {/* Theme Toggle Button */}
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
            aria-label="Toggle tema gelap atau terang"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Add Transaction Button */}
          <button
            type="button"
            className="btn-primary-add"
            onClick={onOpenAddModal}
            title="Catat transaksi baru"
          >
            <Plus size={18} />
            <span>Catat Transaksi</span>
          </button>

          {/* Hamburger Menu Toggle (Mobile) */}
          <button
            type="button"
            className="hamburger-btn"
            onClick={onOpenDrawer}
            aria-label="Buka Menu Drawer"
            title="Buka Menu"
          >
            <Menu size={22} />
          </button>
        </div>
      </div>
    </header>
  );
}
