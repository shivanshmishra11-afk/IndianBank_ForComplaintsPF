import React, { useState } from 'react';
import {
  Send,
  UserPlus,
  ArrowLeftRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Clock,
  QrCode,
} from 'lucide-react';
import { BankAccount, QuickPayee } from '../../types';
import { QUICK_PAYEES } from '../../data/mockData';

interface TransfersViewProps {
  accounts: BankAccount[];
  onTransferCompleted?: (amount: number, desc: string, payee: string) => void;
  onOpenScanPay: () => void;
}

export const TransfersView: React.FC<TransfersViewProps> = ({
  accounts,
  onTransferCompleted,
  onOpenScanPay,
}) => {
  const [payees, setPayees] = useState<QuickPayee[]>(QUICK_PAYEES);
  const [selectedPayeeId, setSelectedPayeeId] = useState<string>(payees[0]?.id || 'p1');
  const [amount, setAmount] = useState('');
  const [transferMode, setTransferMode] = useState<'IMPS' | 'NEFT' | 'RTGS' | 'UPI'>('IMPS');
  const [note, setNote] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [showAddPayee, setShowAddPayee] = useState(false);

  // New Payee Form
  const [newPayeeName, setNewPayeeName] = useState('');
  const [newPayeeAcc, setNewPayeeAcc] = useState('');
  const [newPayeeIfsc, setNewPayeeIfsc] = useState('NXRA0004521');

  const selectedPayee = payees.find((p) => p.id === selectedPayeeId) || payees[0];

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (!val || val <= 0) return;

    if (onTransferCompleted) {
      onTransferCompleted(val, note || `Transfer to ${selectedPayee.name}`, selectedPayee.name);
    }
    setIsSuccess(true);
  };

  const handleAddPayee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPayeeName.trim()) return;
    const newP: QuickPayee = {
      id: `p-${Date.now()}`,
      name: newPayeeName,
      accountNumber: newPayeeAcc || 'XXXX 8899',
      bankName: 'Indian Bank',
      avatar: newPayeeName.charAt(0).toUpperCase(),
    };
    setPayees((prev) => [...prev, newP]);
    setSelectedPayeeId(newP.id);
    setShowAddPayee(false);
    setNewPayeeName('');
    setNewPayeeAcc('');
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-[#FAFBFD] text-left space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Transfers & Remittance</h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Send money across India via 24x7 IMPS, UPI, NEFT, and RTGS without charges.
          </p>
        </div>

        <button
          onClick={onOpenScanPay}
          className="px-4 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer self-start"
        >
          <QrCode className="w-4 h-4" />
          <span>Scan Any QR</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Left: Quick Payees & Transfer Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-base">Select Beneficiary</h3>
              <button
                onClick={() => setShowAddPayee(!showAddPayee)}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Add Payee</span>
              </button>
            </div>

            {/* Add Payee Collapsible Form */}
            {showAddPayee && (
              <form onSubmit={handleAddPayee} className="p-4 bg-slate-50 rounded-2xl mb-4 space-y-3 border border-slate-200">
                <h4 className="text-xs font-bold text-slate-800">Add New Beneficiary</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={newPayeeName}
                    onChange={(e) => setNewPayeeName(e.target.value)}
                    required
                    className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    type="text"
                    placeholder="Account / UPI ID"
                    value={newPayeeAcc}
                    onChange={(e) => setNewPayeeAcc(e.target.value)}
                    required
                    className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddPayee(false)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 cursor-pointer"
                  >
                    Save Payee
                  </button>
                </div>
              </form>
            )}

            {/* Payee Avatars Carousel */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {payees.map((p) => {
                const isSelected = p.id === selectedPayeeId;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPayeeId(p.id)}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center ${
                      isSelected
                        ? 'bg-indigo-50/70 border-indigo-600 ring-2 ring-indigo-500/20'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-500 text-white font-bold flex items-center justify-center text-sm shadow-xs mb-1.5">
                      {p.avatar}
                    </div>
                    <span className="text-xs font-bold text-slate-900 truncate w-full">{p.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{p.accountNumber}</span>
                  </button>
                );
              })}
            </div>

            {/* Transfer Details Form */}
            {isSuccess ? (
              <div className="mt-6 py-6 text-center space-y-3 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-lg font-bold text-slate-900">Transfer Completed!</h4>
                <p className="text-xs text-slate-600">
                  ₹{parseFloat(amount).toLocaleString('en-IN')} successfully sent to {selectedPayee.name}.
                </p>
                <button
                  onClick={() => {
                    setIsSuccess(false);
                    setAmount('');
                    setNote('');
                  }}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 cursor-pointer"
                >
                  Make Another Transfer
                </button>
              </div>
            ) : (
              <form onSubmit={handleTransfer} className="mt-6 space-y-4 pt-4 border-t border-slate-100">
                {/* Mode Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    Payment Network
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['IMPS', 'UPI', 'NEFT', 'RTGS'] as const).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setTransferMode(m)}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          transferMode === m
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Amount Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Amount (INR)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      min="1"
                      required
                      className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold text-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Note */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Description / Purpose
                  </label>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="e.g. Monthly Rent, Invoice Clearance"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send ₹{amount || '0'} to {selectedPayee.name}</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right: Security & Limits Info */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Payment Protocols & Limits</h3>

            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-2xl flex items-start gap-3">
                <div className="p-2 bg-indigo-100 text-indigo-700 rounded-xl shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">IMPS / UPI 24x7</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    Instant real-time fund settlement up to ₹5,00,000 per transaction available round the clock.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl flex items-start gap-3">
                <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">RBI Positive Pay System</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    High value transactions above ₹50,000 are encrypted and cross-verified against recipient details.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl flex items-start gap-3">
                <div className="p-2 bg-purple-100 text-purple-700 rounded-xl shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Zero Convenience Charges</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    All digital transfers across NEFT, RTGS, IMPS, and UPI are 100% free of processing fees.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
