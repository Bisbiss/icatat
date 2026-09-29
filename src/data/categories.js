export const EXPENSE_CATEGORIES = [
  { id: 'makanan', name: 'Makanan & Minuman', icon: 'Utensils', color: '#f97316', bg: 'rgba(249, 115, 22, 0.12)' },
  { id: 'transport', name: 'Transportasi', icon: 'Car', color: '#0ea5e9', bg: 'rgba(14, 165, 233, 0.12)' },
  { id: 'belanja', name: 'Belanja & Kebutuhan', icon: 'ShoppingBag', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.12)' },
  { id: 'tagihan', name: 'Tagihan & Utilitas', icon: 'Receipt', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.12)' },
  { id: 'hiburan', name: 'Hiburan & Liburan', icon: 'Tv', color: '#ec4899', bg: 'rgba(236, 72, 153, 0.12)' },
  { id: 'kesehatan', name: 'Kesehatan & Obat', icon: 'HeartPulse', color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)' },
  { id: 'pendidikan', name: 'Edukasi & Buku', icon: 'GraduationCap', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.12)' },
  { id: 'lainnya_keluar', name: 'Lain-lain', icon: 'Coins', color: '#64748b', bg: 'rgba(100, 116, 139, 0.12)' },
];

export const INCOME_CATEGORIES = [
  { id: 'gaji', name: 'Gaji Pokok', icon: 'Briefcase', color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)' },
  { id: 'bisnis', name: 'Usaha / Bisnis', icon: 'ShoppingBag', color: '#0ea5e9', bg: 'rgba(14, 165, 233, 0.12)' },
  { id: 'investasi', name: 'Investasi / Dividen', icon: 'TrendingUp', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.12)' },
  { id: 'bonus', name: 'Bonus & Freelance', icon: 'Sparkles', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)' },
  { id: 'hadiah', name: 'Hadiah / THR', icon: 'Gift', color: '#ec4899', bg: 'rgba(236, 72, 153, 0.12)' },
  { id: 'lainnya_masuk', name: 'Pemasukan Lain', icon: 'Coins', color: '#64748b', bg: 'rgba(100, 116, 139, 0.12)' },
];

// Helper to get today's date in YYYY-MM-DD
const getToday = (offsetDays = 0) => {
  const d = new Date();
  d.setDate(d.getDate() - offsetDays);
  return d.toISOString().split('T')[0];
};

export const INITIAL_TRANSACTIONS = [
  {
    id: 'tx-1',
    type: 'income',
    category: 'gaji',
    amount: 7500000,
    note: 'Gaji Bulanan',
    date: getToday(2),
    createdAt: Date.now() - 1000 * 60 * 60 * 48,
  },
  {
    id: 'tx-2',
    type: 'expense',
    category: 'tagihan',
    amount: 450000,
    note: 'Listrik & Wifi Rumah',
    date: getToday(2),
    createdAt: Date.now() - 1000 * 60 * 60 * 40,
  },
  {
    id: 'tx-3',
    type: 'expense',
    category: 'belanja',
    amount: 320000,
    note: 'Belanja Bulanan Supermarket',
    date: getToday(1),
    createdAt: Date.now() - 1000 * 60 * 60 * 24,
  },
  {
    id: 'tx-4',
    type: 'expense',
    category: 'makanan',
    amount: 45000,
    note: 'Makan Siang Nasi Padang & Es Teh',
    date: getToday(0),
    createdAt: Date.now() - 1000 * 60 * 60 * 5,
  },
  {
    id: 'tx-5',
    type: 'expense',
    category: 'transport',
    amount: 25000,
    note: 'Bensin Motor',
    date: getToday(0),
    createdAt: Date.now() - 1000 * 60 * 60 * 2,
  },
  {
    id: 'tx-6',
    type: 'income',
    category: 'bonus',
    amount: 850000,
    note: 'Projek Web Freelance',
    date: getToday(0),
    createdAt: Date.now() - 1000 * 60 * 30,
  },
];
