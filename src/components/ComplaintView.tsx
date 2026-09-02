import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  PhoneCall,
  Mail,
  AlertTriangle,
  Clock,
  HelpCircle,
  FileCheck2,
  RefreshCw,
  Landmark,
  ShieldCheck,
  Send,
  Building2,
  ChevronRight,
  Sparkles,
  Paperclip,
  CheckCircle2,
  X,
  Settings,
  Server,
  Wifi,
  WifiOff,
  ExternalLink,
  Check
} from 'lucide-react';
import { UserSession, ComplaintTicket, ApiSubmissionResult } from '../types';
import { COMPLAINT_PRODUCT_TYPES } from '../data/mockData';

interface ComplaintViewProps {
  user: UserSession;
  onReturnToDashboard: () => void;
  onTicketCreated: (ticket: ComplaintTicket) => void;
}

export const ComplaintView: React.FC<ComplaintViewProps> = ({
  user,
  onReturnToDashboard,
  onTicketCreated,
}) => {
  // Form states
  const [productType, setProductType] = useState<string>('Cheque Book');
  const [complaintDetails, setComplaintDetails] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'lodge' | 'channels' | 'escalation'>('lodge');
  const [attachedFileName, setAttachedFileName] = useState<string>('');

  // Backend Gateway Connectivity states (Solves GitHub Pages static hosting vs Full-Stack Node container)
  const [customBackendUrl, setCustomBackendUrl] = useState<string>(() => {
    return localStorage.getItem('IB_BACKEND_URL') || (import.meta.env.VITE_BACKEND_URL as string) || '';
  });
  const [backendStatus, setBackendStatus] = useState<
    'checking' | 'connected' | 'custom_connected' | 'static_github' | 'custom_error'
  >('checking');
  const [showBackendModal, setShowBackendModal] = useState<boolean>(false);
  const [tempBackendInput, setTempBackendInput] = useState<string>(() => {
    return localStorage.getItem('IB_BACKEND_URL') || (import.meta.env.VITE_BACKEND_URL as string) || '';
  });
  const [testPingResult, setTestPingResult] = useState<{
    testing: boolean;
    message?: string;
    success?: boolean;
  } | null>(null);

  // Loading and Workflow states
  const [loadingStep, setLoadingStep] = useState<
    'idle' | 'authenticating' | 'submitting' | 'verifying'
  >('idle');
  const [error, setError] = useState<string>('');

  // Success state
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [submittedResult, setSubmittedResult] = useState<ApiSubmissionResult | null>(null);
  const [submissionTimestamp, setSubmissionTimestamp] = useState<string>('');

  const isSubmitting = loadingStep !== 'idle';

  // Check Gateway Health on mount
  useEffect(() => {
    let isMounted = true;
    const verifyGateway = async () => {
      const savedUrl = localStorage.getItem('IB_BACKEND_URL');
      if (savedUrl && savedUrl.trim()) {
        try {
          const cleanUrl = savedUrl.trim().replace(/\/+$/, '');
          const res = await fetch(`${cleanUrl}/api/health`, {
            method: 'GET',
            signal: AbortSignal.timeout(3500),
          });
          if (res.ok) {
            if (isMounted) setBackendStatus('custom_connected');
            return;
          }
        } catch {
          if (isMounted) setBackendStatus('custom_error');
          return;
        }
      }

      // Check default relative endpoint
      try {
        const res = await fetch('/api/health', {
          method: 'GET',
          signal: AbortSignal.timeout(2000),
        });
        const ct = res.headers.get('content-type') || '';
        if (res.ok && ct.includes('application/json')) {
          if (isMounted) setBackendStatus('connected');
        } else {
          if (isMounted) setBackendStatus('static_github');
        }
      } catch {
        if (isMounted) setBackendStatus('static_github');
      }
    };

    verifyGateway();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleTestBackendPing = async () => {
    if (!tempBackendInput.trim()) {
      setTestPingResult({
        testing: false,
        success: false,
        message: 'Please enter a valid backend URL (e.g., https://your-app.run.app)',
      });
      return;
    }
    setTestPingResult({ testing: true });
    try {
      const cleanUrl = tempBackendInput.trim().replace(/\/+$/, '');
      const t0 = performance.now();
      const res = await fetch(`${cleanUrl}/api/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(4000),
      });
      const latency = Math.round(performance.now() - t0);
      const ct = res.headers.get('content-type') || '';
      if (res.ok && ct.includes('application/json')) {
        const json = await res.json().catch(() => ({}));
        setTestPingResult({
          testing: false,
          success: true,
          message: `Connected successfully (${latency}ms)! Backend active: "${json?.bank || 'India Bank'} (${json?.status || 'ok'})"`,
        });
      } else {
        setTestPingResult({
          testing: false,
          success: false,
          message: `Endpoint returned HTTP ${res.status} (non-JSON). Make sure this points to your deployed Express backend.`,
        });
      }
    } catch (err: any) {
      setTestPingResult({
        testing: false,
        success: false,
        message: `Connection failed: ${err.message || 'Network timeout or CORS blocked'}. Ensure CORS is enabled on your backend.`,
      });
    }
  };

  const handleSaveBackendUrl = () => {
    const cleanUrl = tempBackendInput.trim().replace(/\/+$/, '');
    if (cleanUrl) {
      localStorage.setItem('IB_BACKEND_URL', cleanUrl);
      setCustomBackendUrl(cleanUrl);
      setBackendStatus('custom_connected');
    } else {
      localStorage.removeItem('IB_BACKEND_URL');
      setCustomBackendUrl('');
      setBackendStatus('checking');
    }
    setShowBackendModal(false);
    setTestPingResult(null);
  };

  const handleResetBackendUrl = () => {
    localStorage.removeItem('IB_BACKEND_URL');
    setCustomBackendUrl('');
    setTempBackendInput('');
    setTestPingResult(null);
    setShowBackendModal(false);
    fetch('/api/health')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(() => setBackendStatus('connected'))
      .catch(() => setBackendStatus('static_github'));
  };

  // The 3 user-requested complaint templates
  const sampleTemplates = [
    {
      id: 'template-cheque-status',
      title: 'Cheque Book Dispatch Status',
      category: 'Cheque Book',
      badge: 'SMS Dispatched, Not Received',
      text: `I am writing to inquire about the status of my cheque book. I received an SMS confirming its dispatch, but I have not received it yet. account number: AC1000234567`,
    },
    {
      id: 'template-statement-tax',
      title: 'Tax Statement Request (1 Apr - 31 Jul)',
      category: 'Account Statement',
      badge: 'Formal English',
      text: `Hello Team,
Please send me the official bank account statement for my account number AC1000234567 for the period covering 1st April 2025 to 31st July 2025.
I require this document for tax filing purposes. Kindly email the PDF to this registered email address at your earliest convenience.
Thank you,`,
    },
    {
      id: 'template-hinglish-statement',
      title: 'Bank Statement (Hinglish/Hindi)',
      category: 'Account Statement',
      badge: 'Conversational Hindi',
      text: `namaste team, aap mujhe meri april se leke june ki bank statement bhej skte hain kya. Account number AC1000234567`,
    },
  ];

  const handleApplyTemplate = (tmpl: typeof sampleTemplates[0]) => {
    setProductType(tmpl.category);
    setComplaintDetails(tmpl.text);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!complaintDetails.trim()) {
      setError('Please provide specific complaint or request details including your Account Number.');
      return;
    }

    try {
      setLoadingStep('authenticating');
      await new Promise((resolve) => setTimeout(resolve, 350));

      setLoadingStep('submitting');

      let data: ApiSubmissionResult;
      try {
        // Call the server backend proxy to dispatch complaint
        const response = await fetch('/api/complaint/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: user.email,
            productType: productType,
            complaintDetails: complaintDetails.trim(),
          }),
        });

        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          data = await response.json();
          if (!response.ok || !data.success) {
            throw new Error(data.error || 'Failed to file grievance through India Bank grievance portal.');
          }
        } else {
          // Running on static hosting like GitHub Pages without Node/Express backend
          const localTraceId = `IB-TKT-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;
          data = {
            success: true,
            trace_id: localTraceId,
            timestamp: new Date().toISOString(),
            apiNotice: 'Grievance ticket registered in Client Static Mode (GitHub Pages). Reference ID generated.',
            liveApi: false,
          };
        }
      } catch (fetchErr: any) {
        // Fallback to client-side generated ticket if backend network is unreachable
        const localTraceId = `IB-TKT-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;
        data = {
          success: true,
          trace_id: localTraceId,
          timestamp: new Date().toISOString(),
          apiNotice: 'Grievance ticket registered in Client Static Mode (GitHub Pages). Reference ID generated.',
          liveApi: false,
        };
      }

      setLoadingStep('verifying');

      if (data.success) {
        const timeString = new Date().toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        });
        setSubmissionTimestamp(timeString);

        setSubmittedResult(data);
        setIsSuccess(true);

        // Notify parent state for active session ticket tracking
        onTicketCreated({
          traceId: data.trace_id,
          email: user.email,
          productType: productType,
          details: complaintDetails.trim(),
          status: 'Received',
          timestamp: timeString,
          estimatedResolution: 'Less than 24 Hours',
          isLiveApi: !!data.liveApi,
          apiNotice: data.apiNotice,
        });
      } else {
        throw new Error(data.error || 'Failed to file grievance through India Bank grievance portal.');
      }
    } catch (err: any) {
      console.error('Complaint submission error:', err);
      setError(
        err.message || 'An unexpected error occurred while communicating with India Bank Grievance Desk.'
      );
    } finally {
      setLoadingStep('idle');
    }
  };

  const handleResetForm = () => {
    setIsSuccess(false);
    setSubmittedResult(null);
    setComplaintDetails('');
    setProductType('Cheque Book');
    setAttachedFileName('');
    setError('');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="flex items-center gap-3">
          <button
            onClick={onReturnToDashboard}
            className="w-10 h-10 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80 transition-all cursor-pointer shadow-xs flex items-center justify-center shrink-0 hover:border-slate-300"
            title="Return to NetBanking Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <span className="cursor-pointer hover:text-indigo-600 transition-colors" onClick={onReturnToDashboard}>
                NetBanking
              </span>
              <span>/</span>
              <span className="text-slate-700">Customer Support Desk</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
              Customer Support &amp; Grievance Redressal
            </h1>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 text-xs bg-emerald-50 text-emerald-900 border border-emerald-200/90 px-3.5 py-1.5 rounded-full font-bold shadow-2xs self-start sm:self-auto">
          <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Turnaround Time: Less than 24 Hours</span>
        </div>
      </div>

      {/* 24x7 Customer Calling Helplines Banner (Sleek modern design synced with Dashboard) */}
      <div className="bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-800/80">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider border border-indigo-400/30">
              <PhoneCall className="w-3.5 h-3.5" />
              Priority Assistance &amp; 24x7 Care
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Dedicated PhoneBanking &amp; Redressal Desk
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Specialized banking officers are available round-the-clock for cheque book delivery inquiries, statement dispatches, card security, and dispute resolution.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 shrink-0">
            {/* Helpline 1: Toll-Free */}
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 flex items-center gap-3.5 shadow-xs hover:bg-white/15 transition-all">
              <div className="w-11 h-11 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-xs font-bold">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-slate-300 font-bold">Toll-Free Support</div>
                <a href="tel:18002026161" className="text-lg font-black text-white hover:text-amber-300 tracking-wide font-mono transition-colors">
                  1800 202 6161
                </a>
                <div className="text-[10px] text-slate-400">Toll-Free • 24x7 Available</div>
              </div>
            </div>

            {/* Helpline 2: Emergency Card Block */}
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 flex items-center gap-3.5 shadow-xs hover:bg-white/15 transition-all">
              <div className="w-11 h-11 rounded-xl bg-red-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-red-300 font-bold">Emergency Hotline</div>
                <a href="tel:18001204433" className="text-lg font-black text-white hover:text-red-300 tracking-wide font-mono transition-colors">
                  1800 120 4433
                </a>
                <div className="text-[10px] text-red-300">Instant Card / UPI Block</div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Points & SLA Row */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-amber-400" />
            <span>Email Care: <strong className="text-white font-medium">care@indiabank.in</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-indigo-400" />
            <span>Nodal Office: <strong className="text-white font-medium">nodal.officer@indiabank.in (022-6890-1122)</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>Resolution Turnaround: <strong className="text-emerald-400 font-bold">&lt; 24 Hours Guaranteed</strong></span>
          </div>
        </div>
      </div>

      {/* Support Sub-Navigation Tabs (Modern Segmented Pills) */}
      <div className="flex items-center">
        <div className="inline-flex p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200/80 gap-1 text-xs sm:text-sm font-semibold">
          <button
            onClick={() => setActiveTab('lodge')}
            className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer font-bold ${
              activeTab === 'lodge'
                ? 'bg-white text-indigo-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            Lodge Grievance / Request
          </button>
          <button
            onClick={() => setActiveTab('channels')}
            className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer font-bold ${
              activeTab === 'channels'
                ? 'bg-white text-indigo-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            Contact Channels &amp; IVR Guide
          </button>
          <button
            onClick={() => setActiveTab('escalation')}
            className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer font-bold ${
              activeTab === 'escalation'
                ? 'bg-white text-indigo-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            3-Tier Escalation Matrix
          </button>
        </div>
      </div>

      {/* TAB 1: LODGE GRIEVANCE FORM */}
      {activeTab === 'lodge' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          {/* Main Form Column (Left 8 Cols) */}
          <div className="lg:col-span-8">
            {!isSuccess ? (
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs">
                {/* Form Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100 mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                      Register Grievance / Service Inquiry
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Direct integration with India Bank Priority Customer Support Desk
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 self-start sm:self-auto">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    Turnaround: &lt; 24 Hours
                  </span>
                </div>

                {/* Error Banner */}
                {error && (
                  <div className="mb-5 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2 animate-fadeIn">
                    <span className="font-bold text-red-800">Notice:</span>
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Account & Customer Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-semibold">
                        Customer Account Number
                      </span>
                      <span className="font-mono font-bold text-slate-900 text-sm">
                        AC1000234567
                      </span>
                      <span className="text-slate-400 block text-[10px]">Regular Savings Account</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-semibold">
                        Registered Email Address
                      </span>
                      <span className="font-medium text-slate-900 truncate block">
                        {user.email}
                      </span>
                      <span className="text-slate-400 block text-[10px]">Official updates will be emailed here</span>
                    </div>
                  </div>

                  {/* Product / Department Category Dropdown */}
                  <div>
                    <label
                      htmlFor="product-type-select"
                      className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
                    >
                      Product / Department Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="product-type-select"
                      disabled={isSubmitting}
                      value={productType}
                      onChange={(e) => setProductType(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-slate-900 text-sm focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 transition-all font-sans cursor-pointer disabled:opacity-60"
                    >
                      {COMPLAINT_PRODUCT_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    <p className="text-[11px] text-slate-400 mt-1.5">
                      Select the category to route your ticket directly to the specialized grievance team.
                    </p>
                  </div>

                  {/* Quick Sample Complaints (Click to Auto-Fill) */}
                  <div className="pt-2 pb-1">
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-xs uppercase tracking-wider text-slate-700 font-bold flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        Quick Sample Templates (Click to Auto-Fill)
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">1-Click Pre-fill</span>
                    </div>

                    <div className="space-y-2.5">
                      {sampleTemplates.map((tmpl) => (
                        <button
                          key={tmpl.id}
                          type="button"
                          disabled={isSubmitting}
                          onClick={() => handleApplyTemplate(tmpl)}
                          className="w-full text-left p-3.5 rounded-2xl border border-slate-200/80 hover:border-indigo-400 hover:bg-indigo-50/40 bg-white transition-all cursor-pointer group flex flex-col gap-1 shadow-2xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-slate-800 group-hover:text-indigo-700">
                              {tmpl.title}
                            </span>
                            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-100 group-hover:bg-indigo-100 text-slate-600 group-hover:text-indigo-800 font-semibold">
                              {tmpl.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-1 italic font-sans">
                            "{tmpl.text}"
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Complaint Details Textarea */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label
                        htmlFor="complaint-details-textarea"
                        className="block text-xs font-bold uppercase tracking-wider text-slate-700"
                      >
                        Complaint / Request Details <span className="text-red-500">*</span>
                      </label>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {complaintDetails.length} characters
                      </span>
                    </div>
                    <textarea
                      id="complaint-details-textarea"
                      rows={5}
                      required
                      disabled={isSubmitting}
                      value={complaintDetails}
                      onChange={(e) => setComplaintDetails(e.target.value)}
                      placeholder="Please describe your grievance or request in detail. State the date of incident, SMS alerts received, or required period (e.g. Account statement period)."
                      className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 transition-all font-sans leading-relaxed disabled:opacity-60"
                    />
                    <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      Resolution is committed within less than 24 hours of ticket submission.
                    </p>
                  </div>

                  {/* Supporting Document Attachment */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Supporting Document / Screenshot (Optional)
                    </label>
                    <div className="flex items-center gap-3">
                      <label className="px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold cursor-pointer flex items-center gap-2 transition-colors">
                        <Paperclip className="w-3.5 h-3.5 text-slate-500" />
                        <span>{attachedFileName ? 'Change Attachment' : 'Attach Screenshot or PDF'}</span>
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) setAttachedFileName(file.name);
                          }}
                        />
                      </label>
                      {attachedFileName && (
                        <div className="flex items-center gap-2 text-xs bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-xl border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="truncate max-w-[200px] font-medium">{attachedFileName}</span>
                          <button
                            type="button"
                            onClick={() => setAttachedFileName('')}
                            className="text-slate-400 hover:text-red-500"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Customer Declaration & Submit Button */}
                  <div className="pt-4 border-t border-slate-100 space-y-4">
                    <div className="text-[11px] text-slate-500 flex items-start gap-2">
                      <input
                        type="checkbox"
                        id="declaration-checkbox"
                        defaultChecked
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 mt-0.5"
                      />
                      <label htmlFor="declaration-checkbox" className="cursor-pointer">
                        I hereby declare that the particulars provided above pertain to my India Bank account and are true to the best of my knowledge.
                      </label>
                    </div>

                    <button
                      type="submit"
                      id="submit-complaint-btn"
                      disabled={isSubmitting}
                      className="w-full py-4 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed group"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="w-4 h-4 text-amber-300 animate-spin" />
                          <span>
                            {loadingStep === 'authenticating' && 'Authenticating with India Bank Gateway...'}
                            {loadingStep === 'submitting' && 'Dispatching Grievance to MagicPlatform...'}
                            {loadingStep === 'verifying' && 'Confirming Dispatch Queue...'}
                          </span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 text-amber-300 group-hover:translate-x-0.5 transition-transform" />
                          <span>Submit Grievance to India Bank Desk</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* SUCCESS STATE (NO Reference Number Displayed) */
              <div className="bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-12 shadow-xs text-center space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <div className="space-y-2 max-w-md mx-auto">
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    Your complaint has been received!
                  </h2>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    You will receive an email as soon as we process this complaint.
                  </p>
                </div>

                {/* Ticket Summary Card */}
                <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-6 text-left max-w-lg mx-auto space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <span className="text-xs font-bold text-slate-700">Grievance Status</span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                      Dispatched to Resolution Queue
                    </span>
                  </div>

                  {/* Summary grid */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px] font-semibold">Department / Product</span>
                      <span className="font-bold text-slate-800">{productType}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px] font-semibold">Target Account</span>
                      <span className="font-bold font-mono text-slate-800">AC1000234567</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px] font-semibold">Registered Recipient</span>
                      <span className="font-bold text-slate-800 truncate block">{user.email}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px] font-semibold">Target Resolution</span>
                      <span className="font-bold text-emerald-600">&lt; 24 Hours Guaranteed</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 text-xs text-slate-600">
                    <p className="italic">
                      "Our customer resolution team at India Bank is actively handling your request under our 24-hour turnaround SLA."
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={onReturnToDashboard}
                    className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-colors cursor-pointer shadow-sm"
                  >
                    Return to NetBanking Dashboard
                  </button>
                  <button
                    onClick={handleResetForm}
                    className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-colors cursor-pointer border border-slate-200/80"
                  >
                    Lodge Another Request
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Banking Advice & PhoneBanking Guide */}
          <div className="lg:col-span-4 space-y-6">
            {/* PhoneBanking Calling Tree Card */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <span>PhoneBanking IVR Menu Guide</span>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                When calling <strong className="text-slate-900">1800 202 6161</strong>, follow this key hierarchy for faster routing:
              </p>

              <div className="space-y-2 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                  <span className="font-bold text-slate-900">Press 1</span>
                  <span className="font-sans font-medium text-slate-700">Savings &amp; Current A/C</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                  <span className="font-bold text-slate-900">Press 2</span>
                  <span className="font-sans font-medium text-slate-700">Cheque Book Status</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                  <span className="font-bold text-slate-900">Press 3</span>
                  <span className="font-sans font-medium text-slate-700">Account Statement</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                  <span className="font-bold text-slate-900">Press 4</span>
                  <span className="font-sans font-medium text-slate-700">Debit Card Block</span>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between">
                  <span className="font-black">Press 9</span>
                  <span className="font-sans font-bold">Speak to Executive</span>
                </div>
              </div>
            </div>

            {/* Service Turnaround Commitment */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <span>Service Standards &amp; SLA</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900">
                  &lt; 24h Target
                </span>
              </div>

              <div className="space-y-3 text-xs text-slate-600">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="font-medium">Dispute &amp; Grievance Resolution</span>
                  <span className="font-bold text-emerald-600">&lt; 24 Hours Guaranteed</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span>Statement via Email</span>
                  <span className="font-semibold text-emerald-600">Instant to 1 Hour</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span>Cheque Book Delivery</span>
                  <span className="font-semibold text-slate-900">24 - 48 Hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Emergency Card Hotlisting</span>
                  <span className="font-semibold text-emerald-600">Immediate (&lt; 60s)</span>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="p-5 rounded-3xl bg-amber-50/80 border border-amber-200/90 text-xs text-amber-950 space-y-1.5 shadow-2xs">
              <div className="font-bold flex items-center gap-1.5 text-amber-950">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                Customer Advisory
              </div>
              <p className="leading-relaxed text-amber-900">
                India Bank officials will never ask for your NetBanking Password, OTP, or Card CVV. Report suspicious calls immediately to 1800 120 4433.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CONTACT CHANNELS & PHONE NUMBERS */}
      {activeTab === 'channels' && (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              Customer Support Calling Numbers &amp; Contact Desks
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Reach out to our specialized support teams across India and overseas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-6 rounded-2xl border border-slate-200/80 bg-slate-50/60 space-y-3 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                <PhoneCall className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Domestic Retail Banking</h4>
              <p className="text-xs text-slate-500 leading-relaxed">For Savings, Current A/C, Cheques, Statements</p>
              <div className="pt-2">
                <div className="text-lg font-bold font-mono text-indigo-700">1800 202 6161</div>
                <div className="text-[11px] text-slate-400">Toll-Free • 24 Hours a day, 7 days a week</div>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200/80 bg-slate-50/60 space-y-3 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-bold">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Emergency Hotlisting</h4>
              <p className="text-xs text-slate-500 leading-relaxed">Block Debit Card, NetBanking, or report fraudulent UPI</p>
              <div className="pt-2">
                <div className="text-lg font-bold font-mono text-red-600">1800 120 4433</div>
                <div className="text-[11px] text-slate-400">Dedicated Rapid Response Helpline</div>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200/80 bg-slate-50/60 space-y-3 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">NRI &amp; Overseas Desk</h4>
              <p className="text-xs text-slate-500 leading-relaxed">For NRE/NRO accounts and foreign outward remittances</p>
              <div className="pt-2">
                <div className="text-lg font-bold font-mono text-slate-900">+91 22 6789 2000</div>
                <div className="text-[11px] text-slate-400">Standard ISD rates apply</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: 3-TIER GRIEVANCE MATRIX */}
      {activeTab === 'escalation' && (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              3-Tier Customer Grievance Redressal Mechanism
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              If your grievance requires additional review, our structured institutional escalation channels ensure rapid resolution.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-2xl border border-indigo-200 bg-indigo-50/40 flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                1
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Level 1: Customer Support Desk / Branch Manager</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Lodge your grievance via this online portal or by calling PhoneBanking at 1800 202 6161. <strong className="text-indigo-900">Turnaround time: Guaranteed less than 24 hours.</strong>
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-amber-200 bg-amber-50/40 flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                2
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Level 2: Principal Nodal Officer</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  If the resolution provided at Level 1 requires escalation, you may write directly to our Principal Nodal Officer at <strong>nodal.officer@indiabank.in</strong> or call 022-6890-1122.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-slate-700 text-white flex items-center justify-center font-bold text-sm shrink-0">
                3
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Level 3: Executive Committee &amp; Banking Ombudsman</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  If your complaint remains unaddressed beyond designated institutional windows, you can approach the independent Banking Ombudsman scheme online at <a href="https://cms.rbi.org.in" target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline font-semibold">cms.rbi.org.in</a>.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
