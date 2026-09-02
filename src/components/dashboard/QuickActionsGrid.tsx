import React from 'react';
import {
  Send,
  Receipt,
  Smartphone,
  FileText,
  UserPlus,
  QrCode,
  Landmark,
  MoreHorizontal,
} from 'lucide-react';

export type QuickActionType =
  | 'send-money'
  | 'pay-bills'
  | 'recharge'
  | 'statement'
  | 'add-payee'
  | 'scan-pay'
  | 'open-fd'
  | 'more';

interface QuickActionsGridProps {
  onActionClick: (action: QuickActionType) => void;
}

export const QuickActionsGrid: React.FC<QuickActionsGridProps> = ({ onActionClick }) => {
  const actions: { id: QuickActionType; label: string; icon: React.ElementType }[] = [
    { id: 'send-money', label: 'Send Money', icon: Send },
    { id: 'pay-bills', label: 'Pay Bills', icon: Receipt },
    { id: 'recharge', label: 'Recharge', icon: Smartphone },
    { id: 'statement', label: 'Statement', icon: FileText },
    { id: 'add-payee', label: 'Add Payee', icon: UserPlus },
    { id: 'scan-pay', label: 'Scan & Pay', icon: QrCode },
    { id: 'open-fd', label: 'Open FD', icon: Landmark },
    { id: 'more', label: 'More', icon: MoreHorizontal },
  ];

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs text-left">
      <h3 className="font-bold text-slate-900 text-base tracking-tight mb-4">
        Quick actions
      </h3>

      <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.id}
              onClick={() => onActionClick(act.id)}
              className="group flex flex-col items-center justify-center p-2 rounded-2xl hover:bg-slate-50 transition-all duration-150 cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#F4F6FF] text-[#4F46E5] flex items-center justify-center group-hover:bg-[#4F46E5] group-hover:text-white group-hover:shadow-md group-hover:scale-105 transition-all duration-200">
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-semibold text-slate-700 mt-2 text-center leading-tight">
                {act.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
