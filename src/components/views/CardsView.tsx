import React, { useState } from 'react';
import {
  CreditCard,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Shield,
  Wifi,
  Globe,
  Plus,
  ArrowUpRight,
  Gift,
  CheckCircle2,
} from 'lucide-react';
import { BankCard } from '../../types';
import { MOCK_CARDS } from '../../data/mockData';

export const CardsView: React.FC = () => {
  const [cards, setCards] = useState<BankCard[]>(MOCK_CARDS);
  const [selectedCardId, setSelectedCardId] = useState<string>(cards[0].id);
  const [showCvv, setShowCvv] = useState(false);
  const [domesticLimit, setDomesticLimit] = useState(250000);

  const currentCard = cards.find((c) => c.id === selectedCardId) || cards[0];

  const toggleFreeze = (id: string) => {
    setCards((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: c.status === 'Active' ? 'Frozen' : 'Active' } : c
      )
    );
  };

  const toggleInternational = (id: string) => {
    setCards((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, internationalEnabled: !c.internationalEnabled } : c
      )
    );
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-[#FAFBFD] text-left space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Cards & Digital Wallets</h2>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
          Manage your India Bank credit and debit cards, limits, and instant security controls.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Left: Card Display and Selector */}
        <div className="lg:col-span-6 space-y-4">
          {/* Card Visual with 3D Metallic Gradient */}
          <div
            className={`relative h-56 sm:h-64 rounded-3xl p-6 sm:p-7 text-white shadow-xl bg-gradient-to-br ${currentCard.gradient} flex flex-col justify-between overflow-hidden border border-white/10`}
          >
            {/* Background geometric accents */}
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

            {/* Top row: Brand & Wifi */}
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight">India Bank</span>
                <span className="text-[10px] tracking-widest uppercase font-bold text-white/70">
                  {currentCard.type}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Wifi className="w-5 h-5 text-white/80 rotate-90" />
                {currentCard.status === 'Frozen' && (
                  <span className="text-[10px] font-bold bg-red-500/80 px-2 py-0.5 rounded-full backdrop-blur-xs">
                    FROZEN
                  </span>
                )}
              </div>
            </div>

            {/* Middle: EMV Chip & Contactless */}
            <div className="relative z-10 my-auto">
              <div className="w-12 h-9 rounded-lg bg-gradient-to-tr from-amber-300 via-amber-200 to-yellow-400 border border-amber-400/40 shadow-xs mb-3 flex items-center justify-center">
                <div className="w-8 h-6 border border-amber-600/40 rounded-sm grid grid-cols-2" />
              </div>
              <div className="font-mono text-xl sm:text-2xl tracking-widest text-white/95 font-medium drop-shadow-sm">
                {currentCard.cardNumber}
              </div>
            </div>

            {/* Bottom: Cardholder, Expiry, Network */}
            <div className="flex items-end justify-between relative z-10 text-xs">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-white/60 block">Card Holder</span>
                <span className="font-bold tracking-wide">{currentCard.cardHolder}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider text-white/60 block">Expires</span>
                <span className="font-mono font-bold">{currentCard.expiry}</span>
              </div>
              <div className="text-right">
                <span className="text-base font-black italic tracking-tighter text-white">
                  {currentCard.network}
                </span>
              </div>
            </div>
          </div>

          {/* Cards Switcher Tabs */}
          <div className="grid grid-cols-2 gap-3">
            {cards.map((card) => (
              <button
                key={card.id}
                onClick={() => setSelectedCardId(card.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  selectedCardId === card.id
                    ? 'bg-white border-indigo-600 shadow-sm'
                    : 'bg-white/60 border-slate-200 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{card.cardName}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    card.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                  }`}>
                    {card.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-mono mt-1">{card.maskedNumber}</p>
              </button>
            ))}
          </div>

          {/* Reward Points Card */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-indigo-100 rounded-3xl p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center">
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800">Nexora Reward Points</span>
                <p className="text-lg font-black text-indigo-700">
                  {currentCard.rewardPoints.toLocaleString('en-IN')} pts
                </p>
              </div>
            </div>
            <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700 px-3 py-1.5 rounded-xl bg-white border border-indigo-200 shadow-2xs hover:shadow-xs transition-all cursor-pointer">
              Redeem (₹{Math.round(currentCard.rewardPoints * 0.25)})
            </button>
          </div>
        </div>

        {/* Right: Security & Limits Settings */}
        <div className="lg:col-span-6 space-y-5">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-5">
            <h3 className="font-bold text-slate-900 text-base">Instant Card Controls</h3>

            {/* CVV Reveal */}
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl">
              <div>
                <span className="text-xs font-bold text-slate-800 block">Security CVV</span>
                <span className="text-[11px] text-slate-400">Never share your CVV with anyone</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-slate-900 text-sm">
                  {showCvv ? currentCard.cvv : '•••'}
                </span>
                <button
                  onClick={() => setShowCvv(!showCvv)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  {showCvv ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Lock / Freeze Toggle */}
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${currentCard.status === 'Frozen' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                  {currentCard.status === 'Frozen' ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Freeze Card</span>
                  <span className="text-[11px] text-slate-400">Instantly block all incoming transactions</span>
                </div>
              </div>
              <button
                onClick={() => toggleFreeze(currentCard.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  currentCard.status === 'Frozen'
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                {currentCard.status === 'Frozen' ? 'Unfreeze' : 'Freeze Card'}
              </button>
            </div>

            {/* International Transactions */}
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 block">International Usage</span>
                  <span className="text-[11px] text-slate-400">Allow overseas merchants & forex transactions</span>
                </div>
              </div>
              <button
                onClick={() => toggleInternational(currentCard.id)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  currentCard.internationalEnabled ? 'bg-indigo-600 justify-end' : 'bg-slate-300 justify-start'
                }`}
              >
                <div className="bg-white w-4 h-4 rounded-full shadow-md" />
              </button>
            </div>

            {/* Domestic Limit Slider */}
            <div className="p-4 bg-slate-50 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">Daily Domestic Limit</span>
                <span className="font-mono font-bold text-indigo-700">
                  ₹{domesticLimit.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="range"
                min="10000"
                max="500000"
                step="10000"
                value={domesticLimit}
                onChange={(e) => setDomesticLimit(parseInt(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>₹10,000</span>
                <span>₹2,50,000</span>
                <span>₹5,00,000</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
