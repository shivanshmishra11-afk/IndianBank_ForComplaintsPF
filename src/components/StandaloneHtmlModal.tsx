import React, { useState } from 'react';
import { X, FileCode2, Copy, Check, Download } from 'lucide-react';

interface StandaloneHtmlModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StandaloneHtmlModal: React.FC<StandaloneHtmlModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const standaloneHtmlCode = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Intellect Bank - Customer Portal</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Cinzel:wght@700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
    .serif-title { font-family: 'Cinzel', serif; }
  </style>
</head>
<body class="bg-slate-900 text-slate-100 min-h-screen antialiased flex flex-col">

  <!-- TOP HEADER -->
  <header class="bg-slate-950/90 border-b border-slate-800 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg">IB</div>
        <div>
          <span class="text-xl font-bold tracking-tight text-white serif-title">Intellect Bank</span>
          <span class="ml-2 px-1.5 py-0.5 text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded">Premier</span>
        </div>
      </div>
      <div id="nav-user-bar" class="hidden flex items-center gap-3 text-xs">
        <span id="nav-user-email" class="text-slate-300 font-mono"></span>
        <button onclick="logout()" class="px-3 py-1.5 bg-slate-800 hover:bg-red-950/40 hover:text-red-300 border border-slate-700 rounded-lg">Logout</button>
      </div>
    </div>
  </header>

  <!-- MAIN CONTAINER -->
  <main class="flex-1 flex flex-col">

    <!-- VIEW 1: LOGIN PAGE -->
    <section id="view-login" class="flex-1 flex items-center justify-center p-4 py-12">
      <div class="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <div class="text-center mb-8">
          <div class="inline-flex w-14 h-14 rounded-2xl bg-blue-600 text-white items-center justify-center text-2xl font-bold mb-3 shadow-lg">IB</div>
          <h1 class="text-2xl font-bold text-white serif-title">Intellect Bank</h1>
          <p class="text-xs text-slate-400 mt-1">Global Online Banking Portal</p>
        </div>

        <form onsubmit="handleLogin(event)" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">Email Address <span class="text-red-400">*</span></label>
            <input id="login-email" type="email" required placeholder="name@intellectbank.com" value="shivansh.mishra@intellectdesign.com"
              class="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none">
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase mb-1">Password (Dummy Field)</label>
            <input id="login-password" type="password" placeholder="••••••••••••" value="Intellect@8012"
              class="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none">
          </div>
          <button type="submit" class="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-sm shadow-lg shadow-blue-600/30 transition-all">
            Login
          </button>
        </form>
      </div>
    </section>

    <!-- VIEW 2: CUSTOMER DASHBOARD -->
    <section id="view-dashboard" class="hidden max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 space-y-6">
      <div class="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span class="text-xs text-emerald-400 font-semibold uppercase tracking-wider">&bull; Verified Client</span>
          <h1 id="welcome-message" class="text-2xl sm:text-3xl font-bold text-white serif-title mt-1">Welcome back</h1>
          <p class="text-xs text-slate-400 mt-1">Premier Checking &bull; Real-time Account Overview</p>
        </div>
        <button onclick="goToView('view-complaint')" class="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl shadow-lg transition-all">
          Raise a Complaint / Ticket
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div class="text-xs uppercase tracking-wider text-slate-400 font-semibold">Account Balance</div>
            <div class="text-4xl sm:text-5xl font-extrabold text-white mt-2">$12,450.00</div>
            <p class="text-xs text-slate-400 mt-1">Primary Checking Account &bull; Available Funds</p>
          </div>

          <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 class="text-lg font-bold text-white serif-title mb-4">Recent Transactions</h2>
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs">
                <thead>
                  <tr class="border-b border-slate-800 text-slate-400 font-semibold">
                    <th class="pb-2">Description</th>
                    <th class="pb-2">Category</th>
                    <th class="pb-2">Status</th>
                    <th class="pb-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-800 text-slate-300">
                  <tr><td class="py-3">Intellect Corp Payroll</td><td>Salary</td><td class="text-emerald-400">Completed</td><td class="text-right text-emerald-400 font-bold">+$5,450.00</td></tr>
                  <tr><td class="py-3">Apple Store Manhattan</td><td>Electronics</td><td class="text-emerald-400">Completed</td><td class="text-right font-bold">-$149.00</td></tr>
                  <tr><td class="py-3">Amazon Web Services</td><td>Cloud Hosting</td><td class="text-emerald-400">Completed</td><td class="text-right font-bold">-$284.50</td></tr>
                  <tr><td class="py-3">Starbucks Reserve</td><td>Dining</td><td class="text-emerald-400">Completed</td><td class="text-right font-bold">-$18.25</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <div class="bg-slate-900 border border-blue-900/40 rounded-2xl p-6">
            <h3 class="font-bold text-white serif-title text-base mb-2">Help & Support</h3>
            <p class="text-xs text-slate-300 leading-relaxed mb-4">
              Need assistance with your debit card, statements, or digital banking? Submit a complaint directly to our MagicPlatform automated dispute queue.
            </p>
            <button onclick="goToView('view-complaint')" class="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-lg transition-all">
              Raise a Complaint / Ticket
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- VIEW 3: COMPLAINT FORM & SUCCESS SCREEN -->
    <section id="view-complaint" class="hidden max-w-3xl mx-auto w-full px-4 sm:px-6 py-8 space-y-6">
      <button onclick="goToView('view-dashboard')" class="text-xs text-blue-400 hover:underline flex items-center gap-1">&larr; Return to Dashboard</button>

      <!-- FORM CONTAINER -->
      <div id="complaint-form-card" class="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <h1 class="text-2xl font-bold text-white serif-title mb-1">File a Complaint / Ticket</h1>
        <p class="text-xs text-slate-400 mb-6">Select your product and specify the issue.</p>

        <form onsubmit="handleComplaintSubmit(event)" class="space-y-5">
          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase mb-2">Product Type <span class="text-red-400">*</span></label>
            <select id="complaint-product" class="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none">
              <option>Debit Card</option>
              <option>Cheque Book</option>
              <option>Account Statement</option>
              <option>Interest Certificate</option>
              <option>Savings/Current Account</option>
              <option>Digital Banking</option>
              <option>UPI/NEFT Payments</option>
              <option>ATM Services</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase mb-2">Complaint Details <span class="text-red-400">*</span></label>
            <textarea id="complaint-details" rows="5" required
              placeholder="Please include specific details. Include your Account Number or Customer ID."
              class="w-full p-4 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
          </div>

          <div id="api-status-text" class="hidden text-xs text-blue-400 font-medium animate-pulse">Processing...</div>

          <div class="flex justify-between items-center pt-2">
            <button type="button" onclick="goToView('view-dashboard')" class="px-4 py-2.5 bg-slate-800 text-slate-300 rounded-xl text-xs">Cancel</button>
            <button id="submit-complaint-btn" type="submit" class="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl shadow-lg">
              File Complaint
            </button>
          </div>
        </form>
      </div>

      <!-- SUCCESS CONTAINER (HIDDEN INITIALLY) -->
      <div id="complaint-success-card" class="hidden bg-slate-900 border border-slate-800 rounded-2xl p-8 sm:p-10 shadow-2xl text-center space-y-6">
        <div class="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-3xl mx-auto font-bold">&check;</div>
        
        <div>
          <h2 class="text-2xl font-bold text-white serif-title">Your complaint has been received!</h2>
          <p class="text-slate-300 text-sm mt-2 max-w-md mx-auto">
            You will receive an email as soon as we process this complaint.
          </p>
        </div>

        <div class="bg-slate-800/80 border border-slate-700 rounded-xl p-5 max-w-md mx-auto text-left space-y-2">
          <div class="flex items-center justify-between text-xs text-slate-300">
            <span>Status:</span>
            <span class="text-emerald-400 font-semibold">Dispatched to Resolution Queue</span>
          </div>
          <div class="text-xs text-slate-400">
            A confirmation notice has been queued for your registered email.
          </div>
        </div>

        <button onclick="goToView('view-dashboard')" class="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl shadow-lg">
          Return to Dashboard
        </button>
      </div>
    </section>

  </main>

  <script>
    // GLOBAL STATE
    let currentUserEmail = localStorage.getItem('intellect_bank_user_email') || '';

    function goToView(viewId) {
      document.getElementById('view-login').classList.add('hidden');
      document.getElementById('view-dashboard').classList.add('hidden');
      document.getElementById('view-complaint').classList.add('hidden');
      document.getElementById(viewId).classList.remove('hidden');

      if (viewId === 'view-complaint') {
        document.getElementById('complaint-form-card').classList.remove('hidden');
        document.getElementById('complaint-success-card').classList.add('hidden');
      }
    }

    function handleLogin(e) {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      if (!email) return;

      currentUserEmail = email;
      localStorage.setItem('intellect_bank_user_email', email);

      updateUserUI();
      goToView('view-dashboard');
    }

    function updateUserUI() {
      const emailName = currentUserEmail.split('@')[0] || 'Client';
      document.getElementById('welcome-message').innerText = 'Welcome back, ' + emailName;
      document.getElementById('nav-user-email').innerText = currentUserEmail;
      document.getElementById('nav-user-bar').classList.remove('hidden');
    }

    function logout() {
      currentUserEmail = '';
      localStorage.removeItem('intellect_bank_user_email');
      document.getElementById('nav-user-bar').classList.add('hidden');
      goToView('view-login');
    }

    async function handleComplaintSubmit(e) {
      e.preventDefault();
      const product = document.getElementById('complaint-product').value;
      const details = document.getElementById('complaint-details').value.trim();
      const btn = document.getElementById('submit-complaint-btn');
      const statusText = document.getElementById('api-status-text');

      if (!details) return;

      btn.disabled = true;
      statusText.classList.remove('hidden');
      statusText.innerText = 'Authenticating with Intellect Access Token API...';

      let traceId = '';

      try {
        // Step 1: Auto-Token Generation
        const tokenRes = await fetch('https://api.in.intellectseecstag.com/accesstoken/pfpreview', {
          method: 'GET',
          headers: {
            'apikey': 'magicplatform.A8018652167E463eaD986C222F2A42D4',
            'username': 'shivanshpf_indstg',
            'password': 'Intellect@8012'
          }
        }).catch(err => null);

        let tokenData = tokenRes ? await tokenRes.json().catch(() => null) : null;
        let accessToken = tokenData ? (tokenData.access_token || tokenData.token) : null;

        statusText.innerText = 'Submitting complaint payload...';

        // Step 2: Submit Complaint POST
        if (accessToken) {
          await fetch('https://api.in.intellectseecstag.com/magicplatform/v1/invokeasset/308f7c96-ef89-4680-9789-6a4afc48b5c2/usecase', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': 'magicplatform.A8018652167E463eaD986C222F2A42D4',
              'Authorization': 'Bearer ' + accessToken,
              'x-platform-workspaceid': 'd7d4d536-de17-4354-819a-fff06ba78b23'
            },
            body: JSON.stringify({
              'From': currentUserEmail,
              'Subject': 'Urgent: ' + product + ' Dispute - Reg',
              'Email_Body': details
            })
          });
        }
      } catch (err) {
        console.warn(err);
      }

      // Step 3: Show Success Message (no reference number shown)
      document.getElementById('complaint-form-card').classList.add('hidden');
      document.getElementById('complaint-success-card').classList.remove('hidden');

      btn.disabled = false;
      statusText.classList.add('hidden');
    }

    // Auto-restore session if stored
    if (currentUserEmail) {
      updateUserUI();
      goToView('view-dashboard');
    } else {
      goToView('view-login');
    }
  </script>
</body>
</html>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(standaloneHtmlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([standaloneHtmlCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'intellect_bank_portal.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <FileCode2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-serif">
                Single Copy-Pasteable HTML Code
              </h3>
              <p className="text-xs text-slate-400">
                Fully self-contained single-file bundle with Tailwind CDN & Pure JavaScript
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Bar */}
        <div className="px-6 py-3 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Copy or download this file to run standalone in any browser.
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Code'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .html</span>
            </button>
          </div>
        </div>

        {/* Code View */}
        <div className="p-4 flex-1 overflow-auto bg-slate-950 font-mono text-xs text-slate-300">
          <pre className="p-4 bg-slate-900/80 rounded-xl border border-slate-800/80 overflow-x-auto select-all leading-relaxed">
            {standaloneHtmlCode}
          </pre>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
