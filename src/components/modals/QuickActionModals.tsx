import React, { useState } from 'react';
import {
  X,
  Send,
  CheckCircle2,
  QrCode,
  Landmark,
  FileText,
  Copy,
  Check,
  ShieldCheck,
  Percent,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Smartphone,
  CreditCard,
} from 'lucide-react';
import { BankAccount, QuickPayee, CreditScoreData } from '../../types';
import { QUICK_PAYEES } from '../../data/mockData';

interface QuickActionModalsProps {
  modalType: string | null;
  onClose: () => void;
  accounts: BankAccount[];
  creditData: CreditScoreData;
  onTransferSuccess?: (amount: number, description: string, payee: string) => void;
  onOpenGrievance?: () => void;
}

export const QuickActionModals: React.FC<QuickActionModalsProps> = ({
  modalType,
  onClose,
  accounts,
  creditData,
  onTransferSuccess,
  onOpenGrievance,
}) => {
  if (!modalType) return null;

  // Send Money State
  const [selectedPayee, setSelectedPayee] = useState<any>(QUICK_PAYEES[0]);
  const [transferAmount, setTransferAmount] = useState('');
  const [transferNote, setTransferNote] = useState('');
  const [transferSuccess, setTransferSuccess] = useState(false);

  // Scan & Pay State
  const [scanStep, setScanStep] = useState<'scanning' | 'paying' | 'success'>('scanning');
  const [scanAmount, setScanAmount] = useState('450');

  // Open FD State
  const [fdAmount, setFdAmount] = useState('100000');
  const [fdTenureMonths, setFdTenureMonths] = useState(18);
  const [fdBooked, setFdBooked] = useState(false);

  // Refer & Earn State
  const [copied, setCopied] = useState(false);

  // Statement Download State
  const [statementRange, setStatementRange] = useState('Last 3 Months');
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Calculate FD Returns (6.75% p.a. quarterly compounded)
  const principal = parseFloat(fdAmount) || 0;
  const rate = 0.0675;
  const timeYears = fdTenureMonths / 12;
  const maturityAmount = Math.round(principal * Math.pow(1 + rate / 4, 4 * timeYears));
  const interestEarned = maturityAmount - principal;

  const handleSendMoneySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(transferAmount);
    if (!amt || amt <= 0) return;

    if (onTransferSuccess) {
      onTransferSuccess(
        amt,
        transferNote || `Fund Transfer to ${selectedPayee.name}`,
        selectedPayee.name
      );
    }
    setTransferSuccess(true);
  };

  const handleCopyReferral = () => {
    navigator.clipboard?.writeText('https://nexora.indiabank.com/join?ref=NEXORA-ANANYA78');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadStatement = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setDownloadSuccess(true);
      // Generate synthetic PDF trigger
      const element = document.createElement('a');
      const file = new Blob([
        `NEXORA BANK - ACCOUNT STATEMENT\n` +
        `Account: AC1000231234 (Savings Account)\n` +
        `Period: ${statementRange}\n` +
        `Generated on: ${new Date().toLocaleString('en-IN')}\n` +
        `Status: Digitally Certified and RBI Compliant\n`
      ], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `Nexora_Statement_${statementRange.replace(/\s+/g, '_')}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden relative text-left">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors z-10 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* --- SEND MONEY MODAL --- */}
        {modalType === 'send-money' && (
          <div className="p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Send Money Instantly</h3>
                <p className="text-xs text-slate-500">IMPS / UPI 24x7 with Zero Transaction Fees</p>
              </div>
            </div>

            {transferSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h4 className="text-xl font-bold text-slate-900">Payment Successful!</h4>
                <p className="text-sm text-slate-600">
                  ₹{parseFloat(transferAmount).toLocaleString('en-IN')} sent to {selectedPayee.name}
                </p>
                <p className="text-xs text-slate-400">Ref ID: NXRA-IMPS-{Date.now().toString().slice(-8)}</p>
                <button
                  onClick={onClose}
                  className="mt-4 px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendMoneySubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Select Payee
                  </label>
                  <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    {QUICK_PAYEES.map((payee) => {
                      const isSelected = selectedPayee.id === payee.id;
                      return (
                        <button
                          key={payee.id}
                          type="button"
                          onClick={() => setSelectedPayee(payee)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold shrink-0 border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${
                            isSelected ? 'bg-white text-indigo-700 font-bold' : 'bg-indigo-100 text-indigo-700'
                          }`}>
                            {payee.avatar}
                          </span>
                          <span>{payee.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Amount (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                      placeholder="e.g. 5000"
                      className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                      required
                      min="1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Remark / Note
                  </label>
                  <input
                    type="text"
                    value={transferNote}
                    onChange={(e) => setTransferNote(e.target.value)}
                    placeholder="e.g. Dinner split, Rent, Gift"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs text-slate-600">
                  <span>Debited from</span>
                  <span className="font-bold text-slate-900">Savings Account (XXXX 1234)</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200 cursor-pointer"
                >
                  Confirm & Transfer
                </button>
              </form>
            )}
          </div>
        )}

        {/* --- SCAN & PAY MODAL --- */}
        {modalType === 'scan-pay' && (
          <div className="p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">UPI Scan & Pay</h3>
                <p className="text-xs text-slate-500">Scan any Bharat QR / UPI Merchant</p>
              </div>
            </div>

            {scanStep === 'scanning' && (
              <div className="space-y-4">
                <div className="relative w-64 h-64 mx-auto rounded-2xl bg-slate-900 overflow-hidden flex flex-col items-center justify-center border-4 border-indigo-500/40">
                  {/* Scanner lines */}
                  <div className="w-48 h-48 border-2 border-dashed border-indigo-400 rounded-xl flex items-center justify-center relative">
                    <QrCode className="w-28 h-28 text-slate-500/40 animate-pulse" />
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-indigo-400 to-transparent animate-pulse" />
                  </div>
                  <span className="text-[11px] text-slate-300 font-medium mt-3">
                    Align QR code within frame
                  </span>
                </div>

                <div className="text-center pt-2">
                  <p className="text-xs text-slate-500">Or simulate scanning a verified merchant:</p>
                  <button
                    onClick={() => setScanStep('paying')}
                    className="mt-2.5 px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Simulate: Blue Tokai Coffee Roasters (UPI Verified)
                  </button>
                </div>
              </div>
            )}

            {scanStep === 'paying' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                    BT
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">Blue Tokai Coffee Roasters</h4>
                    <p className="text-xs text-indigo-700 font-mono">bluetokai@icici</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Enter Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={scanAmount}
                      onChange={(e) => setScanAmount(e.target.value)}
                      className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold text-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <button
                  onClick={() => {
                    setScanStep('success');
                    if (onTransferSuccess) {
                      onTransferSuccess(
                        parseFloat(scanAmount) || 450,
                        'UPI Payment to Blue Tokai Coffee',
                        'Blue Tokai Coffee'
                      );
                    }
                  }}
                  className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-colors cursor-pointer"
                >
                  Pay ₹{scanAmount} with UPI
                </button>
              </div>
            )}

            {scanStep === 'success' && (
              <div className="py-8 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h4 className="text-xl font-bold text-slate-900">Payment Successful!</h4>
                <p className="text-sm text-slate-600">
                  ₹{scanAmount} paid to Blue Tokai Coffee Roasters
                </p>
                <button
                  onClick={onClose}
                  className="mt-4 px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        )}

        {/* --- OPEN FIXED DEPOSIT MODAL --- */}
        {modalType === 'open-fd' && (
          <div className="p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Landmark className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Book High-Yield Fixed Deposit</h3>
                <p className="text-xs text-slate-500">Up to 6.75% p.a. • Instant Certificate & DICGC Insured</p>
              </div>
            </div>

            {fdBooked ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h4 className="text-xl font-bold text-slate-900">FD Booked Successfully!</h4>
                <p className="text-sm text-slate-600">
                  FD Account generated: <span className="font-mono font-bold text-indigo-600">FD882910{Math.floor(1000 + Math.random() * 9000)}</span>
                </p>
                <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 text-left space-y-1">
                  <div className="flex justify-between"><span>Deposit Amount:</span><span className="font-bold">₹{principal.toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between"><span>Tenure:</span><span className="font-bold">{fdTenureMonths} Months</span></div>
                  <div className="flex justify-between"><span>Interest Rate:</span><span className="font-bold text-emerald-600">6.75% p.a.</span></div>
                  <div className="flex justify-between"><span>Maturity Value:</span><span className="font-bold text-indigo-700">₹{maturityAmount.toLocaleString('en-IN')}</span></div>
                </div>
                <button
                  onClick={onClose}
                  className="mt-4 px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700 uppercase">Deposit Amount (₹)</label>
                    <span className="text-xs font-mono font-semibold text-indigo-600">Min ₹10,000</span>
                  </div>
                  <input
                    type="number"
                    value={fdAmount}
                    onChange={(e) => setFdAmount(e.target.value)}
                    step="10000"
                    min="10000"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700 uppercase">Tenure: {fdTenureMonths} Months</label>
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">6.75% p.a.</span>
                  </div>
                  <input
                    type="range"
                    min="6"
                    max="60"
                    step="3"
                    value={fdTenureMonths}
                    onChange={(e) => setFdTenureMonths(parseInt(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>6 Mon</span>
                    <span>12 Mon</span>
                    <span>18 Mon</span>
                    <span>36 Mon</span>
                    <span>60 Mon</span>
                  </div>
                </div>

                {/* Live Return Projection Box */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100">
                  <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                    <span>Interest Earned:</span>
                    <span className="font-bold text-emerald-600">+ ₹{interestEarned.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-900 pt-1 border-t border-indigo-100">
                    <span className="font-bold">Maturity Payout:</span>
                    <span className="text-lg font-black text-indigo-700">₹{maturityAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <button
                  onClick={() => setFdBooked(true)}
                  className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200 cursor-pointer"
                >
                  Book Fixed Deposit Now
                </button>
              </div>
            )}
          </div>
        )}

        {/* --- STATEMENT DOWNLOAD MODAL --- */}
        {modalType === 'statement' && (
          <div className="p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Download Account Statement</h3>
                <p className="text-xs text-slate-500">Digitally certified e-statement with cryptographic stamp</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Select Duration</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Current Month', 'Last 3 Months', 'Last 6 Months', 'FY 2025-26'].map((range) => (
                    <button
                      key={range}
                      onClick={() => setStatementRange(range)}
                      className={`p-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        statementRange === range
                          ? 'bg-indigo-50 border-indigo-600 text-indigo-700'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-600 space-y-1">
                <div className="flex items-center gap-2 text-slate-800 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Password Protected Security</span>
                </div>
                <p className="text-[11px] text-slate-500">The PDF will be protected by your Date of Birth (DDMM) and last 4 digits of your account number.</p>
              </div>

              <button
                onClick={handleDownloadStatement}
                disabled={downloading}
                className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-colors shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                {downloading ? 'Preparing Certified Statement...' : downloadSuccess ? 'Downloaded!' : 'Download Statement PDF'}
              </button>
            </div>
          </div>
        )}

        {/* --- CREDIT REPORT MODAL --- */}
        {modalType === 'credit-report' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Credit Score Breakdown</h3>
                <p className="text-xs text-slate-500">CIBIL TransUnion Report • Updated {creditData.updatedDate}</p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {creditData.rating}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between mb-4">
              <div>
                <span className="text-3xl font-black text-slate-900">{creditData.score}</span>
                <span className="text-xs text-slate-400 ml-1">/ {creditData.maxScore}</span>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-emerald-600">Top 5% of Borrowers</p>
                <p className="text-[11px] text-slate-400">Eligible for instant pre-approved loans</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-2.5 bg-white border border-slate-100 rounded-xl text-xs">
                <div>
                  <p className="font-bold text-slate-800">Payment History</p>
                  <p className="text-[11px] text-slate-400">Zero missed payments</p>
                </div>
                <span className="font-black text-emerald-600">{creditData.factors.paymentHistory}%</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-white border border-slate-100 rounded-xl text-xs">
                <div>
                  <p className="font-bold text-slate-800">Credit Utilization</p>
                  <p className="text-[11px] text-slate-400">Well below 30% healthy benchmark</p>
                </div>
                <span className="font-black text-indigo-600">{creditData.factors.creditUtilization}%</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-white border border-slate-100 rounded-xl text-xs">
                <div>
                  <p className="font-bold text-slate-800">Credit History Age</p>
                  <p className="text-[11px] text-slate-400">Established financial footprint</p>
                </div>
                <span className="font-black text-slate-800">{creditData.factors.creditAge}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-white border border-slate-100 rounded-xl text-xs">
                <div>
                  <p className="font-bold text-slate-800">Active Accounts</p>
                  <p className="text-[11px] text-slate-400">Loans & Credit Cards</p>
                </div>
                <span className="font-black text-slate-800">{creditData.factors.totalAccounts}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="mt-5 w-full py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Close Report
            </button>
          </div>
        )}

        {/* --- REFER & EARN MODAL --- */}
        {modalType === 'refer-earn' && (
          <div className="p-6">
            <div className="text-center space-y-2 mb-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 flex items-center justify-center">
                <img
                  src="./assets/gift_box.jpg"
                  alt="Gift Box"
                  className="w-12 h-12 object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Invite Friends & Earn ₹500</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Get ₹500 credited to your savings account for every friend who opens a Nexora Bank account and completes their first UPI transaction.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl mb-4">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Your Personal Referral Link
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value="https://nexora.indiabank.com/join?ref=NEXORA-ANANYA78"
                  className="w-full text-xs font-mono bg-white border border-slate-200 px-3 py-2 rounded-xl text-slate-700"
                />
                <button
                  onClick={handleCopyReferral}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 bg-white border border-slate-100 rounded-xl">
                <p className="font-bold text-slate-800">Step 1</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Share link</p>
              </div>
              <div className="p-2.5 bg-white border border-slate-100 rounded-xl">
                <p className="font-bold text-slate-800">Step 2</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Friend joins</p>
              </div>
              <div className="p-2.5 bg-white border border-slate-100 rounded-xl">
                <p className="font-bold text-emerald-600">Step 3</p>
                <p className="text-[10px] text-slate-400 mt-0.5">₹500 in account</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
