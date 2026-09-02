import React, { useState } from 'react';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  Building2,
  LifeBuoy,
  MessageSquareWarning,
  Send,
  Download,
  Shield,
  FileText,
  Clock,
  CheckCircle,
  ChevronRight,
  Eye,
  EyeOff,
  AlertCircle,
  BookOpen,
  PhoneCall,
  Sparkles,
  RefreshCw,
  Landmark
} from 'lucide-react';
import { UserSession, BankAccount, Transaction, ComplaintTicket } from '../types';
import { INITIAL_ACCOUNTS, INITIAL_TRANSACTIONS } from '../data/mockData';

interface DashboardViewProps {
  user: UserSession;
  onNavigateToComplaint: () => void;
  recentTickets: ComplaintTicket[];
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  onNavigateToComplaint,
  recentTickets,
}) => {
  const [selectedAccount, setSelectedAccount] = useState<BankAccount>(INITIAL_ACCOUNTS[0]);
  const [transactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [filterType, setFilterType] = useState<'all' | 'debit' | 'credit'>('all');
  const [showCardNumber, setShowCardNumber] = useState(false);
  const [statementSuccessMsg, setStatementSuccessMsg] = useState('');

  // Extract friendly display name from email (e.g. shivansh.mishra -> Shivansh Mishra)
  const getDisplayName = (email: string) => {
    try {
      const namePart = email.split('@')[0];
      return namePart
        .split(/[._-]/)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');
    } catch {
      return 'Client';
    }
  };

  const displayName = getDisplayName(user.email);

  const filteredTransactions = transactions.filter((t) => {
    if (filterType === 'all') return true;
    return t.type === filterType;
  });

  const handleDownloadStatement = () => {
    setStatementSuccessMsg('Official PDF statement for AC1000234567 generated and dispatched to your registered email.');
    setTimeout(() => setStatementSuccessMsg(''), 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Greeting & Account Summary Banner */}
      <div className="card bg-white border border-slate-200 rounded-xl p-6 sm:p-7 shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                KYC Verified &bull; Active
              </span>
              <span className="text-xs text-slate-500 font-mono">Account No: AC1000234567</span>
              <span className="hidden sm:inline text-slate-300">|</span>
              <span className="hidden sm:inline text-xs text-slate-500">IFSC: INDB0001089</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-serif">
              Namaste, <span className="text-blue-900">{displayName}</span>
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              India Bank NetBanking Portal &bull; Fort Mumbai Branch &bull; Customer Care: 1800 202 6161 (24x7)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              id="raise-complaint-top-btn"
              onClick={onNavigateToComplaint}
              className="px-4 py-2.5 rounded-lg bg-[#0A1E3F] hover:bg-[#0E2854] text-white font-semibold text-xs sm:text-sm shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <MessageSquareWarning className="w-4 h-4 text-amber-400" />
              <span>Customer Care &amp; Grievance</span>
            </button>

            <button
              onClick={handleDownloadStatement}
              className="px-3.5 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-medium text-xs sm:text-sm transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Download e-Statement</span>
            </button>
          </div>
        </div>

        {statementSuccessMsg && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2 animate-fadeIn">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{statementSuccessMsg}</span>
          </div>
        )}
      </div>

      {/* Main Account Balance & Digital Card Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Account Balance Overview & Transactions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Primary Balance Hero Card (Deep Navy Indian Bank Palette) */}
          <div className="card p-6 sm:p-7 bg-[#0A1E3F] text-white rounded-xl shadow-sm border border-blue-950">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-blue-900/80">
              <div>
                <div className="text-xs uppercase tracking-widest text-blue-200 font-semibold mb-1 flex items-center gap-1.5">
                  <Wallet className="w-3.5 h-3.5 text-amber-400" />
                  <span>Available Balance ({selectedAccount.name})</span>
                </div>
                <div className="mt-2 flex items-baseline gap-3">
                  <div className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight font-sans">
                    ₹{selectedAccount.balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-900/80 text-amber-300 border border-amber-400/30">
                    INR
                  </span>
                </div>
                <div className="text-xs text-emerald-400 font-medium mt-2 flex items-center gap-1">
                  <span>A/C: {selectedAccount.accountNumber}</span>
                  <span className="text-blue-800">&bull;</span>
                  <span className="text-blue-200 font-normal">Immediate NEFT/RTGS/IMPS Available</span>
                </div>
              </div>

              {/* Account Quick Selector Tabs */}
              <div className="flex flex-wrap gap-2">
                {INITIAL_ACCOUNTS.map((acc) => (
                  <button
                    key={acc.id}
                    onClick={() => setSelectedAccount(acc)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      selectedAccount.id === acc.id
                        ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                        : 'bg-blue-950/80 text-blue-200 hover:text-white hover:bg-blue-900 border border-blue-900'
                    }`}
                  >
                    {acc.type}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Banking Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5">
              <div className="bg-blue-950/60 p-3 rounded-lg border border-blue-900/60">
                <div className="text-[11px] font-medium text-blue-300 flex items-center gap-1">
                  <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Monthly Inflow</span>
                </div>
                <div className="text-base font-bold text-emerald-400 mt-1">₹1,47,940</div>
              </div>
              <div className="bg-blue-950/60 p-3 rounded-lg border border-blue-900/60">
                <div className="text-[11px] font-medium text-blue-300 flex items-center gap-1">
                  <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
                  <span>Monthly Outflow</span>
                </div>
                <div className="text-base font-bold text-slate-200 mt-1">₹40,120</div>
              </div>
              <div className="bg-blue-950/60 p-3 rounded-lg border border-blue-900/60">
                <div className="text-[11px] font-medium text-blue-300 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>IFSC Code</span>
                </div>
                <div className="text-base font-mono text-amber-200 mt-1">INDB0001089</div>
              </div>
              <div className="bg-blue-950/60 p-3 rounded-lg border border-blue-900/60">
                <div className="text-[11px] font-medium text-blue-300 flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  <span>DICGC Coverage</span>
                </div>
                <div className="text-base font-semibold text-emerald-300 mt-1">Upto ₹5 Lakhs</div>
              </div>
            </div>

            {/* Action Buttons Row */}
            <div id="quick-transfer-action" className="mt-5 pt-4 border-t border-blue-900/80 flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => alert('Quick IMPS / NEFT Transfer: Direct beneficiary transfer initiated for AC1000234567.')}
                className="px-3.5 py-2 rounded-lg bg-blue-900 hover:bg-blue-850 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-blue-800"
              >
                <Send className="w-3.5 h-3.5 text-amber-400" />
                Transfer Funds (IMPS/NEFT)
              </button>
              <button
                onClick={() => alert('UPI Quick Pay: Scan any UPI QR code or enter VPA.')}
                className="px-3.5 py-2 rounded-lg bg-blue-900 hover:bg-blue-850 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-blue-800"
              >
                <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                UPI &amp; Bill Payments
              </button>
              <button
                onClick={handleDownloadStatement}
                className="px-3.5 py-2 rounded-lg bg-blue-900 hover:bg-blue-850 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-blue-800"
              >
                <Download className="w-3.5 h-3.5 text-blue-300" />
                Account Statement PDF
              </button>
            </div>
          </div>

          {/* Cheque Book & Service Requests Tracker Card (Contextual to user inquiry) */}
          <div id="service-requests-widget" className="card bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm font-serif">
                    Cheque Book &amp; Service Request Tracker
                  </h3>
                  <p className="text-xs text-slate-500">Live dispatch and dispatch consignment tracking</p>
                </div>
              </div>

              <button
                onClick={onNavigateToComplaint}
                className="text-xs text-blue-700 hover:text-blue-900 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>Track or Inquire Grievance</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Active Cheque Book Dispatch Status Box */}
            <div className="mt-4 p-3.5 rounded-lg bg-blue-50/50 border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">Cheque Book (25 Leaves) - AC1000234567</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800">
                    Dispatched via India Post
                  </span>
                </div>
                <p className="text-slate-600">
                  SpeedPost Consignment # <strong>ED892019482IN</strong> &bull; Dispatched on 28 Aug 2026
                </p>
              </div>

              <button
                onClick={onNavigateToComplaint}
                className="px-3 py-1.5 rounded-md bg-white border border-slate-300 hover:border-blue-500 text-blue-700 text-xs font-semibold cursor-pointer shadow-2xs whitespace-nowrap"
              >
                Not Received? Inquire Here
              </button>
            </div>
          </div>

          {/* Recent Transactions Table */}
          <div className="card bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight font-serif">
                  Recent Account Transactions
                </h2>
                <p className="text-xs text-slate-500">
                  Cleared activity for {selectedAccount.name} ({selectedAccount.accountNumber})
                </p>
              </div>

              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-3 py-1 text-xs rounded-md font-medium transition-all cursor-pointer ${
                    filterType === 'all' ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterType('credit')}
                  className={`px-3 py-1 text-xs rounded-md font-medium transition-all cursor-pointer ${
                    filterType === 'credit' ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Credits
                </button>
                <button
                  onClick={() => setFilterType('debit')}
                  className={`px-3 py-1 text-xs rounded-md font-medium transition-all cursor-pointer ${
                    filterType === 'debit' ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Debits
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead className="bg-slate-50 text-[10px] uppercase text-slate-400 font-bold tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-3.5">Transaction Narrative</th>
                    <th className="px-6 py-3.5">Date</th>
                    <th className="px-6 py-3.5">Category</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Amount (INR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTransactions.map((txn) => (
                    <tr key={txn.id} className="hover:bg-slate-50/70 transition-colors group cursor-default">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                              txn.type === 'credit'
                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                                : 'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}
                          >
                            {txn.type === 'credit' ? (
                              <ArrowDownLeft className="w-4 h-4" />
                            ) : (
                              <ArrowUpRight className="w-4 h-4" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors font-mono text-xs">
                              {txn.description}
                            </div>
                            <div className="text-[11px] text-slate-400 font-sans">
                              {txn.reference} &bull; {txn.merchant}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500 whitespace-nowrap">
                        {txn.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-slate-500 text-xs">
                          {txn.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                          <CheckCircle className="w-3 h-3" />
                          {txn.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap font-mono font-semibold">
                        <span
                          className={
                            txn.type === 'credit' ? 'text-emerald-600' : 'text-red-600'
                          }
                        >
                          {txn.type === 'credit' ? '+' : '-'}₹
                          {txn.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Showing {filteredTransactions.length} of {transactions.length} cleared records</span>
              <button
                onClick={handleDownloadStatement}
                className="text-blue-700 hover:text-blue-800 font-semibold cursor-pointer"
              >
                Download Full Statement PDF &rarr;
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: Virtual Platinum Card & Customer Care Portal */}
        <div className="space-y-6">
          {/* Virtual Card Widget (India Bank Premier RuPay / Visa Platinum) */}
          <div className="bg-gradient-to-br from-[#0A1E3F] via-[#0E2854] to-slate-950 p-6 rounded-xl border border-blue-950 shadow-md relative overflow-hidden text-white">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <Landmark className="w-5 h-5 text-amber-400" />
                <span className="font-serif font-bold text-sm tracking-wider">INDIA BANK PREMIER</span>
              </div>
              <span className="text-xs uppercase font-mono tracking-widest text-amber-300">PLATINUM DEBIT</span>
            </div>

            {/* EMV Chip & Contactless */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-7 rounded bg-gradient-to-tr from-amber-300 to-yellow-500 border border-amber-600/40 shadow-inner flex items-center justify-center">
                <div className="w-7 h-5 border border-amber-800/40 rounded-xs grid grid-cols-2"></div>
              </div>
              <div className="text-slate-400">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8.5 16.5a5 5 0 0 1 0-9" />
                  <path d="M12 19a8.5 8.5 0 0 0 0-14" />
                  <path d="M15.5 21.5a12 12 0 0 0 0-19" />
                </svg>
              </div>
            </div>

            {/* Card Number */}
            <div className="mb-4">
              <div className="text-lg font-mono tracking-widest font-semibold flex items-center justify-between">
                <span>{showCardNumber ? '4532  8492  1092  4829' : '••••  ••••  ••••  4829'}</span>
                <button
                  onClick={() => setShowCardNumber(!showCardNumber)}
                  className="text-slate-400 hover:text-white transition-colors p-1 cursor-pointer"
                  title="Toggle card number visibility"
                >
                  {showCardNumber ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Cardholder & Expiry */}
            <div className="flex items-end justify-between text-xs pt-3 border-t border-blue-900/80">
              <div>
                <span className="text-[10px] uppercase text-blue-300 tracking-wider block">Cardholder</span>
                <span className="font-semibold uppercase tracking-wide text-slate-100">
                  {displayName}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase text-blue-300 tracking-wider block">Valid Thru</span>
                <span className="font-mono text-slate-100 font-medium">08/30</span>
              </div>
            </div>
          </div>

          {/* Help & Customer Support Section (Mimicking HDFC / ICICI Bank Support Box) */}
          <div className="card bg-white border border-slate-200 rounded-xl p-6 shadow-xs relative">
            <div className="flex items-center gap-3 mb-3.5">
              <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700">
                <LifeBuoy className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base font-serif">Customer Care &amp; Support</h3>
                <p className="text-xs text-slate-500">24x7 Grievance Redressal &amp; Helpdesk</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Need assistance with Cheque Books, Bank Statements, UPI payments, or Account services? Lodge an official grievance with our resolution desk.
            </p>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 mb-4 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">24x7 Toll-Free Care:</span>
                <a href="tel:18002026161" className="font-bold text-blue-900 hover:underline">1800 202 6161</a>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Emergency Block:</span>
                <a href="tel:18001204433" className="font-bold text-red-600 hover:underline">1800 120 4433</a>
              </div>
            </div>

            <button
              id="raise-complaint-btn"
              onClick={onNavigateToComplaint}
              className="w-full py-3 px-4 rounded-lg bg-[#0A1E3F] hover:bg-[#0E2854] text-white font-semibold text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer group"
            >
              <MessageSquareWarning className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              <span>Lodge Grievance / Service Request</span>
              <ChevronRight className="w-4 h-4 ml-auto text-blue-200" />
            </button>
          </div>

          {/* Active Tickets Filed In This Session (NO reference numbers displayed) */}
          {recentTickets.length > 0 && (
            <div className="card bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900 font-serif flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-700" />
                  Your Active Requests ({recentTickets.length})
                </h3>
              </div>

              <div className="space-y-3">
                {recentTickets.map((t) => (
                  <div
                    key={t.traceId}
                    className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">{t.productType}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                        {t.status}
                      </span>
                    </div>
                    <div className="text-slate-600 line-clamp-2 font-sans italic">
                      "{t.details}"
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                      <span className="text-emerald-700 font-semibold">Under Review</span>
                      <span>{t.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Bank Advisory */}
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p>
              India Bank officials will never contact you requesting your NetBanking password, debit card PIN, or OTP. Never share confidential details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
