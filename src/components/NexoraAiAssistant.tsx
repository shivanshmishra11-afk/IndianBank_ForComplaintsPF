import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Bot,
  User,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { BankAccount, UserSession } from '../types';

interface NexoraAiAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserSession;
  accounts: BankAccount[];
  onOpenGrievance?: () => void;
  onQuickAction?: (action: string) => void;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
  quickActions?: { label: string; action: string }[];
}

export const NexoraAiAssistant: React.FC<NexoraAiAssistantProps> = ({
  isOpen,
  onClose,
  user,
  accounts,
  onOpenGrievance,
  onQuickAction,
}) => {
  if (!isOpen) return null;

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: `Hello ${user.name.split(' ')[0]}! I'm Nexora Assistant, your 24x7 banking AI. How can I help you today?`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      quickActions: [
        { label: 'Check Balance', action: 'balance' },
        { label: 'File Grievance / RBI Ticket', action: 'grievance' },
        { label: 'FD Interest Rates', action: 'fd_rate' },
        { label: 'Report Lost Card', action: 'block_card' },
      ],
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let replyText = '';
      let replyActions: { label: string; action: string }[] | undefined = undefined;

      const lower = text.toLowerCase();
      if (lower.includes('balance')) {
        const savings = accounts.find((a) => a.type === 'Savings');
        const current = accounts.find((a) => a.type === 'Current');
        replyText = `Here are your current active balances:\n• Savings Account (XXXX 1234): ₹${savings ? savings.balance.toLocaleString('en-IN') : '1,24,560.50'}\n• Current Account (XXXX 5678): ₹${current ? current.balance.toLocaleString('en-IN') : '8,75,000.00'}\n• Fixed Deposit: ₹5,00,000.00`;
        replyActions = [
          { label: 'Download Statement', action: 'statement' },
          { label: 'Send Money', action: 'send_money' },
        ];
      } else if (lower.includes('grievance') || lower.includes('complaint') || lower.includes('rbi')) {
        replyText = `Under RBI's Integrated Ombudsman Scheme, you can file an official grievance ticket for any issue (transaction failure, unauthorized debit, card dispute). Tickets are assigned an instant tracking ID.`;
        replyActions = [
          { label: 'Open Grievance Portal', action: 'grievance' },
        ];
      } else if (lower.includes('rate') || lower.includes('fd') || lower.includes('fixed deposit')) {
        replyText = `Nexora Bank offers up to 6.75% p.a. on Fixed Deposits for general citizens (7.25% p.a. for Senior Citizens) for tenures of 18 to 36 months. Interest is compounded quarterly.`;
        replyActions = [
          { label: 'Book FD Now', action: 'open_fd' },
        ];
      } else if (lower.includes('card') || lower.includes('lost') || lower.includes('block') || lower.includes('freeze')) {
        replyText = `To protect your funds, you can instantly freeze your Nexora Royale Infinite or Debit card from the Cards tab. No transactions will be allowed until you unfreeze it.`;
        replyActions = [
          { label: 'Go to Cards', action: 'cards' },
        ];
      } else {
        replyText = `I understand you are asking regarding "${text}". You can manage transfers, check CIBIL score, download account statements, or file RBI compliant grievances anytime!`;
        replyActions = [
          { label: 'Check Balance', action: 'balance' },
          { label: 'Send Money', action: 'send_money' },
          { label: 'Customer Grievance', action: 'grievance' },
        ];
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: replyText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          quickActions: replyActions,
        },
      ]);
      setIsTyping(false);
    }, 700);
  };

  const handleActionClick = (action: string) => {
    if (action === 'grievance') {
      if (onOpenGrievance) onOpenGrievance();
      onClose();
    } else if (action === 'balance') {
      handleSend('What is my account balance?');
    } else if (action === 'fd_rate') {
      handleSend('What are the FD interest rates?');
    } else if (action === 'block_card') {
      handleSend('How do I block or freeze my card?');
    } else if (onQuickAction) {
      onQuickAction(action);
      onClose();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-w-[calc(100vw-32px)] bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col h-[520px] animate-in slide-in-from-bottom-5 duration-200 text-left">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1E1156] via-[#2A1B70] to-[#432A9C] p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-xs flex items-center justify-center text-white">
            <Bot className="w-5 h-5 text-indigo-200" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-sm">Nexora Virtual Assistant</h3>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-[10px] text-indigo-200">24x7 Intelligent Banking Support</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-white/10 text-indigo-200 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#F8FAFC]">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${
              m.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs whitespace-pre-line leading-relaxed shadow-xs ${
                m.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-xs'
                  : 'bg-white text-slate-800 border border-slate-100 rounded-tl-xs'
              }`}
            >
              {m.text}
            </div>
            <span className="text-[9px] text-slate-400 mt-1 px-1">{m.time}</span>

            {/* Quick action chips from AI */}
            {m.quickActions && m.quickActions.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2 max-w-[90%]">
                {m.quickActions.map((qa, i) => (
                  <button
                    key={i}
                    onClick={() => handleActionClick(qa.action)}
                    className="text-[10px] font-semibold bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50 px-2.5 py-1 rounded-full shadow-2xs transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <span>{qa.label}</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-1.5 text-slate-400 text-xs px-2 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-white border-t border-slate-100 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question or type a command..."
          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="p-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
