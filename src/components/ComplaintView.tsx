import React, { useState } from 'react';
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
  X
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

      setLoadingStep('verifying');
      const data: ApiSubmissionResult = await response.json();

      if (response.ok && data.success) {
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
          estimatedResolution: '24 - 48 Hours',
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={onReturnToDashboard}
            className="p-2 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors cursor-pointer shadow-xs"
            title="Return to NetBanking Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="cursor-pointer hover:text-blue-600" onClick={onReturnToDashboard}>
                Accounts &amp; Deposits
              </span>
              <span>/</span>
              <span className="text-slate-800 font-semibold">Customer Care &amp; Grievance Redressal</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif mt-0.5">
              India Bank Customer Support &amp; Grievance Portal
            </h1>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1.5 rounded-lg">
          <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
          <span>RBI Customer Charter Compliant</span>
        </div>
      </div>

      {/* 24x7 Customer Calling Helplines Banner (Modeled after HDFC & ICICI Bank Customer Care) */}
      <div className="bg-gradient-to-r from-[#0A1E3F] via-[#0E2854] to-[#12366F] text-white rounded-xl p-5 sm:p-6 shadow-md border border-blue-900">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 text-xs font-semibold uppercase tracking-wider border border-amber-400/30">
              <PhoneCall className="w-3.5 h-3.5" />
              Need Immediate Assistance? Call Us
            </div>
            <h2 className="text-lg sm:text-xl font-bold font-serif text-white">
              24x7 PhoneBanking &amp; Customer Care Helplines
            </h2>
            <p className="text-xs sm:text-sm text-blue-200 leading-relaxed">
              Our dedicated banking executives are available around the clock to assist you with cheque books, account statements, debit cards, and dispute resolution.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 shrink-0">
            {/* Helpline 1: Toll-Free */}
            <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-lg border border-white/10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-xs">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-blue-200 font-semibold">Toll-Free (All India)</div>
                <a href="tel:18002026161" className="text-base sm:text-lg font-bold text-white hover:text-amber-300 tracking-wide font-mono">
                  1800 202 6161
                </a>
                <div className="text-[10px] text-blue-300">Alternate: 1860 267 6161</div>
              </div>
            </div>

            {/* Helpline 2: Emergency Card Block */}
            <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-lg border border-white/10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-red-200 font-semibold">Emergency Card / UPI Block</div>
                <a href="tel:18001204433" className="text-base sm:text-lg font-bold text-white hover:text-red-300 tracking-wide font-mono">
                  1800 120 4433
                </a>
                <div className="text-[10px] text-red-200">Instant 24x7 Hotlisting</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Contact Points Row */}
        <div className="mt-5 pt-4 border-t border-blue-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-blue-200">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-amber-400" />
            <span>Email Care: <strong className="text-white">care@indiabank.in</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-amber-400" />
            <span>Principal Nodal Office: <strong className="text-white">nodal.officer@indiabank.in (022-6890-1122)</strong></span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>Grievance Turnaround Time: <strong className="text-emerald-400">Within 24-48 Hours</strong></span>
          </div>
        </div>
      </div>

      {/* Support Sub-Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('lodge')}
          className={`pb-3 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'lodge'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Lodge Online Grievance / Service Request
        </button>
        <button
          onClick={() => setActiveTab('channels')}
          className={`pb-3 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'channels'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Contact Channels &amp; IVR Guide
        </button>
        <button
          onClick={() => setActiveTab('escalation')}
          className={`pb-3 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'escalation'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          RBI 3-Tier Grievance Matrix
        </button>
      </div>

      {/* TAB 1: LODGE GRIEVANCE FORM */}
      {activeTab === 'lodge' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Form Column (Left 8 Cols) */}
          <div className="lg:col-span-8">
            {!isSuccess ? (
              <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs">
                {/* Form Header */}
                <div className="flex items-center justify-between pb-5 border-b border-slate-100 mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 font-serif">
                      Register Grievance / Service Inquiry
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Direct integration with India Bank Customer Care &amp; Dispute Resolution Desk
                    </p>
                  </div>
                  <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    Level 1 Registration
                  </span>
                </div>

                {/* Error Banner */}
                {error && (
                  <div className="mb-5 p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2 animate-fadeIn">
                    <span className="font-bold text-red-800">Notice:</span>
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Account & Customer Details (Read-only pre-filled like real bank) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-lg bg-slate-50 border border-slate-200/80 text-xs">
                    <div>
                      <span className="text-slate-500 block text-[11px] uppercase tracking-wider font-medium">
                        Customer Account Number
                      </span>
                      <span className="font-mono font-bold text-slate-900 text-sm">
                        AC1000234567
                      </span>
                      <span className="text-slate-400 block text-[10px]">Regular Savings Account</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px] uppercase tracking-wider font-medium">
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
                      className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
                    >
                      Product / Department Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="product-type-select"
                      disabled={isSubmitting}
                      value={productType}
                      onChange={(e) => setProductType(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all font-sans cursor-pointer disabled:opacity-60"
                    >
                      {COMPLAINT_PRODUCT_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Select the specialized category to route directly to the designated dispute department.
                    </p>
                  </div>

                  {/* USER REQUESTED TEMPLATES: Quick Sample Complaints Ready (Click to fill) */}
                  <div className="pt-2 pb-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs uppercase tracking-wider text-slate-600 font-bold flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        Quick Sample Complaints (Click to Auto-Fill)
                      </span>
                      <span className="text-[11px] text-slate-400">One-click template pre-fill</span>
                    </div>

                    <div className="space-y-2">
                      {sampleTemplates.map((tmpl) => (
                        <button
                          key={tmpl.id}
                          type="button"
                          disabled={isSubmitting}
                          onClick={() => handleApplyTemplate(tmpl)}
                          className="w-full text-left p-3 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 bg-white transition-all cursor-pointer group flex flex-col gap-1 shadow-2xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-xs text-slate-800 group-hover:text-blue-700">
                              {tmpl.title}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 group-hover:bg-blue-100 text-slate-600 group-hover:text-blue-800 font-medium">
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
                        className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
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
                      className="w-full p-3.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all font-sans leading-relaxed disabled:opacity-60"
                    />
                    <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      Please include relevant transaction dates, dispatch SMS timestamps, or specific statement date ranges.
                    </p>
                  </div>

                  {/* Supporting Document Attachment Simulation (Standard in HDFC / ICICI Grievance) */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                      Supporting Document / Screenshot (Optional)
                    </label>
                    <div className="flex items-center gap-3">
                      <label className="px-3.5 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-medium cursor-pointer flex items-center gap-2 transition-colors">
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
                        <div className="flex items-center gap-2 text-xs bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-lg border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="truncate max-w-[200px]">{attachedFileName}</span>
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
                  <div className="pt-3 border-t border-slate-100 space-y-4">
                    <div className="text-[11px] text-slate-500 flex items-start gap-2">
                      <input
                        type="checkbox"
                        id="declaration-checkbox"
                        defaultChecked
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 mt-0.5"
                      />
                      <label htmlFor="declaration-checkbox" className="cursor-pointer">
                        I hereby declare that the particulars provided above pertain to my India Bank account and are true to the best of my knowledge.
                      </label>
                    </div>

                    <button
                      type="submit"
                      id="submit-complaint-btn"
                      disabled={isSubmitting}
                      className="w-full py-3.5 px-4 rounded-lg bg-[#0A1E3F] hover:bg-[#0E2854] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed group"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="w-4 h-4 text-amber-400 animate-spin" />
                          <span>
                            {loadingStep === 'authenticating' && 'Authenticating with India Bank Gateway...'}
                            {loadingStep === 'submitting' && 'Dispatching Grievance to MagicPlatform...'}
                            {loadingStep === 'verifying' && 'Confirming Dispatch Queue...'}
                          </span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
                          <span>Submit Grievance to India Bank Desk</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* SUCCESS STATE (Compliant with User Prompt: NO Reference Number Displayed) */
              <div className="bg-white border border-slate-200 rounded-xl p-8 sm:p-10 shadow-xs text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <div className="space-y-2 max-w-md mx-auto">
                  <h2 className="text-2xl font-bold text-slate-900 font-serif">
                    Your complaint has been received!
                  </h2>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    You will receive an email as soon as we process this complaint.
                  </p>
                </div>

                {/* Ticket Summary Card (No reference number displayed, strictly as requested) */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-left max-w-lg mx-auto space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <span className="text-xs font-semibold text-slate-700">Grievance Status</span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                      Dispatched to Resolution Queue
                    </span>
                  </div>

                  {/* Summary grid */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-500 block text-[11px]">Department / Product</span>
                      <span className="font-semibold text-slate-800">{productType}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Target Account</span>
                      <span className="font-semibold font-mono text-slate-800">AC1000234567</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Registered Recipient</span>
                      <span className="font-semibold text-slate-800 truncate block">{user.email}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Submission Time</span>
                      <span className="font-semibold text-slate-800">{submissionTimestamp || 'Just now'}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 text-xs text-slate-600">
                    <p className="italic">
                      "Our customer resolution team at India Bank is reviewing your request."
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={onReturnToDashboard}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[#0A1E3F] hover:bg-[#0E2854] text-white font-semibold text-sm transition-colors cursor-pointer"
                  >
                    Return to NetBanking Dashboard
                  </button>
                  <button
                    onClick={handleResetForm}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm transition-colors cursor-pointer border border-slate-200"
                  >
                    Lodge Another Request
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Banking Advice & PhoneBanking Guide (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* PhoneBanking Calling Tree Card (Like HDFC & ICICI Bank) */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-serif font-bold text-sm">
                <PhoneCall className="w-4 h-4 text-amber-500" />
                <span>PhoneBanking IVR Calling Guide</span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                When calling <strong className="text-slate-900">1800 202 6161</strong>, follow this key hierarchy for faster routing:
              </p>

              <div className="space-y-2 text-xs font-mono">
                <div className="p-2 rounded bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span>Press 1</span>
                  <span className="font-sans font-medium text-slate-700">Savings &amp; Current A/C</span>
                </div>
                <div className="p-2 rounded bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span>Press 2</span>
                  <span className="font-sans font-medium text-slate-700">Cheque Book Status</span>
                </div>
                <div className="p-2 rounded bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span>Press 3</span>
                  <span className="font-sans font-medium text-slate-700">Account Statement</span>
                </div>
                <div className="p-2 rounded bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span>Press 4</span>
                  <span className="font-sans font-medium text-slate-700">Debit Card Block</span>
                </div>
                <div className="p-2 rounded bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between">
                  <span className="font-bold">Press 9</span>
                  <span className="font-sans font-bold">Speak to Executive</span>
                </div>
              </div>
            </div>

            {/* Service Turnaround Commitment (RBI Charter) */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-serif font-bold text-sm">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Service Standards (RBI Charter)</span>
              </div>

              <div className="space-y-2.5 text-xs text-slate-600">
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                  <span>Cheque Book Delivery</span>
                  <span className="font-semibold text-slate-900">3-5 Working Days</span>
                </div>
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                  <span>Statement via Email</span>
                  <span className="font-semibold text-emerald-600">Instant to 2 Hours</span>
                </div>
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                  <span>Disputed Transaction</span>
                  <span className="font-semibold text-slate-900">7 Working Days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Card Hotlisting</span>
                  <span className="font-semibold text-emerald-600">Immediate</span>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-amber-950">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                Customer Advisory
              </div>
              <p className="leading-relaxed">
                India Bank officials will never ask for your NetBanking Password, OTP, or CVV. Report suspicious calls immediately to 1800 120 4433.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CONTACT CHANNELS & PHONE NUMBERS */}
      {activeTab === 'channels' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-serif">
              Customer Support Calling Numbers &amp; Contact Desks
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Reach out to our specialized support wings across India and overseas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
              <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <PhoneCall className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Domestic Retail Banking</h4>
              <p className="text-xs text-slate-500">For Savings, Current A/C, Cheques, Statements</p>
              <div className="pt-2">
                <div className="text-base font-bold font-mono text-blue-700">1800 202 6161</div>
                <div className="text-[11px] text-slate-400">Toll-Free, 24 Hours a day, 7 days a week</div>
              </div>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
              <div className="w-9 h-9 rounded-lg bg-red-100 text-red-700 flex items-center justify-center font-bold">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Emergency Hotlisting</h4>
              <p className="text-xs text-slate-500">Block Debit Card, NetBanking, or report fraudulent UPI</p>
              <div className="pt-2">
                <div className="text-base font-bold font-mono text-red-600">1800 120 4433</div>
                <div className="text-[11px] text-slate-400">Dedicated Rapid Response Helpline</div>
              </div>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
              <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">NRI &amp; Overseas Desk</h4>
              <p className="text-xs text-slate-500">For NRE/NRO accounts and foreign outward remittances</p>
              <div className="pt-2">
                <div className="text-base font-bold font-mono text-slate-900">+91 22 6789 2000</div>
                <div className="text-[11px] text-slate-400">Standard ISD rates apply</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: RBI 3-TIER GRIEVANCE MATRIX */}
      {activeTab === 'escalation' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-serif">
              RBI Mandated 3-Tier Grievance Redressal Mechanism
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              If your grievance is not resolved to your satisfaction, you may escalate in accordance with the Reserve Bank of India framework.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                1
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Level 1: Branch Manager / Online Grievance Portal</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Lodge your grievance via this online portal or by calling PhoneBanking at 1800 202 6161. Expected resolution time: Within 7 working days.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                2
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Level 2: Principal Nodal Officer</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  If the resolution provided at Level 1 does not meet your expectation within 7 days, you may write directly to our Principal Nodal Officer at <strong>nodal.officer@indiabank.in</strong> or call 022-6890-1122.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-slate-700 text-white flex items-center justify-center font-bold text-sm shrink-0">
                3
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Level 3: Reserve Bank of India Banking Ombudsman</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  If your complaint remains unaddressed for 30 days from the initial lodging date, you can approach the RBI Ombudsman scheme online at <a href="https://cms.rbi.org.in" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">cms.rbi.org.in</a>.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
