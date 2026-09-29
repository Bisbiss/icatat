import React from 'react';
import { Wallet, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { formatRupiah } from '../utils/formatters';

export default function SummaryCards({ summary }) {
  const { balance, income, expense, incomeCount, expenseCount } = summary;

  return (
    <section className="summary-grid" aria-label="Ringkasan Keuangan">
      {/* Saldo Bersih Card */}
      <div className="stat-card balance-card">
        <div className="stat-card-header">
          <span className="stat-label">Saldo Saat Ini</span>
          <div className="stat-icon-pill balance">
            <Wallet size={18} />
          </div>
        </div>
        <div>
          <div className="stat-value">{formatRupiah(balance)}</div>
          <div className="stat-sub">
            {balance >= 0 ? 'Kondisi finansial aman' : 'Pengeluaran melebihi pemasukan'}
          </div>
        </div>
      </div>

      {/* Total Pemasukan Card */}
      <div className="stat-card">
        <div className="stat-card-header">
          <span className="stat-label">Total Pemasukan</span>
          <div className="stat-icon-pill income">
            <TrendingUp size={18} />
          </div>
        </div>
        <div>
          <div className="stat-value" style={{ color: 'var(--income)' }}>
            {formatRupiah(income)}
          </div>
          <div className="stat-sub">
            <span style={{ color: 'var(--income)', display: 'inline-flex', alignItems: 'center' }}>
              <ArrowUpRight size={14} />
            </span>
            <span>{incomeCount} transaksi masuk</span>
          </div>
        </div>
      </div>

      {/* Total Pengeluaran Card */}
      <div className="stat-card">
        <div className="stat-card-header">
          <span className="stat-label">Total Pengeluaran</span>
          <div className="stat-icon-pill expense">
            <TrendingDown size={18} />
          </div>
        </div>
        <div>
          <div className="stat-value" style={{ color: 'var(--expense)' }}>
            {formatRupiah(expense)}
          </div>
          <div className="stat-sub">
            <span style={{ color: 'var(--expense)', display: 'inline-flex', alignItems: 'center' }}>
              <ArrowDownLeft size={14} />
            </span>
            <span>{expenseCount} transaksi keluar</span>
          </div>
        </div>
      </div>
    </section>
  );
}
