import React from 'react';
import {
  LogOut,
  Building2,
  PhoneCall,
  Search,
  AlertTriangle,
  Landmark,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { ViewType, UserSession } from '../types';

interface NavbarProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
  user: UserSession | null;
  onLogout: () => void;
  ticketCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  user,
  onLogout,
  ticketCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0A1E3F] text-white shadow-md">
      {/* Top Banking Assistance & Emergency Helpline Strip (Indian Bank NetBanking Standard) */}
      <div className="bg-[#071630] border-b border-blue-950/60 px-4 py-1.5 text-xs text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3 sm:gap-5 flex-wrap">
            <div className="flex items-center gap-1.5 text-amber-300 font-medium">
              <PhoneCall className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>24x7 Customer Care:</span>
              <a href="tel:18002026161" className="font-bold hover:underline tracking-wide">
                1800 202 6161
              </a>
              <span className="text-slate-400 font-normal hidden sm:inline">(Toll-Free)</span>
            </div>

            <span className="hidden md:inline text-blue-900">|</span>

            <div className="hidden sm:flex items-center gap-1.5 text-red-300">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
              <span>Card / UPI Emergency Block:</span>
              <a href="tel:18001204433" className="font-bold hover:underline tracking-wide">
                1800 120 4433
              </a>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-4 text-[11px] text-slate-300">
            <span className="inline-flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              RBI Licensed Scheduled Commercial Bank
            </span>
            <span className="text-blue-900">|</span>
            <span className="text-slate-400">Security Tip: Never share OTP or PIN</span>
          </div>
        </div>
      </div>

      {/* Main Brand & NetBanking Information Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <div
          onClick={() => user && onNavigate('dashboard')}
          className={`flex items-center gap-3 ${user ? 'cursor-pointer group' : ''}`}
        >
          <div className="w-11 h-11 rounded-lg bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 p-0.5 shadow-sm">
            <div className="w-full h-full bg-[#0A1E3F] rounded-[7px] flex items-center justify-center">
              <Landmark className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold tracking-tight text-white font-serif">INDIA BANK</span>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded">
                NetBanking
              </span>
            </div>
            <p className="text-[11px] text-blue-200 tracking-wide">Apka Vishwas, Hamara Prayas</p>
          </div>
        </div>

        {/* Customer Profile & Session Information (Visible when logged in) */}
        {user ? (
          <div className="flex items-center gap-4">
            {/* Search Bar (Real Bank Style) */}
            <div className="hidden xl:flex items-center relative w-64">
              <input
                type="text"
                placeholder="Search services, cheques..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-md bg-blue-950/70 border border-blue-800/80 text-white placeholder-blue-300/60 focus:outline-none focus:border-amber-400"
              />
              <Search className="w-3.5 h-3.5 text-blue-300 absolute left-2.5" />
            </div>

            {/* User Session Info */}
            <div className="hidden sm:flex flex-col text-right">
              <div className="text-xs font-semibold text-white truncate max-w-[190px]">
                Welcome, <span className="text-amber-300">{user.name}</span>
              </div>
              <div className="text-[11px] text-blue-200 font-mono">
                Cust ID: 73589410 &bull; A/C: {user.accountNumber}
              </div>
            </div>

            <div className="w-9 h-9 rounded-full bg-blue-900 border border-amber-400/40 flex items-center justify-center text-amber-300 font-bold text-xs shadow-inner">
              {user.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase() || 'IB'}
            </div>

            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-red-600/80 hover:bg-red-600 rounded-md transition-colors cursor-pointer shadow-xs border border-red-500/40"
              title="Securely log out from India Bank NetBanking"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-amber-300 bg-blue-950/80 px-3 py-1.5 rounded-lg border border-blue-900">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span className="font-semibold tracking-wide">SECURE 256-BIT NETBANKING</span>
          </div>
        )}
      </div>

      {/* NetBanking Service Navigation Bar (Modeled after HDFC & ICICI NetBanking) */}
      {user && (
        <div className="bg-[#0E2854] border-t border-blue-900/80 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto scrollbar-none py-1">
            <nav className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium whitespace-nowrap">
              {/* Accounts & Deposits Tab */}
              <button
                onClick={() => onNavigate('dashboard')}
                className={`px-3.5 py-2 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer ${
                  currentView === 'dashboard'
                    ? 'bg-white text-[#0A1E3F] font-bold shadow-xs'
                    : 'text-blue-100 hover:text-white hover:bg-blue-900/60'
                }`}
              >
                <Building2 className="w-4 h-4 text-amber-500" />
                <span>Accounts &amp; Deposits</span>
              </button>

              {/* Funds Transfer Tab */}
              <button
                onClick={() => {
                  if (currentView !== 'dashboard') onNavigate('dashboard');
                  setTimeout(() => {
                    const el = document.getElementById('quick-transfer-action');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="px-3 py-2 text-blue-100 hover:text-white hover:bg-blue-900/60 rounded-md transition-colors cursor-pointer"
              >
                <span>Funds Transfer (IMPS/NEFT)</span>
              </button>

              {/* Cards & BillPay */}
              <button
                onClick={() => {
                  if (currentView !== 'dashboard') onNavigate('dashboard');
                }}
                className="px-3 py-2 text-blue-100 hover:text-white hover:bg-blue-900/60 rounded-md transition-colors cursor-pointer hidden md:inline-flex"
              >
                <span>Cards &amp; BillPay</span>
              </button>

              {/* Service Requests Tab */}
              <button
                onClick={() => {
                  if (currentView !== 'dashboard') onNavigate('dashboard');
                  setTimeout(() => {
                    const el = document.getElementById('service-requests-widget');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="px-3 py-2 text-blue-100 hover:text-white hover:bg-blue-900/60 rounded-md transition-colors cursor-pointer hidden sm:inline-flex"
              >
                <span>Service Requests</span>
              </button>

              {/* Customer Care & Complaints Portal (Mimics Real Bank Support & Grievance tab) */}
              <button
                onClick={() => onNavigate('complaint')}
                className={`px-3.5 py-2 rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                  currentView === 'complaint'
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                    : 'bg-amber-500/20 text-amber-200 hover:bg-amber-500/30 border border-amber-400/40'
                }`}
              >
                <PhoneCall className={`w-3.5 h-3.5 ${currentView === 'complaint' ? 'text-slate-950' : 'text-amber-300'}`} />
                <span>Customer Care &amp; Grievance</span>
                {ticketCount > 0 && (
                  <span className="px-1.5 py-0.2 text-[10px] bg-red-600 text-white rounded-full font-bold ml-0.5">
                    {ticketCount}
                  </span>
                )}
              </button>
            </nav>

            <div className="hidden lg:flex items-center gap-2 text-xs text-blue-200">
              <span className="text-amber-300 font-semibold">Home Branch:</span>
              <span>Mumbai Main (IFSC: INDB0001089)</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
