import React from 'react';
import CategoryAnalysis from '../components/CategoryAnalysis';
import { Download, FileSpreadsheet, Calendar, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { formatRupiah } from '../utils/formatters';

export default function ReportView({ transactions, summary, onExportCSV }) {
  return (
    <div className="report-view-wrapper">
      {/* Top Header & Actions */}
      <div className="section-header-row" style={{ marginBottom: '1.25rem' }}>
        <div>
          <h2 className="section-title">Laporan & Infografik</h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Rekap performa dan visualisasi alokasi keuangan
          </p>
        </div>

        <button
          type="button"
          className="btn-primary-add"
          onClick={onExportCSV}
          title="Unduh laporan CSV"
        >
          <Download size={16} />
          <span>Ekspor CSV</span>
        </button>
      </div>

      {/* Visual Report Component */}
      <CategoryAnalysis transactions={transactions} />
    </div>
  );
}
