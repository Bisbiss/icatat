import React from 'react';
import { PieChart, TrendingDown, TrendingUp, Sparkles, AlertCircle } from 'lucide-react';
import { formatRupiah, getCategoryMeta } from '../utils/formatters';
import CategoryIcon from './CategoryIcon';

export default function CategoryAnalysis({ transactions }) {
  // Aggregate expenses by category
  const expenseData = transactions.filter((t) => t.type === 'expense');
  const totalExpense = expenseData.reduce((acc, t) => acc + t.amount, 0);

  const expenseByCategory = expenseData.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {});

  const sortedExpenses = Object.entries(expenseByCategory)
    .map(([catId, amount]) => {
      const meta = getCategoryMeta(catId, 'expense');
      const percentage = totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0;
      return {
        id: catId,
        name: meta.name,
        color: meta.color,
        bg: meta.bg,
        icon: meta.icon,
        amount,
        percentage,
      };
    })
    .sort((a, b) => b.amount - a.amount);

  // Aggregate incomes by category
  const incomeData = transactions.filter((t) => t.type === 'income');
  const totalIncome = incomeData.reduce((acc, t) => acc + t.amount, 0);

  const incomeByCategory = incomeData.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {});

  const sortedIncomes = Object.entries(incomeByCategory)
    .map(([catId, amount]) => {
      const meta = getCategoryMeta(catId, 'income');
      const percentage = totalIncome > 0 ? Math.round((amount / totalIncome) * 100) : 0;
      return {
        id: catId,
        name: meta.name,
        color: meta.color,
        bg: meta.bg,
        icon: meta.icon,
        amount,
        percentage,
      };
    })
    .sort((a, b) => b.amount - a.amount);

  // Financial health ratio
  const savingsRate =
    totalIncome > 0
      ? Math.max(0, Math.round(((totalIncome - totalExpense) / totalIncome) * 100))
      : 0;

  return (
    <div className="analysis-section">
      <div className="section-header-row">
        <div className="section-title-wrap">
          <h2 className="section-title">Analisis Keuangan</h2>
          <span className="section-badge">Visual & Cepat</span>
        </div>
      </div>

      {/* Financial Health Summary */}
      <div
        className="stat-card"
        style={{
          marginBottom: '1.5rem',
          background: 'linear-gradient(135deg, rgba(22, 163, 74, 0.08) 0%, rgba(21, 128, 61, 0.08) 100%)',
          borderColor: 'rgba(22, 163, 74, 0.25)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700' }}>
            <Sparkles size={18} color="var(--primary)" />
            <span>Tingkat Tabungan (Savings Rate)</span>
          </div>
          <span
            style={{
              fontWeight: '800',
              fontSize: '1.1rem',
              color: savingsRate >= 20 ? 'var(--income)' : 'var(--warning)',
            }}
          >
            {savingsRate}%
          </span>
        </div>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
          {savingsRate >= 50
            ? 'Luar biasa! Lebih dari 50% pemasukan berhasil dihemat atau dialokasikan sebagai tabungan.'
            : savingsRate >= 20
            ? 'Bagus! Anda berada di rasio tabungan yang sehat (di atas 20%).'
            : 'Perhatian: Alokasikan lebih banyak porsi pemasukan untuk dana darurat dan tabungan.'}
        </p>
      </div>

      {/* Expense Breakdown */}
      <div className="analysis-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div className="stat-icon-pill expense" style={{ width: '30px', height: '30px' }}>
              <TrendingDown size={16} />
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '700' }}>Distribusi Pengeluaran</h3>
          </div>
          <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--expense)' }}>
            Total: {formatRupiah(totalExpense)}
          </span>
        </div>

        {sortedExpenses.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            Belum ada catatan pengeluaran.
          </p>
        ) : (
          <div>
            {sortedExpenses.map((cat) => (
              <div key={cat.id} className="category-bar-row">
                <div className="cat-info-line">
                  <div className="cat-label">
                    <CategoryIcon name={cat.icon} size={15} color={cat.color} />
                    <span>{cat.name}</span>
                  </div>
                  <div className="cat-amt">
                    <span style={{ marginRight: '0.5rem', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                      {cat.percentage}%
                    </span>
                    <span>{formatRupiah(cat.amount)}</span>
                  </div>
                </div>
                <div className="cat-progress-track">
                  <div
                    className="cat-progress-fill"
                    style={{
                      width: `${cat.percentage}%`,
                      backgroundColor: cat.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Income Breakdown */}
      <div className="analysis-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div className="stat-icon-pill income" style={{ width: '30px', height: '30px' }}>
              <TrendingUp size={16} />
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '700' }}>Sumber Pemasukan</h3>
          </div>
          <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--income)' }}>
            Total: {formatRupiah(totalIncome)}
          </span>
        </div>

        {sortedIncomes.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            Belum ada catatan pemasukan.
          </p>
        ) : (
          <div>
            {sortedIncomes.map((cat) => (
              <div key={cat.id} className="category-bar-row">
                <div className="cat-info-line">
                  <div className="cat-label">
                    <CategoryIcon name={cat.icon} size={15} color={cat.color} />
                    <span>{cat.name}</span>
                  </div>
                  <div className="cat-amt">
                    <span style={{ marginRight: '0.5rem', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                      {cat.percentage}%
                    </span>
                    <span>{formatRupiah(cat.amount)}</span>
                  </div>
                </div>
                <div className="cat-progress-track">
                  <div
                    className="cat-progress-fill"
                    style={{
                      width: `${cat.percentage}%`,
                      backgroundColor: cat.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
