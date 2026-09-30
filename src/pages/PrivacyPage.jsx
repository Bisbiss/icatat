import React from 'react';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

const LAST_UPDATED = '30 September 2026';

export default function PrivacyPage({ onBack }) {
  return (
    <div className="privacy-page">
      <div className="privacy-container">
        <button type="button" className="privacy-back-btn" onClick={onBack}>
          <ArrowLeft size={16} />
          <span>Kembali ke Beranda</span>
        </button>

        <div className="privacy-header">
          <div className="privacy-icon-wrap">
            <ShieldCheck size={26} color="var(--primary)" />
          </div>
          <h1>Kebijakan Privasi</h1>
          <p className="privacy-updated">Terakhir diperbarui: {LAST_UPDATED}</p>
        </div>

        <div className="privacy-body">
          <p>
            Icatat ("kami") menghargai privasimu. Kebijakan ini menjelaskan data apa yang
            kami simpan, bagaimana data tersebut digunakan, dan hak apa yang kamu miliki
            atas datamu. Dengan menggunakan Icatat, kamu dianggap telah membaca dan
            memahami kebijakan ini.
          </p>

          <h2>1. Data yang kami simpan</h2>
          <p><strong>Mode demo / tanpa akun:</strong> seluruh catatan transaksimu tersimpan
            secara lokal di browser perangkatmu (<em>localStorage</em>). Data ini tidak
            dikirim ke server kami dan hanya bisa diakses dari perangkat &amp; browser
            yang sama.</p>
          <p><strong>Dengan akun:</strong> saat kamu mendaftar dan masuk, kami menyimpan
            alamat email, nama tampilan, serta catatan transaksimu di database cloud
            (Supabase) agar datamu tersinkron antar perangkat. Akses data dilindungi
            dengan <em>Row Level Security</em> sehingga hanya kamu yang dapat membaca
            dan mengubah datamu sendiri.</p>

          <h2>2. Hal yang TIDAK kami lakukan</h2>
          <ul>
            <li>Kami <strong>tidak pernah menjual</strong> data keuanganmu ke pihak ketiga, biro pinjol, atau pengiklan.</li>
            <li>Kami <strong>tidak memasang iklan</strong> dan tidak memakai pelacak iklan pihak ketiga.</li>
            <li>Kami <strong>tidak terhubung</strong> ke rekening bank, kartu kredit/debit, atau m-Banking-mu. Semua transaksi dicatat manual olehmu sendiri.</li>
            <li>Kami tidak meminta data sensitif seperti nomor rekening, PIN, atau password bank.</li>
          </ul>

          <h2>3. Layanan pihak ketiga</h2>
          <p>Agar aplikasi berjalan, kami memakai layanan berikut — dan hanya berikut:</p>
          <ul>
            <li><strong>Supabase</strong> — database &amp; autentikasi akun (hanya saat kamu memakai akun).</li>
            <li><strong>Cloudflare</strong> — hosting &amp; jaringan pengiriman konten (CDN) situs ini.</li>
          </ul>
          <p>Font yang dipakai situs ini di-<em>host</em> langsung dari server kami, sehingga
            browser-mu tidak perlu meminta apa pun ke penyedia font pihak ketiga.</p>

          <h2>4. Keamanan data</h2>
          <p>Seluruh komunikasi antara perangkatmu dan server kami berjalan di atas
            koneksi HTTPS terenkripsi. Data akun di database cloud dilindungi aturan
            akses baris (<em>Row Level Security</em>) milik Supabase. Meski begitu, tidak
            ada sistem yang 100% kebal — gunakan password yang kuat dan jangan bagikan
            kredensial akunmu ke siapa pun.</p>

          <h2>5. Hak kamu atas datamu</h2>
          <ul>
            <li><strong>Ekspor:</strong> unduh seluruh riwayat transaksimu kapan saja lewat menu Laporan → Ekspor CSV.</li>
            <li><strong>Hapus data lokal:</strong> gunakan tombol "Kosongkan Semua Transaksi" di menu Pengaturan untuk menghapus seluruh catatan di perangkatmu.</li>
            <li><strong>Hapus akun:</strong> kamu dapat meminta penghapusan akun beserta seluruh data cloud-mu kapan saja dengan menghubungi tim Icatat melalui kanal resmi yang tersedia di situs ini.</li>
          </ul>

          <h2>6. Perubahan kebijakan</h2>
          <p>Jika kebijakan ini berubah, tanggal "Terakhir diperbarui" di atas akan
            kami sesuaikan. Perubahan signifikan akan kami umumkan di situs ini.</p>

          <h2>7. Hubungi kami</h2>
          <p>Pertanyaan seputar privasi dan datamu? Hubungi tim Icatat melalui kanal
            resmi yang tersedia di situs ini — kami akan merespons secepatnya.</p>
        </div>
      </div>
    </div>
  );
}
