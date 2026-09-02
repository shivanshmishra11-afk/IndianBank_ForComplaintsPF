import React, { useState, useRef, useEffect } from 'react';
import {
  Building2,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  KeyRound,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Smartphone,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { safeStorage } from '../utils/storage';

interface LoginViewProps {
  onLogin: (email: string) => void;
  savedEmail?: string;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin, savedEmail = '' }) => {
  // Step state: 'credentials' or 'otp'
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');

  // Credentials state
  const [email, setEmail] = useState(savedEmail || 'shivansh.mishra@intellectdesign.com');
  const [password, setPassword] = useState('Intellect@8012');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 6-digit OTP state
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(30);
  const [resendNotification, setResendNotification] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto-decrement OTP resend timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'otp' && resendCountdown > 0) {
      timer = setTimeout(() => setResendCountdown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [step, resendCountdown]);

  // Focus the first OTP input when switching to 'otp' step
  useEffect(() => {
    if (step === 'otp') {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [step]);

  // Handle Step 1: Submit Credentials
  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError('Please provide your corporate or personal bank email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError('Please enter a valid email address format (e.g. name@intellectbank.com).');
      return;
    }

    setIsSubmitting(true);

    // Save to safeStorage
    if (rememberMe) {
      safeStorage.setItem('intellect_bank_remember_email', trimmedEmail);
    } else {
      safeStorage.removeItem('intellect_bank_remember_email');
    }

    // Move to Step 2: 6-Digit OTP Verification
    setTimeout(() => {
      setIsSubmitting(false);
      setOtp(['', '', '', '', '', '']);
      setOtpError('');
      setResendCountdown(30);
      setStep('otp');
    }, 400);
  };

  // Handle individual OTP digit change
  const handleOtpChange = (index: number, value: string) => {
    // Only accept numeric digit
    const cleaned = value.replace(/\D/g, '');
    if (!cleaned && value !== '') return;

    const newDigit = cleaned.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = newDigit;
    setOtp(newOtp);
    setOtpError('');

    // If a digit was entered, auto-focus next input box
    if (newDigit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // If all 6 digits are filled, auto-trigger validation with slight tactile delay
    if (newDigit && index === 5 && newOtp.every((d) => d !== '')) {
      handleVerifyOtp(newOtp.join(''));
    }
  };

  // Handle backspace navigation in OTP boxes
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle pasting full 6-digit OTP
  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pastedData) return;

    const newOtp = [...otp];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pastedData[i] || '';
    }
    setOtp(newOtp);
    setOtpError('');

    // Focus last filled box or submit if complete
    const targetIdx = Math.min(pastedData.length, 5);
    inputRefs.current[targetIdx]?.focus();

    if (pastedData.length === 6) {
      handleVerifyOtp(pastedData);
    }
  };

  // Step 2 Verification - Accepts ANY 6-digit number as requested
  const handleVerifyOtp = (codeToVerify?: string) => {
    const code = codeToVerify || otp.join('');
    if (code.length < 6) {
      setOtpError('Please enter the full 6-digit verification code.');
      return;
    }

    setIsVerifyingOtp(true);
    setOtpError('');

    // Save session email to safeStorage
    safeStorage.setItem('intellect_bank_user_email', email.trim());

    // Tactile verification delay for authentic banking experience
    setTimeout(() => {
      setIsVerifyingOtp(false);
      onLogin(email.trim());
    }, 500);
  };

  // Fill dummy test OTP code (123456)
  const handleQuickFillOtp = () => {
    const testCode = ['1', '2', '3', '4', '5', '6'];
    setOtp(testCode);
    setOtpError('');
    inputRefs.current[5]?.focus();
  };

  // Resend OTP trigger
  const handleResendOtp = () => {
    if (resendCountdown > 0) return;
    setResendCountdown(30);
    setResendNotification('New 6-digit passcode dispatched to your email.');
    setTimeout(() => setResendNotification(''), 4000);
  };

  const handleQuickFill = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('••••••••••••');
    setError('');
  };

  return (
    <div className="min-h-[calc(100vh-7rem)] flex-1 flex items-center justify-center p-4 py-12 bg-[#F8FAFC] relative">
      <div className="w-full max-w-[440px] relative z-10">
        {/* Main Bank Portal Card (Editorial White Surface) */}
        <div className="card bg-white border border-slate-200 shadow-sm rounded-xl p-8 sm:p-10 text-slate-900 transition-all duration-300">
          {step === 'credentials' ? (
            /* ================= STEP 1: CREDENTIALS ================= */
            <>
              {/* Bank Brand Header */}
              <div className="text-center mb-7">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#0A1E3F] text-amber-400 mb-3.5 shadow-sm border border-blue-900">
                  <Building2 className="w-6 h-6 text-amber-400" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-serif">
                  India Bank
                </h1>
                <p className="text-slate-500 text-xs sm:text-sm mt-1 font-normal">
                  Secure NetBanking Customer Portal
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2 animate-fadeIn">
                  <span className="font-bold text-red-800">Error:</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@intellect.com"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all font-sans"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Password <span className="text-slate-400 text-[10px] font-normal lowercase">(dummy field)</span>
                    </label>
                    <span className="text-xs text-blue-600 hover:underline cursor-pointer">
                      Forgot your password?
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 pr-10 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all font-sans"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>Remember credentials</span>
                  </label>
                  <span className="text-emerald-600 font-medium text-[11px] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Ready
                  </span>
                </div>

                <button
                  id="login-submit-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-lg font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 shadow-sm"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Quick Demo Test Buttons */}
              <div className="mt-6 pt-5 border-t border-slate-100">
                <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-2">
                  Quick Fill Profile
                </p>
                <div className="flex flex-col gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleQuickFill('shivansh.mishra@intellectdesign.com')}
                    className="w-full text-left px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-xs text-slate-700 transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <KeyRound className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="truncate font-medium">shivansh.mishra@intellectdesign.com</span>
                    </div>
                    <span className="text-[10px] text-blue-600 uppercase font-mono font-bold shrink-0 ml-2">Fill</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickFill('customer.support@intellectbank.com')}
                    className="w-full text-left px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-xs text-slate-700 transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <KeyRound className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                      <span className="truncate font-medium">customer.support@intellectbank.com</span>
                    </div>
                    <span className="text-[10px] text-slate-600 uppercase font-mono font-bold shrink-0 ml-2">Fill</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* ================= STEP 2: 6-DIGIT OTP VERIFICATION ================= */
            <div className="space-y-6 animate-fadeIn">
              {/* Top Navigation */}
              <button
                type="button"
                onClick={() => setStep('credentials')}
                className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to credentials</span>
              </button>

              {/* Header */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 mb-3 shadow-xs">
                  <Smartphone className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 font-serif">
                  Two-Factor Authentication
                </h2>
                <p className="text-slate-500 text-xs sm:text-sm mt-1.5">
                  Enter the 6-digit security code dispatched to:
                </p>
                <div className="mt-1 font-mono font-semibold text-xs text-slate-800 bg-slate-100 py-1 px-3 rounded-full inline-block">
                  {email}
                </div>
              </div>

              {/* Notification Banner */}
              {resendNotification && (
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{resendNotification}</span>
                </div>
              )}

              {/* Error Banner */}
              {otpError && (
                <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-fadeIn">
                  <span className="font-bold text-red-800">Notice:</span>
                  <span>{otpError}</span>
                </div>
              )}

              {/* 6 Digit Input Boxes */}
              <div className="space-y-3">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 text-center">
                  Enter 6-Digit Code (Accepts Any 6 Digits)
                </label>

                <div className="flex items-center justify-center gap-2 sm:gap-2.5">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => {
                        inputRefs.current[idx] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      onPaste={idx === 0 ? handleOtpPaste : undefined}
                      className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-mono font-bold rounded-lg border transition-all ${
                        digit
                          ? 'border-blue-600 bg-blue-50/20 text-slate-900 ring-1 ring-blue-600'
                          : 'border-slate-300 bg-white text-slate-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600'
                      }`}
                    />
                  ))}
                </div>

                <p className="text-[11px] text-slate-400 text-center font-sans">
                  Dummy validation enabled &bull; Any 6 digits will be accepted.
                </p>
              </div>

              {/* Quick Fill Button & Resend */}
              <div className="flex flex-col gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleQuickFillOtp}
                  className="w-full py-2 px-3 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer font-medium"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Auto-fill Demo Code (123456)</span>
                </button>

                <div className="flex items-center justify-between text-xs text-slate-500 px-1 pt-1">
                  <span>Didn't receive code?</span>
                  {resendCountdown > 0 ? (
                    <span className="text-slate-400 font-mono text-[11px]">
                      Resend in {resendCountdown}s
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Resend OTP</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Verify & Proceed Button */}
              <button
                id="verify-otp-submit-btn"
                type="button"
                onClick={() => handleVerifyOtp()}
                disabled={isVerifyingOtp || otp.join('').length !== 6}
                className="w-full py-3 px-4 rounded-lg font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {isVerifyingOtp ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <>
                    <span>Verify & Continue to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Footer Security Badges */}
        <div className="mt-5 text-center text-xs text-slate-400 flex items-center justify-center gap-3">
          <span>&copy; {new Date().getFullYear()} India Bank</span>
          <span>&bull;</span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            256-Bit SSL Encrypted
          </span>
          <span>&bull;</span>
          <span>RBI Licensed Bank</span>
        </div>
      </div>
    </div>
  );
};
