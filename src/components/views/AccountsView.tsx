import React, { useState } from 'react';
import {
  Landmark,
  Building2,
  Lock,
  Search,
  Filter,
  Download,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  FileCheck,
} from 'lucide-react';
import { BankAccount, Transaction } from '../../types';

interface AccountsViewProps {
  accounts: BankAccount[];
  transactions: Transaction[];
  onOpenActionModal: (action: string) => void;
}

export const AccountsView: React.FC<AccountsViewProps> = ({
  accounts,
  transactions,
  onOpenActionModal,
}) => {
  const [selectedAccountId, setSelectedAccountId] = useState<string>(accounts[0]?.id || 'acc-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  const activeAccount = accounts.find((a) => a.id === selectedAccountId) || accounts[0];

  const filteredTransactions = transactions.filter((txn) => {
    const matchesSearch =
      txn.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.reference.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'All' || txn.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', 'Shopping', 'Salary', 'Food & Dining', 'Bills & Utilities', 'Investments'];

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-[#FAFBFD] text-left space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Accounts & Statements</h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Overview of your operating accounts, balances, and verified transaction logs.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onOpenActionModal('statement')}
            className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs flex items-center gap-2 shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-indigo-600" />
            <span>Download Statement</span>
          </button>
          <button
            onClick={() => onOpenActionModal('send-money')}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 font-bold text-xs flex items-center gap-2 shadow-sm shadow-indigo-200 transition-colors cursor-pointer"
          >
            <span>Transfer Funds</span>
          </button>
        </div>
      </div>

      {/* Account Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {accounts.map((acc) => {
          const isSelected = acc.id === selectedAccountId;
          return (
            <div
              key={acc.id}
              onClick={() => setSelectedAccountId(acc.id)}
              className={`p-5 rounded-3xl border transition-all cursor-pointer text-left ${
                isSelected
                  ? 'bg-white border-indigo-600 shadow-md ring-2 ring-indigo-500/10'
                  : 'bg-white/70 border-slate-200/80 hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {acc.type}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                  {acc.status}
                </span>
              </div>
              <p className="text-xl font-black text-slate-900">
                ₹{acc.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </p>
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
                <span>{acc.maskedNumber}</span>
                <span>IFSC: {acc.routingNumber}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Transactions Section */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="font-bold text-slate-900 text-base">Statement History</h3>

          {/* Search and Filters */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search transactions..."
                className="pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-48 sm:w-56"
              />
            </div>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 px-3 py-1.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* List */}
        <div className="divide-y divide-slate-100">
          {filteredTransactions.map((txn) => {
            const isCredit = txn.type === 'credit';
            return (
              <div key={txn.id} className="py-3.5 flex items-center justify-between hover:bg-slate-50/70 px-2 rounded-xl transition-colors">
                <div className="flex items-center gap-3.5">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                    isCredit ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {isCredit ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900">{txn.merchant}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{txn.category} • Ref: {txn.reference}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-xs sm:text-sm font-black ${isCredit ? 'text-emerald-600' : 'text-slate-900'}`}>
                    {isCredit ? '+ ' : '- '}₹{txn.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-0.5">{txn.date}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
