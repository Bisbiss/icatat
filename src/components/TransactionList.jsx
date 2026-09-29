import React, { useState, useMemo } from 'react';
import { Search, Trash2, Calendar, Inbox, Plus } from 'lucide-react';
import { formatRupiah, formatDateIndo, getCategoryMeta } from '../utils/formatters';
import CategoryIcon from './CategoryIcon';

export default function TransactionList({
  transactions,
  onDeleteTransaction,
  onOpenAddModal,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all'); // 'all', 'expense', 'income'
  const [timeFilter, setTimeFilter] = useState('all'); // 'all', 'month', 'today'

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const currentMonthStr = todayStr.substring(0, 7); // YYYY-MM

    return transactions
      .filter((tx) => {
        // Type filter
        if (typeFilter !== 'all' && tx.type !== typeFilter) return false;

        // Time filter
        if (timeFilter === 'today' && tx.date !== todayStr) return false;
        if (timeFilter === 'month' && !tx.date.startsWith(currentMonthStr)) return false;

        // Search term (note or category name)
        if (searchTerm.trim()) {
          const term = searchTerm.toLowerCase();
          const meta = getCategoryMeta(tx.category, tx.type);
          const matchNote = (tx.note || '').toLowerCase().includes(term);
          const matchCat = meta.name.toLowerCase().includes(term);
          if (!matchNote && !matchCat) return false;
        }

        return true;
      })
      .sort((a, b) => {
        // Sort newest first
        if (a.date !== b.date) {
          return new Date(b.date) - new Date(a.date);
        }
        return (b.createdAt || 0) - (a.createdAt || 0);
      });
  }, [transactions, searchTerm, typeFilter, timeFilter]);

  return (
    <div className="transactions-section">
      {/* Header and Controls */}
      <div className="section-header-row">
        <div className="section-title-wrap">
          <h2 className="section-title">Riwayat Transaksi</h2>
          <span className="section-badge">{filteredTransactions.length} Transaksi</span>
        </div>

        {/* Desktop / Tablet Filters */}
        <div className="segmented-filter">
          <button
            type="button"
            className={`segmented-btn ${timeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setTimeFilter('all')}
          >
            Semua Waktu
          </button>
          <button
            type="button"
            className={`segmented-btn ${timeFilter === 'month' ? 'active' : ''}`}
            onClick={() => setTimeFilter('month')}
          >
            Bulan Ini
          </button>
          <button
            type="button"
            className={`segmented-btn ${timeFilter === 'today' ? 'active' : ''}`}
            onClick={() => setTimeFilter('today')}
          >
            Hari Ini
          </button>
        </div>
      </div>

      {/* Filter bar: Search & Type */}
      <div className="filter-controls-row">
        <div className="search-input-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Cari transaksi atau kategori..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="segmented-filter">
          <button
            type="button"
            className={`segmented-btn ${typeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setTypeFilter('all')}
          >
            Semua
          </button>
          <button
            type="button"
            className={`segmented-btn ${typeFilter === 'expense' ? 'active' : ''}`}
            onClick={() => setTypeFilter('expense')}
          >
            Keluar
          </button>
          <button
            type="button"
            className={`segmented-btn ${typeFilter === 'income' ? 'active' : ''}`}
            onClick={() => setTypeFilter('income')}
          >
            Masuk
          </button>
        </div>
      </div>

      {/* Transaction List Cards */}
      {filteredTransactions.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon-circle">
            <Inbox size={26} />
          </div>
          <h3>Belum ada transaksi ditemukan</h3>
          <p style={{ fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            {searchTerm || typeFilter !== 'all' || timeFilter !== 'all'
              ? 'Coba ganti filter atau kata kunci pencarian Anda.'
              : 'Mulai dengan mencatat pemasukan atau pengeluaran pertama Anda.'}
          </p>
          <button
            type="button"
            className="btn-primary-add"
            style={{ margin: '0 auto' }}
            onClick={onOpenAddModal}
          >
            <Plus size={16} />
            <span>Tambah Transaksi Baru</span>
          </button>
        </div>
      ) : (
        <div className="tx-list-wrapper">
          {filteredTransactions.map((tx) => {
            const meta = getCategoryMeta(tx.category, tx.type);
            const isIncome = tx.type === 'income';

            return (
              <div key={tx.id} className="tx-card">
                <div className="tx-left-col">
                  <div
                    className="tx-icon-box"
                    style={{
                      backgroundColor: meta.bg,
                      color: meta.color,
                    }}
                  >
                    <CategoryIcon name={meta.icon} size={20} color={meta.color} />
                  </div>
                  <div className="tx-details">
                    <div className="tx-note">{tx.note || meta.name}</div>
                    <div className="tx-meta-info">
                      <span>{meta.name}</span>
                      <span className="tx-dot-separator">•</span>
                      <span>{formatDateIndo(tx.date)}</span>
                    </div>
                  </div>
                </div>

                <div className="tx-right-col">
                  <div className={`tx-amount ${isIncome ? 'income' : 'expense'}`}>
                    {isIncome ? '+' : '-'} {formatRupiah(tx.amount)}
                  </div>
                  <button
                    type="button"
                    className="tx-delete-btn"
                    title="Hapus transaksi"
                    aria-label={`Hapus ${tx.note}`}
                    onClick={() => onDeleteTransaction(tx.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
