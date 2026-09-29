import React from 'react';
import {
  User,
  Sun,
  Moon,
  Download,
  RotateCcw,
  Trash2,
  LogOut,
  ShieldCheck,
  CreditCard,
  ChevronRight,
  Info,
} from 'lucide-react';

export default function SettingView({
  user,
  onLogout,
  theme,
  toggleTheme,
  onExportCSV,
  onResetData,
  onClearAllData,
}) {
  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="setting-view-wrapper">
      <div className="section-header-row" style={{ marginBottom: '1.25rem' }}>
        <div>
          <h2 className="section-title">Pengaturan</h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Kelola preferensi akun, tampilan, dan data Anda
          </p>
        </div>
      </div>

      {/* User Profile Card */}
      <div className="analysis-card" style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="setting-avatar-circle">
            {userInitial}
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '700' }}>{user?.name || 'Pengguna Icatat'}</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{user?.email || 'user@icatat.id'}</p>
          </div>
          <span className="badge-active-status">Akun Aktif</span>
        </div>
      </div>

      {/* Section: Tampilan & Preferensi */}
      <div className="analysis-card" style={{ marginBottom: '1.25rem' }}>
        <h4 className="setting-group-title">Tampilan & Sistem</h4>

        <div className="setting-item-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="setting-icon-pill">
              {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
            </div>
            <div>
              <div style={{ fontWeight: '600', fontSize: '0.92rem' }}>Mode Tampilan</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {theme === 'dark' ? 'Tema Gelap aktif' : 'Tema Terang aktif'}
              </div>
            </div>
          </div>

          <button
            type="button"
            className="btn-secondary"
            onClick={toggleTheme}
            style={{ padding: '0.45rem 0.9rem', fontSize: '0.82rem' }}
          >
            {theme === 'dark' ? 'Ganti ke Terang' : 'Ganti ke Gelap'}
          </button>
        </div>

        <div className="setting-item-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="setting-icon-pill">
              <CreditCard size={18} />
            </div>
            <div>
              <div style={{ fontWeight: '600', fontSize: '0.92rem' }}>Mata Uang</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Rupiah Indonesia (IDR - Rp)
              </div>
            </div>
          </div>
          <span style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-muted)' }}>IDR</span>
        </div>
      </div>

      {/* Section: Manajemen Data */}
      <div className="analysis-card" style={{ marginBottom: '1.25rem' }}>
        <h4 className="setting-group-title">Manajemen Data</h4>

        <button
          type="button"
          className="setting-action-row-btn"
          onClick={onExportCSV}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="setting-icon-pill">
              <Download size={18} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: '600', fontSize: '0.92rem' }}>Cadangkan / Ekspor Data</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Unduh file spreadsheet transaksi (.CSV)
              </div>
            </div>
          </div>
          <ChevronRight size={18} color="var(--text-muted)" />
        </button>

        <button
          type="button"
          className="setting-action-row-btn"
          onClick={onResetData}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="setting-icon-pill">
              <RotateCcw size={18} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: '600', fontSize: '0.92rem' }}>Reset ke Data Contoh</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Kembalikan riwayat transaksi sampel awal
              </div>
            </div>
          </div>
          <ChevronRight size={18} color="var(--text-muted)" />
        </button>

        <button
          type="button"
          className="setting-action-row-btn"
          style={{ color: 'var(--expense)' }}
          onClick={onClearAllData}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="setting-icon-pill" style={{ background: 'var(--expense-bg)', color: 'var(--expense)' }}>
              <Trash2 size={18} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: '600', fontSize: '0.92rem' }}>Kosongkan Semua Transaksi</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Hapus semua catatan keuangan tanpa sisa
              </div>
            </div>
          </div>
          <ChevronRight size={18} color="var(--expense)" />
        </button>
      </div>

      {/* Section: Logout */}
      <div className="analysis-card" style={{ marginBottom: '2rem' }}>
        <button
          type="button"
          className="btn-logout-full"
          onClick={onLogout}
        >
          <LogOut size={18} />
          <span>Keluar dari Akun (Logout)</span>
        </button>
      </div>

      {/* Footer Info */}
      <div style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)', paddingBottom: '1rem' }}>
        <p>Icatat • Pencatatan Keuangan Cepat & Simpel</p>
        <p style={{ marginTop: '0.2rem' }}>Versi 1.2.0 • Data tersimpan lokal di perangkat</p>
      </div>
    </div>
  );
}
