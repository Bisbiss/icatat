import React, { useState, useEffect, useMemo, useCallback } from 'react';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardView from './pages/DashboardView';
import TransactionView from './pages/TransactionView';
import ReportView from './pages/ReportView';
import SettingView from './pages/SettingView';
import BottomNav from './components/BottomNav';
import TransactionModal from './components/TransactionModal';
import { INITIAL_TRANSACTIONS } from './data/categories';
import { downloadCSV } from './utils/formatters';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { CheckCircle2, Sun, Moon, LogOut } from 'lucide-react';

const STORAGE_KEY = 'icatat_transactions_data';
const THEME_KEY = 'icatat_theme_mode';
const USER_KEY = 'icatat_user_session';

export default function App() {
  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(THEME_KEY) || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // User Auth State
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem(USER_KEY);
      if (savedUser) return JSON.parse(savedUser);
    } catch (e) {
      console.error('Error reading user session', e);
    }
    return null;
  });

  // Current top-level view: 'landing' | 'auth' | 'app'
  const [view, setView] = useState(() => {
    const savedUser = localStorage.getItem(USER_KEY);
    return savedUser ? 'app' : 'landing';
  });

  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'

  // Dashboard Active Tab: 'dashboard' | 'transaksi' | 'report' | 'setting'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Transactions state
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading stored transactions', e);
    }
    return INITIAL_TRANSACTIONS;
  });

  // Toast trigger
  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  }, []);

  // Sinkronisasi data transaksi dari Supabase jika user logged in
  const loadSupabaseTransactions = useCallback(async (userId) => {
    if (!isSupabaseConfigured || !userId) return;

    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (error) {
        if (error.code === 'PGRST205') {
          console.warn('[Supabase] Tabel "transactions" belum dibuat di database.');
        } else {
          console.warn('[Supabase] Gagal mengambil data transaksi:', error.message);
        }
        return;
      }

      if (data) {
        const mapped = data.map((t) => ({
          ...t,
          amount: Number(t.amount) || 0,
        }));
        setTransactions(mapped);
      }
    } catch (err) {
      console.error('[Supabase] Error loading transactions:', err);
    }
  }, []);

  // Supabase Auth listener & Session restore
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    // 1. Ambil session aktif saat aplikasi dibuka
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const supaUser = {
          id: session.user.id,
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Pengguna',
          email: session.user.email,
          isLoggedIn: true,
          isDemo: false,
        };
        setUser(supaUser);
        localStorage.setItem(USER_KEY, JSON.stringify(supaUser));
        setView('app');
        loadSupabaseTransactions(session.user.id);
      }
    });

    // 2. Dengarkan perubahan status login/logout secara realtime
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const supaUser = {
          id: session.user.id,
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Pengguna',
          email: session.user.email,
          isLoggedIn: true,
          isDemo: false,
        };
        setUser(supaUser);
        localStorage.setItem(USER_KEY, JSON.stringify(supaUser));
        setView('app');
        loadSupabaseTransactions(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        localStorage.removeItem(USER_KEY);
        setView('landing');
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [loadSupabaseTransactions]);

  // Simpan transaksi lokal sebagai cache
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    } catch (e) {
      console.error('Error saving transactions to localStorage', e);
    }
  }, [transactions]);

  // Financial summary calculations
  const summary = useMemo(() => {
    let income = 0;
    let expense = 0;
    let incomeCount = 0;
    let expenseCount = 0;

    for (const tx of transactions) {
      if (tx.type === 'income') {
        income += tx.amount;
        incomeCount++;
      } else {
        expense += tx.amount;
        expenseCount++;
      }
    }

    return {
      balance: income - expense,
      income,
      expense,
      incomeCount,
      expenseCount,
    };
  }, [transactions]);

  // Auth Handlers
  const handleAuthSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    setView('app');
    setActiveTab('dashboard');
    showToast(`Selamat datang, ${userData.name}!`);

    if (userData.id && !userData.isDemo) {
      loadSupabaseTransactions(userData.id);
    }
  };

  const handleQuickDemo = () => {
    const demoUser = {
      id: 'demo-user-id',
      name: 'Pengguna Demo',
      email: 'demo@icatat.id',
      isLoggedIn: true,
      isDemo: true,
    };
    handleAuthSuccess(demoUser);
  };

  const handleLogout = async () => {
    if (window.confirm('Apakah Anda yakin ingin keluar?')) {
      if (isSupabaseConfigured && user && !user.isDemo) {
        try {
          await supabase.auth.signOut();
        } catch (err) {
          console.error('Error signing out of Supabase:', err);
        }
      }
      setUser(null);
      localStorage.removeItem(USER_KEY);
      setView('landing');
      showToast('Anda telah keluar.');
    }
  };

  // Transaction Actions
  const handleAddTransaction = (newTx) => {
    setTransactions((prev) => [newTx, ...prev]);
    showToast(`Transaksi "${newTx.note}" berhasil dicatat!`);

    // Sinkronisasi ke Supabase jika login sebagai user cloud
    if (user && !user.isDemo && isSupabaseConfigured && user.id) {
      supabase
        .from('transactions')
        .insert([
          {
            id: newTx.id,
            user_id: user.id,
            type: newTx.type,
            category: newTx.category,
            amount: newTx.amount,
            note: newTx.note,
            date: newTx.date,
          },
        ])
        .then(({ error }) => {
          if (error) {
            console.warn('[Supabase] Gagal menyimpan transaksi ke database:', error);
            if (error.code === 'PGRST205') {
              showToast('Perhatian: Tabel "transactions" belum dibuat di Supabase. Data disimpan di lokal browser.');
            }
          }
        });
    }
  };

  const handleDeleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    showToast('Transaksi berhasil dihapus.');

    if (user && !user.isDemo && isSupabaseConfigured) {
      supabase
        .from('transactions')
        .delete()
        .eq('id', id)
        .then(({ error }) => {
          if (error) {
            console.warn('[Supabase] Gagal menghapus transaksi dari database:', error);
          }
        });
    }
  };

  const handleResetData = () => {
    if (window.confirm('Kembalikan transaksi ke data contoh awal?')) {
      setTransactions(INITIAL_TRANSACTIONS);
      showToast('Data berhasil direset ke contoh awal.');
    }
  };

  const handleClearAllData = async () => {
    if (window.confirm('PERINGATAN: Semua riwayat transaksi akan dihapus permanen. Lanjutkan?')) {
      setTransactions([]);
      if (user && !user.isDemo && isSupabaseConfigured && user.id) {
        await supabase.from('transactions').delete().eq('user_id', user.id);
      }
      showToast('Semua transaksi telah dikosongkan.');
    }
  };

  const handleExportCSV = () => {
    if (transactions.length === 0) {
      showToast('Tidak ada data transaksi untuk diekspor.');
      return;
    }
    downloadCSV(transactions);
    showToast('Laporan CSV berhasil diunduh!');
  };

  // 1. Landing Page View
  if (view === 'landing') {
    return (
      <>
        <LandingPage
          onGoToAuth={(mode) => {
            setAuthMode(mode);
            setView('auth');
          }}
          onQuickDemo={handleQuickDemo}
          summary={summary}
        />
        {toastMessage && (
          <div className="toast-container" role="status">
            <CheckCircle2 size={18} color="#16a34a" />
            <span>{toastMessage}</span>
          </div>
        )}
      </>
    );
  }

  // 2. Auth Page View
  if (view === 'auth') {
    return (
      <>
        <AuthPage
          initialMode={authMode}
          onAuthSuccess={handleAuthSuccess}
          onBackToLanding={() => setView('landing')}
        />
        {toastMessage && (
          <div className="toast-container" role="status">
            <CheckCircle2 size={18} color="#16a34a" />
            <span>{toastMessage}</span>
          </div>
        )}
      </>
    );
  }

  // 3. Main Dashboard Application (with Bottom Navigation Bar)
  return (
    <>
      {/* Top Header */}
      <header className="navbar-header">
        <div className="navbar-inner">
          <div className="brand-wrapper" onClick={() => setActiveTab('dashboard')}>
            <img src="/logo.png" alt="Icatat Logo" className="brand-logo-img" />
            <div>
              <span className="brand-title">Icatat</span>
              <span className="brand-tagline">Keuangan Cepat</span>
            </div>
          </div>

          <div className="nav-actions">
            <button
              type="button"
              className="theme-toggle-btn"
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
              aria-label="Toggle tema gelap atau terang"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button
              type="button"
              className="theme-toggle-btn"
              onClick={handleLogout}
              title="Keluar"
              aria-label="Keluar dari akun"
            >
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="app-container" style={{ paddingBottom: '6rem' }}>
        {activeTab === 'dashboard' && (
          <DashboardView
            summary={summary}
            transactions={transactions}
            onGoToTransactions={() => setActiveTab('transaksi')}
            onGoToReport={() => setActiveTab('report')}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            user={user}
          />
        )}

        {activeTab === 'transaksi' && (
          <TransactionView
            transactions={transactions}
            onDeleteTransaction={handleDeleteTransaction}
            onOpenAddModal={() => setIsAddModalOpen(true)}
          />
        )}

        {activeTab === 'report' && (
          <ReportView
            transactions={transactions}
            summary={summary}
            onExportCSV={handleExportCSV}
          />
        )}

        {activeTab === 'setting' && (
          <SettingView
            user={user}
            onLogout={handleLogout}
            theme={theme}
            toggleTheme={toggleTheme}
            onExportCSV={handleExportCSV}
            onResetData={handleResetData}
            onClearAllData={handleClearAllData}
          />
        )}
      </main>

      {/* Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      {/* Quick Add Modal */}
      <TransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddTransaction={handleAddTransaction}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-container" role="status">
          <CheckCircle2 size={18} color="#16a34a" />
          <span>{toastMessage}</span>
        </div>
      )}
    </>
  );
}
