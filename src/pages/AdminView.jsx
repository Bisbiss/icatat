import React, { useState, useEffect, useCallback } from 'react';
import {
  ArrowLeft,
  Users,
  UserPlus,
  Receipt,
  Wallet,
  Search,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  ChevronRight,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { formatRupiah, formatDateIndo } from '../utils/formatters';

// Batas keamanan: penegakan akses yang sebenarnya ada di RLS Supabase
// (policy "Admin dapat melihat semua profil/transaksi"). Pengecekan di sini
// hanya untuk UX — menyembunyikan panel dari non-admin lebih awal.
export default function AdminView({ onBack, currentUserId }) {
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [error, setError] = useState(null);

  const [users, setUsers] = useState([]);
  const [txByUser, setTxByUser] = useState({});
  const [search, setSearch] = useState('');

  const [selectedUser, setSelectedUser] = useState(null);
  const [detailTx, setDetailTx] = useState([]);
  const [detailLoading, setDetailLoading] = useState(false);

  const loadAdminData = useCallback(async () => {
    if (!isSupabaseConfigured || !currentUserId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Pastikan yang membuka halaman ini memang admin
      const { data: me, error: meError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', currentUserId)
        .single();

      if (meError || me?.role !== 'admin') {
        setAccessDenied(true);
        setLoading(false);
        return;
      }

      // 2. Ambil semua profil + agregat transaksi ringan (paralel)
      const [{ data: profiles, error: profilesError }, { data: txRows, error: txError }] =
        await Promise.all([
          supabase
            .from('profiles')
            .select('id, name, email, created_at, role')
            .order('created_at', { ascending: false }),
          supabase.from('transactions').select('user_id, type, amount'),
        ]);

      if (profilesError) throw profilesError;
      if (txError) throw txError;

      const agg = {};
      for (const t of txRows || []) {
        const u = agg[t.user_id] || { count: 0, income: 0, expense: 0 };
        u.count += 1;
        const amt = Number(t.amount) || 0;
        if (t.type === 'income') u.income += amt;
        else u.expense += amt;
        agg[t.user_id] = u;
      }

      setUsers(profiles || []);
      setTxByUser(agg);
    } catch (err) {
      console.error('[Admin] Gagal memuat data:', err);
      setError('Gagal memuat data admin. Pastikan migrasi 002_admin_dashboard.sql sudah dijalankan di Supabase.');
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);

  useEffect(() => {
    loadAdminData();
  }, [loadAdminData]);

  const openUserDetail = async (u) => {
    setSelectedUser(u);
    setDetailTx([]);
    setDetailLoading(true);
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('id, type, category, amount, note, date')
        .eq('user_id', u.id)
        .order('date', { ascending: false })
        .limit(50);
      if (error) throw error;
      setDetailTx(data || []);
    } catch (err) {
      console.error('[Admin] Gagal memuat detail user:', err);
    } finally {
      setDetailLoading(false);
    }
  };

  // ---- Statistik global ----
  const sevenDaysAgo = React.useMemo(() => Date.now() - 7 * 24 * 60 * 60 * 1000, []);
  const totalUsers = users.length;
  const newUsers7d = users.filter((u) => new Date(u.created_at).getTime() >= sevenDaysAgo).length;
  const totalTx = Object.values(txByUser).reduce((a, u) => a + u.count, 0);
  const totalVolume = Object.values(txByUser).reduce((a, u) => a + u.income + u.expense, 0);

  const filteredUsers = users.filter((u) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      (u.name || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q)
    );
  });

  const statCards = [
    { icon: Users, label: 'Total Pengguna', value: totalUsers.toLocaleString('id-ID'), color: 'var(--primary)', bg: 'var(--primary-light)' },
    { icon: UserPlus, label: 'Baru (7 hari)', value: newUsers7d.toLocaleString('id-ID'), color: '#0284c7', bg: 'rgba(2,132,199,0.12)' },
    { icon: Receipt, label: 'Total Transaksi', value: totalTx.toLocaleString('id-ID'), color: '#d97706', bg: 'rgba(217,119,6,0.12)' },
    { icon: Wallet, label: 'Volume Transaksi', value: formatRupiah(totalVolume), color: 'var(--income)', bg: 'var(--income-bg)' },
  ];

  // ---- Render states ----
  if (!isSupabaseConfigured) {
    return (
      <AdminShell onBack={onBack} title="Panel Admin">
        <div className="analysis-card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
          <ShieldAlert size={40} color="var(--text-muted)" style={{ marginBottom: '0.75rem' }} />
          <h3 style={{ fontWeight: '700', marginBottom: '0.5rem' }}>Supabase belum terhubung</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Panel admin membutuhkan koneksi Supabase. Isi kredensial di file .env terlebih dahulu.
          </p>
        </div>
      </AdminShell>
    );
  }

  if (loading) {
    return (
      <AdminShell onBack={onBack} title="Panel Admin">
        <div className="analysis-card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <Loader2 size={32} className="spin-animate" color="var(--primary)" />
          <p style={{ marginTop: '0.75rem', color: 'var(--text-muted)', fontSize: '0.88rem' }}>Memuat data admin…</p>
        </div>
      </AdminShell>
    );
  }

  if (accessDenied) {
    return (
      <AdminShell onBack={onBack} title="Panel Admin">
        <div className="analysis-card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
          <ShieldAlert size={40} color="var(--expense)" style={{ marginBottom: '0.75rem' }} />
          <h3 style={{ fontWeight: '700', marginBottom: '0.5rem' }}>Akses ditolak</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Akun ini tidak memiliki hak akses admin. Hubungi pemilik aplikasi jika ini sebuah kesalahan.
          </p>
        </div>
      </AdminShell>
    );
  }

  if (error) {
    return (
      <AdminShell onBack={onBack} title="Panel Admin">
        <div className="analysis-card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
          <ShieldAlert size={40} color="var(--expense)" style={{ marginBottom: '0.75rem' }} />
          <h3 style={{ fontWeight: '700', marginBottom: '0.5rem' }}>Terjadi kesalahan</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{error}</p>
          <button type="button" className="btn-secondary" onClick={loadAdminData} style={{ marginTop: '1rem' }}>
            Coba lagi
          </button>
        </div>
      </AdminShell>
    );
  }

  const detailAgg = selectedUser ? txByUser[selectedUser.id] || { count: 0, income: 0, expense: 0 } : null;

  return (
    <AdminShell onBack={onBack} title="Panel Admin">
      {/* Badge admin */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <span className="badge-active-status" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
          <ShieldCheck size={14} style={{ marginRight: '0.3rem', verticalAlign: '-2px' }} />
          Mode Administrator
        </span>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Data read-only — aman untuk dilihat</span>
      </div>

      {/* Kartu Statistik */}
      <div className="admin-stats-grid">
        {statCards.map((s) => (
          <div key={s.label} className="analysis-card admin-stat-card">
            <div className="setting-icon-pill" style={{ background: s.bg, color: s.color, marginBottom: '0.6rem' }}>
              <s.icon size={20} />
            </div>
            <div className="admin-stat-value">{s.value}</div>
            <div className="admin-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Daftar Pengguna */}
      <div className="analysis-card" style={{ marginTop: '1.25rem' }}>
        <div className="section-header-row" style={{ marginBottom: '1rem' }}>
          <h3 className="section-title" style={{ fontSize: '1rem' }}>
            Pengguna ({filteredUsers.length})
          </h3>
        </div>

        <div className="admin-search-box">
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Cari nama atau email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Cari pengguna"
          />
        </div>

        {filteredUsers.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', padding: '1.5rem 0' }}>
            {search ? 'Tidak ada pengguna yang cocok.' : 'Belum ada pengguna terdaftar.'}
          </p>
        ) : (
          <div className="admin-user-list">
            {filteredUsers.map((u) => {
              const agg = txByUser[u.id] || { count: 0, income: 0, expense: 0 };
              const initial = (u.name || u.email || 'U').charAt(0).toUpperCase();
              return (
                <button
                  key={u.id}
                  type="button"
                  className={`admin-user-row${selectedUser?.id === u.id ? ' active' : ''}`}
                  onClick={() => openUserDetail(u)}
                >
                  <div className="setting-avatar-circle" style={{ width: '2.6rem', height: '2.6rem', fontSize: '1rem' }}>
                    {initial}
                  </div>
                  <div style={{ flex: 1, textAlign: 'left', minWidth: 0 }}>
                    <div style={{ fontWeight: '600', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {u.name || '(tanpa nama)'}
                      </span>
                      {u.role === 'admin' && (
                        <span className="badge-active-status" style={{ background: 'var(--primary-light)', color: 'var(--primary)', fontSize: '0.65rem', padding: '0.1rem 0.45rem' }}>
                          ADMIN
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {u.email || '-'} • {agg.count} transaksi
                    </div>
                  </div>
                  <ChevronRight size={18} color="var(--text-muted)" />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail Pengguna */}
      {selectedUser && (
        <div className="analysis-card" style={{ marginTop: '1.25rem' }}>
          <div className="section-header-row" style={{ marginBottom: '1rem' }}>
            <div>
              <h3 className="section-title" style={{ fontSize: '1rem' }}>{selectedUser.name || '(tanpa nama)'}</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {selectedUser.email} • Bergabung {formatDateIndo(selectedUser.created_at)}
              </p>
            </div>
            <button type="button" className="btn-secondary" onClick={() => setSelectedUser(null)} style={{ fontSize: '0.78rem', padding: '0.4rem 0.8rem' }}>
              Tutup
            </button>
          </div>

          {detailAgg && (
            <div className="admin-detail-stats">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--income)', fontWeight: '700' }}>
                  <TrendingUp size={15} /> {formatRupiah(detailAgg.income)}
                </div>
                <div className="admin-stat-label">Total pemasukan</div>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--expense)', fontWeight: '700' }}>
                  <TrendingDown size={15} /> {formatRupiah(detailAgg.expense)}
                </div>
                <div className="admin-stat-label">Total pengeluaran</div>
              </div>
              <div>
                <div style={{ fontWeight: '700' }}>{detailAgg.count} transaksi</div>
                <div className="admin-stat-label">50 terakhir ditampilkan</div>
              </div>
            </div>
          )}

          {detailLoading ? (
            <div style={{ textAlign: 'center', padding: '1.5rem' }}>
              <Loader2 size={24} className="spin-animate" color="var(--primary)" />
            </div>
          ) : detailTx.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', padding: '1rem 0' }}>
              Pengguna ini belum memiliki transaksi.
            </p>
          ) : (
            <div className="admin-tx-list">
              {detailTx.map((t) => (
                <div key={t.id} className="admin-tx-row">
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: '600', fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {t.note || t.category}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {formatDateIndo(t.date)} • {t.category}
                    </div>
                  </div>
                  <div style={{
                    fontWeight: '700',
                    fontSize: '0.88rem',
                    color: t.type === 'income' ? 'var(--income)' : 'var(--expense)',
                  }}>
                    {t.type === 'income' ? '+' : '−'}{formatRupiah(Number(t.amount) || 0)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Catatan */}
      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '1.25rem', lineHeight: 1.6 }}>
        Tindakan sensitif (ban user, hapus akun, reset password) membutuhkan service_role key dan tidak
        tersedia di panel ini demi keamanan. Hubungi developer jika diperlukan.
      </p>
    </AdminShell>
  );
}

function AdminShell({ onBack, title, children }) {
  return (
    <>
      <header className="navbar-header">
        <div className="navbar-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              type="button"
              className="theme-toggle-btn"
              onClick={onBack}
              aria-label="Kembali"
              title="Kembali"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <span className="brand-title" style={{ fontSize: '1rem' }}>{title}</span>
              <span className="brand-tagline">Kelola pengguna Icatat</span>
            </div>
          </div>
        </div>
      </header>
      <main className="app-container admin-view-wrapper">
        {children}
      </main>
    </>
  );
}
