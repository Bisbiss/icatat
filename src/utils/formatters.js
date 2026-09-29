import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../data/categories';

export const formatRupiah = (number) => {
  if (number === null || number === undefined || isNaN(number)) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
};

export const formatDateIndo = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr + 'T00:00:00');
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

let globalCategories = {
  expense: EXPENSE_CATEGORIES,
  income: INCOME_CATEGORIES,
};

export const setGlobalCategories = (cats) => {
  if (cats && cats.expense && cats.income) {
    globalCategories = cats;
  }
};

export const getCategoryMeta = (categoryId, type, overrideList) => {
  // If specific list passed, check it first
  if (overrideList && Array.isArray(overrideList)) {
    const found = overrideList.find((c) => c.id === categoryId);
    if (found) return found;
  }

  // Check current global custom categories
  const primaryList = type === 'income' ? globalCategories.income : globalCategories.expense;
  const foundPrimary = primaryList?.find((c) => c.id === categoryId);
  if (foundPrimary) return foundPrimary;

  // Check alternate list in case type mismatched
  const secondaryList = type === 'income' ? globalCategories.expense : globalCategories.income;
  const foundSecondary = secondaryList?.find((c) => c.id === categoryId);
  if (foundSecondary) return foundSecondary;

  // Fallback to initial defaults
  const fallbackList = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const foundFallback = fallbackList.find((c) => c.id === categoryId);
  if (foundFallback) return foundFallback;

  return {
    id: categoryId,
    name: categoryId || 'Lainnya',
    icon: 'Coins',
    color: '#64748b',
    bg: 'rgba(100, 116, 139, 0.12)',
  };
};

export const downloadCSV = (transactions) => {
  const headers = ['ID', 'Tipe', 'Kategori', 'Nominal', 'Catatan', 'Tanggal'];
  const rows = transactions.map((t) => {
    const meta = getCategoryMeta(t.category, t.type);
    return [
      `"${t.id}"`,
      `"${t.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}"`,
      `"${meta.name}"`,
      t.amount,
      `"${(t.note || '').replace(/"/g, '""')}"`,
      `"${t.date}"`,
    ];
  });

  const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `icatat_transaksi_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
