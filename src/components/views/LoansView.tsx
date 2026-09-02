import React, { useState } from 'react';
import {
  Coins,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Calculator,
  ArrowRight,
  Clock,
} from 'lucide-react';

export const LoansView: React.FC = () => {
  const [loanAmount, setLoanAmount] = useState('500000');
  const [tenureYears, setTenureYears] = useState(3);
  const annualRate = 0.105; // 10.5% p.a.

  const principal = parseFloat(loanAmount) || 0;
  const monthlyRate = annualRate / 12;
  const totalMonths = tenureYears * 12;
  const emi = Math.round(
    (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1)
  );
  const totalPayable = emi * totalMonths;
  const totalInterest = totalPayable - principal;

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-[#FAFBFD] text-left space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Loans & Credit Solutions</h2>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
          Pre-approved instant personal loans, car finance, and home loans with instant disbursal.
        </p>
      </div>

      {/* Pre-Approved Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-6 sm:p-7 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider bg-emerald-700/80 px-2.5 py-1 rounded-full">
            Pre-Approved for Ananya Sharma
          </span>
          <h3 className="text-xl sm:text-2xl font-black mt-2">Instant Personal Loan up to ₹10,00,000</h3>
          <p className="text-xs text-emerald-100 mt-1">Zero documentation • Funds credited within 120 seconds.</p>
        </div>
        <button className="px-5 py-2.5 rounded-xl bg-white text-emerald-900 font-bold text-xs hover:bg-emerald-50 transition-colors shadow-sm cursor-pointer shrink-0">
          Claim Loan Now
        </button>
      </div>

      {/* Interactive EMI Calculator */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-6">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-slate-900 text-lg">Personal Loan EMI Calculator</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700 uppercase">Required Loan Amount</label>
                <span className="text-base font-bold text-indigo-700">₹{principal.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="50000"
                max="1500000"
                step="25000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>₹50,000</span>
                <span>₹7,50,000</span>
                <span>₹15,00,000</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700 uppercase">Tenure: {tenureYears} Years ({totalMonths} Months)</label>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">10.5% p.a.</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={tenureYears}
                onChange={(e) => setTenureYears(parseInt(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>1 Year</span>
                <span>3 Years</span>
                <span>5 Years</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-4">
            <div className="flex justify-between items-center text-xs text-slate-600 pb-3 border-b border-slate-200">
              <span>Monthly EMI Payout:</span>
              <span className="text-xl font-black text-indigo-700">₹{emi.toLocaleString('en-IN')} / mo</span>
            </div>
            <div className="flex justify-between items-center text-xs text-slate-600 pb-3 border-b border-slate-200">
              <span>Total Interest Charges:</span>
              <span className="font-bold text-slate-800">₹{totalInterest.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center text-xs text-slate-600 pb-3 border-b border-slate-200">
              <span>Total Amount Payable:</span>
              <span className="font-bold text-slate-800">₹{totalPayable.toLocaleString('en-IN')}</span>
            </div>

            <button className="w-full py-3 rounded-2xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-colors shadow-md cursor-pointer">
              Apply for Instant Disbursal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
