import React from 'react';
import {
  Home,
  Building2,
  CreditCard,
  Send,
  ArrowLeftRight,
  TrendingUp,
  Coins,
  Tag,
  Grid,
  ArrowUpRight,
  PhoneCall,
} from 'lucide-react';
import { NavTab } from '../types';

interface NexoraSidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenReferEarn?: () => void;
  isMobile?: boolean;
  onCloseMobile?: () => void;
}

interface NavItem {
  id: NavTab;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

export const NexoraSidebar: React.FC<NexoraSidebarProps> = ({
  activeTab,
  onSelectTab,
  onOpenReferEarn,
  isMobile,
  onCloseMobile,
}) => {
  const navItems: NavItem[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'accounts', label: 'Accounts', icon: Building2 },
    { id: 'complaints', label: 'Grievance and Dispute', icon: PhoneCall },
    { id: 'cards', label: 'Cards', icon: CreditCard },
    { id: 'payments', label: 'Payments', icon: Send },
    { id: 'transfers', label: 'Transfers', icon: ArrowLeftRight },
    { id: 'investments', label: 'Investments', icon: TrendingUp },
    { id: 'loans', label: 'Loans', icon: Coins },
    { id: 'offers', label: 'Offers', icon: Tag, badge: 'New' },
    { id: 'services', label: 'Services', icon: Grid },
  ];

  const handleNavClick = (tabId: NavTab) => {
    onSelectTab(tabId);
    if (isMobile && onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <aside className="w-60 shrink-0 flex flex-col justify-between py-5 px-4 bg-[#FAFBFD] border-r border-slate-100 min-h-[calc(100vh-61px)] select-none">
      {/* Navigation Links */}
      <div className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-[#EEF2FF] text-[#4F46E5] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-[#4F46E5]' : 'text-slate-500'
                  }`}
                />
                <span className="tracking-tight">{item.label}</span>
              </div>

              {item.badge && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Refer & Earn Card at bottom matching screenshot */}
      <div className="mt-8 pt-4">
        <div
          onClick={onOpenReferEarn}
          className="group relative overflow-hidden bg-gradient-to-br from-[#F5F3FF] via-[#EDE9FE] to-[#E0E7FF] border border-indigo-100/80 rounded-2xl p-4 cursor-pointer hover:shadow-md hover:border-indigo-200 transition-all duration-200 text-left"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-700">
                Refer & Earn
              </span>
              <p className="text-[11px] text-slate-500 mt-1 font-medium leading-tight">
                Invite friends & earn up to
              </p>
              <p className="text-lg font-black text-indigo-700 mt-1">
                ₹500
              </p>
            </div>

            {/* 3D Gift box image and arrow button */}
            <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
              <img
                src="./assets/gift_box.jpg"
                alt="Refer and Earn Gift"
                className="w-12 h-12 object-contain drop-shadow-sm group-hover:scale-110 transition-transform duration-300"
                onError={(e) => {
                  // Fallback to SVG if image not loaded
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
          </div>

          <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-indigo-100/60">
            <span className="text-[10px] font-semibold text-indigo-600">
              Get referral code
            </span>
            <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xs group-hover:bg-indigo-700 transition-colors">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
