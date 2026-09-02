import React, { useState } from 'react';
import {
  ArrowRight,
  Landmark,
  Building2,
  Lock,
  ChevronRight,
  MessageSquare,
  Sparkles,
  Search,
  Filter,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  PhoneCall,
} from 'lucide-react';
import {
  BankAccount,
  Transaction,
  SpendingCategory,
  CreditScoreData,
  UserSession,
} from '../types';
import { QuickActionsGrid, QuickActionType } from './dashboard/QuickActionsGrid';
import { SpendingDonutChart } from './dashboard/SpendingDonutChart';
import { CreditScoreGauge } from './dashboard/CreditScoreGauge';

interface NexoraDashboardProps {
  user: UserSession;
  accounts: BankAccount[];
  transactions: Transaction[];
  spendingCategories: SpendingCategory[];
  creditData: CreditScoreData;
  onOpenActionModal: (actionType: string) => void;
  onSelectNavTab: (tab: any) => void;
  onOpenAssistant: () => void;
  onSelectAccount?: (account: BankAccount) => void;
}

export const NexoraDashboard: React.FC<NexoraDashboardProps> = ({
  user,
  accounts,
  transactions,
  spendingCategories,
  creditData,
  onOpenActionModal,
  onSelectNavTab,
  onOpenAssistant,
  onSelectAccount,
}) => {
  // Determine greeting based on current local hour
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = user.name.split(' ')[0] || 'Ananya';

  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);

  // Helper for transaction merchant icon/avatar
  const renderTxnAvatar = (txn: Transaction) => {
    if (txn.iconType === 'amazon') {
      return (
        <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-900 font-black text-sm flex items-center justify-center border border-amber-100 shrink-0">
          a
        </div>
      );
    }
    if (txn.iconType === 'salary') {
      return (
        <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0">
          <Building2 className="w-5 h-5" />
        </div>
      );
    }
    if (txn.iconType === 'swiggy') {
      return (
        <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 font-bold flex items-center justify-center border border-orange-100 shrink-0">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5V11c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5.5zm0-8c0 .55-.45 1-1 1s-1-.45-1-1 .45-1 1-1 1 .45 1 1z" />
          </svg>
        </div>
      );
    }
    if (txn.iconType === 'electricity') {
      return (
        <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shrink-0">
          <Zap className="w-5 h-5" />
        </div>
      );
    }
    return (
      <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
        <Landmark className="w-5 h-5" />
      </div>
    );
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-[#FAFBFD] min-h-[calc(100vh-61px)] text-left">
      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-12 gap-6 sm:gap-8">
        {/* ============================================================ */}
        {/* LEFT & CENTER COLUMN (Span 8 on XL)                          */}
        {/* ============================================================ */}
        <div className="xl:col-span-8 space-y-6 sm:space-y-7">
          {/* Greeting Headline */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>{greeting},</span>
              <span className="text-[#4F46E5]">{firstName}</span>
              <span className="text-2xl sm:text-3xl">👋</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Here's what's happening with your accounts today.
            </p>
          </div>

          {/* Exclusive Offer Banner matching screenshot */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#100732] via-[#1E1156] to-[#3B1E91] text-white p-6 sm:p-7 shadow-lg border border-indigo-900/40">
            {/* Subtle light mesh accent */}
            <div className="absolute top-0 right-1/4 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="max-w-md space-y-3">
                <span className="inline-block text-[11px] font-bold tracking-wide uppercase text-indigo-300 bg-white/10 px-3 py-1 rounded-full backdrop-blur-xs">
                  Exclusive offer for you!
                </span>

                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white leading-snug">
                  Get up to 6.75% p.a. on your Fixed Deposit.
                </h2>

                <div className="pt-1">
                  <button
                    onClick={() => onOpenActionModal('open-fd')}
                    className="px-5 py-2.5 rounded-full border border-white/80 text-white text-xs sm:text-sm font-semibold hover:bg-white hover:text-[#1E1156] transition-all duration-200 cursor-pointer shadow-xs"
                  >
                    Explore Now
                  </button>
                </div>
              </div>

              {/* 3D Piggy bank visual matching screenshot */}
              <div className="relative w-44 h-40 sm:w-52 sm:h-44 shrink-0 self-center sm:self-auto flex items-center justify-center">
                <img
                  src="./assets/piggy_bank.jpg"
                  alt="3D Piggy Bank Fixed Deposit Offer"
                  className="w-full h-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    // Fallback visually if image loading differs
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
            </div>
          </div>

          {/* Grievance & Dispute Redressal Desk Card (Direct access to complaint structure) */}
          <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-white border border-amber-200/90 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                <PhoneCall className="w-6 h-6" />
              </div>
              <div className="space-y-1 text-left">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                    Customer Grievance &amp; Dispute Redressal Desk
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 uppercase">
                    &lt; 24h Resolution
                  </span>
                </div>
                <p className="text-xs text-slate-600 max-w-xl leading-relaxed">
                  Lodge official service inquiries, cheque book dispatch disputes, or tax statements with guaranteed turnaround under 24 hours. Features 3 instant pre-fill templates.
                </p>
              </div>
            </div>
            <button
              onClick={() => onSelectNavTab('complaints')}
              className="px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shrink-0 transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <span>Lodge Grievance</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* ============================================================ */}
          {/* Section: Accounts at a glance                                */}
          {/* ============================================================ */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Accounts at a glance
              </h3>
              <button
                onClick={() => onSelectNavTab('accounts')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors cursor-pointer"
              >
                View all accounts
              </button>
            </div>

            {/* 3 Account Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 1. Savings Account */}
              <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between text-left group">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Landmark className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">
                        Savings Account
                      </h4>
                      <p className="text-[11px] text-slate-400 font-mono">
                        XXXX 1234
                      </p>
                    </div>
                  </div>

                  <div className="space-y-0.5 mb-5">
                    <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight block">
                      ₹1,24,560.50
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      Available Balance
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onSelectNavTab('accounts')}
                  className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors group-hover:translate-x-0.5 cursor-pointer pt-2 border-t border-slate-50"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 2. Current Account */}
              <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between text-left group">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">
                        Current Account
                      </h4>
                      <p className="text-[11px] text-slate-400 font-mono">
                        XXXX 5678
                      </p>
                    </div>
                  </div>

                  <div className="space-y-0.5 mb-5">
                    <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight block">
                      ₹8,75,000.00
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      Available Balance
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onSelectNavTab('accounts')}
                  className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors group-hover:translate-x-0.5 cursor-pointer pt-2 border-t border-slate-50"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 3. Fixed Deposit */}
              <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between text-left group">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">
                        Fixed Deposit
                      </h4>
                      <p className="text-[11px] text-slate-400 font-mono">
                        XXXX 9101
                      </p>
                    </div>
                  </div>

                  <div className="space-y-0.5 mb-5">
                    <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight block">
                      ₹5,00,000.00
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      Matures on 12 Sep 2026
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onSelectNavTab('investments')}
                  className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors group-hover:translate-x-0.5 cursor-pointer pt-2 border-t border-slate-50"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* Section: Recent transactions                                */}
          {/* ============================================================ */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Recent transactions
              </h3>
              <button
                onClick={() => onSelectNavTab('accounts')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors cursor-pointer"
              >
                View all
              </button>
            </div>

            {/* Transactions List matching screenshot */}
            <div className="bg-white rounded-3xl p-3 sm:p-4 border border-slate-100 shadow-xs divide-y divide-slate-100">
              {transactions.slice(0, 4).map((txn) => {
                const isCredit = txn.type === 'credit';
                return (
                  <div
                    key={txn.id}
                    onClick={() => setSelectedTxn(txn)}
                    className="p-3 sm:p-3.5 flex items-center justify-between hover:bg-slate-50/80 rounded-2xl transition-all cursor-pointer group"
                  >
                    {/* Left: Icon & Merchant / Category */}
                    <div className="flex items-center gap-3 sm:gap-3.5">
                      {renderTxnAvatar(txn)}
                      <div>
                        <h5 className="font-bold text-slate-900 text-xs sm:text-sm">
                          {txn.merchant}
                        </h5>
                        <p className="text-[11px] text-slate-400 font-medium">
                          {txn.category}
                        </p>
                      </div>
                    </div>

                    {/* Right: Amount, Date, Chevron */}
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="text-right">
                        <span
                          className={`text-xs sm:text-sm font-black tracking-tight block ${
                            isCredit ? 'text-emerald-600' : 'text-slate-900'
                          }`}
                        >
                          {isCredit ? '+ ' : '- '}₹
                          {txn.amount.toLocaleString('en-IN', {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                        <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium">
                          {txn.date}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* RIGHT COLUMN (Span 4 on XL)                                  */}
        {/* ============================================================ */}
        <div className="xl:col-span-4 space-y-6">
          {/* 1. Quick actions grid */}
          <QuickActionsGrid
            onActionClick={(action) => {
              if (action === 'more') {
                onSelectNavTab('services');
              } else {
                onOpenActionModal(action);
              }
            }}
          />

          {/* 2. Spending insights Donut Chart */}
          <SpendingDonutChart categories={spendingCategories} />

          {/* 3. Your credit score Speedometer Gauge */}
          <CreditScoreGauge
            creditData={creditData}
            onViewReport={() => onOpenActionModal('credit-report')}
          />

          {/* 4. Need help? Card matching screenshot */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs flex items-center justify-between text-left">
            <div>
              <h4 className="font-bold text-slate-900 text-sm">
                Need help?
              </h4>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Chat with our Virtual Assistant
              </p>
              <span className="text-[10px] text-slate-400 mt-1 inline-block">
                24x7 support
              </span>
            </div>

            <button
              onClick={onOpenAssistant}
              className="w-12 h-12 rounded-2xl bg-[#4F46E5] text-white flex items-center justify-center hover:bg-[#4338CA] hover:scale-105 shadow-md shadow-indigo-200 transition-all duration-200 cursor-pointer shrink-0"
              aria-label="Chat with Assistant"
            >
              <MessageSquare className="w-5 h-5 fill-current" />
            </button>
          </div>
        </div>
      </div>

      {/* Transaction Detail Drawer Modal (Optional drill-down) */}
      {selectedTxn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl border border-slate-100 p-6 text-left relative animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-400 uppercase">
                Transaction Details
              </span>
              <button
                onClick={() => setSelectedTxn(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="py-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-2">
                {renderTxnAvatar(selectedTxn)}
              </div>
              <h4 className="font-bold text-slate-900 text-base">
                {selectedTxn.merchant}
              </h4>
              <p className="text-2xl font-black text-slate-900 mt-1">
                {selectedTxn.type === 'credit' ? '+ ' : '- '}₹
                {selectedTxn.amount.toLocaleString('en-IN', {
                  minimumFractionDigits: 2,
                })}
              </p>
              <span className="inline-block text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full mt-1 border border-emerald-200/60">
                {selectedTxn.status}
              </span>
            </div>

            <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <div className="flex justify-between">
                <span>Category:</span>
                <span className="font-bold text-slate-800">{selectedTxn.category}</span>
              </div>
              <div className="flex justify-between">
                <span>Date & Time:</span>
                <span className="font-bold text-slate-800">{selectedTxn.date}</span>
              </div>
              <div className="flex justify-between">
                <span>Reference ID:</span>
                <span className="font-mono text-slate-800">{selectedTxn.reference}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedTxn(null)}
              className="mt-5 w-full py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
