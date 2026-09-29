import React from 'react';
import SummaryCards from '../components/SummaryCards';
import { formatRupiah, formatDateIndo, getCategoryMeta } from '../utils/formatters';
import CategoryIcon from '../components/CategoryIcon';
import { ArrowRight, TrendingUp, TrendingDown, Plus, BarChart2, PieChart } from 'lucide-react';

export default function DashboardView({
  summary,
  transactions,
  onGoToTransactions,
  onOpenAddModal,
  onGoToReport,
  user,
}) {
  // Top 5 recent transactions
  const recentTransactions = [...transactions]
    .sort((a, b) => {
      if (a.date !== b.date) return new Date(b.date) - new Date(a.date);
      return (b.createdAt || 0) - (a.createdAt || 0);
    })
    .slice(0, 5);

  // Calculate expense breakdown for the infographic
  const expenses = transactions.filter((t) => t.type === 'expense');
  const totalExpense = expenses.reduce((acc, t) => acc + t.amount, 0);
  const totalIncome = summary.income;

  const topCategoryMap = expenses.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {});

  const topCategories = Object.entries(topCategoryMap)
    .map(([catId, amount]) => {
      const meta = getCategoryMeta(catId, 'expense');
      const percent = totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0;
      return { id: catId, name: meta.name, color: meta.color, bg: meta.bg, icon: meta.icon, amount, percent };
    })
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 3);

  // Cashflow ratio calculation for the visual infographic
  const totalFlow = totalIncome + totalExpense;
  const incomePercent = totalFlow > 0 ? Math.round((totalIncome / totalFlow) * 100) : 50;
  const expensePercent = totalFlow > 0 ? 100 - incomePercent : 50;

  return (
    <div className="dashboard-view-wrapper">
      {/* Top Greeting */}
      <div className="dashboard-greeting-bar">
        <div>
          <h2 className="greeting-title">Halo, {user?.name || 'Kawan'} 👋</h2>
          <p className="greeting-sub">Berikut ringkasan kondisi keuangan terkini Anda</p>
        </div>
        <button
          type="button"
          className="btn-primary-add"
          onClick={onOpenAddModal}
        >
          <Plus size={16} />
          <span>Catat</span>
        </button>
      </div>

      {/* 3 Main Summary Cards */}
      <SummaryCards summary={summary} />

      {/* Infografik Arus Kas (Income vs Expense Ratio) */}
      <div className="analysis-card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700' }}>
            <BarChart2 size={18} color="var(--primary)" />
            <span>Infografik Arus Kas</span>
          </div>
          <button
            type="button"
            className="text-link-btn"
            onClick={onGoToReport}
          >
            Detail Report &rarr;
          </button>
        </div>

        {/* Visual Dual-Bar */}
        <div className="infographic-bar-container">
          <div
            className="infographic-bar-segment income"
            style={{ width: `${incomePercent}%` }}
            title={`Pemasukan: ${incomePercent}%`}
          >
            {incomePercent > 15 && `${incomePercent}%`}
          </div>
          <div
            className="infographic-bar-segment expense"
            style={{ width: `${expensePercent}%` }}
            title={`Pengeluaran: ${expensePercent}%`}
          >
            {expensePercent > 15 && `${expensePercent}%`}
          </div>
        </div>

        <div className="infographic-legend-row">
          <div className="legend-item">
            <span className="legend-dot income" />
            <span style={{ color: 'var(--text-muted)' }}>Pemasukan:</span>
            <strong>{formatRupiah(totalIncome)}</strong>
          </div>
          <div className="legend-item">
            <span className="legend-dot expense" />
            <span style={{ color: 'var(--text-muted)' }}>Pengeluaran:</span>
            <strong>{formatRupiah(totalExpense)}</strong>
          </div>
        </div>
      </div>

      {/* Top Spending Categories Preview */}
      {topCategories.length > 0 && (
        <div className="analysis-card" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700' }}>
              <PieChart size={18} color="var(--primary)" />
              <span>Pengeluaran Terbesar</span>
            </div>
            <button
              type="button"
              className="text-link-btn"
              onClick={onGoToReport}
            >
              Lihat Semua &rarr;
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {topCategories.map((cat) => (
              <div key={cat.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', marginBottom: '0.35rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: '600' }}>
                    <CategoryIcon name={cat.icon} size={15} color={cat.color} />
                    <span>{cat.name}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginRight: '6px' }}>{cat.percent}%</span>
                    <strong>{formatRupiah(cat.amount)}</strong>
                  </div>
                </div>
                <div className="cat-progress-track">
                  <div className="cat-progress-fill" style={{ width: `${cat.percent}%`, backgroundColor: cat.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Transactions List Preview */}
      <div className="analysis-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '700' }}>Transaksi Terakhir</h3>
          <button
            type="button"
            className="text-link-btn"
            onClick={onGoToTransactions}
          >
            Semua Transaksi &rarr;
          </button>
        </div>

        {recentTransactions.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Belum ada transaksi.</p>
        ) : (
          <div className="tx-list-wrapper">
            {recentTransactions.map((tx) => {
              const meta = getCategoryMeta(tx.category, tx.type);
              const isIncome = tx.type === 'income';

              return (
                <div key={tx.id} className="tx-card" style={{ padding: '0.75rem 1rem' }}>
                  <div className="tx-left-col">
                    <div className="tx-icon-box" style={{ backgroundColor: meta.bg, color: meta.color, width: '36px', height: '36px' }}>
                      <CategoryIcon name={meta.icon} size={18} color={meta.color} />
                    </div>
                    <div className="tx-details">
                      <div className="tx-note" style={{ fontSize: '0.9rem' }}>{tx.note || meta.name}</div>
                      <div className="tx-meta-info" style={{ fontSize: '0.74rem' }}>
                        <span>{formatDateIndo(tx.date)}</span>
                        <span className="tx-dot-separator">•</span>
                        <span>{meta.name}</span>
                      </div>
                    </div>
                  </div>

                  <div className={`tx-amount ${isIncome ? 'income' : 'expense'}`} style={{ fontSize: '0.92rem' }}>
                    {isIncome ? '+' : '-'} {formatRupiah(tx.amount)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
