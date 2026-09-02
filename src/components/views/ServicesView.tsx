import React, { useState } from 'react';
import {
  FileText,
  BookOpen,
  Key,
  ShieldAlert,
  Users,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';

interface ServicesViewProps {
  onOpenGrievance: () => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({ onOpenGrievance }) => {
  const [orderedCheque, setOrderedCheque] = useState(false);

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-[#FAFBFD] text-left space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Customer Services & Support</h2>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
          Self-service banking requests, tax certificates, security audits, and official regulatory grievance desk.
        </p>
      </div>

      {/* Featured: Official Grievance Desk Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-indigo-900/50">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-red-500/20 text-red-400 rounded-2xl border border-red-500/30 shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              Guaranteed &lt; 24h Turnaround
            </span>
            <h3 className="text-lg font-bold text-white mt-1.5">Customer Grievance &amp; Dispute Desk</h3>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Report failed transactions, cheque issues, statement queries, or card disputes with guaranteed resolution under 24 hours.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenGrievance}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer shrink-0 shadow-sm"
        >
          <span>Open Grievance Desk</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Grid of Service Requests */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Cheque Book */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
              <BookOpen className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Cheque Book Request</h4>
            <p className="text-xs text-slate-500 mt-1">25-leaf personalized cheque book delivered to communication address.</p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100">
            {orderedCheque ? (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Dispatch Scheduled via SpeedPost
              </span>
            ) : (
              <button
                onClick={() => setOrderedCheque(true)}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 cursor-pointer"
              >
                Request 25-Leaf Book →
              </button>
            )}
          </div>
        </div>

        {/* Form 16A / TDS */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <FileText className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">TDS & Interest Certificate</h4>
            <p className="text-xs text-slate-500 mt-1">Form 16A and provisional interest certificate for Income Tax filing.</p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100">
            <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700 cursor-pointer">
              Download FY 2025-26 PDF →
            </button>
          </div>
        </div>

        {/* Locker Booking */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
              <Key className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Safe Deposit Locker</h4>
            <p className="text-xs text-slate-500 mt-1">Check availability and book secure vault lockers at nearby branch.</p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100">
            <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700 cursor-pointer">
              Check Locker Vacancy →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
