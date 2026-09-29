import React, { useState, useEffect } from 'react';
import { X, ArrowDownLeft, ArrowUpRight, Check } from 'lucide-react';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../data/categories';
import CategoryIcon from './CategoryIcon';

export default function TransactionModal({ isOpen, onClose, onAddTransaction }) {
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0].id);
  const [note, setNote] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Update selected category when type changes
  useEffect(() => {
    if (type === 'expense') {
      setCategory(EXPENSE_CATEGORIES[0].id);
    } else {
      setCategory(INCOME_CATEGORIES[0].id);
    }
  }, [type]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setAmount('');
      setNote('');
      setDate(new Date().toISOString().split('T')[0]);
      setType('expense');
      setCategory(EXPENSE_CATEGORIES[0].id);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // ESC to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentCategories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const handleQuickAddAmount = (addVal) => {
    const current = parseInt(amount.replace(/\D/g, '') || '0', 10);
    setAmount(String(current + addVal));
  };

  const handleAmountChange = (e) => {
    const val = e.target.value.replace(/\D/g, '');
    setAmount(val);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const num = parseInt(amount, 10);
    if (!num || num <= 0) {
      alert('Silakan masukkan nominal yang valid!');
      return;
    }

    const newTx = {
      id: 'tx-' + Date.now(),
      type,
      category,
      amount: num,
      note: note.trim() || (type === 'expense' ? 'Pengeluaran' : 'Pemasukan'),
      date: date || new Date().toISOString().split('T')[0],
      createdAt: Date.now(),
    };

    onAddTransaction(newTx);
    onClose();
  };

  const formattedAmountPreview = amount
    ? new Intl.NumberFormat('id-ID').format(parseInt(amount, 10))
    : '0';

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Mobile handle indicator */}
        <div className="modal-handle-bar" aria-hidden="true" />

        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">Tambah Transaksi</h2>
          <button
            type="button"
            className="drawer-close-btn"
            onClick={onClose}
            aria-label="Tutup popup"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body & Footer inside responsive flex form */}
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Type Switcher */}
            <div className="type-toggle-container">
              <button
                type="button"
                className={`type-toggle-btn ${type === 'expense' ? 'active expense' : ''}`}
                onClick={() => setType('expense')}
              >
                <ArrowDownLeft size={16} />
                Pengeluaran
              </button>
              <button
                type="button"
                className={`type-toggle-btn ${type === 'income' ? 'active income' : ''}`}
                onClick={() => setType('income')}
              >
                <ArrowUpRight size={16} />
                Pemasukan
              </button>
            </div>

            {/* Amount Input */}
            <div className="form-group">
              <label className="form-label">Nominal (Rp)</label>
              <div className="amount-input-box">
                <span className="amount-prefix">Rp</span>
                <input
                  type="text"
                  inputMode="numeric"
                  autoFocus
                  placeholder="0"
                  className="form-input amount-input"
                  value={amount ? formattedAmountPreview : ''}
                  onChange={handleAmountChange}
                  required
                />
              </div>

              {/* Quick Chip Shortcuts */}
              <div className="quick-chips-row">
                <button
                  type="button"
                  className="quick-chip"
                  onClick={() => handleQuickAddAmount(10000)}
                >
                  +10 rb
                </button>
                <button
                  type="button"
                  className="quick-chip"
                  onClick={() => handleQuickAddAmount(25000)}
                >
                  +25 rb
                </button>
                <button
                  type="button"
                  className="quick-chip"
                  onClick={() => handleQuickAddAmount(50000)}
                >
                  +50 rb
                </button>
                <button
                  type="button"
                  className="quick-chip"
                  onClick={() => handleQuickAddAmount(100000)}
                >
                  +100 rb
                </button>
                <button
                  type="button"
                  className="quick-chip"
                  onClick={() => handleQuickAddAmount(500000)}
                >
                  +500 rb
                </button>
              </div>
            </div>

            {/* Category Selector */}
            <div className="form-group">
              <label className="form-label">Pilih Kategori</label>
              <div className="category-picker-grid">
                {currentCategories.map((cat) => {
                  const isSelected = category === cat.id;
                  return (
                    <button
                      type="button"
                      key={cat.id}
                      className={`cat-picker-item ${isSelected ? 'selected' : ''}`}
                      onClick={() => setCategory(cat.id)}
                    >
                      <div
                        className="icon-circle"
                        style={{
                          backgroundColor: cat.bg,
                          color: cat.color,
                        }}
                      >
                        <CategoryIcon name={cat.icon} size={18} color={cat.color} />
                      </div>
                      <span>{cat.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date and Note */}
            <div className="modal-grid-2col">
              <div className="form-group">
                <label className="form-label">Tanggal</label>
                <input
                  type="date"
                  className="form-input"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Catatan</label>
                <input
                  type="text"
                  placeholder="Misal: Makan siang"
                  className="form-input"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="btn-submit">
              Simpan Transaksi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
