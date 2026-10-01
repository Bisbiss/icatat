import React, { useState } from 'react';
import {
  ArrowRight,
  Zap,
  ShieldCheck,
  BarChart2,
  CheckCircle2,
  Sparkles,
  TrendingDown,
  Clock,
  Download,
  Smartphone,
  Moon,
  Sun,
  ChevronDown,
  AlertTriangle,
  UserCheck,
  Flame,
  Check,
  RotateCcw,
  Star,
  Lock
} from 'lucide-react';
import { formatRupiah } from '../utils/formatters';

export default function LandingPage({ onGoToAuth, onQuickDemo, onOpenPrivacy, summary, theme, toggleTheme }) {
  const [openFaq, setOpenFaq] = useState(null);

  // Interactive Live Simulator state in Hero Preview
  const initialBalance = summary?.balance && summary.balance > 0 ? summary.balance : 4250000;
  const initialExpense = summary?.expense && summary.expense > 0 ? summary.expense : 1150000;
  const [simBalance, setSimBalance] = useState(initialBalance);
  const [simExpense, setSimExpense] = useState(initialExpense);
  const [simFeedback, setSimFeedback] = useState(null);

  const handleSimulateAdd = (itemLabel, amount) => {
    setSimBalance((prev) => prev - amount);
    setSimExpense((prev) => prev + amount);
    setSimFeedback(`Tercatat! -${formatRupiah(amount)} (${itemLabel})`);
    setTimeout(() => {
      setSimFeedback(null);
    }, 2400);
  };

  const handleSimulateReset = () => {
    setSimBalance(initialBalance);
    setSimExpense(initialExpense);
    setSimFeedback('Simulasi direset');
    setTimeout(() => setSimFeedback(null), 1800);
  };

  const toggleFaq = (index) => {
    setOpenFaq((prev) => (prev === index ? null : index));
  };

  const faqs = [
    {
      q: 'Apakah Icatat perlu disambungkan ke nomor rekening atau m-Banking saya?',
      a: 'Sama sekali TIDAK PERLU! Kamu tidak perlu menghubungkan nomor rekening bank, kartu kredit/debit, atau m-Banking apa pun. Icatat murni mencatat transaksi yang kamu input sendiri secara mandiri, sehingga 100% bebas dari risiko pembobolan rekening atau pencurian saldo.',
    },
    {
      q: 'Apakah Icatat benar-benar gratis untuk digunakan?',
      a: 'Ya, 100% gratis tanpa biaya langganan tersembunyi. Kamu bisa langsung menggunakannya untuk mencatat semua pemasukan dan pengeluaran harianmu tanpa batasan jumlah transaksi.',
    },
    {
      q: 'Apakah data keuangan pribadi saya aman dan terjamin rahasia?',
      a: 'Sangat aman! Icatat mengutamakan privasi penuh. Seluruh data transaksimu disimpan secara aman dan terenkripsi dengan Row Level Security Supabase atau di penyimpanan lokal browsermu. Kami tidak pernah menjual data keuanganmu ke pihak ketiga, biro pinjol, ataupun pengiklan.',
    },
    {
      q: 'Apakah saya bisa menggunakan Icatat tanpa koneksi internet (offline)?',
      a: 'Bisa banget! Karena data tersimpan di cache perangkatmu, kamu tetap bisa membuka aplikasi, melihat grafik, dan mencatat transaksi kapan pun dan di mana pun meskipun sedang tidak ada kuota internet.',
    },
    {
      q: 'Bagaimana jika saya ingin memindahkan data catatan ke Excel atau Google Sheets?',
      a: 'Cukup buka menu Laporan dan klik tombol "Ekspor CSV". Seluruh riwayat pemasukan dan pengeluaranmu akan langsung terunduh rapi dan siap dibuka di Microsoft Excel atau Google Sheets.',
    },
    {
      q: 'Apa perbedaan antara mendaftar akun dan mencoba mode demo?',
      a: 'Mendaftar akun memungkinkan kamu memiliki akun cloud Supabase yang aman, kategori kustom, dan sinkron antar browser. Sedangkan mode demo memungkinkanmu langsung menguji semua fitur interaktif dalam 1 detik tanpa perlu mengisi form pendaftaran.',
    },
  ];

  return (
    <div className="landing-wrapper">
      {/* 1. TOP NAVBAR */}
      <header className="landing-header">
        <div className="landing-header-inner">
          <div className="brand-wrapper">
            <img src="/logo.png" alt="Logo Icatat - Catatan Keuangan Pribadi" className="brand-logo-img" />
            <div className="brand-text-col">
              <span className="brand-title">Icatat</span>
              <span className="brand-tagline-micro">Kelola Uangmu</span>
            </div>
          </div>

          <nav className="landing-nav-actions" aria-label="Navigasi Utama">
            {toggleTheme && (
              <button
                type="button"
                className="btn-theme-toggle-landing"
                onClick={toggleTheme}
                title={theme === 'dark' ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
                aria-label="Ganti mode tampilan"
              >
                {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
              </button>
            )}

            <button
              type="button"
              className="btn-nav-ghost"
              onClick={() => onGoToAuth('login')}
              id="btn-nav-login"
            >
              Masuk
            </button>
            <button
              type="button"
              className="btn-nav-primary"
              onClick={() => onGoToAuth('register')}
              id="btn-nav-register"
            >
              Daftar Akun
            </button>
            <button
              type="button"
              className="btn-nav-demo"
              onClick={onQuickDemo}
              id="btn-nav-demo"
              title="Coba fitur langsung tanpa daftar"
            >
              <span>Demo</span>
              <ArrowRight size={14} />
            </button>
          </nav>
        </div>
      </header>

      <main>
        {/* 2. HERO SECTION */}
        <section className="landing-hero" aria-labelledby="hero-heading">
          <div className="hero-content">
            {/* Social Proof & Hook Pill */}
            <div className="hero-pill-badge">
              <span className="star-rating-pill">
                <Star size={13} fill="#f59e0b" color="#f59e0b" />
                <strong>4.9/5</strong>
              </span>
              <span className="pill-divider-dot">&bull;</span>
              <Sparkles size={13} className="icon-pulse" />
              <span>Solusi Catatan Keuangan Pribadi Bebas Boncos</span>
            </div>

            {/* 1. HEADLINE WITH HOOK */}
            <h1 id="hero-heading" className="hero-heading">
              Berhenti Bingung Uangmu Habis ke Mana.{' '}
              <span className="highlight-text">Kendalikan Keuanganmu dalam 3 Detik.</span>
            </h1>

            {/* 2. DUKUNG HEADLINE (EMPATI, FAKTA, MEMBUAT AUDIENS PENASARAN) */}
            <div className="hero-support-card">
              <div className="support-block empathy-block">
                <div className="support-icon-title">
                  <span className="empathy-badge">Rasa yang Kamu Rasakan</span>
                </div>
                <p className="support-text">
                  Pernahkah kamu baru seminggu gajian, tapi saldo rekening tiba-tiba menipis tanpa kamu sadari ke mana perginya?
                  Rasa cemas, bingung, dan bersalah saat membuka rekening tabungan di akhir bulan itu benar-benar melelahkan.
                </p>
              </div>

              <div className="support-block fact-block">
                <div className="support-icon-title">
                  <AlertTriangle size={15} color="#e11d48" />
                  <strong>Fakta yang Sering Terabaikan:</strong>
                </div>
                <p className="support-text">
                  Riset membuktikan lebih dari <strong>73% orang kehilangan jutaan rupiah setiap bulan</strong> hanya dari
                  kebocoran pos kecil: kopi kekinian, jajan sore impulsif, langganan terlupa, dan biaya admin transfer yang tak tercatat.
                </p>
              </div>

              <div className="support-block curiosity-block">
                <div className="support-icon-title">
                  <Flame size={15} color="var(--primary)" />
                  <strong>Coba Bayangkan Ini:</strong>
                </div>
                <p className="support-text">
                  Bagaimana jika mulai hari ini, kamu bisa melacak setiap rupiah semudah mengetik chat, langsung menemukan
                  pos mana yang bikin dompetmu jebol, dan akhirnya bisa <strong>menyisihkan sisa tabungan impian</strong> dengan perasaan tenang?
                </p>
              </div>
            </div>

            {/* 5. CALL TO ACTION (DAFTAR ATAU LOGIN) */}
            <div className="hero-cta-group">
              <button
                type="button"
                className="btn-hero-primary"
                onClick={() => onGoToAuth('register')}
                id="btn-hero-register"
              >
                <span>Daftar Akun Gratis Sekarang</span>
                <ArrowRight size={18} />
              </button>

              <button
                type="button"
                className="btn-hero-secondary"
                onClick={() => onGoToAuth('login')}
                id="btn-hero-login"
              >
                <UserCheck size={17} />
                <span>Sudah Punya Akun? Masuk</span>
              </button>
            </div>

            {/* Micro Demo Trigger */}
            <div className="hero-demo-trigger">
              <span className="text-muted-sm">Ingin coba langsung tanpa ribet?</span>{' '}
              <button
                type="button"
                className="link-demo-inline"
                onClick={onQuickDemo}
                id="btn-hero-quick-demo"
              >
                Coba Demo Interaktif (1 Klik) &rarr;
              </button>
            </div>

            {/* Quick Trust Checks */}
            <div className="hero-checks-row">
              <div className="check-item">
                <CheckCircle2 size={16} color="var(--primary)" />
                <span>100% Gratis Selamanya</span>
              </div>
              <div className="check-item">
                <Lock size={15} color="var(--primary)" />
                <span>Tanpa Akses Bank / Aman</span>
              </div>
              <div className="check-item">
                <CheckCircle2 size={16} color="var(--primary)" />
                <span>Privasi Terjaga</span>
              </div>
              <div className="check-item">
                <CheckCircle2 size={16} color="var(--primary)" />
                <span>Bebas Iklan Pengganggu</span>
              </div>
            </div>
          </div>

          {/* Hero Interactive Preview Card & Live 3-Second Simulator */}
          <div className="hero-preview-box">
            <div className="preview-card-inner">
              <div className="preview-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <img src="/logo.png" alt="Icatat Logo" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
                  <div>
                    <div style={{ fontWeight: '800', fontSize: '0.92rem' }}>Dompet Finansialmu</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Interactive Live Simulator</div>
                  </div>
                </div>
                <span className="live-dot-badge">
                  <span className="pulse-dot" aria-hidden="true"></span>
                  Live Preview
                </span>
              </div>

              {/* Main Balance Display with Live Simulation Animation */}
              <div className="preview-stat-main">
                <div style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.85)' }}>
                  Total Saldo Bersih Kamu
                </div>
                <div style={{ fontSize: '1.9rem', fontWeight: '800', margin: '4px 0', letterSpacing: '-0.02em' }}>
                  {formatRupiah(simBalance)}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'rgba(255, 255, 255, 0.9)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Sparkles size={13} />
                  <span>Arus kas bulanan terkontrol rapi</span>
                </div>
              </div>

              {/* Mini Income/Expense */}
              <div className="preview-mini-grid">
                <div className="mini-box income">
                  <span className="mini-title">Total Pemasukan</span>
                  <span className="mini-amt">{formatRupiah(summary.income || 5400000)}</span>
                  <span className="mini-badge-sub">Gaji & Bisnismu</span>
                </div>
                <div className="mini-box expense">
                  <span className="mini-title">Total Pengeluaran</span>
                  <span className="mini-amt">{formatRupiah(simExpense)}</span>
                  <span className="mini-badge-sub">Terdata Rinci</span>
                </div>
              </div>

              {/* Interactive 3-Second Simulation Shortcuts */}
              <div className="preview-simulator-box">
                <div className="sim-header-row">
                  <span className="sim-label">
                    <Zap size={14} color="var(--primary)" />
                    <strong>Coba Catat Pengeluaran Cepat:</strong>
                  </span>
                  <button
                    type="button"
                    className="sim-btn-reset"
                    onClick={handleSimulateReset}
                    title="Kembalikan saldo simulasi"
                    aria-label="Reset simulasi saldo"
                  >
                    <RotateCcw size={12} />
                    <span>Reset</span>
                  </button>
                </div>

                <div className="sim-buttons-row">
                  <button
                    type="button"
                    className="sim-chip-btn"
                    onClick={() => handleSimulateAdd('Kopi Sore', 25000)}
                  >
                    ☕ + Kopi 25rb
                  </button>
                  <button
                    type="button"
                    className="sim-chip-btn"
                    onClick={() => handleSimulateAdd('Bensin Motor', 35000)}
                  >
                    ⛽ + Bensin 35rb
                  </button>
                  <button
                    type="button"
                    className="sim-chip-btn"
                    onClick={() => handleSimulateAdd('Makan Siang', 50000)}
                  >
                    🍛 + Makan 50rb
                  </button>
                </div>

                {simFeedback && (
                  <div className="sim-toast-feedback" role="status">
                    <CheckCircle2 size={13} color="var(--primary)" />
                    <span>{simFeedback}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons inside Preview */}
              <div className="preview-action-row">
                <button
                  type="button"
                  className="btn-preview-demo"
                  onClick={onQuickDemo}
                  id="btn-preview-explore"
                >
                  Buka Dashboard Sekarang &rarr;
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 3. TRUST / IMPACT METRICS BAR */}
        <section className="landing-metrics-strip" aria-label="Statistik Icatat">
          <div className="metrics-inner">
            <div className="metric-col">
              <div className="metric-number">
                <Clock size={20} className="metric-icon" />
                <span>3 Detik</span>
              </div>
              <div className="metric-label">Waktu rata-rata kamu mencatat satu pengeluaran</div>
            </div>
            <div className="metric-divider" />
            <div className="metric-col">
              <div className="metric-number">
                <TrendingDown size={20} className="metric-icon text-expense" />
                <span>73%</span>
              </div>
              <div className="metric-label">Potensi kebocoran pos kecil yang berhasil diselamatkan</div>
            </div>
            <div className="metric-divider" />
            <div className="metric-col">
              <div className="metric-number">
                <ShieldCheck size={20} className="metric-icon text-primary" />
                <span>100%</span>
              </div>
              <div className="metric-label">Data tersimpan aman &amp; privat — tanpa iklan, tanpa penjualan data</div>
            </div>
            <div className="metric-divider" />
            <div className="metric-col">
              <div className="metric-number">
                <Sparkles size={20} className="metric-icon text-warning" />
                <span>0 Iklan</span>
              </div>
              <div className="metric-label">Bebas dari iklan pop-up yang mengganggu fokusmu</div>
            </div>
          </div>
        </section>

        {/* 4. BEFORE VS AFTER COMPARISON (TRANSFORMASI FINANSIAL KAMU) */}
        <section className="landing-comparison" aria-labelledby="comparison-heading">
          <div className="section-head text-center">
            <span className="section-badge">Perubahan Nyata</span>
            <h2 id="comparison-heading" className="section-title">
              Hidup Finansialmu: Sebelum vs Sesudah Pakai Icatat
            </h2>
            <p className="section-desc">
              Lihat bagaimana kebiasaan kecil selama 3 detik per hari bisa mengubah caramu mengelola uang selamanya.
            </p>
          </div>

          <div className="comparison-cards-grid">
            {/* Before Card */}
            <div className="comparison-card before-card">
              <div className="comp-card-badge before-badge">
                <AlertTriangle size={15} />
                <span>Sebelum Pakai Icatat</span>
              </div>
              <h3 className="comp-card-title">Finansial Penuh Tebak-Tebakan</h3>
              <ul className="comp-list">
                <li>
                  <span className="cross-icon" aria-hidden="true">&times;</span>
                  <span>Gaji baru masuk seminggu, tapi tiba-tiba saldo habis tanpa jejak.</span>
                </li>
                <li>
                  <span className="cross-icon" aria-hidden="true">&times;</span>
                  <span>Malas mencatat karena aplikasi lain terlalu rumit, berat, dan penuh iklan.</span>
                </li>
                <li>
                  <span className="cross-icon" aria-hidden="true">&times;</span>
                  <span>Tidak tahu pos mana yang bocor halus (kopi, jajan, biaya admin bank).</span>
                </li>
                <li>
                  <span className="cross-icon" aria-hidden="true">&times;</span>
                  <span>Selalu merasa cemas dan bersalah setiap kali mengecek saldo di ATM.</span>
                </li>
              </ul>
            </div>

            {/* After Card */}
            <div className="comparison-card after-card">
              <div className="comp-card-badge after-badge">
                <Check size={15} />
                <span>Sesudah Pakai Icatat</span>
              </div>
              <h3 className="comp-card-title">Kamu yang Pegang Kendali Penuh</h3>
              <ul className="comp-list">
                <li>
                  <span className="check-icon" aria-hidden="true">&#10003;</span>
                  <span>Kamu tahu persis ke mana setiap rupiah pergi hanya dalam 3 detik mencatat.</span>
                </li>
                <li>
                  <span className="check-icon" aria-hidden="true">&#10003;</span>
                  <span>Mencatat jadi kebiasaan ringan yang menyenangkan, cepat, dan tanpa beban.</span>
                </li>
                <li>
                  <span className="check-icon" aria-hidden="true">&#10003;</span>
                  <span>Diagram visual langsung memperingatkanmu sebelum dompetmu kebobolan.</span>
                </li>
                <li>
                  <span className="check-icon" aria-hidden="true">&#10003;</span>
                  <span>Tenang di akhir bulan karena ada sisa tabungan nyata untuk masa depanmu.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 5. FITUR + MANFAAT LENGKAP (FEATURE + BENEFIT COPYWRITING) */}
        <section className="landing-features" aria-labelledby="features-heading">
          <div className="section-head text-center">
            <span className="section-badge">Fitur & Manfaat Untukmu</span>
            <h2 id="features-heading" className="section-title">
              Setiap Fitur Diciptakan untuk Mengamankan Dompetmu
            </h2>
            <p className="section-desc">
              Bukan sekadar kalkulator biasa. Ini adalah sistem pencatatan cerdas yang berpihak sepenuhnya pada ketenangan finansialmu.
            </p>
          </div>

          <div className="features-grid">
            {/* Feature 1 */}
            <div className="feature-card">
              <div className="feature-top-row">
                <div className="feature-icon-wrap">
                  <Zap size={22} color="var(--primary)" />
                </div>
                <span className="feature-tag">Cepat & Praktis</span>
              </div>
              <h3>Input Kilat 3 Detik & Preset Cepat</h3>
              <p className="feature-desc">
                Dilengkapi shortcut nominal instan (+10rb, +50rb, +100rb) dan tombol kategori berkode warna.
              </p>
              <div className="feature-benefit-box">
                <strong>👉 Manfaat Untukmu:</strong>
                <span>Kamu tidak akan pernah malas atau lupa mencatat lagi. Transaksimu selesai tercatat dalam sekejap saat kamu masih berdiri di depan kasir.</span>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="feature-card">
              <div className="feature-top-row">
                <div className="feature-icon-wrap">
                  <BarChart2 size={22} color="var(--primary)" />
                </div>
                <span className="feature-tag">Analisis Cerdas</span>
              </div>
              <h3>Diagram Visual & Deteksi Bocor Halus</h3>
              <p className="feature-desc">
                Infografik visual yang mengelompokkan pengeluaran dan pemasukanmu secara transparan dan mudah dipahami.
              </p>
              <div className="feature-benefit-box">
                <strong>👉 Manfaat Untukmu:</strong>
                <span>Kamu langsung tahu pos mana yang paling rakus menyedot gajimu, sehingga kamu bisa mengerem pengeluaran sebelum terlambat.</span>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="feature-card">
              <div className="feature-top-row">
                <div className="feature-icon-wrap">
                  <ShieldCheck size={22} color="var(--primary)" />
                </div>
                <span className="feature-tag">100% Aman</span>
              </div>
              <h3>Privasi Terjaga, Tanpa Iklan</h3>
              <p className="feature-desc">
                Catatanmu tersimpan lokal di perangkatmu — atau aman di database cloud Supabase (PostgreSQL) dengan enkripsi dan Row Level Security saat kamu masuk akun. Tanpa iklan, tanpa pelacak iklan, dan datamu tidak pernah dijual ke pihak mana pun.
              </p>
              <div className="feature-benefit-box">
                <strong>👉 Manfaat Untukmu:</strong>
                <span>Ketenangan pikiran total. Rahasia finansialmu tetap jadi privasimu — tidak ada risiko datamu dijual ke pihak luar atau dipakai untuk penawaran pinjol.</span>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="feature-card">
              <div className="feature-top-row">
                <div className="feature-icon-wrap">
                  <Download size={22} color="var(--primary)" />
                </div>
                <span className="feature-tag">Fleksibel</span>
              </div>
              <h3>Ekspor Laporan Excel / CSV Sekali Klik</h3>
              <p className="feature-desc">
                Unduh seluruh rekaman transaksi dengan filter waktu dalam format file CSV standar yang siap dibuka di mana saja.
              </p>
              <div className="feature-benefit-box">
                <strong>👉 Manfaat Untukmu:</strong>
                <span>Bebas ribet rekap nota manual. Cocok saat kamu ingin evaluasi bulanan, rencana anggaran keluarga, atau arsip pribadi.</span>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="feature-card">
              <div className="feature-top-row">
                <div className="feature-icon-wrap">
                  <Smartphone size={22} color="var(--primary)" />
                </div>
                <span className="feature-tag">Mobile First</span>
              </div>
              <h3>Navigasi Bottom Bar Satu Jempol</h3>
              <p className="feature-desc">
                Desain tata letak antarmuka yang dioptimalkan khusus untuk layar ponsel dengan akses cepat di bawah layar.
              </p>
              <div className="feature-benefit-box">
                <strong>👉 Manfaat Untukmu:</strong>
                <span>Sangat nyaman digunakan saat kamu sedang berjalan atau bepergian. Cukup satu jempol untuk mengakses semua fitur favoritmu.</span>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="feature-card">
              <div className="feature-top-row">
                <div className="feature-icon-wrap">
                  <Moon size={22} color="var(--primary)" />
                </div>
                <span className="feature-tag">Kenyamanan</span>
              </div>
              <h3>Mode Gelap & Terang yang Sejuk</h3>
              <p className="feature-desc">
                Dukungan tema dark mode berstandar tinggi yang ramah baterai dan nyaman dipandang mata.
              </p>
              <div className="feature-benefit-box">
                <strong>👉 Manfaat Untukmu:</strong>
                <span>Matamu tidak akan silau saat kamu ingin mengevaluasi keuangan di tempat tidur malam hari sebelum beristirahat.</span>
              </div>
            </div>
          </div>
        </section>

        {/* 6. CARA KERJA 3 LANGKAH MUDAH */}
        <section className="landing-steps" aria-labelledby="steps-heading">
          <div className="section-head text-center">
            <span className="section-badge">Gampang Banget</span>
            <h2 id="steps-heading" className="section-title">
              3 Langkah Mudah Mengatur Uangmu Hari Ini
            </h2>
            <p className="section-desc">
              Tidak butuh kursus akuntansi. Siapa pun bisa langsung terbiasa dalam sekali coba.
            </p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h4>Buka Aplikasi Saat Transaksi</h4>
              <p>Begitu kamu membayar kopi, belanja kebutuhan, atau terima transferan gaji, langsung buka Icatat di ponselmu.</p>
            </div>

            <div className="step-card">
              <div className="step-number">2</div>
              <h4>Ketuk Nominal Kilat</h4>
              <p>Gunakan tombol nominal instan atau ketik angkamu, pilih kategori ikon yang sesuai, lalu simpan dalam 3 detik.</p>
            </div>

            <div className="step-card">
              <div className="step-number">3</div>
              <h4>Pantau & Nikmati Tabunganmu</h4>
              <p>Lihat grafik mingguan dan bulananmu menjadi sehat. Nikmati rasa bangga saat melihat tabunganmu terus bertambah.</p>
            </div>
          </div>
        </section>

        {/* 7. FAQ (PERTANYAAN UMUM) */}
        <section className="landing-faq" aria-labelledby="faq-heading">
          <div className="section-head text-center">
            <span className="section-badge">FAQ</span>
            <h2 id="faq-heading" className="section-title">
              Pertanyaan yang Sering Diajukan
            </h2>
            <p className="section-desc">
              Semua yang perlu kamu ketahui sebelum memulai perjalanan finansial yang lebih tenang.
            </p>
          </div>

          <div className="faq-accordion-wrap">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className={`faq-item ${isOpen ? 'active' : ''}`}>
                  <button
                    type="button"
                    className="faq-question-btn"
                    onClick={() => toggleFaq(idx)}
                    id={`faq-btn-${idx}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${idx}`}
                  >
                    <span className="faq-question-text">{faq.q}</span>
                    <ChevronDown size={18} className={`faq-chevron ${isOpen ? 'rotated' : ''}`} aria-hidden="true" />
                  </button>
                  {isOpen && (
                    <div
                      id={`faq-answer-${idx}`}
                      className="faq-answer-content"
                      role="region"
                      aria-labelledby={`faq-btn-${idx}`}
                    >
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* 8. FINAL CONVERSION CTA BANNER */}
        <section className="landing-bottom-cta" aria-labelledby="bottom-cta-heading">
          <div className="bottom-cta-card">
            <div className="bottom-cta-badge">
              <Sparkles size={14} />
              <span>Waktunya Mengambil Keputusan Terbaik Untukmu</span>
            </div>

            <h2 id="bottom-cta-heading" className="bottom-cta-title">
              Siap Berhenti Boncos dan Menabung Lebih Tenang Mulai Bulan Ini?
            </h2>

            <p className="bottom-cta-subtitle">
              Kamu bekerja keras untuk setiap rupiah yang kamu hasilkan. Jangan biarkan gajimu habis tanpa jejak.
              Kendalikan keuanganmu sekarang bersama Icatat — gratis, cepat, dan tanpa ribet.
            </p>

            <div className="bottom-cta-buttons">
              <button
                type="button"
                className="btn-bottom-primary"
                onClick={() => onGoToAuth('register')}
                id="btn-bottom-register"
              >
                <span>Daftar Akun Gratis Sekarang</span>
                <ArrowRight size={18} />
              </button>

              <button
                type="button"
                className="btn-bottom-secondary"
                onClick={() => onGoToAuth('login')}
                id="btn-bottom-login"
              >
                <UserCheck size={18} />
                <span>Masuk ke Akunmu</span>
              </button>

              <button
                type="button"
                className="btn-bottom-demo"
                onClick={onQuickDemo}
                id="btn-bottom-demo"
              >
                <span>Eksplorasi Mode Demo</span>
              </button>
            </div>

            <div className="bottom-cta-guarantee">
              <CheckCircle2 size={15} color="#4ade80" />
              <span>Gratis tanpa kartu kredit &bull; Bebas akses perbankan &bull; Langsung bisa kamu pakai</span>
            </div>
          </div>
        </section>
      </main>

      {/* 9. FOOTER */}
      <footer className="landing-footer" role="contentinfo">
        <div className="footer-inner">
          <div className="footer-brand-side">
            <div className="brand-wrapper">
              <img src="/logo.png" alt="Icatat Logo" className="brand-logo-img" />
              <span className="brand-title">Icatat</span>
            </div>
            <p className="footer-tagline">
              Aplikasi pencatatan keuangan pribadi harian yang cepat, privat, dan dirancang khusus agar kamu terbebas dari boncos.
            </p>
          </div>

          <div className="footer-links-side">
            <div className="footer-link-group">
              <strong>Mulai Cepat</strong>
              <button type="button" onClick={() => onGoToAuth('register')} className="footer-btn-link">Daftar Akun Baru</button>
              <button type="button" onClick={() => onGoToAuth('login')} className="footer-btn-link">Masuk Akun</button>
              <button type="button" onClick={onQuickDemo} className="footer-btn-link">Coba Demo Gratis</button>
            </div>
            <div className="footer-link-group">
              <strong>Keunggulan</strong>
              <span>Input 3 Detik</span>
              <span>Privasi Terjaga</span>
              <span>Ekspor Laporan CSV</span>
            </div>
            <div className="footer-link-group">
              <strong>Informasi</strong>
              <button type="button" onClick={onOpenPrivacy} className="footer-btn-link">Kebijakan Privasi</button>
            </div>
          </div>
        </div>

        <div className="footer-bottom-copy">
          <div>&copy; {new Date().getFullYear()} <strong>Icatat</strong>. Dibuat dengan penuh cinta untuk kesehatan finansialmu.</div>
        </div>
      </footer>
    </div>
  );
}
