import React, { useState } from 'react';
import { Tag, Copy, Check, ExternalLink, Sparkles } from 'lucide-react';
import { BANK_OFFERS } from '../../data/mockData';

export const OffersView: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-[#FAFBFD] text-left space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Exclusive Bank Offers</h2>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
          Handpicked deals, dining privileges, and travel discounts exclusively for Nexora customers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {BANK_OFFERS.map((offer) => (
          <div
            key={offer.id}
            className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-all duration-200"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full">
                  {offer.category}
                </span>
                <span className="text-[11px] text-slate-400">{offer.expiry}</span>
              </div>

              <h3 className="font-bold text-slate-900 text-base">{offer.title}</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{offer.description}</p>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-slate-800 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                <span>{offer.code || 'CLAIMNOW'}</span>
              </div>

              <button
                onClick={() => handleCopy(offer.code || 'CLAIMNOW')}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors flex items-center gap-1 cursor-pointer"
              >
                {copiedCode === (offer.code || 'CLAIMNOW') ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>{copiedCode === (offer.code || 'CLAIMNOW') ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
