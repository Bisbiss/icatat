import React, { useState, useEffect, useMemo } from 'react';
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

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    } catch (e) {
      console.error('Error saving transactions to localStorage', e);
    }
  }, [transactions]);

  // Toast trigger
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

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
  };

  const handleQuickDemo = () => {
    const demoUser = {
      name: 'Pengguna Demo',
      email: 'demo@icatat.id',
      isLoggedIn: true,
      isDemo: true,
    };
    handleAuthSuccess(demoUser);
  };

  const handleLogout = () => {
    if (window.confirm('Apakah Anda yakin ingin keluar?')) {
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
  };

  const handleDeleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    showToast('Transaksi berhasil dihapus.');
  };

  const handleResetData = () => {
    if (window.confirm('Kembalikan transaksi ke data contoh awal?')) {
      setTransactions(INITIAL_TRANSACTIONS);
      showToast('Data berhasil direset ke contoh awal.');
    }
  };

  const handleClearAllData = () => {
    if (window.confirm('PERINGATAN: Semua riwayat transaksi akan dihapus permanen. Lanjutkan?')) {
      setTransactions([]);
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
