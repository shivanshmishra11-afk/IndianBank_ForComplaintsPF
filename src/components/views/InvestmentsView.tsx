import React, { useState } from 'react';
import {
  TrendingUp,
  Landmark,
  Shield,
  Coins,
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
  PieChart,
} from 'lucide-react';

interface InvestmentsViewProps {
  onOpenFdModal: () => void;
}

export const InvestmentsView: React.FC<InvestmentsViewProps> = ({ onOpenFdModal }) => {
  const [calcAmount, setCalcAmount] = useState('200000');
  const [calcTenure, setCalcTenure] = useState(24);

  const principal = parseFloat(calcAmount) || 0;
  const rate = 0.0675; // 6.75%
  const years = calcTenure / 12;
  const maturity = Math.round(principal * Math.pow(1 + rate / 4, 4 * years));
  const interest = maturity - principal;

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-[#FAFBFD] text-left space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Investments & Wealth</h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Grow your wealth with assured returns, government sovereign bonds, and wealth portfolios.
          </p>
        </div>

        <button
          onClick={onOpenFdModal}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 font-bold text-xs flex items-center gap-2 shadow-md shadow-indigo-200 transition-colors cursor-pointer self-start"
        >
          <Landmark className="w-4 h-4" />
          <span>Book Fixed Deposit</span>
        </button>
      </div>

      {/* Hero Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-3xl p-6 text-white relative overflow-hidden shadow-lg">
          <div className="relative z-10">
            <span className="text-[11px] uppercase font-bold tracking-wider text-indigo-300 bg-white/10 px-2.5 py-1 rounded-full">
              High Yield FD
            </span>
            <h3 className="text-xl font-bold mt-3">Fixed Deposits</h3>
            <p className="text-2xl font-black text-amber-300 mt-1">6.75% p.a.</p>
            <p className="text-xs text-indigo-200 mt-2">DICGC Insured up to ₹5 Lakhs per depositor.</p>
            <button
              onClick={onOpenFdModal}
              className="mt-4 px-4 py-2 rounded-xl bg-white text-indigo-900 font-bold text-xs hover:bg-indigo-50 transition-colors cursor-pointer"
            >
              Open Instant FD →
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-[11px] uppercase font-bold tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
              Government Backed
            </span>
            <h3 className="text-lg font-bold text-slate-900 mt-3">Sovereign Gold Bonds</h3>
            <p className="text-xs text-slate-500 mt-1">2.50% annual coupon interest plus gold price appreciation.</p>
          </div>
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="font-bold text-emerald-600">Series 2026-IV Open</span>
            <button className="font-bold text-indigo-600 hover:text-indigo-700 cursor-pointer">Apply Now →</button>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-[11px] uppercase font-bold tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
              Direct Mutual Funds
            </span>
            <h3 className="text-lg font-bold text-slate-900 mt-3">Zero-Commission SIP</h3>
            <p className="text-xs text-slate-500 mt-1">Start SIPs starting ₹500/month with zero upfront commission charges.</p>
          </div>
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="font-bold text-slate-600">1,200+ Schemes</span>
            <button className="font-bold text-indigo-600 hover:text-indigo-700 cursor-pointer">Explore Funds →</button>
          </div>
        </div>
      </div>

      {/* FD Returns Calculator */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-6">
        <h3 className="font-bold text-slate-900 text-lg">Interactive Fixed Deposit Calculator</h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700 uppercase">Investment Amount</label>
                <span className="text-base font-bold text-indigo-700">₹{principal.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="10000"
                max="1000000"
                step="10000"
                value={calcAmount}
                onChange={(e) => setCalcAmount(e.target.value)}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>₹10,000</span>
                <span>₹5,00,000</span>
                <span>₹10,00,000</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700 uppercase">Tenure: {calcTenure} Months</label>
                <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">6.75% p.a.</span>
              </div>
              <input
                type="range"
                min="6"
                max="60"
                step="6"
                value={calcTenure}
                onChange={(e) => setCalcTenure(parseInt(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>6 Months</span>
                <span>24 Months</span>
                <span>60 Months</span>
              </div>
            </div>
          </div>

          {/* Calculator Output Display */}
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-4">
            <div className="flex justify-between items-center text-xs text-slate-600 pb-3 border-b border-slate-200">
              <span>Total Principal Invested:</span>
              <span className="font-bold text-slate-900">₹{principal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center text-xs text-slate-600 pb-3 border-b border-slate-200">
              <span>Estimated Interest Earned:</span>
              <span className="font-bold text-emerald-600">+ ₹{interest.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center text-sm pt-1">
              <span className="font-bold text-slate-900">Total Maturity Value:</span>
              <span className="text-2xl font-black text-indigo-700">₹{maturity.toLocaleString('en-IN')}</span>
            </div>

            <button
              onClick={onOpenFdModal}
              className="w-full py-3 rounded-2xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-colors shadow-md cursor-pointer"
            >
              Book FD for ₹{principal.toLocaleString('en-IN')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
