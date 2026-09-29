import React from 'react';
import { LayoutDashboard, ArrowLeftRight, BarChart3, Settings, Plus } from 'lucide-react';

export default function BottomNav({ activeTab, setActiveTab, onOpenAddModal }) {
  return (
    <nav className="bottom-nav-bar" aria-label="Navigasi Bawah">
      <div className="bottom-nav-inner">
        {/* Tab 1: Dashboard */}
        <button
          type="button"
          className={`bottom-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
          aria-label="Dashboard"
        >
          <div className="nav-icon-container">
            <LayoutDashboard size={20} />
          </div>
          <span className="bottom-nav-label">Dashboard</span>
        </button>

        {/* Tab 2: Transaksi */}
        <button
          type="button"
          className={`bottom-nav-item ${activeTab === 'transaksi' ? 'active' : ''}`}
          onClick={() => setActiveTab('transaksi')}
          aria-label="Transaksi"
        >
          <div className="nav-icon-container">
            <ArrowLeftRight size={20} />
          </div>
          <span className="bottom-nav-label">Transaksi</span>
        </button>

        {/* Quick Add Floating Center Action */}
        <div className="bottom-nav-center-action">
          <button
            type="button"
            className="bottom-add-btn"
            onClick={onOpenAddModal}
            aria-label="Tambah Transaksi Cepat"
            title="Tambah Transaksi"
          >
            <Plus size={24} strokeWidth={2.5} />
          </button>
        </div>

        {/* Tab 3: Report */}
        <button
          type="button"
          className={`bottom-nav-item ${activeTab === 'report' ? 'active' : ''}`}
          onClick={() => setActiveTab('report')}
          aria-label="Report"
        >
          <div className="nav-icon-container">
            <BarChart3 size={20} />
          </div>
          <span className="bottom-nav-label">Report</span>
        </button>

        {/* Tab 4: Setting */}
        <button
          type="button"
          className={`bottom-nav-item ${activeTab === 'setting' ? 'active' : ''}`}
          onClick={() => setActiveTab('setting')}
          aria-label="Setting"
        >
          <div className="nav-icon-container">
            <Settings size={20} />
          </div>
          <span className="bottom-nav-label">Setting</span>
        </button>
      </div>
    </nav>
  );
}
