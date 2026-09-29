import React, { useState } from 'react';
import { X, Plus, Pencil, Trash2, RotateCcw, Check, AlertCircle, ArrowLeft, Sparkles } from 'lucide-react';
import CategoryIcon from './CategoryIcon';
import { AVAILABLE_CATEGORY_ICONS, AVAILABLE_CATEGORY_COLORS } from '../data/categories';

export default function CategoryManagerModal({
  isOpen,
  onClose,
  categories,
  onSaveCategory,
  onDeleteCategory,
  onResetCategories,
  transactions = [],
}) {
  const [activeTab, setActiveTab] = useState('expense'); // 'expense' or 'income'
  const [editingCategory, setEditingCategory] = useState(null); // null or category object
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form states
  const [formName, setFormName] = useState('');
  const [formIcon, setFormIcon] = useState('ShoppingBag');
  const [formColorObj, setFormColorObj] = useState(AVAILABLE_CATEGORY_COLORS[0]);
  const [formError, setFormError] = useState('');

  if (!isOpen) return null;

  const currentList = activeTab === 'expense' ? categories.expense : categories.income;

  const openAddForm = () => {
    setEditingCategory(null);
    setFormName('');
    setFormIcon(activeTab === 'expense' ? 'ShoppingBag' : 'Briefcase');
    setFormColorObj(AVAILABLE_CATEGORY_COLORS[0]);
    setFormError('');
    setIsFormOpen(true);
  };

  const openEditForm = (cat) => {
    setEditingCategory(cat);
    setFormName(cat.name);
    setFormIcon(cat.icon || 'ShoppingBag');
    const matchedColor =
      AVAILABLE_CATEGORY_COLORS.find((c) => c.color.toLowerCase() === (cat.color || '').toLowerCase()) ||
      AVAILABLE_CATEGORY_COLORS[0];
    setFormColorObj(matchedColor);
    setFormError('');
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingCategory(null);
    setFormError('');
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!formName.trim()) {
      setFormError('Silakan masukkan nama kategori.');
      return;
    }

    // Check duplicate name in the same type
    const isDuplicate = currentList.some(
      (c) =>
        c.name.toLowerCase() === formName.trim().toLowerCase() &&
        (!editingCategory || c.id !== editingCategory.id)
    );

    if (isDuplicate) {
      setFormError(`Kategori dengan nama "${formName.trim()}" sudah ada.`);
      return;
    }

    const categoryId = editingCategory
      ? editingCategory.id
      : 'cat_' + Date.now();

    const categoryData = {
      id: categoryId,
      name: formName.trim(),
      icon: formIcon,
      color: formColorObj.color,
      bg: formColorObj.bg,
      type: activeTab,
    };

    onSaveCategory(categoryData, Boolean(editingCategory), editingCategory?.id);
    handleCloseForm();
  };

  const handleDelete = (cat) => {
    if (currentList.length <= 1) {
      alert('Kamu harus memiliki setidaknya 1 kategori!');
      return;
    }

    const usageCount = transactions.filter((t) => t.category === cat.id).length;
    let confirmMsg = `Hapus kategori "${cat.name}"?`;
    if (usageCount > 0) {
      confirmMsg += `\n\nPerhatian: Ada ${usageCount} transaksi yang menggunakan kategori ini. Transaksi tersebut akan tetap ada dengan label umum.`;
    }

    if (window.confirm(confirmMsg)) {
      onDeleteCategory(cat.id, activeTab);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-dialog modal-category-manager" onClick={(e) => e.stopPropagation()}>
        {/* Handle bar on mobile */}
        <div className="modal-handle-bar" aria-hidden="true" />

        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            {isFormOpen && (
              <button
                type="button"
                className="btn-ghost-icon"
                onClick={handleCloseForm}
                aria-label="Kembali"
              >
                <ArrowLeft size={18} />
              </button>
            )}
            <h2 className="modal-title">
              {isFormOpen
                ? editingCategory
                  ? 'Ubah Kategori'
                  : 'Tambah Kategori Baru'
                : 'Kelola Kategori'}
            </h2>
          </div>
          <button type="button" className="drawer-close-btn" onClick={onClose} aria-label="Tutup">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body-scrollable">
          {!isFormOpen ? (
            <>
              {/* Type Switcher */}
              <div className="type-toggle-container" style={{ marginBottom: '1.25rem' }}>
                <button
                  type="button"
                  className={`type-toggle-btn ${activeTab === 'expense' ? 'active expense' : ''}`}
                  onClick={() => setActiveTab('expense')}
                >
                  Pengeluaran ({categories.expense.length})
                </button>
                <button
                  type="button"
                  className={`type-toggle-btn ${activeTab === 'income' ? 'active income' : ''}`}
                  onClick={() => setActiveTab('income')}
                >
                  Pemasukan ({categories.income.length})
                </button>
              </div>

              {/* Add New Category Action */}
              <button
                type="button"
                className="btn-add-category-dash"
                onClick={openAddForm}
              >
                <Plus size={18} />
                <span>Tambah Kategori {activeTab === 'expense' ? 'Pengeluaran' : 'Pemasukan'}</span>
              </button>

              {/* Category List */}
              <div className="category-items-list">
                {currentList.map((cat) => {
                  const usageCount = transactions.filter((t) => t.category === cat.id).length;
                  return (
                    <div key={cat.id} className="category-manage-item">
                      <div className="cat-item-left">
                        <div
                          className="cat-icon-badge"
                          style={{ backgroundColor: cat.bg, color: cat.color }}
                        >
                          <CategoryIcon name={cat.icon} size={20} color={cat.color} />
                        </div>
                        <div className="cat-details">
                          <div className="cat-name">{cat.name}</div>
                          <div className="cat-meta-usage">
                            {usageCount > 0 ? `${usageCount} transaksi tercatat` : 'Belum ada transaksi'}
                          </div>
                        </div>
                      </div>

                      <div className="cat-actions-right">
                        <button
                          type="button"
                          className="btn-cat-action edit"
                          onClick={() => openEditForm(cat)}
                          title="Ubah Kategori"
                          aria-label={`Ubah kategori ${cat.name}`}
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          type="button"
                          className="btn-cat-action delete"
                          onClick={() => handleDelete(cat)}
                          title="Hapus Kategori"
                          aria-label={`Hapus kategori ${cat.name}`}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reset to Default Button */}
              <div style={{ marginTop: '1.75rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                <button
                  type="button"
                  className="btn-reset-categories-subtle"
                  onClick={onResetCategories}
                >
                  <RotateCcw size={15} />
                  <span>Kembalikan Semua Kategori ke Bawaan Awal</span>
                </button>
              </div>
            </>
          ) : (
            /* Category Form (Add / Edit) */
            <form onSubmit={handleFormSubmit} className="category-editor-form">
              {formError && (
                <div className="auth-error-box" style={{ marginBottom: '1rem' }}>
                  <AlertCircle size={16} className="flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Live Preview Box */}
              <div className="cat-live-preview">
                <span className="text-muted" style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                  Preview Tampilan:
                </span>
                <div className="preview-cat-pill" style={{ backgroundColor: formColorObj.bg, color: formColorObj.color }}>
                  <CategoryIcon name={formIcon} size={20} color={formColorObj.color} />
                  <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>
                    {formName.trim() || 'Nama Kategori'}
                  </span>
                </div>
              </div>

              {/* Input Name */}
              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">Nama Kategori</label>
                <input
                  type="text"
                  placeholder="Misal: Kopi & Nongkrong, Servis Motor..."
                  className="form-input"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  autoFocus
                  required
                />
              </div>

              {/* Color Selector */}
              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">Pilih Warna Aksen</label>
                <div className="color-swatches-grid">
                  {AVAILABLE_CATEGORY_COLORS.map((col) => {
                    const isSelected = formColorObj.color === col.color;
                    return (
                      <button
                        key={col.color}
                        type="button"
                        className={`color-swatch-btn ${isSelected ? 'selected' : ''}`}
                        style={{ backgroundColor: col.color }}
                        onClick={() => setFormColorObj(col)}
                        title={col.name}
                        aria-label={`Pilih warna ${col.name}`}
                      >
                        {isSelected && <Check size={14} color="#fff" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Icon Selector */}
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Pilih Ikon ({AVAILABLE_CATEGORY_ICONS.length} Pilihan)</label>
                <div className="icon-selector-grid">
                  {AVAILABLE_CATEGORY_ICONS.map((item) => {
                    const isSelected = formIcon === item.name;
                    return (
                      <button
                        key={item.name}
                        type="button"
                        className={`icon-pick-btn ${isSelected ? 'selected' : ''}`}
                        style={{
                          borderColor: isSelected ? formColorObj.color : 'transparent',
                          backgroundColor: isSelected ? formColorObj.bg : 'var(--bg-subtle)',
                          color: isSelected ? formColorObj.color : 'var(--text-main)',
                        }}
                        onClick={() => setFormIcon(item.name)}
                        title={item.label}
                        aria-label={item.label}
                      >
                        <CategoryIcon name={item.name} size={20} color={isSelected ? formColorObj.color : 'currentColor'} />
                        <span className="icon-pick-label">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="cat-form-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleCloseForm}
                  style={{ flex: 1, padding: '0.8rem' }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn-submit"
                  style={{ flex: 2, padding: '0.8rem' }}
                >
                  <Sparkles size={16} />
                  <span>{editingCategory ? 'Simpan Perubahan' : 'Tambahkan Kategori'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
